// server/src/index.js
'use strict';

// == Imports ==
const path = require('path');
const fs = require('fs');
const util = require('util');
const uws = require('uWebSockets.js');

const Game = require('./game/Game');
const Loop = require('./utilities/Loop');
const Server = require('./network/Server');
const config = require('./config');
const { initModeration } = require('./moderation');
const { initCycleRestart, getCycleInfo } = require('./utils/cycleRestart');
const TierValidationMiddleware = require('./middleware/TierValidationMiddleware');
const Logger = require('./utils/Logger');

// == Constants & Helpers ==
const readFileAsync = util.promisify(fs.readFile); // reserved for future use

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Headers': 'content-type',
};
const setCors = (res) => {
  for (const [k, v] of Object.entries(CORS_HEADERS)) res.writeHeader(k, v);
};

// == uWebSockets App ==
const app = config.useSSL
  ? uws.SSLApp({
      key_file_name: path.resolve(config.sslData.key),
      cert_file_name: path.resolve(config.sslData.cert),
    })
  : uws.App();

let listenToken = null;

// == Bootstrap ==
app.listen('0.0.0.0', config.port, async (tok) => {
  if (!tok) {
    console.error('Port busy');
    process.exit(1);
  }
  listenToken = tok;

  await bootstrap();

  console.log(`Game started on port ${config.port}.`);
});

// == Core Bootstrap Logic ==
async function bootstrap() {
  // Validate critical configuration
  validateServerConfiguration();

  await initializeSolanaVaultService(); // sets global.solanaVaultService

  const game = new Game();
  const server = new Server(game);

  // Attach Solana vault service to game instance
  game.solanaVaultService = global.solanaVaultService;

  // Attach server reference to game instance for client broadcasting
  game.server = server;

  game.initialize();
  server.initialize(app);

  registerPublicRoutes(app, game);
  registerAdminRoutes(app, game);
  initModeration(game, app);

  startGameLoop(game, server);
  setupShutdownHandlers(game, server);

  // Initialize Solana game for race servers
  if (config.isRaceServer && config.solana.enabled) {
    await game.initializeSolanaGame();
  }

  /* == Periodic restart hook == */
  if (config.enableCycleRestart) {
    initCycleRestart(async () => {
      Logger.server.info(
        '[CycleRestart] Scheduled restart triggered - ending current game',
      );

      // Use unified Solana game end flow
      // This will: 1) Kick players 2) Finalize Solana game 3) Restart server for new game
      if (
        config.isRaceServer &&
        config.solana.enabled &&
        game.solanaVaultService
      ) {
        try {
          await game.endSolanaGame('cycle_restart');
        } catch (error) {
          Logger.server.error(
            'Cycle restart failed to end Solana game properly',
            {
              error: error.message,
            },
          );

          // If Solana game end fails, fallback to simple restart
          Logger.server.warn(
            'Falling back to simple restart without Solana operations',
          );
          game.pendingMassKill = true;
          await new Promise((r) => setTimeout(r, 3000));

          game.clearGameTimeout();
          Object.assign(game, {
            gamePhase: 'initializing',
            solanaGameId: null,
          });
          game.registeredPlayers.clear();
          game.finalKillRewards.clear();
          game.finalScores.clear();

          for (const client of server.clients.values()) {
            client.player = null;
            client.spectator.isSpectating = true;
            client.fullSync = true;
          }

          await game.initializeSolanaGame();
        }
      } else {
        // Non-Solana mode simple restart
        Logger.server.info('Non-Solana cycle restart');
        game.pendingMassKill = true;
        await new Promise((r) => setTimeout(r, 3000));

        for (const client of server.clients.values()) {
          client.player = null;
          client.spectator.isSpectating = true;
          client.fullSync = true;
        }
      }
    });
  }
}

// == Route Registration ==
function registerPublicRoutes(app, game) {
  // Ping
  app.options('/ping', setCors);
  app.get('/ping', (res) => {
    setCors(res);
    res.writeHeader('Content-Type', 'text/plain').end('pong');
  });

  // Server info
  app.get('/serverinfo', (res) => {
    setCors(res);
    res
      .writeHeader('Content-Type', 'application/json')
      .end(JSON.stringify(buildServerInfo(game)));
  });

  // Vault API endpoints for Solana integration
  if (config.isRaceServer && config.solana.enabled) {
    // Get vault info for a game
    app.options('/api/vault-info/*', setCors);
    app.get('/api/vault-info/:gameId', async (res, req) => {
      setCors(res);
      res.writeHeader('Content-Type', 'application/json');
      await handleVaultInfoRequest(res, req, game);
    });

    // Get player ticket info
    app.get('/api/vault-info/:gameId/:playerAddress', async (res, req) => {
      setCors(res);
      res.writeHeader('Content-Type', 'application/json');
      await handlePlayerTicketRequest(res, req, game);
    });

    // Buy ticket endpoint
    app.options('/api/buy-ticket', setCors);
    app.post('/api/buy-ticket', async (res, req) => {
      setCors(res);
      res.writeHeader('Content-Type', 'application/json');
      await handleBuyTicketRequest(res, req, game);
    });

    // Get current game token info endpoint
    app.get('/api/current-game-token', async (res, req) => {
      setCors(res);
      res.writeHeader('Content-Type', 'application/json');
      await handleCurrentGameTokenRequest(res, req, game);
    });
  }
}

function registerAdminRoutes(app, game) {
  if (!config.isRaceServer || !config.solana.enabled) return;

  // End game
  app.post('/admin/endgame', async (res) => {
    setCors(res);
    res.writeHeader('Content-Type', 'application/json');
    await handleEndGameRequest(res, game);
  });

  // Restart game
  app.post('/admin/restart', async (res, req) => {
    setCors(res);
    res.writeHeader('Content-Type', 'application/json');
    await handleRestartRequest(res, req, game);
  });

  // Get Solana service status
  app.get('/admin/solana-status', async (res) => {
    setCors(res);
    res.writeHeader('Content-Type', 'application/json');
    await handleSolanaStatusRequest(res, game);
  });
}

// == Game Loop ==
function startGameLoop(game, server) {
  const frameTime = 1000 / config.tickRate;
  const dt = frameTime / 1000;
  const loop = new Loop(frameTime, game);

  loop.setEventHandler(() => server.tick(dt));
  loop.onTpsUpdate = (tps) => {
    game.tps = tps;
    loop.entityCnt = game.entities.size;
  };

  loop.start();
}

// == Shutdown Handling ==
function setupShutdownHandlers(game, server) {
  const stop = async (reason) => {
    try {
      Logger.server.warn('Stopping game...', { reason });

      if (global.solanaVaultService && game.solanaGameId) {
        try {
          Logger.server.info('Ending Solana game before shutdown...');
          await game.endSolanaGame('server_shutdown');
        } catch (e) {
          Logger.server.error('Failed to end Solana game', {
            error: e.message,
          });
        }
      }

      if (listenToken) uws.us_listen_socket_close(listenToken);

      for (const client of server.clients.values()) {
        if (!client.player) continue;
        client.saveGame({
          coins: client.player.levels?.coins,
          kills: client.player.kills,
          playtime: client.player.playtime,
        });
      }
      Logger.status('All games saved. Bye.');
      process.exit(0);
    } catch (err) {
      Logger.server.critical('Error during shutdown', {
        error: err.message,
        stack: err.stack,
      });
      process.exit(1);
    }
  };

  process.on('SIGINT', () => stop('SIGINT'));
  process.on('SIGTERM', () => stop('SIGTERM'));
  process.on('uncaughtException', (e) => {
    Logger.server.critical('Uncaught Exception', {
      error: e.message,
      stack: e.stack,
    });
    stop('uncaughtException');
  });
  process.on('unhandledRejection', (r, p) => {
    Logger.server.critical('Unhandled Promise Rejection', {
      rejection: r,
      promise: p,
    });
    stop('unhandledRejection');
  });
}

// == Route Helpers ==
function buildServerInfo(game) {
  let gameStatus = null;
  if (config.isRaceServer && config.solana.enabled) {
    try {
      gameStatus = game.getSolanaGameStatus();
    } catch (e) {
      console.error('Error getting Solana game status:', e);
    }
  }

  const payload = {
    tps: game.tps,
    entityCnt: game.entities.size,
    playerCnt: game.players.size,
    realPlayers: [...game.players.values()].filter((p) => !p.isBot).length,

    serverType: config.serverType,
    isRaceServer: config.isRaceServer,
    solanaEnabled: config.solana.enabled,

    solanaConfig: config.solana.enabled
      ? {
          cluster: config.solana.environment.cluster,
          killReward: config.solana.killReward,
          programId: config.solana.programId,
        }
      : null,

    gameStatus,
    timestamp: Date.now(),
  };

  if (config.enableCycleRestart) {
    payload.cycleInfo = getCycleInfo();
  }

  return payload;
}

async function handleEndGameRequest(res, game) {
  try {
    const phase = game.gamePhase;
    const gameId = game.solanaGameId ? Number(game.solanaGameId) : null;

    console.log('🔍 Admin endgame request', { phase, gameId });

    if (phase === 'active' || phase === 'waiting') {
      game.endSolanaGame('admin_manual').catch(console.error);

      res.writeStatus('200 OK').end(
        JSON.stringify({
          success: true,
          message: 'Game end command sent',
          gameId,
          currentPhase: phase,
          note: 'Game ending process started asynchronously',
        }),
      );
    } else {
      res.writeStatus('400 Bad Request').end(
        JSON.stringify({
          success: false,
          error: `Cannot end game in phase: ${phase}`,
          gameId,
          suggestion: suggestForPhase(phase),
        }),
      );
    }
  } catch (err) {
    console.error('Admin endgame error:', err);
    res.writeStatus('500 Internal Server Error').end(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: err.message,
      }),
    );
  }
}

async function handleRestartRequest(res, req, game) {
  try {
    if (
      req.getHeader('authorization') !== `Bearer ${config.moderationSecret}`
    ) {
      res.writeStatus('401 Unauthorized').end(
        JSON.stringify({
          success: false,
          error: 'Unauthorized',
        }),
      );
      return;
    }

    game.clearGameTimeout();
    Object.assign(game, { gamePhase: 'initializing', solanaGameId: null });
    game.registeredPlayers.clear();
    game.finalKillRewards.clear();
    game.finalScores.clear();

    for (const player of game.players) {
      player.client?.socket?.send(
        JSON.stringify({
          type: 'gameRestart',
          message: 'Game is restarting. Please rejoin.',
        }),
      );
      player.client?.socket?.close();
    }

    setTimeout(async () => {
      try {
        await game.initializeSolanaGame();
      } catch (e) {
        console.error('Failed to restart Solana game:', e);
      }
    }, 2000);

    res.writeStatus('200 OK').end(
      JSON.stringify({
        success: true,
        message: 'Game restarted successfully',
      }),
    );
  } catch (err) {
    console.error('Admin restart error:', err);
    res.writeStatus('500 Internal Server Error').end(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
      }),
    );
  }
}

// Solana service status handler
async function handleSolanaStatusRequest(res, game) {
  try {
    if (!game.solanaVaultService) {
      res.writeStatus('400 Bad Request').end(
        JSON.stringify({
          success: false,
          error: 'Solana vault service not available',
        }),
      );
      return;
    }

    const status = game.solanaVaultService.getStatus();
    const isConnected = await game.solanaVaultService.isConnected();

    res.end(
      JSON.stringify({
        success: true,
        connected: isConnected,
        solanaStatus: status,
      }),
    );
  } catch (error) {
    console.error('Error in Solana status request:', error);
    res.writeStatus('500 Internal Server Error').end(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
      }),
    );
  }
}

// Vault info handler with dynamic token information
async function handleVaultInfoRequest(res, req, game) {
  try {
    const gameId = parseInt(req.getParameter(0));

    if (!game.solanaVaultService) {
      res.writeStatus('400 Bad Request').end(
        JSON.stringify({
          success: false,
          error: 'Solana vault service not available',
        }),
      );
      return;
    }

    // Get comprehensive game info including token details
    const gameInfo = await game.solanaVaultService.vaultSDK.getGameInfo(gameId);

    res.end(
      JSON.stringify({
        success: true,
        gameId: gameId,
        vault: gameInfo.vault,
        tokenMint: gameInfo.tokenMint.toString(),
        tokenInfo: {
          address: gameInfo.tokenMint.toString(),
          isSOL:
            gameInfo.tokenMint.toString() ===
            'So11111111111111111111111111111112',
          isUSDC:
            gameInfo.tokenMint.toString() ===
            'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr',
        },
        gameStatus: {
          isActive: gameInfo.isActive,
          canBuyTickets: gameInfo.canBuyTickets,
          finalized: gameInfo.vault.finalized,
          withdrawEnabled: gameInfo.vault.withdrawEnabled,
        },
        dynamicTokenRetrieval: true,
      }),
    );
  } catch (error) {
    console.error('Error in vault info request:', error);
    res.writeStatus('500 Internal Server Error').end(
      JSON.stringify({
        success: false,
        error: 'Failed to get vault info',
        details: error.message,
      }),
    );
  }
}

// Player ticket handler
async function handlePlayerTicketRequest(res, req, game) {
  try {
    const gameId = parseInt(req.getParameter(0));
    const playerAddress = req.getParameter(1);

    if (!game.solanaVaultService) {
      res.writeStatus('400 Bad Request').end(
        JSON.stringify({
          success: false,
          error: 'Solana vault service not available',
        }),
      );
      return;
    }

    const { PublicKey } = require('@solana/web3.js');
    const playerPubkey = new PublicKey(playerAddress);
    const ticket = await game.solanaVaultService.getUserTicketAccount(
      gameId,
      playerPubkey,
    );

    res.end(
      JSON.stringify({
        success: true,
        ticket: ticket,
        hasTicket: !!ticket,
      }),
    );
  } catch (error) {
    console.error('Error in player ticket request:', error);
    res.writeStatus('500 Internal Server Error').end(
      JSON.stringify({
        success: false,
        error: 'Failed to get player ticket',
      }),
    );
  }
}

// Buy ticket handler
async function handleBuyTicketRequest(res, req, game) {
  try {
    if (!game.solanaVaultService) {
      res.writeStatus('400 Bad Request').end(
        JSON.stringify({
          success: false,
          error: 'Solana vault service not available',
        }),
      );
      return;
    }

    // Read request body
    let body = '';
    res.onData((chunk, isLast) => {
      body += Buffer.from(chunk).toString();
      if (isLast) {
        try {
          const data = JSON.parse(body);
          processBuyTicketRequest(res, game, data);
        } catch (parseError) {
          res.writeStatus('400 Bad Request').end(
            JSON.stringify({
              success: false,
              error: 'Invalid JSON',
            }),
          );
        }
      }
    });

    res.onAborted(() => {
      console.log('Buy ticket request aborted');
    });
  } catch (error) {
    console.error('Error in buy ticket request:', error);
    res.writeStatus('500 Internal Server Error').end(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
      }),
    );
  }
}

// Process buy ticket request with security validation
async function processBuyTicketRequest(res, game, data) {
  try {
    const {
      gameId,
      amount,
      walletAddress,
      tier = 'low',
      playerLevel = 1,
    } = data;

    // Basic input validation
    if (!gameId || !amount || !walletAddress) {
      res.writeStatus('400 Bad Request').end(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: gameId, amount, walletAddress',
        }),
      );
      return;
    }

    // Security validation using TierValidationMiddleware
    const rateLimit = TierValidationMiddleware.checkRateLimit(walletAddress);
    if (!rateLimit.isAllowed) {
      res.writeStatus('429 Too Many Requests').end(
        JSON.stringify({
          success: false,
          error: rateLimit.error,
        }),
      );
      return;
    }

    const validation = TierValidationMiddleware.validateTicketPurchase({
      tier,
      amount,
      gameId,
      playerAddress: walletAddress,
      playerLevel,
    });

    if (!validation.isValid) {
      TierValidationMiddleware.logSecurityEvent('INVALID_TICKET_PURCHASE', {
        walletAddress,
        gameId,
        tier,
        amount,
        error: validation.error,
      });

      res.writeStatus('400 Bad Request').end(
        JSON.stringify({
          success: false,
          error: validation.error,
        }),
      );
      return;
    }

    // Additional server-side verification
    if (
      !game.solanaGameId ||
      game.solanaGameId.toString() !== gameId.toString()
    ) {
      res.writeStatus('400 Bad Request').end(
        JSON.stringify({
          success: false,
          error: `Invalid game ID. Current active game: ${game.solanaGameId || 'none'}`,
        }),
      );
      return;
    }

    const { PublicKey } = require('@solana/web3.js');
    const { getAssociatedTokenAddress } = require('@solana/spl-token');

    // Get user's token account by fetching token mint from on-chain vault
    const userPubkey = new PublicKey(walletAddress);

    // 🚀 Dynamic token retrieval from on-chain vault account
    let tokenMint;
    try {
      const vaultAccount =
        await game.solanaVaultService.vaultSDK.getVaultAccount(
          parseInt(gameId),
        );
      tokenMint = vaultAccount.tokenMint;

      Logger.server.info('Token mint retrieved from on-chain vault', {
        gameId,
        tokenMint: tokenMint.toString(),
        dynamicRetrieval: true,
      });
    } catch (error) {
      // Fallback to server configuration if vault not found
      Logger.server.warn(
        'Failed to get token mint from vault, using server config',
        {
          gameId,
          error: error.message,
        },
      );
      tokenMint = new PublicKey(config.solana.tokenMint);
    }

    const userTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      userPubkey,
    );

    // Get expected amount for tier validation
    const expectedAmount = Math.floor(
      validation.tierConfig.entranceFee * 1e9,
    ).toString();

    // Call VaultSDK to buy ticket with tier validation
    const txHash = await game.solanaVaultService.vaultSDK.buyTicket({
      gameId: parseInt(gameId),
      amount,
      userTokenAccount,
      tier,
      expectedAmount,
    });

    Logger.server.info('Secure ticket purchase completed', {
      walletAddress,
      gameId,
      tier,
      amount,
      expectedAmount,
      txHash,
    });

    console.log(
      `✅ Secure ticket purchased for ${walletAddress} in game ${gameId} (tier: ${tier}) - TX: ${txHash}`,
    );

    res.end(
      JSON.stringify({
        success: true,
        txHash: txHash,
        gameId: gameId,
        tier: tier,
        amount: amount,
        expectedAmount: expectedAmount,
        walletAddress: walletAddress,
        tierConfig: validation.tierConfig,
      }),
    );
  } catch (error) {
    console.error('Error processing buy ticket request:', error);

    TierValidationMiddleware.logSecurityEvent('TICKET_PURCHASE_ERROR', {
      walletAddress: data?.walletAddress,
      gameId: data?.gameId,
      tier: data?.tier,
      error: error.message,
    });

    res.writeStatus('500 Internal Server Error').end(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to buy ticket',
      }),
    );
  }
}

// Current game token info handler
async function handleCurrentGameTokenRequest(res, req, game) {
  try {
    if (!game.solanaVaultService) {
      res.writeStatus('400 Bad Request').end(
        JSON.stringify({
          success: false,
          error: 'Solana vault service not available',
        }),
      );
      return;
    }

    if (!game.solanaGameId) {
      res.writeStatus('404 Not Found').end(
        JSON.stringify({
          success: false,
          error: 'No active game found',
        }),
      );
      return;
    }

    try {
      // Use our new convenient methods for getting comprehensive token info
      const tokenInfo = await game.getCurrentGameTokenInfo();

      if (tokenInfo) {
        // Success - got token info using new methods
        res.end(
          JSON.stringify({
            success: true,
            currentGameId: game.solanaGameId,
            tokenMint: tokenInfo.tokenMint,
            tokenInfo: {
              address: tokenInfo.tokenMint,
              isSOL:
                tokenInfo.tokenMint === 'So11111111111111111111111111111112',
              isUSDC:
                tokenInfo.tokenMint ===
                'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr',
              isWSol:
                tokenInfo.tokenMint === 'So11111111111111111111111111111112',
            },
            gameStatus: {
              isActive: tokenInfo.isActive,
              canBuyTickets: tokenInfo.canBuyTickets,
              tier: game.gameTier || 'low',
            },
            retrievalMethod: 'on-chain-dynamic-enhanced',
            retrievedAt: tokenInfo.retrievedAt,
            serverFallback: config.solana.tokenMint,
          }),
        );
      } else {
        throw new Error('Failed to get token info using enhanced methods');
      }
    } catch (error) {
      // Fallback to direct VaultSDK methods if our enhanced methods fail
      Logger.server.warn(
        'Enhanced token methods failed, trying direct VaultSDK',
        {
          gameId: game.solanaGameId,
          error: error.message,
        },
      );

      try {
        // Fallback to direct VaultSDK calls
        const tokenMint =
          await game.solanaVaultService.vaultSDK.getGameTokenMint(
            parseInt(game.solanaGameId),
          );
        const gameInfo = await game.solanaVaultService.vaultSDK.getGameInfo(
          parseInt(game.solanaGameId),
        );

        res.end(
          JSON.stringify({
            success: true,
            currentGameId: game.solanaGameId,
            tokenMint: tokenMint.toString(),
            tokenInfo: {
              address: tokenMint.toString(),
              isSOL:
                tokenMint.toString() === 'So11111111111111111111111111111112',
              isUSDC:
                tokenMint.toString() ===
                'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr',
              isWSol:
                tokenMint.toString() === 'So11111111111111111111111111111112',
            },
            gameStatus: {
              isActive: gameInfo.isActive,
              canBuyTickets: gameInfo.canBuyTickets,
              tier: game.gameTier || 'low',
            },
            retrievalMethod: 'on-chain-dynamic-direct',
            serverFallback: config.solana.tokenMint,
          }),
        );
      } catch (directError) {
        // Final fallback to server configuration
        Logger.server.warn('All on-chain methods failed, using server config', {
          gameId: game.solanaGameId,
          enhancedError: error.message,
          directError: directError.message,
        });

        res.end(
          JSON.stringify({
            success: true,
            currentGameId: game.solanaGameId,
            tokenMint: config.solana.tokenMint,
            tokenInfo: {
              address: config.solana.tokenMint,
              isSOL:
                config.solana.tokenMint ===
                'So11111111111111111111111111111112',
              isUSDC:
                config.solana.tokenMint ===
                'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr',
              isWSol:
                config.solana.tokenMint ===
                'So11111111111111111111111111111112',
            },
            gameStatus: {
              tier: game.gameTier || 'low',
            },
            retrievalMethod: 'server-config-fallback',
            enhancedError: error.message,
            directError: directError.message,
          }),
        );
      }
    }
  } catch (error) {
    console.error('Error in current game token request:', error);
    res.writeStatus('500 Internal Server Error').end(
      JSON.stringify({
        success: false,
        error: 'Failed to get current game token info',
        details: error.message,
      }),
    );
  }
}

function suggestForPhase(phase) {
  switch (phase) {
    case 'ended':
      return 'Game has already ended.';
    case 'ending':
      return 'Game is currently ending.';
    case 'initializing':
      return 'Game is still initializing.';
    case 'error':
      return 'Game is in error state.';
    default:
      return `Unknown phase: ${phase}`;
  }
}

// == Solana Vault Service ==
async function initializeSolanaVaultService() {
  if (!config.isRaceServer || !config.solana.enabled) {
    Logger.server.warn('Solana vault service disabled');
    return null;
  }

  try {
    Logger.server.info('Initializing Solana vault service...');

    const SolanaVaultService = require('./blockchain/SolanaVaultService');
    const svc = new SolanaVaultService(config.solana);

    await svc.initialize();

    if (!(await svc.isConnected()))
      throw new Error('Failed to connect to Solana');
    Logger.status('Solana connection verified');

    if (!config.solana.programId) throw new Error('Vault program ID missing');

    Logger.status('Solana config verified');

    global.solanaVaultService = svc;
    Logger.status('Solana vault service ready');
    return svc;
  } catch (err) {
    Logger.server.error('Solana vault init failed', { error: err.message });
    return null;
  }
}

// == Configuration Validation ==
function validateServerConfiguration() {
  const issues = [];

  // Check critical environment variables
  if (!config.serverSecret || config.serverSecret === 'server-secret') {
    issues.push('SERVER_SECRET not properly configured (using default value)');
  }

  if (!config.apiEndpoint) {
    issues.push('API_ENDPOINT not configured');
  }

  if (config.isRaceServer && config.solana.enabled) {
    if (!config.solana.privateKey) {
      issues.push('SOLANA_PRIVATE_KEY not configured for race server');
    }
    if (!config.solana.programId) {
      issues.push('VAULT_PROGRAM_ID not configured for race server');
    }
  }

  // Log configuration status
  console.log('🔧 Server Configuration Check:');
  console.log(`   SERVER_SECRET: ${config.serverSecret ? 'SET' : 'NOT_SET'}`);
  console.log(`   API_ENDPOINT: ${config.apiEndpoint || 'NOT_SET'}`);
  console.log(`   RACE_SERVER: ${config.isRaceServer ? 'YES' : 'NO'}`);
  console.log(`   SOLANA_ENABLED: ${config.solana?.enabled ? 'YES' : 'NO'}`);

  if (issues.length > 0) {
    console.warn('⚠️ Configuration Issues Found:');
    issues.forEach((issue) => console.warn(`   - ${issue}`));

    if (config.isRaceServer && config.solana.enabled) {
      console.error(
        '❌ Critical configuration issues detected for race server',
      );
      console.error('   Please fix these issues before starting the server');
    } else {
      console.warn(
        '⚠️ Some configuration issues detected but server can continue',
      );
    }
  } else {
    console.log('✅ Configuration validation passed');
  }
}

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
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Accept, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400', // 24 hours
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

  console.log(`Game server listening on port ${config.port}...`);

  // Start bootstrap in background - don't wait for it
  bootstrap().catch((error) => {
    console.error('Bootstrap failed:', error.message);
    console.log('Server will continue running with limited functionality');
  });
});

// == Core Bootstrap Logic ==
async function bootstrap() {
  // Validate critical configuration
  validateServerConfiguration();

  // Try to initialize Solana service, but don't fail if it doesn't work
  try {
    await initializeSolanaVaultService(); // sets global.solanaVaultService
  } catch (error) {
    console.warn(
      '⚠️ Solana service initialization failed, continuing without Web3 features:',
      error.message,
    );
    global.solanaVaultService = null;
  }

  const game = new Game();
  const server = new Server(game);

  // Make game instance globally accessible
  global.currentGame = game;

  // Attach Solana vault service to game instance (might be null if init failed)
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

  // Initialize Solana game for race servers (only if service is available)
  if (
    config.isRaceServer &&
    config.solana.enabled &&
    global.solanaVaultService
  ) {
    try {
      await game.initializeSolanaGame();
    } catch (error) {
      console.warn('⚠️ Solana game initialization failed:', error.message);
    }
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
  app.options('/ping', (res) => {
    res.onAborted(() => {
      console.warn('Ping OPTIONS request aborted by client');
    });
    setCors(res);
    res.end();
  });
  app.get('/ping', (res) => {
    let hasResponded = false;

    // Register abort handler FIRST
    res.onAborted(() => {
      hasResponded = true;
      console.warn('Ping request aborted by client');
    });

    // 超时保护
    const timeout = setTimeout(() => {
      if (!hasResponded) {
        hasResponded = true;
        console.error('Ping request timeout - forcing response');
        try {
          res.writeStatus('500 Internal Server Error').end('timeout');
        } catch (e) {
          console.error('Failed to send timeout response:', e);
        }
      }
    }, 5000); // 5秒超时

    try {
      setCors(res);

      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        res.writeHeader('Content-Type', 'text/plain').end('pong');
      }
    } catch (error) {
      console.error('Error in ping request:', error);
      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        try {
          res.writeStatus('500 Internal Server Error').end('error');
        } catch (resError) {
          console.error('Failed to send error response:', resError);
        }
      }
    }
  });

  // Server info - Fixed CORS support
  app.options('/serverinfo', (res) => {
    res.onAborted(() => {
      console.warn('Serverinfo OPTIONS request aborted by client');
    });
    setCors(res);
    res.end();
  });
  app.get('/serverinfo', (res) => {
    let hasResponded = false;

    // Register abort handler FIRST
    res.onAborted(() => {
      hasResponded = true;
      console.warn('Serverinfo request aborted by client');
    });

    // 超时保护
    const timeout = setTimeout(() => {
      if (!hasResponded) {
        hasResponded = true;
        console.error('Serverinfo request timeout - forcing response');
        try {
          res.writeStatus('500 Internal Server Error').end(
            JSON.stringify({
              error: 'Request timeout',
            }),
          );
        } catch (e) {
          console.error('Failed to send timeout response:', e);
        }
      }
    }, 5000); // 5秒超时

    try {
      setCors(res);

      const serverInfo = buildServerInfo(game);

      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        res
          .writeHeader('Content-Type', 'application/json')
          .end(JSON.stringify(serverInfo));
      }
    } catch (error) {
      console.error('Error in serverinfo request:', error);
      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        try {
          res.writeStatus('500 Internal Server Error').end(
            JSON.stringify({
              error: 'Internal server error',
              details: error.message,
            }),
          );
        } catch (resError) {
          console.error('Failed to send error response:', resError);
        }
      }
    }
  });

  // Vault API endpoints for Solana integration
  if (config.isRaceServer && config.solana.enabled) {
    // Get vault info for a game
    app.options('/api/vault-info/*', (res) => {
      res.onAborted(() => {
        console.warn('Vault-info OPTIONS request aborted by client');
      });
      setCors(res);
      res.end();
    });
    app.get('/api/vault-info/:gameId', async (res, req) => {
      // Register abort handler FIRST
      res.onAborted(() => {
        console.warn('Vault-info request aborted by client');
      });

      setCors(res);
      res.writeHeader('Content-Type', 'application/json');

      try {
        await handleVaultInfoRequest(res, req, game);
      } catch (error) {
        console.error('Error in vault-info endpoint:', error);
        try {
          res.writeStatus('500 Internal Server Error').end(
            JSON.stringify({
              success: false,
              error: 'Internal server error',
              details: error.message,
            }),
          );
        } catch (resError) {
          console.error('Failed to send error response:', resError);
        }
      }
    });

    // Get player ticket info - Fixed async error handling
    app.get('/api/vault-info/:gameId/:playerAddress', async (res, req) => {
      // Register abort handler FIRST
      res.onAborted(() => {
        console.warn('Player ticket info request aborted by client');
      });

      setCors(res);
      res.writeHeader('Content-Type', 'application/json');

      try {
        await handlePlayerTicketRequest(res, req, game);
      } catch (error) {
        console.error('Error in vault-info player ticket endpoint:', error);
        try {
          res.writeStatus('500 Internal Server Error').end(
            JSON.stringify({
              success: false,
              error: 'Internal server error',
              details: error.message,
            }),
          );
        } catch (resError) {
          console.error('Failed to send error response:', resError);
        }
      }
    });

    // Legacy buy ticket endpoint - Fixed async error handling
    app.options('/api/buy-ticket', (res) => {
      res.onAborted(() => {
        console.warn('Buy-ticket OPTIONS request aborted by client');
      });
      setCors(res);
      res.end();
    });
    app.post('/api/buy-ticket', async (res, req) => {
      // Register abort handler FIRST
      res.onAborted(() => {
        console.warn('Buy ticket request aborted by client');
      });

      setCors(res);
      res.writeHeader('Content-Type', 'application/json');

      try {
        await handleBuyTicketRequest(res, req, game);
      } catch (error) {
        console.error('Error in buy-ticket endpoint:', error);
        try {
          res.writeStatus('500 Internal Server Error').end(
            JSON.stringify({
              success: false,
              error: 'Internal server error',
              details: error.message,
            }),
          );
        } catch (resError) {
          console.error('Failed to send error response:', resError);
        }
      }
    });

    // 🔒 Secure frontend transaction building endpoint
    app.options('/api/build-buy-ticket-transaction', (res) => {
      res.onAborted(() => {
        console.warn(
          'Build-buy-ticket-transaction OPTIONS request aborted by client',
        );
      });
      setCors(res);
      res.end();
    });
    app.post('/api/build-buy-ticket-transaction', async (res, req) => {
      // Register abort handler FIRST
      res.onAborted(() => {
        console.warn('Build buy ticket transaction request aborted by client');
      });

      setCors(res);
      res.writeHeader('Content-Type', 'application/json');

      try {
        await handleBuildBuyTicketTransactionRequest(res, req, game);
      } catch (error) {
        console.error('Error in build-buy-ticket-transaction endpoint:', error);
        try {
          res.writeStatus('500 Internal Server Error').end(
            JSON.stringify({
              success: false,
              error: 'Internal server error',
              details: error.message,
            }),
          );
        } catch (resError) {
          console.error('Failed to send error response:', resError);
        }
      }
    });

    // 🔍 Secure frontend transaction verification endpoint
    app.options('/api/verify-buy-ticket-transaction', (res) => {
      res.onAborted(() => {
        console.warn(
          'Verify-buy-ticket-transaction OPTIONS request aborted by client',
        );
      });
      setCors(res);
      res.end();
    });
    app.post('/api/verify-buy-ticket-transaction', async (res, req) => {
      // Register abort handler FIRST
      res.onAborted(() => {
        console.warn('Verify buy ticket transaction request aborted by client');
      });

      setCors(res);
      res.writeHeader('Content-Type', 'application/json');

      try {
        await handleVerifyBuyTicketTransactionRequest(res, req, game);
      } catch (error) {
        console.error(
          'Error in verify-buy-ticket-transaction endpoint:',
          error,
        );
        try {
          res.writeStatus('500 Internal Server Error').end(
            JSON.stringify({
              success: false,
              error: 'Internal server error',
              details: error.message,
            }),
          );
        } catch (resError) {
          console.error('Failed to send error response:', resError);
        }
      }
    });

    // Clear rate limit endpoint (for testing/debugging)
    app.options('/api/clear-rate-limit', (res) => {
      res.onAborted(() => {
        console.warn('Clear-rate-limit OPTIONS request aborted by client');
      });
      setCors(res);
      res.end();
    });
    app.post('/api/clear-rate-limit', async (res, req) => {
      res.onAborted(() => {
        console.warn('Clear rate limit request aborted by client');
      });

      setCors(res);
      res.writeHeader('Content-Type', 'application/json');

      let body = Buffer.alloc(0);
      res.onData((chunk, isLast) => {
        body = Buffer.concat([body, Buffer.from(chunk)]);
        if (isLast) {
          try {
            const data = JSON.parse(body.toString());
            const { walletAddress } = data;

            if (!walletAddress) {
              res.writeStatus('400 Bad Request').end(
                JSON.stringify({
                  success: false,
                  error: 'Missing walletAddress',
                }),
              );
              return;
            }

            const success =
              TierValidationMiddleware.clearRateLimit(walletAddress);
            res.writeStatus('200 OK').end(
              JSON.stringify({
                success: true,
                message: `Rate limit cleared for ${walletAddress}`,
                cleared: success,
              }),
            );
          } catch (error) {
            res.writeStatus('400 Bad Request').end(
              JSON.stringify({
                success: false,
                error: 'Invalid JSON',
              }),
            );
          }
        }
      });
    });

    // Player joined notification endpoint - Fixed async error handling
    app.options('/api/player-joined', (res) => {
      res.onAborted(() => {
        console.warn('Player-joined OPTIONS request aborted by client');
      });
      setCors(res);
      res.end();
    });
    app.post('/api/player-joined', async (res, req) => {
      // Register abort handler FIRST
      res.onAborted(() => {
        console.warn('Player joined request aborted by client');
      });

      setCors(res);
      res.writeHeader('Content-Type', 'application/json');

      try {
        await handlePlayerJoinedRequest(res, req, game);
      } catch (error) {
        console.error('Error in player-joined endpoint:', error);
        try {
          res.writeStatus('500 Internal Server Error').end(
            JSON.stringify({
              success: false,
              error: 'Internal server error',
              details: error.message,
            }),
          );
        } catch (resError) {
          console.error('Failed to send error response:', resError);
        }
      }
    });

    // Get player reward status from Solana chain - New endpoint
    app.get(
      '/api/solana/player-reward-status/:gameId/:playerAddress',
      async (res, req) => {
        // Register abort handler FIRST
        res.onAborted(() => {
          console.warn('Player reward status request aborted by client');
        });

        setCors(res);
        let hasResponded = false;

        // Set timeout
        const timeout = setTimeout(() => {
          if (!hasResponded) {
            hasResponded = true;
            res.writeStatus('408 Request Timeout').end(
              JSON.stringify({
                success: false,
                error: 'Request timeout',
              }),
            );
          }
        }, 10000);

        try {
          const gameId = parseInt(req.getParameter(0));
          const playerAddress = req.getParameter(1);

          if (!game.solanaVaultService) {
            if (!hasResponded) {
              hasResponded = true;
              clearTimeout(timeout);
              res.writeStatus('400 Bad Request').end(
                JSON.stringify({
                  success: false,
                  error: 'Solana vault service not available',
                }),
              );
            }
            return;
          }

          const { PublicKey } = require('@solana/web3.js');
          const playerPubkey = new PublicKey(playerAddress);

          console.log(
            `🔍 Checking reward status for player ${playerAddress} in game ${gameId}`,
          );

          // 1. Check if player has a reward in the reward map
          const rewardMapAccount =
            await game.solanaVaultService.vaultSDK.getRewardMapAccount(gameId);
          let hasReward = false;
          let rewardAmount = '0';

          if (rewardMapAccount) {
            const playerReward = rewardMapAccount.rewards.find(
              (reward) => reward.user.toString() === playerAddress,
            );
            if (playerReward) {
              hasReward = true;
              rewardAmount = (parseInt(playerReward.amount) / 1e9).toFixed(6); // Convert lamports to SOL
            }
          }

          // 2. Check if player has already claimed (via user ticket)
          let hasClaimed = false;
          const userTicketAccount =
            await game.solanaVaultService.vaultSDK.getUserTicketAccount(
              gameId,
              playerPubkey,
            );

          if (userTicketAccount) {
            hasClaimed = userTicketAccount.hasWithdrawn;
          }

          // 3. Determine claimable status
          const claimable = hasReward && !hasClaimed;

          if (!hasResponded) {
            hasResponded = true;
            clearTimeout(timeout);
            res.end(
              JSON.stringify({
                success: true,
                data: {
                  gameId,
                  playerAddress,
                  hasReward,
                  claimed: hasClaimed,
                  claimable,
                  rewardAmount,
                  timestamp: Date.now(),
                },
              }),
            );
          }
        } catch (error) {
          console.error(
            `❌ Failed to get player reward status:`,
            error.message,
          );
          if (!hasResponded) {
            hasResponded = true;
            clearTimeout(timeout);
            res.writeStatus('500 Internal Server Error').end(
              JSON.stringify({
                success: false,
                error: error.message,
              }),
            );
          }
        }
      },
    );

    // Get current game token info endpoint - Fixed async error handling
    app.get('/api/current-game-token', async (res, req) => {
      // Register abort handler FIRST
      res.onAborted(() => {
        console.warn('Current game token request aborted by client');
      });

      setCors(res);
      res.writeHeader('Content-Type', 'application/json');

      try {
        await handleCurrentGameTokenRequest(res, req, game);
      } catch (error) {
        console.error('Error in current-game-token endpoint:', error);
        try {
          res.writeStatus('500 Internal Server Error').end(
            JSON.stringify({
              success: false,
              error: 'Internal server error',
              details: error.message,
            }),
          );
        } catch (resError) {
          console.error('Failed to send error response:', resError);
        }
      }
    });
  }
}

function registerAdminRoutes(app, game) {
  if (!config.isRaceServer || !config.solana.enabled) return;

  // End game - Fixed async error handling
  app.post('/admin/endgame', async (res) => {
    // Register abort handler FIRST
    res.onAborted(() => {
      console.warn('Admin endgame request aborted by client');
    });

    setCors(res);
    res.writeHeader('Content-Type', 'application/json');

    try {
      await handleEndGameRequest(res, game);
    } catch (error) {
      console.error('Error in admin endgame endpoint:', error);
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error: 'Internal server error',
            details: error.message,
          }),
        );
      } catch (resError) {
        console.error('Failed to send error response:', resError);
      }
    }
  });

  // Restart game - Fixed async error handling
  app.post('/admin/restart', async (res, req) => {
    // Register abort handler FIRST
    res.onAborted(() => {
      console.warn('Admin restart request aborted by client');
    });

    setCors(res);
    res.writeHeader('Content-Type', 'application/json');

    try {
      await handleRestartRequest(res, req, game);
    } catch (error) {
      console.error('Error in admin restart endpoint:', error);
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error: 'Internal server error',
            details: error.message,
          }),
        );
      } catch (resError) {
        console.error('Failed to send error response:', resError);
      }
    }
  });

  // Get Solana service status - Fixed async error handling
  app.get('/admin/solana-status', async (res) => {
    // Register abort handler FIRST
    res.onAborted(() => {
      console.warn('Admin solana-status request aborted by client');
    });

    setCors(res);
    res.writeHeader('Content-Type', 'application/json');

    try {
      await handleSolanaStatusRequest(res, game);
    } catch (error) {
      console.error('Error in admin solana-status endpoint:', error);
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error: 'Internal server error',
            details: error.message,
          }),
        );
      } catch (resError) {
        console.error('Failed to send error response:', resError);
      }
    }
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

  // Provide default game status if Solana is not available
  if (!gameStatus && config.isRaceServer) {
    gameStatus = {
      gameId: null,
      phase: 'initializing',
      tokenMint: 'So11111111111111111111111111111111111111112', // Default SOL mint
      entranceFee: config.solana?.tiers?.low?.entranceFee || 0.01,
      status: 'no_solana_service',
    };
  }

  // Safe property access with fallbacks
  const payload = {
    tps: game?.tps || 0,
    entityCnt: game?.entities?.size || 0,
    playerCnt: game?.players?.size || 0,
    realPlayers: (() => {
      try {
        if (!game?.players) return 0;
        return [...game.players.values()].filter((p) => !p.isBot).length;
      } catch (e) {
        console.error('Error calculating real players:', e);
        return 0;
      }
    })(),

    serverType: config.serverType,
    isRaceServer: config.isRaceServer,
    solanaEnabled: config.solana.enabled,
    blockchainEnabled: config.solana.enabled,

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
    try {
      payload.cycleInfo = getCycleInfo();
    } catch (e) {
      console.error('Error getting cycle info:', e);
      payload.cycleInfo = null;
    }
  }

  return payload;
}

async function handleEndGameRequest(res, game) {
  let hasResponded = false;

  // 超时保护
  const timeout = setTimeout(() => {
    if (!hasResponded) {
      hasResponded = true;
      console.error('End game request timeout - forcing response');
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error: 'Request timeout',
          }),
        );
      } catch (e) {
        console.error('Failed to send timeout response:', e);
      }
    }
  }, 10000); // 10秒超时

  try {
    const phase = game.gamePhase;
    const gameId = game.solanaGameId ? Number(game.solanaGameId) : null;

    console.log('🔍 Admin endgame request', { phase, gameId });

    if (phase === 'active' || phase === 'waiting') {
      game.endSolanaGame('admin_manual').catch(console.error);

      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        res.writeStatus('200 OK').end(
          JSON.stringify({
            success: true,
            message: 'Game end command sent',
            gameId,
            currentPhase: phase,
            note: 'Game ending process started asynchronously',
          }),
        );
      }
    } else {
      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        res.writeStatus('400 Bad Request').end(
          JSON.stringify({
            success: false,
            error: `Cannot end game in phase: ${phase}`,
            gameId,
            suggestion: suggestForPhase(phase),
          }),
        );
      }
    }
  } catch (err) {
    console.error('Admin endgame error:', err);
    if (!hasResponded) {
      hasResponded = true;
      clearTimeout(timeout);
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error: 'Internal server error',
            details: err.message,
          }),
        );
      } catch (resError) {
        console.error('Failed to send error response:', resError);
      }
    }
  }
}

async function handleRestartRequest(res, req, game) {
  let hasResponded = false;

  // 超时保护
  const timeout = setTimeout(() => {
    if (!hasResponded) {
      hasResponded = true;
      console.error('Restart request timeout - forcing response');
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error: 'Request timeout',
          }),
        );
      } catch (e) {
        console.error('Failed to send timeout response:', e);
      }
    }
  }, 10000); // 10秒超时

  try {
    if (
      req.getHeader('authorization') !== `Bearer ${config.moderationSecret}`
    ) {
      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        res.writeStatus('401 Unauthorized').end(
          JSON.stringify({
            success: false,
            error: 'Unauthorized',
          }),
        );
      }
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

    if (!hasResponded) {
      hasResponded = true;
      clearTimeout(timeout);
      res.writeStatus('200 OK').end(
        JSON.stringify({
          success: true,
          message: 'Game restarted successfully',
        }),
      );
    }
  } catch (err) {
    console.error('Admin restart error:', err);
    if (!hasResponded) {
      hasResponded = true;
      clearTimeout(timeout);
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error: 'Internal server error',
          }),
        );
      } catch (resError) {
        console.error('Failed to send error response:', resError);
      }
    }
  }
}

// Solana service status handler
async function handleSolanaStatusRequest(res, game) {
  let hasResponded = false;

  // 超时保护
  const timeout = setTimeout(() => {
    if (!hasResponded) {
      hasResponded = true;
      console.error('Solana status request timeout - forcing response');
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error: 'Request timeout',
          }),
        );
      } catch (e) {
        console.error('Failed to send timeout response:', e);
      }
    }
  }, 10000); // 10秒超时

  try {
    if (!game.solanaVaultService) {
      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        res.writeStatus('400 Bad Request').end(
          JSON.stringify({
            success: false,
            error: 'Solana vault service not available',
          }),
        );
      }
      return;
    }

    const status = game.solanaVaultService.getStatus();
    const isConnected = await game.solanaVaultService.isConnected();

    if (!hasResponded) {
      hasResponded = true;
      clearTimeout(timeout);
      res.end(
        JSON.stringify({
          success: true,
          connected: isConnected,
          solanaStatus: status,
        }),
      );
    }
  } catch (error) {
    console.error('Error in Solana status request:', error);
    if (!hasResponded) {
      hasResponded = true;
      clearTimeout(timeout);
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error: 'Internal server error',
          }),
        );
      } catch (resError) {
        console.error('Failed to send error response:', resError);
      }
    }
  }
}

// Vault info handler with dynamic token information
async function handleVaultInfoRequest(res, req, game) {
  let hasResponded = false;

  // 超时保护
  const timeout = setTimeout(() => {
    if (!hasResponded) {
      hasResponded = true;
      console.error('Vault info request timeout - forcing response');
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error: 'Request timeout',
          }),
        );
      } catch (e) {
        console.error('Failed to send timeout response:', e);
      }
    }
  }, 10000); // 10秒超时

  try {
    const gameId = parseInt(req.getParameter(0));

    if (!game.solanaVaultService) {
      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        res.writeStatus('400 Bad Request').end(
          JSON.stringify({
            success: false,
            error: 'Solana vault service not available',
          }),
        );
      }
      return;
    }

    // Get comprehensive game info including token details
    const gameInfo = await game.solanaVaultService.vaultSDK.getGameInfo(gameId);

    if (!hasResponded) {
      hasResponded = true;
      clearTimeout(timeout);
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
    }
  } catch (error) {
    console.error('Error in vault info request:', error);
    if (!hasResponded) {
      hasResponded = true;
      clearTimeout(timeout);
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error: 'Failed to get vault info',
            details: error.message,
          }),
        );
      } catch (resError) {
        console.error('Failed to send error response:', resError);
      }
    }
  }
}

// Player ticket handler - Fixed async getUserTicketAccount call
async function handlePlayerTicketRequest(res, req, game) {
  let hasResponded = false;

  // 超时保护
  const timeout = setTimeout(() => {
    if (!hasResponded) {
      hasResponded = true;
      console.error('Player ticket request timeout - forcing response');
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error: 'Request timeout',
          }),
        );
      } catch (e) {
        console.error('Failed to send timeout response:', e);
      }
    }
  }, 10000); // 10秒超时

  try {
    const gameId = parseInt(req.getParameter(0));
    const playerAddress = req.getParameter(1);

    if (!game.solanaVaultService) {
      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        res.writeStatus('400 Bad Request').end(
          JSON.stringify({
            success: false,
            error: 'Solana vault service not available',
          }),
        );
      }
      return;
    }

    // 🔧 修复：添加异步调用的错误处理
    const { PublicKey } = require('@solana/web3.js');
    const playerPubkey = new PublicKey(playerAddress);

    console.log(
      `🎫 Checking ticket for player ${playerAddress} in game ${gameId}`,
    );

    let ticket = null;
    try {
      ticket = await game.solanaVaultService.getUserTicketAccount(
        gameId,
        playerPubkey,
      );
      console.log(`✅ Ticket check completed for ${playerAddress}:`, !!ticket);
    } catch (ticketError) {
      console.warn(
        `⚠️ Failed to get ticket for ${playerAddress}:`,
        ticketError.message,
      );
      // ticket remains null, indicating no ticket found
    }

    if (!hasResponded) {
      hasResponded = true;
      clearTimeout(timeout);
      res.end(
        JSON.stringify({
          success: true,
          ticket: ticket,
          hasTicket: !!ticket,
        }),
      );
    }
  } catch (error) {
    console.error('Error in player ticket request:', error);
    if (!hasResponded) {
      hasResponded = true;
      clearTimeout(timeout);
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error: 'Failed to get player ticket',
            details: error.message,
          }),
        );
      } catch (resError) {
        console.error('Failed to send error response:', resError);
      }
    }
  }
}

// Buy ticket handler - 修复请求处理器响应问题
async function handleBuyTicketRequest(res, req, game) {
  let hasResponded = false;

  // 超时保护
  const timeout = setTimeout(() => {
    if (!hasResponded) {
      hasResponded = true;
      console.error('Buy ticket request timeout - forcing response');
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error: 'Request timeout',
          }),
        );
      } catch (e) {
        console.error('Failed to send timeout response:', e);
      }
    }
  }, 15000); // 15秒超时

  try {
    if (!game.solanaVaultService) {
      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        res.writeStatus('400 Bad Request').end(
          JSON.stringify({
            success: false,
            error: 'Solana vault service not available',
          }),
        );
      }
      return;
    }

    // Read request body
    let body = '';
    res.onData((chunk, isLast) => {
      if (hasResponded) return;

      try {
        body += Buffer.from(chunk).toString();
        if (isLast) {
          try {
            const data = JSON.parse(body);
            processBuyTicketRequest(
              res,
              game,
              data,
              { hasResponded: false },
              timeout,
            );
          } catch (parseError) {
            if (!hasResponded) {
              hasResponded = true;
              clearTimeout(timeout);
              res.writeStatus('400 Bad Request').end(
                JSON.stringify({
                  success: false,
                  error: 'Invalid JSON',
                }),
              );
            }
          }
        }
      } catch (error) {
        if (!hasResponded) {
          hasResponded = true;
          clearTimeout(timeout);
          console.error('Error processing request data:', error);
          res.writeStatus('500 Internal Server Error').end(
            JSON.stringify({
              success: false,
              error: 'Error processing request data',
            }),
          );
        }
      }
    });

    res.onAborted(() => {
      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        console.log('Buy ticket request aborted');
      }
    });
  } catch (error) {
    console.error('Error in buy ticket request:', error);
    if (!hasResponded) {
      hasResponded = true;
      clearTimeout(timeout);
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error: 'Internal server error',
          }),
        );
      } catch (resError) {
        console.error('Failed to send error response:', resError);
      }
    }
  }
}

// Process buy ticket request with security validation - 强化响应处理
async function processBuyTicketRequest(
  res,
  game,
  data,
  responseState,
  timeout,
) {
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
      if (!responseState.hasResponded) {
        responseState.hasResponded = true;
        clearTimeout(timeout);
        res.writeStatus('400 Bad Request').end(
          JSON.stringify({
            success: false,
            error: 'Missing required fields: gameId, amount, walletAddress',
          }),
        );
      }
      return;
    }

    // Security validation using TierValidationMiddleware
    const rateLimit = TierValidationMiddleware.checkRateLimit(walletAddress);
    if (!rateLimit.isAllowed) {
      if (!responseState.hasResponded) {
        responseState.hasResponded = true;
        clearTimeout(timeout);
        res.writeStatus('429 Too Many Requests').end(
          JSON.stringify({
            success: false,
            error: rateLimit.error,
          }),
        );
      }
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

      if (!responseState.hasResponded) {
        responseState.hasResponded = true;
        clearTimeout(timeout);
        res.writeStatus('400 Bad Request').end(
          JSON.stringify({
            success: false,
            error: validation.error,
          }),
        );
      }
      return;
    }

    // Additional server-side verification
    if (
      !game.solanaGameId ||
      game.solanaGameId.toString() !== gameId.toString()
    ) {
      if (!responseState.hasResponded) {
        responseState.hasResponded = true;
        clearTimeout(timeout);
        res.writeStatus('400 Bad Request').end(
          JSON.stringify({
            success: false,
            error: `Invalid game ID. Current active game: ${game.solanaGameId || 'none'}`,
          }),
        );
      }
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

    // 🔧 修复：统一使用SPL Token处理（包括WSOL）
    const userTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      userPubkey,
    );

    console.log(
      `🪙 Using SPL token ${tokenMint.toString()} with ATA ${userTokenAccount.toString()} for ${walletAddress}`,
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

    if (!responseState.hasResponded) {
      responseState.hasResponded = true;
      clearTimeout(timeout);
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
    }
  } catch (error) {
    console.error('Error processing buy ticket request:', error);

    TierValidationMiddleware.logSecurityEvent('TICKET_PURCHASE_ERROR', {
      walletAddress: data?.walletAddress,
      gameId: data?.gameId,
      tier: data?.tier,
      error: error.message,
    });

    if (!responseState.hasResponded) {
      responseState.hasResponded = true;
      clearTimeout(timeout);
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error: error.message || 'Failed to buy ticket',
          }),
        );
      } catch (resError) {
        console.error('Failed to send error response:', resError);
      }
    }
  }
}

// Current game token info handler - 强化错误处理
async function handleCurrentGameTokenRequest(res, req, game) {
  let hasResponded = false;

  // 超时保护
  const timeout = setTimeout(() => {
    if (!hasResponded) {
      hasResponded = true;
      console.error('Token request timeout - forcing response');
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error: 'Request timeout',
          }),
        );
      } catch (e) {
        console.error('Failed to send timeout response:', e);
      }
    }
  }, 10000); // 10秒超时

  try {
    if (!game.solanaVaultService) {
      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        res.end(
          JSON.stringify({
            success: true,
            currentGameId: null,
            tokenMint: 'So11111111111111111111111111111111111111112', // Default SOL
            tokenInfo: {
              address: 'So11111111111111111111111111111111111111112',
              isSOL: true,
              isUSDC: false,
              isWSol: true,
            },
            gameStatus: {
              isActive: false,
              canBuyTickets: false,
              tier: 'low',
              status: 'no_solana_service',
            },
            message: 'Solana vault service not available - using defaults',
          }),
        );
      }
      return;
    }

    if (!game.solanaGameId) {
      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        res.end(
          JSON.stringify({
            success: true,
            currentGameId: null,
            tokenMint: 'So11111111111111111111111111111111111111112', // Default SOL
            tokenInfo: {
              address: 'So11111111111111111111111111111111111111112',
              isSOL: true,
              isUSDC: false,
              isWSol: true,
            },
            gameStatus: {
              isActive: false,
              canBuyTickets: false,
              tier: 'low',
              status: 'no_active_game',
            },
            message: 'No active game found - using defaults',
          }),
        );
      }
      return;
    }

    try {
      // Use our new convenient methods for getting comprehensive token info
      const tokenInfo = await game.getCurrentGameTokenInfo();

      if (tokenInfo && !hasResponded) {
        // Success - got token info using new methods
        hasResponded = true;
        clearTimeout(timeout);
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
        return;
      }

      if (!hasResponded) {
        throw new Error('Failed to get token info using enhanced methods');
      }
    } catch (error) {
      if (hasResponded) return;

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

        if (!hasResponded) {
          hasResponded = true;
          clearTimeout(timeout);
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
        }
      } catch (directError) {
        if (hasResponded) return;

        // Final fallback to server configuration
        Logger.server.warn('All on-chain methods failed, using server config', {
          gameId: game.solanaGameId,
          enhancedError: error.message,
          directError: directError.message,
        });

        if (!hasResponded) {
          hasResponded = true;
          clearTimeout(timeout);
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
    }
  } catch (error) {
    console.error('Error in current game token request:', error);
    if (!hasResponded) {
      hasResponded = true;
      clearTimeout(timeout);
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error: 'Failed to get current game token info',
            details: error.message,
          }),
        );
      } catch (resError) {
        console.error('Failed to send error response:', resError);
      }
    }
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

// Player joined notification handler - Fixed response handling
async function handlePlayerJoinedRequest(res, req, game) {
  let hasResponded = false;

  const timeout = setTimeout(() => {
    if (!hasResponded) {
      hasResponded = true;
      console.error('Player joined request timeout - forcing response');
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error: 'Request timeout',
          }),
        );
      } catch (e) {
        console.error('Failed to send timeout response:', e);
      }
    }
  }, 10000);

  try {
    // Read request body
    let body = '';
    res.onData((chunk, isLast) => {
      if (hasResponded) return;

      try {
        body += Buffer.from(chunk).toString();
        if (isLast) {
          try {
            const data = JSON.parse(body);

            // 🔧 修复：直接处理请求，避免异步状态同步问题
            processPlayerJoinedRequest(res, game, data, timeout)
              .then(() => {
                hasResponded = true;
                console.log('✅ Player joined request processed successfully');
              })
              .catch((error) => {
                console.error('Error in processPlayerJoinedRequest:', error);
                if (!hasResponded) {
                  hasResponded = true;
                  clearTimeout(timeout);
                  try {
                    res.writeStatus('500 Internal Server Error').end(
                      JSON.stringify({
                        success: false,
                        error: 'Internal server error',
                        details: error.message,
                      }),
                    );
                  } catch (resError) {
                    console.error('Failed to send error response:', resError);
                  }
                }
              });
          } catch (parseError) {
            if (!hasResponded) {
              hasResponded = true;
              clearTimeout(timeout);
              res.writeStatus('400 Bad Request').end(
                JSON.stringify({
                  success: false,
                  error: 'Invalid JSON',
                  details: parseError.message,
                }),
              );
            }
          }
        }
      } catch (error) {
        if (!hasResponded) {
          hasResponded = true;
          clearTimeout(timeout);
          console.error('Error processing player joined request:', error);
          res.writeStatus('500 Internal Server Error').end(
            JSON.stringify({
              success: false,
              error: 'Error processing request data',
              details: error.message,
            }),
          );
        }
      }
    });

    res.onAborted(() => {
      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        console.log('Player joined request aborted');
      }
    });
  } catch (error) {
    console.error('Error in player joined request:', error);
    if (!hasResponded) {
      hasResponded = true;
      clearTimeout(timeout);
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error: 'Internal server error',
            details: error.message,
          }),
        );
      } catch (resError) {
        console.error('Failed to send error response:', resError);
      }
    }
  }
}

// Process player joined request - Fixed response handling
async function processPlayerJoinedRequest(res, game, data, timeout) {
  let hasResponded = false;

  try {
    const { gameId, playerAddress, txHash, tier, amount } = data;

    console.log(`📋 Player joined notification:`, {
      gameId,
      playerAddress,
      txHash,
      tier,
      amount,
    });

    // Basic validation
    if (!gameId || !playerAddress || !txHash) {
      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        res.writeStatus('400 Bad Request').end(
          JSON.stringify({
            success: false,
            error: 'Missing required fields: gameId, playerAddress, txHash',
          }),
        );
      }
      return;
    }

    // Log the successful transaction for monitoring
    console.log(
      `✅ Player ${playerAddress} joined game ${gameId} with TX: ${txHash}`,
    );

    // Optional: Add player to registered players set
    if (game.registeredPlayers) {
      game.registeredPlayers.add(playerAddress.toLowerCase());
    }

    if (!hasResponded) {
      hasResponded = true;
      clearTimeout(timeout);
      res.end(
        JSON.stringify({
          success: true,
          message: 'Player joined notification received',
          gameId,
          playerAddress,
          txHash,
        }),
      );
    }
  } catch (error) {
    console.error('Error processing player joined request:', error);
    if (!hasResponded) {
      hasResponded = true;
      clearTimeout(timeout);
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error:
              error.message || 'Failed to process player joined notification',
            details: error.stack,
          }),
        );
      } catch (resError) {
        console.error('Failed to send error response:', resError);
      }
    }
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
  console.log(
    `   SERVER RESTART CYCLE ${config.enableCycleRestart ? 'YES' : 'NO'} `,
  );
}

// Build buy ticket transaction handler (for secure frontend flow)
async function handleBuildBuyTicketTransactionRequest(res, req, game) {
  let hasResponded = false;

  const timeout = setTimeout(() => {
    if (!hasResponded) {
      hasResponded = true;
      console.error('Build transaction request timeout');
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error: 'Request timeout',
          }),
        );
      } catch (e) {
        console.error('Failed to send timeout response:', e);
      }
    }
  }, 15000);

  try {
    // Read request body
    let body = '';
    res.onData((chunk, isLast) => {
      if (hasResponded) return;

      try {
        body += Buffer.from(chunk).toString();
        if (isLast) {
          try {
            const data = JSON.parse(body);
            processBuildBuyTicketTransaction(
              res,
              game,
              data,
              { hasResponded: false },
              timeout,
            );
          } catch (parseError) {
            if (!hasResponded) {
              hasResponded = true;
              clearTimeout(timeout);
              res.writeStatus('400 Bad Request').end(
                JSON.stringify({
                  success: false,
                  error: 'Invalid JSON',
                }),
              );
            }
          }
        }
      } catch (error) {
        if (!hasResponded) {
          hasResponded = true;
          clearTimeout(timeout);
          console.error('Error processing request data:', error);
          res.writeStatus('500 Internal Server Error').end(
            JSON.stringify({
              success: false,
              error: 'Error processing request data',
            }),
          );
        }
      }
    });

    res.onAborted(() => {
      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        console.log('Build buy ticket transaction request aborted');
      }
    });
  } catch (error) {
    console.error('Error in build buy ticket transaction request:', error);
    if (!hasResponded) {
      hasResponded = true;
      clearTimeout(timeout);
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error: 'Internal server error',
          }),
        );
      } catch (resError) {
        console.error('Failed to send error response:', resError);
      }
    }
  }
}

// Process build buy ticket transaction with security validation
async function processBuildBuyTicketTransaction(
  res,
  game,
  data,
  responseState,
  timeout,
) {
  let hasResponded = responseState.hasResponded;

  try {
    const {
      gameId,
      amount,
      walletAddress,
      tokenMint,
      tier = 'low',
      expectedAmount,
      signature,
      playerLevel = 1,
    } = data;

    console.log('🔧 Building secure transaction for:', {
      gameId,
      amount,
      walletAddress,
      tier,
    });

    // Basic input validation
    if (!gameId || !amount || !walletAddress || !tokenMint) {
      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        res.writeStatus('400 Bad Request').end(
          JSON.stringify({
            success: false,
            error:
              'Missing required fields: gameId, amount, walletAddress, tokenMint',
          }),
        );
      }
      return;
    }

    // Security validation using TierValidationMiddleware
    const rateLimit = TierValidationMiddleware.checkRateLimit(walletAddress);
    if (!rateLimit.isAllowed) {
      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        res.writeStatus('429 Too Many Requests').end(
          JSON.stringify({
            success: false,
            error: rateLimit.error,
          }),
        );
      }
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
      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        res.writeStatus('400 Bad Request').end(
          JSON.stringify({
            success: false,
            error: validation.error,
          }),
        );
      }
      return;
    }

    // Check if Solana vault service is available
    if (!game.solanaVaultService) {
      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        res.writeStatus('400 Bad Request').end(
          JSON.stringify({
            success: false,
            error: 'Solana vault service not available',
          }),
        );
      }
      return;
    }

    console.log('🔧 Building transaction using vault SDK...');

    // Get user token account
    const { PublicKey } = require('@solana/web3.js');
    const { getAssociatedTokenAddress } = require('@solana/spl-token');

    console.log('🔍 Debug info:');
    console.log('   Token mint:', tokenMint);
    console.log('   Wallet address:', walletAddress);
    console.log('   Game ID:', gameId);
    console.log('   Amount:', amount);
    console.log('   Tier:', tier);

    const userTokenAccount = await getAssociatedTokenAddress(
      new PublicKey(tokenMint),
      new PublicKey(walletAddress),
    );

    console.log('   Expected user token account:', userTokenAccount.toString());

    // Build the transaction using vault SDK
    console.log('🔨 Calling VaultSDK.buildBuyTicketTransaction...');
    const buildResult =
      await game.solanaVaultService.vaultSDK.buildBuyTicketTransaction({
        gameId: parseInt(gameId),
        amount: BigInt(amount),
        userTokenAccount,
        tier,
        expectedAmount: BigInt(expectedAmount || amount),
        walletAddress,
      });

    console.log('✅ Transaction built successfully');
    console.log('   Transaction length:', buildResult.transaction.length);

    // 🧪 Simulate the transaction to catch errors early
    try {
      console.log('🧪 Simulating transaction on server side...');
      const { Transaction } = require('@solana/web3.js');
      const transactionBuffer = Buffer.from(buildResult.transaction, 'base64');
      const transaction = Transaction.from(transactionBuffer);

      // Get fresh blockhash for simulation
      const { blockhash } =
        await game.solanaVaultService.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = new PublicKey(walletAddress);

      const simulation =
        await game.solanaVaultService.connection.simulateTransaction(
          transaction,
        );

      if (simulation.value.err) {
        console.error(
          '❌ Server-side transaction simulation failed:',
          simulation.value.err,
        );
        console.error('📋 Simulation logs:', simulation.value.logs);

        if (!hasResponded) {
          hasResponded = true;
          clearTimeout(timeout);
          res.writeStatus('400 Bad Request').end(
            JSON.stringify({
              success: false,
              error: `Transaction simulation failed: ${JSON.stringify(simulation.value.err)}`,
              logs: simulation.value.logs,
            }),
          );
        }
        return;
      }

      console.log('✅ Server-side transaction simulation successful');
      if (simulation.value.logs) {
        console.log('📋 Simulation logs:', simulation.value.logs);
      }
    } catch (simError) {
      console.error('❌ Failed to simulate transaction on server:', simError);
      // Continue anyway, let client handle the error
    }

    if (!hasResponded) {
      hasResponded = true;
      clearTimeout(timeout);
      res.writeStatus('200 OK').end(
        JSON.stringify({
          success: true,
          transaction: buildResult.transaction,
          message: 'Transaction built and simulated successfully',
        }),
      );
    }
  } catch (error) {
    console.error('Error building transaction:', error);
    if (!hasResponded) {
      hasResponded = true;
      clearTimeout(timeout);
      res.writeStatus('500 Internal Server Error').end(
        JSON.stringify({
          success: false,
          error: 'Failed to build transaction: ' + error.message,
        }),
      );
    }
  }
}

// Verify buy ticket transaction handler (for secure frontend flow)
async function handleVerifyBuyTicketTransactionRequest(res, req, game) {
  let hasResponded = false;

  const timeout = setTimeout(() => {
    if (!hasResponded) {
      hasResponded = true;
      console.error('Verify transaction request timeout');
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error: 'Request timeout',
          }),
        );
      } catch (e) {
        console.error('Failed to send timeout response:', e);
      }
    }
  }, 15000);

  try {
    // Read request body
    let body = '';
    res.onData((chunk, isLast) => {
      if (hasResponded) return;

      try {
        body += Buffer.from(chunk).toString();
        if (isLast) {
          try {
            const data = JSON.parse(body);
            processVerifyBuyTicketTransaction(
              res,
              game,
              data,
              { hasResponded: false },
              timeout,
            );
          } catch (parseError) {
            if (!hasResponded) {
              hasResponded = true;
              clearTimeout(timeout);
              res.writeStatus('400 Bad Request').end(
                JSON.stringify({
                  success: false,
                  error: 'Invalid JSON',
                }),
              );
            }
          }
        }
      } catch (error) {
        if (!hasResponded) {
          hasResponded = true;
          clearTimeout(timeout);
          console.error('Error processing request data:', error);
          res.writeStatus('500 Internal Server Error').end(
            JSON.stringify({
              success: false,
              error: 'Error processing request data',
            }),
          );
        }
      }
    });

    res.onAborted(() => {
      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        console.log('Verify buy ticket transaction request aborted');
      }
    });
  } catch (error) {
    console.error('Error in verify buy ticket transaction request:', error);
    if (!hasResponded) {
      hasResponded = true;
      clearTimeout(timeout);
      try {
        res.writeStatus('500 Internal Server Error').end(
          JSON.stringify({
            success: false,
            error: 'Internal server error',
          }),
        );
      } catch (resError) {
        console.error('Failed to send error response:', resError);
      }
    }
  }
}

// Process verify buy ticket transaction
async function processVerifyBuyTicketTransaction(
  res,
  game,
  data,
  responseState,
  timeout,
) {
  let hasResponded = responseState.hasResponded;

  try {
    const {
      gameId,
      txSignature,
      walletAddress,
      amount,
      tier,
      originalSignature,
    } = data;

    console.log('🔍 Verifying transaction:', {
      gameId,
      txSignature,
      walletAddress,
      tier,
    });

    // Basic input validation
    if (!gameId || !txSignature || !walletAddress) {
      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        res.writeStatus('400 Bad Request').end(
          JSON.stringify({
            success: false,
            error:
              'Missing required fields: gameId, txSignature, walletAddress',
          }),
        );
      }
      return;
    }

    // Verify transaction on blockchain
    if (!game.solanaVaultService) {
      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        res.writeStatus('400 Bad Request').end(
          JSON.stringify({
            success: false,
            error: 'Solana vault service not available',
          }),
        );
      }
      return;
    }

    console.log('🔍 Verifying transaction on blockchain...');

    // Verify the transaction actually happened and is valid
    const verificationResult =
      await game.solanaVaultService.vaultSDK.verifyBuyTicketTransaction({
        gameId: parseInt(gameId),
        txSignature,
        walletAddress,
        amount: BigInt(amount || 0),
        tier,
      });

    if (!hasResponded) {
      hasResponded = true;
      clearTimeout(timeout);
      res.writeStatus('200 OK').end(
        JSON.stringify({
          success: verificationResult.success,
          message: verificationResult.success
            ? 'Transaction verified successfully'
            : 'Transaction verification failed',
          details: verificationResult.details,
        }),
      );
    }
  } catch (error) {
    console.error('Error verifying transaction:', error);
    if (!hasResponded) {
      hasResponded = true;
      clearTimeout(timeout);
      res.writeStatus('500 Internal Server Error').end(
        JSON.stringify({
          success: false,
          error: 'Failed to verify transaction: ' + error.message,
        }),
      );
    }
  }
}

// Build claim reward transaction API
app.options('/api/build-claim-transaction', (res) => {
  res.onAborted(() => {
    console.warn('Build-claim-transaction OPTIONS request aborted by client');
  });
  setCors(res);
  res.end();
});
app.post('/api/build-claim-transaction', async (res, req) => {
  // Register abort handler FIRST
  res.onAborted(() => {
    console.warn('Build claim transaction request aborted by client');
  });

  setCors(res);
  res.writeHeader('Content-Type', 'application/json');

  let hasResponded = false;
  const timeout = setTimeout(() => {
    if (!hasResponded) {
      hasResponded = true;
      res.writeStatus('408 Request Timeout').end(
        JSON.stringify({
          success: false,
          error: 'Request timeout',
        }),
      );
    }
  }, 30000); // 30 second timeout

  try {
    let body = Buffer.alloc(0);
    res.onData((chunk, isLast) => {
      body = Buffer.concat([body, Buffer.from(chunk)]);
      if (isLast) {
        handleClaimTransactionRequest(body, res, hasResponded, timeout);
      }
    });
  } catch (error) {
    console.error('Error setting up claim transaction request:', error);
    if (!hasResponded) {
      hasResponded = true;
      clearTimeout(timeout);
      res.writeStatus('500 Internal Server Error').end(
        JSON.stringify({
          success: false,
          error: 'Failed to process request: ' + error.message,
        }),
      );
    }
  }
});

// Helper function to get current game instance
function getCurrentGame() {
  return global.currentGame || null;
}

async function handleClaimTransactionRequest(body, res, hasResponded, timeout) {
  try {
    const data = JSON.parse(body.toString());
    const { gameId, walletAddress } = data;

    console.log('🔧 Building claim transaction for:', {
      gameId,
      walletAddress,
    });

    // Validate required fields
    if (!gameId || !walletAddress) {
      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        res.writeStatus('400 Bad Request').end(
          JSON.stringify({
            success: false,
            error: 'Missing required fields: gameId, walletAddress',
          }),
        );
      }
      return;
    }

    // Get current game instance
    const game = getCurrentGame();
    if (!game || !game.solanaVaultService) {
      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        res.writeStatus('503 Service Unavailable').end(
          JSON.stringify({
            success: false,
            error: 'Solana vault service not available',
          }),
        );
      }
      return;
    }

    console.log('🔨 Calling VaultSDK.buildClaimTransaction...');

    // Build claim transaction using VaultSDK
    const transaction =
      await game.solanaVaultService.vaultSDK.buildClaimTransaction({
        gameId: parseInt(gameId),
        userPublicKey: new (await import('@solana/web3.js')).PublicKey(
          walletAddress,
        ),
      });

    // Serialize transaction for frontend
    const serializedTransaction = transaction
      .serialize({
        requireAllSignatures: false,
      })
      .toString('base64');

    console.log('✅ Claim transaction built successfully');

    if (!hasResponded) {
      hasResponded = true;
      clearTimeout(timeout);
      res.writeStatus('200 OK').end(
        JSON.stringify({
          success: true,
          serializedTransaction,
          message: 'Claim transaction built successfully',
        }),
      );
    }
  } catch (error) {
    console.error('Error building claim transaction:', error);
    if (!hasResponded) {
      hasResponded = true;
      clearTimeout(timeout);
      res.writeStatus('500 Internal Server Error').end(
        JSON.stringify({
          success: false,
          error: 'Failed to build claim transaction: ' + error.message,
        }),
      );
    }
  }
}

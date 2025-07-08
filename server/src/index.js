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
  
  await initializeSolanaVaultService();     // sets global.solanaVaultService

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
      Logger.server.info('[CycleRestart] Scheduled restart triggered - ending current game');

      // Use unified Solana game end flow
      // This will: 1) Kick players 2) Finalize Solana game 3) Restart server for new game
      if (config.isRaceServer && config.solana.enabled && game.solanaVaultService) {
        try {
          await game.endSolanaGame('cycle_restart');
        } catch (error) {
          Logger.server.error('Cycle restart failed to end Solana game properly', {
            error: error.message
          });
          
          // If Solana game end fails, fallback to simple restart
          Logger.server.warn('Falling back to simple restart without Solana operations');
          game.pendingMassKill = true;
          await new Promise(r => setTimeout(r, 3000));
          
          game.clearGameTimeout();
          Object.assign(game, { gamePhase: 'initializing', solanaGameId: null });
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
        await new Promise(r => setTimeout(r, 3000));
        
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
    res.writeHeader('Content-Type', 'application/json').end(
      JSON.stringify(buildServerInfo(game)),
    );
  });
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
          Logger.server.error('Failed to end Solana game', { error: e.message });
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
      Logger.server.critical('Error during shutdown', { error: err.message, stack: err.stack });
      process.exit(1);
    }
  };

  process.on('SIGINT', () => stop('SIGINT'));
  process.on('SIGTERM', () => stop('SIGTERM'));
  process.on('uncaughtException', (e) => {
    Logger.server.critical('Uncaught Exception', { error: e.message, stack: e.stack });
    stop('uncaughtException');
  });
  process.on('unhandledRejection', (r, p) => {
    Logger.server.critical('Unhandled Promise Rejection', { rejection: r, promise: p });
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

    solanaConfig: config.solana.enabled ? {
      cluster: config.solana.environment.cluster,
      killReward: config.solana.killReward,
      programId: config.solana.programId,
    } : null,

    gameStatus,
    timestamp: Date.now(),
  }

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

      res.writeStatus('200 OK').end(JSON.stringify({
        success: true,
        message: 'Game end command sent',
        gameId,
        currentPhase: phase,
        note: 'Game ending process started asynchronously',
      }));
    } else {
      res.writeStatus('400 Bad Request').end(JSON.stringify({
        success: false,
        error: `Cannot end game in phase: ${phase}`,
        gameId,
        suggestion: suggestForPhase(phase),
      }));
    }
  } catch (err) {
    console.error('Admin endgame error:', err);
    res.writeStatus('500 Internal Server Error').end(JSON.stringify({
      success: false,
      error: 'Internal server error',
      details: err.message,
    }));
  }
}

async function handleRestartRequest(res, req, game) {
  try {
    if (req.getHeader('authorization') !== `Bearer ${config.moderationSecret}`) {
      res.writeStatus('401 Unauthorized').end(JSON.stringify({
        success: false,
        error: 'Unauthorized',
      }));
      return;
    }

    game.clearGameTimeout();
    Object.assign(game, { gamePhase: 'initializing', solanaGameId: null });
    game.registeredPlayers.clear();
    game.finalKillRewards.clear();
    game.finalScores.clear();

    for (const player of game.players) {
      player.client?.socket?.send(JSON.stringify({
        type: 'gameRestart',
        message: 'Game is restarting. Please rejoin.',
      }));
      player.client?.socket?.close();
    }

    setTimeout(async () => {
      try {
        await game.initializeSolanaGame();
      } catch (e) {
        console.error('Failed to restart Solana game:', e);
      }
    }, 2000);

    res.writeStatus('200 OK').end(JSON.stringify({
      success: true,
      message: 'Game restarted successfully',
    }));
  } catch (err) {
    console.error('Admin restart error:', err);
    res.writeStatus('500 Internal Server Error').end(JSON.stringify({
      success: false,
      error: 'Internal server error',
    }));
  }
}

// Solana service status handler
async function handleSolanaStatusRequest(res, game) {
  try {
    if (!game.solanaVaultService) {
      res.writeStatus('400 Bad Request').end(JSON.stringify({
        success: false,
        error: 'Solana vault service not available',
      }));
      return;
    }

    const status = game.solanaVaultService.getStatus();
    const isConnected = await game.solanaVaultService.isConnected();
    
    res.end(JSON.stringify({
      success: true,
      connected: isConnected,
      solanaStatus: status,
    }));
  } catch (error) {
    console.error('Error in Solana status request:', error);
    res.writeStatus('500 Internal Server Error').end(JSON.stringify({
      success: false,
      error: 'Internal server error',
    }));
  }
}

function suggestForPhase(phase) {
  switch (phase) {
    case 'ended': return 'Game has already ended.';
    case 'ending': return 'Game is currently ending.';
    case 'initializing': return 'Game is still initializing.';
    case 'error': return 'Game is in error state.';
    default: return `Unknown phase: ${phase}`;
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

    if (!await svc.isConnected()) throw new Error('Failed to connect to Solana');
    Logger.status('Solana connection verified');

    if (!config.solana.programId)
      throw new Error('Vault program ID missing');

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
    issues.forEach(issue => console.warn(`   - ${issue}`));
    
    if (config.isRaceServer && config.solana.enabled) {
      console.error('❌ Critical configuration issues detected for race server');
      console.error('   Please fix these issues before starting the server');
    } else {
      console.warn('⚠️ Some configuration issues detected but server can continue');
    }
  } else {
    console.log('✅ Configuration validation passed');
  }
}

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
  await initializeBlockchainService();     // sets global.blockchainService

  const game = new Game();
  const server = new Server(game);

  // Attach blockchain service to game instance
  game.blockchainService = global.blockchainService;

  game.initialize();
  server.initialize(app);

  registerPublicRoutes(app, game);
  registerAdminRoutes(app, game);
  initModeration(game, app);

  startGameLoop(game, server);
  setupShutdownHandlers(game, server);

  // Initialize blockchain game for race servers
  if (config.isRaceServer && config.blockchain.enabled) {
    await game.initializeBlockchainGame();
  }

  /* == Periodic restart hook == */
  if (config.enableCycleRestart) {
    initCycleRestart(async () => {
      Logger.server.info('[CycleRestart] auto hot-restart');

      game.pendingMassKill = true;

      await new Promise(r => setTimeout(r, 3000));

      game.clearGameTimeout();
      Object.assign(game, { gamePhase: 'initializing', blockchainGameId: null });
      game.registeredPlayers.clear();
      game.finalScores.clear();
      game.playerScoreSubmitted.clear();

      for (const client of server.clients.values()) {
        client.player = null;
        client.spectator.isSpectating = true;
        client.fullSync = true;
      }

      // for (const client of server.clients.values()) {
      //   client.socket?.close();
      // }

      await game.initializeBlockchainGame();
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
  if (!config.isRaceServer || !config.blockchain.enabled) return;

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

  // Switch RPC node
  app.post('/admin/switch-rpc', async (res, req) => {
    setCors(res);
    res.writeHeader('Content-Type', 'application/json');
    await handleSwitchRpcRequest(res, req, game);
  });

  // Get RPC status
  app.get('/admin/rpc-status', async (res) => {
    setCors(res);
    res.writeHeader('Content-Type', 'application/json');
    await handleRpcStatusRequest(res, game);
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

      if (global.blockchainService && game.blockchainGameId) {
        try {
          Logger.server.info('Ending blockchain game before shutdown...');
          await game.endBlockchainGame('server_shutdown');
        } catch (e) {
          Logger.server.error('Failed to end blockchain game', { error: e.message });
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
  if (config.isRaceServer && config.blockchain.enabled) {
    try {
      gameStatus = game.getBlockchainGameStatus();
    } catch (e) {
      console.error('Error getting blockchain status:', e);
    }
  }

  const payload = {
    tps: game.tps,
    entityCnt: game.entities.size,
    playerCnt: game.players.size,
    realPlayers: [...game.players.values()].filter((p) => !p.isBot).length,

    serverType: config.serverType,
    isRaceServer: config.isRaceServer,
    blockchainEnabled: config.blockchain.enabled,

    blockchainConfig: config.blockchain.enabled ? {
      gameLevel: config.blockchain.gameLevel || 0,
      environment: config.blockchain.environment.networkName,
      chainId: config.blockchain.environment.chainId,
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
    const gameId = game.blockchainGameId ? Number(game.blockchainGameId) : null;

    console.log('🔍 Admin endgame request', { phase, gameId });

    if (phase === 'active' || phase === 'waiting') {
      game.endBlockchainGame('admin_manual').catch(console.error);

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
    Object.assign(game, { gamePhase: 'initializing', blockchainGameId: null });
    game.registeredPlayers.clear();
    game.finalScores.clear();
    game.playerScoreSubmitted.clear();

    for (const player of game.players) {
      player.client?.socket?.send(JSON.stringify({
        type: 'gameRestart',
        message: 'Game is restarting. Please rejoin.',
      }));
      player.client?.socket?.close();
    }

    setTimeout(async () => {
      try {
        await game.initializeBlockchainGame();
      } catch (e) {
        console.error('Failed to restart blockchain game:', e);
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

// RPC 切换处理函数
async function handleSwitchRpcRequest(res, req, game) {
  try {
    if (req.getHeader('authorization') !== `Bearer ${config.moderationSecret}`) {
      res.writeStatus('401 Unauthorized').end(JSON.stringify({
        success: false,
        error: 'Unauthorized',
      }));
      return;
    }

    let body = '';
    res.onData((chunk, isLast) => {
      body += Buffer.from(chunk).toString();
      if (isLast) {
        handleSwitchRpcBody(body, res, game);
      }
    });
  } catch (error) {
    console.error('Error in switch RPC request:', error);
    res.writeStatus('500 Internal Server Error').end(JSON.stringify({
      success: false,
      error: 'Internal server error',
    }));
  }
}

async function handleSwitchRpcBody(body, res, game) {
  try {
    const data = JSON.parse(body || '{}');
    const { action, index } = data;

    if (!game.blockchainService) {
      res.writeStatus('400 Bad Request').end(JSON.stringify({
        success: false,
        error: 'Blockchain service not available',
      }));
      return;
    }

    let result;
    if (action === 'fastest') {
      // 切换到最快的RPC
      await game.blockchainService.findAndSwitchToFastestRPC();
      result = { action: 'switched_to_fastest' };
    } else if (action === 'switch' && typeof index === 'number') {
      // 切换到指定索引的RPC
      const newRpc = await game.blockchainService.switchToRPC(index);
      result = { action: 'switched', index, rpc: newRpc };
    } else {
      res.writeStatus('400 Bad Request').end(JSON.stringify({
        success: false,
        error: 'Invalid action or missing index',
      }));
      return;
    }

    // 获取切换后的状态
    const stats = game.blockchainService.rpcManager.getStats();
    
    res.end(JSON.stringify({
      success: true,
      result,
      rpcStats: stats,
    }));
  } catch (error) {
    console.error('Error handling switch RPC body:', error);
    res.writeStatus('500 Internal Server Error').end(JSON.stringify({
      success: false,
      error: error.message,
    }));
  }
}

// RPC 状态查询处理函数
async function handleRpcStatusRequest(res, game) {
  try {
    if (!game.blockchainService) {
      res.writeStatus('400 Bad Request').end(JSON.stringify({
        success: false,
        error: 'Blockchain service not available',
      }));
      return;
    }

    const stats = game.blockchainService.rpcManager.getStats();
    const isConnected = await game.blockchainService.isConnected();
    
    res.end(JSON.stringify({
      success: true,
      connected: isConnected,
      rpcStats: stats,
    }));
  } catch (error) {
    console.error('Error in RPC status request:', error);
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


// == Blockchain Service ==
async function initializeBlockchainService() {
  if (!config.isRaceServer || !config.blockchain.enabled) {
    Logger.server.warn('Blockchain service disabled');
    return null;
  }

  try {
    Logger.server.info('Initializing blockchain service...');

    const BlockchainService = require('./blockchain/BlockchainService');
    const svc = new BlockchainService(config.blockchain);

    await svc.initialize();

    if (!await svc.isConnected()) throw new Error('Failed to connect');
    Logger.status('Blockchain connection verified');

    if (!config.blockchain.contracts?.swordBattle)
      throw new Error('SwordBattle contract address missing');
    if (!config.blockchain.trustedSigner)
      throw new Error('Trusted signer private key missing');

    Logger.status('Blockchain config verified');

    try {
      const counter = await svc.getGameCounter();
      Logger.server.info('Current game counter', { counter });
    } catch (e) {
      Logger.server.warn('Failed to read game counter', { error: e.message });
    }

    global.blockchainService = svc;
    Logger.status('Blockchain service ready');
    return svc;
  } catch (err) {
    Logger.server.error('Blockchain init failed', { error: err.message });
    return null;
  }
}

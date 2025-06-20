// server/src/index.js
const path = require('path');
const uws = require('uWebSockets.js');
const fs = require('fs');
const util = require('util');

const Game = require('./game/Game');
const Loop = require('./utilities/Loop');
const Server = require('./network/Server');
const config = require('./config');
const { initModeration } = require('./moderation');

const readFileAsync = util.promisify(fs.readFile);

// ---------- uWS App ----------
let listenToken = null;
const app = config.useSSL
  ? uws.SSLApp({
    key_file_name: path.resolve(config.sslData.key),
    cert_file_name: path.resolve(config.sslData.cert),
  })
  : uws.App();

app.listen('0.0.0.0', config.port, (tok) => {
  if (!tok) { console.error('Port busy'); process.exit(1); }
  listenToken = tok;
  start();
  console.log(`Game started on port ${config.port}.`);
});

// ---------- CORS ----------
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Headers': 'content-type',
};
const setCors = (res) => {
  for (const [k, v] of Object.entries(CORS_HEADERS)) res.writeHeader(k, v);
};

app.options('/ping', setCors);
app.get('/ping', (res) => {
  setCors(res);
  res.writeHeader('Content-Type', 'text/plain').end('pong');
});

// ---------- Bootstrap ----------
function start() {
  const game = new Game();
  game.initialize();
  
  // Attach blockchain service to game if available
  if (global.blockchainService) {
    game.blockchainService = global.blockchainService;
    console.log('Blockchain service attached to game instance');
    
    // 自动初始化区块链游戏（仅在比赛服务器模式下）
    if (config.isRaceServer && config.blockchain.enabled) {
      console.log('🚀 Starting blockchain game initialization...');
      
      // 延迟初始化以确保服务器完全启动
      setTimeout(async () => {
        try {
          await game.initializeBlockchainGame();
          console.log('✅ Blockchain game initialization completed');
        } catch (error) {
          console.error('❌ Failed to initialize blockchain game:', error);
          console.error('Race server will continue but blockchain features may not work');
        }
      }, 5000); // 5秒延迟
    }
  }
  
  const server = new Server(game);
  server.initialize(app);

  app.get('/serverinfo', (res) => {
    setCors(res);
    res.writeHeader('Content-Type', 'application/json').end(
      JSON.stringify({
        // 基础服务器信息
        tps: game.tps,
        entityCnt: game.entities.size,
        playerCnt: game.players.size,
        realPlayers: [...game.players.values()].filter((p) => !p.isBot).length,
      }),
    );
  });
  
  // 管理员控制端点（仅比赛服务器）
  if (config.isRaceServer && config.blockchain.enabled) {
    app.post('/admin/endgame', async (res, req) => {
      setCorsHeaders(res);
      res.writeHeader('Content-Type', 'application/json');
      
      try {
        // 简单的管理员密钥验证
        const authHeader = req.getHeader('authorization');
        if (authHeader !== `Bearer ${config.moderationSecret}`) {
          res.writeStatus('401 Unauthorized');
          res.end(JSON.stringify({ success: false, error: 'Unauthorized' }));
          return;
        }

        if (game.gamePhase === 'active' || game.gamePhase === 'waiting') {
          await game.endBlockchainGame('admin_manual');
          res.writeStatus('200 OK');
          res.end(JSON.stringify({ 
            success: true, 
            message: 'Game ended successfully',
            gameId: game.blockchainGameId 
          }));
        } else {
          res.writeStatus('400 Bad Request');
          res.end(JSON.stringify({ 
            success: false, 
            error: `Cannot end game in phase: ${game.gamePhase}` 
          }));
        }
      } catch (error) {
        console.error('Admin endgame error:', error);
        res.writeStatus('500 Internal Server Error');
        res.end(JSON.stringify({ 
          success: false, 
          error: 'Internal server error' 
        }));
      }
    });

    app.post('/admin/restart', async (res, req) => {
      setCorsHeaders(res);
      res.writeHeader('Content-Type', 'application/json');
      
      try {
        const authHeader = req.getHeader('authorization');
        if (authHeader !== `Bearer ${config.moderationSecret}`) {
          res.writeStatus('401 Unauthorized');
          res.end(JSON.stringify({ success: false, error: 'Unauthorized' }));
          return;
        }

        // 强制重启游戏
        game.clearGameTimeout();
        game.gamePhase = 'initializing';
        game.blockchainGameId = null;
        game.registeredPlayers.clear();
        game.finalScores.clear();
        game.playerScoreSubmitted.clear();
        
        // 踢出所有玩家
        for (const player of game.players) {
          if (player.client && player.client.socket) {
            player.client.socket.send(JSON.stringify({
              type: 'gameRestart',
              message: 'Game is restarting. Please rejoin.',
            }));
            player.client.socket.close();
          }
        }
        
        // 重新初始化区块链游戏
        setTimeout(async () => {
          try {
            await game.initializeBlockchainGame();
          } catch (error) {
            console.error('Failed to restart blockchain game:', error);
          }
        }, 2000);

        res.writeStatus('200 OK');
        res.end(JSON.stringify({ 
          success: true, 
          message: 'Game restarted successfully' 
        }));
      } catch (error) {
        console.error('Admin restart error:', error);
        res.writeStatus('500 Internal Server Error');
        res.end(JSON.stringify({ 
          success: false, 
          error: 'Internal server error' 
        }));
      }
    });
  }
  
  initModeration(game, app);

  const frameTime = 1000 / config.tickRate;
  const dt = frameTime / 1000;
  const loop = new Loop(frameTime, game);

  loop.setEventHandler(() => {
    server.tick(dt);
  });
  loop.onTpsUpdate = (tps) => {
    game.tps = tps;
    loop.entityCnt = game.entities.size;
  };
  loop.start();

  // ---------- Graceful shutdown ----------
  function stop(reason) {
    try {
      console.log('Stopping game...', reason);
      if (listenToken) uws.us_listen_socket_close(listenToken);

      for (const client of server.clients.values()) {
        if (!client.player) continue;
        const data = {
          coins: client.player.levels?.coins,
          kills: client.player.kills,
          playtime: client.player.playtime,
        };
        client.saveGame(data);
      }
      console.log('All games saved. Bye.');
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
  process.on('SIGINT', () => stop('SIGINT'));
  process.on('SIGTERM', () => stop('SIGTERM'));
  process.on('uncaughtException', (e) => { console.error(e); stop('uncaughtException'); });
  process.on('unhandledRejection', (r, p) => { console.error(r, p); stop('unhandledRejection'); });
}

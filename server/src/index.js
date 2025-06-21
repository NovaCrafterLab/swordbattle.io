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

app.listen('0.0.0.0', config.port, async (tok) => {
  if (!tok) { console.error('Port busy'); process.exit(1); }
  listenToken = tok;
  await start();
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
async function start() {
  // 首先初始化区块链服务（如果需要）
  await initializeBlockchainService();
  
  const game = new Game();
  game.initialize();
  
  // 调试信息：显示当前配置状态
  console.log('=== Server Configuration Debug ===');
  console.log('SERVER_TYPE:', process.env.SERVER_TYPE);
  console.log('BLOCKCHAIN_ENABLED:', process.env.BLOCKCHAIN_ENABLED);
  console.log('config.isRaceServer:', config.isRaceServer);
  console.log('config.blockchain.enabled:', config.blockchain.enabled);
  console.log('global.blockchainService exists:', !!global.blockchainService);
  console.log('==================================');
  
  // Attach blockchain service to game if available
  if (global.blockchainService) {
    game.blockchainService = global.blockchainService;
    console.log('✅ Blockchain service attached to game instance');
    
    // 自动初始化区块链游戏（仅在比赛服务器模式下）
    if (config.isRaceServer && config.blockchain.enabled) {
      console.log('🚀 Starting blockchain game initialization...');
      console.log('⏱️ Waiting 5 seconds for server to fully start...');
      
      // 延迟初始化以确保服务器完全启动
      setTimeout(async () => {
        try {
          console.log('🎮 Starting new game creation process...');
          await game.initializeBlockchainGame();
          console.log('🎉 Blockchain game initialization completed successfully');
        } catch (error) {
          console.error('❌ Failed to initialize blockchain game:', error);
          console.error('🔧 Race server will continue but blockchain features may not work');
          console.error('💡 Try restarting the server or check your blockchain configuration');
        }
      }, 5000); // 5秒延迟
    } else {
      console.log('❌ Blockchain initialization skipped:');
      console.log('   - isRaceServer:', config.isRaceServer);
      console.log('   - blockchain.enabled:', config.blockchain.enabled);
    }
  } else {
    console.log('❌ No blockchain service available - check initialization logs above');
  }
  
  const server = new Server(game);
  server.initialize(app);

  app.get('/serverinfo', (res) => {
    setCors(res);
    
    // 安全获取区块链游戏状态
    let gameStatus = null;
    try {
      if (config.isRaceServer && config.blockchain.enabled) {
        gameStatus = game.getBlockchainGameStatus();
      }
    } catch (error) {
      console.error('Error getting blockchain game status:', error);
      gameStatus = null;
    }
    
    res.writeHeader('Content-Type', 'application/json').end(
      JSON.stringify({
        // 基础服务器信息
        tps: game.tps,
        entityCnt: game.entities.size,
        playerCnt: game.players.size,
        realPlayers: [...game.players.values()].filter((p) => !p.isBot).length,
        
        // 服务器类型信息
        serverType: config.serverType,
        isRaceServer: config.isRaceServer,
        blockchainEnabled: config.blockchain.enabled,
        
        // 区块链游戏状态（仅在比赛服务器模式下）
        gameStatus,
      }),
    );
  });
  
  // 管理员控制端点（仅比赛服务器）
  if (config.isRaceServer && config.blockchain.enabled) {
    app.post('/admin/endgame', async (res, req) => {
      setCors(res);
      res.writeHeader('Content-Type', 'application/json');
      
      try {
        const currentPhase = game.gamePhase;
        const gameId = game.blockchainGameId ? Number(game.blockchainGameId) : null;
        
        console.log(`🔍 Admin endgame request - Current phase: ${currentPhase}, Game ID: ${gameId}`);

        if (currentPhase === 'active' || currentPhase === 'waiting') {
          // 异步执行游戏结束，但立即响应HTTP请求
          game.endBlockchainGame('admin_manual').catch(error => {
            console.error('Async game end error:', error);
          });
          
          res.writeStatus('200 OK');
          res.end(JSON.stringify({ 
            success: true, 
            message: 'Game end command sent successfully',
            gameId: gameId,
            currentPhase: currentPhase,
            note: 'Game ending process started asynchronously'
          }));
        } else {
          // 提供更详细的错误信息
          let suggestion = '';
          switch (currentPhase) {
            case 'ended':
              suggestion = 'Game has already ended. Wait for a new game to start or use restart command.';
              break;
            case 'ending':
              suggestion = 'Game is currently ending. Please wait.';
              break;
            case 'initializing':
              suggestion = 'Game is still initializing. Please wait for it to reach waiting or active phase.';
              break;
            case 'error':
              suggestion = 'Game is in error state. Try using restart command.';
              break;
            default:
              suggestion = `Unknown game phase: ${currentPhase}`;
          }
          
          res.writeStatus('400 Bad Request');
          res.end(JSON.stringify({ 
            success: false, 
            error: `Cannot end game in phase: ${currentPhase}`,
            currentPhase: currentPhase,
            gameId: gameId,
            suggestion: suggestion
          }));
        }
      } catch (error) {
        console.error('Admin endgame error:', error);
        res.writeStatus('500 Internal Server Error');
        res.end(JSON.stringify({ 
          success: false, 
          error: 'Internal server error',
          details: error.message
        }));
      }
    });

    app.post('/admin/restart', async (res, req) => {
      setCors(res);
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
  async function stop(reason) {
    try {
      console.log('Stopping game...', reason);
      
      // 如果是比赛服务器且区块链服务可用，先结束游戏
      if (global.blockchainService && game.blockchainGameId) {
        try {
          console.log('🏁 Ending blockchain game before server shutdown...');
          await game.endBlockchainGame('server_shutdown');
        } catch (error) {
          console.error('❌ Failed to end blockchain game during shutdown:', error);
        }
      }
      
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

// 初始化区块链服务
async function initializeBlockchainService() {
  if (!config.isRaceServer || !config.blockchain.enabled) {
    console.log('⚠️ Blockchain service disabled - not a race server or blockchain not enabled');
    return null;
  }

  try {
    console.log('🔗 Initializing blockchain service...');
    
    const BlockchainService = require('./blockchain/BlockchainService');
    const blockchainService = new BlockchainService(config.blockchain);
    
    await blockchainService.initialize();
    
    // 验证区块链连接和配置
    console.log('🔍 Verifying blockchain connection...');
    
    // 检查连接状态
    const isConnected = await blockchainService.isConnected();
    if (!isConnected) {
      throw new Error('Failed to connect to blockchain network');
    }
    console.log('✅ Blockchain connection verified');
    
    // 检查合约配置
    if (!config.blockchain.contracts?.swordBattle) {
      throw new Error('SwordBattle contract address not configured');
    }
    console.log('✅ Contract configuration verified');
    
    // 检查钱包配置（用于创建游戏）
    if (!config.blockchain.trustedSigner) {
      throw new Error('Trusted signer private key not configured');
    }
    console.log('✅ Wallet configuration verified');
    
    // 测试读取游戏计数器
    try {
      const gameCounter = await blockchainService.getGameCounter();
      console.log(`✅ Current game counter: ${gameCounter}`);
    } catch (error) {
      console.error('⚠️ Warning: Failed to read game counter:', error.message);
    }
    
    // 设置到全局作用域
    global.blockchainService = blockchainService;
    
    console.log('✅ Blockchain service initialized and verified successfully');
    return blockchainService;
  } catch (error) {
    console.error('❌ Failed to initialize blockchain service:', error);
    console.error('💡 Please check your blockchain configuration in environment variables');
    return null;
  }
}

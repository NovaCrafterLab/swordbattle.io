const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { VaultSDK } = require('./dist/vault-sdk');

// 配置
const connection = new Connection('http://localhost:8899', 'confirmed');
const wallet = Keypair.generate(); // 测试用钱包
const programId = new PublicKey('AqDb3BxQhL5wmszt3iy8qrvPJ9Mu5MeF5uoUd1e65EaV');

// 创建SDK实例
const vaultSDK = new VaultSDK({
  programId,
  connection,
  wallet
});

async function testEvents() {
  console.log('🚀 开始测试事件功能...\n');

  // 1. 监听所有事件
  console.log('📡 监听所有事件...');
  const allEventsSubscription = vaultSDK.onAllEvents((event, slot) => {
    console.log(`📢 收到事件 (slot: ${slot}):`, event);
  });

  // 2. 监听特定事件类型
  console.log('🎫 监听购票事件...');
  const ticketSubscription = vaultSDK.onTicketPurchased((event, slot) => {
    console.log(`🎫 购票事件 (slot: ${slot}):`, {
      gameId: event.gameId,
      user: event.user.toString(),
      amount: event.amount,
      totalDeposit: event.totalDeposit
    });
  });

  console.log('🏆 监听奖励领取事件...');
  const rewardSubscription = vaultSDK.onRewardClaimed((event, slot) => {
    console.log(`🏆 奖励领取事件 (slot: ${slot}):`, {
      gameId: event.gameId,
      user: event.user.toString(),
      rewardAmount: event.rewardAmount
    });
  });

  console.log('🎮 监听游戏结束事件...');
  const finalizeSubscription = vaultSDK.onGameFinalized((event, slot) => {
    console.log(`🎮 游戏结束事件 (slot: ${slot}):`, {
      gameId: event.gameId,
      totalDeposit: event.totalDeposit,
      rewardCount: event.rewardCount
    });
  });

  // 3. 查询历史事件
  console.log('\n📚 查询历史事件...');
  try {
    const recentEvents = await vaultSDK.getRecentEvents();
    console.log(`📚 最近事件数量: ${recentEvents.length}`);
    
    if (recentEvents.length > 0) {
      console.log('📚 最近事件示例:');
      recentEvents.slice(0, 3).forEach((event, index) => {
        console.log(`  ${index + 1}. ${event.eventName || 'Unknown'}:`, {
          signature: event.signature,
          slot: event.slot,
          blockTime: event.blockTime
        });
      });
    }
  } catch (error) {
    console.log('❌ 查询历史事件失败:', error.message);
  }

  // 4. 查询特定游戏的事件
  console.log('\n🎯 查询游戏1的事件...');
  try {
    const gameEvents = await vaultSDK.getGameEvents(1);
    console.log(`🎯 游戏1事件数量: ${gameEvents.length}`);
  } catch (error) {
    console.log('❌ 查询游戏事件失败:', error.message);
  }

  // 5. 查询特定用户的事件
  console.log('\n👤 查询用户事件...');
  try {
    const userEvents = await vaultSDK.getUserEvents(wallet.publicKey);
    console.log(`👤 用户事件数量: ${userEvents.length}`);
  } catch (error) {
    console.log('❌ 查询用户事件失败:', error.message);
  }

  // 6. 查询管理员事件
  console.log('\n👑 查询管理员事件...');
  try {
    const authorityEvents = await vaultSDK.getAuthorityEvents(wallet.publicKey);
    console.log(`👑 管理员事件数量: ${authorityEvents.length}`);
  } catch (error) {
    console.log('❌ 查询管理员事件失败:', error.message);
  }

  // 保持监听一段时间
  console.log('\n⏰ 监听事件中... (10秒后停止)');
  setTimeout(() => {
    console.log('\n🛑 停止监听事件...');
    
    // 取消所有订阅
    allEventsSubscription.unsubscribe();
    ticketSubscription.unsubscribe();
    rewardSubscription.unsubscribe();
    finalizeSubscription.unsubscribe();
    
    console.log('✅ 事件监听已停止');
    process.exit(0);
  }, 10000);
}

// 错误处理
process.on('unhandledRejection', (error) => {
  console.error('❌ 未处理的Promise拒绝:', error);
  process.exit(1);
});

// 运行测试
testEvents().catch(console.error); 
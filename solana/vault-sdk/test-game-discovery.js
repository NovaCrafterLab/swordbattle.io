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
  wallet,
});

async function testGameDiscovery() {
  console.log('🎮 开始测试游戏发现功能...\n');

  try {
    // 1. 获取所有游戏ID
    console.log('📋 获取所有游戏ID...');
    const allGameIds = await vaultSDK.getAllGameIds();
    console.log(`📋 找到 ${allGameIds.length} 个游戏ID:`, allGameIds);

    // 2. 获取所有游戏详细信息
    console.log('\n📊 获取所有游戏详细信息...');
    const allGames = await vaultSDK.getAllGames();
    console.log(`📊 找到 ${allGames.length} 个游戏:`);

    allGames.forEach((game, index) => {
      console.log(`  ${index + 1}. 游戏 ${game.gameId}:`);
      console.log(`     - 金库地址: ${game.vault.toString()}`);
      console.log(`     - 管理员: ${game.authority.toString()}`);
      console.log(`     - 总存款: ${game.totalDeposit}`);
      console.log(`     - 是否结束: ${game.finalized ? '是' : '否'}`);
      console.log(`     - 可提款: ${game.withdrawEnabled ? '是' : '否'}`);
      console.log(`     - 代币铸造: ${game.tokenMint.toString()}`);
    });

    // 3. 获取游戏统计信息
    console.log('\n📈 获取游戏统计信息...');
    const gameStats = await vaultSDK.getGameStats();
    console.log('📈 游戏统计:', {
      总游戏数: gameStats.total,
      活跃游戏: gameStats.active,
      已结束游戏: gameStats.finalized,
      可提款游戏: gameStats.withWithdrawEnabled,
    });

    // 4. 获取最新游戏ID
    console.log('\n🆕 获取最新游戏ID...');
    const latestGameId = await vaultSDK.getLatestGameId();
    console.log(`🆕 最新游戏ID: ${latestGameId || '无'}`);

    // 5. 获取下一个可用游戏ID
    console.log('\n➡️ 获取下一个可用游戏ID...');
    const nextGameId = await vaultSDK.getNextGameId();
    console.log(`➡️ 下一个可用游戏ID: ${nextGameId}`);

    // 6. 检查特定游戏是否存在
    if (allGameIds.length > 0) {
      const testGameId = parseInt(allGameIds[0]);
      console.log(`\n🔍 检查游戏 ${testGameId} 是否存在...`);
      const exists = await vaultSDK.gameExists(testGameId);
      console.log(`🔍 游戏 ${testGameId} 存在: ${exists ? '是' : '否'}`);

      // 检查不存在的游戏
      const nonExistentGameId = 999999;
      console.log(`🔍 检查游戏 ${nonExistentGameId} 是否存在...`);
      const nonExists = await vaultSDK.gameExists(nonExistentGameId);
      console.log(
        `🔍 游戏 ${nonExistentGameId} 存在: ${nonExists ? '是' : '否'}`,
      );
    }

    // 7. 获取活跃游戏
    console.log('\n🎯 获取活跃游戏...');
    const activeGames = await vaultSDK.getActiveGames();
    console.log(`🎯 活跃游戏数量: ${activeGames.length}`);
    activeGames.forEach((game, index) => {
      console.log(`  ${index + 1}. 游戏 ${game.gameId} (活跃)`);
    });

    // 8. 获取已结束游戏
    console.log('\n🏁 获取已结束游戏...');
    const finalizedGames = await vaultSDK.getFinalizedGames();
    console.log(`🏁 已结束游戏数量: ${finalizedGames.length}`);
    finalizedGames.forEach((game, index) => {
      console.log(`  ${index + 1}. 游戏 ${game.gameId} (已结束)`);
    });

    // 9. 获取可提款游戏
    console.log('\n💰 获取可提款游戏...');
    const withdrawEnabledGames = await vaultSDK.getGamesWithWithdrawEnabled();
    console.log(`💰 可提款游戏数量: ${withdrawEnabledGames.length}`);
    withdrawEnabledGames.forEach((game, index) => {
      console.log(`  ${index + 1}. 游戏 ${game.gameId} (可提款)`);
    });

    // 10. 按管理员筛选游戏
    if (allGames.length > 0) {
      const testAuthority = allGames[0].authority;
      console.log(`\n👑 获取管理员 ${testAuthority.toString()} 的游戏...`);
      const authorityGames = await vaultSDK.getGamesByAuthority(testAuthority);
      console.log(`👑 该管理员的游戏数量: ${authorityGames.length}`);
      authorityGames.forEach((game, index) => {
        console.log(`  ${index + 1}. 游戏 ${game.gameId}`);
      });
    }

    // 11. 按代币铸造筛选游戏
    if (allGames.length > 0) {
      const testTokenMint = allGames[0].tokenMint;
      console.log(`\n🪙 获取代币 ${testTokenMint.toString()} 的游戏...`);
      const tokenGames = await vaultSDK.getGamesByTokenMint(testTokenMint);
      console.log(`🪙 该代币的游戏数量: ${tokenGames.length}`);
      tokenGames.forEach((game, index) => {
        console.log(`  ${index + 1}. 游戏 ${game.gameId}`);
      });
    }

    // 12. 使用自定义选项筛选游戏
    console.log('\n🔧 使用自定义选项筛选游戏...');
    const filteredGames = await vaultSDK.getAllGames({
      limit: 5, // 限制返回5个游戏
      finalized: false, // 只要活跃游戏
    });
    console.log(`🔧 筛选结果: ${filteredGames.length} 个活跃游戏 (限制5个)`);
  } catch (error) {
    console.error('❌ 测试游戏发现功能时出错:', error.message);
  }
}

// 错误处理
process.on('unhandledRejection', (error) => {
  console.error('❌ 未处理的Promise拒绝:', error);
  process.exit(1);
});

// 运行测试
testGameDiscovery().catch(console.error);

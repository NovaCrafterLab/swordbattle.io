const {
  createPublicClient,
  createWalletClient,
  http,
  parseEther,
} = require('viem');
const { bsc, bscTestnet } = require('viem/chains');
const { privateKeyToAccount } = require('viem/accounts');
const config = require('./src/config');

// 导入ABI
const GAME_AGGREGATOR_ABI = require('../abis/GameAggregator.json').abi;

// 合约地址
const GAME_AGGREGATOR_ADDRESS = config.blockchain.contracts.gameAggregator;

// 管理员角色常量
const ADMIN_ROLE =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

async function main() {
  console.log('🔍 检查奖励领取权限配置...\n');

  // 设置区块链客户端
  const chain = config.isDev ? bscTestnet : bsc;
  const rpcUrl =
    config.blockchain.rpcUrl ||
    (config.isDev
      ? 'https://data-seed-prebsc-1-s1.binance.org:8545'
      : 'https://bsc-dataseed1.binance.org');

  const publicClient = createPublicClient({
    chain,
    transport: http(rpcUrl),
  });

  // 创建账户
  const account = privateKeyToAccount(config.blockchain.trustedSigner);
  const walletClient = createWalletClient({
    account,
    chain,
    transport: http(rpcUrl),
  });

  console.log(`🔗 连接到: ${chain.name}`);
  console.log(`📍 GameAggregator地址: ${GAME_AGGREGATOR_ADDRESS}`);
  console.log(`👤 服务器地址: ${account.address}\n`);

  try {
    // 1. 检查GameAggregator合约的基本信息
    console.log('📋 检查GameAggregator合约信息:');

    // 获取RewardManager地址
    const rewardManagerAddress = await publicClient.readContract({
      address: GAME_AGGREGATOR_ADDRESS,
      abi: GAME_AGGREGATOR_ABI,
      functionName: 'rewardManager',
    });
    console.log(`💰 RewardManager地址: ${rewardManagerAddress}`);

    // 获取GameRewardManager地址
    const gameRewardManagerAddress = await publicClient.readContract({
      address: GAME_AGGREGATOR_ADDRESS,
      abi: GAME_AGGREGATOR_ABI,
      functionName: 'gameRewardManager',
    });
    console.log(`🎮 GameRewardManager地址: ${gameRewardManagerAddress}`);

    // 2. 检查GameAggregator是否有权限调用RewardManager
    console.log('\n🔐 检查权限配置:');

    // 这里需要RewardManager的ABI来检查authorizedAggregators
    // 由于我们没有RewardManager的ABI，我们先检查GameAggregator的权限

    // 检查服务器是否有GameAggregator的管理员权限
    const hasGameAggregatorAdmin = await publicClient.readContract({
      address: GAME_AGGREGATOR_ADDRESS,
      abi: GAME_AGGREGATOR_ABI,
      functionName: 'hasRole',
      args: [ADMIN_ROLE, account.address],
    });
    console.log(
      `✅ 服务器在GameAggregator上有ADMIN权限: ${hasGameAggregatorAdmin}`,
    );

    // 3. 测试奖励查询功能
    console.log('\n🎁 测试奖励查询功能:');

    // 获取游戏计数器
    const gameCounter = await publicClient.readContract({
      address: GAME_AGGREGATOR_ADDRESS,
      abi: GAME_AGGREGATOR_ABI,
      functionName: 'gameCounter',
    });
    console.log(`🎮 当前游戏计数器: ${gameCounter}`);

    if (gameCounter > 0) {
      // 测试查询最新游戏的信息
      const latestGameId = gameCounter - BigInt(1);
      console.log(`🔍 测试查询游戏 ${latestGameId} 的信息...`);

      try {
        const gameInfo = await publicClient.readContract({
          address: GAME_AGGREGATOR_ADDRESS,
          abi: GAME_AGGREGATOR_ABI,
          functionName: 'getGameFullInfo',
          args: [latestGameId],
        });

        console.log(`📊 游戏 ${latestGameId} 信息:`, {
          status: gameInfo[2].toString(),
          totalPool: gameInfo[3].toString(),
          playerCount: gameInfo[7].toString(),
          activePlayers: gameInfo[9].length,
        });

        // 如果有玩家，测试查询奖励
        if (gameInfo[9].length > 0) {
          const testPlayer = gameInfo[9][0];
          console.log(`🎁 测试查询玩家 ${testPlayer} 的奖励...`);

          try {
            const playerRewards = await publicClient.readContract({
              address: GAME_AGGREGATOR_ADDRESS,
              abi: GAME_AGGREGATOR_ABI,
              functionName: 'getPlayerCompleteRewards',
              args: [latestGameId, testPlayer],
            });

            console.log(`💰 玩家奖励信息:`, {
              usdAmount: playerRewards.usdAmount?.toString() || '0',
              nclabAmount: playerRewards.nclabAmount?.toString() || '0',
              usdClaimable: playerRewards.usdClaimable || false,
              nclabClaimable: playerRewards.nclabClaimable || false,
              fragmentBonus: playerRewards.fragmentBonus || 0,
            });
          } catch (rewardError) {
            console.error(`❌ 查询玩家奖励失败: ${rewardError.message}`);
          }
        }
      } catch (gameError) {
        console.error(`❌ 查询游戏信息失败: ${gameError.message}`);
      }
    }

    // 4. 检查可能的权限问题
    console.log('\n🚨 权限问题诊断:');
    console.log('如果奖励领取失败，可能的原因:');
    console.log(
      '1. GameAggregator没有被授权为RewardManager的authorizedAggregator',
    );
    console.log('2. RewardManager合约的权限配置不正确');
    console.log('3. 奖励分发逻辑中的try/catch吞掉了错误');

    console.log('\n💡 建议的解决方案:');
    console.log(
      '1. 检查RewardManager.authorizedAggregators[GameAggregator地址]是否为true',
    );
    console.log(
      '2. 如果不是，需要调用RewardManager.setAuthorizedAggregator(GameAggregator地址, true)',
    );
    console.log('3. 或者给GameAggregator合约DEFAULT_ADMIN_ROLE权限');
  } catch (error) {
    console.error('❌ 检查过程中发生错误:', error.message);
    console.error('详细错误:', error);
  }
}

main().catch(console.error);

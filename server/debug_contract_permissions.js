const { createPublicClient, createWalletClient, http } = require('viem');
const { bsc, bscTestnet } = require('viem/chains');
const { privateKeyToAccount } = require('viem/accounts');
const config = require('./src/config.js');

// 导入ABI
const {
  SWORD_BATTLE_ABI,
  GAME_AGGREGATOR_ABI,
} = require('./src/blockchain/abis.js');
const { keccak256, toHex } = require('viem');

const isDev = config.environment.isDev;
const chain = isDev ? bscTestnet : bsc;
const rpcUrl = 'https://bsc-testnet-dataseed.bnbchain.org';

async function main() {
  console.log('🔍 检查合约权限配置...\n');

  // 创建客户端
  const publicClient = createPublicClient({
    chain,
    transport: http(rpcUrl),
  });

  const account = privateKeyToAccount(config.blockchain.trustedSigner);
  const walletClient = createWalletClient({
    account,
    chain,
    transport: http(rpcUrl),
  });

  console.log('📋 配置信息:');
  console.log('服务器地址:', account.address);
  console.log(
    'GameAggregator 合约:',
    config.blockchain.contracts.gameAggregator,
  );
  console.log('SwordBattle 合约:', config.blockchain.contracts.swordBattle);
  console.log('网络:', isDev ? 'BSC Testnet' : 'BSC Mainnet');
  console.log('');

  // 使用新部署的合约地址
  const CORRECT_GAME_AGGREGATOR_ADDRESS =
    '0x158f0F2e853150ca0d1c1c4c2c756D7E6C094961';
  const CORRECT_SWORD_BATTLE_ADDRESS =
    '0x706A14EC3f64b26fAEAB6179385bFADd2fCdD7e0';

  console.log('🎯 新部署的合约地址:');
  console.log('   GameAggregator:', CORRECT_GAME_AGGREGATOR_ADDRESS);
  console.log('   SwordBattle:', CORRECT_SWORD_BATTLE_ADDRESS);
  console.log('');

  if (
    config.blockchain.contracts.gameAggregator !==
    CORRECT_GAME_AGGREGATOR_ADDRESS
  ) {
    console.log('⚠️  注意：配置中的 GameAggregator 地址与预期不同');
    console.log('   配置中的地址:', config.blockchain.contracts.gameAggregator);
    console.log('   应该使用的地址:', CORRECT_GAME_AGGREGATOR_ADDRESS);
  }

  if (
    config.blockchain.contracts.swordBattle !== CORRECT_SWORD_BATTLE_ADDRESS
  ) {
    console.log('⚠️  注意：配置中的 SwordBattle 地址与预期不同');
    console.log('   配置中的地址:', config.blockchain.contracts.swordBattle);
    console.log('   应该使用的地址:', CORRECT_SWORD_BATTLE_ADDRESS);
  }

  // ADMIN_ROLE = keccak256("ADMIN_ROLE")
  const ADMIN_ROLE = keccak256(toHex('ADMIN_ROLE'));
  console.log('ADMIN_ROLE hash:', ADMIN_ROLE);

  try {
    // 检查 GameAggregator 上的权限
    console.log('🔐 检查 GameAggregator 合约权限:');
    const hasGameAggregatorAdmin = await publicClient.readContract({
      address: config.blockchain.contracts.gameAggregator,
      abi: GAME_AGGREGATOR_ABI,
      functionName: 'hasRole',
      args: [ADMIN_ROLE, account.address],
    });
    console.log(
      `服务器地址 ${account.address} 在 GameAggregator 上有 ADMIN_ROLE:`,
      hasGameAggregatorAdmin,
    );

    // 检查 SwordBattle 上的权限
    console.log('\n🔐 检查 SwordBattle 合约权限:');
    const swordBattleAddress = CORRECT_SWORD_BATTLE_ADDRESS;
    const hasSwordBattleAdmin = await publicClient.readContract({
      address: swordBattleAddress,
      abi: SWORD_BATTLE_ABI,
      functionName: 'hasRole',
      args: [ADMIN_ROLE, CORRECT_GAME_AGGREGATOR_ADDRESS],
    });
    console.log(
      `GameAggregator 合约 ${CORRECT_GAME_AGGREGATOR_ADDRESS} 在 SwordBattle 上有 ADMIN_ROLE:`,
      hasSwordBattleAdmin,
    );

    console.log('\n📊 权限状态总结:');
    console.log(
      '✅ 必需权限 1: 服务器 → GameAggregator ADMIN_ROLE:',
      hasGameAggregatorAdmin ? '✅' : '❌',
    );
    console.log(
      '✅ 必需权限 2: GameAggregator → SwordBattle ADMIN_ROLE:',
      hasSwordBattleAdmin ? '✅' : '❌',
    );

    if (!hasGameAggregatorAdmin || !hasSwordBattleAdmin) {
      console.log('\n🚨 权限配置不完整！需要执行以下操作:');

      if (!hasGameAggregatorAdmin) {
        console.log(`\n1. 在 GameAggregator 合约上给服务器地址授权:`);
        console.log(
          `   调用: GameAggregator.grantRole(ADMIN_ROLE, "${account.address}")`,
        );
        console.log(`   ADMIN_ROLE = ${ADMIN_ROLE}`);
      }

      if (!hasSwordBattleAdmin) {
        console.log(`\n2. 在 SwordBattle 合约上给 GameAggregator 合约授权:`);
        console.log(
          `   调用: SwordBattle.grantRole(ADMIN_ROLE, "${CORRECT_GAME_AGGREGATOR_ADDRESS}")`,
        );
        console.log(`   SwordBattle 地址: ${swordBattleAddress}`);
        console.log(`   ADMIN_ROLE = ${ADMIN_ROLE}`);
      }

      console.log(
        '\n💡 如果你有合约的默认管理员权限，可以使用下面的脚本自动授权:',
      );
      console.log('   node server/debug_contract_permissions.js --grant');
    } else {
      console.log('\n🎉 所有权限配置正确！');
    }

    // 如果传入 --grant 参数，尝试自动授权
    if (process.argv.includes('--grant')) {
      console.log('\n🔧 尝试自动授权...');

      if (!hasGameAggregatorAdmin) {
        try {
          console.log('正在给服务器地址授权 GameAggregator ADMIN_ROLE...');
          const { request } = await publicClient.simulateContract({
            account,
            address: CORRECT_GAME_AGGREGATOR_ADDRESS,
            abi: GAME_AGGREGATOR_ABI,
            functionName: 'grantRole',
            args: [ADMIN_ROLE, account.address],
          });
          const txHash1 = await walletClient.writeContract(request);
          console.log('交易已提交:', txHash1);
        } catch (error) {
          console.error('授权失败:', error.message);
        }
      }

      if (!hasSwordBattleAdmin) {
        try {
          console.log(
            '正在给 GameAggregator 合约授权 SwordBattle ADMIN_ROLE...',
          );
          const { request } = await publicClient.simulateContract({
            account,
            address: swordBattleAddress,
            abi: SWORD_BATTLE_ABI,
            functionName: 'grantRole',
            args: [ADMIN_ROLE, CORRECT_GAME_AGGREGATOR_ADDRESS],
          });
          const txHash2 = await walletClient.writeContract(request);
          console.log('交易已提交:', txHash2);
        } catch (error) {
          console.error('授权失败:', error.message);
        }
      }
    }
  } catch (error) {
    console.error('检查权限时发生错误:', error.message);
  }
}

main().catch(console.error);

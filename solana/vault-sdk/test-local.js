const {
  Connection,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
} = require('@solana/web3.js');
const {
  TOKEN_PROGRAM_ID,
  createMint,
  createAssociatedTokenAccount,
  mintTo,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
} = require('@solana/spl-token');
const { VaultSDK } = require('./dist/index.js');

// 测试配置
const LOCAL_RPC_URL = 'http://localhost:8899';
const PROGRAM_ID = new PublicKey(
  'AqDb3BxQhL5wmszt3iy8qrvPJ9Mu5MeF5uoUd1e65EaV',
);

async function setupTestEnvironment() {
  console.log('🚀 开始设置测试环境...');

  // 连接到本地网络
  const connection = new Connection(LOCAL_RPC_URL, 'confirmed');

  // 创建测试账户
  const admin = Keypair.generate();
  const user1 = Keypair.generate();
  const user2 = Keypair.generate();

  console.log('📝 测试账户:');
  console.log('  Admin:', admin.publicKey.toString());
  console.log('  User1:', user1.publicKey.toString());
  console.log('  User2:', user2.publicKey.toString());

  // 给账户空投 SOL
  console.log('💰 空投 SOL...');
  const airdropAmount = 10 * LAMPORTS_PER_SOL;

  await connection.confirmTransaction(
    await connection.requestAirdrop(admin.publicKey, airdropAmount),
  );
  await connection.confirmTransaction(
    await connection.requestAirdrop(user1.publicKey, airdropAmount),
  );
  await connection.confirmTransaction(
    await connection.requestAirdrop(user2.publicKey, airdropAmount),
  );

  console.log('✅ SOL 空投完成');

  // 创建代币铸造
  console.log('🪙 创建代币铸造...');
  const tokenMint = await createMint(
    connection,
    admin,
    admin.publicKey,
    null,
    9, // 9位小数
    undefined,
    undefined,
    TOKEN_PROGRAM_ID,
  );

  console.log('✅ 代币铸造创建完成:', tokenMint.toString());

  // 创建代币账户
  console.log('🏦 创建代币账户...');
  const adminTokenAccount = await getAssociatedTokenAddress(
    tokenMint,
    admin.publicKey,
  );
  const user1TokenAccount = await getAssociatedTokenAddress(
    tokenMint,
    user1.publicKey,
  );
  const user2TokenAccount = await getAssociatedTokenAddress(
    tokenMint,
    user2.publicKey,
  );

  await createAssociatedTokenAccount(
    connection,
    admin,
    tokenMint,
    admin.publicKey,
  );
  await createAssociatedTokenAccount(
    connection,
    admin,
    tokenMint,
    user1.publicKey,
  );
  await createAssociatedTokenAccount(
    connection,
    admin,
    tokenMint,
    user2.publicKey,
  );

  // 给用户铸造代币
  const mintAmount = 1000000000; // 1000 tokens
  await mintTo(
    connection,
    admin,
    tokenMint,
    user1TokenAccount,
    admin,
    mintAmount,
  );
  await mintTo(
    connection,
    admin,
    tokenMint,
    user2TokenAccount,
    admin,
    mintAmount,
  );

  console.log('✅ 代币账户创建完成');
  console.log('  Admin Token Account:', adminTokenAccount.toString());
  console.log('  User1 Token Account:', user1TokenAccount.toString());
  console.log('  User2 Token Account:', user2TokenAccount.toString());

  return {
    connection,
    admin,
    user1,
    user2,
    tokenMint,
    adminTokenAccount,
    user1TokenAccount,
    user2TokenAccount,
  };
}

async function testVaultSDK() {
  console.log('\n🧪 开始测试 VaultSDK...');

  // 设置测试环境
  const env = await setupTestEnvironment();

  // 创建 SDK 实例
  const adminSDK = new VaultSDK({
    programId: PROGRAM_ID,
    connection: env.connection,
    wallet: env.admin,
  });

  const user1SDK = new VaultSDK({
    programId: PROGRAM_ID,
    connection: env.connection,
    wallet: env.user1,
  });

  const user2SDK = new VaultSDK({
    programId: PROGRAM_ID,
    connection: env.connection,
    wallet: env.user2,
  });

  const gameId = 12345;

  try {
    // 测试 1: 初始化游戏金库
    console.log('\n📋 测试 1: 初始化游戏金库');
    const initTx = await adminSDK.initializeGameVault({
      gameId,
      tokenMint: env.tokenMint,
    });
    console.log('✅ 游戏金库初始化成功:', initTx);

    // 等待交易确认
    await env.connection.confirmTransaction(initTx);

    // 测试 2: 获取金库信息
    console.log('\n📋 测试 2: 获取金库信息');
    const vaultAccount = await adminSDK.getVaultAccount(gameId);
    console.log('✅ 金库账户信息:', {
      gameId: vaultAccount.gameId,
      authority: vaultAccount.authority.toString(),
      totalDeposit: vaultAccount.totalDeposit,
      finalized: vaultAccount.finalized,
      withdrawEnabled: vaultAccount.withdrawEnabled,
      tokenMint: vaultAccount.tokenMint.toString(),
    });

    // 测试 3: User1 购买门票
    console.log('\n📋 测试 3: User1 购买门票');
    const ticketAmount = 100000000; // 100 tokens
    const buyTicketTx = await user1SDK.buyTicket({
      gameId,
      amount: ticketAmount,
      userTokenAccount: env.user1TokenAccount,
    });
    console.log('✅ User1 购买门票成功:', buyTicketTx);
    await env.connection.confirmTransaction(buyTicketTx);

    // 测试 4: User2 购买门票
    console.log('\n📋 测试 4: User2 购买门票');
    const buyTicket2Tx = await user2SDK.buyTicket({
      gameId,
      amount: ticketAmount,
      userTokenAccount: env.user2TokenAccount,
    });
    console.log('✅ User2 购买门票成功:', buyTicket2Tx);
    await env.connection.confirmTransaction(buyTicket2Tx);

    // 测试 5: 获取用户门票信息
    console.log('\n📋 测试 5: 获取用户门票信息');
    const user1Ticket = await user1SDK.getUserTicketAccount(
      gameId,
      env.user1.publicKey,
    );
    const user2Ticket = await user2SDK.getUserTicketAccount(
      gameId,
      env.user2.publicKey,
    );

    console.log('✅ User1 门票信息:', user1Ticket);
    console.log('✅ User2 门票信息:', user2Ticket);

    // 测试 6: 结束游戏并设置奖励
    console.log('\n📋 测试 6: 结束游戏并设置奖励');
    const rewards = [
      {
        user: env.user1.publicKey,
        amount: '150000000', // 150 tokens (50 tokens profit)
      },
      {
        user: env.user2.publicKey,
        amount: '50000000', // 50 tokens (50 tokens loss)
      },
    ];

    const finalizeTx = await adminSDK.finalizeGame({
      gameId,
      rewards,
    });
    console.log('✅ 游戏结束成功:', finalizeTx);
    await env.connection.confirmTransaction(finalizeTx);

    // 测试 7: 获取奖励映射信息
    console.log('\n📋 测试 7: 获取奖励映射信息');
    const rewardMap = await adminSDK.getRewardMapAccount(gameId);
    console.log('✅ 奖励映射信息:', rewardMap);

    // 测试 8: User1 领取奖励
    console.log('\n📋 测试 8: User1 领取奖励');
    const claimTx = await user1SDK.claimReward({
      gameId,
      userTokenAccount: env.user1TokenAccount,
    });
    console.log('✅ User1 领取奖励成功:', claimTx);
    await env.connection.confirmTransaction(claimTx);

    // 测试 9: User2 领取奖励
    console.log('\n📋 测试 9: User2 领取奖励');
    const claim2Tx = await user2SDK.claimReward({
      gameId,
      userTokenAccount: env.user2TokenAccount,
    });
    console.log('✅ User2 领取奖励成功:', claim2Tx);
    await env.connection.confirmTransaction(claim2Tx);

    // 测试 10: 管理员提款
    console.log('\n📋 测试 10: 管理员提款');
    const withdrawTx = await adminSDK.adminWithdraw({
      gameId,
      amount: 50000000, // 50 tokens
      adminTokenAccount: env.adminTokenAccount,
    });
    console.log('✅ 管理员提款成功:', withdrawTx);
    await env.connection.confirmTransaction(withdrawTx);

    // 测试 11: 获取最终金库信息
    console.log('\n📋 测试 11: 获取最终金库信息');
    const finalVaultAccount = await adminSDK.getVaultAccount(gameId);
    console.log('✅ 最终金库信息:', {
      gameId: finalVaultAccount.gameId,
      totalDeposit: finalVaultAccount.totalDeposit,
      finalized: finalVaultAccount.finalized,
      withdrawEnabled: finalVaultAccount.withdrawEnabled,
    });

    console.log('\n🎉 所有测试完成！VaultSDK 工作正常！');
  } catch (error) {
    console.error('❌ 测试失败:', error);
    throw error;
  }
}

// 运行测试
async function main() {
  try {
    console.log('🔧 VaultSDK 本地测试');
    console.log('========================');

    await testVaultSDK();
  } catch (error) {
    console.error('💥 测试过程中发生错误:', error);
    process.exit(1);
  }
}

// 检查本地网络是否运行
async function checkLocalNetwork() {
  try {
    const connection = new Connection(LOCAL_RPC_URL, 'confirmed');
    const version = await connection.getVersion();
    console.log('✅ 本地 Solana 网络连接成功');
    console.log('   版本:', version);
    return true;
  } catch (error) {
    console.error('❌ 无法连接到本地 Solana 网络');
    console.error('   请确保运行了: solana-test-validator');
    return false;
  }
}

// 主函数
async function run() {
  const isNetworkRunning = await checkLocalNetwork();
  if (!isNetworkRunning) {
    process.exit(1);
  }

  await main();
}

run();

// 测试RPC管理器的随机选择功能
// 运行方式: node test-rpc-manager.js

const { SolanaRPCManager, CURRENT_RPC_POOL } = require('./config/walletConfig');

console.log('🧪 测试Solana RPC管理器随机选择功能\n');

// 测试1: 验证随机初始化
console.log('📊 测试1: 验证随机初始化');
const managers = [];
const initialIndices = [];

for (let i = 0; i < 10; i++) {
  const manager = new SolanaRPCManager();
  managers.push(manager);
  const currentRpc = manager.getCurrentRPC();
  const index = CURRENT_RPC_POOL.indexOf(currentRpc);
  initialIndices.push(index);
  console.log(
    `Manager ${i + 1}: 选择了RPC[${index}] - ${currentRpc.split('/').pop()}`,
  );
}

// 分析随机性
const uniqueIndices = [...new Set(initialIndices)];
console.log(`\n📈 随机性分析:`);
console.log(`- 总共创建了 ${managers.length} 个管理器实例`);
console.log(`- 使用了 ${uniqueIndices.length} 个不同的RPC节点`);
console.log(`- RPC池总大小: ${CURRENT_RPC_POOL.length}`);
console.log(
  `- 随机性评分: ${((uniqueIndices.length / Math.min(managers.length, CURRENT_RPC_POOL.length)) * 100).toFixed(1)}%`,
);

// 测试2: 验证故障转移
console.log('\n📊 测试2: 验证故障转移机制');
const testManager = managers[0];
const originalRpc = testManager.getCurrentRPC();
console.log(`原始RPC: ${originalRpc.split('/').pop()}`);

// 模拟RPC失败
const newRpc = testManager.markCurrentRPCFailed();
console.log(`故障转移后RPC: ${newRpc.split('/').pop()}`);
console.log(`是否成功切换: ${originalRpc !== newRpc ? '✅ 是' : '❌ 否'}`);

// 测试3: 验证随机可用RPC获取
console.log('\n📊 测试3: 验证随机可用RPC获取');
for (let i = 0; i < 5; i++) {
  const randomRpc = testManager.getRandomAvailableRPC();
  console.log(`随机RPC ${i + 1}: ${randomRpc.split('/').pop()}`);
}

// 测试4: 显示统计信息
console.log('\n📊 测试4: RPC管理器统计信息');
const stats = testManager.getStats();
console.log('统计信息:', JSON.stringify(stats, null, 2));

console.log('\n✅ RPC管理器测试完成!');

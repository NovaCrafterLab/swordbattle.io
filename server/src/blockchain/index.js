// 区块链模块统一导出
// 提供所有区块链相关功能的入口

const BlockchainService = require('./BlockchainService');
const RPCManager = require('./RPCManager');
const networkConfig = require('./networkConfig');
const abis = require('./abis');

module.exports = {
  // 主要服务类
  BlockchainService,
  RPCManager,
  
  // 配置模块
  networkConfig,
  abis,
  
  // 快捷访问
  SWORD_BATTLE_ABI: abis.SWORD_BATTLE_ABI,
  ERC20_ABI: abis.ERC20_ABI,
  NETWORK_CONFIG: networkConfig.NETWORK_CONFIG,
  ENVIRONMENT: networkConfig.ENVIRONMENT,
  CURRENT_RPC_POOL: networkConfig.CURRENT_RPC_POOL,
  
  // 环境判断
  isDev: networkConfig.isDev,
  isRelease: networkConfig.isRelease,
}; 
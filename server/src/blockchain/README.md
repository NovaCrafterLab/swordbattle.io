# 区块链服务模块

这个目录包含了SwordBattle项目的区块链集成功能，采用模块化设计，便于维护和扩展。

## 模块结构

```
blockchain/
├── index.js              # 模块统一入口
├── BlockchainService.js  # 主要区块链服务类
├── RPCManager.js         # RPC节点管理和故障转移
├── networkConfig.js      # 网络配置和环境感知
├── abis.js              # 合约ABI管理
└── README.md            # 说明文档
```

## 核心模块

### BlockchainService.js
主要的区块链服务类，提供：
- 与BSC网络的连接和交互
- 合约读写操作封装
- EIP-712签名功能
- 自动RPC故障转移

### RPCManager.js
RPC节点管理器，功能包括：
- 多RPC节点池管理
- 自动故障检测和切换
- 健康检查和延迟测试
- 统计信息收集

### networkConfig.js
网络配置模块，包含：
- BSC主网/测试网RPC池
- 环境感知逻辑
- 网络参数配置

### abis.js
合约ABI管理，功能：
- 从客户端配置文件加载ABI
- 提供备用ABI（防止文件读取失败）
- 支持SwordBattle和ERC20合约

## 使用方法

### 基本使用
```javascript
const { BlockchainService } = require('./blockchain');

// 创建服务实例
const blockchainService = new BlockchainService(config);

// 初始化
await blockchainService.initialize();

// 读取合约
const contract = blockchainService.getSwordBattleContract();
const gameInfo = await blockchainService.readContract(
  contract, 
  'getGameInfo', 
  [gameId]
);
```

### 高级功能
```javascript
// 获取RPC统计
const stats = blockchainService.getRPCStats();

// 切换到最快的RPC
await blockchainService.switchToFastestRPC();

// 手动健康检查
await blockchainService.performHealthCheck();

// 重置失败的RPC节点
blockchainService.resetRPCFailures();
```

## 配置说明

### 环境变量
- `NODE_ENV`: 环境类型 (`development` | `production`)
- `BLOCKCHAIN_RPC_URL`: 自定义RPC地址（可选）
- `SWORD_BATTLE_CONTRACT`: SwordBattle合约地址
- `USD1_TOKEN_CONTRACT`: USD1代币合约地址
- `TRUSTED_SIGNER_PRIVATE_KEY`: 签名私钥

### 网络配置
- **开发环境**: 自动使用BSC测试网
- **生产环境**: 自动使用BSC主网
- **RPC池**: 内置多个高可用RPC节点

## 特性

### 🔄 自动故障转移
- 检测RPC节点故障
- 自动切换到可用节点
- 智能重试机制

### 📊 健康监控
- 定期健康检查
- 延迟测试
- 统计信息收集

### 🛡️ 错误处理
- 完善的错误捕获
- 自动重连机制
- 降级处理

### 🔧 易于维护
- 模块化设计
- 配置与代码分离
- 统一的接口

## 开发注意事项

1. **ABI文件路径**: 确保客户端的ABI文件路径正确
2. **环境变量**: 正确配置所有必需的环境变量
3. **网络连接**: 确保服务器能访问BSC网络
4. **私钥安全**: 妥善保管私钥，不要提交到版本控制

## 故障排除

### 常见问题

1. **ABI加载失败**
   - 检查客户端ABI文件是否存在
   - 确认文件路径是否正确

2. **RPC连接失败**
   - 检查网络连接
   - 尝试手动切换RPC节点

3. **合约地址错误**
   - 验证环境变量配置
   - 确认合约地址格式正确

### 调试命令
```javascript
// 获取环境信息
blockchainService.getEnvironmentInfo();

// 查看RPC统计
blockchainService.getRPCStats();

// 测试连接
await blockchainService.isConnected();
``` 
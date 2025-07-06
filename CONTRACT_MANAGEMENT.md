# 合约地址管理系统

这个系统提供了一个集中化的合约地址管理方案，让合约地址的更新变得简单和一致。

## 文件结构

- **`contract-config.json`** - 集中化的合约配置文件，包含所有合约地址
- **`update-contracts.js`** - 自动化脚本，用于更新环境文件中的合约地址
- **`env/`** - 各服务的环境配置文件

## 快速使用

### 1. 查看当前合约配置
```bash
yarn contracts:show
# 或
node update-contracts.js --show
```

### 2. 更新单个合约地址
```bash
# 更新测试网 GameAggregator 合约
node update-contracts.js --contract=gameAggregator --address=0x新地址

# 更新主网合约
node update-contracts.js --contract=gameAggregator --network=mainnet --address=0x新地址

# 更新代币合约
node update-contracts.js --contract=tokens.usd1 --address=0x新地址
```

### 3. 从配置文件同步所有地址
```bash
yarn contracts:sync
# 或  
node update-contracts.js --sync
```

## 支持的合约类型

### 主要合约
- `gameAggregator` - 游戏聚合器合约
- `swordBattle` - 剑战合约（签名验证用）
- `nftAggregator` - NFT聚合器合约  
- `economyAggregator` - 经济聚合器合约

### 代币合约
- `tokens.usd1` - USD1 稳定币
- `tokens.nclab` - NCLab 治理代币

### NFT 合约  
- `nfts.shovel` - 铲子 NFT
- `nfts.forge` - 铸造厂 NFT

### 服务合约
- `services.gameRewardManager` - 游戏奖励管理器
- `services.fragmentManager` - 碎片管理器
- `services.rewardManager` - 奖励管理器
- `services.shovelTraitManager` - 铲子特性管理器

## 工作流程

### 部署新合约后的更新流程

1. **更新合约地址**
   ```bash
   node update-contracts.js --contract=gameAggregator --address=0x新合约地址
   ```

2. **验证更新**
   ```bash
   yarn contracts:show
   ```

3. **重启服务**
   ```bash
   # 重启所有服务
   yarn dev:full
   
   # 或分别重启
   yarn dev:server
   yarn dev:client  
   yarn dev:api
   ```

4. **更新 ABI（如果合约逻辑有变化）**
   ```bash
   yarn sync-abis
   ```

### 批量更新流程

1. **编辑 contract-config.json**
   ```json
   {
     "contracts": {
       "gameAggregator": {
         "testnet": "0x新地址",
         "mainnet": "0x新地址"
       }
     }
   }
   ```

2. **同步到环境文件**
   ```bash
   yarn contracts:sync
   ```

## 环境文件映射

脚本会自动更新以下环境文件：

- **Server**: `env/server.env.development`
  - `GAME_AGGREGATOR_CONTRACT_TESTNET`
  - `GAME_AGGREGATOR_CONTRACT_MAINNET`

- **Client**: `env/client.env.development`  
  - `REACT_APP_GAME_AGGREGATOR_CONTRACT_TESTNET`
  - `REACT_APP_GAME_AGGREGATOR_CONTRACT_MAINNET`

- **API**: `env/api.env.development`
  - `GAME_AGGREGATOR_CONTRACT_TESTNET` 
  - `GAME_AGGREGATOR_CONTRACT_MAINNET`

## 注意事项

⚠️ **重要提醒**

1. **重启服务**: 更新合约地址后必须重启所有相关服务
2. **重新构建**: 客户端地址变化需要重新构建前端
3. **ABI 同步**: 如果合约逻辑有变化，需要更新 ABI 文件
4. **测试验证**: 更新后要测试合约交互是否正常

## 故障排除

### 常见问题

1. **环境变量未生效**
   - 确保已重启服务
   - 检查环境文件路径是否正确

2. **合约调用失败**  
   - 验证合约地址是否正确
   - 检查网络配置（测试网/主网）
   - 确认 ABI 是否匹配

3. **权限问题**
   - 确保 trusted signer 有合约操作权限
   - 检查合约的访问控制设置

### 调试命令

```bash
# 查看当前配置
yarn contracts:show

# 检查环境文件内容
cat env/server.env.development | grep GAME_AGGREGATOR

# 验证服务启动
yarn dev:server
```

## 扩展使用

### 添加新合约类型

1. 编辑 `contract-config.json` 添加新合约
2. 在 `update-contracts.js` 的 `CONTRACT_MAPPINGS` 中添加映射
3. 在环境文件中添加相应的环境变量

### 自定义环境

可以修改脚本支持不同的环境文件或配置结构。

---

**这个系统的优势**:
- ✅ 集中化管理所有合约地址
- ✅ 一次更新，自动同步到所有服务
- ✅ 减少手动错误
- ✅ 支持批量操作
- ✅ 提供完整的更新历史追踪
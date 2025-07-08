# VaultSDK 本地测试指南

## 前置要求

1. **Solana CLI** - 安装 Solana 命令行工具
   ```bash
   sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
   ```

2. **Anchor Framework** - 安装 Anchor 开发框架
   ```bash
   npm install -g @coral-xyz/anchor-cli
   ```

3. **Node.js** - 确保安装了 Node.js 和 npm

## 快速开始

### 1. 设置本地测试环境

```bash
# 运行自动设置脚本
npm run setup
```

这个脚本会：
- 检查必要的工具是否安装
- 启动本地 Solana 验证器
- 设置本地网络配置
- 构建 SDK

### 2. 运行快速测试

```bash
# 快速验证 SDK 基本功能
npm run test:quick
```

### 3. 运行完整测试

```bash
# 运行完整的端到端测试
npm run test:local
```

## 手动设置步骤

如果你想要手动设置，请按以下步骤操作：

### 1. 启动本地验证器

```bash
# 启动本地 Solana 验证器
solana-test-validator

# 在另一个终端中设置网络配置
solana config set --url localhost
```

### 2. 部署程序（可选）

如果你想要在本地测试完整的程序功能：

```bash
# 进入 vault 目录
cd ../vault

# 构建程序
anchor build

# 部署到本地网络
anchor deploy
```

### 3. 构建 SDK

```bash
# 回到 vault-sdk 目录
cd ../vault-sdk

# 构建 SDK
npm run build
```

### 4. 运行测试

```bash
# 快速测试
node quick-test.js

# 完整测试
node test-local.js

# 事件测试
node test-events.js

# 游戏发现测试
node test-game-discovery.js

## 测试内容

### 快速测试 (`quick-test.js`)
- ✅ SDK 初始化
- ✅ PDA 地址计算
- ✅ 网络连接验证

### 完整测试 (`test-local.js`)
- ✅ 测试环境设置
- ✅ 代币铸造和账户创建
- ✅ 游戏金库初始化
- ✅ 用户购买门票
- ✅ 游戏结束和奖励设置
- ✅ 用户领取奖励
- ✅ 管理员提款
- ✅ 账户信息查询

### 事件测试 (`test-events.js`)
- ✅ 实时事件监听
- ✅ 历史事件查询
- ✅ 事件过滤功能
- ✅ 事件类型验证

### 游戏发现测试 (`test-game-discovery.js`)
- ✅ 获取所有游戏ID
- ✅ 获取游戏详细信息
- ✅ 游戏统计信息
- ✅ 游戏筛选功能
- ✅ 游戏存在性检查

## 故障排除

### 1. 无法连接到本地网络

```bash
# 检查验证器是否运行
curl http://localhost:8899

# 如果未运行，启动验证器
solana-test-validator
```

### 2. 程序未部署

```bash
# 检查程序是否部署
solana program show AqDb3BxQhL5wmszt3iy8qrvPJ9Mu5MeF5uoUd1e65EaV

# 如果未部署，可以：
# 1. 部署到本地网络
# 2. 或者使用测试网络上的程序
```

### 3. SDK 构建失败

```bash
# 清理并重新安装依赖
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 4. 交易失败

- 确保账户有足够的 SOL 支付交易费用
- 检查代币账户是否正确创建
- 验证程序 ID 是否正确

## 测试网络

如果你想在测试网络上测试，可以修改测试脚本中的网络配置：

```javascript
// 使用 Devnet
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// 使用 Testnet
const connection = new Connection('https://api.testnet.solana.com', 'confirmed');
```

## 调试技巧

1. **查看交易日志**
   ```bash
   solana logs
   ```

2. **检查账户余额**
   ```bash
   solana balance <PUBLIC_KEY>
   ```

3. **查看代币余额**
   ```bash
   spl-token balance <TOKEN_MINT>
   ```

4. **查看程序账户**
   ```bash
   solana account <ACCOUNT_ADDRESS>
   ```

## 性能测试

对于性能测试，你可以：

1. 创建多个并发测试
2. 测试大量用户同时操作
3. 监控交易确认时间
4. 测试网络延迟影响

## 持续集成

你可以将测试集成到 CI/CD 流程中：

```yaml
# GitHub Actions 示例
- name: Test VaultSDK
  run: |
    npm install
    npm run build
    npm run test:quick
```

## 支持

如果遇到问题，请检查：

1. Solana 和 Anchor 版本是否兼容
2. 网络连接是否正常
3. 程序是否正确部署
4. 账户权限是否正确

更多信息请参考：
- [Solana 文档](https://docs.solana.com/)
- [Anchor 文档](https://book.anchor-lang.com/)
- [SPL Token 文档](https://spl.solana.com/token) 
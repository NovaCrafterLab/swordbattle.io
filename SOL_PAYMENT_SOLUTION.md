## 🚀 SOL 作为默认门票支付的解决方案

你遇到的问题是 VaultSDK 在处理 Wrapped SOL 时的 Associated Token Account 创建问题。以下是解决方案：

### 📋 问题分析

1. **TokenAccountNotFoundError**: VaultSDK 尝试为 vault 创建 Associated Token Account 时失败
2. **SOL vs Wrapped SOL**: 原生 SOL 不需要 token 账户，但 VaultSDK 将其作为 SPL token 处理
3. **Account 创建**: `getOrCreateAssociatedTokenAccount` 调用失败

### ✅ 解决方案选项

#### 选项 1: 修复 VaultSDK (推荐)

更新 VaultSDK 的 `initializeGameVault` 方法，对 Wrapped SOL 进行特殊处理：

```javascript
// 在 VaultSDK 中添加 SOL 检查
if (params.tokenMint.equals(NATIVE_MINT)) {
  // 对于原生 SOL，使用不同的逻辑
  // 不需要创建 Associated Token Account
} else {
  // 对于其他 SPL tokens，使用现有逻辑
  await getOrCreateAssociatedTokenAccount(...)
}
```

#### 选项 2: 暂时使用 USDC (当前)

```bash
# 当前设置使用 USDC
SOLANA_TOKEN_MINT=Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr
```

为服务器钱包获取测试 USDC：

1. 访问 https://faucet.solana.com/
2. 选择 "SPL Token" -> "USDC"
3. 输入钱包地址: `AzenzWGvnNUmN6E6tX1JeGpCn3kqrG6jTp5Dika8Ru3Z`

#### 选项 3: 使用原生 SOL 处理

直接在 vault 中存储 lamports 而不是通过 SPL token 系统。

### 🔧 当前配置状态

✅ **已完成:**

- SOL 配置正确设置
- 客户端优化使用 `/serverinfo` 而不是额外 API 调用
- Token 信息正确包含在游戏状态中

⚠️ **待解决:**

- VaultSDK 的 SOL Associated Token Account 创建问题

### 📍 下一步行动

1. **立即解决**: 使用 USDC 进行测试，从 faucet 获取测试币
2. **长期解决**: 修复 VaultSDK 对原生 SOL 的处理逻辑

你想选择哪个方案？我可以帮你：

1. 获取测试 USDC 并继续使用 USDC
2. 修复 VaultSDK 以正确处理原生 SOL
3. 或者实现一个混合解决方案

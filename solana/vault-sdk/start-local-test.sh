#!/bin/bash

echo "🔧 VaultSDK 本地测试环境设置"
echo "================================"

# 检查 Solana CLI 是否安装
if ! command -v solana &> /dev/null; then
    echo "❌ Solana CLI 未安装"
    echo "请先安装 Solana CLI: https://docs.solana.com/cli/install-solana-cli-tools"
    exit 1
fi

# 检查 Anchor 是否安装
if ! command -v anchor &> /dev/null; then
    echo "❌ Anchor 未安装"
    echo "请先安装 Anchor: https://book.anchor-lang.com/getting_started/installation.html"
    exit 1
fi

echo "✅ Solana CLI 和 Anchor 已安装"

# 检查本地验证器是否运行
if ! curl -s http://localhost:8899 > /dev/null; then
    echo "⚠️  本地 Solana 验证器未运行"
    echo "正在启动本地验证器..."
    
    # 启动本地验证器
    solana-test-validator &
    VALIDATOR_PID=$!
    
    echo "⏳ 等待验证器启动..."
    sleep 5
    
    # 检查验证器是否成功启动
    if curl -s http://localhost:8899 > /dev/null; then
        echo "✅ 本地验证器启动成功 (PID: $VALIDATOR_PID)"
        echo "💡 要停止验证器，请运行: kill $VALIDATOR_PID"
    else
        echo "❌ 本地验证器启动失败"
        exit 1
    fi
else
    echo "✅ 本地 Solana 验证器已在运行"
fi

# 设置本地网络配置
echo "🔧 设置本地网络配置..."
solana config set --url localhost

# 检查程序是否已部署
echo "🔍 检查程序是否已部署..."
if ! solana program show AqDb3BxQhL5wmszt3iy8qrvPJ9Mu5MeF5uoUd1e65EaV; then
    echo "⚠️  程序未部署到本地网络"
    echo "请先部署程序到本地网络:"
    echo "1. cd ../vault"
    echo "2. anchor build"
    echo "3. anchor deploy"
    echo ""
    echo "或者使用测试网络上的程序地址"
else
    echo "✅ 程序已部署到本地网络"
fi

# 构建 SDK
echo "🔨 构建 VaultSDK..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ SDK 构建成功"
else
    echo "❌ SDK 构建失败"
    exit 1
fi

echo ""
echo "🚀 环境设置完成！"
echo "现在可以运行测试:"
echo "  node test-local.js"
echo ""
echo "或者运行简单示例:"
echo "  node example-usage.js" 
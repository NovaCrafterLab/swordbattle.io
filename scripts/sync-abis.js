#!/usr/bin/env node

/**
 * ABI同步脚本
 * 将根目录的ABI文件同步到各个服务的src目录中
 * 这是必要的，因为一些构建工具不允许从src目录外部导入文件
 */

const fs = require('fs');
const path = require('path');

const ROOT_ABI_DIR = path.join(__dirname, '..', 'abis');
const CLIENT_ABI_DIR = path.join(__dirname, '..', 'client/src/abis');

console.log('🔄 Syncing ABI files...');

// 确保目标目录存在
if (!fs.existsSync(CLIENT_ABI_DIR)) {
  fs.mkdirSync(CLIENT_ABI_DIR, { recursive: true });
}

// 同步GameAggregator.json
const sourceFile = path.join(ROOT_ABI_DIR, 'GameAggregator.json');
const targetFile = path.join(CLIENT_ABI_DIR, 'GameAggregator.json');

if (fs.existsSync(sourceFile)) {
  fs.copyFileSync(sourceFile, targetFile);
  console.log('✅ GameAggregator.json synced to client');
} else {
  console.error('❌ Source ABI file not found:', sourceFile);
  process.exit(1);
}

console.log('🎉 ABI sync completed!');
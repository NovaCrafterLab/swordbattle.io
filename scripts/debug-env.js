#!/usr/bin/env node

/**
 * 环境变量调试脚本
 * 检查区块链相关的环境变量配置
 */

console.log('🔍 环境变量调试检查');
console.log('='.repeat(50));

// 加载环境变量
require('dotenv').config();
const config = require('../server/src/config');

console.log('📋 基础环境信息:');
console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`  SERVER_TYPE: ${process.env.SERVER_TYPE}`);
console.log(`  BLOCKCHAIN_ENABLED: ${process.env.BLOCKCHAIN_ENABLED}`);
console.log('');

console.log('🔗 区块链配置检查:');
console.log(`  config.isRaceServer: ${config.isRaceServer}`);
console.log(`  config.blockchain.enabled: ${config.blockchain.enabled}`);
console.log('');

console.log('📝 合约地址配置:');
console.log(`  SWORD_BATTLE_CONTRACT (env): ${process.env.SWORD_BATTLE_CONTRACT || '❌ 未设置'}`);
console.log(`  USD1_TOKEN_CONTRACT (env): ${process.env.USD1_TOKEN_CONTRACT || '❌ 未设置'}`);
console.log(`  config.blockchain.contracts.swordBattle: ${config.blockchain.contracts?.swordBattle || '❌ 未配置'}`);
console.log(`  config.blockchain.contracts.usd1Token: ${config.blockchain.contracts?.usd1Token || '❌ 未配置'}`);
console.log('');

console.log('🔐 签名者配置:');
const hasPrivateKey = !!process.env.TRUSTED_SIGNER_PRIVATE_KEY;
const privateKeyLength = process.env.TRUSTED_SIGNER_PRIVATE_KEY?.length || 0;
console.log(`  TRUSTED_SIGNER_PRIVATE_KEY: ${hasPrivateKey ? `✅ 已设置 (长度: ${privateKeyLength})` : '❌ 未设置'}`);
console.log(`  config.blockchain.trustedSigner: ${config.blockchain.trustedSigner ? '✅ 已配置' : '❌ 未配置'}`);
console.log('');

console.log('🌐 网络配置:');
console.log(`  BLOCKCHAIN_RPC_URL: ${process.env.BLOCKCHAIN_RPC_URL || '使用默认RPC池'}`);
console.log(`  config.blockchain.rpcUrl: ${config.blockchain.rpcUrl || '使用默认RPC池'}`);
console.log(`  环境: ${config.blockchain.environment?.isDev ? 'BSC测试网' : 'BSC主网'}`);
console.log(`  链ID: ${config.blockchain.environment?.chainId}`);
console.log('');

// 检查关键配置是否完整
console.log('✅ 配置完整性检查:');
const issues = [];

if (!config.isRaceServer) {
  issues.push('❌ 不是RACE服务器模式 (SERVER_TYPE !== "RACE")');
}

if (!config.blockchain.enabled) {
  issues.push('❌ 区块链功能未启用 (BLOCKCHAIN_ENABLED !== "true")');
}

if (!config.blockchain.contracts?.swordBattle) {
  issues.push('❌ SwordBattle合约地址未配置');
}

if (!config.blockchain.contracts?.usd1Token) {
  issues.push('❌ USD1代币合约地址未配置');
}

if (!config.blockchain.trustedSigner) {
  issues.push('❌ 可信签名者私钥未配置');
}

if (issues.length === 0) {
  console.log('🎉 所有配置都正确！');
} else {
  console.log('⚠️ 发现以下配置问题:');
  issues.forEach(issue => console.log(`  ${issue}`));
}

console.log('');
console.log('💡 如果有配置问题，请检查:');
console.log('  1. .env 文件是否存在且包含正确的变量');
console.log('  2. 环境变量是否在启动脚本中正确设置');
console.log('  3. 合约地址格式是否正确 (0x开头的42位十六进制)');
console.log('  4. 私钥格式是否正确 (0x开头的64位十六进制)'); 
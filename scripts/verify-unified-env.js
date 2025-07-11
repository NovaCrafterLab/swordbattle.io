#!/usr/bin/env node

// 统一环境配置验证脚本
// 验证客户端、服务器、API的环境配置是否正确统一

const path = require('path');
const fs = require('fs');

console.log('🔍 验证统一环境配置...\n');

// 清理之前的环境变量
Object.keys(process.env).forEach((key) => {
  if (
    key.startsWith('REACT_APP_') ||
    key.startsWith('BLOCKCHAIN_') ||
    key.startsWith('SERVER_') ||
    key.startsWith('API_')
  ) {
    delete process.env[key];
  }
});

// 设置基础环境
process.env.NODE_ENV = 'development';

console.log('📋 环境配置文件检查：');

// 检查所有环境配置文件
const envFiles = {
  client: 'env/client.env.development',
  server: 'env/server.env.development',
  api: 'env/api.env.development',
};

Object.entries(envFiles).forEach(([service, filePath]) => {
  const fullPath = path.resolve(__dirname, '..', filePath);
  const exists = fs.existsSync(fullPath);
  console.log(`   ${service.padEnd(8)}: ${filePath} ${exists ? '✅' : '❌'}`);
});

console.log('\n🔧 加载客户端环境配置：');
const clientEnvPath = path.resolve(
  __dirname,
  '..',
  'env',
  'client.env.development',
);
if (fs.existsSync(clientEnvPath)) {
  require('dotenv-expand')(require('dotenv').config({ path: clientEnvPath }));
  console.log('   ✅ 客户端配置已加载');
} else {
  console.log('   ❌ 客户端配置文件不存在');
}

console.log('\n🔧 加载服务器环境配置：');
const serverEnvPath = path.resolve(
  __dirname,
  '..',
  'env',
  'server.env.development',
);
if (fs.existsSync(serverEnvPath)) {
  require('dotenv-expand')(require('dotenv').config({ path: serverEnvPath }));
  console.log('   ✅ 服务器配置已加载');
} else {
  console.log('   ❌ 服务器配置文件不存在');
}

console.log('\n🔧 加载API环境配置：');
const apiEnvPath = path.resolve(__dirname, '..', 'env', 'api.env.development');
if (fs.existsSync(apiEnvPath)) {
  require('dotenv-expand')(require('dotenv').config({ path: apiEnvPath }));
  console.log('   ✅ API配置已加载');
} else {
  console.log('   ❌ API配置文件不存在');
}

console.log('\n📊 关键配置一致性检查：');

// 检查合约地址一致性
const contracts = {
  SWORD_BATTLE: {
    client: process.env.REACT_APP_SWORD_BATTLE_CONTRACT_TESTNET,
    server: process.env.SWORD_BATTLE_CONTRACT,
    api: process.env.SWORD_BATTLE_CONTRACT,
  },
  USD1_TOKEN: {
    client: process.env.REACT_APP_USD1_TOKEN_CONTRACT_TESTNET,
    server: process.env.USD1_TOKEN_CONTRACT,
    api: process.env.USD1_TOKEN_CONTRACT,
  },
};

Object.entries(contracts).forEach(([contractName, addresses]) => {
  console.log(`\n   ${contractName} 合约地址:`);
  console.log(`     客户端: ${addresses.client || '❌ 未设置'}`);
  console.log(`     服务器: ${addresses.server || '❌ 未设置'}`);
  console.log(`     API:   ${addresses.api || '❌ 未设置'}`);

  const allSame =
    addresses.client === addresses.server && addresses.server === addresses.api;
  const allSet = addresses.client && addresses.server && addresses.api;

  if (allSet && allSame) {
    console.log(`     状态:   ✅ 一致`);
  } else if (!allSet) {
    console.log(`     状态:   ❌ 有未设置的地址`);
  } else {
    console.log(`     状态:   ❌ 地址不一致`);
  }
});

// 检查API端点配置
console.log(`\n   API端点配置:`);
console.log(
  `     客户端: ${process.env.REACT_APP_API || process.env.REACT_APP_API_URL || '❌ 未设置'}`,
);
console.log(`     服务器: ${process.env.API_ENDPOINT || '❌ 未设置'}`);

const clientApi = process.env.REACT_APP_API || process.env.REACT_APP_API_URL;
const serverApi = process.env.API_ENDPOINT;

// API端点可以不同：客户端用localhost，服务器用容器名
const clientApiNormalized = clientApi
  ?.replace('localhost', 'api')
  .replace('http://', '')
  .replace(':8080', '');
const serverApiNormalized = serverApi
  ?.replace('localhost', 'api')
  .replace('http://', '')
  .replace(':8080', '');

if (clientApi && serverApi) {
  if (
    clientApiNormalized === serverApiNormalized ||
    (clientApi.includes('localhost') && serverApi.includes('api')) ||
    (clientApi.includes('localhost') && serverApi.includes('localhost'))
  ) {
    console.log(
      `     状态:   ✅ 配置正确（客户端用localhost，服务器可用容器名）`,
    );
  } else {
    console.log(`     状态:   ❌ 配置异常`);
  }
} else {
  console.log(`     状态:   ❌ 未设置`);
}

// 检查区块链配置
console.log(`\n   区块链配置:`);
console.log(
  `     服务器启用: ${process.env.BLOCKCHAIN_ENABLED || '❌ 未设置'}`,
);
console.log(`     API启用:   ${process.env.BLOCKCHAIN_ENABLED || '❌ 未设置'}`);
console.log(`     服务器类型: ${process.env.SERVER_TYPE || '❌ 未设置'}`);

// 统计结果
console.log('\n📈 配置统计：');
const reactAppVars = Object.keys(process.env).filter((key) =>
  key.startsWith('REACT_APP_'),
).length;
const serverVars = ['SERVER_PORT', 'SERVER_SECRET', 'API_ENDPOINT'].filter(
  (key) => process.env[key],
).length;
const blockchainVars = [
  'BLOCKCHAIN_ENABLED',
  'SWORD_BATTLE_CONTRACT',
  'USD1_TOKEN_CONTRACT',
].filter((key) => process.env[key]).length;

console.log(`   客户端变量 (REACT_APP_*): ${reactAppVars}`);
console.log(`   服务器核心变量: ${serverVars}/3`);
console.log(`   区块链变量: ${blockchainVars}/3`);

console.log('\n✅ 统一环境配置验证完成');

// 返回状态码
const allConfigsExist = Object.values(envFiles).every((file) =>
  fs.existsSync(path.resolve(__dirname, '..', file)),
);

const contractsConsistent = Object.values(contracts).every(
  (addresses) =>
    addresses.client === addresses.server &&
    addresses.server === addresses.api &&
    addresses.client,
);

if (
  allConfigsExist &&
  contractsConsistent &&
  reactAppVars > 0 &&
  serverVars === 3 &&
  blockchainVars === 3
) {
  console.log('\n🎉 所有配置检查通过！');
  process.exit(0);
} else {
  console.log('\n⚠️  部分配置需要修复');
  process.exit(1);
}

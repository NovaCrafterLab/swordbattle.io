#!/usr/bin/env node

/**
 * Contract Address Update Tool
 * 
 * 使用方法:
 * 1. 更新所有环境文件: node update-contracts.js
 * 2. 只更新特定合约: node update-contracts.js --contract=gameAggregator --address=0x123...
 * 3. 只更新特定网络: node update-contracts.js --network=testnet --contract=gameAggregator --address=0x123...
 * 4. 从 contract-config.json 同步所有地址: node update-contracts.js --sync
 */

const fs = require('fs');
const path = require('path');

// 配置文件路径
const CONTRACT_CONFIG_FILE = path.join(__dirname, '..', 'contract-config.json');
const ENV_DIR = path.join(__dirname, '..', 'env');

// 环境文件映射
const ENV_FILES = {
  server: path.join(ENV_DIR, 'server.env.development'),
  client: path.join(ENV_DIR, 'client.env.development'), 
  api: path.join(ENV_DIR, 'api.env.development')
};

// 合约名称映射（从 config JSON 到环境变量名）
// 现在只使用 GameAggregator 合约
const CONTRACT_MAPPINGS = {
  // 主要合约 - 只保留 GameAggregator
  gameAggregator: {
    server: 'GAME_AGGREGATOR_CONTRACT',
    client: 'REACT_APP_GAME_AGGREGATOR_CONTRACT',
    api: 'GAME_AGGREGATOR_CONTRACT'
  }
};

class ContractUpdater {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      return JSON.parse(fs.readFileSync(CONTRACT_CONFIG_FILE, 'utf8'));
    } catch (error) {
      console.error('❌ Failed to load contract-config.json:', error.message);
      process.exit(1);
    }
  }

  saveConfig() {
    this.config.lastUpdated = new Date().toISOString();
    fs.writeFileSync(CONTRACT_CONFIG_FILE, JSON.stringify(this.config, null, 2));
    console.log('✅ Updated contract-config.json');
  }

  // 从嵌套路径获取值（如 'tokens.usd1'）
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
  }

  // 设置嵌套路径的值
  setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  // 更新环境文件中的合约地址
  updateEnvFile(filePath, contractName, network, address) {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ File not found: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const envVarName = `${contractName}_${network.toUpperCase()}`;
    
    // 匹配并替换环境变量
    const regex = new RegExp(`^${envVarName}=.*$`, 'm');
    const newLine = `${envVarName}=${address}`;
    
    if (regex.test(content)) {
      content = content.replace(regex, newLine);
      fs.writeFileSync(filePath, content);
      return true;
    } else {
      console.warn(`⚠️ Environment variable ${envVarName} not found in ${filePath}`);
      return false;
    }
  }

  // 更新单个合约地址
  updateContract(contractPath, network, address) {
    const mapping = CONTRACT_MAPPINGS[contractPath];
    if (!mapping) {
      console.error(`❌ Unknown contract: ${contractPath}`);
      return false;
    }

    console.log(`🔄 Updating ${contractPath} (${network}) to ${address}`);

    // 更新配置文件
    const contractObj = this.getNestedValue(this.config, contractPath);
    if (contractObj) {
      contractObj[network] = address;
    }

    // 更新所有环境文件
    let updateCount = 0;
    for (const [service, envFile] of Object.entries(ENV_FILES)) {
      const envVarName = mapping[service];
      if (envVarName && this.updateEnvFile(envFile, envVarName, network, address)) {
        updateCount++;
      }
    }

    console.log(`✅ Updated ${updateCount} environment files`);
    return true;
  }

  // 从配置同步所有合约地址到环境文件
  syncAll() {
    console.log('🔄 Syncing all contract addresses from config...');
    
    let totalUpdates = 0;
    
    for (const [contractPath, mapping] of Object.entries(CONTRACT_MAPPINGS)) {
      const contractObj = this.getNestedValue(this.config, contractPath);
      if (!contractObj) continue;

      for (const network of ['testnet', 'mainnet']) {
        const address = contractObj[network];
        if (!address) continue;

        for (const [service, envFile] of Object.entries(ENV_FILES)) {
          const envVarName = mapping[service];
          if (envVarName && this.updateEnvFile(envFile, envVarName, network, address)) {
            totalUpdates++;
          }
        }
      }
    }
    
    console.log(`✅ Synced ${totalUpdates} contract addresses`);
  }

  // 显示当前配置
  showConfig() {
    console.log('📋 Current Contract Configuration:');
    console.log('=====================================');
    
    // 主要合约 - 只显示 GameAggregator
    console.log('\\n🎮 Main Contracts:');
    if (this.config.contracts && this.config.contracts.gameAggregator) {
      const contract = this.config.contracts.gameAggregator;
      console.log(`  gameAggregator:`);
      console.log(`    Testnet: ${contract.testnet}`);
      console.log(`    Mainnet: ${contract.mainnet}`);
    }

    // 注释：其他合约类型已移除，现在只使用 GameAggregator
    console.log('\\n⚠️  Note: Only GameAggregator contract is currently supported.');
    console.log('   Other contract types have been removed as they are no longer used.');
  }
}

// 命令行参数解析
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  
  for (const arg of args) {
    if (arg.startsWith('--')) {
      const [key, value] = arg.substring(2).split('=');
      options[key] = value || true;
    }
  }
  
  return options;
}

// 主函数
function main() {
  const options = parseArgs();
  const updater = new ContractUpdater();

  console.log('🚀 Contract Address Update Tool');
  console.log('================================');

  // 显示配置
  if (options.show || options.config) {
    updater.showConfig();
    return;
  }

  // 从配置同步所有地址
  if (options.sync) {
    updater.syncAll();
    return;
  }

  // 更新特定合约
  if (options.contract && options.address) {
    const network = options.network || 'testnet';
    const success = updater.updateContract(options.contract, network, options.address);
    
    if (success) {
      updater.saveConfig();
      console.log('\\n✅ Contract address updated successfully!');
      console.log('\\n⚠️ Remember to:');
      console.log('  1. Restart all services');
      console.log('  2. Rebuild client if addresses changed');
      console.log('  3. Update ABIs if contract logic changed');
    } else {
      console.log('\\n❌ Failed to update contract address');
      process.exit(1);
    }
    return;
  }

  // 显示帮助
  console.log('Usage:');
  console.log('  node update-contracts.js --show                               # Show current config');
  console.log('  node update-contracts.js --sync                               # Sync all from config');
  console.log('  node update-contracts.js --contract=gameAggregator --address=0x123...  # Update specific contract');
  console.log('  node update-contracts.js --contract=gameAggregator --network=mainnet --address=0x123...');
  console.log('');
  console.log('Available contracts:');
  console.log('  - gameAggregator (only supported contract)');
}

if (require.main === module) {
  main();
}

module.exports = ContractUpdater;
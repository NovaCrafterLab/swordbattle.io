// 区块链合约ABI定义
const fs = require('fs');
const path = require('path');

// 加载完整的GameAggregator合约ABI
function loadGameAggregatorABI() {
  try {
    const abiPath = path.join(__dirname, 'abis', 'GameAggregator.json');
    const abiData = fs.readFileSync(abiPath, 'utf8');
    const parsedData = JSON.parse(abiData);
    // 如果ABI被包装在对象中，提取abi数组
    return parsedData.abi || parsedData;
  } catch (error) {
    console.error('Failed to load GameAggregator ABI:', error);
    throw new Error('Unable to load GameAggregator contract ABI');
  }
}

// 加载完整的SwordBattle合约ABI（用于基础数据查询）
function loadSwordBattleABI() {
  try {
    const abiPath = path.join(__dirname, 'abis', 'swordbattle.abi.json');
    const abiData = fs.readFileSync(abiPath, 'utf8');
    return JSON.parse(abiData);
  } catch (error) {
    console.error('Failed to load SwordBattle ABI:', error);
    throw new Error('Unable to load SwordBattle contract ABI');
  }
}

// 标准ERC20 ABI
function loadERC20ABI() {
  return [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
}

// 加载完整的RewardManager合约ABI
function loadRewardManagerABI() {
  try {
    const abiPath = path.join(__dirname, 'abis', 'RewardManager.json');
    const abiData = fs.readFileSync(abiPath, 'utf8');
    const parsedData = JSON.parse(abiData);
    // 如果ABI被包装在对象中，提取abi数组
    return parsedData.abi || parsedData;
  } catch (error) {
    console.error('Failed to load RewardManager ABI:', error);
    throw new Error('Unable to load RewardManager contract ABI');
  }
}

// 加载并导出ABI
const GAME_AGGREGATOR_ABI = loadGameAggregatorABI();
const SWORD_BATTLE_ABI = loadSwordBattleABI();
const ERC20_ABI = loadERC20ABI();
const REWARD_MANAGER_ABI = loadRewardManagerABI();

module.exports = {
  SWORD_BATTLE_ABI,
  GAME_AGGREGATOR_ABI,
  ERC20_ABI,
  REWARD_MANAGER_ABI
}; 
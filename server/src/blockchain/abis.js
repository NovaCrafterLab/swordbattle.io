// 合约ABI配置
// 从客户端配置文件导入ABI

const path = require('path');
const fs = require('fs');

// 读取SwordBattle合约ABI
function loadSwordBattleABI() {
  try {
    const abiPath = path.resolve(__dirname, './abis/DeploySword.json');
    const abiData = fs.readFileSync(abiPath, 'utf8');
    return JSON.parse(abiData);
  } catch (error) {
    console.error('Failed to load SwordBattle ABI:', error);
    // 如果文件读取失败，返回基础ABI
    return getSwordBattleFallbackABI();
  }
}

// 读取ERC20合约ABI
function loadERC20ABI() {
  try {
    const abiPath = path.resolve(__dirname, './abis/ERC20.json');
    const abiData = fs.readFileSync(abiPath, 'utf8');
    const parsedData = JSON.parse(abiData);
    // ERC20.json文件结构为 { "abi": [...] }
    return parsedData.abi || parsedData;
  } catch (error) {
    console.error('Failed to load ERC20 ABI:', error);
    // 如果文件读取失败，返回基础ABI
    return getERC20FallbackABI();
  }
}

// SwordBattle合约备用ABI（基础功能）
function getSwordBattleFallbackABI() {
  return [
    {
      "inputs": [],
      "name": "createGame",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "gameId",
          "type": "uint256"
        }
      ],
      "name": "joinGame",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "gameId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "score",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "nonce",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "signature",
          "type": "bytes"
        }
      ],
      "name": "submitScore",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "gameId",
          "type": "uint256"
        }
      ],
      "name": "getGameInfo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "gameId_",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "playerCount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalPool",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "ended",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "createdAt",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endedAt",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "cleaned",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "gameDuration",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isExpired",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
}

// ERC20备用ABI（基础功能）
function getERC20FallbackABI() {
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

// 加载并导出ABI
const SWORD_BATTLE_ABI = loadSwordBattleABI();
const ERC20_ABI = loadERC20ABI();

// 验证ABI加载情况
console.log(`SwordBattle ABI loaded: ${SWORD_BATTLE_ABI.length} functions`);
console.log(`ERC20 ABI loaded: ${ERC20_ABI.length} functions`);

module.exports = {
  SWORD_BATTLE_ABI,
  ERC20_ABI,
  loadSwordBattleABI,
  loadERC20ABI,
  getSwordBattleFallbackABI,
  getERC20FallbackABI,
}; 
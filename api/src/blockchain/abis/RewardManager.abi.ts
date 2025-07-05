export const RewardManagerABI = [
          {
            "type": "constructor",
            "inputs": [
              { "name": "_usd1Token", "type": "address", "internalType": "address" },
              { "name": "_nclabToken", "type": "address", "internalType": "address" },
              { "name": "_shovelNFT", "type": "address", "internalType": "address" },
              {
                "name": "_randomnessService",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "_traitManager",
                "type": "address",
                "internalType": "address"
              }
            ],
            "stateMutability": "nonpayable"
          },
          {
            "type": "function",
            "name": "DEFAULT_ADMIN_ROLE",
            "inputs": [],
            "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
            "stateMutability": "view"
          },
          {
            "type": "function",
            "name": "addEligiblePlayer",
            "inputs": [
              { "name": "gameId", "type": "uint256", "internalType": "uint256" },
              { "name": "player", "type": "address", "internalType": "address" },
              {
                "name": "guaranteedReward",
                "type": "uint256",
                "internalType": "uint256"
              }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
          },
          {
            "type": "function",
            "name": "calculateAndDistributeRewards",
            "inputs": [
              { "name": "gameId", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
          },
          {
            "type": "function",
            "name": "claimAllNclabRewards",
            "inputs": [
              { "name": "player", "type": "address", "internalType": "address" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
          },
          {
            "type": "function",
            "name": "claimAllRewards",
            "inputs": [
              { "name": "player", "type": "address", "internalType": "address" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
          },
          {
            "type": "function",
            "name": "claimAllUSDRewards",
            "inputs": [
              { "name": "player", "type": "address", "internalType": "address" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
          },
          {
            "type": "function",
            "name": "claimNclabRewards",
            "inputs": [
              { "name": "gameId", "type": "uint256", "internalType": "uint256" },
              { "name": "player", "type": "address", "internalType": "address" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
          },
          {
            "type": "function",
            "name": "claimReward",
            "inputs": [
              { "name": "gameId", "type": "uint256", "internalType": "uint256" },
              { "name": "player", "type": "address", "internalType": "address" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
          },
          {
            "type": "function",
            "name": "claimRewardsPaginated",
            "inputs": [
              { "name": "player", "type": "address", "internalType": "address" },
              { "name": "startGameId", "type": "uint256", "internalType": "uint256" },
              { "name": "endGameId", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
          },
          {
            "type": "function",
            "name": "claimUSDRewards",
            "inputs": [
              { "name": "gameId", "type": "uint256", "internalType": "uint256" },
              { "name": "player", "type": "address", "internalType": "address" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
          },
          {
            "type": "function",
            "name": "conductLottery",
            "inputs": [
              { "name": "gameId", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
          },
          {
            "type": "function",
            "name": "cooldownPeriod",
            "inputs": [],
            "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
            "stateMutability": "view"
          },
          {
            "type": "function",
            "name": "emergencyWithdraw",
            "inputs": [
              { "name": "token", "type": "address", "internalType": "address" },
              { "name": "to", "type": "address", "internalType": "address" },
              { "name": "amount", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
          },
          {
            "type": "function",
            "name": "getClaimableGames",
            "inputs": [
              { "name": "player", "type": "address", "internalType": "address" },
              { "name": "maxGames", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [
              { "name": "gameIds", "type": "uint256[]", "internalType": "uint256[]" },
              { "name": "readyToClaim", "type": "bool[]", "internalType": "bool[]" }
            ],
            "stateMutability": "view"
          },
          {
            "type": "function",
            "name": "getCooldownStatus",
            "inputs": [
              { "name": "player", "type": "address", "internalType": "address" }
            ],
            "outputs": [
              {
                "name": "lastClaimTime",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "nextClaimTime",
                "type": "uint256",
                "internalType": "uint256"
              },
              { "name": "canClaim", "type": "bool", "internalType": "bool" }
            ],
            "stateMutability": "view"
          },
          {
            "type": "function",
            "name": "getGameLotteryInfo",
            "inputs": [
              { "name": "gameId", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [
              {
                "name": "eligiblePlayers",
                "type": "address[]",
                "internalType": "address[]"
              },
              { "name": "winners", "type": "address[]", "internalType": "address[]" },
              { "name": "lotteryPool", "type": "uint256", "internalType": "uint256" },
              { "name": "lotteryDrawn", "type": "bool", "internalType": "bool" }
            ],
            "stateMutability": "view"
          },
          {
            "type": "function",
            "name": "getPendingRewards",
            "inputs": [
              { "name": "player", "type": "address", "internalType": "address" }
            ],
            "outputs": [
              {
                "name": "pendingGames",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "totalClaimed",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "nextClaimTime",
                "type": "uint256",
                "internalType": "uint256"
              },
              { "name": "canClaimNow", "type": "bool", "internalType": "bool" }
            ],
            "stateMutability": "view"
          },
          {
            "type": "function",
            "name": "getPendingRewardsPaginated",
            "inputs": [
              { "name": "player", "type": "address", "internalType": "address" },
              { "name": "startGameId", "type": "uint256", "internalType": "uint256" },
              { "name": "limit", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [
              {
                "name": "pendingGames",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "totalClaimed",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "nextClaimTime",
                "type": "uint256",
                "internalType": "uint256"
              },
              { "name": "canClaimNow", "type": "bool", "internalType": "bool" },
              { "name": "hasMore", "type": "bool", "internalType": "bool" }
            ],
            "stateMutability": "view"
          },
          {
            "type": "function",
            "name": "getPlayerCooldownStatus",
            "inputs": [
              { "name": "player", "type": "address", "internalType": "address" }
            ],
            "outputs": [
              {
                "name": "lastClaimTime",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "totalClaimed",
                "type": "uint256",
                "internalType": "uint256"
              },
              { "name": "canClaimNow", "type": "bool", "internalType": "bool" }
            ],
            "stateMutability": "view"
          },
          {
            "type": "function",
            "name": "getPlayerRewardStatus",
            "inputs": [
              { "name": "gameId", "type": "uint256", "internalType": "uint256" },
              { "name": "player", "type": "address", "internalType": "address" }
            ],
            "outputs": [
              { "name": "usdRewards", "type": "uint256", "internalType": "uint256" },
              {
                "name": "nclabRewards",
                "type": "uint256",
                "internalType": "uint256"
              },
              { "name": "usdClaimable", "type": "bool", "internalType": "bool" },
              { "name": "nclabClaimable", "type": "bool", "internalType": "bool" },
              {
                "name": "nclabClaimableTime",
                "type": "uint256",
                "internalType": "uint256"
              },
              { "name": "usdClaimed", "type": "bool", "internalType": "bool" },
              { "name": "nclabClaimed", "type": "bool", "internalType": "bool" }
            ],
            "stateMutability": "view"
          },
          {
            "type": "function",
            "name": "getPlayerRewards",
            "inputs": [
              { "name": "gameId", "type": "uint256", "internalType": "uint256" },
              { "name": "player", "type": "address", "internalType": "address" }
            ],
            "outputs": [
              { "name": "killReward", "type": "uint256", "internalType": "uint256" },
              {
                "name": "lotteryReward",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "guaranteedReward",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "fragmentReward",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "claimableTime",
                "type": "uint256",
                "internalType": "uint256"
              },
              { "name": "canClaim", "type": "bool", "internalType": "bool" }
            ],
            "stateMutability": "view"
          },
          {
            "type": "function",
            "name": "getRoleAdmin",
            "inputs": [
              { "name": "role", "type": "bytes32", "internalType": "bytes32" }
            ],
            "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
            "stateMutability": "view"
          },
          {
            "type": "function",
            "name": "grantRole",
            "inputs": [
              { "name": "role", "type": "bytes32", "internalType": "bytes32" },
              { "name": "account", "type": "address", "internalType": "address" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
          },
          {
            "type": "function",
            "name": "hasRole",
            "inputs": [
              { "name": "role", "type": "bytes32", "internalType": "bytes32" },
              { "name": "account", "type": "address", "internalType": "address" }
            ],
            "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
            "stateMutability": "view"
          },
          {
            "type": "function",
            "name": "lotteryData",
            "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
            "outputs": [
              { "name": "lotteryPool", "type": "uint256", "internalType": "uint256" },
              { "name": "lotteryDrawn", "type": "bool", "internalType": "bool" },
              {
                "name": "lotteryCommitter",
                "type": "address",
                "internalType": "address"
              },
              { "name": "lotteryNonce", "type": "uint256", "internalType": "uint256" }
            ],
            "stateMutability": "view"
          },
          {
            "type": "function",
            "name": "nclabToken",
            "inputs": [],
            "outputs": [
              { "name": "", "type": "address", "internalType": "contract IERC20" }
            ],
            "stateMutability": "view"
          },
          {
            "type": "function",
            "name": "playerCooldowns",
            "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
            "outputs": [
              {
                "name": "lastNclabClaimTime",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "totalRewardsClaimed",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "totalNclabClaimed",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "totalUsdClaimed",
                "type": "uint256",
                "internalType": "uint256"
              }
            ],
            "stateMutability": "view"
          },
          {
            "type": "function",
            "name": "randomnessService",
            "inputs": [],
            "outputs": [
              {
                "name": "",
                "type": "address",
                "internalType": "contract IRandomnessService"
              }
            ],
            "stateMutability": "view"
          },
          {
            "type": "function",
            "name": "renounceRole",
            "inputs": [
              { "name": "role", "type": "bytes32", "internalType": "bytes32" },
              { "name": "account", "type": "address", "internalType": "address" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
          },
          {
            "type": "function",
            "name": "revokeRole",
            "inputs": [
              { "name": "role", "type": "bytes32", "internalType": "bytes32" },
              { "name": "account", "type": "address", "internalType": "address" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
          },
          {
            "type": "function",
            "name": "setGameContract",
            "inputs": [
              { "name": "gameContract", "type": "address", "internalType": "address" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
          },
          {
            "type": "function",
            "name": "setGameRewardPools",
            "inputs": [
              { "name": "gameId", "type": "uint256", "internalType": "uint256" },
              {
                "name": "killRewardPool",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "survivalRewardPool",
                "type": "uint256",
                "internalType": "uint256"
              },
              { "name": "lotteryPool", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
          },
          {
            "type": "function",
            "name": "setLotteryRandomness",
            "inputs": [
              { "name": "gameId", "type": "uint256", "internalType": "uint256" },
              { "name": "committer", "type": "address", "internalType": "address" },
              { "name": "nonce", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
          },
          {
            "type": "function",
            "name": "setPlayerReward",
            "inputs": [
              { "name": "gameId", "type": "uint256", "internalType": "uint256" },
              { "name": "player", "type": "address", "internalType": "address" },
              { "name": "killReward", "type": "uint256", "internalType": "uint256" },
              {
                "name": "survivalReward",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "guaranteedReward",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "fragmentReward",
                "type": "uint256",
                "internalType": "uint256"
              }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
          },
          {
            "type": "function",
            "name": "setTraitManager",
            "inputs": [
              {
                "name": "_traitManager",
                "type": "address",
                "internalType": "address"
              }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
          },
          {
            "type": "function",
            "name": "shovelNFT",
            "inputs": [],
            "outputs": [
              {
                "name": "",
                "type": "address",
                "internalType": "contract ShovelNFTSlim"
              }
            ],
            "stateMutability": "view"
          },
          {
            "type": "function",
            "name": "supportsInterface",
            "inputs": [
              { "name": "interfaceId", "type": "bytes4", "internalType": "bytes4" }
            ],
            "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
            "stateMutability": "view"
          },
          {
            "type": "function",
            "name": "traitManager",
            "inputs": [],
            "outputs": [
              {
                "name": "",
                "type": "address",
                "internalType": "contract IShovelTraitManager"
              }
            ],
            "stateMutability": "view"
          },
          {
            "type": "function",
            "name": "updateContracts",
            "inputs": [
              { "name": "_usd1Token", "type": "address", "internalType": "address" },
              { "name": "_nclabToken", "type": "address", "internalType": "address" },
              { "name": "_shovelNFT", "type": "address", "internalType": "address" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
          },
          {
            "type": "function",
            "name": "updateCooldownPeriod",
            "inputs": [
              {
                "name": "newCooldownPeriod",
                "type": "uint256",
                "internalType": "uint256"
              }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
          },
          {
            "type": "function",
            "name": "usd1Token",
            "inputs": [],
            "outputs": [
              { "name": "", "type": "address", "internalType": "contract IERC20" }
            ],
            "stateMutability": "view"
          },
          {
            "type": "event",
            "name": "BatchRewardsClaimed",
            "inputs": [
              {
                "name": "player",
                "type": "address",
                "indexed": true,
                "internalType": "address"
              },
              {
                "name": "usdRewards",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
              },
              {
                "name": "nclabRewards",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
              },
              {
                "name": "gameCount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
              }
            ],
            "anonymous": false
          },
          {
            "type": "event",
            "name": "CooldownUpdated",
            "inputs": [
              {
                "name": "newCooldownPeriod",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
              }
            ],
            "anonymous": false
          },
          {
            "type": "event",
            "name": "GuaranteedRewardCalculated",
            "inputs": [
              {
                "name": "player",
                "type": "address",
                "indexed": true,
                "internalType": "address"
              },
              {
                "name": "amount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
              }
            ],
            "anonymous": false
          },
          {
            "type": "event",
            "name": "LotteryDrawn",
            "inputs": [
              {
                "name": "gameId",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
              },
              {
                "name": "winners",
                "type": "address[]",
                "indexed": false,
                "internalType": "address[]"
              }
            ],
            "anonymous": false
          },
          {
            "type": "event",
            "name": "RewardClaimed",
            "inputs": [
              {
                "name": "gameId",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
              },
              {
                "name": "player",
                "type": "address",
                "indexed": true,
                "internalType": "address"
              },
              {
                "name": "usdReward",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
              },
              {
                "name": "nclabReward",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
              }
            ],
            "anonymous": false
          },
          {
            "type": "event",
            "name": "RoleAdminChanged",
            "inputs": [
              {
                "name": "role",
                "type": "bytes32",
                "indexed": true,
                "internalType": "bytes32"
              },
              {
                "name": "previousAdminRole",
                "type": "bytes32",
                "indexed": true,
                "internalType": "bytes32"
              },
              {
                "name": "newAdminRole",
                "type": "bytes32",
                "indexed": true,
                "internalType": "bytes32"
              }
            ],
            "anonymous": false
          },
          {
            "type": "event",
            "name": "RoleGranted",
            "inputs": [
              {
                "name": "role",
                "type": "bytes32",
                "indexed": true,
                "internalType": "bytes32"
              },
              {
                "name": "account",
                "type": "address",
                "indexed": true,
                "internalType": "address"
              },
              {
                "name": "sender",
                "type": "address",
                "indexed": true,
                "internalType": "address"
              }
            ],
            "anonymous": false
          },
          {
            "type": "event",
            "name": "RoleRevoked",
            "inputs": [
              {
                "name": "role",
                "type": "bytes32",
                "indexed": true,
                "internalType": "bytes32"
              },
              {
                "name": "account",
                "type": "address",
                "indexed": true,
                "internalType": "address"
              },
              {
                "name": "sender",
                "type": "address",
                "indexed": true,
                "internalType": "address"
              }
            ],
            "anonymous": false
          }
        ];
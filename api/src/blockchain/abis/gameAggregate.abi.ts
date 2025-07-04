export const GAME_AGGREGATE_ABI = [
  {
    "abi": [
      {
        "type": "constructor",
        "inputs": [
          {
            "name": "_swordBattle",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "_gameConfigManager",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "_gameRewardManager",
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
        "name": "MAX_BATCH_SIZE",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "MAX_HISTORY_RECORDS",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "createGame",
        "inputs": [
          {
            "name": "level",
            "type": "uint8",
            "internalType": "enum IGameAggregator.GameLevel"
          }
        ],
        "outputs": [
          { "name": "gameId", "type": "uint256", "internalType": "uint256" }
        ],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "createMultipleGames",
        "inputs": [
          {
            "name": "levels",
            "type": "uint8[]",
            "internalType": "enum IGameAggregator.GameLevel[]"
          }
        ],
        "outputs": [
          { "name": "gameIds", "type": "uint256[]", "internalType": "uint256[]" }
        ],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "endGame",
        "inputs": [
          { "name": "gameId", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "forceEndGame",
        "inputs": [
          { "name": "gameId", "type": "uint256", "internalType": "uint256" },
          { "name": "reason", "type": "string", "internalType": "string" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "gameConfigManager",
        "inputs": [],
        "outputs": [
          {
            "name": "",
            "type": "address",
            "internalType": "contract GameConfigManager"
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "gameRewardManager",
        "inputs": [],
        "outputs": [
          {
            "name": "",
            "type": "address",
            "internalType": "contract GameRewardManager"
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "getActiveGames",
        "inputs": [
          {
            "name": "level",
            "type": "uint8",
            "internalType": "enum IGameAggregator.GameLevel"
          },
          { "name": "limit", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [
          {
            "name": "activeGames",
            "type": "tuple[]",
            "internalType": "struct IGameAggregator.GameFullInfo[]",
            "components": [
              { "name": "gameId", "type": "uint256", "internalType": "uint256" },
              {
                "name": "level",
                "type": "uint8",
                "internalType": "enum IGameAggregator.GameLevel"
              },
              {
                "name": "status",
                "type": "uint8",
                "internalType": "enum IGameAggregator.GameStatus"
              },
              {
                "name": "totalPool",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "createdAt",
                "type": "uint256",
                "internalType": "uint256"
              },
              { "name": "endedAt", "type": "uint256", "internalType": "uint256" },
              {
                "name": "gameDuration",
                "type": "uint32",
                "internalType": "uint32"
              },
              {
                "name": "playerCount",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "maxPlayers",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "activePlayers",
                "type": "address[]",
                "internalType": "address[]"
              },
              { "name": "canJoin", "type": "bool", "internalType": "bool" },
              { "name": "entryFee", "type": "uint256", "internalType": "uint256" }
            ]
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "getGameFullInfo",
        "inputs": [
          { "name": "gameId", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [
          {
            "name": "gameInfo",
            "type": "tuple",
            "internalType": "struct IGameAggregator.GameFullInfo",
            "components": [
              { "name": "gameId", "type": "uint256", "internalType": "uint256" },
              {
                "name": "level",
                "type": "uint8",
                "internalType": "enum IGameAggregator.GameLevel"
              },
              {
                "name": "status",
                "type": "uint8",
                "internalType": "enum IGameAggregator.GameStatus"
              },
              {
                "name": "totalPool",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "createdAt",
                "type": "uint256",
                "internalType": "uint256"
              },
              { "name": "endedAt", "type": "uint256", "internalType": "uint256" },
              {
                "name": "gameDuration",
                "type": "uint32",
                "internalType": "uint32"
              },
              {
                "name": "playerCount",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "maxPlayers",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "activePlayers",
                "type": "address[]",
                "internalType": "address[]"
              },
              { "name": "canJoin", "type": "bool", "internalType": "bool" },
              { "name": "entryFee", "type": "uint256", "internalType": "uint256" }
            ]
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "getGameStats",
        "inputs": [
          { "name": "startTime", "type": "uint256", "internalType": "uint256" },
          { "name": "endTime", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [
          { "name": "totalGames", "type": "uint256", "internalType": "uint256" },
          {
            "name": "totalPlayers",
            "type": "uint256",
            "internalType": "uint256"
          },
          { "name": "totalPool", "type": "uint256", "internalType": "uint256" },
          {
            "name": "avgPlayersPerGame",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "getJoinableGames",
        "inputs": [
          {
            "name": "level",
            "type": "uint8",
            "internalType": "enum IGameAggregator.GameLevel"
          },
          { "name": "player", "type": "address", "internalType": "address" }
        ],
        "outputs": [
          {
            "name": "joinableGames",
            "type": "tuple[]",
            "internalType": "struct IGameAggregator.GameFullInfo[]",
            "components": [
              { "name": "gameId", "type": "uint256", "internalType": "uint256" },
              {
                "name": "level",
                "type": "uint8",
                "internalType": "enum IGameAggregator.GameLevel"
              },
              {
                "name": "status",
                "type": "uint8",
                "internalType": "enum IGameAggregator.GameStatus"
              },
              {
                "name": "totalPool",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "createdAt",
                "type": "uint256",
                "internalType": "uint256"
              },
              { "name": "endedAt", "type": "uint256", "internalType": "uint256" },
              {
                "name": "gameDuration",
                "type": "uint32",
                "internalType": "uint32"
              },
              {
                "name": "playerCount",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "maxPlayers",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "activePlayers",
                "type": "address[]",
                "internalType": "address[]"
              },
              { "name": "canJoin", "type": "bool", "internalType": "bool" },
              { "name": "entryFee", "type": "uint256", "internalType": "uint256" }
            ]
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "getPlayerCurrentGames",
        "inputs": [
          { "name": "player", "type": "address", "internalType": "address" }
        ],
        "outputs": [
          {
            "name": "currentGames",
            "type": "tuple[]",
            "internalType": "struct IGameAggregator.GameFullInfo[]",
            "components": [
              { "name": "gameId", "type": "uint256", "internalType": "uint256" },
              {
                "name": "level",
                "type": "uint8",
                "internalType": "enum IGameAggregator.GameLevel"
              },
              {
                "name": "status",
                "type": "uint8",
                "internalType": "enum IGameAggregator.GameStatus"
              },
              {
                "name": "totalPool",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "createdAt",
                "type": "uint256",
                "internalType": "uint256"
              },
              { "name": "endedAt", "type": "uint256", "internalType": "uint256" },
              {
                "name": "gameDuration",
                "type": "uint32",
                "internalType": "uint32"
              },
              {
                "name": "playerCount",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "maxPlayers",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "activePlayers",
                "type": "address[]",
                "internalType": "address[]"
              },
              { "name": "canJoin", "type": "bool", "internalType": "bool" },
              { "name": "entryFee", "type": "uint256", "internalType": "uint256" }
            ]
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "getPlayerGameHistory",
        "inputs": [
          { "name": "player", "type": "address", "internalType": "address" },
          { "name": "limit", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [
          {
            "name": "games",
            "type": "tuple[]",
            "internalType": "struct IGameAggregator.PlayerGameInfo[]",
            "components": [
              { "name": "gameId", "type": "uint256", "internalType": "uint256" },
              {
                "name": "level",
                "type": "uint8",
                "internalType": "enum IGameAggregator.GameLevel"
              },
              {
                "name": "status",
                "type": "uint8",
                "internalType": "enum IGameAggregator.GameStatus"
              },
              {
                "name": "joinedAt",
                "type": "uint256",
                "internalType": "uint256"
              },
              { "name": "kills", "type": "uint256", "internalType": "uint256" },
              { "name": "score", "type": "uint256", "internalType": "uint256" },
              {
                "name": "scoreSubmitted",
                "type": "bool",
                "internalType": "bool"
              },
              { "name": "rewardClaimed", "type": "bool", "internalType": "bool" }
            ]
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "getPlayerStats",
        "inputs": [
          { "name": "player", "type": "address", "internalType": "address" }
        ],
        "outputs": [
          {
            "name": "totalGamesPlayed",
            "type": "uint256",
            "internalType": "uint256"
          },
          { "name": "totalKills", "type": "uint256", "internalType": "uint256" },
          { "name": "totalScore", "type": "uint256", "internalType": "uint256" },
          {
            "name": "avgScorePerGame",
            "type": "uint256",
            "internalType": "uint256"
          },
          { "name": "winRate", "type": "uint256", "internalType": "uint256" }
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
        "name": "getSupportedFeatures",
        "inputs": [],
        "outputs": [
          { "name": "features", "type": "string[]", "internalType": "string[]" }
        ],
        "stateMutability": "pure"
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
        "name": "joinGame",
        "inputs": [
          { "name": "gameId", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "joinMultipleGames",
        "inputs": [
          { "name": "gameIds", "type": "uint256[]", "internalType": "uint256[]" }
        ],
        "outputs": [
          { "name": "successCount", "type": "uint256", "internalType": "uint256" }
        ],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "pause",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "paused",
        "inputs": [],
        "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
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
        "name": "smartJoinGame",
        "inputs": [
          {
            "name": "level",
            "type": "uint8",
            "internalType": "enum IGameAggregator.GameLevel"
          },
          { "name": "maxWaitTime", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [
          { "name": "gameId", "type": "uint256", "internalType": "uint256" }
        ],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "submitScore",
        "inputs": [
          { "name": "gameId", "type": "uint256", "internalType": "uint256" },
          { "name": "player", "type": "address", "internalType": "address" },
          { "name": "kills", "type": "uint256", "internalType": "uint256" },
          { "name": "score", "type": "uint256", "internalType": "uint256" },
          { "name": "nonce", "type": "uint256", "internalType": "uint256" },
          { "name": "signature", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
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
        "name": "swordBattle",
        "inputs": [],
        "outputs": [
          {
            "name": "",
            "type": "address",
            "internalType": "contract SwordBattle"
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "unpause",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "updateGameConfig",
        "inputs": [
          {
            "name": "level",
            "type": "uint8",
            "internalType": "enum IGameAggregator.GameLevel"
          },
          { "name": "entryFee", "type": "uint256", "internalType": "uint256" },
          { "name": "killReward", "type": "uint256", "internalType": "uint256" },
          { "name": "active", "type": "bool", "internalType": "bool" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "version",
        "inputs": [],
        "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
        "stateMutability": "pure"
      },
      {
        "type": "event",
        "name": "AggregatorInitialized",
        "inputs": [
          {
            "name": "swordBattle",
            "type": "address",
            "indexed": false,
            "internalType": "address"
          },
          {
            "name": "gameConfigManager",
            "type": "address",
            "indexed": false,
            "internalType": "address"
          },
          {
            "name": "gameRewardManager",
            "type": "address",
            "indexed": false,
            "internalType": "address"
          }
        ],
        "anonymous": false
      },
      {
        "type": "event",
        "name": "AggregatorStatusChanged",
        "inputs": [
          {
            "name": "aggregator",
            "type": "address",
            "indexed": true,
            "internalType": "address"
          },
          {
            "name": "statusType",
            "type": "bytes32",
            "indexed": true,
            "internalType": "bytes32"
          },
          {
            "name": "oldValue",
            "type": "bytes32",
            "indexed": false,
            "internalType": "bytes32"
          },
          {
            "name": "newValue",
            "type": "bytes32",
            "indexed": false,
            "internalType": "bytes32"
          }
        ],
        "anonymous": false
      },
      {
        "type": "event",
        "name": "BatchOperationCompleted",
        "inputs": [
          {
            "name": "aggregator",
            "type": "address",
            "indexed": true,
            "internalType": "address"
          },
          {
            "name": "user",
            "type": "address",
            "indexed": true,
            "internalType": "address"
          },
          {
            "name": "operationType",
            "type": "bytes32",
            "indexed": true,
            "internalType": "bytes32"
          },
          {
            "name": "itemCount",
            "type": "uint256",
            "indexed": false,
            "internalType": "uint256"
          },
          {
            "name": "success",
            "type": "bool",
            "indexed": false,
            "internalType": "bool"
          }
        ],
        "anonymous": false
      },
      {
        "type": "event",
        "name": "BatchOperationExecuted",
        "inputs": [
          {
            "name": "user",
            "type": "address",
            "indexed": true,
            "internalType": "address"
          },
          {
            "name": "operation",
            "type": "string",
            "indexed": false,
            "internalType": "string"
          },
          {
            "name": "count",
            "type": "uint256",
            "indexed": false,
            "internalType": "uint256"
          },
          {
            "name": "success",
            "type": "bool",
            "indexed": false,
            "internalType": "bool"
          }
        ],
        "anonymous": false
      },
      {
        "type": "event",
        "name": "CrossAggregatorAction",
        "inputs": [
          {
            "name": "fromAggregator",
            "type": "address",
            "indexed": true,
            "internalType": "address"
          },
          {
            "name": "toAggregator",
            "type": "address",
            "indexed": true,
            "internalType": "address"
          },
          {
            "name": "actionType",
            "type": "bytes32",
            "indexed": true,
            "internalType": "bytes32"
          },
          {
            "name": "data",
            "type": "bytes",
            "indexed": false,
            "internalType": "bytes"
          }
        ],
        "anonymous": false
      },
      {
        "type": "event",
        "name": "GameInfoCached",
        "inputs": [
          {
            "name": "gameId",
            "type": "uint256",
            "indexed": true,
            "internalType": "uint256"
          }
        ],
        "anonymous": false
      },
      {
        "type": "event",
        "name": "Paused",
        "inputs": [
          {
            "name": "account",
            "type": "address",
            "indexed": false,
            "internalType": "address"
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
      },
      {
        "type": "event",
        "name": "Unpaused",
        "inputs": [
          {
            "name": "account",
            "type": "address",
            "indexed": false,
            "internalType": "address"
          }
        ],
        "anonymous": false
      },
      {
        "type": "event",
        "name": "UserOperationRecorded",
        "inputs": [
          {
            "name": "user",
            "type": "address",
            "indexed": true,
            "internalType": "address"
          },
          {
            "name": "aggregator",
            "type": "address",
            "indexed": true,
            "internalType": "address"
          },
          {
            "name": "operation",
            "type": "bytes32",
            "indexed": true,
            "internalType": "bytes32"
          },
          {
            "name": "inputData",
            "type": "bytes",
            "indexed": false,
            "internalType": "bytes"
          },
          {
            "name": "outputData",
            "type": "bytes",
            "indexed": false,
            "internalType": "bytes"
          },
          {
            "name": "timestamp",
            "type": "uint256",
            "indexed": false,
            "internalType": "uint256"
          }
        ],
        "anonymous": false
      }
    ],
    "bytecode": {
      "object": "0x60e0346200030e57601f620052b738819003918201601f191683019291906001600160401b03841183851017620003135781606092849260409687528339810103126200030e57620000518162000329565b60206200006d846200006583860162000329565b940162000329565b906001805560ff1992836002541660025560018060a01b03809116948515620002ca5781169283156200027c57169283156200022e57916060939185937fe1febe7fa57d6d3ddfa6d9985db1e7931fdd27c1cae552e54be192192a3c5f95966080528260a0528360c052600090818052818352888220338352835260ff898320541615620001e4575b5050865193845283015284820152a151614f7890816200033f823960805181818161034a015281816105e8015281816107840152818161085c01528181610adc01528181610cf201528181610e1e01528181610f30015281816112080152818161131e015281816119a801528181611b8701528181611d2d01528181611e1d0152818161237b015281816125f9015281816127300152818161286901528181612b3601528181612c0b01528181613e4201528181614330015281816145b30152818161479801528181614b510152614d73015260a0518181816124e00152612698015260c05181611fc10152f35b8180528183528882203383528352600189832091825416179055339033907f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d8180a43880620000f6565b855162461bcd60e51b815260048101839052602160248201527f496e76616c69642047616d655265776172644d616e61676572206164647265736044820152607360f81b6064820152608490fd5b865162461bcd60e51b815260048101849052602160248201527f496e76616c69642047616d65436f6e6669674d616e61676572206164647265736044820152607360f81b6064820152608490fd5b865162461bcd60e51b815260048101849052601b60248201527f496e76616c69642053776f7264426174746c65206164647265737300000000006044820152606490fd5b600080fd5b634e487b7160e01b600052604160045260246000fd5b51906001600160a01b03821682036200030e5756fe60a080604052600436101561001357600080fd5b600090813560e01c90816301ffc9a71461300c57508063080dd89714612dc65780630e9510d314612ba557806321714e5a1461254e578063248a9ca3146125045780632e15f1b7146124955780632f2ff15d1461239f5780632f7bbb7c1461233057806336568abe1461224b5780633f4ba83a146121045780634fd66eae146120a257806354fd4d50146120265780635c975abb14611fe55780636388607c14611f7657806363b2092d14611da8578063718072e514611aee57806373d682e01461191757806380bc0241146116905780638456cb59146115a557806384eabd981461156f5780639056ed191461129b57806390f0c30f1461109b57806391d1485414611024578063a217fddf14610fea578063bb53936414610ec5578063cfdbf25414610e8b578063d0399bb814610c83578063d42b4fe914610a61578063d547741f14610a03578063e580f6ab146107f6578063efaa55a014610579578063fcdaa843146101c85763fe39a0591461018c57600080fd5b346101c557807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557602060405160648152f35b80fd5b50346101c5576020807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610575576102016130ca565b73ffffffffffffffffffffffffffffffffffffffff9081811693848152600384526040812094604051808787829954938481520190855287852092855b8982821061055f57505050610255925003876137d9565b61025f8651613cf9565b938293835b8851811080610555575b156104255761027d818a613dd2565b516040517f21714e5a0000000000000000000000000000000000000000000000000000000081528160048201528681602481305afa879181610401575b506102cf5750506102ca90613d48565b610264565b604001516102dc81613110565b6102e581613110565b156102f5575b506102ca90613d48565b6040517f3ccd10e90000000000000000000000000000000000000000000000000000000081526004810182905273ffffffffffffffffffffffffffffffffffffffff8416602482015291969160a080826044817f00000000000000000000000000000000000000000000000000000000000000008a165afa91829189936103ce575b505061039e575081610396916103906102ca948b613dd2565b52613d48565b955b906102eb565b919691841685146103b4575b506102ca90610398565b866103c7916103906102ca94998b613dd2565b95906103aa565b6103ee929350803d106103fa575b6103e681836137d9565b810190614742565b50505050903880610377565b503d6103dc565b61041e9192503d808a833e61041681836137d9565b8101906149af565b90386102ba565b8486888a61043283614942565b93805b84811061044e576040518061044a8882613268565b0390f35b8061045c61052a9286613dd2565b51604051907f21714e5a00000000000000000000000000000000000000000000000000000000825260048201528381602481305afa849181610539575b5061052f57506104a98186613dd2565b516040516104b6816137a1565b848152604051916104c683613754565b825284868301528460408301528460608301524260808301528460a08301526104b060c08301528460e0830152603261010083015261012082015283610140820152836101608201526105198289613dd2565b526105248188613dd2565b50613d48565b610435565b6105198289613dd2565b61054e9192503d8087833e61041681836137d9565b9089610499565b506032811061026e565b855484526001958601958c95509301920161023e565b5080fd5b50346101c5576020807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126105755781600435916105b7613bce565b6105bf613ad1565b82151580610741575b6105d190613b3b565b73ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016803b1561073d576040517fffcd664b000000000000000000000000000000000000000000000000000000008152600481018590523360248201529083908290604490829084905af180156107325761071e575b507f40944ed08eec80557ce5c9075e417a343e3129b68a1d354eab41f9eb13b2b60f6107146106d56107017f8220f570e4b005d68596d255b336e271b0c27d56fe85eeba2edb223767c4ec6f96338752600386526106bc8160408920613ba0565b6040805187810192835233602084015293849290910190565b037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe081018352826137d9565b604051918291858352309583019061330b565b0390a46001805580f35b6107288391613771565b610575573861065b565b6040513d85823e3d90fd5b8280fd5b506040517f2e0be39a000000000000000000000000000000000000000000000000000000008152818160048173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165afa9081156107325783916107bd575b508311156105c8565b809350828092503d83116107ef575b6107d681836137d9565b810103126107ea576105d1849251906107b4565b600080fd5b503d6107cc565b50346101c557602090817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c5576004359060038210156101c55761083d6133ad565b610845613ad1565b73ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000169061088683613110565b60ff831661089381613110565b823b1561057557604051907fe580f6ab0000000000000000000000000000000000000000000000000000000082526108ca81613110565b6004820152818160248183875af180156109f8579085916109de575b50600492604051938480927f2e0be39a0000000000000000000000000000000000000000000000000000000082525afa9182156109d15781926109a0575b506106d561095f7f7ea5995f15533e692d3a0d38d3cddee9cd69c521b79a138e1a062813881ecae093946040519283913390888a8501613a9a565b7f40944ed08eec80557ce5c9075e417a343e3129b68a1d354eab41f9eb13b2b60f6040518681528061099530948983019061330b565b0390a4604051908152f35b91508382813d83116109ca575b6109b781836137d9565b810103126107ea579051906106d5610924565b503d6109ad565b50604051903d90823e3d90fd5b82939291506109ec90613771565b610575579083386108e6565b6040513d84823e3d90fd5b50346101c55760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557610a5e600435610a416130ed565b9080845283602052610a596001604086200154613643565b61381a565b80f35b50346101c55760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c55760043560249081356040517f2e0be39a00000000000000000000000000000000000000000000000000000000815260208160048173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165afa908115610c78578591610c47575b5084938593869360019384805b610b5a575b5060809894505086159250610b549150505750610b3b8383614a99565b915b604051938452602084015260408301526060820152f35b91610b3d565b8181111580610c3c575b15610c37576040517f21714e5a0000000000000000000000000000000000000000000000000000000081528160048201528a818781305afa8b9181610c1a575b50610bb95750610bb390613d48565b85610b19565b608081015184868210159182610c0f575b5050610bdb575b50610bb390613d48565b9798610bb391976060610bff610bf3610c0894613d48565b9c60e08d0151906138ba565b9a0151906138ba565b9690610bd1565b111590508438610bca565b610c309192508c3d8091833e61041681836137d9565b9038610ba4565b610b1e565b5060c8811115610b64565b90506020813d8211610c70575b81610c61602093836137d9565b810103126107ea575138610b0c565b3d9150610c54565b6040513d87823e3d90fd5b50346101c5576020807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610575578160043591610cc16133ad565b610cc9613ad1565b82151580610ddb575b610cdb90613b3b565b73ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016803b1561073d578280916024604051809481937fd0399bb80000000000000000000000000000000000000000000000000000000083528960048401525af1801561073257610dc7575b50604080518281019485523360208601527f32e14f02472b8af8804e03a91cb17bda4e1620e4b0bd706bfaf6591dcf13c613947f40944ed08eec80557ce5c9075e417a343e3129b68a1d354eab41f9eb13b2b60f92610dc19291610701918391016106d5565b0390a480f35b610dd18391613771565b6105755738610d5b565b506040517f2e0be39a000000000000000000000000000000000000000000000000000000008152818160048173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165afa908115610732578391610e57575b50831115610cd2565b809350828092503d8311610e84575b610e7081836137d9565b810103126107ea57610cdb84925190610e4e565b503d610e66565b50346101c557807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557602060405160148152f35b50346101c55760807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557806004356003811015610fe757606435801515809103610fe357610f176133ad565b60ff73ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001692610f5a81613110565b1690610f6582613110565b823b15610fde57608484928360405195869485937f92bf9248000000000000000000000000000000000000000000000000000000008552610fa581613110565b60048501526024356024850152604435604485015260648401525af180156109f857610fce5750f35b610fd790613771565b6101c55780f35b505050fd5b5050fd5b50fd5b50346101c557807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557602090604051908152f35b50346101c55760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c55773ffffffffffffffffffffffffffffffffffffffff60406110736130ed565b92600435815280602052209116600052602052602060ff604060002054166040519015158152f35b50346101c55760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c5576004356003811015610575576110e86110e26130ed565b91614d2a565b916110f38351614942565b92815b815181101561128d578061110d6111569284613dd2565b51604051907f21714e5a00000000000000000000000000000000000000000000000000000000825260048201528481602481305afa859181611271575b5061115b57505b613d48565b6110f6565b8473ffffffffffffffffffffffffffffffffffffffff80881690816111a7575b50506111965761118b8288613dd2565b526105248187613dd2565b8461014082015261118b8288613dd2565b9091506111b48487613dd2565b516040517f3ccd10e9000000000000000000000000000000000000000000000000000000008152600481019190915273ffffffffffffffffffffffffffffffffffffffff8916602482015260a080826044817f000000000000000000000000000000000000000000000000000000000000000087165afa9182918a9361124e575b505061124757505050845b388061117b565b1614611240565b611265929350803d106103fa576103e681836137d9565b50505050903880611235565b6112869192503d8088833e61041681836137d9565b903861114a565b6040518061044a8782613268565b50346101c5576020807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126105755760043567ffffffffffffffff811161073d576112ec90369060040161337c565b926112f56133ad565b6112fd613ad1565b83151580611564575b61131290949294613c7c565b61131b82613cf9565b937f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16825b8481106113ef575050506040519182527fb9745c261ad04a51e2d9d144832e700a74e3a197e28b3e4c49ee8fed12ba659f600192838582015233907f800493701560a25a61ac399cae28677078400019f3c4505817eda94075d4a47260403092a46040519280840190808552855180925280604086019601925b8281106113dc5785870386f35b83518752958101959281019284016113cf565b604096949651907f2e0be39a00000000000000000000000000000000000000000000000000000000918281528781600481875afa801561152c5790889161153b575b505061143e818986613d75565b356003811015611537578061145460ff92613110565b1661145e81613110565b833b1561153757604051907fe580f6ab00000000000000000000000000000000000000000000000000000000825261149581613110565b6004820152858160248183885af1801561152c57908691611514575b50506040519182528682600481865afa8015610c785785906114e5575b6114dd92506103908288613dd2565b959395611355565b508682813d831161150d575b6114fb81836137d9565b810103126107ea576114dd91516114ce565b503d6114f1565b61151d90613771565b6115285784386114b1565b8480fd5b6040513d88823e3d90fd5b8580fd5b813d831161155d575b61154e81836137d9565b810103126107ea578638611431565b503d611544565b506014841115611306565b50346101c557602061159961158336613149565b9061158c613bce565b611594613ad1565b613de6565b60018055604051908152f35b50346101c557807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c5576115dc6133ad565b6115e4613ad1565b60017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0060025416176002557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586020604051338152a17f03d87756d0359861a8ed751161c405747027362fc6301ef3fdd73959fc4cb597604051828152600160208201527f0ec8a27bc1d78f5677fb6a7386d39ba9d6072daad757c759162941a8e164455960403092a380f35b50346101c557807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c55760405160c0810181811067ffffffffffffffff8211176118e85760405260058152815b60a081106118d7575090604051916116f983613785565b600e83526020927f47414d455f4c4946454359434c450000000000000000000000000000000000008482015261172e82613d85565b5261173881613d85565b5060405161174581613785565b601081527f42415443485f4f5045524154494f4e53000000000000000000000000000000008482015261177782613d92565b5261178181613d92565b5060405161178e81613785565b600a81527f534d4152545f4a4f494e00000000000000000000000000000000000000000000848201526117c082613da2565b526117ca81613da2565b506040516117d781613785565b600a81527f53544154495354494353000000000000000000000000000000000000000000008482015261180982613db2565b5261181381613db2565b5060405161182081613785565b601081527f484953544f52595f545241434b494e47000000000000000000000000000000008482015261185282613dc2565b5261185c81613dc2565b5060405191838301848452825180915260408401948060408360051b870101940192955b82871061188d5785850386f35b9091929382806118c7837fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc08a60019603018652885161330b565b9601920196019592919092611880565b8060606020809385010152016116e2565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b50346101c557602090817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c55760043567ffffffffffffffff81116105755761196990369060040161337c565b9190611973613bce565b61197b613ad1565b82151580611ae3575b61198d90613c7c565b8192829173ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016925b828110611a355786867fa8b1e558bcb66c17f6332dc242cd87a126502dffabaf9577917b5b875e2784a76040518281528215158482015233907f800493701560a25a61ac399cae28677078400019f3c4505817eda94075d4a47260403092a460018055604051908152f35b611a40818484613d75565b35843b15611537576040517fffcd664b0000000000000000000000000000000000000000000000000000000081526004810191909152336024820152858082604481838a5af19182611acf575b5050611aa157611a9c90613d48565b6119ca565b94611ac9611a9c913387526003895261115160408820611ac28a8888613d75565b3590613ba0565b95613d48565b611ad890613771565b611537578538611a8d565b506014831115611984565b50346101c55760c07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557600435611b296130ed565b6044356064359060a435928567ffffffffffffffff9485811161057557611b5490369060040161334e565b92611b5d613ad1565b87151580611ce9575b611b6f90613b3b565b73ffffffffffffffffffffffffffffffffffffffff807f000000000000000000000000000000000000000000000000000000000000000016803b15611528578492838b611c14604051978896879586947ff713f6a40000000000000000000000000000000000000000000000000000000086526004860152169a8b60248501528c60448501528d6064850152608435608485015260c060a485015260c4840191613c3d565b03925af180156109f857611cd5575b50506040519460208601526040850152606084015260808301526080825260a0820190828210908211176118e8577f48d199e75660baeb3b30fd8bd5be4592f7c9da61cb5b7b0050e5ef839da53c43917f40944ed08eec80557ce5c9075e417a343e3129b68a1d354eab41f9eb13b2b60f828593604052602081527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff603093611cce60c082018261330b565b030190a480f35b611cde90613771565b611537578538611c23565b506040517f2e0be39a00000000000000000000000000000000000000000000000000000000815260208160048173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165afa908115611d9d578491611d66575b50881115611b66565b9350506020833d8211611d95575b81611d81602093836137d9565b810103126107ea57611b6f89935190611d5d565b3d9150611d74565b6040513d86823e3d90fd5b50346101c55760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c55760043560243567ffffffffffffffff811161073d57611dfb90369060040161334e565b9190611e056133ad565b8373ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016803b156105755781906024604051809481937fd0399bb80000000000000000000000000000000000000000000000000000000083528860048401525af18015610c7857611f37575b5091611eff8492611ecd7fc51504901bc5d945509fa70bf3d74c05a9de2a03c81913ac53b37c8847831423956040519485936020850152606060408501526080840191613c3d565b336060830152037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe081018352826137d9565b7f40944ed08eec80557ce5c9075e417a343e3129b68a1d354eab41f9eb13b2b60f6040516020815280610dc13094602083019061330b565b7fc51504901bc5d945509fa70bf3d74c05a9de2a03c81913ac53b37c8847831423939192611ecd95611f6b611eff93613771565b955092919350611e85565b50346101c557807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557602060405173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168152f35b50346101c557807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557602060ff600254166040519015158152f35b50346101c557807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c55761044a60405161206481613785565b600581527f312e302e30000000000000000000000000000000000000000000000000000000602082015260405191829160208352602083019061330b565b50346101c55760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c55760a06120e46120df6130ca565b614ad2565b926040929192519485526020850152604084015260608301526080820152f35b50346101c557807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c55761213b6133ad565b60025460ff8116156121ed577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00166002557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa6020604051338152a17f03d87756d0359861a8ed751161c405747027362fc6301ef3fdd73959fc4cb597604051600181528260208201527f0ec8a27bc1d78f5677fb6a7386d39ba9d6072daad757c759162941a8e164455960403092a380f35b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f5061757361626c653a206e6f74207061757365640000000000000000000000006044820152fd5b50346101c55760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c5576122836130ed565b3373ffffffffffffffffffffffffffffffffffffffff8216036122ac57610a5e9060043561381a565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201527f20726f6c657320666f722073656c6600000000000000000000000000000000006064820152fd5b50346101c557807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557602060405173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168152f35b50346101c55760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c5576004356123da6130ed565b818352826020526123f16001604085200154613643565b8183528260205273ffffffffffffffffffffffffffffffffffffffff6040842091169081845260205260ff6040842054161561242b578280f35b81835282602052604083208184526020526040832060017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0082541617905533917f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d8480a438808280f35b50346101c557807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557602060405173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168152f35b50346101c55760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557600160406020926004358152808452200154604051908152f35b50346101c55760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557612586614463565b50600435151580612af2575b61259b90613b3b565b6125a660043561459c565b95604095919492939551957f47e1d550000000000000000000000000000000000000000000000000000000008752600435600488015260e08760248173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165afa968715612ae7578997612aaf575b5061263387613110565b61263f60ff8816613110565b604051937f0d4158c200000000000000000000000000000000000000000000000000000000855261267260ff8916613110565b60ff8816600486015260208560248173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165afa948515612aa4578a95612a6c575b506126d288613110565b6126de60ff8916613110565b6126e88787614729565b93895193604051957f185f31b000000000000000000000000000000000000000000000000000000000875260208760048173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165afa968715612a61578d97612a29575b5099979593918c99979593917fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe06127b48e516127aa61279e82613ce1565b604051806080526137d9565b8060805152613ce1565b0136602060805101378a9b5b8d518d1015612913578d9e6128508f8f8f9173ffffffffffffffffffffffffffffffffffffffff916127f191613dd2565b5116604051907f3ccd10e9000000000000000000000000000000000000000000000000000000008252818060a09586936004356004840190929173ffffffffffffffffffffffffffffffffffffffff6020916040840195845216910152565b038173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165afa9192826128ef575b50506128be57506128b06128b6918f610390600191608051613dd2565b9d613d48565b9c9e506127c0565b9d909d156128d0575b6128b690613d48565b9c6128e76128b6918f610390600191608051613dd2565b9d90506128c7565b612906929350803d106103fa576103e681836137d9565b5092505050903880612893565b8d9a9c506129238f9c9a9c613cf9565b988a5b8c5181101561298e578c61293c82608051613dd2565b51612951575b5061294c90613d48565b612926565b8c8c610390849f73ffffffffffffffffffffffffffffffffffffffff61297d61294c9761298597613dd2565b511692613dd2565b9b90508c612942565b5061044a9d9a506129b260ff916129bd9e63ffffffff999a9b9e5191600435614771565b9a6040519d8e613754565b6004358e526129cd818316613110565b1660208d01526129dc81613110565b60408c015260608b015260808a015260a08901521660c087015260e08601526101008501526101208401521515610140830152610160820152604051918291602083526020830190613186565b9096506020813d602011612a59575b81612a45602093836137d9565b81010312612a555751958b612760565b8c80fd5b3d9150612a38565b6040513d8f823e3d90fd5b9094506020813d602011612a9c575b81612a88602093836137d9565b81010312612a98575193386126c8565b8980fd5b3d9150612a7b565b6040513d8c823e3d90fd5b612ad291975060e03d60e011612ae0575b612aca81836137d9565b8101906144cb565b505050925050509538612629565b503d612ac0565b6040513d8b823e3d90fd5b506040517f2e0be39a00000000000000000000000000000000000000000000000000000000815260208160048173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165afa80156109f8578290612b71575b60043511159050612592565b506020813d602011612b9d575b81612b8b602093836137d9565b810103126105755761259b9051612b65565b3d9150612b7e565b50346101c557612bb436613149565b90918115612dbd575b60328211612db4575b6040517f2e0be39a000000000000000000000000000000000000000000000000000000008152602093848260048173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165afa918215610732578392612d85575b50612c4584614942565b9083925b80151580612d7c575b15612d3c576040517f21714e5a0000000000000000000000000000000000000000000000000000000081528160048201528581602481305afa869181612d20575b50612ca75750612ca290613936565b612c49565b8288820151612cb581613110565b612cbe82613110565b612cc781613110565b1480612d02575b612cdd575b50612ca290613936565b84612cfb91612cf0612ca2949787613dd2565b526105248186613dd2565b9390612cd3565b506040810151612d1181613110565b612d1a81613110565b15612cce565b612d359192503d8089833e61041681836137d9565b9038612c93565b5050612d4782614942565b925b828110612d5e576040518061044a8682613268565b80612d6c612d779284613dd2565b51612cf08287613dd2565b612d49565b50858410612c52565b9091508481813d8311612dad575b612d9d81836137d9565b8101031261073d57519038612c3b565b503d612d93565b60329150612bc6565b60149150612bbd565b50346101c55760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557612dfe6130ca565b60249173ffffffffffffffffffffffffffffffffffffffff8335921681526020916003835260408220604051808286829454938481520190865286862092865b88828210612ff657505050612e55925003826137d9565b81151580612fec575b15612fe2575090925b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0612eaa612e9484613ce1565b93612ea260405195866137d9565b808552613ce1565b0190845b828110612f56575050506040519180830190808452825180925280604085019301945b828110612ede5784840385f35b9091928261010060019260e089518051835284810151612efd81613110565b858401526040810151612f0f81613110565b6040840152606080820151908401526080808201519084015260a0808201519084015260c0808201511515908401520151151560e082015201960191019492919094612ed1565b604095939551610100810181811067ffffffffffffffff821117612fb6579086929160405285815285838201528560408201528560608201528560808201528560a08201528560c08201528560e082015282828901015201949294612eae565b83867f4e487b710000000000000000000000000000000000000000000000000000000081526041600452fd5b9050519092612e67565b5080518210612e5e565b8554845260019586019587955093019201612e3e565b9050346105755760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610575576004357fffffffff00000000000000000000000000000000000000000000000000000000811680910361073d57602092507f7965db0b0000000000000000000000000000000000000000000000000000000081149081156130a0575b5015158152f35b7f01ffc9a70000000000000000000000000000000000000000000000000000000091501438613099565b6004359073ffffffffffffffffffffffffffffffffffffffff821682036107ea57565b6024359073ffffffffffffffffffffffffffffffffffffffff821682036107ea57565b6003111561311a57565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc60409101126107ea5760043560038110156107ea579060243590565b906101809182820181518352602090818301516131a281613110565b8285015260408301516131b481613110565b6040850152606083015160608501526080830151608085015260a083015160a085015263ffffffff60c08401511660c085015260e083015160e085015261010080840151908501526101209485840151958501528451809152816101a0850195019160005b82811061323e5750505050610140808201511515908301526101608091015191015290565b835173ffffffffffffffffffffffffffffffffffffffff1687529581019592810192600101613219565b602080820190808352835180925260408301928160408460051b8301019501936000915b84831061329c5750505050505090565b90919293949584806132d8837fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc086600196030187528a51613186565b980193019301919493929061328c565b60005b8381106132fb5750506000910152565b81810151838201526020016132eb565b907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f602093613347815180928187528780880191016132e8565b0116010190565b9181601f840112156107ea5782359167ffffffffffffffff83116107ea57602083818601950101116107ea57565b9181601f840112156107ea5782359167ffffffffffffffff83116107ea576020808501948460051b0101116107ea57565b3360009081527fad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb5602090815260408083205490929060ff16156133ef57505050565b6133f833613961565b9080845190613406826137bd565b60428252848201926060368537825115613616576030845382516001908110156135e95790607860218501536041915b80831161356a5750505061350e57604861350a9386936134d4936134c598519889937f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008a860152613490815180928c6037890191016132e8565b8401917f206973206d697373696e6720726f6c65200000000000000000000000000000006037840152518093868401906132e8565b010360288101875201856137d9565b519283927f08c379a00000000000000000000000000000000000000000000000000000000084526004840152602483019061330b565b0390fd5b6064848651907f08c379a000000000000000000000000000000000000000000000000000000000825280600483015260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152fd5b909192600f811660108110156135bc57907f30313233343536373839616263646566000000000000000000000000000000006135b5921a6135ab86886138f6565b5360041c93613936565b9190613436565b6024847f4e487b710000000000000000000000000000000000000000000000000000000081526032600452fd5b6024827f4e487b710000000000000000000000000000000000000000000000000000000081526032600452fd5b807f4e487b7100000000000000000000000000000000000000000000000000000000602492526032600452fd5b600090808252602090828252604092838120338252835260ff84822054161561366c5750505050565b61367533613961565b91845190613682826137bd565b60428252848201926060368537825115613616576030845382516001908110156135e95790607860218501536041915b80831161370c5750505061350e57604861350a9386936134d4936134c598519889937f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008a860152613490815180928c6037890191016132e8565b909192600f811660108110156135bc57907f303132333435363738396162636465660000000000000000000000000000000061374d921a6135ab86886138f6565b91906136b2565b610180810190811067ffffffffffffffff8211176118e857604052565b67ffffffffffffffff81116118e857604052565b6040810190811067ffffffffffffffff8211176118e857604052565b6020810190811067ffffffffffffffff8211176118e857604052565b6080810190811067ffffffffffffffff8211176118e857604052565b90601f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0910116810190811067ffffffffffffffff8211176118e857604052565b906000918083528260205273ffffffffffffffffffffffffffffffffffffffff6040842092169182845260205260ff60408420541661385857505050565b8083528260205260408320828452602052604083207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0081541690557ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b339380a4565b919082018092116138c757565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b908151811015613907570160200190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b80156138c7577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0190565b604051906060820182811067ffffffffffffffff8211176118e857604052602a82526020820160403682378251156139075760309053815160019081101561390757607860218401536029905b808211613a1c5750506139be5790565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602060248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152fd5b9091600f8116906010821015613a6c577f3031323334353637383961626364656600000000000000000000000000000000613a66921a613a5c85876138f6565b5360041c92613936565b906139ae565b602460007f4e487b710000000000000000000000000000000000000000000000000000000081526032600452fd5b91604091949373ffffffffffffffffffffffffffffffffffffffff9160608501968552613ac681613110565b602085015216910152565b60ff60025416613add57565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601060248201527f5061757361626c653a20706175736564000000000000000000000000000000006044820152fd5b15613b4257565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600f60248201527f496e76616c69642067616d6520494400000000000000000000000000000000006044820152fd5b805490680100000000000000008210156118e857600182018082558210156139075760005260206000200155565b600260015414613bdf576002600155565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152fd5b601f82602094937fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0938186528686013760008582860101520116010190565b15613c8357565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f496e76616c69642062617463682073697a6500000000000000000000000000006044820152fd5b67ffffffffffffffff81116118e85760051b60200190565b90613d0382613ce1565b613d1060405191826137d9565b8281527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0613d3e8294613ce1565b0190602036910137565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146138c75760010190565b91908110156139075760051b0190565b8051156139075760200190565b8051600110156139075760400190565b8051600210156139075760600190565b8051600310156139075760800190565b8051600410156139075760a00190565b80518210156139075760209160051b010190565b90600090613df383614d2a565b8051614081575b5081805260209082825260409081842033600052835260ff8260002054169081614077575b50613e2b575050905090565b73ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001693613e6c81613110565b60ff8116613e7981613110565b853b15611528578251907fe580f6ab000000000000000000000000000000000000000000000000000000008252613eaf81613110565b60048201528481602481838a5af1801561402a57908591614063575b50508151947f2e0be39a0000000000000000000000000000000000000000000000000000000086528386600481845afa95861561402a578596614034575b50803b156115285782517fffcd664b000000000000000000000000000000000000000000000000000000008152600481018790523360248201529085908290604490829084905af1801561402a57614012575b5061400c613fcf7f8f63163a495253a67c55570051660c4792fb541a2a9d167b07c264d827bfee8d959493613ffb7f40944ed08eec80557ce5c9075e417a343e3129b68a1d354eab41f9eb13b2b60f9433885260038752613fbf8a848a20613ba0565b825193849133908c8a8501613a9a565b037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe081018452836137d9565b51918291858352309583019061330b565b0390a490565b61401c8591613771565b6140265738613f5c565b8380fd5b83513d87823e3d90fd5b9095508381813d831161405c575b61404c81836137d9565b810103126107ea57519438613f09565b503d614042565b61406c90613771565b614026578338613ecb565b9050151538613e1f565b91938493849392845b84518110156143205761409d8186613dd2565b516040517f21714e5a000000000000000000000000000000000000000000000000000000008152600482818301526024908b838381305afa8c9381614303575b506140f457505050506140ef90613d48565b61408a565b606461010084018051603c908181029181830414901517156142385782900490516050908181029181830414901517156142385760e0860151908282109084821591826142f6575b5050156142b9575050506032810180911161428e57925b60808101514203904282116142635760c0015163ffffffff81169060029080821c633fffffff168410156141de5750505050601e83018093116141b45750505b8781116141a6575b50506140ef90613d48565b90975095506140ef3861419b565b60118c917f4e487b7100000000000000000000000000000000000000000000000000000000835252fd5b60011c637fffffff1683101561420357505050601483018093116141b4575050614193565b600391828102928184041490151715614238571c11614224575b5050614193565b600a83018093116141b4575050388061421d565b848f6011867f4e487b7100000000000000000000000000000000000000000000000000000000835252fd5b838e6011857f4e487b7100000000000000000000000000000000000000000000000000000000835252fd5b5060118c917f4e487b7100000000000000000000000000000000000000000000000000000000835252fd5b156142eb57603290818102918183041490151715614238576142e592916142df91614a99565b906138ba565b92614153565b505050607d92614153565b048311159050843861413c565b6143199194508d3d8091833e61041681836137d9565b92386140dd565b50925093909492508015613dfa577f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16949390929150843b15610575576040517fffcd664b000000000000000000000000000000000000000000000000000000008152600481018490523360248201529482908690604490829084905af19485156109f8577ff7b2d6e7a9afa7cda36b143fc3aa64db1956b9b93261f7d8aa7ffbb06e8ef12393949561444a575b506144126106d59133845260036020526144008660408620613ba0565b60405192839133908860208501613a9a565b7f40944ed08eec80557ce5c9075e417a343e3129b68a1d354eab41f9eb13b2b60f604051602081528061400c3094602083019061330b565b6106d5919261445b61441292613771565b9291506143e3565b6040519061447082613754565b816101606000918281528260208201528260408201528260608201528260808201528260a08201528260c08201528260e0820152826101008201526060610120820152826101408201520152565b519081151582036107ea57565b908160e09103126107ea57805191602082015191604081015191606082015160038110156107ea5791614500608082016144be565b9160c061450f60a084016144be565b92015190565b519073ffffffffffffffffffffffffffffffffffffffff821682036107ea57565b81601f820112156107ea5780519161454d83613ce1565b9261455b60405194856137d9565b808452602092838086019260051b8201019283116107ea578301905b828210614585575050505090565b83809161459184614515565b815201910190614577565b73ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016906040517f47e1d55000000000000000000000000000000000000000000000000000000000815281600482015260e081602481865afa60009384809483829583956146f4575b5061464f5750505050505050604051614631816137a1565b60008152600036813760009142916000916104b09160009160009190565b600090602460409997989951809581937f15a40f4900000000000000000000000000000000000000000000000000000000835260048301525afa9182156146e8576000926146a5575b509594936104b093929190565b90913d8082843e6146b681846137d9565b8201916020818403126105755780519167ffffffffffffffff83116101c557506146e1929101614536565b9038614698565b6040513d6000823e3d90fd5b9396509450955050614714915060e03d8111612ae057612aca81836137d9565b50959490969392979150919695949338614619565b9061473c5761473757600090565b600190565b50600290565b908160a09103126107ea5761475681614515565b91602082015191604081015191608061450f606084016144be565b91939293811561493a575b506149335773ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000166040517f185f31b00000000000000000000000000000000000000000000000000000000081526020948582600481865afa9182156146e857600092614904575b5010156148fc57604051917f47e1d550000000000000000000000000000000000000000000000000000000008352600483015260e082602481845afa600092816148d5575b5061484a57506000925050565b83600491604051928380927fc31b29ce0000000000000000000000000000000000000000000000000000000082525afa9384156146e8576000946148a6575b50509161489691926138ba565b42116148a157600190565b600090565b81813d83116148ce575b6148ba81836137d9565b810103126140265751925061489638614889565b503d6148b0565b6148ee91935060e03d8111612ae057612aca81836137d9565b50505050509050913861483d565b506000925050565b90918682813d831161492c575b61491b81836137d9565b810103126101c557505190386147f8565b503d614911565b5060009150565b90503861477c565b9061494c82613ce1565b61495960405191826137d9565b8281527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe06149878294613ce1565b019060005b82811061499857505050565b6020906149a3614463565b8282850101520161498c565b906020828203126107ea57815167ffffffffffffffff928382116107ea570190610180828203126107ea57604051926149e784613754565b82518452602083015160038110156107ea576020850152604083015160038110156107ea576040850152606083015160608501526080830151608085015260a083015160a085015260c083015163ffffffff811681036107ea5760c085015260e083015160e0850152610100808401519085015261012091828401519182116107ea57614a75918401614536565b90830152610140614a878183016144be565b90830152610160809101519082015290565b8115614aa3570490565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b9073ffffffffffffffffffffffffffffffffffffffff9160009083811682526020926003845260408084209481518096879183825491828152019188528388209388905b828210614d1057505050614b2c925003866137d9565b8451928315614d005784968596869260648711600014614cf6576064949291925b88927f000000000000000000000000000000000000000000000000000000000000000016925b868110614c015750505050508115159485600014614bfa57614b958388614a99565b955b15614bf15761271091828102928184041490151715614bc4575090614bbb91614a99565b915b9493929190565b807f4e487b7100000000000000000000000000000000000000000000000000000000602492526011600452fd5b91505091614bbd565b8095614b97565b89614c0c8287613dd2565b5183517f3ccd10e9000000000000000000000000000000000000000000000000000000008152600481019190915273ffffffffffffffffffffffffffffffffffffffff8516602482015260a080826044818a5afa8392839282614cce575b5050614c8157505050614c7c90613d48565b614b73565b91614c93819e9f93614c9993946138ba565b9e6138ba565b9b81614cc4575b50614caf575b614c7c90613d48565b94614cbc614c7c91613d48565b959050614ca6565b9050151538614ca0565b9194509150614ce99250803d106103fa576103e681836137d9565b5093925092913880614c6a565b8694929192614b4d565b5050935050809150918180918190565b855484526001958601958b95509381019390910190614b16565b9060409081517f2e0be39a00000000000000000000000000000000000000000000000000000000815260209260048483828173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165afa928315614f3757600093614f08575b50614dae83613cf9565b95600093805b614df9575b50505050909150614dc981613cf9565b9060005b818110614ddb575090925050565b80614de9614df49287613dd2565b516103908286613dd2565b614dcd565b83517f21714e5a0000000000000000000000000000000000000000000000000000000081528184820152600081602481305afa60009181614eed575b50614e4a5750614e4490613936565b80614db4565b8288820151614e5881613110565b614e6182613110565b614e6a81613110565b149081614ece575b81614ebf575b81614eab575b50614e8d575b614e4490613936565b938085610390614e9d938b613dd2565b93600a8510614e8457614db9565b905061010060e08201519101511138614e7e565b61014081015115159150614e78565b905084810151614edd81613110565b614ee681613110565b1590614e72565b614f0191923d8091833e61041681836137d9565b9038614e35565b90928582813d8311614f30575b614f1f81836137d9565b810103126101c55750519138614da4565b503d614f15565b82513d6000823e3d90fdfea2646970667358221220f014677087a873a4dc63af19801e9156e82e2813a8b6f68bcb99227fcb6b390b64736f6c63430008120033",
      "sourceMap": "534:30081:42:-:0;;;;;;;;;;;;;-1:-1:-1;;534:30081:42;;;;;;-1:-1:-1;;;;;534:30081:42;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;:::i;:::-;;;;:::i;:::-;1716:1:20;534:30081:42;1716:1:20;;534:30081:42;;;;996:15:19;534:30081:42;;996:15:19;534:30081:42;;;;;;;;;1964:26;;;534:30081;;;;2053:32;;;534:30081;;;2175:32;;;534:30081;;2277:39;534:30081;2277:39;;;;2626:121;2277:39;;;2326:57;534:30081;2326:57;2393;;;-1:-1:-1;534:30081:42;;;;;;;;;;719:10:31;534:30081:42;;;;;;;;;;7669:23:15;7665:149;;-1:-1:-1;534:30081:42;;;;2198:4:15;;;;;;;;;;2626:121:42;534:30081;;;;;;;2277:39;534:30081;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2393:57;534:30081;;;;;;7665:149:15;534:30081:42;;;;;;;;;719:10:31;534:30081:42;;;;;;;;;;;;;;;719:10:31;;;7763:40:15;;;;;7665:149;;;;534:30081:42;;;-1:-1:-1;;;534:30081:42;;;;;;;;;;;;;;;;;;-1:-1:-1;;;534:30081:42;;;;;;;;;;-1:-1:-1;;;534:30081:42;;;;;;;;;;;;;;;;;;-1:-1:-1;;;534:30081:42;;;;;;;;;;-1:-1:-1;;;534:30081:42;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;534:30081:42;;;;;;-1:-1:-1;534:30081:42;;;;;-1:-1:-1;534:30081:42;;;;-1:-1:-1;;;;;534:30081:42;;;;;;:::o",
      "linkReferences": {}
    },
    "deployedBytecode": {
      "object": "0x60a080604052600436101561001357600080fd5b600090813560e01c90816301ffc9a71461300c57508063080dd89714612dc65780630e9510d314612ba557806321714e5a1461254e578063248a9ca3146125045780632e15f1b7146124955780632f2ff15d1461239f5780632f7bbb7c1461233057806336568abe1461224b5780633f4ba83a146121045780634fd66eae146120a257806354fd4d50146120265780635c975abb14611fe55780636388607c14611f7657806363b2092d14611da8578063718072e514611aee57806373d682e01461191757806380bc0241146116905780638456cb59146115a557806384eabd981461156f5780639056ed191461129b57806390f0c30f1461109b57806391d1485414611024578063a217fddf14610fea578063bb53936414610ec5578063cfdbf25414610e8b578063d0399bb814610c83578063d42b4fe914610a61578063d547741f14610a03578063e580f6ab146107f6578063efaa55a014610579578063fcdaa843146101c85763fe39a0591461018c57600080fd5b346101c557807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557602060405160648152f35b80fd5b50346101c5576020807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610575576102016130ca565b73ffffffffffffffffffffffffffffffffffffffff9081811693848152600384526040812094604051808787829954938481520190855287852092855b8982821061055f57505050610255925003876137d9565b61025f8651613cf9565b938293835b8851811080610555575b156104255761027d818a613dd2565b516040517f21714e5a0000000000000000000000000000000000000000000000000000000081528160048201528681602481305afa879181610401575b506102cf5750506102ca90613d48565b610264565b604001516102dc81613110565b6102e581613110565b156102f5575b506102ca90613d48565b6040517f3ccd10e90000000000000000000000000000000000000000000000000000000081526004810182905273ffffffffffffffffffffffffffffffffffffffff8416602482015291969160a080826044817f00000000000000000000000000000000000000000000000000000000000000008a165afa91829189936103ce575b505061039e575081610396916103906102ca948b613dd2565b52613d48565b955b906102eb565b919691841685146103b4575b506102ca90610398565b866103c7916103906102ca94998b613dd2565b95906103aa565b6103ee929350803d106103fa575b6103e681836137d9565b810190614742565b50505050903880610377565b503d6103dc565b61041e9192503d808a833e61041681836137d9565b8101906149af565b90386102ba565b8486888a61043283614942565b93805b84811061044e576040518061044a8882613268565b0390f35b8061045c61052a9286613dd2565b51604051907f21714e5a00000000000000000000000000000000000000000000000000000000825260048201528381602481305afa849181610539575b5061052f57506104a98186613dd2565b516040516104b6816137a1565b848152604051916104c683613754565b825284868301528460408301528460608301524260808301528460a08301526104b060c08301528460e0830152603261010083015261012082015283610140820152836101608201526105198289613dd2565b526105248188613dd2565b50613d48565b610435565b6105198289613dd2565b61054e9192503d8087833e61041681836137d9565b9089610499565b506032811061026e565b855484526001958601958c95509301920161023e565b5080fd5b50346101c5576020807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126105755781600435916105b7613bce565b6105bf613ad1565b82151580610741575b6105d190613b3b565b73ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016803b1561073d576040517fffcd664b000000000000000000000000000000000000000000000000000000008152600481018590523360248201529083908290604490829084905af180156107325761071e575b507f40944ed08eec80557ce5c9075e417a343e3129b68a1d354eab41f9eb13b2b60f6107146106d56107017f8220f570e4b005d68596d255b336e271b0c27d56fe85eeba2edb223767c4ec6f96338752600386526106bc8160408920613ba0565b6040805187810192835233602084015293849290910190565b037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe081018352826137d9565b604051918291858352309583019061330b565b0390a46001805580f35b6107288391613771565b610575573861065b565b6040513d85823e3d90fd5b8280fd5b506040517f2e0be39a000000000000000000000000000000000000000000000000000000008152818160048173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165afa9081156107325783916107bd575b508311156105c8565b809350828092503d83116107ef575b6107d681836137d9565b810103126107ea576105d1849251906107b4565b600080fd5b503d6107cc565b50346101c557602090817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c5576004359060038210156101c55761083d6133ad565b610845613ad1565b73ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000169061088683613110565b60ff831661089381613110565b823b1561057557604051907fe580f6ab0000000000000000000000000000000000000000000000000000000082526108ca81613110565b6004820152818160248183875af180156109f8579085916109de575b50600492604051938480927f2e0be39a0000000000000000000000000000000000000000000000000000000082525afa9182156109d15781926109a0575b506106d561095f7f7ea5995f15533e692d3a0d38d3cddee9cd69c521b79a138e1a062813881ecae093946040519283913390888a8501613a9a565b7f40944ed08eec80557ce5c9075e417a343e3129b68a1d354eab41f9eb13b2b60f6040518681528061099530948983019061330b565b0390a4604051908152f35b91508382813d83116109ca575b6109b781836137d9565b810103126107ea579051906106d5610924565b503d6109ad565b50604051903d90823e3d90fd5b82939291506109ec90613771565b610575579083386108e6565b6040513d84823e3d90fd5b50346101c55760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557610a5e600435610a416130ed565b9080845283602052610a596001604086200154613643565b61381a565b80f35b50346101c55760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c55760043560249081356040517f2e0be39a00000000000000000000000000000000000000000000000000000000815260208160048173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165afa908115610c78578591610c47575b5084938593869360019384805b610b5a575b5060809894505086159250610b549150505750610b3b8383614a99565b915b604051938452602084015260408301526060820152f35b91610b3d565b8181111580610c3c575b15610c37576040517f21714e5a0000000000000000000000000000000000000000000000000000000081528160048201528a818781305afa8b9181610c1a575b50610bb95750610bb390613d48565b85610b19565b608081015184868210159182610c0f575b5050610bdb575b50610bb390613d48565b9798610bb391976060610bff610bf3610c0894613d48565b9c60e08d0151906138ba565b9a0151906138ba565b9690610bd1565b111590508438610bca565b610c309192508c3d8091833e61041681836137d9565b9038610ba4565b610b1e565b5060c8811115610b64565b90506020813d8211610c70575b81610c61602093836137d9565b810103126107ea575138610b0c565b3d9150610c54565b6040513d87823e3d90fd5b50346101c5576020807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610575578160043591610cc16133ad565b610cc9613ad1565b82151580610ddb575b610cdb90613b3b565b73ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016803b1561073d578280916024604051809481937fd0399bb80000000000000000000000000000000000000000000000000000000083528960048401525af1801561073257610dc7575b50604080518281019485523360208601527f32e14f02472b8af8804e03a91cb17bda4e1620e4b0bd706bfaf6591dcf13c613947f40944ed08eec80557ce5c9075e417a343e3129b68a1d354eab41f9eb13b2b60f92610dc19291610701918391016106d5565b0390a480f35b610dd18391613771565b6105755738610d5b565b506040517f2e0be39a000000000000000000000000000000000000000000000000000000008152818160048173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165afa908115610732578391610e57575b50831115610cd2565b809350828092503d8311610e84575b610e7081836137d9565b810103126107ea57610cdb84925190610e4e565b503d610e66565b50346101c557807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557602060405160148152f35b50346101c55760807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557806004356003811015610fe757606435801515809103610fe357610f176133ad565b60ff73ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001692610f5a81613110565b1690610f6582613110565b823b15610fde57608484928360405195869485937f92bf9248000000000000000000000000000000000000000000000000000000008552610fa581613110565b60048501526024356024850152604435604485015260648401525af180156109f857610fce5750f35b610fd790613771565b6101c55780f35b505050fd5b5050fd5b50fd5b50346101c557807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557602090604051908152f35b50346101c55760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c55773ffffffffffffffffffffffffffffffffffffffff60406110736130ed565b92600435815280602052209116600052602052602060ff604060002054166040519015158152f35b50346101c55760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c5576004356003811015610575576110e86110e26130ed565b91614d2a565b916110f38351614942565b92815b815181101561128d578061110d6111569284613dd2565b51604051907f21714e5a00000000000000000000000000000000000000000000000000000000825260048201528481602481305afa859181611271575b5061115b57505b613d48565b6110f6565b8473ffffffffffffffffffffffffffffffffffffffff80881690816111a7575b50506111965761118b8288613dd2565b526105248187613dd2565b8461014082015261118b8288613dd2565b9091506111b48487613dd2565b516040517f3ccd10e9000000000000000000000000000000000000000000000000000000008152600481019190915273ffffffffffffffffffffffffffffffffffffffff8916602482015260a080826044817f000000000000000000000000000000000000000000000000000000000000000087165afa9182918a9361124e575b505061124757505050845b388061117b565b1614611240565b611265929350803d106103fa576103e681836137d9565b50505050903880611235565b6112869192503d8088833e61041681836137d9565b903861114a565b6040518061044a8782613268565b50346101c5576020807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126105755760043567ffffffffffffffff811161073d576112ec90369060040161337c565b926112f56133ad565b6112fd613ad1565b83151580611564575b61131290949294613c7c565b61131b82613cf9565b937f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16825b8481106113ef575050506040519182527fb9745c261ad04a51e2d9d144832e700a74e3a197e28b3e4c49ee8fed12ba659f600192838582015233907f800493701560a25a61ac399cae28677078400019f3c4505817eda94075d4a47260403092a46040519280840190808552855180925280604086019601925b8281106113dc5785870386f35b83518752958101959281019284016113cf565b604096949651907f2e0be39a00000000000000000000000000000000000000000000000000000000918281528781600481875afa801561152c5790889161153b575b505061143e818986613d75565b356003811015611537578061145460ff92613110565b1661145e81613110565b833b1561153757604051907fe580f6ab00000000000000000000000000000000000000000000000000000000825261149581613110565b6004820152858160248183885af1801561152c57908691611514575b50506040519182528682600481865afa8015610c785785906114e5575b6114dd92506103908288613dd2565b959395611355565b508682813d831161150d575b6114fb81836137d9565b810103126107ea576114dd91516114ce565b503d6114f1565b61151d90613771565b6115285784386114b1565b8480fd5b6040513d88823e3d90fd5b8580fd5b813d831161155d575b61154e81836137d9565b810103126107ea578638611431565b503d611544565b506014841115611306565b50346101c557602061159961158336613149565b9061158c613bce565b611594613ad1565b613de6565b60018055604051908152f35b50346101c557807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c5576115dc6133ad565b6115e4613ad1565b60017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0060025416176002557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586020604051338152a17f03d87756d0359861a8ed751161c405747027362fc6301ef3fdd73959fc4cb597604051828152600160208201527f0ec8a27bc1d78f5677fb6a7386d39ba9d6072daad757c759162941a8e164455960403092a380f35b50346101c557807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c55760405160c0810181811067ffffffffffffffff8211176118e85760405260058152815b60a081106118d7575090604051916116f983613785565b600e83526020927f47414d455f4c4946454359434c450000000000000000000000000000000000008482015261172e82613d85565b5261173881613d85565b5060405161174581613785565b601081527f42415443485f4f5045524154494f4e53000000000000000000000000000000008482015261177782613d92565b5261178181613d92565b5060405161178e81613785565b600a81527f534d4152545f4a4f494e00000000000000000000000000000000000000000000848201526117c082613da2565b526117ca81613da2565b506040516117d781613785565b600a81527f53544154495354494353000000000000000000000000000000000000000000008482015261180982613db2565b5261181381613db2565b5060405161182081613785565b601081527f484953544f52595f545241434b494e47000000000000000000000000000000008482015261185282613dc2565b5261185c81613dc2565b5060405191838301848452825180915260408401948060408360051b870101940192955b82871061188d5785850386f35b9091929382806118c7837fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc08a60019603018652885161330b565b9601920196019592919092611880565b8060606020809385010152016116e2565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b50346101c557602090817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c55760043567ffffffffffffffff81116105755761196990369060040161337c565b9190611973613bce565b61197b613ad1565b82151580611ae3575b61198d90613c7c565b8192829173ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016925b828110611a355786867fa8b1e558bcb66c17f6332dc242cd87a126502dffabaf9577917b5b875e2784a76040518281528215158482015233907f800493701560a25a61ac399cae28677078400019f3c4505817eda94075d4a47260403092a460018055604051908152f35b611a40818484613d75565b35843b15611537576040517fffcd664b0000000000000000000000000000000000000000000000000000000081526004810191909152336024820152858082604481838a5af19182611acf575b5050611aa157611a9c90613d48565b6119ca565b94611ac9611a9c913387526003895261115160408820611ac28a8888613d75565b3590613ba0565b95613d48565b611ad890613771565b611537578538611a8d565b506014831115611984565b50346101c55760c07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557600435611b296130ed565b6044356064359060a435928567ffffffffffffffff9485811161057557611b5490369060040161334e565b92611b5d613ad1565b87151580611ce9575b611b6f90613b3b565b73ffffffffffffffffffffffffffffffffffffffff807f000000000000000000000000000000000000000000000000000000000000000016803b15611528578492838b611c14604051978896879586947ff713f6a40000000000000000000000000000000000000000000000000000000086526004860152169a8b60248501528c60448501528d6064850152608435608485015260c060a485015260c4840191613c3d565b03925af180156109f857611cd5575b50506040519460208601526040850152606084015260808301526080825260a0820190828210908211176118e8577f48d199e75660baeb3b30fd8bd5be4592f7c9da61cb5b7b0050e5ef839da53c43917f40944ed08eec80557ce5c9075e417a343e3129b68a1d354eab41f9eb13b2b60f828593604052602081527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff603093611cce60c082018261330b565b030190a480f35b611cde90613771565b611537578538611c23565b506040517f2e0be39a00000000000000000000000000000000000000000000000000000000815260208160048173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165afa908115611d9d578491611d66575b50881115611b66565b9350506020833d8211611d95575b81611d81602093836137d9565b810103126107ea57611b6f89935190611d5d565b3d9150611d74565b6040513d86823e3d90fd5b50346101c55760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c55760043560243567ffffffffffffffff811161073d57611dfb90369060040161334e565b9190611e056133ad565b8373ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016803b156105755781906024604051809481937fd0399bb80000000000000000000000000000000000000000000000000000000083528860048401525af18015610c7857611f37575b5091611eff8492611ecd7fc51504901bc5d945509fa70bf3d74c05a9de2a03c81913ac53b37c8847831423956040519485936020850152606060408501526080840191613c3d565b336060830152037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe081018352826137d9565b7f40944ed08eec80557ce5c9075e417a343e3129b68a1d354eab41f9eb13b2b60f6040516020815280610dc13094602083019061330b565b7fc51504901bc5d945509fa70bf3d74c05a9de2a03c81913ac53b37c8847831423939192611ecd95611f6b611eff93613771565b955092919350611e85565b50346101c557807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557602060405173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168152f35b50346101c557807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557602060ff600254166040519015158152f35b50346101c557807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c55761044a60405161206481613785565b600581527f312e302e30000000000000000000000000000000000000000000000000000000602082015260405191829160208352602083019061330b565b50346101c55760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c55760a06120e46120df6130ca565b614ad2565b926040929192519485526020850152604084015260608301526080820152f35b50346101c557807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c55761213b6133ad565b60025460ff8116156121ed577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00166002557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa6020604051338152a17f03d87756d0359861a8ed751161c405747027362fc6301ef3fdd73959fc4cb597604051600181528260208201527f0ec8a27bc1d78f5677fb6a7386d39ba9d6072daad757c759162941a8e164455960403092a380f35b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f5061757361626c653a206e6f74207061757365640000000000000000000000006044820152fd5b50346101c55760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c5576122836130ed565b3373ffffffffffffffffffffffffffffffffffffffff8216036122ac57610a5e9060043561381a565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201527f20726f6c657320666f722073656c6600000000000000000000000000000000006064820152fd5b50346101c557807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557602060405173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168152f35b50346101c55760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c5576004356123da6130ed565b818352826020526123f16001604085200154613643565b8183528260205273ffffffffffffffffffffffffffffffffffffffff6040842091169081845260205260ff6040842054161561242b578280f35b81835282602052604083208184526020526040832060017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0082541617905533917f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d8480a438808280f35b50346101c557807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557602060405173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168152f35b50346101c55760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557600160406020926004358152808452200154604051908152f35b50346101c55760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557612586614463565b50600435151580612af2575b61259b90613b3b565b6125a660043561459c565b95604095919492939551957f47e1d550000000000000000000000000000000000000000000000000000000008752600435600488015260e08760248173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165afa968715612ae7578997612aaf575b5061263387613110565b61263f60ff8816613110565b604051937f0d4158c200000000000000000000000000000000000000000000000000000000855261267260ff8916613110565b60ff8816600486015260208560248173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165afa948515612aa4578a95612a6c575b506126d288613110565b6126de60ff8916613110565b6126e88787614729565b93895193604051957f185f31b000000000000000000000000000000000000000000000000000000000875260208760048173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165afa968715612a61578d97612a29575b5099979593918c99979593917fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe06127b48e516127aa61279e82613ce1565b604051806080526137d9565b8060805152613ce1565b0136602060805101378a9b5b8d518d1015612913578d9e6128508f8f8f9173ffffffffffffffffffffffffffffffffffffffff916127f191613dd2565b5116604051907f3ccd10e9000000000000000000000000000000000000000000000000000000008252818060a09586936004356004840190929173ffffffffffffffffffffffffffffffffffffffff6020916040840195845216910152565b038173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165afa9192826128ef575b50506128be57506128b06128b6918f610390600191608051613dd2565b9d613d48565b9c9e506127c0565b9d909d156128d0575b6128b690613d48565b9c6128e76128b6918f610390600191608051613dd2565b9d90506128c7565b612906929350803d106103fa576103e681836137d9565b5092505050903880612893565b8d9a9c506129238f9c9a9c613cf9565b988a5b8c5181101561298e578c61293c82608051613dd2565b51612951575b5061294c90613d48565b612926565b8c8c610390849f73ffffffffffffffffffffffffffffffffffffffff61297d61294c9761298597613dd2565b511692613dd2565b9b90508c612942565b5061044a9d9a506129b260ff916129bd9e63ffffffff999a9b9e5191600435614771565b9a6040519d8e613754565b6004358e526129cd818316613110565b1660208d01526129dc81613110565b60408c015260608b015260808a015260a08901521660c087015260e08601526101008501526101208401521515610140830152610160820152604051918291602083526020830190613186565b9096506020813d602011612a59575b81612a45602093836137d9565b81010312612a555751958b612760565b8c80fd5b3d9150612a38565b6040513d8f823e3d90fd5b9094506020813d602011612a9c575b81612a88602093836137d9565b81010312612a98575193386126c8565b8980fd5b3d9150612a7b565b6040513d8c823e3d90fd5b612ad291975060e03d60e011612ae0575b612aca81836137d9565b8101906144cb565b505050925050509538612629565b503d612ac0565b6040513d8b823e3d90fd5b506040517f2e0be39a00000000000000000000000000000000000000000000000000000000815260208160048173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165afa80156109f8578290612b71575b60043511159050612592565b506020813d602011612b9d575b81612b8b602093836137d9565b810103126105755761259b9051612b65565b3d9150612b7e565b50346101c557612bb436613149565b90918115612dbd575b60328211612db4575b6040517f2e0be39a000000000000000000000000000000000000000000000000000000008152602093848260048173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165afa918215610732578392612d85575b50612c4584614942565b9083925b80151580612d7c575b15612d3c576040517f21714e5a0000000000000000000000000000000000000000000000000000000081528160048201528581602481305afa869181612d20575b50612ca75750612ca290613936565b612c49565b8288820151612cb581613110565b612cbe82613110565b612cc781613110565b1480612d02575b612cdd575b50612ca290613936565b84612cfb91612cf0612ca2949787613dd2565b526105248186613dd2565b9390612cd3565b506040810151612d1181613110565b612d1a81613110565b15612cce565b612d359192503d8089833e61041681836137d9565b9038612c93565b5050612d4782614942565b925b828110612d5e576040518061044a8682613268565b80612d6c612d779284613dd2565b51612cf08287613dd2565b612d49565b50858410612c52565b9091508481813d8311612dad575b612d9d81836137d9565b8101031261073d57519038612c3b565b503d612d93565b60329150612bc6565b60149150612bbd565b50346101c55760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101c557612dfe6130ca565b60249173ffffffffffffffffffffffffffffffffffffffff8335921681526020916003835260408220604051808286829454938481520190865286862092865b88828210612ff657505050612e55925003826137d9565b81151580612fec575b15612fe2575090925b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0612eaa612e9484613ce1565b93612ea260405195866137d9565b808552613ce1565b0190845b828110612f56575050506040519180830190808452825180925280604085019301945b828110612ede5784840385f35b9091928261010060019260e089518051835284810151612efd81613110565b858401526040810151612f0f81613110565b6040840152606080820151908401526080808201519084015260a0808201519084015260c0808201511515908401520151151560e082015201960191019492919094612ed1565b604095939551610100810181811067ffffffffffffffff821117612fb6579086929160405285815285838201528560408201528560608201528560808201528560a08201528560c08201528560e082015282828901015201949294612eae565b83867f4e487b710000000000000000000000000000000000000000000000000000000081526041600452fd5b9050519092612e67565b5080518210612e5e565b8554845260019586019587955093019201612e3e565b9050346105755760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610575576004357fffffffff00000000000000000000000000000000000000000000000000000000811680910361073d57602092507f7965db0b0000000000000000000000000000000000000000000000000000000081149081156130a0575b5015158152f35b7f01ffc9a70000000000000000000000000000000000000000000000000000000091501438613099565b6004359073ffffffffffffffffffffffffffffffffffffffff821682036107ea57565b6024359073ffffffffffffffffffffffffffffffffffffffff821682036107ea57565b6003111561311a57565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc60409101126107ea5760043560038110156107ea579060243590565b906101809182820181518352602090818301516131a281613110565b8285015260408301516131b481613110565b6040850152606083015160608501526080830151608085015260a083015160a085015263ffffffff60c08401511660c085015260e083015160e085015261010080840151908501526101209485840151958501528451809152816101a0850195019160005b82811061323e5750505050610140808201511515908301526101608091015191015290565b835173ffffffffffffffffffffffffffffffffffffffff1687529581019592810192600101613219565b602080820190808352835180925260408301928160408460051b8301019501936000915b84831061329c5750505050505090565b90919293949584806132d8837fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc086600196030187528a51613186565b980193019301919493929061328c565b60005b8381106132fb5750506000910152565b81810151838201526020016132eb565b907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f602093613347815180928187528780880191016132e8565b0116010190565b9181601f840112156107ea5782359167ffffffffffffffff83116107ea57602083818601950101116107ea57565b9181601f840112156107ea5782359167ffffffffffffffff83116107ea576020808501948460051b0101116107ea57565b3360009081527fad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb5602090815260408083205490929060ff16156133ef57505050565b6133f833613961565b9080845190613406826137bd565b60428252848201926060368537825115613616576030845382516001908110156135e95790607860218501536041915b80831161356a5750505061350e57604861350a9386936134d4936134c598519889937f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008a860152613490815180928c6037890191016132e8565b8401917f206973206d697373696e6720726f6c65200000000000000000000000000000006037840152518093868401906132e8565b010360288101875201856137d9565b519283927f08c379a00000000000000000000000000000000000000000000000000000000084526004840152602483019061330b565b0390fd5b6064848651907f08c379a000000000000000000000000000000000000000000000000000000000825280600483015260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152fd5b909192600f811660108110156135bc57907f30313233343536373839616263646566000000000000000000000000000000006135b5921a6135ab86886138f6565b5360041c93613936565b9190613436565b6024847f4e487b710000000000000000000000000000000000000000000000000000000081526032600452fd5b6024827f4e487b710000000000000000000000000000000000000000000000000000000081526032600452fd5b807f4e487b7100000000000000000000000000000000000000000000000000000000602492526032600452fd5b600090808252602090828252604092838120338252835260ff84822054161561366c5750505050565b61367533613961565b91845190613682826137bd565b60428252848201926060368537825115613616576030845382516001908110156135e95790607860218501536041915b80831161370c5750505061350e57604861350a9386936134d4936134c598519889937f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008a860152613490815180928c6037890191016132e8565b909192600f811660108110156135bc57907f303132333435363738396162636465660000000000000000000000000000000061374d921a6135ab86886138f6565b91906136b2565b610180810190811067ffffffffffffffff8211176118e857604052565b67ffffffffffffffff81116118e857604052565b6040810190811067ffffffffffffffff8211176118e857604052565b6020810190811067ffffffffffffffff8211176118e857604052565b6080810190811067ffffffffffffffff8211176118e857604052565b90601f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0910116810190811067ffffffffffffffff8211176118e857604052565b906000918083528260205273ffffffffffffffffffffffffffffffffffffffff6040842092169182845260205260ff60408420541661385857505050565b8083528260205260408320828452602052604083207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0081541690557ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b339380a4565b919082018092116138c757565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b908151811015613907570160200190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b80156138c7577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0190565b604051906060820182811067ffffffffffffffff8211176118e857604052602a82526020820160403682378251156139075760309053815160019081101561390757607860218401536029905b808211613a1c5750506139be5790565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602060248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152fd5b9091600f8116906010821015613a6c577f3031323334353637383961626364656600000000000000000000000000000000613a66921a613a5c85876138f6565b5360041c92613936565b906139ae565b602460007f4e487b710000000000000000000000000000000000000000000000000000000081526032600452fd5b91604091949373ffffffffffffffffffffffffffffffffffffffff9160608501968552613ac681613110565b602085015216910152565b60ff60025416613add57565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601060248201527f5061757361626c653a20706175736564000000000000000000000000000000006044820152fd5b15613b4257565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600f60248201527f496e76616c69642067616d6520494400000000000000000000000000000000006044820152fd5b805490680100000000000000008210156118e857600182018082558210156139075760005260206000200155565b600260015414613bdf576002600155565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152fd5b601f82602094937fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0938186528686013760008582860101520116010190565b15613c8357565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f496e76616c69642062617463682073697a6500000000000000000000000000006044820152fd5b67ffffffffffffffff81116118e85760051b60200190565b90613d0382613ce1565b613d1060405191826137d9565b8281527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0613d3e8294613ce1565b0190602036910137565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146138c75760010190565b91908110156139075760051b0190565b8051156139075760200190565b8051600110156139075760400190565b8051600210156139075760600190565b8051600310156139075760800190565b8051600410156139075760a00190565b80518210156139075760209160051b010190565b90600090613df383614d2a565b8051614081575b5081805260209082825260409081842033600052835260ff8260002054169081614077575b50613e2b575050905090565b73ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001693613e6c81613110565b60ff8116613e7981613110565b853b15611528578251907fe580f6ab000000000000000000000000000000000000000000000000000000008252613eaf81613110565b60048201528481602481838a5af1801561402a57908591614063575b50508151947f2e0be39a0000000000000000000000000000000000000000000000000000000086528386600481845afa95861561402a578596614034575b50803b156115285782517fffcd664b000000000000000000000000000000000000000000000000000000008152600481018790523360248201529085908290604490829084905af1801561402a57614012575b5061400c613fcf7f8f63163a495253a67c55570051660c4792fb541a2a9d167b07c264d827bfee8d959493613ffb7f40944ed08eec80557ce5c9075e417a343e3129b68a1d354eab41f9eb13b2b60f9433885260038752613fbf8a848a20613ba0565b825193849133908c8a8501613a9a565b037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe081018452836137d9565b51918291858352309583019061330b565b0390a490565b61401c8591613771565b6140265738613f5c565b8380fd5b83513d87823e3d90fd5b9095508381813d831161405c575b61404c81836137d9565b810103126107ea57519438613f09565b503d614042565b61406c90613771565b614026578338613ecb565b9050151538613e1f565b91938493849392845b84518110156143205761409d8186613dd2565b516040517f21714e5a000000000000000000000000000000000000000000000000000000008152600482818301526024908b838381305afa8c9381614303575b506140f457505050506140ef90613d48565b61408a565b606461010084018051603c908181029181830414901517156142385782900490516050908181029181830414901517156142385760e0860151908282109084821591826142f6575b5050156142b9575050506032810180911161428e57925b60808101514203904282116142635760c0015163ffffffff81169060029080821c633fffffff168410156141de5750505050601e83018093116141b45750505b8781116141a6575b50506140ef90613d48565b90975095506140ef3861419b565b60118c917f4e487b7100000000000000000000000000000000000000000000000000000000835252fd5b60011c637fffffff1683101561420357505050601483018093116141b4575050614193565b600391828102928184041490151715614238571c11614224575b5050614193565b600a83018093116141b4575050388061421d565b848f6011867f4e487b7100000000000000000000000000000000000000000000000000000000835252fd5b838e6011857f4e487b7100000000000000000000000000000000000000000000000000000000835252fd5b5060118c917f4e487b7100000000000000000000000000000000000000000000000000000000835252fd5b156142eb57603290818102918183041490151715614238576142e592916142df91614a99565b906138ba565b92614153565b505050607d92614153565b048311159050843861413c565b6143199194508d3d8091833e61041681836137d9565b92386140dd565b50925093909492508015613dfa577f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16949390929150843b15610575576040517fffcd664b000000000000000000000000000000000000000000000000000000008152600481018490523360248201529482908690604490829084905af19485156109f8577ff7b2d6e7a9afa7cda36b143fc3aa64db1956b9b93261f7d8aa7ffbb06e8ef12393949561444a575b506144126106d59133845260036020526144008660408620613ba0565b60405192839133908860208501613a9a565b7f40944ed08eec80557ce5c9075e417a343e3129b68a1d354eab41f9eb13b2b60f604051602081528061400c3094602083019061330b565b6106d5919261445b61441292613771565b9291506143e3565b6040519061447082613754565b816101606000918281528260208201528260408201528260608201528260808201528260a08201528260c08201528260e0820152826101008201526060610120820152826101408201520152565b519081151582036107ea57565b908160e09103126107ea57805191602082015191604081015191606082015160038110156107ea5791614500608082016144be565b9160c061450f60a084016144be565b92015190565b519073ffffffffffffffffffffffffffffffffffffffff821682036107ea57565b81601f820112156107ea5780519161454d83613ce1565b9261455b60405194856137d9565b808452602092838086019260051b8201019283116107ea578301905b828210614585575050505090565b83809161459184614515565b815201910190614577565b73ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016906040517f47e1d55000000000000000000000000000000000000000000000000000000000815281600482015260e081602481865afa60009384809483829583956146f4575b5061464f5750505050505050604051614631816137a1565b60008152600036813760009142916000916104b09160009160009190565b600090602460409997989951809581937f15a40f4900000000000000000000000000000000000000000000000000000000835260048301525afa9182156146e8576000926146a5575b509594936104b093929190565b90913d8082843e6146b681846137d9565b8201916020818403126105755780519167ffffffffffffffff83116101c557506146e1929101614536565b9038614698565b6040513d6000823e3d90fd5b9396509450955050614714915060e03d8111612ae057612aca81836137d9565b50959490969392979150919695949338614619565b9061473c5761473757600090565b600190565b50600290565b908160a09103126107ea5761475681614515565b91602082015191604081015191608061450f606084016144be565b91939293811561493a575b506149335773ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000166040517f185f31b00000000000000000000000000000000000000000000000000000000081526020948582600481865afa9182156146e857600092614904575b5010156148fc57604051917f47e1d550000000000000000000000000000000000000000000000000000000008352600483015260e082602481845afa600092816148d5575b5061484a57506000925050565b83600491604051928380927fc31b29ce0000000000000000000000000000000000000000000000000000000082525afa9384156146e8576000946148a6575b50509161489691926138ba565b42116148a157600190565b600090565b81813d83116148ce575b6148ba81836137d9565b810103126140265751925061489638614889565b503d6148b0565b6148ee91935060e03d8111612ae057612aca81836137d9565b50505050509050913861483d565b506000925050565b90918682813d831161492c575b61491b81836137d9565b810103126101c557505190386147f8565b503d614911565b5060009150565b90503861477c565b9061494c82613ce1565b61495960405191826137d9565b8281527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe06149878294613ce1565b019060005b82811061499857505050565b6020906149a3614463565b8282850101520161498c565b906020828203126107ea57815167ffffffffffffffff928382116107ea570190610180828203126107ea57604051926149e784613754565b82518452602083015160038110156107ea576020850152604083015160038110156107ea576040850152606083015160608501526080830151608085015260a083015160a085015260c083015163ffffffff811681036107ea5760c085015260e083015160e0850152610100808401519085015261012091828401519182116107ea57614a75918401614536565b90830152610140614a878183016144be565b90830152610160809101519082015290565b8115614aa3570490565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b9073ffffffffffffffffffffffffffffffffffffffff9160009083811682526020926003845260408084209481518096879183825491828152019188528388209388905b828210614d1057505050614b2c925003866137d9565b8451928315614d005784968596869260648711600014614cf6576064949291925b88927f000000000000000000000000000000000000000000000000000000000000000016925b868110614c015750505050508115159485600014614bfa57614b958388614a99565b955b15614bf15761271091828102928184041490151715614bc4575090614bbb91614a99565b915b9493929190565b807f4e487b7100000000000000000000000000000000000000000000000000000000602492526011600452fd5b91505091614bbd565b8095614b97565b89614c0c8287613dd2565b5183517f3ccd10e9000000000000000000000000000000000000000000000000000000008152600481019190915273ffffffffffffffffffffffffffffffffffffffff8516602482015260a080826044818a5afa8392839282614cce575b5050614c8157505050614c7c90613d48565b614b73565b91614c93819e9f93614c9993946138ba565b9e6138ba565b9b81614cc4575b50614caf575b614c7c90613d48565b94614cbc614c7c91613d48565b959050614ca6565b9050151538614ca0565b9194509150614ce99250803d106103fa576103e681836137d9565b5093925092913880614c6a565b8694929192614b4d565b5050935050809150918180918190565b855484526001958601958b95509381019390910190614b16565b9060409081517f2e0be39a00000000000000000000000000000000000000000000000000000000815260209260048483828173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165afa928315614f3757600093614f08575b50614dae83613cf9565b95600093805b614df9575b50505050909150614dc981613cf9565b9060005b818110614ddb575090925050565b80614de9614df49287613dd2565b516103908286613dd2565b614dcd565b83517f21714e5a0000000000000000000000000000000000000000000000000000000081528184820152600081602481305afa60009181614eed575b50614e4a5750614e4490613936565b80614db4565b8288820151614e5881613110565b614e6182613110565b614e6a81613110565b149081614ece575b81614ebf575b81614eab575b50614e8d575b614e4490613936565b938085610390614e9d938b613dd2565b93600a8510614e8457614db9565b905061010060e08201519101511138614e7e565b61014081015115159150614e78565b905084810151614edd81613110565b614ee681613110565b1590614e72565b614f0191923d8091833e61041681836137d9565b9038614e35565b90928582813d8311614f30575b614f1f81836137d9565b810103126101c55750519138614da4565b503d614f15565b82513d6000823e3d90fdfea2646970667358221220f014677087a873a4dc63af19801e9156e82e2813a8b6f68bcb99227fcb6b390b64736f6c63430008120033",
      "sourceMap": "534:30081:42:-:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1254:3;534:30081;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;18407:17;534:30081;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;18478:33;534:30081;;18478:33;:::i;:::-;18521:23;;18605:13;;18654:3;534:30081;;18620:22;;:32;;;18654:3;18620:32;;;18724:14;;;;:::i;:::-;534:30081;;;;18757:28;;;534:30081;18757:28;;534:30081;18757:4;;534:30081;18757:4;;:28;;;;;;;18654:3;-1:-1:-1;18753:875:42;;19605:8;;18654:3;19605:8;18654:3;:::i;:::-;18605:13;;18753:875;534:30081;18877:15;534:30081;;;;:::i;:::-;;;;:::i;:::-;18877:36;18873:693;;18753:875;;18654:3;18753:875;18654:3;:::i;18873:693::-;534:30081;;;18998:41;;534:30081;18998:41;;534:30081;;;;;;;;;;;;;18998:41;;534:30081;;;18998:11;534:30081;;18998:41;;;;;;;;;18873:693;-1:-1:-1;;18994:554:42;;19448:38;;19512:13;19448:38;;18654:3;19448:38;;;:::i;:::-;534:30081;19512:13;:::i;:::-;18994:554;;18873:693;;;18994:554;534:30081;;;;;19157:20;;19153:164;;18994:554;;18654:3;18994:554;;;19153:164;19209:38;19277:13;19209:38;;18654:3;19209:38;;;;:::i;19277:13::-;19153:164;;;;18998:41;;;;;;;-1:-1:-1;18998:41:42;;;;;;;:::i;:::-;;;;;:::i;:::-;;;;;;;;;;;;;;;18757:28;;;;;;;;;;;;;;:::i;:::-;;;;;:::i;:::-;;;;;18620:32;;;;;19699:31;;;:::i;:::-;19745:13;;19760:15;;;;;;534:30081;;;;;;;:::i;:::-;;;;19777:3;19821:19;;19777:3;19821:19;;;:::i;:::-;534:30081;;;19800:41;534:30081;19800:41;;534:30081;19800:41;;534:30081;18757:4;;534:30081;18757:4;;19800:41;;;;;;;19777:3;-1:-1:-1;19796:806:42;;20112:19;;;;;:::i;:::-;534:30081;;;;;;:::i;:::-;;;;;;;;;;:::i;:::-;;;20069:518;;;;534:30081;20069:518;534:30081;20069:518;;534:30081;20069:518;;;;534:30081;20287:15;20069:518;;;534:30081;20069:518;;;;534:30081;20370:4;20069:518;;;534:30081;20069:518;534:30081;20069:518;;534:30081;20444:2;20069:518;;;534:30081;20069:518;;;534:30081;20069:518;;;;534:30081;20069:518;;;;534:30081;20051:536;;;;:::i;:::-;;;;;;:::i;:::-;;19777:3;:::i;:::-;19745:13;;19796:806;19929:26;;;;:::i;19800:41::-;;;;;;;;;;;;;;:::i;:::-;;;;;18620:32;18646:6;18650:2;18646:6;;18620:32;;534:30081;;;;;;;;;;;;-1:-1:-1;534:30081:42;;;;;;;;;;;;;;;;;;;;;;;;;;2227:103:20;;;:::i;:::-;1204:72:19;;:::i;:::-;2872:10:42;;;:49;;;534:30081;2851:111;;;:::i;:::-;534:30081;4117:11;534:30081;4117:41;;;;;534:30081;;;4117:41;;534:30081;4117:41;;534:30081;;;719:10:31;534:30081:42;;;;;;;;;;;;;;;4117:41;;;;;;;;534:30081;719:10:31;4290:158:42;534:30081;4414:24;;4376;719:10:31;;534:30081:42;;4205:17;534:30081;;4205:36;534:30081;;;;4205:36;:::i;:::-;534:30081;;;4414:24;;;534:30081;;;719:10:31;534:30081:42;;;;;;;;;;;;4414:24;;;;;;;;;:::i;:::-;534:30081;;;;;;;;4333:4;534:30081;;;;;:::i;:::-;4290:158;;;534:30081;1759:1:20;;534:30081:42;;4117:41;;;;;:::i;:::-;534:30081;;4117:41;;;;534:30081;;;;;;;;;4117:41;534:30081;;;2872:49;534:30081;;;;2896:25;;:11;;534:30081;2896:11;534:30081;2896:11;534:30081;2896:25;;;;;;;;;;;2872:49;-1:-1:-1;2886:35:42;;;2872:49;;2896:25;;;;;;;;;;;;;;;;;;:::i;:::-;;;534:30081;;;;2851:111;534:30081;;;2896:25;;;534:30081;;;;2896:25;;;;;534:30081;;;;;;;;;;;;;;;;;;;;;;;2642:4:15;;:::i;:::-;1204:72:19;;:::i;:::-;534:30081:42;3448:11;534:30081;;;;;:::i;:::-;;;;;;;:::i;:::-;3448:59;;;;;534:30081;;3448:59;534:30081;3448:59;;534:30081;;;:::i;:::-;;3448:59;;534:30081;3448:59;;534:30081;3448:59;;;;;;;;;;;;;;534:30081;;;;;;3526:25;;;;534:30081;3526:25;;;;;;;;;;;;;534:30081;;3755:39;;3716:25;534:30081;;;;719:10:31;;;;3755:39:42;;;;;;:::i;:::-;3630:174;534:30081;;;;;3673:4;534:30081;3673:4;534:30081;;;;;;:::i;:::-;3630:174;;;534:30081;;;;;;3526:25;;;;;;;;;;;;;;;;:::i;:::-;;;534:30081;;;;;;;3755:39;3526:25;;;;;;;;534:30081;;;;;;;;;;;3448:59;;;;;;;;;:::i;:::-;534:30081;;3448:59;;;;;;534:30081;;;;;;;;;;;;;;;;;;;;;5486:7:15;534:30081:42;;;;:::i;:::-;;;;;;;;2642:4:15;534:30081:42;;;;4604:22:15;534:30081:42;2642:4:15;:::i;:::-;5486:7;:::i;:::-;534:30081:42;;;;;;;;;;;;;;;;;;;;;;;21089:25;;534:30081;21089:11;534:30081;21089:11;534:30081;21089:11;534:30081;21089:25;;;;;;;;;;;534:30081;21124:14;;21148:16;;21174:13;;21248;534:30081;21248:13;;;534:30081;;;21243:550;-1:-1:-1;534:30081:42;;21823:46;-1:-1:-1;;21823:14:42;;;-1:-1:-1;21823:14:42;;-1:-1:-1;;21823:14:42;21840:25;;;;;:::i;:::-;21823:46;;534:30081;;;;;;;;;;;;;;;;;;21823:46;;;;21291:3;21263:14;;;;:26;;;21291:3;21263:26;;;534:30081;;;21348:23;;;534:30081;21348:23;;534:30081;21348:4;;;;;:23;;;;;;;21291:3;-1:-1:-1;21344:439:42;;21760:8;21291:3;21760:8;21291:3;:::i;:::-;21248:13;;;21344:439;21454:18;;;534:30081;21454:31;;;;;:84;;;;21344:439;21429:292;;;;21344:439;;21291:3;21344:439;21291:3;:::i;21429:292::-;21579:12;;21291:3;21579:12;;21684:18;21613:36;21579:12;21671:31;21579:12;;:::i;:::-;21629:20;534:30081;21629:20;;534:30081;21613:36;;:::i;:::-;21684:18;;534:30081;21671:31;;:::i;:::-;21429:292;;;;21454:84;21509:29;;;-1:-1:-1;21454:84:42;;;;21348:23;;;;;;;;;;;;;;;:::i;:::-;;;;;21263:26;;;;21281:8;21286:3;21281:8;;;21263:26;;21089:25;;;534:30081;21089:25;;;;;;;;;534:30081;21089:25;;;:::i;:::-;;;534:30081;;;;;21089:25;;;;;;-1:-1:-1;21089:25:42;;;534:30081;;;;;;;;;;;;;;;;;;;;;;;;;2642:4:15;;;:::i;:::-;1204:72:19;;:::i;:::-;2872:10:42;;;:49;;;534:30081;2851:111;;;:::i;:::-;534:30081;5407:11;534:30081;5407:27;;;;;534:30081;;;;;;5407:27;;;;534:30081;5407:27;;;534:30081;5407:27;;534:30081;5407:27;;;;;;;;534:30081;-1:-1:-1;534:30081:42;;;5606:32;;;534:30081;;;719:10:31;534:30081:42;;;;5569:23;;5483:165;;534:30081;;;5606:32;;534:30081;;;5606:32;534:30081;;5483:165;;;534:30081;;5407:27;;;;;:::i;:::-;534:30081;;5407:27;;;2872:49;534:30081;;;;2896:25;;:11;;534:30081;2896:11;534:30081;2896:11;534:30081;2896:25;;;;;;;;;;;2872:49;-1:-1:-1;2886:35:42;;;2872:49;;2896:25;;;;;;;;;;;;;;;;;;:::i;:::-;;;534:30081;;;;2851:111;534:30081;;;2896:25;;;;;;;;534:30081;;;;;;;;;;;;;;;1200:2;534:30081;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2642:4:15;;:::i;:::-;534:30081:42;;23956:11;534:30081;;;;;:::i;:::-;;;;;;:::i;:::-;23956:154;;;;;534:30081;;;;;;23956:154;;;;;534:30081;23956:154;;534:30081;;;:::i;:::-;;23956:154;;534:30081;;;;;;;;;;;;;;;;;23956:154;;;;;;;;534:30081;;23956:154;;;;:::i;:::-;534:30081;;23956:154;534:30081;23956:154;534:30081;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;16916:25;534:30081;;:::i;:::-;16916:25;;:::i;:::-;534:30081;16967:39;534:30081;;16967:39;:::i;:::-;17022:13;;17062:3;534:30081;;17037:23;;;;;17106:15;;17062:3;17106:15;;;:::i;:::-;534:30081;;;17085:37;534:30081;17085:37;;534:30081;17085:37;;534:30081;17085:4;;534:30081;17085:4;;:37;;;;;;;17062:3;-1:-1:-1;17081:1041:42;;18099:8;17022:13;17062:3;:::i;:::-;17022:13;;17081:1041;17272:25;534:30081;;;;17319:20;;17315:389;;17081:1041;-1:-1:-1;;17726:13:42;;17763:27;;;;:::i;:::-;;;;;;:::i;17722:282::-;17912:16;;;;534:30081;17958:27;;;;:::i;17315:389::-;17417:15;;;;;;;:::i;:::-;534:30081;;;;17391:50;;534:30081;17391:50;;534:30081;;;;;;;;;;;17391:50;;534:30081;;;17391:11;534:30081;;17391:50;;;;;;;;;17315:389;-1:-1:-1;;17363:323:42;;17643:20;;;;17363:323;17315:389;;;;17363:323;534:30081;17566:20;17363:323;;17391:50;;;;;;;-1:-1:-1;17391:50:42;;;;;;:::i;:::-;;;;;;;;;;17085:37;;;;;;;;;;;;;;:::i;:::-;;;;;17037:23;534:30081;;;;17037:23;534:30081;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;2642:4:15;;;:::i;:::-;1204:72:19;;:::i;:::-;3043:9:42;;;:36;;;534:30081;3035:67;;;;;;:::i;:::-;6027:28;;;:::i;:::-;6071:13;6152:11;534:30081;;6071:13;6086:17;;;;;;534:30081;;;;;;;;6422:31;6494:4;534:30081;;;;;;719:10:31;6377:4:42;6332:176;534:30081;6377:4;6332:176;;534:30081;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;6105:3;534:30081;;;;;;;6152:25;;;;;;534:30081;6152:25;;;;;;;;;;;;;6105:3;6242:9;;;;;;;:::i;:::-;534:30081;;;;;;;;;;;;:::i;:::-;;;;;:::i;:::-;6191:63;;;;;534:30081;;6191:63;534:30081;6191:63;;534:30081;;;:::i;:::-;;6191:63;;534:30081;6191:63;;534:30081;6191:63;;;;;;;;;;;;;;6105:3;534:30081;;;;6281:25;;;;;534:30081;6281:25;;;;;;;;;;;;6105:3;;6268:38;;;;;;:::i;6105:3::-;6071:13;;;;;6281:25;;;;;;;;;;;;;;;:::i;:::-;;;534:30081;;;;6105:3;534:30081;;6281:25;;;;;;;6191:63;;;;:::i;:::-;534:30081;;6191:63;;;;534:30081;;;;6191:63;534:30081;;;;;;;;;6191:63;534:30081;;;6152:25;;;;;;;;;;;;:::i;:::-;;;534:30081;;;;6152:25;;;;;;;;;3043:36;-1:-1:-1;1200:2:42;3056:23;;;3043:36;;534:30081;;;;;;1268:1:19;534:30081:42;;;:::i;:::-;2227:103:20;;;:::i;:::-;1204:72:19;;:::i;:::-;1268:1;:::i;:::-;1716::20;1759;;534:30081:42;;;;;;;;;;;;;;;;;;2642:4:15;;:::i;:::-;1204:72:19;;:::i;:::-;2255:4;534:30081:42;2245:14:19;534:30081:42;;;2245:14:19;534:30081:42;2274:20:19;534:30081:42;;;719:10:31;534:30081:42;;2274:20:19;24836:19:42;534:30081;;;;;2255:4:19;534:30081:42;;;;24772:150;534:30081;24817:4;24772:150;;534:30081;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;30383:1;534:30081;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;30395:30;;;:::i;:::-;534:30081;30395:30;;;:::i;:::-;;534:30081;;;;;:::i;:::-;;;;;;;;;30435:32;;;:::i;:::-;534:30081;30435:32;;;:::i;:::-;;534:30081;;;;;:::i;:::-;;;;;;;;;30477:26;;;:::i;:::-;534:30081;30477:26;;;:::i;:::-;;534:30081;;;;;:::i;:::-;;;;;;;;;30513:26;;;:::i;:::-;534:30081;30513:26;;;:::i;:::-;;534:30081;;;;;:::i;:::-;;;;;;;;;30549:32;;;:::i;:::-;534:30081;30549:32;;;:::i;:::-;;534:30081;;;;;;;;;;;;;;;;;;;;;30383:1;534:30081;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;30444:1;534:30081;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;2227:103:20;;;;:::i;:::-;1204:72:19;;:::i;:::-;3043:9:42;;;:36;;;534:30081;3035:67;;;:::i;:::-;6831:16;6909:13;;6967:11;534:30081;6967:11;534:30081;6904:343;6924:18;;;;;;534:30081;;7352:29;534:30081;;;;;7421:16;;;534:30081;;;;719:10:31;7307:4:42;7262:185;534:30081;7307:4;7262:185;;1716:1:20;1759;;534:30081:42;;;;;;6944:3;6995:10;;;;;:::i;:::-;534:30081;6967:45;;;;;534:30081;;;6967:45;;534:30081;6967:45;;534:30081;;;;719:10:31;534:30081:42;;;;;;;;;;6967:45;;;;;;;6944:3;-1:-1:-1;;6963:274:42;;6944:3;7214:8;6944:3;:::i;:::-;6909:13;;6963:274;719:10:31;7089:14:42;6944:3;719:10:31;;534:30081:42;;7031:17;534:30081;;7031:40;534:30081;;;7060:10;;;;;:::i;:::-;534:30081;7031:40;;:::i;7089:14::-;6963:274;6944:3;:::i;6967:45::-;;;;:::i;:::-;534:30081;;6967:45;;;;3043:36;-1:-1:-1;1200:2:42;3056:23;;;3043:36;;534:30081;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;1204:72:19;;;:::i;:::-;2872:10:42;;;:49;;;534:30081;2851:111;;;:::i;:::-;534:30081;4827:11;;534:30081;4827:78;;;;;534:30081;;;;;;;4827:78;;;;;;;534:30081;4827:78;;534:30081;4827:78;;534:30081;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;4827:78;;;;;;;;;;534:30081;;;;;5082:40;534:30081;5082:40;;534:30081;;;;;;;;;;;;;;5082:40;;534:30081;;;;;;;;;;;;;5040:28;534:30081;4954:178;534:30081;;;;;;;;4954:178;4997:4;534:30081;;;;;;;:::i;:::-;4954:178;;;;534:30081;;4827:78;;;;:::i;:::-;534:30081;;4827:78;;;;2872:49;534:30081;;;;2896:25;;534:30081;2896:11;534:30081;2896:11;534:30081;2896:11;534:30081;2896:25;;;;;;;;;;;2872:49;-1:-1:-1;2886:35:42;;;2872:49;;2896:25;;;;534:30081;2896:25;;;;;;;;;534:30081;2896:25;;;:::i;:::-;;;534:30081;;;;2851:111;534:30081;;;2896:25;;;;;;-1:-1:-1;2896:25:42;;;534:30081;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;2642:4:15;;;;:::i;:::-;24362:11:42;534:30081;24362:11;534:30081;24362:27;;;;;534:30081;;;;;24362:27;;;;534:30081;24362:27;;;534:30081;24362:27;;534:30081;24362:27;;;;;;;;534:30081;;;24567:40;534:30081;;;24524:29;534:30081;;;24567:40;;;534:30081;24567:40;;534:30081;;;;;;;;;;;:::i;:::-;719:10:31;534:30081:42;;;;24567:40;;;;;;;;:::i;:::-;24438:179;534:30081;;;;;24481:4;534:30081;24481:4;534:30081;;;;;;:::i;24362:27::-;24524:29;24362:27;;;534:30081;24362:27;;24567:40;24362:27;;:::i;:::-;;;;;;;;;534:30081;;;;;;;;;;;;;;;;892:52;534:30081;;;;;;;;;;;;;;;;;;1685:7:19;534:30081:42;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2642:4:15;;:::i;:::-;1685:7:19;534:30081:42;;;;;;;;;1685:7:19;534:30081:42;2521:22:19;534:30081:42;;;719:10:31;534:30081:42;;2521:22:19;25145:19:42;534:30081;;;;;;;;;;25081:150;534:30081;25126:4;25081:150;;534:30081;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;719:10:31;534:30081:42;;;6133:23:15;534:30081:42;;6237:7:15;534:30081:42;;;6237:7:15;:::i;534:30081:42:-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;788:40;534:30081;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;2642:4:15;534:30081:42;;;;4604:22:15;534:30081:42;2642:4:15;:::i;:::-;534:30081:42;;;;;;;;;;;;;;;;;;;;;;;;7669:23:15;7665:149;;534:30081:42;;;7665:149:15;534:30081:42;;;;;;;;;;;;;;;;;;;;;;;;;719:10:31;7763:40:15;;;;;7665:149;;534:30081:42;;;;;;;;;;;;;;;;;;;834:52;534:30081;;;;;;;;;;;;;;;;;;;;;;;;;;;;4604:22:15;534:30081:42;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;2872:10;;:49;;;534:30081;2851:111;;;:::i;:::-;10005:25;534:30081;;10005:25;:::i;:::-;534:30081;;;;;;;;;10132:31;534:30081;10132:31;;534:30081;;;10132:31;;534:30081;;10132:11;534:30081;10132:11;534:30081;10132:11;534:30081;10132:31;;;;;;;534:30081;10132:31;;;534:30081;;;;;:::i;:::-;;;;;;:::i;:::-;;;10192:96;534:30081;10192:96;;534:30081;;;;;:::i;:::-;;;;;10192:96;;534:30081;;10192:17;534:30081;10192:17;534:30081;10192:17;534:30081;10192:96;;;;;;;;;;;534:30081;;;;;:::i;:::-;;;;;;:::i;:::-;10455:30;;;;:::i;:::-;534:30081;;;;;;10690:34;534:30081;10690:34;;534:30081;10132:11;534:30081;10132:11;534:30081;10132:11;534:30081;10690:34;;;;;;;;;;;534:30081;12937:23;;;;;;;;;;;;534:30081;;12937:23;534:30081;;;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;:::i;:::-;;;;;;;;13040:13;13035:663;13078:3;534:30081;;13055:21;;;;;13184:13;;13150:48;13184:13;;;;534:30081;13184:13;;;;:::i;:::-;534:30081;;;;13150:48;534:30081;13150:48;;;;;534:30081;;;;;;13150:48;;534:30081;;;;;;;;;;;;;;;;;13150:48;;10132:11;534:30081;10132:11;534:30081;13150:48;;;;;;;13078:3;-1:-1:-1;;13146:542:42;;13624:18;13660:13;13078:3;13624:18;;;534:30081;13624:18;534:30081;13624:18;;:::i;13660:13::-;13146:542;13078:3;:::i;:::-;13040:13;;;;;13146:542;13414:10;;;;13410:110;;13146:542;13078:3;13146:542;13078:3;:::i;13410:110::-;13448:18;13488:13;13078:3;13448:18;;;534:30081;13448:18;534:30081;13448:18;;:::i;13488:13::-;13410:110;;;;;13150:48;;;;;;;-1:-1:-1;13150:48:42;;;;;;:::i;:::-;;;;;;;;;;;13055:21;;;;;13760:26;13055:21;;;;13760:26;:::i;:::-;13796:17;;13866:3;534:30081;;13843:21;;;;;13889:11;;;534:30081;13889:11;;:::i;:::-;534:30081;13885:111;;13866:3;;;;;:::i;:::-;13828:13;;13885:111;13943:13;;13920:36;13943:13;;534:30081;13943:13;13866:3;13943:13;13974:7;13943:13;;:::i;:::-;534:30081;;13920:36;;:::i;13974:7::-;13885:111;;;;;;13843:21;;534:30081;13843:21;;;10810:52;534:30081;13843:21;534:30081;13843:21;534:30081;13843:21;;;;534:30081;;;;10810:52;:::i;:::-;534:30081;;;;;;:::i;:::-;;;;;;;;;;:::i;:::-;;;10346:559;;534:30081;;;;:::i;:::-;;10346:559;;534:30081;10346:559;;;534:30081;;10346:559;;534:30081;13150:48;10346:559;;534:30081;;10346:559;;;534:30081;;10346:559;;534:30081;10346:559;;;534:30081;10346:559;;;534:30081;;;10346:559;;;534:30081;10346:559;;;534:30081;;;;;;;;;;;;;;:::i;10690:34::-;;;;534:30081;10690:34;;534:30081;10690:34;;;;;;534:30081;10690:34;;;:::i;:::-;;;534:30081;;;;;;;10690:34;;534:30081;;;;10690:34;;;-1:-1:-1;10690:34:42;;;534:30081;;;;;;;;;10192:96;;;;534:30081;10192:96;;534:30081;10192:96;;;;;;534:30081;10192:96;;;:::i;:::-;;;534:30081;;;;;10192:96;;;;534:30081;;;;10192:96;;;-1:-1:-1;10192:96:42;;;534:30081;;;;;;;;;10132:31;;;;;534:30081;10132:31;534:30081;10132:31;;;;;;;;:::i;:::-;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;534:30081;;;;;;;;;2872:49;534:30081;;;;2896:25;;534:30081;2896:11;534:30081;2896:11;534:30081;2896:11;534:30081;2896:25;;;;;;;;;;2872:49;534:30081;;2886:35;;;-1:-1:-1;2872:49:42;;2896:25;;534:30081;2896:25;;534:30081;2896:25;;;;;;534:30081;2896:25;;;:::i;:::-;;;534:30081;;;;2851:111;534:30081;;2896:25;;;;;-1:-1:-1;2896:25:42;;534:30081;;;;;;;;:::i;:::-;;;;15688:10;15684:26;;534:30081;15732:2;15724:10;;15720:26;;534:30081;;;;15794:25;;;:11;;;534:30081;15794:11;534:30081;15794:11;534:30081;15794:25;;;;;;;;;;;534:30081;15864:25;;;;:::i;:::-;15899:22;;15976;16029:3;16000:5;;;:27;;;16029:3;16000:27;;;534:30081;;;16052:23;;;534:30081;16052:23;;534:30081;16052:4;;534:30081;16052:4;;:23;;;;;;;16029:3;-1:-1:-1;16048:382:42;;16407:8;16029:3;16407:8;16029:3;:::i;:::-;15976:22;;16048:382;16158:14;;;;534:30081;;;;:::i;:::-;;;;:::i;:::-;;;;:::i;:::-;16158:23;:83;;;16048:382;16133:235;;16048:382;;16029:3;16048:382;16029:3;:::i;16133:235::-;16282:33;16337:12;16282:33;;16029:3;16282:33;;;;:::i;:::-;;;;;;:::i;16337:12::-;16133:235;;;;16158:83;16205:15;534:30081;16205:15;;534:30081;;;;:::i;:::-;;;;:::i;:::-;16205:36;16158:83;;16052:23;;;;;;;;;;;;;;:::i;:::-;;;;;16000:27;;;16494:30;;;:::i;:::-;16539:13;16554:14;;;;;;534:30081;;;;;;;:::i;16570:3::-;16606:13;;16570:3;16606:13;;;:::i;:::-;;16589:30;;;;:::i;16570:3::-;16539:13;;16000:27;16009:18;;;;16000:27;;15794:25;;;;;;;;;;;;;;;;;:::i;:::-;;;534:30081;;;;;15794:25;;;;;;;;;15720:26;15732:2;;-1:-1:-1;15720:26:42;;15684;15708:2;;-1:-1:-1;15684:26:42;;534:30081;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;15150:17;534:30081;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;15207:9;;;:35;;;534:30081;15207:84;;;;;;;534:30081;;;;;:::i;:::-;;;;;;;;:::i;:::-;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;15207:84;534:30081;;;15207:84;;;;:35;534:30081;;;15220:22;;15207:35;;534:30081;;;;;;;;;;;;-1:-1:-1;534:30081:42;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2840:47:15;;2855:32;2840:47;;:87;;;;;534:30081:42;;;;;;;2840:87:15;952:25:34;937:40;;;2840:87:15;;;534:30081:42;;;;;;;;;;;:::o;:::-;;;;;;;;;;;:::o;:::-;;-1:-1:-1;534:30081:42;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;534:30081:42;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;;534:30081:42;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;3460:103:15:-;719:10:31;534:30081:42;;;;;;;;;;;;;;;;;;;3931:23:15;3927:390;;3460:103;;;:::o;3927:390::-;2497:52:32;719:10:31;2497:52:32;:::i;:::-;1818:437;;534:30081:42;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;1975:15:32;;;534:30081:42;;;;;;;;;;2000:15:32;534:30081:42;;;2000:15:32;534:30081:42;2025:128:32;2058:5;;;;;;2170:10;;;278:18;;534:30081:42;;;;;4022:252:15;534:30081:42;;;;4022:252:15;;;534:30081:42;4022:252:15;;;534:30081:42;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;:::i;:::-;;4022:252:15;;;;;;;;;:::i;:::-;534:30081:42;3970:336:15;;;;;;2141:1:32;3970:336:15;;534:30081:42;;;;;;:::i;:::-;3970:336:15;;;278:18:32;;534:30081:42;;;278:18:32;;;;;2141:1;278:18;;;;;;534:30081:42;278:18:32;534:30081:42;;;278:18:32;;2065:3;2105:11;;;2113:3;2105:11;;2096:21;;;;;;;534:30081:42;2065:3:32;2096:21;;2084:33;;;;:::i;:::-;;2141:1;278:18;2065:3;;:::i;:::-;2030:26;;;;2096:21;534:30081:42;;;;;;2141:1:32;534:30081:42;;;;;;;;;;;;;;;;;;;;;;3460:103:15;3130:6;534:30081:42;;;;;;;;;;;;;;719:10:31;534:30081:42;;;;;;;;;;3931:23:15;3927:390;;3460:103;;;;:::o;3927:390::-;2497:52:32;719:10:31;2497:52:32;:::i;:::-;4214:38:15;534:30081:42;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;1975:15:32;;;534:30081:42;;;;;;;;;;2000:15:32;534:30081:42;;;2000:15:32;534:30081:42;2025:128:32;2058:5;;;;;;2170:10;;;278:18;;534:30081:42;;;;;4022:252:15;534:30081:42;;;;4022:252:15;;;534:30081:42;4022:252:15;;;534:30081:42;;;;;;;;;;;;;:::i;2065:3:32:-;2105:11;;;2113:3;2105:11;;2096:21;;;;;;;534:30081:42;2065:3:32;2096:21;;2084:33;;;;:::i;2065:3::-;2030:26;;;;534:30081:42;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;:::o;7991:234:15:-;;3130:6;534:30081:42;;;;;;;;;;;;;;;;;;;;;;;;;8070:149:15;;7991:234;;;:::o;8070:149::-;534:30081:42;;;;;;;;;;;;;;;;;;;;;;;8168:40:15;719:10:31;8168:40:15;;;7991:234::o;534:30081:42:-;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;:::o;1818:437:32:-;534:30081:42;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1975:15:32;;;534:30081:42;;;;;;;;;2000:15:32;534:30081:42;;;2000:15:32;534:30081:42;2025:128:32;2058:5;;;;;;2170:10;;278:18;;1818:437;:::o;278:18::-;;534:30081:42;;278:18:32;;;534:30081:42;2141:1:32;278:18;;;534:30081:42;278:18:32;;;534:30081:42;278:18:32;534:30081:42;;;278:18:32;;2065:3;2105:11;;2113:3;2105:11;;2096:21;;;;;;;534:30081:42;2065:3:32;2096:21;;2084:33;;;;:::i;:::-;;2141:1;278:18;2065:3;;:::i;:::-;2030:26;;;2096:21;534:30081:42;-1:-1:-1;534:30081:42;;;;2141:1:32;534:30081:42;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;:::o;1767:106:19:-;534:30081:42;1685:7:19;534:30081:42;;;;1767:106:19:o;534:30081:42:-;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;534:30081:42;;-1:-1:-1;534:30081:42;;;:::o;2336:287:20:-;1759:1;2468:7;534:30081:42;2468:19:20;1759:1;;;2468:7;1759:1;2336:287::o;1759:1::-;;534:30081:42;;1759:1:20;;;;;;;;;;;;534:30081:42;1759:1:20;534:30081:42;;;1759:1:20;;534:30081:42;;;;;;;;;;;;;;;-1:-1:-1;534:30081:42;;;;;;;;;;;:::o;:::-;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;;:::i;:::-;;;;;;;;:::o;:::-;;;;;;;;;:::o;:::-;;;;;;;;;;;;:::o;:::-;;;;;;;;;:::o;:::-;;;30444:1;534:30081;;;;;;;:::o;:::-;;;30486:1;534:30081;;;;;;;:::o;:::-;;;30522:1;534:30081;;;;;;;:::o;:::-;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;:::o;7537:1884::-;;534:30081;7788:25;;;;:::i;:::-;534:30081;;7870:765;;7537:1884;534:30081;;;;;;;;;;;;;;719:10:31;534:30081:42;;;;;;;;;;8745:52;;;;7537:1884;8741:616;;;9406:8;;;;7537:1884;:::o;8741:616::-;534:30081;8813:11;534:30081;;;;;:::i;:::-;;;;;;;:::i;:::-;8813:59;;;;;534:30081;;8813:59;534:30081;8813:59;;534:30081;;;:::i;:::-;8813:59;;;534:30081;8813:59;;534:30081;8813:59;;;;;;;;;;;;;;8741:616;534:30081;;;;8906:25;534:30081;8906:25;;;;8813:59;8906:25;;;;;;;;;;;;;8741:616;8992:44;;;;;;534:30081;;;8992:44;;8813:59;8992:44;;534:30081;;;719:10:31;534:30081:42;;;;;;;;;;;;;;;8992:44;;;;;;;;8741:616;719:10:31;534:30081:42;9267:34;9207:42;719:10:31;;;9267:34:42;9109:206;719:10:31;;534:30081:42;;9050:17;534:30081;;9050:39;534:30081;;;;9050:39;:::i;:::-;534:30081;;719:10:31;;;;9267:34:42;;;;;;:::i;:::-;;;;;;;;;:::i;:::-;534:30081;;;;;;;9156:4;534:30081;;;;;:::i;:::-;9109:206;;;9330:16;:::o;8992:44::-;;;;;:::i;:::-;534:30081;;8992:44;;;534:30081;;;;8992:44;534:30081;;;;;;;;;8906:25;;;;;;;;;;;;;;;;;:::i;:::-;;;534:30081;;;;;8906:25;;;;;;;;;8813:59;;;;:::i;:::-;534:30081;;8813:59;;;;8745:52;8782:15;;;;8745:52;;;7870:765;8018:34;;;;;;;;28099:3;534:30081;;28072:25;;;;;28135:17;;;;:::i;:::-;534:30081;;;;28171:28;;;;;;;534:30081;;28171:4;;;;;;:28;;;;;;;28099:3;-1:-1:-1;28167:442:42;;28586:8;;;;28099:3;28586:8;28099:3;:::i;:::-;28057:13;;28167:442;28859:3;28965:19;;;534:30081;;28987:2;534:30081;;;;;;;;;;;;;;;;;;;;29048:2;534:30081;;;;;;;;;;;;;;;;29085:20;;534:30081;29085:32;;;;;;;;:68;;;;28167:442;-1:-1:-1;;29068:376:42;;;534:30081;;;29187:2;534:30081;;;;;;;29068:376;;29551:18;;;534:30081;29533:15;534:30081;29533:15;;534:30081;;;;29597:21;;534:30081;;;;;;;;;;;;29633:25;;534:30081;;;;;;;29683:2;534:30081;;;;;;;29674:11;;29629:318;28429:17;;;28425:122;;29629:318;28167:442;;28099:3;28167:442;28099:3;:::i;28425:122::-;28470:17;;-1:-1:-1;28470:17:42;-1:-1:-1;28099:3:42;28425:122;;;534:30081;;;;;;;;;29629:318;534:30081;;;;29740:25;;534:30081;;;;;;29790:2;534:30081;;;;;;;29781:11;;29629:318;;29736:211;29872:1;534:30081;;;;;;;;;;;;;;;;-1:-1:-1;29843:104:42;;29736:211;;;29629:318;;29843:104;29903:2;534:30081;;;;;;;29894:11;;29843:104;;;;534:30081;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;29068:376;29238:31;;;29318:2;534:30081;;;;;;;;;;;;;;;29285:47;29294:38;;;;;:::i;:::-;29285:47;;:::i;:::-;29234:210;29068:376;;29234:210;29391:11;;;534:30081;29234:210;29068:376;;29085:68;534:30081;29121:32;;;;-1:-1:-1;29085:68:42;;;;28171:28;;;;;;;;;;;;;;;:::i;:::-;;;;;28072:25;;;;;;;;;8071:14;8067:558;7870:765;8067:558;8146:11;534:30081;;;8146:11;;;;-1:-1:-1;8146:45:42;;;;;534:30081;;;8146:45;;28171:28;8146:45;;534:30081;;;719:10:31;534:30081:42;;;;;;;;;;;;;;;8146:45;;;;;;;8469:30;8146:45;;;;;8067:558;719:10:31;8521:35:42;;719:10:31;;534:30081:42;;8254:17;534:30081;;8254:40;534:30081;;;;8254:40;:::i;:::-;534:30081;;719:10:31;;;;8521:35:42;;534:30081;8521:35;;;:::i;:::-;8359:215;534:30081;;;;;28171:4;534:30081;28171:4;534:30081;;;;;;:::i;8146:45::-;8521:35;8146:45;;;8521:35;8146:45;;:::i;:::-;;;;;;534:30081;;;;;;;:::i;:::-;;;-1:-1:-1;534:30081:42;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;:::i;:::-;;;;;:::o;:::-;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;:::i;:::-;;;;;;;;;11021:1357;534:30081;11483:11;534:30081;;;;;11483:31;;;;;;534:30081;;11483:31;534:30081;11483:31;;;;-1:-1:-1;;;;;;;;;11483:31:42;;;11021:1357;-1:-1:-1;11479:893:42;;534:30081;;;;;;;;;;;;:::i;:::-;-1:-1:-1;534:30081:42;;-1:-1:-1;534:30081:42;;;-1:-1:-1;12211:15:42;;12167:194;-1:-1:-1;12167:194:42;12263:4;12167:194;-1:-1:-1;12167:194:42;-1:-1:-1;12167:194:42;;:::o;11479:893::-;-1:-1:-1;534:30081:42;;;;;;;;11798:34;;;;534:30081;11798:34;;11483:31;11798:34;;534:30081;11798:34;;;;;;;-1:-1:-1;11798:34:42;;;11479:893;11846:231;;;;11960:4;11846:231;;;;:::o;11798:34::-;;;;;;;;;;;;:::i;:::-;;;534:30081;;;;;;;;;;;;;;;;-1:-1:-1;534:30081:42;;;;;:::i;:::-;11798:34;;;;;534:30081;;;-1:-1:-1;534:30081:42;;;;;11483:31;;;;;;;;;;;;534:30081;11483:31;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;12431:240;;12548:38;;12596:34;;12647:17;12431:240;:::o;12596:34::-;12614:16;12607:23;:::o;12548:38::-;12561:25;12568:18;12561:25;:::o;534:30081::-;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;:::i;14108:800::-;;;;;14274:16;;;;14108:800;14270:34;;;534:30081;14333:11;534:30081;;;;14333:34;;;;;;;;;;;;;;;;;;;;14108:800;14318:49;;;14314:67;;534:30081;;14435:31;534:30081;14435:31;;14333:34;14435:31;;534:30081;;14435:31;534:30081;14435:31;;;;14333:34;;534:30081;14435:31;;14108:800;-1:-1:-1;14431:449:42;;-1:-1:-1;14333:34:42;;-1:-1:-1;;14857:12:42:o;14431:449::-;534:30081;14333:34;534:30081;;;14752:27;;;;534:30081;14752:27;;;;;;;;;14333:34;14752:27;;;14431:449;14740:39;;;;;;;:::i;:::-;14722:15;:57;14718:108;;14897:4;14108:800;:::o;14718:108::-;14333:34;14799:12;:::o;14752:27::-;;;;;;;;;;;;;:::i;:::-;;;534:30081;;;;;;-1:-1:-1;14740:39:42;14752:27;;;;;;;;14435:31;;;;;534:30081;14435:31;;;;;;;;;:::i;:::-;;;;;;;;;;;;14314:67;-1:-1:-1;14333:34:42;;-1:-1:-1;;14369:12:42:o;14333:34::-;;;;;;;;;;;;;;;;:::i;:::-;;;534:30081;;;;;;14333:34;;;;;;;;;14270;-1:-1:-1;14299:5:42;;-1:-1:-1;14292:12:42:o;14274:16::-;;;;;;534:30081;;;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;;:::i;:::-;;;-1:-1:-1;534:30081:42;;;;;;;;;:::o;:::-;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;:::o;:::-;;;;;;;:::o;:::-;;;;;;;;;;22009:1653;;534:30081;-1:-1:-1;;534:30081:42;;;;;;;;22350:17;534:30081;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;22437:21;;;22433:74;;22517:14;22541;;22694:47;22565:20;22694:22;22713:3;22694:22;;:47;22713:3;;;;22694:47;;;;;22757:13;22859:11;;534:30081;22752:579;22772:16;;;;;;23359;;;;;;;;:48;;;;;;23378:25;;;;:::i;:::-;23359:48;;23427:56;;;23458:5;534:30081;;;;;;;;;;;;;;;23446:33;;;;;:::i;:::-;23427:56;;23510:145;;;;22009:1653;:::o;534:30081::-;;;;;;;22859:41;534:30081;;23427:56;;;;;;;23359:48;;;;;22790:3;22826:14;;;;;:::i;:::-;534:30081;;;;22859:41;;;;;534:30081;;;;;;;;;;;22859:41;;534:30081;;;22859:41;;;;;;;;;;22790:3;-1:-1:-1;;22855:466:42;;23298:8;;;22790:3;23298:8;22790:3;:::i;:::-;22757:13;;22855:466;23112:19;;;;;;23149;23112;;;:::i;:::-;23149;;:::i;:::-;23190:22;;;;22855:466;23186:38;;;22855:466;22790:3;22855:466;22790:3;:::i;23186:38::-;23214:10;;22790:3;23214:10;;:::i;:::-;23186:38;;;;;23190:22;23203:9;;;;23190:22;;;22859:41;;;;;;;;;;;-1:-1:-1;22859:41:42;;;;;;:::i;:::-;;;;;;;;;;;22694:47;;;;;;;;22433:74;22474:22;;;;;;;;;;;;;;:::o;534:30081::-;;;;;;;;;;;;-1:-1:-1;534:30081:42;;;;;;;;;;26488:1327;;534:30081;;;;;26633:25;;;;;:11;;;;534:30081;26633:11;534:30081;26633:25;;;;;;;;;;;26488:1327;26698:25;;;;:::i;:::-;26733:26;26633:25;26850:22;26845:721;26874:5;;;26845:721;27637:29;;;;;;;;;;:::i;:::-;27681:13;26633:25;27696:18;;;;;;-1:-1:-1;27788:20:42;;-1:-1:-1;;26488:1327:42:o;27716:3::-;27754:13;;27716:3;27754:13;;;:::i;:::-;534:30081;27735:32;;;;:::i;27716:3::-;27681:13;;26881:3;534:30081;;;26904:23;;;;;;534:30081;26633:25;26904:4;534:30081;26904:4;;:23;;26633:25;;26904:23;;;26881:3;-1:-1:-1;26900:656:42;;27533:8;26881:3;27533:8;26881:3;:::i;:::-;26850:22;;;26900:656;27010:14;;;;534:30081;;;;:::i;:::-;;;;:::i;:::-;;;;:::i;:::-;27010:23;:83;;;;26900:656;27010:123;;;26900:656;27010:189;;;26900:656;26985:462;;;26900:656;26881:3;26900:656;26881:3;:::i;26985:462::-;27240:30;;;;27292:16;27240:30;;;:::i;27292:16::-;27401:20;27419:2;27401:20;;26985:462;27397:31;27423:5;;27010:189;27157:20;;27180:19;534:30081;27157:20;;534:30081;27180:19;;534:30081;-1:-1:-1;27010:189:42;;;:123;27117:16;;;534:30081;;;;-1:-1:-1;27010:123:42;;:83;27057:15;;;;;534:30081;;;;:::i;:::-;;;;:::i;:::-;27057:36;27010:83;;;26904:23;;;;;;;;;;;;;:::i;:::-;;;;;26633:25;;;;;;;;;;;;;;;;:::i;:::-;;;534:30081;;;;;;26633:25;;;;;;;;;;534:30081;;;26633:25;534:30081;;;;",
      "linkReferences": {},
      "immutableReferences": {
        "43360": [
          { "start": 842, "length": 32 },
          { "start": 1512, "length": 32 },
          { "start": 1924, "length": 32 },
          { "start": 2140, "length": 32 },
          { "start": 2780, "length": 32 },
          { "start": 3314, "length": 32 },
          { "start": 3614, "length": 32 },
          { "start": 3888, "length": 32 },
          { "start": 4616, "length": 32 },
          { "start": 4894, "length": 32 },
          { "start": 6568, "length": 32 },
          { "start": 7047, "length": 32 },
          { "start": 7469, "length": 32 },
          { "start": 7709, "length": 32 },
          { "start": 9083, "length": 32 },
          { "start": 9721, "length": 32 },
          { "start": 10032, "length": 32 },
          { "start": 10345, "length": 32 },
          { "start": 11062, "length": 32 },
          { "start": 11275, "length": 32 },
          { "start": 15938, "length": 32 },
          { "start": 17200, "length": 32 },
          { "start": 17843, "length": 32 },
          { "start": 18328, "length": 32 },
          { "start": 19281, "length": 32 },
          { "start": 19827, "length": 32 }
        ],
        "43363": [
          { "start": 9440, "length": 32 },
          { "start": 9880, "length": 32 }
        ],
        "43366": [{ "start": 8129, "length": 32 }]
      }
    },
    "methodIdentifiers": {
      "DEFAULT_ADMIN_ROLE()": "a217fddf",
      "MAX_BATCH_SIZE()": "cfdbf254",
      "MAX_HISTORY_RECORDS()": "fe39a059",
      "createGame(uint8)": "e580f6ab",
      "createMultipleGames(uint8[])": "9056ed19",
      "endGame(uint256)": "d0399bb8",
      "forceEndGame(uint256,string)": "63b2092d",
      "gameConfigManager()": "2e15f1b7",
      "gameRewardManager()": "6388607c",
      "getActiveGames(uint8,uint256)": "0e9510d3",
      "getGameFullInfo(uint256)": "21714e5a",
      "getGameStats(uint256,uint256)": "d42b4fe9",
      "getJoinableGames(uint8,address)": "90f0c30f",
      "getPlayerCurrentGames(address)": "fcdaa843",
      "getPlayerGameHistory(address,uint256)": "080dd897",
      "getPlayerStats(address)": "4fd66eae",
      "getRoleAdmin(bytes32)": "248a9ca3",
      "getSupportedFeatures()": "80bc0241",
      "grantRole(bytes32,address)": "2f2ff15d",
      "hasRole(bytes32,address)": "91d14854",
      "joinGame(uint256)": "efaa55a0",
      "joinMultipleGames(uint256[])": "73d682e0",
      "pause()": "8456cb59",
      "paused()": "5c975abb",
      "renounceRole(bytes32,address)": "36568abe",
      "revokeRole(bytes32,address)": "d547741f",
      "smartJoinGame(uint8,uint256)": "84eabd98",
      "submitScore(uint256,address,uint256,uint256,uint256,bytes)": "718072e5",
      "supportsInterface(bytes4)": "01ffc9a7",
      "swordBattle()": "2f7bbb7c",
      "unpause()": "3f4ba83a",
      "updateGameConfig(uint8,uint256,uint256,bool)": "bb539364",
      "version()": "54fd4d50"
    },
    "rawMetadata": "{\"compiler\":{\"version\":\"0.8.18+commit.87f61d96\"},\"language\":\"Solidity\",\"output\":{\"abi\":[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_swordBattle\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_gameConfigManager\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_gameRewardManager\",\"type\":\"address\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"swordBattle\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"gameConfigManager\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"gameRewardManager\",\"type\":\"address\"}],\"name\":\"AggregatorInitialized\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"aggregator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"statusType\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"oldValue\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"newValue\",\"type\":\"bytes32\"}],\"name\":\"AggregatorStatusChanged\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"aggregator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"operationType\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"itemCount\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"success\",\"type\":\"bool\"}],\"name\":\"BatchOperationCompleted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"operation\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"count\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"success\",\"type\":\"bool\"}],\"name\":\"BatchOperationExecuted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"fromAggregator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"toAggregator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"actionType\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"CrossAggregatorAction\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"}],\"name\":\"GameInfoCached\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"Paused\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"previousAdminRole\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"newAdminRole\",\"type\":\"bytes32\"}],\"name\":\"RoleAdminChanged\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"}],\"name\":\"RoleGranted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"}],\"name\":\"RoleRevoked\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"Unpaused\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"aggregator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"operation\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"inputData\",\"type\":\"bytes\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"outputData\",\"type\":\"bytes\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"name\":\"UserOperationRecorded\",\"type\":\"event\"},{\"inputs\":[],\"name\":\"DEFAULT_ADMIN_ROLE\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"MAX_BATCH_SIZE\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"MAX_HISTORY_RECORDS\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"enum IGameAggregator.GameLevel\",\"name\":\"level\",\"type\":\"uint8\"}],\"name\":\"createGame\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"enum IGameAggregator.GameLevel[]\",\"name\":\"levels\",\"type\":\"uint8[]\"}],\"name\":\"createMultipleGames\",\"outputs\":[{\"internalType\":\"uint256[]\",\"name\":\"gameIds\",\"type\":\"uint256[]\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"}],\"name\":\"endGame\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"reason\",\"type\":\"string\"}],\"name\":\"forceEndGame\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"gameConfigManager\",\"outputs\":[{\"internalType\":\"contract GameConfigManager\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"gameRewardManager\",\"outputs\":[{\"internalType\":\"contract GameRewardManager\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"enum IGameAggregator.GameLevel\",\"name\":\"level\",\"type\":\"uint8\"},{\"internalType\":\"uint256\",\"name\":\"limit\",\"type\":\"uint256\"}],\"name\":\"getActiveGames\",\"outputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"},{\"internalType\":\"enum IGameAggregator.GameLevel\",\"name\":\"level\",\"type\":\"uint8\"},{\"internalType\":\"enum IGameAggregator.GameStatus\",\"name\":\"status\",\"type\":\"uint8\"},{\"internalType\":\"uint256\",\"name\":\"totalPool\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"createdAt\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"endedAt\",\"type\":\"uint256\"},{\"internalType\":\"uint32\",\"name\":\"gameDuration\",\"type\":\"uint32\"},{\"internalType\":\"uint256\",\"name\":\"playerCount\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"maxPlayers\",\"type\":\"uint256\"},{\"internalType\":\"address[]\",\"name\":\"activePlayers\",\"type\":\"address[]\"},{\"internalType\":\"bool\",\"name\":\"canJoin\",\"type\":\"bool\"},{\"internalType\":\"uint256\",\"name\":\"entryFee\",\"type\":\"uint256\"}],\"internalType\":\"struct IGameAggregator.GameFullInfo[]\",\"name\":\"activeGames\",\"type\":\"tuple[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"}],\"name\":\"getGameFullInfo\",\"outputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"},{\"internalType\":\"enum IGameAggregator.GameLevel\",\"name\":\"level\",\"type\":\"uint8\"},{\"internalType\":\"enum IGameAggregator.GameStatus\",\"name\":\"status\",\"type\":\"uint8\"},{\"internalType\":\"uint256\",\"name\":\"totalPool\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"createdAt\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"endedAt\",\"type\":\"uint256\"},{\"internalType\":\"uint32\",\"name\":\"gameDuration\",\"type\":\"uint32\"},{\"internalType\":\"uint256\",\"name\":\"playerCount\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"maxPlayers\",\"type\":\"uint256\"},{\"internalType\":\"address[]\",\"name\":\"activePlayers\",\"type\":\"address[]\"},{\"internalType\":\"bool\",\"name\":\"canJoin\",\"type\":\"bool\"},{\"internalType\":\"uint256\",\"name\":\"entryFee\",\"type\":\"uint256\"}],\"internalType\":\"struct IGameAggregator.GameFullInfo\",\"name\":\"gameInfo\",\"type\":\"tuple\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"startTime\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"endTime\",\"type\":\"uint256\"}],\"name\":\"getGameStats\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"totalGames\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"totalPlayers\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"totalPool\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"avgPlayersPerGame\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"enum IGameAggregator.GameLevel\",\"name\":\"level\",\"type\":\"uint8\"},{\"internalType\":\"address\",\"name\":\"player\",\"type\":\"address\"}],\"name\":\"getJoinableGames\",\"outputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"},{\"internalType\":\"enum IGameAggregator.GameLevel\",\"name\":\"level\",\"type\":\"uint8\"},{\"internalType\":\"enum IGameAggregator.GameStatus\",\"name\":\"status\",\"type\":\"uint8\"},{\"internalType\":\"uint256\",\"name\":\"totalPool\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"createdAt\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"endedAt\",\"type\":\"uint256\"},{\"internalType\":\"uint32\",\"name\":\"gameDuration\",\"type\":\"uint32\"},{\"internalType\":\"uint256\",\"name\":\"playerCount\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"maxPlayers\",\"type\":\"uint256\"},{\"internalType\":\"address[]\",\"name\":\"activePlayers\",\"type\":\"address[]\"},{\"internalType\":\"bool\",\"name\":\"canJoin\",\"type\":\"bool\"},{\"internalType\":\"uint256\",\"name\":\"entryFee\",\"type\":\"uint256\"}],\"internalType\":\"struct IGameAggregator.GameFullInfo[]\",\"name\":\"joinableGames\",\"type\":\"tuple[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"player\",\"type\":\"address\"}],\"name\":\"getPlayerCurrentGames\",\"outputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"},{\"internalType\":\"enum IGameAggregator.GameLevel\",\"name\":\"level\",\"type\":\"uint8\"},{\"internalType\":\"enum IGameAggregator.GameStatus\",\"name\":\"status\",\"type\":\"uint8\"},{\"internalType\":\"uint256\",\"name\":\"totalPool\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"createdAt\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"endedAt\",\"type\":\"uint256\"},{\"internalType\":\"uint32\",\"name\":\"gameDuration\",\"type\":\"uint32\"},{\"internalType\":\"uint256\",\"name\":\"playerCount\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"maxPlayers\",\"type\":\"uint256\"},{\"internalType\":\"address[]\",\"name\":\"activePlayers\",\"type\":\"address[]\"},{\"internalType\":\"bool\",\"name\":\"canJoin\",\"type\":\"bool\"},{\"internalType\":\"uint256\",\"name\":\"entryFee\",\"type\":\"uint256\"}],\"internalType\":\"struct IGameAggregator.GameFullInfo[]\",\"name\":\"currentGames\",\"type\":\"tuple[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"player\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"limit\",\"type\":\"uint256\"}],\"name\":\"getPlayerGameHistory\",\"outputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"},{\"internalType\":\"enum IGameAggregator.GameLevel\",\"name\":\"level\",\"type\":\"uint8\"},{\"internalType\":\"enum IGameAggregator.GameStatus\",\"name\":\"status\",\"type\":\"uint8\"},{\"internalType\":\"uint256\",\"name\":\"joinedAt\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"kills\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"score\",\"type\":\"uint256\"},{\"internalType\":\"bool\",\"name\":\"scoreSubmitted\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"rewardClaimed\",\"type\":\"bool\"}],\"internalType\":\"struct IGameAggregator.PlayerGameInfo[]\",\"name\":\"games\",\"type\":\"tuple[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"player\",\"type\":\"address\"}],\"name\":\"getPlayerStats\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"totalGamesPlayed\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"totalKills\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"totalScore\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"avgScorePerGame\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"winRate\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"}],\"name\":\"getRoleAdmin\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getSupportedFeatures\",\"outputs\":[{\"internalType\":\"string[]\",\"name\":\"features\",\"type\":\"string[]\"}],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"grantRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"hasRole\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"}],\"name\":\"joinGame\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"gameIds\",\"type\":\"uint256[]\"}],\"name\":\"joinMultipleGames\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"successCount\",\"type\":\"uint256\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"pause\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"paused\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"renounceRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"revokeRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"enum IGameAggregator.GameLevel\",\"name\":\"level\",\"type\":\"uint8\"},{\"internalType\":\"uint256\",\"name\":\"maxWaitTime\",\"type\":\"uint256\"}],\"name\":\"smartJoinGame\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"player\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"kills\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"score\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"nonce\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"signature\",\"type\":\"bytes\"}],\"name\":\"submitScore\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"interfaceId\",\"type\":\"bytes4\"}],\"name\":\"supportsInterface\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"swordBattle\",\"outputs\":[{\"internalType\":\"contract SwordBattle\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"unpause\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"enum IGameAggregator.GameLevel\",\"name\":\"level\",\"type\":\"uint8\"},{\"internalType\":\"uint256\",\"name\":\"entryFee\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"killReward\",\"type\":\"uint256\"},{\"internalType\":\"bool\",\"name\":\"active\",\"type\":\"bool\"}],\"name\":\"updateGameConfig\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"version\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"pure\",\"type\":\"function\"}],\"devdoc\":{\"details\":\"\\u6e38\\u620f\\u805a\\u5408\\u5668\\u5b9e\\u73b0 \\u805a\\u5408\\u6e38\\u620f\\u751f\\u547d\\u5468\\u671f\\u7ba1\\u7406\\u3001\\u6279\\u91cf\\u64cd\\u4f5c\\u548c\\u4fe1\\u606f\\u67e5\\u8be2\\u529f\\u80fd\",\"events\":{\"AggregatorStatusChanged(address,bytes32,bytes32,bytes32)\":{\"details\":\"\\u805a\\u5408\\u5668\\u72b6\\u6001\\u53d8\\u66f4\\u4e8b\\u4ef6\",\"params\":{\"aggregator\":\"\\u805a\\u5408\\u5668\\u5730\\u5740\",\"newValue\":\"\\u65b0\\u503c\",\"oldValue\":\"\\u65e7\\u503c\",\"statusType\":\"\\u72b6\\u6001\\u7c7b\\u578b\"}},\"BatchOperationCompleted(address,address,bytes32,uint256,bool)\":{\"details\":\"\\u6279\\u91cf\\u64cd\\u4f5c\\u5b8c\\u6210\\u4e8b\\u4ef6\",\"params\":{\"aggregator\":\"\\u6267\\u884c\\u64cd\\u4f5c\\u7684\\u805a\\u5408\\u5668\\u5730\\u5740\",\"itemCount\":\"\\u64cd\\u4f5c\\u9879\\u76ee\\u6570\\u91cf\",\"operationType\":\"\\u64cd\\u4f5c\\u7c7b\\u578b\",\"success\":\"\\u64cd\\u4f5c\\u662f\\u5426\\u6210\\u529f\",\"user\":\"\\u7528\\u6237\\u5730\\u5740\"}},\"CrossAggregatorAction(address,address,bytes32,bytes)\":{\"details\":\"\\u8de8\\u805a\\u5408\\u5668\\u64cd\\u4f5c\\u4e8b\\u4ef6\",\"params\":{\"actionType\":\"\\u64cd\\u4f5c\\u7c7b\\u578b\\u6807\\u8bc6\\u7b26\",\"data\":\"\\u64cd\\u4f5c\\u76f8\\u5173\\u6570\\u636e\",\"fromAggregator\":\"\\u53d1\\u8d77\\u64cd\\u4f5c\\u7684\\u805a\\u5408\\u5668\\u5730\\u5740\",\"toAggregator\":\"\\u76ee\\u6807\\u805a\\u5408\\u5668\\u5730\\u5740 (address(0)\\u8868\\u793a\\u5e7f\\u64ad)\"}},\"Paused(address)\":{\"details\":\"Emitted when the pause is triggered by `account`.\"},\"RoleAdminChanged(bytes32,bytes32,bytes32)\":{\"details\":\"Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole` `DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite {RoleAdminChanged} not being emitted signaling this. _Available since v3.1._\"},\"RoleGranted(bytes32,address,address)\":{\"details\":\"Emitted when `account` is granted `role`. `sender` is the account that originated the contract call, an admin role bearer except when using {AccessControl-_setupRole}.\"},\"RoleRevoked(bytes32,address,address)\":{\"details\":\"Emitted when `account` is revoked `role`. `sender` is the account that originated the contract call:   - if using `revokeRole`, it is the admin role bearer   - if using `renounceRole`, it is the role bearer (i.e. `account`)\"},\"Unpaused(address)\":{\"details\":\"Emitted when the pause is lifted by `account`.\"},\"UserOperationRecorded(address,address,bytes32,bytes,bytes,uint256)\":{\"details\":\"\\u7528\\u6237\\u64cd\\u4f5c\\u8bb0\\u5f55\\u4e8b\\u4ef6\",\"params\":{\"aggregator\":\"\\u805a\\u5408\\u5668\\u5730\\u5740\",\"inputData\":\"\\u8f93\\u5165\\u6570\\u636e\",\"operation\":\"\\u64cd\\u4f5c\\u6807\\u8bc6\",\"outputData\":\"\\u8f93\\u51fa\\u6570\\u636e\",\"timestamp\":\"\\u65f6\\u95f4\\u6233\",\"user\":\"\\u7528\\u6237\\u5730\\u5740\"}}},\"kind\":\"dev\",\"methods\":{\"constructor\":{\"details\":\"\\u6784\\u9020\\u51fd\\u6570\",\"params\":{\"_gameConfigManager\":\"GameConfigManager\\u5408\\u7ea6\\u5730\\u5740\",\"_gameRewardManager\":\"GameRewardManager\\u5408\\u7ea6\\u5730\\u5740\",\"_swordBattle\":\"SwordBattle\\u5408\\u7ea6\\u5730\\u5740\"}},\"createGame(uint8)\":{\"details\":\"\\u521b\\u5efa\\u6e38\\u620f\"},\"createMultipleGames(uint8[])\":{\"details\":\"\\u6279\\u91cf\\u521b\\u5efa\\u6e38\\u620f\"},\"endGame(uint256)\":{\"details\":\"\\u7ed3\\u675f\\u6e38\\u620f\"},\"forceEndGame(uint256,string)\":{\"details\":\"\\u5f3a\\u5236\\u7ed3\\u675f\\u6e38\\u620f\"},\"getActiveGames(uint8,uint256)\":{\"details\":\"\\u83b7\\u53d6\\u6d3b\\u8dc3\\u6e38\\u620f\\u5217\\u8868\"},\"getGameFullInfo(uint256)\":{\"details\":\"\\u83b7\\u53d6\\u6e38\\u620f\\u5b8c\\u6574\\u4fe1\\u606f\"},\"getGameStats(uint256,uint256)\":{\"details\":\"\\u83b7\\u53d6\\u6e38\\u620f\\u7edf\\u8ba1\\u4fe1\\u606f\"},\"getJoinableGames(uint8,address)\":{\"details\":\"\\u83b7\\u53d6\\u53ef\\u52a0\\u5165\\u7684\\u6e38\\u620f\"},\"getPlayerCurrentGames(address)\":{\"details\":\"\\u83b7\\u53d6\\u73a9\\u5bb6\\u5f53\\u524d\\u53c2\\u4e0e\\u7684\\u6e38\\u620f\"},\"getPlayerGameHistory(address,uint256)\":{\"details\":\"\\u83b7\\u53d6\\u73a9\\u5bb6\\u6e38\\u620f\\u5386\\u53f2\"},\"getPlayerStats(address)\":{\"details\":\"\\u83b7\\u53d6\\u73a9\\u5bb6\\u7edf\\u8ba1\\u4fe1\\u606f\"},\"getRoleAdmin(bytes32)\":{\"details\":\"Returns the admin role that controls `role`. See {grantRole} and {revokeRole}. To change a role's admin, use {_setRoleAdmin}.\"},\"getSupportedFeatures()\":{\"details\":\"\\u83b7\\u53d6\\u805a\\u5408\\u5668\\u652f\\u6301\\u7684\\u529f\\u80fd\\u5217\\u8868\"},\"grantRole(bytes32,address)\":{\"details\":\"Grants `role` to `account`. If `account` had not been already granted `role`, emits a {RoleGranted} event. Requirements: - the caller must have ``role``'s admin role. May emit a {RoleGranted} event.\"},\"hasRole(bytes32,address)\":{\"details\":\"Returns `true` if `account` has been granted `role`.\"},\"joinGame(uint256)\":{\"details\":\"\\u52a0\\u5165\\u6e38\\u620f\"},\"joinMultipleGames(uint256[])\":{\"details\":\"\\u6279\\u91cf\\u52a0\\u5165\\u6e38\\u620f\"},\"pause()\":{\"details\":\"\\u6682\\u505c\\u805a\\u5408\\u5668\"},\"paused()\":{\"details\":\"Returns true if the contract is paused, and false otherwise.\"},\"renounceRole(bytes32,address)\":{\"details\":\"Revokes `role` from the calling account. Roles are often managed via {grantRole} and {revokeRole}: this function's purpose is to provide a mechanism for accounts to lose their privileges if they are compromised (such as when a trusted device is misplaced). If the calling account had been revoked `role`, emits a {RoleRevoked} event. Requirements: - the caller must be `account`. May emit a {RoleRevoked} event.\"},\"revokeRole(bytes32,address)\":{\"details\":\"Revokes `role` from `account`. If `account` had been granted `role`, emits a {RoleRevoked} event. Requirements: - the caller must have ``role``'s admin role. May emit a {RoleRevoked} event.\"},\"smartJoinGame(uint8,uint256)\":{\"details\":\"\\u667a\\u80fd\\u52a0\\u5165\\u6e38\\u620f\"},\"submitScore(uint256,address,uint256,uint256,uint256,bytes)\":{\"details\":\"\\u63d0\\u4ea4\\u5206\\u6570\"},\"supportsInterface(bytes4)\":{\"details\":\"See {IERC165-supportsInterface}.\"},\"unpause()\":{\"details\":\"\\u6062\\u590d\\u805a\\u5408\\u5668\"},\"updateGameConfig(uint8,uint256,uint256,bool)\":{\"details\":\"\\u66f4\\u65b0\\u6e38\\u620f\\u914d\\u7f6e\"},\"version()\":{\"details\":\"\\u68c0\\u67e5\\u5408\\u7ea6\\u7248\\u672c\\u517c\\u5bb9\\u6027\"}},\"title\":\"GameAggregator\",\"version\":1},\"userdoc\":{\"kind\":\"user\",\"methods\":{},\"version\":1}},\"settings\":{\"compilationTarget\":{\"src/aggregators/GameAggregator.sol\":\"GameAggregator\"},\"evmVersion\":\"paris\",\"libraries\":{},\"metadata\":{\"bytecodeHash\":\"ipfs\"},\"optimizer\":{\"enabled\":true,\"runs\":200000},\"remappings\":[\":@openzeppelin/=lib/openzeppelin-contracts/\",\":ds-test/=lib/openzeppelin-contracts/lib/forge-std/lib/ds-test/src/\",\":erc4626-tests/=lib/openzeppelin-contracts/lib/erc4626-tests/\",\":forge-std/=lib/forge-std/src/\",\":openzeppelin-contracts/=lib/openzeppelin-contracts/\",\":openzeppelin/=lib/openzeppelin-contracts/contracts/\"],\"viaIR\":true},\"sources\":{\"lib/openzeppelin-contracts/contracts/access/AccessControl.sol\":{\"keccak256\":\"0x0dd6e52cb394d7f5abe5dca2d4908a6be40417914720932de757de34a99ab87f\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://dc117ce50ea746cab6b97ed1a1facee17a715ae0cb95d67b943dacbaf15176fb\",\"dweb:/ipfs/QmYRZ2UGNYwsHwfNu7Wjr8L2j1LBZ1mKv6NvbwgterYMXc\"]},\"lib/openzeppelin-contracts/contracts/access/AccessControlEnumerable.sol\":{\"keccak256\":\"0x13f5e15f2a0650c0b6aaee2ef19e89eaf4870d6e79662d572a393334c1397247\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://7ee05f28f549a5d6515e152580716b87636ed4bfab9812499a6e3803df88288b\",\"dweb:/ipfs/QmeEnhdwY1t5Y3YU5a4ffzgXuToydH2PNdNxV9W7dEPRQJ\"]},\"lib/openzeppelin-contracts/contracts/access/IAccessControl.sol\":{\"keccak256\":\"0x59ce320a585d7e1f163cd70390a0ef2ff9cec832e2aa544293a00692465a7a57\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://bb2c137c343ef0c4c7ce7b18c1d108afdc9d315a04e48307288d2d05adcbde3a\",\"dweb:/ipfs/QmUxhrAQM3MM3FF5j7AtcXLXguWCJBHJ14BRdVtuoQc8Fh\"]},\"lib/openzeppelin-contracts/contracts/access/IAccessControlEnumerable.sol\":{\"keccak256\":\"0xba4459ab871dfa300f5212c6c30178b63898c03533a1ede28436f11546626676\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://3dcc7b09bfa6e18aab262ca372f4a9b1fc82e294b430706a4e1378cf58e6a276\",\"dweb:/ipfs/QmT8oSAcesdctR15HMLhr2a1HRpXymxdjTfdtfTYJcj2N2\"]},\"lib/openzeppelin-contracts/contracts/security/Pausable.sol\":{\"keccak256\":\"0x0849d93b16c9940beb286a7864ed02724b248b93e0d80ef6355af5ef15c64773\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://4ddabb16009cd17eaca3143feadf450ac13e72919ebe2ca50e00f61cb78bc004\",\"dweb:/ipfs/QmSPwPxX7d6TTWakN5jy5wsaGkS1y9TW8fuhGSraMkLk2B\"]},\"lib/openzeppelin-contracts/contracts/security/ReentrancyGuard.sol\":{\"keccak256\":\"0xa535a5df777d44e945dd24aa43a11e44b024140fc340ad0dfe42acf4002aade1\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://41319e7f621f2dc3733511332c4fd032f8e32ad2aa7fd6f665c19741d9941a34\",\"dweb:/ipfs/QmcYR3bd862GD1Bc7jwrU9bGxrhUu5na1oP964bDCu2id1\"]},\"lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol\":{\"keccak256\":\"0x287b55befed2961a7eabd7d7b1b2839cbca8a5b80ef8dcbb25ed3d4c2002c305\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://bd39944e8fc06be6dbe2dd1d8449b5336e23c6a7ba3e8e9ae5ae0f37f35283f5\",\"dweb:/ipfs/QmPV3FGYjVwvKSgAXKUN3r9T9GwniZz83CxBpM7vyj2G53\"]},\"lib/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Permit.sol\":{\"keccak256\":\"0xec63854014a5b4f2b3290ab9103a21bdf902a508d0f41a8573fea49e98bf571a\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://bc5b5dc12fbc4002f282eaa7a5f06d8310ed62c1c77c5770f6283e058454c39a\",\"dweb:/ipfs/Qme9rE2wS3yBuyJq9GgbmzbsBQsW2M2sVFqYYLw7bosGrv\"]},\"lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol\":{\"keccak256\":\"0x909d608c2db6eb165ca178c81289a07ed2e118e444d0025b2a85c97d0b44a4fa\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://656cda26512ddd7373c2d5551c8fae759fc30f05b10f0fc2e738e9274199dbd4\",\"dweb:/ipfs/QmTSArSzQRFbQmHgq7U1PZXnsDFhvDZhKVu9CzMG4yo6Lx\"]},\"lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol\":{\"keccak256\":\"0x2c309e7df9e05e6ce15bedfe74f3c61b467fc37e0fae9eab496acf5ea0bbd7ff\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://7063b5c98711a98018ba4635ac74cee1c1cfa2ea01099498e062699ed9530005\",\"dweb:/ipfs/QmeJ8rGXkcv7RrqLdAW8PCXPAykxVsddfYY6g5NaTwmRFE\"]},\"lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol\":{\"keccak256\":\"0x5bce51e11f7d194b79ea59fe00c9e8de9fa2c5530124960f29a24d4c740a3266\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://7e66dfde185df46104c11bc89d08fa0760737aa59a2b8546a656473d810a8ea4\",\"dweb:/ipfs/QmXvyqtXPaPss2PD7eqPoSao5Szm2n6UMoiG8TZZDjmChR\"]},\"lib/openzeppelin-contracts/contracts/token/ERC721/IERC721Receiver.sol\":{\"keccak256\":\"0xa82b58eca1ee256be466e536706850163d2ec7821945abd6b4778cfb3bee37da\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://6e75cf83beb757b8855791088546b8337e9d4684e169400c20d44a515353b708\",\"dweb:/ipfs/QmYvPafLfoquiDMEj7CKHtvbgHu7TJNPSVPSCjrtjV8HjV\"]},\"lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol\":{\"keccak256\":\"0xa8796bd16014cefb8c26449413981a49c510f92a98d6828494f5fd046223ced3\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://63a5e0bb5a7d182e0d0eef87033f78115eab791de3626a929bc98c157087880a\",\"dweb:/ipfs/QmetkXAu2CJKS4qrZtEQPU8okAPwUwa6HL4XYwk8vrYMk8\"]},\"lib/openzeppelin-contracts/contracts/token/ERC721/extensions/IERC721Enumerable.sol\":{\"keccak256\":\"0xd1556954440b31c97a142c6ba07d5cade45f96fafd52091d33a14ebe365aecbf\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://26fef835622b46a5ba08b3ef6b46a22e94b5f285d0f0fb66b703bd30217d2c34\",\"dweb:/ipfs/QmZ548qdwfL1qF7aXz3xh1GCdTiST81kGGuKRqVUfYmPZR\"]},\"lib/openzeppelin-contracts/contracts/token/ERC721/extensions/IERC721Metadata.sol\":{\"keccak256\":\"0x75b829ff2f26c14355d1cba20e16fe7b29ca58eb5fef665ede48bc0f9c6c74b9\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://a0a107160525724f9e1bbbab031defc2f298296dd9e331f16a6f7130cec32146\",\"dweb:/ipfs/QmemujxSd7gX8A9M8UwmNbz4Ms3U9FG9QfudUgxwvTmPWf\"]},\"lib/openzeppelin-contracts/contracts/utils/Address.sol\":{\"keccak256\":\"0x006dd67219697fe68d7fbfdea512e7c4cb64a43565ed86171d67e844982da6fa\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://2455248c8ddd9cc6a7af76a13973cddf222072427e7b0e2a7d1aff345145e931\",\"dweb:/ipfs/QmfYjnjRbWqYpuxurqveE6HtzsY1Xx323J428AKQgtBJZm\"]},\"lib/openzeppelin-contracts/contracts/utils/Context.sol\":{\"keccak256\":\"0xe2e337e6dde9ef6b680e07338c493ebea1b5fd09b43424112868e9cc1706bca7\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://6df0ddf21ce9f58271bdfaa85cde98b200ef242a05a3f85c2bc10a8294800a92\",\"dweb:/ipfs/QmRK2Y5Yc6BK7tGKkgsgn3aJEQGi5aakeSPZvS65PV8Xp3\"]},\"lib/openzeppelin-contracts/contracts/utils/Strings.sol\":{\"keccak256\":\"0x3088eb2868e8d13d89d16670b5f8612c4ab9ff8956272837d8e90106c59c14a0\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://b81d9ff6559ea5c47fc573e17ece6d9ba5d6839e213e6ebc3b4c5c8fe4199d7f\",\"dweb:/ipfs/QmPCW1bFisUzJkyjroY3yipwfism9RRCigCcK1hbXtVM8n\"]},\"lib/openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol\":{\"keccak256\":\"0x809bc3edb4bcbef8263fa616c1b60ee0004b50a8a1bfa164d8f57fd31f520c58\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://8b93a1e39a4a19eba1600b92c96f435442db88cac91e315c8291547a2a7bcfe2\",\"dweb:/ipfs/QmTm34KVe6uZBZwq8dZDNWwPcm24qBJdxqL3rPxBJ4LrMv\"]},\"lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol\":{\"keccak256\":\"0xd10975de010d89fd1c78dc5e8a9a7e7f496198085c151648f20cba166b32582b\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://fb0048dee081f6fffa5f74afc3fb328483c2a30504e94a0ddd2a5114d731ec4d\",\"dweb:/ipfs/QmZptt1nmYoA5SgjwnSgWqgUSDgm4q52Yos3xhnMv3MV43\"]},\"lib/openzeppelin-contracts/contracts/utils/introspection/IERC165.sol\":{\"keccak256\":\"0x447a5f3ddc18419d41ff92b3773fb86471b1db25773e07f877f548918a185bf1\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://be161e54f24e5c6fae81a12db1a8ae87bc5ae1b0ddc805d82a1440a68455088f\",\"dweb:/ipfs/QmP7C3CHdY9urF4dEMb9wmsp1wMxHF6nhA2yQE5SKiPAdy\"]},\"lib/openzeppelin-contracts/contracts/utils/math/Math.sol\":{\"keccak256\":\"0xe4455ac1eb7fc497bb7402579e7b4d64d928b846fce7d2b6fde06d366f21c2b3\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://cc8841b3cd48ad125e2f46323c8bad3aa0e88e399ec62acb9e57efa7e7c8058c\",\"dweb:/ipfs/QmSqE4mXHA2BXW58deDbXE8MTcsL5JSKNDbm23sVQxRLPS\"]},\"lib/openzeppelin-contracts/contracts/utils/math/SignedMath.sol\":{\"keccak256\":\"0xf92515413956f529d95977adc9b0567d583c6203fc31ab1c23824c35187e3ddc\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://c50fcc459e49a9858b6d8ad5f911295cb7c9ab57567845a250bf0153f84a95c7\",\"dweb:/ipfs/QmcEW85JRzvDkQggxiBBLVAasXWdkhEysqypj9EaB6H2g6\"]},\"lib/openzeppelin-contracts/contracts/utils/structs/EnumerableSet.sol\":{\"keccak256\":\"0x9f4357008a8f7d8c8bf5d48902e789637538d8c016be5766610901b4bba81514\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://20bf19b2b851f58a4c24543de80ae70b3e08621f9230eb335dc75e2d4f43f5df\",\"dweb:/ipfs/QmSYuH1AhvJkPK8hNvoPqtExBcgTB42pPRHgTHkS5c5zYW\"]},\"src/abstracts/SecureRandomness.sol\":{\"keccak256\":\"0x75efd9846379b7004d8d296b5ec9cc063c6af40bfa65a8712e8a39c83e0c2135\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://da265648fde6c8a840bebec0ef70a7c60c502b5b7e21c737df4aef830b24c6d7\",\"dweb:/ipfs/Qmf3MTd8GrhaszA6VX2Jio6DYqzUpSguRFxY9kb3jfkFkx\"]},\"src/aggregators/GameAggregator.sol\":{\"keccak256\":\"0x6e4437a5e55fab48a4747b2768ce91e505001ee1c54f9352872c7ede3326729b\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://a0641f2aef8565becd79d5959669ad98718b3f9ecf51f24b6fbcff1c97fec36a\",\"dweb:/ipfs/QmZRyxstTuFBw7uRNdw83JSWGJuwgDVrkGZK8NZaByH1DZ\"]},\"src/aggregators/interfaces/IAggregatorEvents.sol\":{\"keccak256\":\"0x4e30c84aadb23be1954c967a4ae8918eeb5ceaf098b8cf74410272881d3f19e0\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://eee5cc13fdd81c2ac0e1503287af8032f454d48e52cc2827be18b8a03973f441\",\"dweb:/ipfs/QmV9BFyDjwujH3kfCixoTeD7B1oxh2z1iWLgatu4wsxSmQ\"]},\"src/aggregators/interfaces/IGameAggregator.sol\":{\"keccak256\":\"0x5685d5c948feb3a3c3fa768692371dc8c663300e1c6e2dca1233dbc239242d1c\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://21c7f2f0744053c6f56cad0864bd0707258e2115bd1a68235f05df6039bee05f\",\"dweb:/ipfs/QmUVzY2dcsAYa511KMcnL6Arxtw3BcEPeggCz2WNNHvqHa\"]},\"src/core/SwordBattle.sol\":{\"keccak256\":\"0x8bf2441cbc052da4d6fb9d42e2d7b2fe1752590f917b6b8673cf9879db7bdfcb\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://e62697075154ba3dceaa5bed557fa3f9a70bcef077461834f26b47caa7127671\",\"dweb:/ipfs/QmdfnhZQHu8TnHzo8mEQuFUbtBsF43gaMVqiQrcFSx84e2\"]},\"src/interfaces/IFragmentManager.sol\":{\"keccak256\":\"0x9f69df0aa7caa991bf3121d3ea3efff18147e5127d15b4a1e4f4f03ba4bf21ef\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://54a73312b9a655e778cb178bdb170b75d45f804dcda21527ecb3f258242dbdf2\",\"dweb:/ipfs/QmRbebpUxMws4Z549mTLfHkzhmVLM2tUAefkKZCu7c2P2x\"]},\"src/interfaces/IRandomnessService.sol\":{\"keccak256\":\"0x2207d9ba7c4d01aac257ff05e4217262c23c14d3700ab91a20affd6af8baf8a0\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://2400ed9dde7c0ef19f540f34df05a4e6b7e6d836dd6c632e744fd2cfa09df895\",\"dweb:/ipfs/QmcnQtWw734j8fwntWcfvbtDxKSPWnMRoWZe7Bx9gi2nWN\"]},\"src/interfaces/IRewardManager.sol\":{\"keccak256\":\"0x4fe880f90077c3fbc700a59bccccd9713fb1f50e3495e91f92c5808d2f28d484\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://1bed6403801e1c3e542bf54b53c470d53a21ef3a97a6489affdb3a3b5b17ebe3\",\"dweb:/ipfs/QmYW6XhiMCVGqb58sagTeP1qXJ88XY7i58VJ5KmAau1y5q\"]},\"src/interfaces/IShovelTraitManager.sol\":{\"keccak256\":\"0x8ae3b67c908f4aee23a647b00c3be876ecfc878f5ffad3e59f618948e2353718\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://b9da7a8a1c060ccb061c5d8e9532628b0518249263fa913be0968d0071c3ced9\",\"dweb:/ipfs/QmTgsJALzL8XSJtV98V9xuvPkjBa3osidqXFFrw29sq9Ts\"]},\"src/interfaces/ISwordBattle.sol\":{\"keccak256\":\"0x8db5848799985af49793c9df4963ab5069b80d7a4241cad6d50c6f2190d83bdd\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://141b8e49644155ec4b0ec42ee8a0a9c40209634c0eb7f66580882c6850b42b94\",\"dweb:/ipfs/QmY3J8SWpipeJLP9ZckdTmeUCBL4dvwD4bJXBn7WQYLrWe\"]},\"src/libraries/FundManagementLib.sol\":{\"keccak256\":\"0xe2499abb67102237265c3404db43210fefdc57c95b0dcc7bc9671dbcf593b3d5\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://eafccc7997005bb1b664cbe5d1b40ef322b2513dad0b425078be6fe348682f87\",\"dweb:/ipfs/QmQJunZcqrYiehusdDwXhisD2Uys3iwAU5nCWebxbW74P1\"]},\"src/libraries/RandomnessTypes.sol\":{\"keccak256\":\"0xf46c822edafd3da2747ea852183bedc755871a170e3c80a100146624fc24a800\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://54e4c992d44edad8abb1ae829db960c31b333944407bfcf0c963f40486a2f501\",\"dweb:/ipfs/QmeCbhxbyKRc7aCVf87uAR159KQrTfqFt8YgBbbmrYwb5t\"]},\"src/managers/GameConfigManager.sol\":{\"keccak256\":\"0x302fb2c5834d4b66f8aebdde85f1c559d53cf6a23d91885984bc0982142f2e8e\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://db17378d48a0c561bb7dd707a586ed647ba083b8079469fd28ba20f00530907c\",\"dweb:/ipfs/QmfTT4usjYgpCXUR9YspPK4BNwffCemfc3jRcsv2yjDX7W\"]},\"src/managers/GameRewardManager.sol\":{\"keccak256\":\"0xf38d4cfb16623d12313146caee7754e1d79c710cd44913683facee76772147b8\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://3562bb459b507e61fe67369d88a1698b5b833f9b2cd19875296985806994f08a\",\"dweb:/ipfs/QmdBocD5c4hwxuDW9bud2qjEkWDn5vU9HpLPxTf14aqgof\"]},\"src/nft/ForgeNFT.sol\":{\"keccak256\":\"0x1c60ab19023001f97735b65f79e576ccae24266fbfe2ad9825440f4b7fda658f\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://1ee64e17c3ba804ca69df90d07c2e2bfa8aad1baa7b4627b4f1062a966074afd\",\"dweb:/ipfs/QmSVenKUGfZsYgF8PL5dU9giQsMKqqDn7ky2iZTu9Rv7BG\"]},\"src/nft/ShovelNFTSlim.sol\":{\"keccak256\":\"0x069b5827ed1daca5efaf10d19433849e2b800856909e67ceefe3536a2f75b7a2\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://47fafb1ff230456b482116bda2679141e97fc4e0c4704e2ba0d6d435294b56fc\",\"dweb:/ipfs/QmemWU6kAHVtHdb3yWnobKaUokE9qPE1GVRVeJgrmqZCZF\"]},\"src/nft/ShovelSynthesizer.sol\":{\"keccak256\":\"0x202ad2c31cf95928849468bc602c34789cb12ac4787ab08cd0bed1b24013f25d\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://d0d132700c148705e2ed73e5a74bfc4036ddcb563f8dc0b6554466bfd8d52888\",\"dweb:/ipfs/QmVCqVYrShyqz7jTFctVvcF2JCWsa99ncRZBvpy9ADWUjP\"]}},\"version\":1}",
    "metadata": {
      "compiler": { "version": "0.8.18+commit.87f61d96" },
      "language": "Solidity",
      "output": {
        "abi": [
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_swordBattle",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "_gameConfigManager",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "_gameRewardManager",
                "type": "address"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "swordBattle",
                "type": "address",
                "indexed": false
              },
              {
                "internalType": "address",
                "name": "gameConfigManager",
                "type": "address",
                "indexed": false
              },
              {
                "internalType": "address",
                "name": "gameRewardManager",
                "type": "address",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "AggregatorInitialized",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "aggregator",
                "type": "address",
                "indexed": true
              },
              {
                "internalType": "bytes32",
                "name": "statusType",
                "type": "bytes32",
                "indexed": true
              },
              {
                "internalType": "bytes32",
                "name": "oldValue",
                "type": "bytes32",
                "indexed": false
              },
              {
                "internalType": "bytes32",
                "name": "newValue",
                "type": "bytes32",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "AggregatorStatusChanged",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "aggregator",
                "type": "address",
                "indexed": true
              },
              {
                "internalType": "address",
                "name": "user",
                "type": "address",
                "indexed": true
              },
              {
                "internalType": "bytes32",
                "name": "operationType",
                "type": "bytes32",
                "indexed": true
              },
              {
                "internalType": "uint256",
                "name": "itemCount",
                "type": "uint256",
                "indexed": false
              },
              {
                "internalType": "bool",
                "name": "success",
                "type": "bool",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "BatchOperationCompleted",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "user",
                "type": "address",
                "indexed": true
              },
              {
                "internalType": "string",
                "name": "operation",
                "type": "string",
                "indexed": false
              },
              {
                "internalType": "uint256",
                "name": "count",
                "type": "uint256",
                "indexed": false
              },
              {
                "internalType": "bool",
                "name": "success",
                "type": "bool",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "BatchOperationExecuted",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "fromAggregator",
                "type": "address",
                "indexed": true
              },
              {
                "internalType": "address",
                "name": "toAggregator",
                "type": "address",
                "indexed": true
              },
              {
                "internalType": "bytes32",
                "name": "actionType",
                "type": "bytes32",
                "indexed": true
              },
              {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "CrossAggregatorAction",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "gameId",
                "type": "uint256",
                "indexed": true
              }
            ],
            "type": "event",
            "name": "GameInfoCached",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "account",
                "type": "address",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "Paused",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32",
                "indexed": true
              },
              {
                "internalType": "bytes32",
                "name": "previousAdminRole",
                "type": "bytes32",
                "indexed": true
              },
              {
                "internalType": "bytes32",
                "name": "newAdminRole",
                "type": "bytes32",
                "indexed": true
              }
            ],
            "type": "event",
            "name": "RoleAdminChanged",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32",
                "indexed": true
              },
              {
                "internalType": "address",
                "name": "account",
                "type": "address",
                "indexed": true
              },
              {
                "internalType": "address",
                "name": "sender",
                "type": "address",
                "indexed": true
              }
            ],
            "type": "event",
            "name": "RoleGranted",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32",
                "indexed": true
              },
              {
                "internalType": "address",
                "name": "account",
                "type": "address",
                "indexed": true
              },
              {
                "internalType": "address",
                "name": "sender",
                "type": "address",
                "indexed": true
              }
            ],
            "type": "event",
            "name": "RoleRevoked",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "account",
                "type": "address",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "Unpaused",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "user",
                "type": "address",
                "indexed": true
              },
              {
                "internalType": "address",
                "name": "aggregator",
                "type": "address",
                "indexed": true
              },
              {
                "internalType": "bytes32",
                "name": "operation",
                "type": "bytes32",
                "indexed": true
              },
              {
                "internalType": "bytes",
                "name": "inputData",
                "type": "bytes",
                "indexed": false
              },
              {
                "internalType": "bytes",
                "name": "outputData",
                "type": "bytes",
                "indexed": false
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "UserOperationRecorded",
            "anonymous": false
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "DEFAULT_ADMIN_ROLE",
            "outputs": [
              { "internalType": "bytes32", "name": "", "type": "bytes32" }
            ]
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "MAX_BATCH_SIZE",
            "outputs": [
              { "internalType": "uint256", "name": "", "type": "uint256" }
            ]
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "MAX_HISTORY_RECORDS",
            "outputs": [
              { "internalType": "uint256", "name": "", "type": "uint256" }
            ]
          },
          {
            "inputs": [
              {
                "internalType": "enum IGameAggregator.GameLevel",
                "name": "level",
                "type": "uint8"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "createGame",
            "outputs": [
              { "internalType": "uint256", "name": "gameId", "type": "uint256" }
            ]
          },
          {
            "inputs": [
              {
                "internalType": "enum IGameAggregator.GameLevel[]",
                "name": "levels",
                "type": "uint8[]"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "createMultipleGames",
            "outputs": [
              {
                "internalType": "uint256[]",
                "name": "gameIds",
                "type": "uint256[]"
              }
            ]
          },
          {
            "inputs": [
              { "internalType": "uint256", "name": "gameId", "type": "uint256" }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "endGame"
          },
          {
            "inputs": [
              { "internalType": "uint256", "name": "gameId", "type": "uint256" },
              { "internalType": "string", "name": "reason", "type": "string" }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "forceEndGame"
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "gameConfigManager",
            "outputs": [
              {
                "internalType": "contract GameConfigManager",
                "name": "",
                "type": "address"
              }
            ]
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "gameRewardManager",
            "outputs": [
              {
                "internalType": "contract GameRewardManager",
                "name": "",
                "type": "address"
              }
            ]
          },
          {
            "inputs": [
              {
                "internalType": "enum IGameAggregator.GameLevel",
                "name": "level",
                "type": "uint8"
              },
              { "internalType": "uint256", "name": "limit", "type": "uint256" }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "getActiveGames",
            "outputs": [
              {
                "internalType": "struct IGameAggregator.GameFullInfo[]",
                "name": "activeGames",
                "type": "tuple[]",
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "gameId",
                    "type": "uint256"
                  },
                  {
                    "internalType": "enum IGameAggregator.GameLevel",
                    "name": "level",
                    "type": "uint8"
                  },
                  {
                    "internalType": "enum IGameAggregator.GameStatus",
                    "name": "status",
                    "type": "uint8"
                  },
                  {
                    "internalType": "uint256",
                    "name": "totalPool",
                    "type": "uint256"
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
                    "internalType": "uint32",
                    "name": "gameDuration",
                    "type": "uint32"
                  },
                  {
                    "internalType": "uint256",
                    "name": "playerCount",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "maxPlayers",
                    "type": "uint256"
                  },
                  {
                    "internalType": "address[]",
                    "name": "activePlayers",
                    "type": "address[]"
                  },
                  { "internalType": "bool", "name": "canJoin", "type": "bool" },
                  {
                    "internalType": "uint256",
                    "name": "entryFee",
                    "type": "uint256"
                  }
                ]
              }
            ]
          },
          {
            "inputs": [
              { "internalType": "uint256", "name": "gameId", "type": "uint256" }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "getGameFullInfo",
            "outputs": [
              {
                "internalType": "struct IGameAggregator.GameFullInfo",
                "name": "gameInfo",
                "type": "tuple",
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "gameId",
                    "type": "uint256"
                  },
                  {
                    "internalType": "enum IGameAggregator.GameLevel",
                    "name": "level",
                    "type": "uint8"
                  },
                  {
                    "internalType": "enum IGameAggregator.GameStatus",
                    "name": "status",
                    "type": "uint8"
                  },
                  {
                    "internalType": "uint256",
                    "name": "totalPool",
                    "type": "uint256"
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
                    "internalType": "uint32",
                    "name": "gameDuration",
                    "type": "uint32"
                  },
                  {
                    "internalType": "uint256",
                    "name": "playerCount",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "maxPlayers",
                    "type": "uint256"
                  },
                  {
                    "internalType": "address[]",
                    "name": "activePlayers",
                    "type": "address[]"
                  },
                  { "internalType": "bool", "name": "canJoin", "type": "bool" },
                  {
                    "internalType": "uint256",
                    "name": "entryFee",
                    "type": "uint256"
                  }
                ]
              }
            ]
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "startTime",
                "type": "uint256"
              },
              { "internalType": "uint256", "name": "endTime", "type": "uint256" }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "getGameStats",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "totalGames",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "totalPlayers",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "totalPool",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "avgPlayersPerGame",
                "type": "uint256"
              }
            ]
          },
          {
            "inputs": [
              {
                "internalType": "enum IGameAggregator.GameLevel",
                "name": "level",
                "type": "uint8"
              },
              { "internalType": "address", "name": "player", "type": "address" }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "getJoinableGames",
            "outputs": [
              {
                "internalType": "struct IGameAggregator.GameFullInfo[]",
                "name": "joinableGames",
                "type": "tuple[]",
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "gameId",
                    "type": "uint256"
                  },
                  {
                    "internalType": "enum IGameAggregator.GameLevel",
                    "name": "level",
                    "type": "uint8"
                  },
                  {
                    "internalType": "enum IGameAggregator.GameStatus",
                    "name": "status",
                    "type": "uint8"
                  },
                  {
                    "internalType": "uint256",
                    "name": "totalPool",
                    "type": "uint256"
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
                    "internalType": "uint32",
                    "name": "gameDuration",
                    "type": "uint32"
                  },
                  {
                    "internalType": "uint256",
                    "name": "playerCount",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "maxPlayers",
                    "type": "uint256"
                  },
                  {
                    "internalType": "address[]",
                    "name": "activePlayers",
                    "type": "address[]"
                  },
                  { "internalType": "bool", "name": "canJoin", "type": "bool" },
                  {
                    "internalType": "uint256",
                    "name": "entryFee",
                    "type": "uint256"
                  }
                ]
              }
            ]
          },
          {
            "inputs": [
              { "internalType": "address", "name": "player", "type": "address" }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "getPlayerCurrentGames",
            "outputs": [
              {
                "internalType": "struct IGameAggregator.GameFullInfo[]",
                "name": "currentGames",
                "type": "tuple[]",
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "gameId",
                    "type": "uint256"
                  },
                  {
                    "internalType": "enum IGameAggregator.GameLevel",
                    "name": "level",
                    "type": "uint8"
                  },
                  {
                    "internalType": "enum IGameAggregator.GameStatus",
                    "name": "status",
                    "type": "uint8"
                  },
                  {
                    "internalType": "uint256",
                    "name": "totalPool",
                    "type": "uint256"
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
                    "internalType": "uint32",
                    "name": "gameDuration",
                    "type": "uint32"
                  },
                  {
                    "internalType": "uint256",
                    "name": "playerCount",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "maxPlayers",
                    "type": "uint256"
                  },
                  {
                    "internalType": "address[]",
                    "name": "activePlayers",
                    "type": "address[]"
                  },
                  { "internalType": "bool", "name": "canJoin", "type": "bool" },
                  {
                    "internalType": "uint256",
                    "name": "entryFee",
                    "type": "uint256"
                  }
                ]
              }
            ]
          },
          {
            "inputs": [
              { "internalType": "address", "name": "player", "type": "address" },
              { "internalType": "uint256", "name": "limit", "type": "uint256" }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "getPlayerGameHistory",
            "outputs": [
              {
                "internalType": "struct IGameAggregator.PlayerGameInfo[]",
                "name": "games",
                "type": "tuple[]",
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "gameId",
                    "type": "uint256"
                  },
                  {
                    "internalType": "enum IGameAggregator.GameLevel",
                    "name": "level",
                    "type": "uint8"
                  },
                  {
                    "internalType": "enum IGameAggregator.GameStatus",
                    "name": "status",
                    "type": "uint8"
                  },
                  {
                    "internalType": "uint256",
                    "name": "joinedAt",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "kills",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "score",
                    "type": "uint256"
                  },
                  {
                    "internalType": "bool",
                    "name": "scoreSubmitted",
                    "type": "bool"
                  },
                  {
                    "internalType": "bool",
                    "name": "rewardClaimed",
                    "type": "bool"
                  }
                ]
              }
            ]
          },
          {
            "inputs": [
              { "internalType": "address", "name": "player", "type": "address" }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "getPlayerStats",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "totalGamesPlayed",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "totalKills",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "totalScore",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "avgScorePerGame",
                "type": "uint256"
              },
              { "internalType": "uint256", "name": "winRate", "type": "uint256" }
            ]
          },
          {
            "inputs": [
              { "internalType": "bytes32", "name": "role", "type": "bytes32" }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "getRoleAdmin",
            "outputs": [
              { "internalType": "bytes32", "name": "", "type": "bytes32" }
            ]
          },
          {
            "inputs": [],
            "stateMutability": "pure",
            "type": "function",
            "name": "getSupportedFeatures",
            "outputs": [
              {
                "internalType": "string[]",
                "name": "features",
                "type": "string[]"
              }
            ]
          },
          {
            "inputs": [
              { "internalType": "bytes32", "name": "role", "type": "bytes32" },
              { "internalType": "address", "name": "account", "type": "address" }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "grantRole"
          },
          {
            "inputs": [
              { "internalType": "bytes32", "name": "role", "type": "bytes32" },
              { "internalType": "address", "name": "account", "type": "address" }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "hasRole",
            "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }]
          },
          {
            "inputs": [
              { "internalType": "uint256", "name": "gameId", "type": "uint256" }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "joinGame"
          },
          {
            "inputs": [
              {
                "internalType": "uint256[]",
                "name": "gameIds",
                "type": "uint256[]"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "joinMultipleGames",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "successCount",
                "type": "uint256"
              }
            ]
          },
          {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "pause"
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "paused",
            "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }]
          },
          {
            "inputs": [
              { "internalType": "bytes32", "name": "role", "type": "bytes32" },
              { "internalType": "address", "name": "account", "type": "address" }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "renounceRole"
          },
          {
            "inputs": [
              { "internalType": "bytes32", "name": "role", "type": "bytes32" },
              { "internalType": "address", "name": "account", "type": "address" }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "revokeRole"
          },
          {
            "inputs": [
              {
                "internalType": "enum IGameAggregator.GameLevel",
                "name": "level",
                "type": "uint8"
              },
              {
                "internalType": "uint256",
                "name": "maxWaitTime",
                "type": "uint256"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "smartJoinGame",
            "outputs": [
              { "internalType": "uint256", "name": "gameId", "type": "uint256" }
            ]
          },
          {
            "inputs": [
              { "internalType": "uint256", "name": "gameId", "type": "uint256" },
              { "internalType": "address", "name": "player", "type": "address" },
              { "internalType": "uint256", "name": "kills", "type": "uint256" },
              { "internalType": "uint256", "name": "score", "type": "uint256" },
              { "internalType": "uint256", "name": "nonce", "type": "uint256" },
              { "internalType": "bytes", "name": "signature", "type": "bytes" }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "submitScore"
          },
          {
            "inputs": [
              {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "supportsInterface",
            "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }]
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "swordBattle",
            "outputs": [
              {
                "internalType": "contract SwordBattle",
                "name": "",
                "type": "address"
              }
            ]
          },
          {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "unpause"
          },
          {
            "inputs": [
              {
                "internalType": "enum IGameAggregator.GameLevel",
                "name": "level",
                "type": "uint8"
              },
              {
                "internalType": "uint256",
                "name": "entryFee",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "killReward",
                "type": "uint256"
              },
              { "internalType": "bool", "name": "active", "type": "bool" }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "updateGameConfig"
          },
          {
            "inputs": [],
            "stateMutability": "pure",
            "type": "function",
            "name": "version",
            "outputs": [
              { "internalType": "string", "name": "", "type": "string" }
            ]
          }
        ],
        "devdoc": {
          "kind": "dev",
          "methods": {
            "constructor": {
              "details": "构造函数",
              "params": {
                "_gameConfigManager": "GameConfigManager合约地址",
                "_gameRewardManager": "GameRewardManager合约地址",
                "_swordBattle": "SwordBattle合约地址"
              }
            },
            "createGame(uint8)": { "details": "创建游戏" },
            "createMultipleGames(uint8[])": { "details": "批量创建游戏" },
            "endGame(uint256)": { "details": "结束游戏" },
            "forceEndGame(uint256,string)": { "details": "强制结束游戏" },
            "getActiveGames(uint8,uint256)": { "details": "获取活跃游戏列表" },
            "getGameFullInfo(uint256)": { "details": "获取游戏完整信息" },
            "getGameStats(uint256,uint256)": { "details": "获取游戏统计信息" },
            "getJoinableGames(uint8,address)": { "details": "获取可加入的游戏" },
            "getPlayerCurrentGames(address)": {
              "details": "获取玩家当前参与的游戏"
            },
            "getPlayerGameHistory(address,uint256)": {
              "details": "获取玩家游戏历史"
            },
            "getPlayerStats(address)": { "details": "获取玩家统计信息" },
            "getRoleAdmin(bytes32)": {
              "details": "Returns the admin role that controls `role`. See {grantRole} and {revokeRole}. To change a role's admin, use {_setRoleAdmin}."
            },
            "getSupportedFeatures()": { "details": "获取聚合器支持的功能列表" },
            "grantRole(bytes32,address)": {
              "details": "Grants `role` to `account`. If `account` had not been already granted `role`, emits a {RoleGranted} event. Requirements: - the caller must have ``role``'s admin role. May emit a {RoleGranted} event."
            },
            "hasRole(bytes32,address)": {
              "details": "Returns `true` if `account` has been granted `role`."
            },
            "joinGame(uint256)": { "details": "加入游戏" },
            "joinMultipleGames(uint256[])": { "details": "批量加入游戏" },
            "pause()": { "details": "暂停聚合器" },
            "paused()": {
              "details": "Returns true if the contract is paused, and false otherwise."
            },
            "renounceRole(bytes32,address)": {
              "details": "Revokes `role` from the calling account. Roles are often managed via {grantRole} and {revokeRole}: this function's purpose is to provide a mechanism for accounts to lose their privileges if they are compromised (such as when a trusted device is misplaced). If the calling account had been revoked `role`, emits a {RoleRevoked} event. Requirements: - the caller must be `account`. May emit a {RoleRevoked} event."
            },
            "revokeRole(bytes32,address)": {
              "details": "Revokes `role` from `account`. If `account` had been granted `role`, emits a {RoleRevoked} event. Requirements: - the caller must have ``role``'s admin role. May emit a {RoleRevoked} event."
            },
            "smartJoinGame(uint8,uint256)": { "details": "智能加入游戏" },
            "submitScore(uint256,address,uint256,uint256,uint256,bytes)": {
              "details": "提交分数"
            },
            "supportsInterface(bytes4)": {
              "details": "See {IERC165-supportsInterface}."
            },
            "unpause()": { "details": "恢复聚合器" },
            "updateGameConfig(uint8,uint256,uint256,bool)": {
              "details": "更新游戏配置"
            },
            "version()": { "details": "检查合约版本兼容性" }
          },
          "version": 1
        },
        "userdoc": { "kind": "user", "methods": {}, "version": 1 }
      },
      "settings": {
        "remappings": [
          "@openzeppelin/=lib/openzeppelin-contracts/",
          "ds-test/=lib/openzeppelin-contracts/lib/forge-std/lib/ds-test/src/",
          "erc4626-tests/=lib/openzeppelin-contracts/lib/erc4626-tests/",
          "forge-std/=lib/forge-std/src/",
          "openzeppelin-contracts/=lib/openzeppelin-contracts/",
          "openzeppelin/=lib/openzeppelin-contracts/contracts/"
        ],
        "optimizer": { "enabled": true, "runs": 200000 },
        "metadata": { "bytecodeHash": "ipfs" },
        "compilationTarget": {
          "src/aggregators/GameAggregator.sol": "GameAggregator"
        },
        "evmVersion": "paris",
        "libraries": {},
        "viaIR": true
      },
      "sources": {
        "lib/openzeppelin-contracts/contracts/access/AccessControl.sol": {
          "keccak256": "0x0dd6e52cb394d7f5abe5dca2d4908a6be40417914720932de757de34a99ab87f",
          "urls": [
            "bzz-raw://dc117ce50ea746cab6b97ed1a1facee17a715ae0cb95d67b943dacbaf15176fb",
            "dweb:/ipfs/QmYRZ2UGNYwsHwfNu7Wjr8L2j1LBZ1mKv6NvbwgterYMXc"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/access/AccessControlEnumerable.sol": {
          "keccak256": "0x13f5e15f2a0650c0b6aaee2ef19e89eaf4870d6e79662d572a393334c1397247",
          "urls": [
            "bzz-raw://7ee05f28f549a5d6515e152580716b87636ed4bfab9812499a6e3803df88288b",
            "dweb:/ipfs/QmeEnhdwY1t5Y3YU5a4ffzgXuToydH2PNdNxV9W7dEPRQJ"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/access/IAccessControl.sol": {
          "keccak256": "0x59ce320a585d7e1f163cd70390a0ef2ff9cec832e2aa544293a00692465a7a57",
          "urls": [
            "bzz-raw://bb2c137c343ef0c4c7ce7b18c1d108afdc9d315a04e48307288d2d05adcbde3a",
            "dweb:/ipfs/QmUxhrAQM3MM3FF5j7AtcXLXguWCJBHJ14BRdVtuoQc8Fh"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/access/IAccessControlEnumerable.sol": {
          "keccak256": "0xba4459ab871dfa300f5212c6c30178b63898c03533a1ede28436f11546626676",
          "urls": [
            "bzz-raw://3dcc7b09bfa6e18aab262ca372f4a9b1fc82e294b430706a4e1378cf58e6a276",
            "dweb:/ipfs/QmT8oSAcesdctR15HMLhr2a1HRpXymxdjTfdtfTYJcj2N2"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/security/Pausable.sol": {
          "keccak256": "0x0849d93b16c9940beb286a7864ed02724b248b93e0d80ef6355af5ef15c64773",
          "urls": [
            "bzz-raw://4ddabb16009cd17eaca3143feadf450ac13e72919ebe2ca50e00f61cb78bc004",
            "dweb:/ipfs/QmSPwPxX7d6TTWakN5jy5wsaGkS1y9TW8fuhGSraMkLk2B"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/security/ReentrancyGuard.sol": {
          "keccak256": "0xa535a5df777d44e945dd24aa43a11e44b024140fc340ad0dfe42acf4002aade1",
          "urls": [
            "bzz-raw://41319e7f621f2dc3733511332c4fd032f8e32ad2aa7fd6f665c19741d9941a34",
            "dweb:/ipfs/QmcYR3bd862GD1Bc7jwrU9bGxrhUu5na1oP964bDCu2id1"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol": {
          "keccak256": "0x287b55befed2961a7eabd7d7b1b2839cbca8a5b80ef8dcbb25ed3d4c2002c305",
          "urls": [
            "bzz-raw://bd39944e8fc06be6dbe2dd1d8449b5336e23c6a7ba3e8e9ae5ae0f37f35283f5",
            "dweb:/ipfs/QmPV3FGYjVwvKSgAXKUN3r9T9GwniZz83CxBpM7vyj2G53"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Permit.sol": {
          "keccak256": "0xec63854014a5b4f2b3290ab9103a21bdf902a508d0f41a8573fea49e98bf571a",
          "urls": [
            "bzz-raw://bc5b5dc12fbc4002f282eaa7a5f06d8310ed62c1c77c5770f6283e058454c39a",
            "dweb:/ipfs/Qme9rE2wS3yBuyJq9GgbmzbsBQsW2M2sVFqYYLw7bosGrv"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol": {
          "keccak256": "0x909d608c2db6eb165ca178c81289a07ed2e118e444d0025b2a85c97d0b44a4fa",
          "urls": [
            "bzz-raw://656cda26512ddd7373c2d5551c8fae759fc30f05b10f0fc2e738e9274199dbd4",
            "dweb:/ipfs/QmTSArSzQRFbQmHgq7U1PZXnsDFhvDZhKVu9CzMG4yo6Lx"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol": {
          "keccak256": "0x2c309e7df9e05e6ce15bedfe74f3c61b467fc37e0fae9eab496acf5ea0bbd7ff",
          "urls": [
            "bzz-raw://7063b5c98711a98018ba4635ac74cee1c1cfa2ea01099498e062699ed9530005",
            "dweb:/ipfs/QmeJ8rGXkcv7RrqLdAW8PCXPAykxVsddfYY6g5NaTwmRFE"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol": {
          "keccak256": "0x5bce51e11f7d194b79ea59fe00c9e8de9fa2c5530124960f29a24d4c740a3266",
          "urls": [
            "bzz-raw://7e66dfde185df46104c11bc89d08fa0760737aa59a2b8546a656473d810a8ea4",
            "dweb:/ipfs/QmXvyqtXPaPss2PD7eqPoSao5Szm2n6UMoiG8TZZDjmChR"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/token/ERC721/IERC721Receiver.sol": {
          "keccak256": "0xa82b58eca1ee256be466e536706850163d2ec7821945abd6b4778cfb3bee37da",
          "urls": [
            "bzz-raw://6e75cf83beb757b8855791088546b8337e9d4684e169400c20d44a515353b708",
            "dweb:/ipfs/QmYvPafLfoquiDMEj7CKHtvbgHu7TJNPSVPSCjrtjV8HjV"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol": {
          "keccak256": "0xa8796bd16014cefb8c26449413981a49c510f92a98d6828494f5fd046223ced3",
          "urls": [
            "bzz-raw://63a5e0bb5a7d182e0d0eef87033f78115eab791de3626a929bc98c157087880a",
            "dweb:/ipfs/QmetkXAu2CJKS4qrZtEQPU8okAPwUwa6HL4XYwk8vrYMk8"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/token/ERC721/extensions/IERC721Enumerable.sol": {
          "keccak256": "0xd1556954440b31c97a142c6ba07d5cade45f96fafd52091d33a14ebe365aecbf",
          "urls": [
            "bzz-raw://26fef835622b46a5ba08b3ef6b46a22e94b5f285d0f0fb66b703bd30217d2c34",
            "dweb:/ipfs/QmZ548qdwfL1qF7aXz3xh1GCdTiST81kGGuKRqVUfYmPZR"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/token/ERC721/extensions/IERC721Metadata.sol": {
          "keccak256": "0x75b829ff2f26c14355d1cba20e16fe7b29ca58eb5fef665ede48bc0f9c6c74b9",
          "urls": [
            "bzz-raw://a0a107160525724f9e1bbbab031defc2f298296dd9e331f16a6f7130cec32146",
            "dweb:/ipfs/QmemujxSd7gX8A9M8UwmNbz4Ms3U9FG9QfudUgxwvTmPWf"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/utils/Address.sol": {
          "keccak256": "0x006dd67219697fe68d7fbfdea512e7c4cb64a43565ed86171d67e844982da6fa",
          "urls": [
            "bzz-raw://2455248c8ddd9cc6a7af76a13973cddf222072427e7b0e2a7d1aff345145e931",
            "dweb:/ipfs/QmfYjnjRbWqYpuxurqveE6HtzsY1Xx323J428AKQgtBJZm"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/utils/Context.sol": {
          "keccak256": "0xe2e337e6dde9ef6b680e07338c493ebea1b5fd09b43424112868e9cc1706bca7",
          "urls": [
            "bzz-raw://6df0ddf21ce9f58271bdfaa85cde98b200ef242a05a3f85c2bc10a8294800a92",
            "dweb:/ipfs/QmRK2Y5Yc6BK7tGKkgsgn3aJEQGi5aakeSPZvS65PV8Xp3"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/utils/Strings.sol": {
          "keccak256": "0x3088eb2868e8d13d89d16670b5f8612c4ab9ff8956272837d8e90106c59c14a0",
          "urls": [
            "bzz-raw://b81d9ff6559ea5c47fc573e17ece6d9ba5d6839e213e6ebc3b4c5c8fe4199d7f",
            "dweb:/ipfs/QmPCW1bFisUzJkyjroY3yipwfism9RRCigCcK1hbXtVM8n"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol": {
          "keccak256": "0x809bc3edb4bcbef8263fa616c1b60ee0004b50a8a1bfa164d8f57fd31f520c58",
          "urls": [
            "bzz-raw://8b93a1e39a4a19eba1600b92c96f435442db88cac91e315c8291547a2a7bcfe2",
            "dweb:/ipfs/QmTm34KVe6uZBZwq8dZDNWwPcm24qBJdxqL3rPxBJ4LrMv"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol": {
          "keccak256": "0xd10975de010d89fd1c78dc5e8a9a7e7f496198085c151648f20cba166b32582b",
          "urls": [
            "bzz-raw://fb0048dee081f6fffa5f74afc3fb328483c2a30504e94a0ddd2a5114d731ec4d",
            "dweb:/ipfs/QmZptt1nmYoA5SgjwnSgWqgUSDgm4q52Yos3xhnMv3MV43"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/utils/introspection/IERC165.sol": {
          "keccak256": "0x447a5f3ddc18419d41ff92b3773fb86471b1db25773e07f877f548918a185bf1",
          "urls": [
            "bzz-raw://be161e54f24e5c6fae81a12db1a8ae87bc5ae1b0ddc805d82a1440a68455088f",
            "dweb:/ipfs/QmP7C3CHdY9urF4dEMb9wmsp1wMxHF6nhA2yQE5SKiPAdy"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/utils/math/Math.sol": {
          "keccak256": "0xe4455ac1eb7fc497bb7402579e7b4d64d928b846fce7d2b6fde06d366f21c2b3",
          "urls": [
            "bzz-raw://cc8841b3cd48ad125e2f46323c8bad3aa0e88e399ec62acb9e57efa7e7c8058c",
            "dweb:/ipfs/QmSqE4mXHA2BXW58deDbXE8MTcsL5JSKNDbm23sVQxRLPS"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/utils/math/SignedMath.sol": {
          "keccak256": "0xf92515413956f529d95977adc9b0567d583c6203fc31ab1c23824c35187e3ddc",
          "urls": [
            "bzz-raw://c50fcc459e49a9858b6d8ad5f911295cb7c9ab57567845a250bf0153f84a95c7",
            "dweb:/ipfs/QmcEW85JRzvDkQggxiBBLVAasXWdkhEysqypj9EaB6H2g6"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/utils/structs/EnumerableSet.sol": {
          "keccak256": "0x9f4357008a8f7d8c8bf5d48902e789637538d8c016be5766610901b4bba81514",
          "urls": [
            "bzz-raw://20bf19b2b851f58a4c24543de80ae70b3e08621f9230eb335dc75e2d4f43f5df",
            "dweb:/ipfs/QmSYuH1AhvJkPK8hNvoPqtExBcgTB42pPRHgTHkS5c5zYW"
          ],
          "license": "MIT"
        },
        "src/abstracts/SecureRandomness.sol": {
          "keccak256": "0x75efd9846379b7004d8d296b5ec9cc063c6af40bfa65a8712e8a39c83e0c2135",
          "urls": [
            "bzz-raw://da265648fde6c8a840bebec0ef70a7c60c502b5b7e21c737df4aef830b24c6d7",
            "dweb:/ipfs/Qmf3MTd8GrhaszA6VX2Jio6DYqzUpSguRFxY9kb3jfkFkx"
          ],
          "license": "MIT"
        },
        "src/aggregators/GameAggregator.sol": {
          "keccak256": "0x6e4437a5e55fab48a4747b2768ce91e505001ee1c54f9352872c7ede3326729b",
          "urls": [
            "bzz-raw://a0641f2aef8565becd79d5959669ad98718b3f9ecf51f24b6fbcff1c97fec36a",
            "dweb:/ipfs/QmZRyxstTuFBw7uRNdw83JSWGJuwgDVrkGZK8NZaByH1DZ"
          ],
          "license": "MIT"
        },
        "src/aggregators/interfaces/IAggregatorEvents.sol": {
          "keccak256": "0x4e30c84aadb23be1954c967a4ae8918eeb5ceaf098b8cf74410272881d3f19e0",
          "urls": [
            "bzz-raw://eee5cc13fdd81c2ac0e1503287af8032f454d48e52cc2827be18b8a03973f441",
            "dweb:/ipfs/QmV9BFyDjwujH3kfCixoTeD7B1oxh2z1iWLgatu4wsxSmQ"
          ],
          "license": "MIT"
        },
        "src/aggregators/interfaces/IGameAggregator.sol": {
          "keccak256": "0x5685d5c948feb3a3c3fa768692371dc8c663300e1c6e2dca1233dbc239242d1c",
          "urls": [
            "bzz-raw://21c7f2f0744053c6f56cad0864bd0707258e2115bd1a68235f05df6039bee05f",
            "dweb:/ipfs/QmUVzY2dcsAYa511KMcnL6Arxtw3BcEPeggCz2WNNHvqHa"
          ],
          "license": "MIT"
        },
        "src/core/SwordBattle.sol": {
          "keccak256": "0x8bf2441cbc052da4d6fb9d42e2d7b2fe1752590f917b6b8673cf9879db7bdfcb",
          "urls": [
            "bzz-raw://e62697075154ba3dceaa5bed557fa3f9a70bcef077461834f26b47caa7127671",
            "dweb:/ipfs/QmdfnhZQHu8TnHzo8mEQuFUbtBsF43gaMVqiQrcFSx84e2"
          ],
          "license": "MIT"
        },
        "src/interfaces/IFragmentManager.sol": {
          "keccak256": "0x9f69df0aa7caa991bf3121d3ea3efff18147e5127d15b4a1e4f4f03ba4bf21ef",
          "urls": [
            "bzz-raw://54a73312b9a655e778cb178bdb170b75d45f804dcda21527ecb3f258242dbdf2",
            "dweb:/ipfs/QmRbebpUxMws4Z549mTLfHkzhmVLM2tUAefkKZCu7c2P2x"
          ],
          "license": "MIT"
        },
        "src/interfaces/IRandomnessService.sol": {
          "keccak256": "0x2207d9ba7c4d01aac257ff05e4217262c23c14d3700ab91a20affd6af8baf8a0",
          "urls": [
            "bzz-raw://2400ed9dde7c0ef19f540f34df05a4e6b7e6d836dd6c632e744fd2cfa09df895",
            "dweb:/ipfs/QmcnQtWw734j8fwntWcfvbtDxKSPWnMRoWZe7Bx9gi2nWN"
          ],
          "license": "MIT"
        },
        "src/interfaces/IRewardManager.sol": {
          "keccak256": "0x4fe880f90077c3fbc700a59bccccd9713fb1f50e3495e91f92c5808d2f28d484",
          "urls": [
            "bzz-raw://1bed6403801e1c3e542bf54b53c470d53a21ef3a97a6489affdb3a3b5b17ebe3",
            "dweb:/ipfs/QmYW6XhiMCVGqb58sagTeP1qXJ88XY7i58VJ5KmAau1y5q"
          ],
          "license": "MIT"
        },
        "src/interfaces/IShovelTraitManager.sol": {
          "keccak256": "0x8ae3b67c908f4aee23a647b00c3be876ecfc878f5ffad3e59f618948e2353718",
          "urls": [
            "bzz-raw://b9da7a8a1c060ccb061c5d8e9532628b0518249263fa913be0968d0071c3ced9",
            "dweb:/ipfs/QmTgsJALzL8XSJtV98V9xuvPkjBa3osidqXFFrw29sq9Ts"
          ],
          "license": "MIT"
        },
        "src/interfaces/ISwordBattle.sol": {
          "keccak256": "0x8db5848799985af49793c9df4963ab5069b80d7a4241cad6d50c6f2190d83bdd",
          "urls": [
            "bzz-raw://141b8e49644155ec4b0ec42ee8a0a9c40209634c0eb7f66580882c6850b42b94",
            "dweb:/ipfs/QmY3J8SWpipeJLP9ZckdTmeUCBL4dvwD4bJXBn7WQYLrWe"
          ],
          "license": "MIT"
        },
        "src/libraries/FundManagementLib.sol": {
          "keccak256": "0xe2499abb67102237265c3404db43210fefdc57c95b0dcc7bc9671dbcf593b3d5",
          "urls": [
            "bzz-raw://eafccc7997005bb1b664cbe5d1b40ef322b2513dad0b425078be6fe348682f87",
            "dweb:/ipfs/QmQJunZcqrYiehusdDwXhisD2Uys3iwAU5nCWebxbW74P1"
          ],
          "license": "MIT"
        },
        "src/libraries/RandomnessTypes.sol": {
          "keccak256": "0xf46c822edafd3da2747ea852183bedc755871a170e3c80a100146624fc24a800",
          "urls": [
            "bzz-raw://54e4c992d44edad8abb1ae829db960c31b333944407bfcf0c963f40486a2f501",
            "dweb:/ipfs/QmeCbhxbyKRc7aCVf87uAR159KQrTfqFt8YgBbbmrYwb5t"
          ],
          "license": "MIT"
        },
        "src/managers/GameConfigManager.sol": {
          "keccak256": "0x302fb2c5834d4b66f8aebdde85f1c559d53cf6a23d91885984bc0982142f2e8e",
          "urls": [
            "bzz-raw://db17378d48a0c561bb7dd707a586ed647ba083b8079469fd28ba20f00530907c",
            "dweb:/ipfs/QmfTT4usjYgpCXUR9YspPK4BNwffCemfc3jRcsv2yjDX7W"
          ],
          "license": "MIT"
        },
        "src/managers/GameRewardManager.sol": {
          "keccak256": "0xf38d4cfb16623d12313146caee7754e1d79c710cd44913683facee76772147b8",
          "urls": [
            "bzz-raw://3562bb459b507e61fe67369d88a1698b5b833f9b2cd19875296985806994f08a",
            "dweb:/ipfs/QmdBocD5c4hwxuDW9bud2qjEkWDn5vU9HpLPxTf14aqgof"
          ],
          "license": "MIT"
        },
        "src/nft/ForgeNFT.sol": {
          "keccak256": "0x1c60ab19023001f97735b65f79e576ccae24266fbfe2ad9825440f4b7fda658f",
          "urls": [
            "bzz-raw://1ee64e17c3ba804ca69df90d07c2e2bfa8aad1baa7b4627b4f1062a966074afd",
            "dweb:/ipfs/QmSVenKUGfZsYgF8PL5dU9giQsMKqqDn7ky2iZTu9Rv7BG"
          ],
          "license": "MIT"
        },
        "src/nft/ShovelNFTSlim.sol": {
          "keccak256": "0x069b5827ed1daca5efaf10d19433849e2b800856909e67ceefe3536a2f75b7a2",
          "urls": [
            "bzz-raw://47fafb1ff230456b482116bda2679141e97fc4e0c4704e2ba0d6d435294b56fc",
            "dweb:/ipfs/QmemWU6kAHVtHdb3yWnobKaUokE9qPE1GVRVeJgrmqZCZF"
          ],
          "license": "MIT"
        },
        "src/nft/ShovelSynthesizer.sol": {
          "keccak256": "0x202ad2c31cf95928849468bc602c34789cb12ac4787ab08cd0bed1b24013f25d",
          "urls": [
            "bzz-raw://d0d132700c148705e2ed73e5a74bfc4036ddcb563f8dc0b6554466bfd8d52888",
            "dweb:/ipfs/QmVCqVYrShyqz7jTFctVvcF2JCWsa99ncRZBvpy9ADWUjP"
          ],
          "license": "MIT"
        }
      },
      "version": 1
    },
    "id": 42
  }
];

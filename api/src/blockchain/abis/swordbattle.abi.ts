export const SWORD_BATTLE_ABI = [
  {
    "abi": [
      {
        "type": "constructor",
        "inputs": [
          { "name": "_usd1Token", "type": "address", "internalType": "address" },
          { "name": "signer", "type": "address", "internalType": "address" },
          { "name": "_nclabToken", "type": "address", "internalType": "address" },
          { "name": "_shovelNFT", "type": "address", "internalType": "address" },
          { "name": "_forgeNFT", "type": "address", "internalType": "address" },
          {
            "name": "_fragmentManager",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "_rewardManager",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "_traitManager",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "_shovelSynthesizer",
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
        "name": "GAME_DURATION",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "MAX_PLAYERS_PER_GAME",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "SCORE_SUBMISSION_TYPE_HASH",
        "inputs": [],
        "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "autoEndGame",
        "inputs": [
          { "name": "gameId", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "batchCommit",
        "inputs": [
          {
            "name": "commitments",
            "type": "bytes32[]",
            "internalType": "bytes32[]"
          },
          { "name": "purposes", "type": "bytes32[]", "internalType": "bytes32[]" }
        ],
        "outputs": [
          { "name": "nonces", "type": "uint256[]", "internalType": "uint256[]" }
        ],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "canAutoEndGame",
        "inputs": [
          { "name": "gameId", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "canReveal",
        "inputs": [
          { "name": "user", "type": "address", "internalType": "address" },
          { "name": "nonce", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [
          { "name": "canRevealNow", "type": "bool", "internalType": "bool" }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "cleanupExpiredCommits",
        "inputs": [
          { "name": "user", "type": "address", "internalType": "address" },
          { "name": "nonces", "type": "uint256[]", "internalType": "uint256[]" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "cleanupGame",
        "inputs": [
          { "name": "gameId", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "cleanupGameBatch",
        "inputs": [
          { "name": "gameIds", "type": "uint256[]", "internalType": "uint256[]" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "commitRandom",
        "inputs": [
          { "name": "commitment", "type": "bytes32", "internalType": "bytes32" },
          { "name": "purpose", "type": "bytes32", "internalType": "bytes32" }
        ],
        "outputs": [
          { "name": "nonce", "type": "uint256", "internalType": "uint256" }
        ],
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
        "name": "createGame",
        "inputs": [
          {
            "name": "level",
            "type": "uint8",
            "internalType": "enum SwordBattle.GameLevel"
          }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "domainSeparator",
        "inputs": [],
        "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "emergencyWithdrawAll",
        "inputs": [
          { "name": "to", "type": "address", "internalType": "address" }
        ],
        "outputs": [],
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
        "name": "forgeNFT",
        "inputs": [],
        "outputs": [
          { "name": "", "type": "address", "internalType": "contract ForgeNFT" }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "fragmentManager",
        "inputs": [],
        "outputs": [
          {
            "name": "",
            "type": "address",
            "internalType": "contract IFragmentManager"
          }
        ],
        "stateMutability": "view"
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
        "name": "gameCounter",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
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
        "name": "getCommitInfo",
        "inputs": [
          { "name": "user", "type": "address", "internalType": "address" },
          { "name": "nonce", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [
          { "name": "blockNumber", "type": "uint256", "internalType": "uint256" },
          { "name": "revealed", "type": "bool", "internalType": "bool" },
          { "name": "deadline", "type": "uint256", "internalType": "uint256" },
          {
            "name": "commitPurpose",
            "type": "bytes32",
            "internalType": "bytes32"
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "getGameDuration",
        "inputs": [
          { "name": "gameId", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [
          { "name": "duration", "type": "uint256", "internalType": "uint256" }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "getGameInfo",
        "inputs": [
          { "name": "gameId", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [
          { "name": "totalPool", "type": "uint256", "internalType": "uint256" },
          { "name": "createdAt", "type": "uint256", "internalType": "uint256" },
          { "name": "endedAt", "type": "uint256", "internalType": "uint256" },
          {
            "name": "level",
            "type": "uint8",
            "internalType": "enum SwordBattle.GameLevel"
          },
          { "name": "ended", "type": "bool", "internalType": "bool" },
          { "name": "cleaned", "type": "bool", "internalType": "bool" },
          { "name": "playerCount", "type": "uint256", "internalType": "uint256" }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "getGamePlayerScores",
        "inputs": [
          { "name": "gameId", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [
          { "name": "players", "type": "address[]", "internalType": "address[]" },
          { "name": "scores", "type": "uint256[]", "internalType": "uint256[]" }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "getGamePlayers",
        "inputs": [
          { "name": "gameId", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [
          { "name": "", "type": "address[]", "internalType": "address[]" }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "getPlayerInfo",
        "inputs": [
          { "name": "gameId", "type": "uint256", "internalType": "uint256" },
          { "name": "player", "type": "address", "internalType": "address" }
        ],
        "outputs": [
          { "name": "playerAddr", "type": "address", "internalType": "address" },
          { "name": "kills", "type": "uint256", "internalType": "uint256" },
          { "name": "score", "type": "uint256", "internalType": "uint256" },
          { "name": "submitted", "type": "bool", "internalType": "bool" },
          {
            "name": "fragmentReward",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "getPlayerNonce",
        "inputs": [
          { "name": "player", "type": "address", "internalType": "address" }
        ],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "getReservePool",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "getReservePoolDetails",
        "inputs": [],
        "outputs": [
          {
            "name": "totalReserve",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "totalRewardsPending",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "availableForWithdraw",
            "type": "uint256",
            "internalType": "uint256"
          }
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
        "name": "getRoleMember",
        "inputs": [
          { "name": "role", "type": "bytes32", "internalType": "bytes32" },
          { "name": "index", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "getRoleMemberCount",
        "inputs": [
          { "name": "role", "type": "bytes32", "internalType": "bytes32" }
        ],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "getUserNonce",
        "inputs": [
          { "name": "user", "type": "address", "internalType": "address" }
        ],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
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
        "name": "isGameExpired",
        "inputs": [
          { "name": "gameId", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "isPurposeUsed",
        "inputs": [
          { "name": "user", "type": "address", "internalType": "address" },
          { "name": "nonce", "type": "uint256", "internalType": "uint256" },
          { "name": "purpose", "type": "bytes32", "internalType": "bytes32" }
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
        "name": "joinGameAsProxy",
        "inputs": [
          { "name": "gameId", "type": "uint256", "internalType": "uint256" },
          { "name": "user", "type": "address", "internalType": "address" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
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
        "name": "playerNonces",
        "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
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
        "name": "revealRandom",
        "inputs": [
          { "name": "nonce", "type": "uint256", "internalType": "uint256" },
          { "name": "randomValue", "type": "uint256", "internalType": "uint256" },
          { "name": "salt", "type": "bytes32", "internalType": "bytes32" },
          { "name": "purpose", "type": "bytes32", "internalType": "bytes32" }
        ],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
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
        "name": "rewardManager",
        "inputs": [],
        "outputs": [
          {
            "name": "",
            "type": "address",
            "internalType": "contract IRewardManager"
          }
        ],
        "stateMutability": "view"
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
        "name": "shovelSynthesizer",
        "inputs": [],
        "outputs": [
          {
            "name": "",
            "type": "address",
            "internalType": "contract ShovelSynthesizer"
          }
        ],
        "stateMutability": "view"
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
        "name": "submitScoreAsProxy",
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
        "name": "trustedSigner",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "updateContracts",
        "inputs": [
          { "name": "_nclabToken", "type": "address", "internalType": "address" },
          { "name": "_shovelNFT", "type": "address", "internalType": "address" },
          { "name": "_forgeNFT", "type": "address", "internalType": "address" },
          {
            "name": "_fragmentManager",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "_rewardManager",
            "type": "address",
            "internalType": "address"
          },
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
        "name": "updateLevelConfig",
        "inputs": [
          {
            "name": "level",
            "type": "uint8",
            "internalType": "enum SwordBattle.GameLevel"
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
        "name": "updatePoolConfig",
        "inputs": [
          {
            "name": "level",
            "type": "uint8",
            "internalType": "enum SwordBattle.GameLevel"
          },
          { "name": "killPercent", "type": "uint256", "internalType": "uint256" },
          {
            "name": "survivalPercent",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "updateSigner",
        "inputs": [
          { "name": "newSigner", "type": "address", "internalType": "address" }
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
        "type": "function",
        "name": "withdrawNclabToken",
        "inputs": [
          { "name": "amount", "type": "uint256", "internalType": "uint256" },
          { "name": "to", "type": "address", "internalType": "address" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "withdrawReservePool",
        "inputs": [
          { "name": "amount", "type": "uint256", "internalType": "uint256" },
          { "name": "to", "type": "address", "internalType": "address" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "withdrawUsdToken",
        "inputs": [
          { "name": "amount", "type": "uint256", "internalType": "uint256" },
          { "name": "to", "type": "address", "internalType": "address" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "event",
        "name": "ConfigUpdated",
        "inputs": [
          {
            "name": "level",
            "type": "uint8",
            "indexed": false,
            "internalType": "enum SwordBattle.GameLevel"
          },
          {
            "name": "entryFee",
            "type": "uint256",
            "indexed": false,
            "internalType": "uint256"
          },
          {
            "name": "killReward",
            "type": "uint256",
            "indexed": false,
            "internalType": "uint256"
          }
        ],
        "anonymous": false
      },
      {
        "type": "event",
        "name": "FragmentBonus",
        "inputs": [
          {
            "name": "player",
            "type": "address",
            "indexed": true,
            "internalType": "address"
          },
          {
            "name": "gameId",
            "type": "uint256",
            "indexed": true,
            "internalType": "uint256"
          },
          {
            "name": "extraFragments",
            "type": "uint64",
            "indexed": false,
            "internalType": "uint64"
          }
        ],
        "anonymous": false
      },
      {
        "type": "event",
        "name": "FundsWithdrawn",
        "inputs": [
          {
            "name": "admin",
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
        "name": "GameCleaned",
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
        "name": "GameCreated",
        "inputs": [
          {
            "name": "gameId",
            "type": "uint256",
            "indexed": false,
            "internalType": "uint256"
          },
          {
            "name": "level",
            "type": "uint8",
            "indexed": false,
            "internalType": "enum SwordBattle.GameLevel"
          },
          {
            "name": "gameDuration",
            "type": "uint256",
            "indexed": false,
            "internalType": "uint256"
          }
        ],
        "anonymous": false
      },
      {
        "type": "event",
        "name": "GameEnded",
        "inputs": [
          {
            "name": "gameId",
            "type": "uint256",
            "indexed": true,
            "internalType": "uint256"
          },
          {
            "name": "autoEnded",
            "type": "bool",
            "indexed": false,
            "internalType": "bool"
          }
        ],
        "anonymous": false
      },
      {
        "type": "event",
        "name": "PlayerJoined",
        "inputs": [
          {
            "name": "gameId",
            "type": "uint256",
            "indexed": false,
            "internalType": "uint256"
          },
          {
            "name": "player",
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
        "name": "ScoreSubmitted",
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
            "name": "kills",
            "type": "uint64",
            "indexed": false,
            "internalType": "uint64"
          },
          {
            "name": "score",
            "type": "uint64",
            "indexed": false,
            "internalType": "uint64"
          }
        ],
        "anonymous": false
      },
      {
        "type": "event",
        "name": "ShovelSynthesized",
        "inputs": [
          {
            "name": "player",
            "type": "address",
            "indexed": true,
            "internalType": "address"
          },
          {
            "name": "newShovelId",
            "type": "uint256",
            "indexed": false,
            "internalType": "uint256"
          },
          {
            "name": "fromTier",
            "type": "uint8",
            "indexed": false,
            "internalType": "uint8"
          },
          {
            "name": "toTier",
            "type": "uint8",
            "indexed": false,
            "internalType": "uint8"
          }
        ],
        "anonymous": false
      }
    ],
    "bytecode": {
      "object": "0x60a034620002c757601f62005f2038819003918201601f19168301926001600160401b0392909183851183861017620002b157816101609284926040978852833981010312620002c7576200005481620002cc565b9060209162000065838301620002cc565b9162000073868201620002cc565b6200008160608301620002cc565b6200008f60808401620002cc565b6200009d60a08501620002cc565b620000ab60c08601620002cc565b91620000ba60e08701620002cc565b93620000ca6101008801620002cc565b95620000e9610140620000e16101208b01620002cc565b9901620002cc565b9860016002558d80518d81019142835244908201523360601b60608201523060601b60748201526068815260a081019e8f90828210911117620002b1579d8f529c51909c206005556001600160a01b039b8c16608052600880546001600160a01b0319908116928e16929092179055600980548216928d1692909217909155600a80548216928c1692909217909155600b80548216928b1692909217909155600c80548216928a1692909217909155600d8054821692891692909217909155600e80548216928816929092179091556006805482169287169290921790915560078054821692861692909217909155600f8054909116919093161790915560006010819055808052808252828120338252825282812054620002209260019160ff161562000269575b8280525282339120620002e1565b5051615bb190816200036f823960805181818161041f0152818161083a01528181610cca01528181611ac7015281816129bc01528181612ab20152818161337901526135dc0152f35b82805282815284832033845281528483208260ff198254161790553333847f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d8180a462000212565b634e487b7160e01b600052604160045260246000fd5b600080fd5b51906001600160a01b0382168203620002c757565b919060018301600090828252806020526040822054156000146200036857845494680100000000000000008610156200035457600186018082558610156200034057836040949596828552602085200155549382526020522055600190565b634e487b7160e01b83526032600452602483fd5b634e487b7160e01b83526041600452602483fd5b5092505056fe608060408181526004908136101561001657600080fd5b600092833560e01c90816301ffc9a714613f30575083816302e06cc814613e82575080630f42d19114613e055780630f4ef8a614613db25780631004ff6114613c9557806315a40f4914613c2757806317723e8714613bd4578063185f31b014613b9a57806319ead6fa14612cad5780631b94770714613b1c578063248a9ca314613ad457806325cb9e5114613a815780632e0be39a14613a445780632e15f1b7146139f15780632f2ff15d146138f057806336568abe1461380b578063371665b0146137b85780633ccd10e91461370d57806347e1d5501461366f5780634efd37491461361c5783816354ab62691461352f57508063599706d0146133f057806359c1303f1461339d57806361412fbc1461332e57806361c3ddfa14612eff5780636388607c14612eac57806365b3a7ca14612e4b5780636834e3a814612dea57838163686a978c14612d0f5750806368efccbb14612cad578063718072e514612c025780637cf4c4cd14612afa578381638391a66514612a175781638cce2d4714612921575080639010d07c146128b457806391d148541461284357806392bf9248146127025780639d8df9ee146125a2578063a217fddf14612569578063a3dac2de14612195578063a7ecd37e14612113578063b2040f2014612020578063b622c03414611f10578063b6d4d64b14611e7d578063b753204d14611ccb578063c31b29ce14611c90578063c60d199614611c37578063c7d7996e14611ba4578063ca15c87314611b5e578063cf05d9c014611a59578063d0399bb8146116e7578063d547741f1461168d578063da79a9c3146113b6578063e580f6ab14611192578063e87e5f9d14610fcd578063eeb7cfa314610f7a578063efaa55a014610b9d578063f440256d146109c1578063f698da251461097f578063f713f6a414610946578063f74d5480146108ef578063f9f6a812146107ce5763ffcd664b146102e157600080fd5b346107ca57807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca57813561031961408d565b91610322615140565b61032a6141e6565b811515806107be575b61033c90614e2f565b81855260209360118552818620818101549161035e60ff8460281c1615614e94565b61036e60ff8460301c1615614ef9565b87600683019773ffffffffffffffffffffffffffffffffffffffff80891693846000528a83526103a48289600020541615614f5e565b60058601906103b66032835410614fc3565b8360ff846006541699821c166103cb816140b0565b6103d4816140b0565b60248b51809b81937f0d4158c2000000000000000000000000000000000000000000000000000000008352610408816140b0565b868301525afa9788156107b4578598610781575b507f0000000000000000000000000000000000000000000000000000000000000000908382168a517f70a0823100000000000000000000000000000000000000000000000000000000815288838201528681602481855afa908115610777578e918c918a9161073b575b509161049a8994926104f096941015615028565b8d517fdd62ed3e00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff9091169281019283523060208401529384928391829160400190565b03915afa9081156107315786916106e2575b506106aa96936106067f87969bc7faf902221a147b95ceba76e011c5efb0339a0a8ee7a2bb82d9cfbbd69e61055c8f60019a976106d79f9e9d9a978e6105579161054f8f9a83111561508d565b8430916151ad565b6150f2565b8b519261056884614636565b878452858401918783528d8501968888526060860199898b5260808701998a52600052528c6000209351167fffffffffffffffffffffffff000000000000000000000000000000000000000084541617835551151582907fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff74ff0000000000000000000000000000000000000000835492151560a01b169116179055565b915182547fffffff0000000000000000ffffffffffffffffffffffffffffffffffffffffff1660a89190911b7cffffffffffffffff0000000000000000000000000000000000000000001617825567ffffffffffffffff91019251167fffffffffffffffffffffffffffffffff000000000000000000000000000000006fffffffffffffffff0000000000000000845493518a1b16921617179055019182546147e4565b90555191825273ffffffffffffffffffffffffffffffffffffffff90921660208201529081906040820190565b0390a1600160025580f35b80939d965085809398959b9a999692503d831161072a575b61070481836146a6565b81010312610725579051939a96979596929591948c949193916106d7610502565b600080fd5b503d6106fa565b8a513d88823e3d90fd5b939499505050508581813d8311610770575b61075781836146a6565b8101031261072557518e9691908d908b9061049a610486565b503d61074d565b8c513d8a823e3d90fd5b84809299508196503d83116107ad575b61079b81836146a6565b81010312610725578b9351963861041c565b503d610791565b89513d87823e3d90fd5b50601054821115610333565b8280fd5b50346107ca57827ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca578051917fe33e75c200000000000000000000000000000000000000000000000000000000835273ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000169083015260608260248173__$bcf66ed587f714e3ffb8bafad5409d838b$__5af49081156108e6578392849085936108a1575b506060945081519384526020840152820152f35b93505090506060823d82116108de575b816108be606093836146a6565b810103126107ca576060925081519080602084015193015191923861088d565b3d91506108b1565b513d84823e3d90fd5b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425760209073ffffffffffffffffffffffffffffffffffffffff600f54169051908152f35b5080fd5b833461097c576109746109583661411d565b95610967959195949294615140565b61096f6141e6565b615401565b600160025580f35b80fd5b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610942576020906109ba614d06565b9051908152f35b833461097c5760c07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261097c576109f961406a565b610a0161408d565b60443573ffffffffffffffffffffffffffffffffffffffff90818116809103610725576064359180831680930361072557608435938185168095036107255760a43595828716809703610725578290610a586141e6565b1680610b6e575b501680610b3f575b5080610b10575b5080610ae1575b5080610ab2575b5080610a86575080f35b7fffffffffffffffffffffffff0000000000000000000000000000000000000000600d541617600d5580f35b7fffffffffffffffffffffffff0000000000000000000000000000000000000000600c541617600c5582610a7c565b7fffffffffffffffffffffffff0000000000000000000000000000000000000000600b541617600b5583610a75565b7fffffffffffffffffffffffff0000000000000000000000000000000000000000600a541617600a5584610a6e565b7fffffffffffffffffffffffff0000000000000000000000000000000000000000600954161760095585610a67565b7fffffffffffffffffffffffff0000000000000000000000000000000000000000600854161760085587610a5f565b50346107ca57602091827ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610f7657803592610bda615140565b83151580610f6a575b610bec90614e2f565b8385526011815282852090858383015493610c0d60ff8660281c1615614e94565b610c1d60ff8660301c1615614ef9565b60068401903360005281845273ffffffffffffffffffffffffffffffffffffffff90610c4f8289600020541615614f5e565b6005860190610c616032835410614fc3565b8560ff846006541699821c16610c76816140b0565b610c7f816140b0565b60248b51809b81937f0d4158c2000000000000000000000000000000000000000000000000000000008352610cb3816140b0565b868301525afa9788156107b4578598610f37575b507f0000000000000000000000000000000000000000000000000000000000000000908382168a517f70a0823100000000000000000000000000000000000000000000000000000000815233838201528881602481855afa90811561077757899392918c918a91610efd575b50610d8594939291610d46911015615028565b8c517fdd62ed3e000000000000000000000000000000000000000000000000000000008152339281019283523060208401529384928391829160400190565b03915afa908115610731578691610eb3575b509360016106d79a9894610def8b9995610de87f87969bc7faf902221a147b95ceba76e011c5efb0339a0a8ee7a2bb82d9cfbbd69f9d610e9d9b97610ddf82889d101561508d565b309033906151ad565b33906150f2565b6106068a5191610dfe83614636565b338352868301908682528c8401958787526060850198888a526080860198895233600052528c6000209351167fffffffffffffffffffffffff000000000000000000000000000000000000000084541617835551151582907fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff74ff0000000000000000000000000000000000000000835492151560a01b169116179055565b9055519081523360208201529081906040820190565b878094939b9995975081969c9a9892503d8311610ef6575b610ed581836146a6565b81010312610725579251969895979496919590948a94919391926001610d97565b503d610ecb565b93995050509181813d8311610f30575b610f1781836146a6565b8101031261072557518c96889290918b90610d85610d33565b503d610f0d565b86809299508196503d8311610f63575b610f5181836146a6565b81010312610725578993519638610cc7565b503d610f47565b50601054841115610be3565b8380fd5b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425760209073ffffffffffffffffffffffffffffffffffffffff600b54169051908152f35b509190346109425760607ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425780359261100a61408d565b93604435906110176141e6565b808552601160205260ff84848720015460281c166111355773ffffffffffffffffffffffffffffffffffffffff80961693848652600360205283862083875260205260ff6002858820015416156110d8578596600c541690813b156110d457866064928195875198899687957fe87e5f9d000000000000000000000000000000000000000000000000000000008752860152602485015260448401525af19081156108e657506110c45750f35b6110cd906145f3565b61097c5780f35b8680fd5b60649060208551917f08c379a0000000000000000000000000000000000000000000000000000000008352820152601b60248201527f52616e646f6d6e657373206e6f742072657665616c65642079657400000000006044820152fd5b60648460208551917f08c379a0000000000000000000000000000000000000000000000000000000008352820152601260248201527f47616d6520616c726561647920656e64656400000000000000000000000000006044820152fd5b5082903461094257602090817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca5783356003811015610f76576111d96141e6565b73ffffffffffffffffffffffffffffffffffffffff600654166111fb826140b0565b8360ff8316611209816140b0565b60248551809481937f8b0d9f5c00000000000000000000000000000000000000000000000000000000835261123d816140b0565b8b8301525afa9081156113ac57859161137f575b50156113235791846060927f94d432d34c6bf23aeab9b063a19d03c71d674549cc2ffc9d82c1dd37ee16535794611289601054614c4e565b92836010558388526011855282882093845583016112a6826140b0565b8054936002429101557fffffffffffffffffffffffffffffffffffffffffffffffffff00ffffffffffff6104b080957fffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000064ff00000000868a1b1691161717169055601054938251948552611319826140b0565b840152820152a180f35b606485848451917f08c379a0000000000000000000000000000000000000000000000000000000008352820152600e60248201527f4c4556454c5f494e4143544956450000000000000000000000000000000000006044820152fd5b61139f9150843d86116113a5575b61139781836146a6565b810190614e17565b86611251565b503d61138d565b83513d87823e3d90fd5b50346107ca57807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca5767ffffffffffffffff9282358481116109425761140590369085016141b5565b90936024958635908111610f765761142090369083016141b5565b80849792970361163157600a84116115d55761143e84959295614c93565b96826001948543019586431197600b4301809811965b818110611476576114728d8d519182916020835260208301906140e9565b0390f35b3385528960208581528d872054916115aa57896115aa57818f8f928f906115978f93978e8e82998f8f8f9d8f6115a59f9388938f92958e8d7f2c1c32a0b6860c2d724927516c372f04d3803b0c92051eb45a033c3c83177d469f886115919a6114de92614ce2565b359033865260039384928383528888208d89528352888820553387528282528787208c88528252439088882001553386528181528686208b875281526002878720017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff008154169055338652528d858520908a865252828585200155611564868b8b614ce2565b35903384528d528383208884528d52600584842001553382528b522061158a8154614c4e565b9055614cf2565b52614ce2565b3594519283523392a4614c4e565b611454565b8f876011887f4e487b7100000000000000000000000000000000000000000000000000000000835252fd5b60648360188a60208a51937f08c379a00000000000000000000000000000000000000000000000000000000085528401528201527f546f6f206d616e7920636f6d6d697473206174206f6e636500000000000000006044820152fd5b60648360158a60208a51937f08c379a00000000000000000000000000000000000000000000000000000000085528401528201527f4172726179206c656e677468206d69736d6174636800000000000000000000006044820152fd5b50346107ca57807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca576116e491356116df60016116ce61408d565b938387528660205286200154614496565b614731565b80f35b508290346109425760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc918183360112610f76578435926117276141e6565b838552601183528582862001549061175560ff8361174b82809660281c1615614e94565b60301c1615614ef9565b600091858352601185528383209188830191650100000000007fffffffffffffffffffffffffffffffffffffffffffffffffffff00ffffffffff845416178093556003924284860155600585019081546117ae81614c7b565b956117bb8a5197886146a6565b8187527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe06117e883614c7b565b018b8a5b828110611a27575090508a8a8b60068c01935b868310611987575050505050505073ffffffffffffffffffffffffffffffffffffffff9260018460075416970154918a1c169061183b826140b0565b611844826140b0565b863b156119835792879694918b9d96948a519e8f987f9ae3c518000000000000000000000000000000000000000000000000000000008a52890152602488015261188d816140b0565b60448701526118a860a09384606489015260a4880190615b0a565b9186830301608487015289808551938481520194019287915b8b84841061192c575050505050508383809203925af1958615611920577f716f3063a3b0e65531660dc2d5d241dfcf3b2983d26d7a70df643ad232d51783949596611911575b509051908152a280f35b61191a906145f3565b86611907565b509051903d90823e3d90fd5b85518051831688528181015167ffffffffffffffff908116838a01528d82015181168e8a01526060808301511515908a015260809182015116908801528a99508f98509582019590940193600192909201916118c1565b8780fd5b83611a1e94611996858c614a0f565b949073ffffffffffffffffffffffffffffffffffffffff95869154908b1b1c16815287845220908b60018354930154928251956119d287614636565b8116865267ffffffffffffffff94858260a81c16908701528484168387015260a01c16151560608501521c166080820152611a0d828c614cf2565b52611a18818b614cf2565b50614c4e565b8b908b8e6117ff565b8c518c8e611a3483614636565b81835281858401528201528c60608201528c608082015282828c010152018c906117ec565b5082903461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610942578051927f3d6086d200000000000000000000000000000000000000000000000000000000845273ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000169084015260208360248173__$bcf66ed587f714e3ffb8bafad5409d838b$__5af4918215611b535791611b1f575b6020925051908152f35b90506020823d8211611b4b575b81611b39602093836146a6565b81010312610725576020915190611b15565b3d9150611b2c565b9051903d90823e3d90fd5b5090346107ca5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca5760209282913581526001845220549051908152f35b5090346107ca57817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca578160809373ffffffffffffffffffffffffffffffffffffffff611bf561406a565b1681526003602052818120602435825260205220600181015492600560ff60028401541693830154920154928151948552151560208501528301526060820152f35b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261094257602090517f83aeca795846b427cef798c5053d6b58222df44008576b8d6159e88e329175ad8152f35b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261094257602090516104b08152f35b50346107ca57807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca57611d0261406a565b9060243567ffffffffffffffff8111611e7957611d2590939293369084016141b5565b91909273ffffffffffffffffffffffffffffffffffffffff869516945b838110611db9575050805191602083528060208401527f07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8111611db5577f78d0c440b837302f1d84bd6b81e603f079ef72d8bad8c935d13002d4d2e7cd1993839160051b8091848401378101030190a280f35b8580fd5b611e0a9086885260038789836020938085528a611dda838c8c872093614ce2565b35845285528989808520948d6001968781015415159081611e54575b50611e0f575b505050505050505050614c4e565b611d42565b600098611e2a8a97889660059b865288845286862094614ce2565b3583525220938185558401558c600284015582015582868201550155388781838189898e8d611dfc565b8d810154431191508115611e6a575b5038611df6565b60ff9150600201541638611e63565b8480fd5b50346107ca5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca57806020938335815260118552209182015460ff8160281c16159283611f00575b83611edd575b5050519015158152f35b611ef5929350600263ffffffff9101549116906147e4565b421015903880611ed3565b925060ff8160301c161592611ecd565b5090346107ca57602090817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610f7657803567ffffffffffffffff8111611e7957611f6190369083016141b5565b611f6c9491946141e6565b855b818110611f79578680f35b80611f88611fb4928489614ce2565b358089526011875285858a2001805460ff808260281c169081612012575b50611fb9575b505050614c4e565b611f6e565b7fffffffffffffffffffffffffffffffffffffffffffffffffff00ffffffffffff1666010000000000001790557f0d44df2447ad08457aac2b0eb4cce9cd8220ae20431d62a8ea4dd69629fd2f0c8980a2388080611fac565b90508160301c161538611fa6565b5082903461094257807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425773ffffffffffffffffffffffffffffffffffffffff61206e61406a565b1682526003602052808220602435835260205280822060018101548015159384612103575b846120bc575b505092602093836120ae575050519015158152f35b015443111591508380611ed3565b90919350600182018092116120d75750431191602085612099565b806011867f4e487b71000000000000000000000000000000000000000000000000000000006024945252fd5b600283015460ff16159450612093565b833461097c5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261097c5773ffffffffffffffffffffffffffffffffffffffff61216061406a565b6121686141e6565b167fffffffffffffffffffffffff0000000000000000000000000000000000000000600f541617600f5580f35b508290346109425760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc8181360112610f76578435928385526011835280852061220f8782015463ffffffff600260ff946121f6868560281c1615614e94565b612205868560301c1615614ef9565b01549116906147e4565b421061250d578460005260118452816000209287840190650100000000007fffffffffffffffffffffffffffffffffffffffffffffffffffff00ffffffffff83541617809255600391428387015560058601805461226c81614c7b565b94612279885196876146a6565b8186527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe06122a683614c7b565b018a60005b8281106124d6575050506006890160005b83811061243b575050505073ffffffffffffffffffffffffffffffffffffffff91826007541695600180990154918a1c16906122f7826140b0565b612300826140b0565b863b156107255787517f9ae3c5180000000000000000000000000000000000000000000000000000000081529c8d018b905260248d01528b9493919290612346816140b0565b604486015261236160a09384606488015260a4870190615b0a565b918583030160848601528880855193848152019401926000915b898b8585106123e957505050505050509181600081819503925af19586156123de577f716f3063a3b0e65531660dc2d5d241dfcf3b2983d26d7a70df643ad232d517839495966123cf575b5051908152a280f35b6123d8906145f3565b866123c6565b50513d6000823e3d90fd5b86518051841689528082015167ffffffffffffffff9081168a8401528c82015181168d8b01526060808301511515908b015260809182015116908901528f98509683019695909501949092019161237b565b808c8361244b6124d19489614a0f565b929073ffffffffffffffffffffffffffffffffffffffff9384915490891b1c16600052528d8c8c81600020600181549101549280519561248a87614636565b8216865267ffffffffffffffff94858360a81c16908701528484169086015260a01c16151560608401528d1c1660808201526124c6828b614cf2565b52611a18818a614cf2565b6122bc565b8a516124e181614636565b6000815260008382015260008c820152600060608201526000608082015282828b010152018b906122ab565b606487858451917f08c379a0000000000000000000000000000000000000000000000000000000008352820152600b60248201527f4e4f545f455850495245440000000000000000000000000000000000000000006044820152fd5b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425751908152602090f35b5082903461094257807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261094257602435338352602093808552828420549360014301918243116126d657600b43018093116126d657859291859133825260038952828220858352895280358383205533825260038952828220858352895243600184842001553382526003895282822085835289526002838320017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0081541690553382526003895282822085835289528381848420015533825260038952828220858352895285600584842001553382528852206126a48154614c4e565b905583519081527f2c1c32a0b6860c2d724927516c372f04d3803b0c92051eb45a033c3c83177d46863392a451908152f35b9060116024927f4e487b7100000000000000000000000000000000000000000000000000000000835252fd5b50346107ca5760807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca5781356003811015610f7657602435918460443594606435908115158092036107ca5761275c6141e6565b73ffffffffffffffffffffffffffffffffffffffff6006541661277e866140b0565b60ff86169061278c826140b0565b803b15611e7957849283608492885196879586947f92bf92480000000000000000000000000000000000000000000000000000000086526127cc826140b0565b8501528b60248501528c604485015260648401525af1801561283957612825575b50507f661124c8826d75343ee919baad251f50d4348b31f86cd88dabc18a6d96e351bd9361281f915193849384615b5d565b0390a180f35b61282e906145f3565b611e795784386127ed565b83513d84823e3d90fd5b5090346107ca57817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca5773ffffffffffffffffffffffffffffffffffffffff8260209461289461408d565b93358152808652209116600052825260ff81600020541690519015158152f35b5090346107ca57817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca5761291260209373ffffffffffffffffffffffffffffffffffffffff9235815260018552836024359120614a0f565b92905490519260031b1c168152f35b80848434612a1357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112612a135761295a61408d565b916129636141e6565b73__$bcf66ed587f714e3ffb8bafad5409d838b$__92833b15611e795782517ff955b50100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000008116828501908152933560208501529091166040830152928491849190829081906060015b03915af49081156108e657506110c45750f35b5050fd5b80848434612a1357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112612a1357612a5061408d565b91612a596141e6565b73__$bcf66ed587f714e3ffb8bafad5409d838b$__92833b15611e795782517f686f5a0c00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000811682850190815293356020850152909116604083015292849184919082908190606001612a00565b50346107ca5760607ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca5781356003811015610f7657602435918460443594612b466141e6565b73ffffffffffffffffffffffffffffffffffffffff6007541690612b69856140b0565b60ff8516612b76816140b0565b823b15610f76576064849283875195869485937f7cf4c4cd000000000000000000000000000000000000000000000000000000008552612bb5826140b0565b8401528a60248401528b60448401525af18015612839576128255750507f661124c8826d75343ee919baad251f50d4348b31f86cd88dabc18a6d96e351bd9361281f915193849384615b5d565b5091903461094257612c133661411d565b96612c25969196959295949394615140565b73ffffffffffffffffffffffffffffffffffffffff600f54163303612c505750610974979850615401565b60649060208b51917f08c379a0000000000000000000000000000000000000000000000000000000008352820152600a60248201527f4e4f545f5349474e4552000000000000000000000000000000000000000000006044820152fd5b8382346109425760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610942578060209273ffffffffffffffffffffffffffffffffffffffff612cff61406a565b1681526012845220549051908152f35b80848434612a1357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112612a1357612d4861408d565b612d506141e6565b60085473ffffffffffffffffffffffffffffffffffffffff169073__$bcf66ed587f714e3ffb8bafad5409d838b$__803b15611db55783517fad7cc5a300000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff93841686820190815295356020870152919092166040850152928491849182908190606001612a00565b5090346107ca5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca57602092829173ffffffffffffffffffffffffffffffffffffffff612e3d61406a565b168252845220549051908152f35b5090346107ca5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca578063ffffffff83602095612ea294358152601187522091600283015492015416906147e4565b4210159051908152f35b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425760209073ffffffffffffffffffffffffffffffffffffffff600754169051908152f35b508290346109425760807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425782359260249384359160449586359160649485359533895260209860038a528881208782528a52888120600181015480156132d35760ff600283015416613278576001810180911161324d574311156131f357840154431161319a57889033815260038b528181208882528b5220998760058c0154036131425788518a810190848252878b8201528a8152612fc581614652565b5190208b54036130ea575050600189015492600554938851958a8701938452898701524460608701528040608087015260a08601523360601b60c08601528660d48601528360f486015260f4855261012085019285841067ffffffffffffffff8511176130be5750509181600393610160999a93895285519020809986610140839801948552015287815261305981614652565b5190206005556002810160017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00825416179055015582518481527f5ed67831b1d8ad7d0b81cce82eff245333944fa87fe281fa31c2417f52b38733863392a451908152f35b6041907f4e487b7100000000000000000000000000000000000000000000000000000000600052526000fd5b7f496e76616c69642072657665616c0000000000000000000000000000000000008491600e878d8d51957f08c379a0000000000000000000000000000000000000000000000000000000008752860152840152820152fd5b7f507572706f7365206d69736d617463680000000000000000000000000000000084916010878d8d51957f08c379a0000000000000000000000000000000000000000000000000000000008752860152840152820152fd5b50827f52657665616c20646561646c696e6520706173736564000000000000000000008b6016878d8d51957f08c379a0000000000000000000000000000000000000000000000000000000008752860152840152820152fd5b5050827f546f6f206561726c7920746f2072657665616c000000000000000000000000008b6013878d8d51957f08c379a0000000000000000000000000000000000000000000000000000000008752860152840152820152fd5b86836011887f4e487b7100000000000000000000000000000000000000000000000000000000835252fd5b505050827f416c72656164792072657665616c6564000000000000000000000000000000008b6010878d8d51957f08c379a0000000000000000000000000000000000000000000000000000000008752860152840152820152fd5b505050827f4e6f20636f6d6d697420666f756e6400000000000000000000000000000000008b600f878d8d51957f08c379a0000000000000000000000000000000000000000000000000000000008752860152840152820152fd5b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610942576020905173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168152f35b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425760209073ffffffffffffffffffffffffffffffffffffffff600d54169051908152f35b5090346107ca57602090817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610f76573583526011815281832092600584019384549061343f82614c7b565b9561344c865197886146a6565b8287527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe061347984614c7b565b013686890137600661348a84614c93565b949201915b8381106134ba5786518781528061147288886134ad848d018e614020565b91848303908501526140e9565b806134c861352a9284614a0f565b73ffffffffffffffffffffffffffffffffffffffff809254600392831b1c166134f1848d614cf2565b526134fc8386614a0f565b9054911b1c1660005283875267ffffffffffffffff6001896000200154166135248288614cf2565b52614c4e565b61348f565b80848434612a135760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112612a135761356961406a565b916135726141e6565b73__$bcf66ed587f714e3ffb8bafad5409d838b$__9073ffffffffffffffffffffffffffffffffffffffff806008541691833b156110d4578693606492865197889586947ff71c165e000000000000000000000000000000000000000000000000000000008652837f0000000000000000000000000000000000000000000000000000000000000000169086015260248501521660448301525af49081156108e657506110c45750f35b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425760209073ffffffffffffffffffffffffffffffffffffffff600e54169051908152f35b5090346107ca5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca5760ff8260e0948335815260116020522092600184015493600281015493600382015490820154926005858560201c1693015495815197885260208801528601526136e9816140b0565b6060850152818160281c161515608085015260301c16151560a083015260c0820152f35b50346107ca57807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca5760068160a09461374a61408d565b943581526011602052200173ffffffffffffffffffffffffffffffffffffffff809316600052602052806000209060018254920154908051938316845260ff67ffffffffffffffff93848160a81c16602087015284841683870152861c16151560608501521c166080820152f35b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425760209073ffffffffffffffffffffffffffffffffffffffff600954169051908152f35b5091903461094257827ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425761384461408d565b903373ffffffffffffffffffffffffffffffffffffffff83160361386d57906116e49135614731565b60849060208551917f08c379a0000000000000000000000000000000000000000000000000000000008352820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201527f20726f6c657320666f722073656c6600000000000000000000000000000000006064820152fd5b50346107ca57807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca57613986913590600161392f61408d565b92808652602090868252613947838589200154614496565b80875286825273ffffffffffffffffffffffffffffffffffffffff84882095169485600052825260ff8460002054161561398a575b8652528320614a27565b5080f35b80875286825283872085600052825283600020837fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff008254161790553385827f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d8a80a461397c565b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425760209073ffffffffffffffffffffffffffffffffffffffff600654169051908152f35b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610942576020906010549051908152f35b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425760209073ffffffffffffffffffffffffffffffffffffffff600a54169051908152f35b5090346107ca5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca57816020936001923581528085522001549051908152f35b8382346109425760607ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425760ff8160209373ffffffffffffffffffffffffffffffffffffffff613b7061406a565b16815260038552818120602435825285526006828220016044358252855220541690519015158152f35b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610942576020905160328152f35b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425760209073ffffffffffffffffffffffffffffffffffffffff600854169051908152f35b5090346107ca5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca5790613c8360058261147295613c7c9535815260116020522001825193848092615b0a565b03836146a6565b51918291602083526020830190614020565b5090346107ca5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca57803591613cd16141e6565b828452601160205281818520019182549160ff8360281c1615613d555750507fffffffffffffffffffffffffffffffffffffffffffffffffff00ffffffffffff81613d2a60ff66010000000000009460301c1615614ef9565b161790557f0d44df2447ad08457aac2b0eb4cce9cd8220ae20431d62a8ea4dd69629fd2f0c8280a280f35b90602060649251917f08c379a0000000000000000000000000000000000000000000000000000000008352820152600b60248201527f47414d455f4143544956450000000000000000000000000000000000000000006044820152fd5b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425760209073ffffffffffffffffffffffffffffffffffffffff600c54169051908152f35b5090346107ca5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca578035835260116020908152928290209081015460281c60ff1615613e6e5780600260036109ba93015491015490614ae8565b51908152f35b6002613e7c91015442614ae8565b90613e68565b92905034612a135760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112612a1357613ebc6141e6565b73ffffffffffffffffffffffffffffffffffffffff600c5416803b15613f2b5760248492845195869384927f02e06cc80000000000000000000000000000000000000000000000000000000084528035908401525af19081156108e65750613f22575080f35b6116e4906145f3565b505050fd5b849084346107ca5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca57357fffffffff0000000000000000000000000000000000000000000000000000000081168091036107ca57602092507f5a05180f000000000000000000000000000000000000000000000000000000008114908115613fc3575b5015158152f35b7f7965db0b00000000000000000000000000000000000000000000000000000000811491508115613ff6575b5083613fbc565b7f01ffc9a70000000000000000000000000000000000000000000000000000000091501483613fef565b90815180825260208080930193019160005b828110614040575050505090565b835173ffffffffffffffffffffffffffffffffffffffff1685529381019392810192600101614032565b6004359073ffffffffffffffffffffffffffffffffffffffff8216820361072557565b6024359073ffffffffffffffffffffffffffffffffffffffff8216820361072557565b600311156140ba57565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b90815180825260208080930193019160005b828110614109575050505090565b8351855293810193928101926001016140fb565b60c07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc820112610725576004359160243573ffffffffffffffffffffffffffffffffffffffff81168103610725579160443591606435916084359160a43567ffffffffffffffff9283821161072557806023830112156107255781600401359384116107255760248483010111610725576024019190565b9181601f840112156107255782359167ffffffffffffffff8311610725576020808501948460051b01011161072557565b3360009081527fad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb5602090815260408083205490929060ff161561422857505050565b6142313361489a565b8351908261423e8361468a565b6042835284830193606036863783511561446957603085538351906001918210156144695790607860218601536041915b81831161439e57505050614342576142ca93859361430e936142ff60489461433e995198857f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008b9788015282519283916037890191016145d0565b8401917f206973206d697373696e6720726f6c65200000000000000000000000000000006037840152518093868401906145d0565b010360288101855201836146a6565b519182917f08c379a0000000000000000000000000000000000000000000000000000000008352600483016146e7565b0390fd5b6064848651907f08c379a000000000000000000000000000000000000000000000000000000000825280600483015260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152fd5b909192600f8116601081101561443c577f3031323334353637383961626364656600000000000000000000000000000000901a6143db858861485a565b5360041c92801561440f577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01919061426f565b6024827f4e487b710000000000000000000000000000000000000000000000000000000081526011600452fd5b6024837f4e487b710000000000000000000000000000000000000000000000000000000081526032600452fd5b807f4e487b7100000000000000000000000000000000000000000000000000000000602492526032600452fd5b6000818152602090808252604092838220338352835260ff8483205416156144be5750505050565b6144c73361489a565b8451916144d38361468a565b6042835284830193606036863783511561446957603085538351906001918210156144695790607860218601536041915b81831161455f57505050614342576142ca93859361430e936142ff60489461433e995198857f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008b9788015282519283916037890191016145d0565b909192600f8116601081101561443c577f3031323334353637383961626364656600000000000000000000000000000000901a61459c858861485a565b5360041c92801561440f577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff019190614504565b60005b8381106145e35750506000910152565b81810151838201526020016145d3565b67ffffffffffffffff811161460757604052565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60a0810190811067ffffffffffffffff82111761460757604052565b6060810190811067ffffffffffffffff82111761460757604052565b6040810190811067ffffffffffffffff82111761460757604052565b6080810190811067ffffffffffffffff82111761460757604052565b90601f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0910116810190811067ffffffffffffffff82111761460757604052565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f6040936020845261472a81518092816020880152602088880191016145d0565b0116010190565b90604061477c926000908082528160205273ffffffffffffffffffffffffffffffffffffffff83832094169384835260205260ff838320541661477f575b8152600160205220614af5565b50565b808252816020528282208483526020528282207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0081541690553384827ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b8580a461476f565b919082018092116147f157565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b67ffffffffffffffff811161460757601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b90815181101561486b570160200190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b604051906148a782614652565b602a825260208201604036823782511561486b5760309053815160019081101561486b57607860218401536029905b8082116149445750506148e65790565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602060248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152fd5b9091600f811660108110156149e1577f3031323334353637383961626364656600000000000000000000000000000000901a614980848661485a565b5360041c9180156149b3577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01906148d6565b602460007f4e487b710000000000000000000000000000000000000000000000000000000081526011600452fd5b602460007f4e487b710000000000000000000000000000000000000000000000000000000081526032600452fd5b805482101561486b5760005260206000200190600090565b91906001830160009082825280602052604082205415600014614ae25784549468010000000000000000861015614ab55783614aa5614a70886001604098999a01855584614a0f565b81939154907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9060031b92831b921b19161790565b9055549382526020522055600190565b6024837f4e487b710000000000000000000000000000000000000000000000000000000081526041600452fd5b50925050565b919082039182116147f157565b90600182019060009281845282602052604084205490811515600014614c47577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff91828101818111614c1a57825490848201918211614bed57808203614bb8575b50505080548015614b8b57820191614b6e8383614a0f565b909182549160031b1b191690555582526020526040812055600190565b6024867f4e487b710000000000000000000000000000000000000000000000000000000081526031600452fd5b614bd8614bc8614a709386614a0f565b90549060031b1c92839286614a0f565b90558652846020526040862055388080614b56565b6024887f4e487b710000000000000000000000000000000000000000000000000000000081526011600452fd5b6024877f4e487b710000000000000000000000000000000000000000000000000000000081526011600452fd5b5050505090565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146147f15760010190565b67ffffffffffffffff81116146075760051b60200190565b90614c9d82614c7b565b614caa60405191826146a6565b8281527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0614cd88294614c7b565b0190602036910137565b919081101561486b5760051b0190565b805182101561486b5760209160051b010190565b7f53776f7264426174746c650000000000000000000000000000000000000000006020604051614d358161466e565b600b815201527f31000000000000000000000000000000000000000000000000000000000000006020604051614d6a8161466e565b60018152015260405160208101907f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f82527f3f696bb35ca88e80cd8e6d0597864b656823873afba3fefff14622cda27ab5d060408201527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc660608201524660808201523060a082015260a0815260c0810181811067ffffffffffffffff8211176146075760405251902090565b90816020910312610725575180151581036107255790565b15614e3657565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600c60248201527f494e56414c49445f47414d4500000000000000000000000000000000000000006044820152fd5b15614e9b57565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f47414d455f454e444544000000000000000000000000000000000000000000006044820152fd5b15614f0057565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600c60248201527f47414d455f434c45414e454400000000000000000000000000000000000000006044820152fd5b15614f6557565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f414c52454144595f4a4f494e45440000000000000000000000000000000000006044820152fd5b15614fca57565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600960248201527f47414d455f46554c4c00000000000000000000000000000000000000000000006044820152fd5b1561502f57565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600b60248201527f4c4f575f42414c414e43450000000000000000000000000000000000000000006044820152fd5b1561509457565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601660248201527f494e53554646494349454e545f414c4c4f57414e4345000000000000000000006044820152fd5b8054680100000000000000008110156146075761511491600182018155614a0f565b819291549060031b9173ffffffffffffffffffffffffffffffffffffffff809116831b921b1916179055565b600280541461514f5760028055565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152fd5b906000806152849460405194602097888701957f23b872dd00000000000000000000000000000000000000000000000000000000875273ffffffffffffffffffffffffffffffffffffffff938480921660248a015216604488015260648701526064865261521a86614636565b1692604051946152298661466e565b8786527f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c656488870152519082855af13d15615339573d9161526883614820565b9261527660405194856146a6565b83523d60008785013e61533d565b805190828215928315615321575b5050501561529d5750565b608490604051907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f742073756363656564000000000000000000000000000000000000000000006064820152fd5b6153319350820181019101614e17565b388281615292565b6060915b919290156153b85750815115615351575090565b3b1561535a5790565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152fd5b8251909150156153cb5750805190602001fd5b61433e906040519182917f08c379a0000000000000000000000000000000000000000000000000000000008352600483016146e7565b939695909291946000978896868852602092601184526040966006888b2061543860ff600483015461174b828260281c1615614e94565b73ffffffffffffffffffffffffffffffffffffffff809316809c52018552878c209586548b8382160361586f5760a01c60ff166158125787156157b5578a8d5260128652888d205485036157585761548e614d06565b8951878101967f83aeca795846b427cef798c5053d6b58222df44008576b8d6159e88e329175ad88528c8c8301528d60608301528660808301528a60a083015260c082015260c0815260e081019067ffffffffffffffff9781831089841117615729579061016091838e52815190206101008201947f190100000000000000000000000000000000000000000000000000000000000086526101028301526101228201526042835201818110888211176156fb578b525190208d9061555283614820565b9161555f8c5193846146a6565b838352368487011161097c5788846155829561558a988387013784010152615a36565b9290926158cc565b80600f541691160361569e57988186927f0666c04fa5fbe0b05a88e385492b569fcd91f702c82580f2ff0a2013ec12d29598999a9b16956156148787907fffffff0000000000000000ffffffffffffffffffffffffffffffffffffffffff7cffffffffffffffff00000000000000000000000000000000000000000083549260a81b169116179055565b169360018101857fffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000825416179055740100000000000000000000000000000000000000007fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff82541617905588815260128352206156918154614c4e565b90558351928352820152a3565b6064838751907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152600b60248201527f494e56414c49445f5349470000000000000000000000000000000000000000006044820152fd5b5060248f7f4e487b710000000000000000000000000000000000000000000000000000000081526041600452fd5b505060248f7f4e487b710000000000000000000000000000000000000000000000000000000081526041600452fd5b6064868a51907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152600d60248201527f494e56414c49445f4e4f4e4345000000000000000000000000000000000000006044820152fd5b6064868a51907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152600a60248201527f5a45524f5f53434f5245000000000000000000000000000000000000000000006044820152fd5b6064868a51907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152600960248201527f5355424d495454454400000000000000000000000000000000000000000000006044820152fd5b6064878b51907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152600a60248201527f4e4f545f504c41594552000000000000000000000000000000000000000000006044820152fd5b60058110156140ba57806158dd5750565b600181036159435760646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152fd5b600281036159a95760646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152fd5b6003146159b257565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c60448201527f75650000000000000000000000000000000000000000000000000000000000006064820152fd5b906041815114600014615a6457615a60916020820151906060604084015193015160001a90615a6e565b9091565b5050600090600290565b9291907f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311615afe5791608094939160ff602094604051948552168484015260408301526060820152600093849182805260015afa15615af157815173ffffffffffffffffffffffffffffffffffffffff811615615aeb579190565b50600190565b50604051903d90823e3d90fd5b50505050600090600390565b90815480825260208092019260005281600020916000905b828210615b30575050505090565b835473ffffffffffffffffffffffffffffffffffffffff1685529384019360019384019390910190615b22565b60608101949392604092615b70816140b0565b82526020820152015256fea2646970667358221220ff39914fb7286ad15addfb59bc7812713e11e367d50b522d266656b15c72c46764736f6c63430008120033",
      "sourceMap": "888:27709:48:-:0;;;;;;;;;;;;;-1:-1:-1;;888:27709:48;;;;-1:-1:-1;;;;;888:27709:48;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;:::i;:::-;;;;;;:::i;:::-;;;;;;:::i;:::-;;;;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;;:::i;:::-;;;;:::i;:::-;;;1821:22:20;888:27709:48;;;;1356:176:40;;;1394:15;;888:27709:48;;1431:16:40;888:27709:48;;;;1469:10:40;888:27709:48;;;;;;1509:4:40;888:27709:48;;;;;;1356:176:40;;;888:27709:48;;;;;;;;;;;;;;;;;;;1329:217:40;;;1287:269;888:27709:48;-1:-1:-1;;;;;888:27709:48;;;;4909:30;4949:32;888:27709;;-1:-1:-1;;;;;;888:27709:48;;;;;;;;;;;;4991:37;888:27709;;;;;;;;;;;;;;5038:30;888:27709;;;;;;;;;;;;;;5078:52;888:27709;;;;;;;;;;;;;;5140:46;888:27709;;;;;;;;;;;;;;5196:49;888:27709;;;;;;;;;;;;;;5255:57;888:27709;;;;;;;;;;;;;;5322:57;888:27709;;;;;;;;;;;;;;-1:-1:-1;888:27709:48;;;;;;;;;;;;;;5456:22;888:27709;;;;;;;;;;;;;-1:-1:-1;5488:15:48;888:27709;;;;;;;;;;;;1469:10:40;888:27709:48;;;;;;;;8398:50:38;;888:27709:48;;;;7669:23:15;7665:149;;-1:-1:-1;888:27709:48;;;;1469:10:40;;888:27709:48;;8398:50:38;:::i;:::-;;888:27709:48;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;7665:149:15;888:27709:48;;;;;;;;;1469:10:40;888:27709:48;;;;;;;;;;;;;;;;1469:10:40;;7763:40:15;;;;;7665:149;;888:27709:48;;;;;;;;;;;;;-1:-1:-1;888:27709:48;;;;;-1:-1:-1;;;;;888:27709:48;;;;;;:::o;2214:404:38:-;;;4351:12;;;-1:-1:-1;888:27709:48;;;;;;;;;;;4351:24:38;2293:319;888:27709:48;;;;;;;;;;;;4351:12:38;888:27709:48;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;4351:12:38;2547:11;:::o;888:27709:48:-;-1:-1:-1;;;888:27709:48;;;;;;;;;-1:-1:-1;;;888:27709:48;;;;;;;;2293:319:38;-1:-1:-1;2589:12:38;-1:-1:-1;;2589:12:38:o",
      "linkReferences": {
        "src/libraries/FundManagementLib.sol": {
          "FundManagementLib": [
            { "start": 3029, "length": 20 },
            { "start": 7778, "length": 20 },
            { "start": 11476, "length": 20 },
            { "start": 11722, "length": 20 },
            { "start": 12507, "length": 20 },
            { "start": 14563, "length": 20 }
          ]
        }
      }
    },
    "deployedBytecode": {
      "object": "0x608060408181526004908136101561001657600080fd5b600092833560e01c90816301ffc9a714613f30575083816302e06cc814613e82575080630f42d19114613e055780630f4ef8a614613db25780631004ff6114613c9557806315a40f4914613c2757806317723e8714613bd4578063185f31b014613b9a57806319ead6fa14612cad5780631b94770714613b1c578063248a9ca314613ad457806325cb9e5114613a815780632e0be39a14613a445780632e15f1b7146139f15780632f2ff15d146138f057806336568abe1461380b578063371665b0146137b85780633ccd10e91461370d57806347e1d5501461366f5780634efd37491461361c5783816354ab62691461352f57508063599706d0146133f057806359c1303f1461339d57806361412fbc1461332e57806361c3ddfa14612eff5780636388607c14612eac57806365b3a7ca14612e4b5780636834e3a814612dea57838163686a978c14612d0f5750806368efccbb14612cad578063718072e514612c025780637cf4c4cd14612afa578381638391a66514612a175781638cce2d4714612921575080639010d07c146128b457806391d148541461284357806392bf9248146127025780639d8df9ee146125a2578063a217fddf14612569578063a3dac2de14612195578063a7ecd37e14612113578063b2040f2014612020578063b622c03414611f10578063b6d4d64b14611e7d578063b753204d14611ccb578063c31b29ce14611c90578063c60d199614611c37578063c7d7996e14611ba4578063ca15c87314611b5e578063cf05d9c014611a59578063d0399bb8146116e7578063d547741f1461168d578063da79a9c3146113b6578063e580f6ab14611192578063e87e5f9d14610fcd578063eeb7cfa314610f7a578063efaa55a014610b9d578063f440256d146109c1578063f698da251461097f578063f713f6a414610946578063f74d5480146108ef578063f9f6a812146107ce5763ffcd664b146102e157600080fd5b346107ca57807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca57813561031961408d565b91610322615140565b61032a6141e6565b811515806107be575b61033c90614e2f565b81855260209360118552818620818101549161035e60ff8460281c1615614e94565b61036e60ff8460301c1615614ef9565b87600683019773ffffffffffffffffffffffffffffffffffffffff80891693846000528a83526103a48289600020541615614f5e565b60058601906103b66032835410614fc3565b8360ff846006541699821c166103cb816140b0565b6103d4816140b0565b60248b51809b81937f0d4158c2000000000000000000000000000000000000000000000000000000008352610408816140b0565b868301525afa9788156107b4578598610781575b507f0000000000000000000000000000000000000000000000000000000000000000908382168a517f70a0823100000000000000000000000000000000000000000000000000000000815288838201528681602481855afa908115610777578e918c918a9161073b575b509161049a8994926104f096941015615028565b8d517fdd62ed3e00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff9091169281019283523060208401529384928391829160400190565b03915afa9081156107315786916106e2575b506106aa96936106067f87969bc7faf902221a147b95ceba76e011c5efb0339a0a8ee7a2bb82d9cfbbd69e61055c8f60019a976106d79f9e9d9a978e6105579161054f8f9a83111561508d565b8430916151ad565b6150f2565b8b519261056884614636565b878452858401918783528d8501968888526060860199898b5260808701998a52600052528c6000209351167fffffffffffffffffffffffff000000000000000000000000000000000000000084541617835551151582907fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff74ff0000000000000000000000000000000000000000835492151560a01b169116179055565b915182547fffffff0000000000000000ffffffffffffffffffffffffffffffffffffffffff1660a89190911b7cffffffffffffffff0000000000000000000000000000000000000000001617825567ffffffffffffffff91019251167fffffffffffffffffffffffffffffffff000000000000000000000000000000006fffffffffffffffff0000000000000000845493518a1b16921617179055019182546147e4565b90555191825273ffffffffffffffffffffffffffffffffffffffff90921660208201529081906040820190565b0390a1600160025580f35b80939d965085809398959b9a999692503d831161072a575b61070481836146a6565b81010312610725579051939a96979596929591948c949193916106d7610502565b600080fd5b503d6106fa565b8a513d88823e3d90fd5b939499505050508581813d8311610770575b61075781836146a6565b8101031261072557518e9691908d908b9061049a610486565b503d61074d565b8c513d8a823e3d90fd5b84809299508196503d83116107ad575b61079b81836146a6565b81010312610725578b9351963861041c565b503d610791565b89513d87823e3d90fd5b50601054821115610333565b8280fd5b50346107ca57827ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca578051917fe33e75c200000000000000000000000000000000000000000000000000000000835273ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000169083015260608260248173__$bcf66ed587f714e3ffb8bafad5409d838b$__5af49081156108e6578392849085936108a1575b506060945081519384526020840152820152f35b93505090506060823d82116108de575b816108be606093836146a6565b810103126107ca576060925081519080602084015193015191923861088d565b3d91506108b1565b513d84823e3d90fd5b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425760209073ffffffffffffffffffffffffffffffffffffffff600f54169051908152f35b5080fd5b833461097c576109746109583661411d565b95610967959195949294615140565b61096f6141e6565b615401565b600160025580f35b80fd5b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610942576020906109ba614d06565b9051908152f35b833461097c5760c07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261097c576109f961406a565b610a0161408d565b60443573ffffffffffffffffffffffffffffffffffffffff90818116809103610725576064359180831680930361072557608435938185168095036107255760a43595828716809703610725578290610a586141e6565b1680610b6e575b501680610b3f575b5080610b10575b5080610ae1575b5080610ab2575b5080610a86575080f35b7fffffffffffffffffffffffff0000000000000000000000000000000000000000600d541617600d5580f35b7fffffffffffffffffffffffff0000000000000000000000000000000000000000600c541617600c5582610a7c565b7fffffffffffffffffffffffff0000000000000000000000000000000000000000600b541617600b5583610a75565b7fffffffffffffffffffffffff0000000000000000000000000000000000000000600a541617600a5584610a6e565b7fffffffffffffffffffffffff0000000000000000000000000000000000000000600954161760095585610a67565b7fffffffffffffffffffffffff0000000000000000000000000000000000000000600854161760085587610a5f565b50346107ca57602091827ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610f7657803592610bda615140565b83151580610f6a575b610bec90614e2f565b8385526011815282852090858383015493610c0d60ff8660281c1615614e94565b610c1d60ff8660301c1615614ef9565b60068401903360005281845273ffffffffffffffffffffffffffffffffffffffff90610c4f8289600020541615614f5e565b6005860190610c616032835410614fc3565b8560ff846006541699821c16610c76816140b0565b610c7f816140b0565b60248b51809b81937f0d4158c2000000000000000000000000000000000000000000000000000000008352610cb3816140b0565b868301525afa9788156107b4578598610f37575b507f0000000000000000000000000000000000000000000000000000000000000000908382168a517f70a0823100000000000000000000000000000000000000000000000000000000815233838201528881602481855afa90811561077757899392918c918a91610efd575b50610d8594939291610d46911015615028565b8c517fdd62ed3e000000000000000000000000000000000000000000000000000000008152339281019283523060208401529384928391829160400190565b03915afa908115610731578691610eb3575b509360016106d79a9894610def8b9995610de87f87969bc7faf902221a147b95ceba76e011c5efb0339a0a8ee7a2bb82d9cfbbd69f9d610e9d9b97610ddf82889d101561508d565b309033906151ad565b33906150f2565b6106068a5191610dfe83614636565b338352868301908682528c8401958787526060850198888a526080860198895233600052528c6000209351167fffffffffffffffffffffffff000000000000000000000000000000000000000084541617835551151582907fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff74ff0000000000000000000000000000000000000000835492151560a01b169116179055565b9055519081523360208201529081906040820190565b878094939b9995975081969c9a9892503d8311610ef6575b610ed581836146a6565b81010312610725579251969895979496919590948a94919391926001610d97565b503d610ecb565b93995050509181813d8311610f30575b610f1781836146a6565b8101031261072557518c96889290918b90610d85610d33565b503d610f0d565b86809299508196503d8311610f63575b610f5181836146a6565b81010312610725578993519638610cc7565b503d610f47565b50601054841115610be3565b8380fd5b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425760209073ffffffffffffffffffffffffffffffffffffffff600b54169051908152f35b509190346109425760607ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425780359261100a61408d565b93604435906110176141e6565b808552601160205260ff84848720015460281c166111355773ffffffffffffffffffffffffffffffffffffffff80961693848652600360205283862083875260205260ff6002858820015416156110d8578596600c541690813b156110d457866064928195875198899687957fe87e5f9d000000000000000000000000000000000000000000000000000000008752860152602485015260448401525af19081156108e657506110c45750f35b6110cd906145f3565b61097c5780f35b8680fd5b60649060208551917f08c379a0000000000000000000000000000000000000000000000000000000008352820152601b60248201527f52616e646f6d6e657373206e6f742072657665616c65642079657400000000006044820152fd5b60648460208551917f08c379a0000000000000000000000000000000000000000000000000000000008352820152601260248201527f47616d6520616c726561647920656e64656400000000000000000000000000006044820152fd5b5082903461094257602090817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca5783356003811015610f76576111d96141e6565b73ffffffffffffffffffffffffffffffffffffffff600654166111fb826140b0565b8360ff8316611209816140b0565b60248551809481937f8b0d9f5c00000000000000000000000000000000000000000000000000000000835261123d816140b0565b8b8301525afa9081156113ac57859161137f575b50156113235791846060927f94d432d34c6bf23aeab9b063a19d03c71d674549cc2ffc9d82c1dd37ee16535794611289601054614c4e565b92836010558388526011855282882093845583016112a6826140b0565b8054936002429101557fffffffffffffffffffffffffffffffffffffffffffffffffff00ffffffffffff6104b080957fffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000064ff00000000868a1b1691161717169055601054938251948552611319826140b0565b840152820152a180f35b606485848451917f08c379a0000000000000000000000000000000000000000000000000000000008352820152600e60248201527f4c4556454c5f494e4143544956450000000000000000000000000000000000006044820152fd5b61139f9150843d86116113a5575b61139781836146a6565b810190614e17565b86611251565b503d61138d565b83513d87823e3d90fd5b50346107ca57807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca5767ffffffffffffffff9282358481116109425761140590369085016141b5565b90936024958635908111610f765761142090369083016141b5565b80849792970361163157600a84116115d55761143e84959295614c93565b96826001948543019586431197600b4301809811965b818110611476576114728d8d519182916020835260208301906140e9565b0390f35b3385528960208581528d872054916115aa57896115aa57818f8f928f906115978f93978e8e82998f8f8f9d8f6115a59f9388938f92958e8d7f2c1c32a0b6860c2d724927516c372f04d3803b0c92051eb45a033c3c83177d469f886115919a6114de92614ce2565b359033865260039384928383528888208d89528352888820553387528282528787208c88528252439088882001553386528181528686208b875281526002878720017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff008154169055338652528d858520908a865252828585200155611564868b8b614ce2565b35903384528d528383208884528d52600584842001553382528b522061158a8154614c4e565b9055614cf2565b52614ce2565b3594519283523392a4614c4e565b611454565b8f876011887f4e487b7100000000000000000000000000000000000000000000000000000000835252fd5b60648360188a60208a51937f08c379a00000000000000000000000000000000000000000000000000000000085528401528201527f546f6f206d616e7920636f6d6d697473206174206f6e636500000000000000006044820152fd5b60648360158a60208a51937f08c379a00000000000000000000000000000000000000000000000000000000085528401528201527f4172726179206c656e677468206d69736d6174636800000000000000000000006044820152fd5b50346107ca57807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca576116e491356116df60016116ce61408d565b938387528660205286200154614496565b614731565b80f35b508290346109425760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc918183360112610f76578435926117276141e6565b838552601183528582862001549061175560ff8361174b82809660281c1615614e94565b60301c1615614ef9565b600091858352601185528383209188830191650100000000007fffffffffffffffffffffffffffffffffffffffffffffffffffff00ffffffffff845416178093556003924284860155600585019081546117ae81614c7b565b956117bb8a5197886146a6565b8187527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe06117e883614c7b565b018b8a5b828110611a27575090508a8a8b60068c01935b868310611987575050505050505073ffffffffffffffffffffffffffffffffffffffff9260018460075416970154918a1c169061183b826140b0565b611844826140b0565b863b156119835792879694918b9d96948a519e8f987f9ae3c518000000000000000000000000000000000000000000000000000000008a52890152602488015261188d816140b0565b60448701526118a860a09384606489015260a4880190615b0a565b9186830301608487015289808551938481520194019287915b8b84841061192c575050505050508383809203925af1958615611920577f716f3063a3b0e65531660dc2d5d241dfcf3b2983d26d7a70df643ad232d51783949596611911575b509051908152a280f35b61191a906145f3565b86611907565b509051903d90823e3d90fd5b85518051831688528181015167ffffffffffffffff908116838a01528d82015181168e8a01526060808301511515908a015260809182015116908801528a99508f98509582019590940193600192909201916118c1565b8780fd5b83611a1e94611996858c614a0f565b949073ffffffffffffffffffffffffffffffffffffffff95869154908b1b1c16815287845220908b60018354930154928251956119d287614636565b8116865267ffffffffffffffff94858260a81c16908701528484168387015260a01c16151560608501521c166080820152611a0d828c614cf2565b52611a18818b614cf2565b50614c4e565b8b908b8e6117ff565b8c518c8e611a3483614636565b81835281858401528201528c60608201528c608082015282828c010152018c906117ec565b5082903461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610942578051927f3d6086d200000000000000000000000000000000000000000000000000000000845273ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000169084015260208360248173__$bcf66ed587f714e3ffb8bafad5409d838b$__5af4918215611b535791611b1f575b6020925051908152f35b90506020823d8211611b4b575b81611b39602093836146a6565b81010312610725576020915190611b15565b3d9150611b2c565b9051903d90823e3d90fd5b5090346107ca5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca5760209282913581526001845220549051908152f35b5090346107ca57817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca578160809373ffffffffffffffffffffffffffffffffffffffff611bf561406a565b1681526003602052818120602435825260205220600181015492600560ff60028401541693830154920154928151948552151560208501528301526060820152f35b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261094257602090517f83aeca795846b427cef798c5053d6b58222df44008576b8d6159e88e329175ad8152f35b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261094257602090516104b08152f35b50346107ca57807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca57611d0261406a565b9060243567ffffffffffffffff8111611e7957611d2590939293369084016141b5565b91909273ffffffffffffffffffffffffffffffffffffffff869516945b838110611db9575050805191602083528060208401527f07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8111611db5577f78d0c440b837302f1d84bd6b81e603f079ef72d8bad8c935d13002d4d2e7cd1993839160051b8091848401378101030190a280f35b8580fd5b611e0a9086885260038789836020938085528a611dda838c8c872093614ce2565b35845285528989808520948d6001968781015415159081611e54575b50611e0f575b505050505050505050614c4e565b611d42565b600098611e2a8a97889660059b865288845286862094614ce2565b3583525220938185558401558c600284015582015582868201550155388781838189898e8d611dfc565b8d810154431191508115611e6a575b5038611df6565b60ff9150600201541638611e63565b8480fd5b50346107ca5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca57806020938335815260118552209182015460ff8160281c16159283611f00575b83611edd575b5050519015158152f35b611ef5929350600263ffffffff9101549116906147e4565b421015903880611ed3565b925060ff8160301c161592611ecd565b5090346107ca57602090817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610f7657803567ffffffffffffffff8111611e7957611f6190369083016141b5565b611f6c9491946141e6565b855b818110611f79578680f35b80611f88611fb4928489614ce2565b358089526011875285858a2001805460ff808260281c169081612012575b50611fb9575b505050614c4e565b611f6e565b7fffffffffffffffffffffffffffffffffffffffffffffffffff00ffffffffffff1666010000000000001790557f0d44df2447ad08457aac2b0eb4cce9cd8220ae20431d62a8ea4dd69629fd2f0c8980a2388080611fac565b90508160301c161538611fa6565b5082903461094257807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425773ffffffffffffffffffffffffffffffffffffffff61206e61406a565b1682526003602052808220602435835260205280822060018101548015159384612103575b846120bc575b505092602093836120ae575050519015158152f35b015443111591508380611ed3565b90919350600182018092116120d75750431191602085612099565b806011867f4e487b71000000000000000000000000000000000000000000000000000000006024945252fd5b600283015460ff16159450612093565b833461097c5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261097c5773ffffffffffffffffffffffffffffffffffffffff61216061406a565b6121686141e6565b167fffffffffffffffffffffffff0000000000000000000000000000000000000000600f541617600f5580f35b508290346109425760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc8181360112610f76578435928385526011835280852061220f8782015463ffffffff600260ff946121f6868560281c1615614e94565b612205868560301c1615614ef9565b01549116906147e4565b421061250d578460005260118452816000209287840190650100000000007fffffffffffffffffffffffffffffffffffffffffffffffffffff00ffffffffff83541617809255600391428387015560058601805461226c81614c7b565b94612279885196876146a6565b8186527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe06122a683614c7b565b018a60005b8281106124d6575050506006890160005b83811061243b575050505073ffffffffffffffffffffffffffffffffffffffff91826007541695600180990154918a1c16906122f7826140b0565b612300826140b0565b863b156107255787517f9ae3c5180000000000000000000000000000000000000000000000000000000081529c8d018b905260248d01528b9493919290612346816140b0565b604486015261236160a09384606488015260a4870190615b0a565b918583030160848601528880855193848152019401926000915b898b8585106123e957505050505050509181600081819503925af19586156123de577f716f3063a3b0e65531660dc2d5d241dfcf3b2983d26d7a70df643ad232d517839495966123cf575b5051908152a280f35b6123d8906145f3565b866123c6565b50513d6000823e3d90fd5b86518051841689528082015167ffffffffffffffff9081168a8401528c82015181168d8b01526060808301511515908b015260809182015116908901528f98509683019695909501949092019161237b565b808c8361244b6124d19489614a0f565b929073ffffffffffffffffffffffffffffffffffffffff9384915490891b1c16600052528d8c8c81600020600181549101549280519561248a87614636565b8216865267ffffffffffffffff94858360a81c16908701528484169086015260a01c16151560608401528d1c1660808201526124c6828b614cf2565b52611a18818a614cf2565b6122bc565b8a516124e181614636565b6000815260008382015260008c820152600060608201526000608082015282828b010152018b906122ab565b606487858451917f08c379a0000000000000000000000000000000000000000000000000000000008352820152600b60248201527f4e4f545f455850495245440000000000000000000000000000000000000000006044820152fd5b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425751908152602090f35b5082903461094257807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261094257602435338352602093808552828420549360014301918243116126d657600b43018093116126d657859291859133825260038952828220858352895280358383205533825260038952828220858352895243600184842001553382526003895282822085835289526002838320017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0081541690553382526003895282822085835289528381848420015533825260038952828220858352895285600584842001553382528852206126a48154614c4e565b905583519081527f2c1c32a0b6860c2d724927516c372f04d3803b0c92051eb45a033c3c83177d46863392a451908152f35b9060116024927f4e487b7100000000000000000000000000000000000000000000000000000000835252fd5b50346107ca5760807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca5781356003811015610f7657602435918460443594606435908115158092036107ca5761275c6141e6565b73ffffffffffffffffffffffffffffffffffffffff6006541661277e866140b0565b60ff86169061278c826140b0565b803b15611e7957849283608492885196879586947f92bf92480000000000000000000000000000000000000000000000000000000086526127cc826140b0565b8501528b60248501528c604485015260648401525af1801561283957612825575b50507f661124c8826d75343ee919baad251f50d4348b31f86cd88dabc18a6d96e351bd9361281f915193849384615b5d565b0390a180f35b61282e906145f3565b611e795784386127ed565b83513d84823e3d90fd5b5090346107ca57817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca5773ffffffffffffffffffffffffffffffffffffffff8260209461289461408d565b93358152808652209116600052825260ff81600020541690519015158152f35b5090346107ca57817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca5761291260209373ffffffffffffffffffffffffffffffffffffffff9235815260018552836024359120614a0f565b92905490519260031b1c168152f35b80848434612a1357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112612a135761295a61408d565b916129636141e6565b73__$bcf66ed587f714e3ffb8bafad5409d838b$__92833b15611e795782517ff955b50100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000008116828501908152933560208501529091166040830152928491849190829081906060015b03915af49081156108e657506110c45750f35b5050fd5b80848434612a1357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112612a1357612a5061408d565b91612a596141e6565b73__$bcf66ed587f714e3ffb8bafad5409d838b$__92833b15611e795782517f686f5a0c00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000811682850190815293356020850152909116604083015292849184919082908190606001612a00565b50346107ca5760607ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca5781356003811015610f7657602435918460443594612b466141e6565b73ffffffffffffffffffffffffffffffffffffffff6007541690612b69856140b0565b60ff8516612b76816140b0565b823b15610f76576064849283875195869485937f7cf4c4cd000000000000000000000000000000000000000000000000000000008552612bb5826140b0565b8401528a60248401528b60448401525af18015612839576128255750507f661124c8826d75343ee919baad251f50d4348b31f86cd88dabc18a6d96e351bd9361281f915193849384615b5d565b5091903461094257612c133661411d565b96612c25969196959295949394615140565b73ffffffffffffffffffffffffffffffffffffffff600f54163303612c505750610974979850615401565b60649060208b51917f08c379a0000000000000000000000000000000000000000000000000000000008352820152600a60248201527f4e4f545f5349474e4552000000000000000000000000000000000000000000006044820152fd5b8382346109425760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610942578060209273ffffffffffffffffffffffffffffffffffffffff612cff61406a565b1681526012845220549051908152f35b80848434612a1357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112612a1357612d4861408d565b612d506141e6565b60085473ffffffffffffffffffffffffffffffffffffffff169073__$bcf66ed587f714e3ffb8bafad5409d838b$__803b15611db55783517fad7cc5a300000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff93841686820190815295356020870152919092166040850152928491849182908190606001612a00565b5090346107ca5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca57602092829173ffffffffffffffffffffffffffffffffffffffff612e3d61406a565b168252845220549051908152f35b5090346107ca5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca578063ffffffff83602095612ea294358152601187522091600283015492015416906147e4565b4210159051908152f35b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425760209073ffffffffffffffffffffffffffffffffffffffff600754169051908152f35b508290346109425760807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425782359260249384359160449586359160649485359533895260209860038a528881208782528a52888120600181015480156132d35760ff600283015416613278576001810180911161324d574311156131f357840154431161319a57889033815260038b528181208882528b5220998760058c0154036131425788518a810190848252878b8201528a8152612fc581614652565b5190208b54036130ea575050600189015492600554938851958a8701938452898701524460608701528040608087015260a08601523360601b60c08601528660d48601528360f486015260f4855261012085019285841067ffffffffffffffff8511176130be5750509181600393610160999a93895285519020809986610140839801948552015287815261305981614652565b5190206005556002810160017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00825416179055015582518481527f5ed67831b1d8ad7d0b81cce82eff245333944fa87fe281fa31c2417f52b38733863392a451908152f35b6041907f4e487b7100000000000000000000000000000000000000000000000000000000600052526000fd5b7f496e76616c69642072657665616c0000000000000000000000000000000000008491600e878d8d51957f08c379a0000000000000000000000000000000000000000000000000000000008752860152840152820152fd5b7f507572706f7365206d69736d617463680000000000000000000000000000000084916010878d8d51957f08c379a0000000000000000000000000000000000000000000000000000000008752860152840152820152fd5b50827f52657665616c20646561646c696e6520706173736564000000000000000000008b6016878d8d51957f08c379a0000000000000000000000000000000000000000000000000000000008752860152840152820152fd5b5050827f546f6f206561726c7920746f2072657665616c000000000000000000000000008b6013878d8d51957f08c379a0000000000000000000000000000000000000000000000000000000008752860152840152820152fd5b86836011887f4e487b7100000000000000000000000000000000000000000000000000000000835252fd5b505050827f416c72656164792072657665616c6564000000000000000000000000000000008b6010878d8d51957f08c379a0000000000000000000000000000000000000000000000000000000008752860152840152820152fd5b505050827f4e6f20636f6d6d697420666f756e6400000000000000000000000000000000008b600f878d8d51957f08c379a0000000000000000000000000000000000000000000000000000000008752860152840152820152fd5b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610942576020905173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168152f35b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425760209073ffffffffffffffffffffffffffffffffffffffff600d54169051908152f35b5090346107ca57602090817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610f76573583526011815281832092600584019384549061343f82614c7b565b9561344c865197886146a6565b8287527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe061347984614c7b565b013686890137600661348a84614c93565b949201915b8381106134ba5786518781528061147288886134ad848d018e614020565b91848303908501526140e9565b806134c861352a9284614a0f565b73ffffffffffffffffffffffffffffffffffffffff809254600392831b1c166134f1848d614cf2565b526134fc8386614a0f565b9054911b1c1660005283875267ffffffffffffffff6001896000200154166135248288614cf2565b52614c4e565b61348f565b80848434612a135760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112612a135761356961406a565b916135726141e6565b73__$bcf66ed587f714e3ffb8bafad5409d838b$__9073ffffffffffffffffffffffffffffffffffffffff806008541691833b156110d4578693606492865197889586947ff71c165e000000000000000000000000000000000000000000000000000000008652837f0000000000000000000000000000000000000000000000000000000000000000169086015260248501521660448301525af49081156108e657506110c45750f35b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425760209073ffffffffffffffffffffffffffffffffffffffff600e54169051908152f35b5090346107ca5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca5760ff8260e0948335815260116020522092600184015493600281015493600382015490820154926005858560201c1693015495815197885260208801528601526136e9816140b0565b6060850152818160281c161515608085015260301c16151560a083015260c0820152f35b50346107ca57807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca5760068160a09461374a61408d565b943581526011602052200173ffffffffffffffffffffffffffffffffffffffff809316600052602052806000209060018254920154908051938316845260ff67ffffffffffffffff93848160a81c16602087015284841683870152861c16151560608501521c166080820152f35b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425760209073ffffffffffffffffffffffffffffffffffffffff600954169051908152f35b5091903461094257827ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425761384461408d565b903373ffffffffffffffffffffffffffffffffffffffff83160361386d57906116e49135614731565b60849060208551917f08c379a0000000000000000000000000000000000000000000000000000000008352820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201527f20726f6c657320666f722073656c6600000000000000000000000000000000006064820152fd5b50346107ca57807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca57613986913590600161392f61408d565b92808652602090868252613947838589200154614496565b80875286825273ffffffffffffffffffffffffffffffffffffffff84882095169485600052825260ff8460002054161561398a575b8652528320614a27565b5080f35b80875286825283872085600052825283600020837fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff008254161790553385827f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d8a80a461397c565b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425760209073ffffffffffffffffffffffffffffffffffffffff600654169051908152f35b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610942576020906010549051908152f35b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425760209073ffffffffffffffffffffffffffffffffffffffff600a54169051908152f35b5090346107ca5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca57816020936001923581528085522001549051908152f35b8382346109425760607ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425760ff8160209373ffffffffffffffffffffffffffffffffffffffff613b7061406a565b16815260038552818120602435825285526006828220016044358252855220541690519015158152f35b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610942576020905160328152f35b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425760209073ffffffffffffffffffffffffffffffffffffffff600854169051908152f35b5090346107ca5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca5790613c8360058261147295613c7c9535815260116020522001825193848092615b0a565b03836146a6565b51918291602083526020830190614020565b5090346107ca5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca57803591613cd16141e6565b828452601160205281818520019182549160ff8360281c1615613d555750507fffffffffffffffffffffffffffffffffffffffffffffffffff00ffffffffffff81613d2a60ff66010000000000009460301c1615614ef9565b161790557f0d44df2447ad08457aac2b0eb4cce9cd8220ae20431d62a8ea4dd69629fd2f0c8280a280f35b90602060649251917f08c379a0000000000000000000000000000000000000000000000000000000008352820152600b60248201527f47414d455f4143544956450000000000000000000000000000000000000000006044820152fd5b83823461094257817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126109425760209073ffffffffffffffffffffffffffffffffffffffff600c54169051908152f35b5090346107ca5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca578035835260116020908152928290209081015460281c60ff1615613e6e5780600260036109ba93015491015490614ae8565b51908152f35b6002613e7c91015442614ae8565b90613e68565b92905034612a135760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112612a1357613ebc6141e6565b73ffffffffffffffffffffffffffffffffffffffff600c5416803b15613f2b5760248492845195869384927f02e06cc80000000000000000000000000000000000000000000000000000000084528035908401525af19081156108e65750613f22575080f35b6116e4906145f3565b505050fd5b849084346107ca5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126107ca57357fffffffff0000000000000000000000000000000000000000000000000000000081168091036107ca57602092507f5a05180f000000000000000000000000000000000000000000000000000000008114908115613fc3575b5015158152f35b7f7965db0b00000000000000000000000000000000000000000000000000000000811491508115613ff6575b5083613fbc565b7f01ffc9a70000000000000000000000000000000000000000000000000000000091501483613fef565b90815180825260208080930193019160005b828110614040575050505090565b835173ffffffffffffffffffffffffffffffffffffffff1685529381019392810192600101614032565b6004359073ffffffffffffffffffffffffffffffffffffffff8216820361072557565b6024359073ffffffffffffffffffffffffffffffffffffffff8216820361072557565b600311156140ba57565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b90815180825260208080930193019160005b828110614109575050505090565b8351855293810193928101926001016140fb565b60c07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc820112610725576004359160243573ffffffffffffffffffffffffffffffffffffffff81168103610725579160443591606435916084359160a43567ffffffffffffffff9283821161072557806023830112156107255781600401359384116107255760248483010111610725576024019190565b9181601f840112156107255782359167ffffffffffffffff8311610725576020808501948460051b01011161072557565b3360009081527fad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb5602090815260408083205490929060ff161561422857505050565b6142313361489a565b8351908261423e8361468a565b6042835284830193606036863783511561446957603085538351906001918210156144695790607860218601536041915b81831161439e57505050614342576142ca93859361430e936142ff60489461433e995198857f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008b9788015282519283916037890191016145d0565b8401917f206973206d697373696e6720726f6c65200000000000000000000000000000006037840152518093868401906145d0565b010360288101855201836146a6565b519182917f08c379a0000000000000000000000000000000000000000000000000000000008352600483016146e7565b0390fd5b6064848651907f08c379a000000000000000000000000000000000000000000000000000000000825280600483015260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152fd5b909192600f8116601081101561443c577f3031323334353637383961626364656600000000000000000000000000000000901a6143db858861485a565b5360041c92801561440f577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01919061426f565b6024827f4e487b710000000000000000000000000000000000000000000000000000000081526011600452fd5b6024837f4e487b710000000000000000000000000000000000000000000000000000000081526032600452fd5b807f4e487b7100000000000000000000000000000000000000000000000000000000602492526032600452fd5b6000818152602090808252604092838220338352835260ff8483205416156144be5750505050565b6144c73361489a565b8451916144d38361468a565b6042835284830193606036863783511561446957603085538351906001918210156144695790607860218601536041915b81831161455f57505050614342576142ca93859361430e936142ff60489461433e995198857f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008b9788015282519283916037890191016145d0565b909192600f8116601081101561443c577f3031323334353637383961626364656600000000000000000000000000000000901a61459c858861485a565b5360041c92801561440f577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff019190614504565b60005b8381106145e35750506000910152565b81810151838201526020016145d3565b67ffffffffffffffff811161460757604052565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60a0810190811067ffffffffffffffff82111761460757604052565b6060810190811067ffffffffffffffff82111761460757604052565b6040810190811067ffffffffffffffff82111761460757604052565b6080810190811067ffffffffffffffff82111761460757604052565b90601f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0910116810190811067ffffffffffffffff82111761460757604052565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f6040936020845261472a81518092816020880152602088880191016145d0565b0116010190565b90604061477c926000908082528160205273ffffffffffffffffffffffffffffffffffffffff83832094169384835260205260ff838320541661477f575b8152600160205220614af5565b50565b808252816020528282208483526020528282207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0081541690553384827ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b8580a461476f565b919082018092116147f157565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b67ffffffffffffffff811161460757601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b90815181101561486b570160200190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b604051906148a782614652565b602a825260208201604036823782511561486b5760309053815160019081101561486b57607860218401536029905b8082116149445750506148e65790565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602060248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152fd5b9091600f811660108110156149e1577f3031323334353637383961626364656600000000000000000000000000000000901a614980848661485a565b5360041c9180156149b3577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01906148d6565b602460007f4e487b710000000000000000000000000000000000000000000000000000000081526011600452fd5b602460007f4e487b710000000000000000000000000000000000000000000000000000000081526032600452fd5b805482101561486b5760005260206000200190600090565b91906001830160009082825280602052604082205415600014614ae25784549468010000000000000000861015614ab55783614aa5614a70886001604098999a01855584614a0f565b81939154907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9060031b92831b921b19161790565b9055549382526020522055600190565b6024837f4e487b710000000000000000000000000000000000000000000000000000000081526041600452fd5b50925050565b919082039182116147f157565b90600182019060009281845282602052604084205490811515600014614c47577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff91828101818111614c1a57825490848201918211614bed57808203614bb8575b50505080548015614b8b57820191614b6e8383614a0f565b909182549160031b1b191690555582526020526040812055600190565b6024867f4e487b710000000000000000000000000000000000000000000000000000000081526031600452fd5b614bd8614bc8614a709386614a0f565b90549060031b1c92839286614a0f565b90558652846020526040862055388080614b56565b6024887f4e487b710000000000000000000000000000000000000000000000000000000081526011600452fd5b6024877f4e487b710000000000000000000000000000000000000000000000000000000081526011600452fd5b5050505090565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146147f15760010190565b67ffffffffffffffff81116146075760051b60200190565b90614c9d82614c7b565b614caa60405191826146a6565b8281527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0614cd88294614c7b565b0190602036910137565b919081101561486b5760051b0190565b805182101561486b5760209160051b010190565b7f53776f7264426174746c650000000000000000000000000000000000000000006020604051614d358161466e565b600b815201527f31000000000000000000000000000000000000000000000000000000000000006020604051614d6a8161466e565b60018152015260405160208101907f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f82527f3f696bb35ca88e80cd8e6d0597864b656823873afba3fefff14622cda27ab5d060408201527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc660608201524660808201523060a082015260a0815260c0810181811067ffffffffffffffff8211176146075760405251902090565b90816020910312610725575180151581036107255790565b15614e3657565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600c60248201527f494e56414c49445f47414d4500000000000000000000000000000000000000006044820152fd5b15614e9b57565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f47414d455f454e444544000000000000000000000000000000000000000000006044820152fd5b15614f0057565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600c60248201527f47414d455f434c45414e454400000000000000000000000000000000000000006044820152fd5b15614f6557565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f414c52454144595f4a4f494e45440000000000000000000000000000000000006044820152fd5b15614fca57565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600960248201527f47414d455f46554c4c00000000000000000000000000000000000000000000006044820152fd5b1561502f57565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600b60248201527f4c4f575f42414c414e43450000000000000000000000000000000000000000006044820152fd5b1561509457565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601660248201527f494e53554646494349454e545f414c4c4f57414e4345000000000000000000006044820152fd5b8054680100000000000000008110156146075761511491600182018155614a0f565b819291549060031b9173ffffffffffffffffffffffffffffffffffffffff809116831b921b1916179055565b600280541461514f5760028055565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152fd5b906000806152849460405194602097888701957f23b872dd00000000000000000000000000000000000000000000000000000000875273ffffffffffffffffffffffffffffffffffffffff938480921660248a015216604488015260648701526064865261521a86614636565b1692604051946152298661466e565b8786527f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c656488870152519082855af13d15615339573d9161526883614820565b9261527660405194856146a6565b83523d60008785013e61533d565b805190828215928315615321575b5050501561529d5750565b608490604051907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f742073756363656564000000000000000000000000000000000000000000006064820152fd5b6153319350820181019101614e17565b388281615292565b6060915b919290156153b85750815115615351575090565b3b1561535a5790565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152fd5b8251909150156153cb5750805190602001fd5b61433e906040519182917f08c379a0000000000000000000000000000000000000000000000000000000008352600483016146e7565b939695909291946000978896868852602092601184526040966006888b2061543860ff600483015461174b828260281c1615614e94565b73ffffffffffffffffffffffffffffffffffffffff809316809c52018552878c209586548b8382160361586f5760a01c60ff166158125787156157b5578a8d5260128652888d205485036157585761548e614d06565b8951878101967f83aeca795846b427cef798c5053d6b58222df44008576b8d6159e88e329175ad88528c8c8301528d60608301528660808301528a60a083015260c082015260c0815260e081019067ffffffffffffffff9781831089841117615729579061016091838e52815190206101008201947f190100000000000000000000000000000000000000000000000000000000000086526101028301526101228201526042835201818110888211176156fb578b525190208d9061555283614820565b9161555f8c5193846146a6565b838352368487011161097c5788846155829561558a988387013784010152615a36565b9290926158cc565b80600f541691160361569e57988186927f0666c04fa5fbe0b05a88e385492b569fcd91f702c82580f2ff0a2013ec12d29598999a9b16956156148787907fffffff0000000000000000ffffffffffffffffffffffffffffffffffffffffff7cffffffffffffffff00000000000000000000000000000000000000000083549260a81b169116179055565b169360018101857fffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000825416179055740100000000000000000000000000000000000000007fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff82541617905588815260128352206156918154614c4e565b90558351928352820152a3565b6064838751907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152600b60248201527f494e56414c49445f5349470000000000000000000000000000000000000000006044820152fd5b5060248f7f4e487b710000000000000000000000000000000000000000000000000000000081526041600452fd5b505060248f7f4e487b710000000000000000000000000000000000000000000000000000000081526041600452fd5b6064868a51907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152600d60248201527f494e56414c49445f4e4f4e4345000000000000000000000000000000000000006044820152fd5b6064868a51907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152600a60248201527f5a45524f5f53434f5245000000000000000000000000000000000000000000006044820152fd5b6064868a51907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152600960248201527f5355424d495454454400000000000000000000000000000000000000000000006044820152fd5b6064878b51907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152600a60248201527f4e4f545f504c41594552000000000000000000000000000000000000000000006044820152fd5b60058110156140ba57806158dd5750565b600181036159435760646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152fd5b600281036159a95760646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152fd5b6003146159b257565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c60448201527f75650000000000000000000000000000000000000000000000000000000000006064820152fd5b906041815114600014615a6457615a60916020820151906060604084015193015160001a90615a6e565b9091565b5050600090600290565b9291907f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311615afe5791608094939160ff602094604051948552168484015260408301526060820152600093849182805260015afa15615af157815173ffffffffffffffffffffffffffffffffffffffff811615615aeb579190565b50600190565b50604051903d90823e3d90fd5b50505050600090600390565b90815480825260208092019260005281600020916000905b828210615b30575050505090565b835473ffffffffffffffffffffffffffffffffffffffff1685529384019360019384019390910190615b22565b60608101949392604092615b70816140b0565b82526020820152015256fea2646970667358221220ff39914fb7286ad15addfb59bc7812713e11e367d50b522d266656b15c72c46764736f6c63430008120033",
      "sourceMap": "888:27709:48:-:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;27097:43;888:27709;27097:43;;;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;27440:50;;;888:27709;;;;;;;;;;;;;;;;;;:::i;:::-;2227:103:20;;;:::i;:::-;2642:4:15;;:::i;:::-;7703:10:48;;;:35;;;888:27709;7695:60;;;:::i;:::-;888:27709;;;;;7785:6;888:27709;;;;;7818:10;;;888:27709;;7809:34;888:27709;;;;;7817:11;7809:34;:::i;:::-;7853:38;888:27709;;;;;7861:13;7853:38;:::i;:::-;7909:16;;;;888:27709;;;;;;;;;;;;7901:70;888:27709;;;;;;7909:43;7901:70;:::i;:::-;7989:12;;;888:27709;7981:64;2981:2;888:27709;;7989:42;7981:64;:::i;:::-;888:27709;;;7909:16;888:27709;;;;;;;;;:::i;:::-;;;;:::i;:::-;;;;8075:99;;;;888:27709;8075:99;;888:27709;;;:::i;:::-;8075:99;;;888:27709;8075:99;;;;;;;;;;;888:27709;8192:9;;888:27709;;;;;;;8192:25;;;;;;888:27709;8192:25;;888:27709;8192:25;;;;;;;;;;;;;;;;;888:27709;8192:37;;8184:61;8192:37;;;8263:40;8192:37;;;;8184:61;:::i;:::-;888:27709;;;8263:40;;888:27709;;;;8263:40;;;888:27709;;;8297:4;888:27709;;;;;;;;;;;;;;;8263:40;;;;;;;;;;;;;;888:27709;8263:52;8641:26;8263:52;;888:27709;8683:26;8263:52;8420:23;8263:52;888:27709;8263:52;;8683:26;8263:52;;;;;;8401:8;8263:52;8255:87;8263:52;;;-1:-1:-1;8263:52:48;8255:87;:::i;:::-;8297:4;;8401:8;;:::i;:::-;8420:23;:::i;:::-;888:27709;;;;;;:::i;:::-;;;;8478:153;;;888:27709;;;;8478:153;;;888:27709;;;;8478:153;;;888:27709;;;;8478:153;;;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;8641:14;888:27709;;;8641:26;:::i;:::-;888:27709;;;;;;;;;;;;;;;;;;;;;;8683:26;;;;888:27709;2809:22:20;888:27709:48;;;8263:40;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;888:27709;;;;;;;;8263:40;;888:27709;;8263:40;;;;888:27709;;8263:40;;888:27709;8683:26;8263:40;;888:27709;;;;8263:40;;;;;;888:27709;;;;;;;;;8192:25;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;888:27709;;;;;;;;;;;;;8184:61;8192:25;;;;;;;;888:27709;;;;;;;;;8075:99;;;;;;;;;;;;;;;;;;;:::i;:::-;;;888:27709;;;;;;;8075:99;;;;;;;;;;888:27709;;;;;;;;;7703:35;-1:-1:-1;7727:11:48;888:27709;7717:21;;;7703:35;;888:27709;;;;;;;;;;;;;;;;;;27440:50;888:27709;27440:50;;888:27709;27480:9;888:27709;27440:50;;;888:27709;27440:50;:17;888:27709;27440:17;;:50;;;;;;;;;;;;;;;888:27709;;27440:50;888:27709;;;;;;;;;;;;;;;27440:50;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;888:27709;;;;27440:50;888:27709;;;;;;;;;;;;;27440:50;;;;;;;;-1:-1:-1;27440:50:48;;;888:27709;;;;;;;;;;;;;;;;;;;;;;;;2793:28;888:27709;;;;;;;;;;;;;;;;;2657:1:15;888:27709:48;;;:::i;:::-;2227:103:20;;;;;;;;;:::i;:::-;2642:4:15;;:::i;:::-;2657:1;:::i;:::-;1506::55;2809:22:20;888:27709:48;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2642:4:15;;;;:::i;:::-;888:27709:48;25826:25;25822:88;;888:27709;;;25923:24;25919:92;;888:27709;26024:23;;26020:84;;888:27709;26117:30;;26113:113;;888:27709;26239:28;;26235:105;;888:27709;26353:27;;26349:107;;888:27709;;;26349:107;888:27709;26396:49;888:27709;;;26396:49;888:27709;;;26235:105;888:27709;26283:46;888:27709;;;26283:46;888:27709;26235:105;;;26113:113;888:27709;26163:52;888:27709;;;26163:52;888:27709;26113:113;;;26020:84;888:27709;26063:30;888:27709;;;26063:30;888:27709;26020:84;;;25919:92;888:27709;25963:37;888:27709;;;25963:37;888:27709;25919:92;;;25822:88;888:27709;25867:32;888:27709;;;25867:32;888:27709;25822:88;;;888:27709;;;;;;;;;;;;;;;;2227:103:20;;;:::i;:::-;6359:10:48;;;:35;;;888:27709;6351:60;;;:::i;:::-;888:27709;;;6441:6;888:27709;;;;;6474:10;;;;;888:27709;;6465:34;888:27709;;;;;6473:11;6465:34;:::i;:::-;6509:38;888:27709;;;;;6517:13;6509:38;:::i;:::-;6578:16;;;6595:10;;888:27709;;;;;;;6557:110;888:27709;;;;;;6578:49;6557:110;:::i;:::-;6685:12;;;888:27709;6677:64;2981:2;888:27709;;6685:42;6677:64;:::i;:::-;888:27709;;;6578:16;888:27709;;;;;;;;;:::i;:::-;;;;:::i;:::-;;;;6771:99;;;;888:27709;6771:99;;888:27709;;;:::i;:::-;6771:99;;;888:27709;6771:99;;;;;;;;;;;888:27709;6888:9;;888:27709;;;;;;;6888:31;;6595:10;6888:31;;;888:27709;6888:31;;888:27709;6888:31;;;;;;;;;;;;;;;;;;;888:27709;6888:43;6965:46;6888:43;;;;6880:67;6888:43;;;6880:67;:::i;:::-;888:27709;;;6965:46;;6595:10;6965:46;;;888:27709;;;7005:4;888:27709;;;;;;;;;;;;;;;6965:46;;;;;;;;;;;;;;888:27709;6965:58;;888:27709;7415:32;6965:58;;;7134:29;6965:58;;;7115:8;7415:32;6965:58;;7373:26;6965:58;;6957:93;6965:58;;;;;6957:93;:::i;:::-;7005:4;6595:10;;7115:8;;:::i;:::-;6595:10;7134:29;;:::i;:::-;888:27709;;;;;;;:::i;:::-;6595:10;888:27709;;7204:159;;;888:27709;;;;7204:159;;;888:27709;;;;7204:159;;;888:27709;;;;7204:159;;;888:27709;;;6595:10;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;7373:26;888:27709;;;;;;6595:10;888:27709;;;;;;;;;;;;6965:46;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;888:27709;;;;;;6965:46;;;;888:27709;;6965:46;;;;888:27709;;;;;;;6965:46;;;;;;;6888:31;;;;;;;;;;;;;;;;;;;:::i;:::-;;;888:27709;;;;;;;;;;;;;6965:46;6888:31;;;;;;;6771:99;;;;;;;;;;;;;;;;;;;:::i;:::-;;;888:27709;;;;;;;6771:99;;;;;;;;;6359:35;-1:-1:-1;6383:11:48;888:27709;6373:21;;;6359:35;;888:27709;;;;;;;;;;;;;;;;;;;;2613:39;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;2642:4:15;;;:::i;:::-;888:27709:48;;;22222:6;888:27709;;;;;;;22255:10;888:27709;;;;;;;;;;;;;;22319:8;888:27709;;;;;;;;;;;22319:35;888:27709;;;22319:35;888:27709;;;;;;;22418:13;888:27709;;22418:60;;;;;;888:27709;;;;;;;22418:60;;;;;888:27709;22418:60;;;;888:27709;;;;;;;;;22418:60;;;;;;;;;;888:27709;;22418:60;;;;:::i;:::-;888:27709;;22418:60;888:27709;22418:60;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2642:4:15;;:::i;:::-;888:27709:48;5807:17;888:27709;;;;;:::i;:::-;;;;;;;;:::i;:::-;;;;5807:104;;;;888:27709;5807:104;;888:27709;;;:::i;:::-;5807:104;;;888:27709;5807:104;;;;;;;;;;;888:27709;;;;;;;;;6226:46;888:27709;5962:13;;888:27709;5962:13;:::i;:::-;888:27709;;5962:13;888:27709;;;;6005:6;888:27709;;;;;;;;6069:10;;888:27709;;;:::i;:::-;;;6114:15;6097:14;6114:15;6097:14;;888:27709;;2899:4;888:27709;;;;;;;;;;;;;;;5962:13;888:27709;;;;;;;;;;:::i;:::-;;;;;;;6226:46;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;5807:104;;;;;;;;;;;;;;;:::i;:::-;;;;;:::i;:::-;;;;;;;;;;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;:::i;:::-;4869:37:40;;;;;;888:27709:48;;4972:2:40;4950:24;;888:27709:48;;5023:33:40;;;;;;:::i;:::-;5072:13;;1506:1:55;5202:12:40;;;888:27709:48;5202:12:40;;;888:27709:48;5202:12:40;888:27709:48;5202:12:40;888:27709:48;;;;5067:839:40;5087:22;;;;;;888:27709:48;;;;;;;;;;;;;;;:::i;:::-;;;;5111:3:40;5158:10;888:27709:48;;;;;;;;;;;;;;;;;5379:14:40;;;;;;5844:11;5379:14;;;;;;;;;;;;5111:3;5379:14;;;;;;;;;5740:155;5379:14;;5703:17;5379:14;;;;:::i;:::-;888:27709:48;5158:10:40;;888:27709:48;;5338:8:40;888:27709:48;;;;;;;;;;;;;;;;;;5158:10:40;888:27709:48;;;;;;;;;;;;;5202:12:40;888:27709:48;;;;5407:39:40;888:27709:48;5158:10:40;888:27709:48;;;;;;;;;;;;;5475:36:40;888:27709:48;;;5475:36:40;888:27709:48;;;;;;5158:10:40;888:27709:48;;;;;;;;;;;;;;;;5533:36:40;888:27709:48;5638:11:40;;;;;:::i;:::-;888:27709:48;5158:10:40;;888:27709:48;;;;;;;;;;;;5594:41:40;888:27709:48;;;5594:41:40;888:27709:48;5158:10:40;888:27709:48;;;;;5664:25:40;888:27709:48;;5664:25:40;:::i;:::-;888:27709:48;;5703:17:40;:::i;:::-;888:27709:48;5844:11:40;:::i;:::-;888:27709:48;;;;;;5158:10:40;5740:155;;5111:3;:::i;:::-;5072:13;;888:27709:48;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;5486:7:15;888:27709:48;;2642:4:15;888:27709:48;;;:::i;:::-;;;;;;;;;;4604:22:15;888:27709:48;2642:4:15;:::i;:::-;5486:7;:::i;:::-;888:27709:48;;;;;;;;;;;;;;;;;;;;;2642:4:15;;;:::i;:::-;888:27709:48;;;12294:6;888:27709;;;;;;12327:10;888:27709;;12362:38;888:27709;;12318:34;888:27709;;;;;;12326:11;12318:34;:::i;:::-;888:27709;;;12370:13;12362:38;:::i;:::-;888:27709;;;;;12294:6;888:27709;;;;;12575:10;;;;888:27709;;;;;;;;;;12602:12;12617:15;;12602:12;;;888:27709;13066:12;;;888:27709;;;;;;:::i;:::-;;;;;;;;:::i;:::-;;;;;;;;:::i;:::-;;;;;;;;;;13114:13;;;;;13199:16;;;;13109:412;13129:23;;;;;;888:27709;;;;;;;;;12588:4;888:27709;13587:17;888:27709;;13660:14;;888:27709;;;;;;;;;:::i;:::-;;;;:::i;:::-;13587:208;;;;;888:27709;;;;;;;;;;;13587:208;;;888:27709;13587:208;;;;888:27709;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;13587:208;;;;;;;;;;;;;;;;;;;12756:28;13587:208;;;;;888:27709;;;;;;;12756:28;888:27709;;13587:208;;;;:::i;:::-;;;;;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;888:27709:48;;-1:-1:-1;888:27709:48;;;;;;;;12588:4;888:27709;;;;;;;13587:208;888:27709;;;13154:3;13216:15;13154:3;13216:15;;;;;:::i;:::-;888:27709;;;;;;;;;;;;;;;;;;;;12588:4;888:27709;;13389:10;;888:27709;;;;;;;;:::i;:::-;;;;;;;;;;;;13263:247;;;888:27709;;;;13263:247;;;888:27709;;;;;;;13263:247;;888:27709;;;;13263:247;;888:27709;13246:264;;;;:::i;:::-;;;;;;:::i;:::-;;13154:3;:::i;:::-;13114:13;;;;;;888:27709;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;27097:43;888:27709;27097:43;;888:27709;27130:9;888:27709;27097:43;;;888:27709;27097:43;:17;888:27709;27097:17;;:43;;;;;;;;;;888:27709;27097:43;888:27709;;;;;;;27097:43;;;;;;;;;;;;;;;;;:::i;:::-;;;888:27709;;;;27097:43;888:27709;;27097:43;;;;;;-1:-1:-1;27097:43:48;;;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;9781:8:40;888:27709:48;;;;;;;;;;;;;9833:18:40;;888:27709:48;9865:15:40;9923:20;888:27709:48;9865:15:40;;;888:27709:48;;9894:15:40;;;888:27709:48;9923:20:40;;888:27709:48;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2321:123;888:27709;;;;;;;;;;;;;;;;;;;2899:4;888:27709;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;:::i;:::-;7229:13:40;;;888:27709:48;7229:13:40;888:27709:48;;7224:431:40;7244:17;;;;;;888:27709:48;;;;;;;;;;;;;;;;;;7670:46:40;888:27709:48;;;;;;;;;;;;;7670:46:40;;;;888:27709:48;;;;;;7263:3:40;;888:27709:48;;;;7331:8:40;888:27709:48;;;;;;;;;7363:9:40;888:27709:48;;;;;7363:9:40;;:::i;:::-;888:27709:48;;;;;;;;;;;;;7472:18:40;;;;888:27709:48;7472:22:40;;:93;;;;7263:3;7451:194;;;7263:3;;;;;;;;;;;:::i;:::-;7229:13;;7451:194;888:27709:48;;7620:9:40;888:27709:48;;;;;;;;;;;;;;7620:9:40;;:::i;:::-;888:27709:48;;;;;;;;;;;;;;;;;;;;;;;;;;;7451:194:40;;;;;;;;;;;7472:93;7530:15;;;888:27709:48;7515:12:40;:30;;-1:-1:-1;7515:49:40;;;;7472:93;;;;;7515:49;888:27709:48;7549:15:40;;;;888:27709:48;;7515:49:40;;;888:27709:48;;;;;;;;;;;;;;;;;;;;;;;15580:6;888:27709;;;15624:10;;;888:27709;;;;;;15623:11;:40;;;;888:27709;15623:109;;;888:27709;;;;;;;;;;15623:109;15698:34;:14;;;;888:27709;15698:14;;888:27709;;;15698:34;;:::i;:::-;15679:15;:53;;15623:109;;;;;:40;888:27709;;;;;;;15650:13;15623:40;;;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;2642:4:15;;;;;:::i;:::-;23103:13:48;23118:18;;;;;;888:27709;;;23138:3;23174:10;;23138:3;23174:10;;;;:::i;:::-;888:27709;;;;23218:6;888:27709;;;;;;23251:10;888:27709;;;;;;;;23251:27;;;;23138:3;23247:127;;;23138:3;;;;;:::i;:::-;23103:13;;23247:127;888:27709;;;;;;23340:19;;;;23247:127;;;;;23251:27;888:27709;;;;;;23265:13;23251:27;;;888:27709;;;;;;;;;;;;;;;;;:::i;:::-;;;;8891:8:40;888:27709:48;;;;;;;;;;;;;;;8941:18:40;;888:27709:48;8941:22:40;;;:54;;;;888:27709:48;8941:153:40;;;888:27709:48;8941:200:40;;;888:27709:48;8941:200:40;;;;888:27709:48;;;;;;;;;8941:200:40;9126:15;888:27709:48;9110:12:40;:31;;;-1:-1:-1;8941:200:40;;;;:153;888:27709:48;;;;;;;;;;;;-1:-1:-1;9011:12:40;:83;;888:27709:48;8941:153:40;;;888:27709:48;;;;;;;;;;8941:54:40;8980:15;;;888:27709:48;;;8979:16:40;;-1:-1:-1;8941:54:40;;888:27709:48;;;;;;;;;;;;;;;:::i;:::-;2642:4:15;;:::i;:::-;888:27709:48;;24558:25;888:27709;;;24558:25;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;11913:6;888:27709;;;;;12069:34;11946:10;;;888:27709;;12069:14;888:27709;;11937:34;888:27709;;;;;11945:11;11937:34;:::i;:::-;11981:38;888:27709;;;;;11989:13;11981:38;:::i;:::-;12069:14;888:27709;;;12069:34;;:::i;:::-;12050:15;:53;888:27709;;;;;11913:6;888:27709;;;;;12575:10;;;;888:27709;;;;;;;;;;12602:12;12050:15;;12602:12;;;888:27709;13066:12;;;888:27709;;;;;:::i;:::-;;;;;;;;:::i;:::-;;;;;;;;:::i;:::-;;;;;;;;;;-1:-1:-1;;;13199:16:48;;;888:27709;13129:23;;;;;;888:27709;;;;;;;13587:17;888:27709;;12175:4;;13660:14;;;888:27709;;;;;;;;;:::i;:::-;;;;:::i;:::-;13587:208;;;;;888:27709;;;13587:208;;;;;888:27709;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;13587:208;;;;;;;;;888:27709;13587:208;;;;;;;;;;;;12756:28;13587:208;;;;;888:27709;;;;;;12756:28;888:27709;;13587:208;;;;:::i;:::-;;;;;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;888:27709:48;;;;;;;;;;;;;;;13154:3;13216:15;;;;13154:3;13216:15;;;:::i;:::-;888:27709;;;;;;;;;;;;;;;;;;;;;12175:4;888:27709;;13389:10;;888:27709;;;;;;;;:::i;:::-;;;;;;;;;;;;13263:247;;;888:27709;;;;13263:247;;;888:27709;;;;;;;13263:247;;888:27709;;;;;13263:247;;888:27709;13246:264;;;;:::i;:::-;;;;;;:::i;13154:3::-;13114:13;;888:27709;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1974:10:40;888:27709:48;;;;;;;;;;;2014:12:40;888:27709:48;2014:12:40;888:27709:48;2014:12:40;;;888:27709:48;;;;2014:12:40;888:27709:48;;;;;;1974:10:40;;;;;;888:27709:48;;2138:8:40;888:27709:48;;;;;;;;;;;;;;;;1974:10:40;888:27709:48;;2138:8:40;888:27709:48;;;;;;;;;;2014:12:40;888:27709:48;;;;2199:39:40;888:27709:48;1974:10:40;888:27709:48;;2138:8:40;888:27709:48;;;;;;;;;;2263:36:40;888:27709:48;;;2263:36:40;888:27709:48;;;;;;1974:10:40;888:27709:48;;2138:8:40;888:27709:48;;;;;;;;;;;;;;;2317:36:40;888:27709:48;1974:10:40;888:27709:48;;2138:8:40;888:27709:48;;;;;;;;;;;2374:41:40;888:27709:48;;;2374:41:40;888:27709:48;1974:10:40;888:27709:48;;;;;2436:25:40;888:27709:48;;2436:25:40;:::i;:::-;888:27709:48;;;;;;;2477:131:40;1974:10;;2477:131;;888:27709:48;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2642:4:15;;:::i;:::-;888:27709:48;24777:17;888:27709;;;;;:::i;:::-;;;;;;;;:::i;:::-;24777:166;;;;;888:27709;;;;;;;24777:166;;;;;888:27709;24777:166;;888:27709;;;:::i;:::-;24777:166;;888:27709;;;;;;;;;;;;;;;24777:166;;;;;;;;888:27709;;;24958:42;888:27709;24958:42;888:27709;;24958:42;;;;;:::i;:::-;;;;888:27709;;24777:166;;;;:::i;:::-;888:27709;;24777:166;;;;;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;5005:18:38;888:27709:48;;;;;;;;;;;;;;;5005:18:38;:::i;:::-;888:27709:48;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;2642:4:15;;;:::i;:::-;26645:17:48;:57;;;;;;888:27709;;;26645:57;;888:27709;26680:9;888:27709;;26645:57;;;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;;;26645:57;;;;;;;;;;;;;888:27709;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;2642:4:15;;;:::i;:::-;27692:17:48;:60;;;;;;888:27709;;;27692:60;;888:27709;27730:9;888:27709;;27692:60;;;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;;;27692:60;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;;2642:4:15;;;:::i;:::-;888:27709:48;25227:17;888:27709;;;;;;:::i;:::-;;;;;;;:::i;:::-;25227:153;;;;;888:27709;;;;;;25227:153;;;;;888:27709;25227:153;;888:27709;;;:::i;:::-;25227:153;;888:27709;;;;;;;;;;;25227:153;;;;;;;;888:27709;;25452:50;888:27709;25452:50;888:27709;;25452:50;;;;;:::i;888:27709::-;;;;;;;;;;:::i;:::-;2227:103:20;;;;;;;;;;;;:::i;:::-;888:27709:48;1637:13;888:27709;;1623:10;:27;888:27709;;1675:1;;;;;;:::i;888:27709::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;24390:12;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;2642:4:15;;:::i;:::-;26933:10:48;888:27709;;;;26896:17;:60;;;;;888:27709;;;26896:60;;888:27709;;;;26896:60;;;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;;;26896:60;888:27709;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;15434:34;888:27709;;;;15384:6;888:27709;;;15434:14;;;;888:27709;15451:17;;888:27709;;15434:34;;:::i;:::-;15415:15;:53;;888:27709;;;;;;;;;;;;;;;;;;;;;;1454:42;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;3087:10:40;;888:27709:48;;;;822:8:40;888:27709:48;;;;;;;;;;;;;;861:18:40;;888:27709:48;861:22:40;;888:27709:48;;;922:15:40;;;888:27709:48;;;;;;;;;;;;989:12:40;:87;888:27709:48;;;1155:15:40;;888:27709:48;989:12:40;1139:31;888:27709:48;;3087:10:40;;;888:27709:48;;822:8:40;888:27709:48;;;;;;;;;;;3311:20:40;;;;;888:27709:48;3311:31:40;888:27709:48;;;;3440:35:40;;;888:27709:48;;;;;;;;;3440:35:40;;;;;;:::i;:::-;888:27709:48;3430:46:40;;888:27709:48;;3494:33:40;888:27709:48;;3837:18:40;;888:27709:48;3837:18:40;;888:27709:48;;3311:20:40;888:27709:48;;;;3692:323:40;;;;888:27709:48;;;;;;;3789:16:40;888:27709:48;;;;3827:29:40;;888:27709:48;;;;;;;;3087:10:40;888:27709:48;;;;;;;;;;;;;;;;;3692:323:40;;888:27709:48;;;;;;;;;;;;;;;;;822:8:40;888:27709:48;;;;;;;;;3665:364:40;;4135:50;;;;;;;888:27709:48;;;;;4135:50:40;;;;;;:::i;:::-;888:27709:48;4125:61:40;;3311:20;888:27709:48;922:15:40;4207;;888:27709:48;;;;;;;;4239:22:40;888:27709:48;;;;;;4292:134:40;3087:10;;4292:134;;888:27709:48;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2451:33;888:27709;;;;;;;;;;;;;;;;;;;;2699:39;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;14630:6;888:27709;;;;;14676:12;;;;888:27709;;;;;;;:::i;:::-;;;;;;;;:::i;:::-;;;;;;;;:::i;:::-;;;;;;;14907:16;14760:26;;;:::i;:::-;14802:13;14907:16;;14797:160;14817:15;;;;;;888:27709;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;:::i;14834:3::-;14866:15;;14834:3;14866:15;;;:::i;:::-;888:27709;;;;;;;;;;14853:28;;;;:::i;:::-;888:27709;14924:15;;;;:::i;:::-;888:27709;;;;;;;;;;;;;;;;14907:39;888:27709;;14895:51;;;;:::i;:::-;888:27709;14834:3;:::i;:::-;14802:13;;888:27709;;;;;;;;;;;;;;;;:::i;:::-;2642:4:15;;;:::i;:::-;27908:17:48;888:27709;;;27958:10;888:27709;;27908:65;;;;;;888:27709;;;;;;27908:65;;;;;888:27709;27908:65;;27947:9;;888:27709;27908:65;;;888:27709;;;;;;;;;;27908:65;;;;;;;;;;888:27709;;;;;;;;;;;;;;;;;;2744:42;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;;;;14196:6;888:27709;;;14241:14;888:27709;14241:14;;888:27709;14269:14;;;;888:27709;14297:12;;;;888:27709;14323:10;;;888:27709;;14397:12;888:27709;;;;;14397:12;;888:27709;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23808:16;888:27709;;;;;:::i;:::-;;;;;23752:6;888:27709;;;23808:16;888:27709;;;;;;;;;;;;;;;23924:16;;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2520:30;888:27709;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;719:10:31;;888:27709:48;;;6133:23:15;888:27709:48;;;6237:7:15;888:27709:48;;6237:7:15;:::i;888:27709:48:-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;8398:50:38;888:27709:48;;;;;;:::i;:::-;;;;;;;;;;2642:4:15;888:27709:48;;;;4604:22:15;888:27709:48;2642:4:15;:::i;:::-;888:27709:48;;;;;;;;;;;;;;;;;;;;;;;;7669:23:15;7665:149;;888:27709:48;;;;;;8398:50:38;:::i;:::-;;888:27709:48;;7665:149:15;888:27709:48;;;;;;;;;;;;;;;;;;;;;;;;;719:10:31;7763:40:15;;;;;;7665:149;;888:27709:48;;;;;;;;;;;;;;;;1406:42;888:27709;;;;;;;;;;;;;;;;;;;;;;;2827:26;888:27709;;;;;;;;;;;;;;;;;;;;;;;2556:24;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;4604:22:15;888:27709:48;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;10636:8:40;888:27709:48;;;;;;;;;;;10636:34:40;888:27709:48;;;10636:34:40;888:27709:48;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2981:2;888:27709;;;;;;;;;;;;;;;;;;;2490:24;888:27709;;;;;;;;;;;;;;;;;;;;;;;24192:12;888:27709;;;;;;;;24161:6;888:27709;;;24192:12;888:27709;;;;;;;:::i;:::-;;;;:::i;:::-;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;2642:4:15;;;:::i;:::-;888:27709:48;;;22799:6;888:27709;;;;;;22831:10;888:27709;;;;;;;;;;;;;;;;22867:38;888:27709;;;;;;22875:13;22867:38;:::i;:::-;888:27709;;;;22950:19;;;;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2658:35;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;15095:6;888:27709;;;;;;;;15123:10;;;888:27709;;;;;;;;15160:12;15175:14;15160:12;:29;:12;;888:27709;15175:14;;888:27709;15160:29;;:::i;15119:155::-;888:27709;;;;;15119:155;15249:14;15231:32;15249:14;;888:27709;15231:15;:32;:::i;:::-;15119:155;;;888:27709;;;;;;;;;;;;;;2642:4:15;;:::i;:::-;888:27709:48;22645:13;888:27709;;22645:36;;;;;888:27709;;;;;22645:36;;;;;888:27709;22645:36;;888:27709;;22645:36;;;888:27709;22645:36;;;;;;;;;;888:27709;;;22645:36;;;;:::i;:::-;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;;;742:57:16;;757:42;742:57;;:97;;;;;888:27709:48;;;;;;;742:97:16;2855:32:15;2840:47;;;-1:-1:-1;2840:87:15;;;;742:97:16;;;;;2840:87:15;952:25:34;937:40;;;2840:87:15;;;888:27709:48;;;;;;;;;;;;;;;-1:-1:-1;888:27709:48;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;:::o;:::-;;-1:-1:-1;888:27709:48;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;888:27709:48;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;3460:103:15:-;719:10:31;888:27709:48;;;;;;;;;;;;;;;;;;;3931:23:15;3927:390;;3460:103;;;:::o;3927:390::-;2497:52:32;719:10:31;2497:52:32;:::i;:::-;888:27709:48;;;1818:437:32;888:27709:48;;;:::i;:::-;;;;;;;;;;;;;;;;;1975:15:32;;;888:27709:48;;;;;;;;;;;2000:15:32;888:27709:48;;;2000:15:32;888:27709:48;2025:128:32;2058:5;;;;;;2170:10;;;278:18;;888:27709:48;;;;4022:252:15;888:27709:48;;;;3970:336:15;888:27709:48;;4022:252:15;;888:27709:48;4022:252:15;;;;888:27709:48;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;:::i;:::-;;4022:252:15;;;;;;;;;:::i;:::-;888:27709:48;3970:336:15;;;;;;2141:1:32;3970:336:15;;;:::i;:::-;;;;278:18:32;;888:27709:48;;;278:18:32;;;;;2141:1;278:18;;;;;;888:27709:48;278:18:32;888:27709:48;;;278:18:32;;2065:3;2105:11;;;2113:3;2105:11;;2096:21;;;;;;888:27709:48;2096:21:32;;2084:33;;;;:::i;:::-;;2141:1;888:27709:48;2065:3:32;888:27709:48;;;;;;2030:26:32;;;;888:27709:48;;;;;;;2141:1:32;888:27709:48;;2096:21:32;888:27709:48;;;;;;2141:1:32;888:27709:48;;;;;;;;;;;;3460:103:15;3130:6;888:27709:48;;;;;;;;;;;;;719:10:31;888:27709:48;;;;;;;;;;3931:23:15;3927:390;;3460:103;;;;:::o;3927:390::-;2497:52:32;719:10:31;2497:52:32;:::i;:::-;888:27709:48;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;1975:15:32;;;888:27709:48;;;;;;;;;;;2000:15:32;888:27709:48;;;2000:15:32;888:27709:48;2025:128:32;2058:5;;;;;;2170:10;;;278:18;;888:27709:48;;;;4022:252:15;888:27709:48;;;;3970:336:15;888:27709:48;;4022:252:15;;888:27709:48;4022:252:15;;;;888:27709:48;;;;;;;;;;;;:::i;2065:3:32:-;2105:11;;;2113:3;2105:11;;2096:21;;;;;;888:27709:48;2096:21:32;;2084:33;;;;:::i;:::-;;2141:1;888:27709:48;2065:3:32;888:27709:48;;;;;;2030:26:32;;;;888:27709:48;;;;;;;;-1:-1:-1;;888:27709:48;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;:::o;2233:171:16:-;;888:27709:48;8719:53:38;2233:171:16;3130:6:15;888:27709:48;;;;;;;;;;;;;;;;;;;;;;;;;8070:149:15;;2233:171:16;888:27709:48;;2363:12:16;888:27709:48;;;8719:53:38;:::i;:::-;;2233:171:16:o;8070:149:15:-;888:27709:48;;;;;;;;;;;;;;;;;;;;;;;719:10:31;8168:40:15;;;;;;8070:149;;888:27709:48;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;1818:437:32;888:27709:48;;;;;;:::i;:::-;;;;;;;;;;;;;;;;1975:15:32;;;888:27709:48;;;;;;;;;2000:15:32;888:27709:48;;;2000:15:32;888:27709:48;2025:128:32;2058:5;;;;;;2170:10;;278:18;;1818:437;:::o;278:18::-;;888:27709:48;;278:18:32;;;888:27709:48;2141:1:32;278:18;;;888:27709:48;278:18:32;;;888:27709:48;278:18:32;888:27709:48;;;278:18:32;;2065:3;2105:11;;2113:3;2105:11;;2096:21;;;;;;888:27709:48;2096:21:32;;2084:33;;;;:::i;:::-;;2141:1;888:27709:48;2065:3:32;888:27709:48;;;;;;2030:26:32;;;888:27709:48;;-1:-1:-1;888:27709:48;;;;2141:1:32;888:27709:48;;2096:21:32;888:27709:48;-1:-1:-1;888:27709:48;;;;2141:1:32;888:27709:48;;;;;;;;;;-1:-1:-1;888:27709:48;;-1:-1:-1;888:27709:48;;;-1:-1:-1;888:27709:48;:::o;2214:404:38:-;;;4351:12;;;-1:-1:-1;888:27709:48;;;;;;;;;;;4351:24:38;2293:319;888:27709:48;;;;;;;;;;;;;;;;4351:12:38;888:27709:48;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;4351:12:38;2547:11;:::o;888:27709:48:-;;;;;;;;;;2293:319:38;-1:-1:-1;2589:12:38;-1:-1:-1;;2589:12:38:o;888:27709:48:-;;;;;;;;;;:::o;2786:1388:38:-;;2989:12;;;-1:-1:-1;;888:27709:48;;;;;;;;;;;3023:15:38;;;;3019:1149;3023:15;;;888:27709:48;;;;;;;;;;;;;;;;;;;;;3505:26:38;;;3501:398;;3019:1149;888:27709:48;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;2989:12:38;4103:11;:::o;888:27709:48:-;;;;;;;;;;3501:398:38;888:27709:48;3571:22:38;3693:26;3571:22;;;:::i;:::-;888:27709:48;;;;;;3693:26:38;;;;;:::i;888:27709:48:-;;;;;;;;;;;;3501:398:38;;;;;888:27709:48;;;;;;;;;;;;;;;;;;;;3019:1149:38;4145:12;;;;;:::o;1579:2:55:-;;;;;;;;;:::o;888:27709:48:-;;;;;;;;;;;:::o;:::-;;;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;;:::i;:::-;;;;;;;;:::o;:::-;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;:::o;1721:491::-;888:27709;;;;;;;:::i;:::-;;;;;;;;;;;;;:::i;:::-;;;;;;;;;1834:357;;888:27709;1866:141;888:27709;;2029:31;888:27709;;;;2082:21;888:27709;;;;2125:13;888:27709;;;;2168:4;888:27709;;;;;1834:357;;888:27709;;;;;;;;;;;;;;;1807:398;;1721:491;:::o;888:27709::-;;;;;;;;;;;;;;;;;;:::o;:::-;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;:::o;2336:287:20:-;2468:7;888:27709:48;;2468:19:20;1759:1;;2468:7;888:27709:48;;2336:287:20:o;1759:1::-;;888:27709:48;;1759:1:20;;;;;;;;;;;;888:27709:48;1759:1:20;888:27709:48;;;1759:1:20;;1355:203:23;;-1:-1:-1;1355:203:23;5535:69:30;1355:203:23;888:27709:48;;1482:68:23;;;;;;;888:27709:48;1482:68:23;;888:27709:48;;;;;;1482:68:23;;;888:27709:48;;;;;;;;;;;1482:68:23;;;;;:::i;:::-;888:27709:48;;;;;;;;:::i;:::-;;;;;;;;;5487:31:30;;;;;;888:27709:48;;;;;;;;;:::i;:::-;;;;;;;;:::i;:::-;;;;-1:-1:-1;888:27709:48;;;;5535:69:30;:::i;:::-;888:27709:48;;5705:22:23;;;;:56;;;;;888:27709:48;;;;;;;1355:203:23;:::o;888:27709:48:-;;;;;;;;;;;;;;1482:68:23;888:27709:48;;;;;;;;;;;;;;5705:56:23;5731:30;;-1:-1:-1;5731:30:23;;;;;;;:::i;:::-;5705:56;;;;;888:27709:48;;;7671:628:30;;;;7875:418;;;888:27709:48;;;7906:22:30;7902:286;;8201:17;;:::o;7902:286::-;1702:19;:23;888:27709:48;;8201:17:30;:::o;888:27709:48:-;;;;;;;;;;;;;;;;;;;;;;;7875:418:30;888:27709:48;;;;-1:-1:-1;8980:21:30;:17;;9152:142;;;;;;;8976:379;9324:20;888:27709:48;;;9324:20:30;;;;;;;;;;:::i;9443:1104:48:-;;;;;;;;-1:-1:-1;888:27709:48;;;;;;;;9691:6;888:27709;;;;9839:16;888:27709;;;9759:38;888:27709;9724:10;;;888:27709;9715:34;888:27709;;;;;9723:11;9715:34;:::i;9759:38::-;888:27709;;;;;;;9839:16;888:27709;;;;;;;;;;;;9881:27;888:27709;;;;;;;;9994:9;;888:27709;;;;;10045:12;888:27709;;;;;;10036:29;;888:27709;;9033:17;;:::i;:::-;888:27709;;9107:269;;;888:27709;2321:123;888:27709;;;;;;;;;;;;;;;;;;;;;;;;;;;9107:269;;888:27709;;;;;;;;;;;;;;;;;;;;;;;9072:326;;8963:453;;;888:27709;;;;;;;;;;;;;8963:453;;888:27709;;;;;;;;;;;;;8936:494;;888:27709;;;;;:::i;:::-;;;;;;;;:::i;:::-;;;;;;;;;;;;;3800:27:33;888:27709:48;3849:5:33;888:27709:48;;;;;;;;;3800:27:33;:::i;:::-;3849:5;;;;:::i;:::-;888:27709:48;10281:13;888:27709;;;;10254:40;888:27709;;;;;;10480:60;888:27709;;;;;10321:32;;;;888:27709;;;;;;;;;;;;;;;10321:32;888:27709;10363:16;;;;888:27709;;;;;;;;;;;;;;;;;;;10045:12;888:27709;;;10442:22;888:27709;;10442:22;:::i;:::-;888:27709;;;;;;;;;;10480:60;9443:1104::o;888:27709::-;;;;;;;;;9724:10;888:27709;;;;;;;;;;;;;;;;;;;;;;9724:10;888:27709;;;;;;;;;;;9724:10;888:27709;;;;;;;;;;;9724:10;888:27709;;;;;;;;;;;;;;;;;;;;;;;9724:10;888:27709;;;;;;;;;;;;;;;;;;;;;;;9724:10;888:27709;;;;;;;;;;;;;;;;;;;;;;;9724:10;888:27709;;;;;;;;;;;;;;570:511:33;888:27709:48;;;;;;638:29:33;;;683:7;:::o;634:441::-;888:27709:48;734:38:33;;888:27709:48;;;;;788:34:33;;;888:27709:48;788:34:33;;;888:27709:48;;;;;;;;;;;788:34:33;730:345;852:35;843:44;;852:35;;888:27709:48;;;903:41:33;;;888:27709:48;903:41:33;;;888:27709:48;;;;;;;;;;;903:41:33;839:236;974:30;965:39;961:114;;570:511::o;961:114::-;888:27709:48;;;1020:44:33;;;888:27709:48;1020:44:33;;;888:27709:48;;;;;;;;;;;;;;;;1020:44:33;2145:730;;2283:2;888:27709:48;;2263:22:33;2259:610;2283:2;;;2746:25;2546:180;;;;;;;;;;;;;;-1:-1:-1;2546:180:33;2746:25;;:::i;:::-;2739:32;;:::o;2259:610::-;2802:56;;2818:1;2802:56;2822:35;2802:56;:::o;5009:1456::-;;;;6021:66;6008:79;;6004:161;;888:27709:48;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;6276:24:33;;;;;;;;;;;;;;888:27709:48;;;6314:20:33;6310:101;;6421:37;5009:1456;:::o;6310:101::-;6350:50;6276:24;6350:50;:::o;6276:24::-;888:27709:48;;;;;;;;;;;6004:161:33;6103:51;;;;6119:1;6103:51;6123:30;6103:51;:::o;888:27709:48:-;;;;;;;;;;;;-1:-1:-1;888:27709:48;;-1:-1:-1;888:27709:48;;-1:-1:-1;888:27709:48;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;:::o",
      "linkReferences": {
        "src/libraries/FundManagementLib.sol": {
          "FundManagementLib": [
            { "start": 2150, "length": 20 },
            { "start": 6899, "length": 20 },
            { "start": 10597, "length": 20 },
            { "start": 10843, "length": 20 },
            { "start": 11628, "length": 20 },
            { "start": 13684, "length": 20 }
          ]
        }
      },
      "immutableReferences": {
        "48237": [
          { "start": 1055, "length": 32 },
          { "start": 2106, "length": 32 },
          { "start": 3274, "length": 32 },
          { "start": 6855, "length": 32 },
          { "start": 10684, "length": 32 },
          { "start": 10930, "length": 32 },
          { "start": 13177, "length": 32 },
          { "start": 13788, "length": 32 }
        ]
      }
    },
    "methodIdentifiers": {
      "DEFAULT_ADMIN_ROLE()": "a217fddf",
      "GAME_DURATION()": "c31b29ce",
      "MAX_PLAYERS_PER_GAME()": "185f31b0",
      "SCORE_SUBMISSION_TYPE_HASH()": "c60d1996",
      "autoEndGame(uint256)": "a3dac2de",
      "batchCommit(bytes32[],bytes32[])": "da79a9c3",
      "canAutoEndGame(uint256)": "b6d4d64b",
      "canReveal(address,uint256)": "b2040f20",
      "cleanupExpiredCommits(address,uint256[])": "b753204d",
      "cleanupGame(uint256)": "1004ff61",
      "cleanupGameBatch(uint256[])": "b622c034",
      "commitRandom(bytes32,bytes32)": "9d8df9ee",
      "conductLottery(uint256)": "02e06cc8",
      "createGame(uint8)": "e580f6ab",
      "domainSeparator()": "f698da25",
      "emergencyWithdrawAll(address)": "54ab6269",
      "endGame(uint256)": "d0399bb8",
      "forgeNFT()": "25cb9e51",
      "fragmentManager()": "eeb7cfa3",
      "gameConfigManager()": "2e15f1b7",
      "gameCounter()": "2e0be39a",
      "gameRewardManager()": "6388607c",
      "getCommitInfo(address,uint256)": "c7d7996e",
      "getGameDuration(uint256)": "0f42d191",
      "getGameInfo(uint256)": "47e1d550",
      "getGamePlayerScores(uint256)": "599706d0",
      "getGamePlayers(uint256)": "15a40f49",
      "getPlayerInfo(uint256,address)": "3ccd10e9",
      "getPlayerNonce(address)": "68efccbb",
      "getReservePool()": "cf05d9c0",
      "getReservePoolDetails()": "f9f6a812",
      "getRoleAdmin(bytes32)": "248a9ca3",
      "getRoleMember(bytes32,uint256)": "9010d07c",
      "getRoleMemberCount(bytes32)": "ca15c873",
      "getUserNonce(address)": "6834e3a8",
      "grantRole(bytes32,address)": "2f2ff15d",
      "hasRole(bytes32,address)": "91d14854",
      "isGameExpired(uint256)": "65b3a7ca",
      "isPurposeUsed(address,uint256,bytes32)": "1b947707",
      "joinGame(uint256)": "efaa55a0",
      "joinGameAsProxy(uint256,address)": "ffcd664b",
      "nclabToken()": "17723e87",
      "playerNonces(address)": "19ead6fa",
      "renounceRole(bytes32,address)": "36568abe",
      "revealRandom(uint256,uint256,bytes32,bytes32)": "61c3ddfa",
      "revokeRole(bytes32,address)": "d547741f",
      "rewardManager()": "0f4ef8a6",
      "setLotteryRandomness(uint256,address,uint256)": "e87e5f9d",
      "shovelNFT()": "371665b0",
      "shovelSynthesizer()": "4efd3749",
      "submitScore(uint256,address,uint256,uint256,uint256,bytes)": "718072e5",
      "submitScoreAsProxy(uint256,address,uint256,uint256,uint256,bytes)": "f713f6a4",
      "supportsInterface(bytes4)": "01ffc9a7",
      "traitManager()": "59c1303f",
      "trustedSigner()": "f74d5480",
      "updateContracts(address,address,address,address,address,address)": "f440256d",
      "updateLevelConfig(uint8,uint256,uint256,bool)": "92bf9248",
      "updatePoolConfig(uint8,uint256,uint256)": "7cf4c4cd",
      "updateSigner(address)": "a7ecd37e",
      "usd1Token()": "61412fbc",
      "withdrawNclabToken(uint256,address)": "686a978c",
      "withdrawReservePool(uint256,address)": "8391a665",
      "withdrawUsdToken(uint256,address)": "8cce2d47"
    },
    "rawMetadata": "{\"compiler\":{\"version\":\"0.8.18+commit.87f61d96\"},\"language\":\"Solidity\",\"output\":{\"abi\":[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_usd1Token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"signer\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_nclabToken\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_shovelNFT\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_forgeNFT\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_fragmentManager\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_rewardManager\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_traitManager\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_shovelSynthesizer\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_gameConfigManager\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_gameRewardManager\",\"type\":\"address\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"enum SwordBattle.GameLevel\",\"name\":\"level\",\"type\":\"uint8\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"entryFee\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"killReward\",\"type\":\"uint256\"}],\"name\":\"ConfigUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"player\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint64\",\"name\":\"extraFragments\",\"type\":\"uint64\"}],\"name\":\"FragmentBonus\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"admin\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"FundsWithdrawn\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"}],\"name\":\"GameCleaned\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"enum SwordBattle.GameLevel\",\"name\":\"level\",\"type\":\"uint8\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"gameDuration\",\"type\":\"uint256\"}],\"name\":\"GameCreated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"autoEnded\",\"type\":\"bool\"}],\"name\":\"GameEnded\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"player\",\"type\":\"address\"}],\"name\":\"PlayerJoined\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"previousAdminRole\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"newAdminRole\",\"type\":\"bytes32\"}],\"name\":\"RoleAdminChanged\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"}],\"name\":\"RoleGranted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"}],\"name\":\"RoleRevoked\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"player\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint64\",\"name\":\"kills\",\"type\":\"uint64\"},{\"indexed\":false,\"internalType\":\"uint64\",\"name\":\"score\",\"type\":\"uint64\"}],\"name\":\"ScoreSubmitted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"player\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"newShovelId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint8\",\"name\":\"fromTier\",\"type\":\"uint8\"},{\"indexed\":false,\"internalType\":\"uint8\",\"name\":\"toTier\",\"type\":\"uint8\"}],\"name\":\"ShovelSynthesized\",\"type\":\"event\"},{\"inputs\":[],\"name\":\"DEFAULT_ADMIN_ROLE\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"GAME_DURATION\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"MAX_PLAYERS_PER_GAME\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"SCORE_SUBMISSION_TYPE_HASH\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"}],\"name\":\"autoEndGame\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32[]\",\"name\":\"commitments\",\"type\":\"bytes32[]\"},{\"internalType\":\"bytes32[]\",\"name\":\"purposes\",\"type\":\"bytes32[]\"}],\"name\":\"batchCommit\",\"outputs\":[{\"internalType\":\"uint256[]\",\"name\":\"nonces\",\"type\":\"uint256[]\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"}],\"name\":\"canAutoEndGame\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"nonce\",\"type\":\"uint256\"}],\"name\":\"canReveal\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"canRevealNow\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"internalType\":\"uint256[]\",\"name\":\"nonces\",\"type\":\"uint256[]\"}],\"name\":\"cleanupExpiredCommits\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"}],\"name\":\"cleanupGame\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"gameIds\",\"type\":\"uint256[]\"}],\"name\":\"cleanupGameBatch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"commitment\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"purpose\",\"type\":\"bytes32\"}],\"name\":\"commitRandom\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"nonce\",\"type\":\"uint256\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"}],\"name\":\"conductLottery\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"enum SwordBattle.GameLevel\",\"name\":\"level\",\"type\":\"uint8\"}],\"name\":\"createGame\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"domainSeparator\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"}],\"name\":\"emergencyWithdrawAll\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"}],\"name\":\"endGame\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"forgeNFT\",\"outputs\":[{\"internalType\":\"contract ForgeNFT\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"fragmentManager\",\"outputs\":[{\"internalType\":\"contract IFragmentManager\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"gameConfigManager\",\"outputs\":[{\"internalType\":\"contract GameConfigManager\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"gameCounter\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"gameRewardManager\",\"outputs\":[{\"internalType\":\"contract GameRewardManager\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"nonce\",\"type\":\"uint256\"}],\"name\":\"getCommitInfo\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"blockNumber\",\"type\":\"uint256\"},{\"internalType\":\"bool\",\"name\":\"revealed\",\"type\":\"bool\"},{\"internalType\":\"uint256\",\"name\":\"deadline\",\"type\":\"uint256\"},{\"internalType\":\"bytes32\",\"name\":\"commitPurpose\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"}],\"name\":\"getGameDuration\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"duration\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"}],\"name\":\"getGameInfo\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"totalPool\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"createdAt\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"endedAt\",\"type\":\"uint256\"},{\"internalType\":\"enum SwordBattle.GameLevel\",\"name\":\"level\",\"type\":\"uint8\"},{\"internalType\":\"bool\",\"name\":\"ended\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"cleaned\",\"type\":\"bool\"},{\"internalType\":\"uint256\",\"name\":\"playerCount\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"}],\"name\":\"getGamePlayerScores\",\"outputs\":[{\"internalType\":\"address[]\",\"name\":\"players\",\"type\":\"address[]\"},{\"internalType\":\"uint256[]\",\"name\":\"scores\",\"type\":\"uint256[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"}],\"name\":\"getGamePlayers\",\"outputs\":[{\"internalType\":\"address[]\",\"name\":\"\",\"type\":\"address[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"player\",\"type\":\"address\"}],\"name\":\"getPlayerInfo\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"playerAddr\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"kills\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"score\",\"type\":\"uint256\"},{\"internalType\":\"bool\",\"name\":\"submitted\",\"type\":\"bool\"},{\"internalType\":\"uint256\",\"name\":\"fragmentReward\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"player\",\"type\":\"address\"}],\"name\":\"getPlayerNonce\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getReservePool\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getReservePoolDetails\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"totalReserve\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"totalRewardsPending\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"availableForWithdraw\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"}],\"name\":\"getRoleAdmin\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"uint256\",\"name\":\"index\",\"type\":\"uint256\"}],\"name\":\"getRoleMember\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"}],\"name\":\"getRoleMemberCount\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"}],\"name\":\"getUserNonce\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"grantRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"hasRole\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"}],\"name\":\"isGameExpired\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"nonce\",\"type\":\"uint256\"},{\"internalType\":\"bytes32\",\"name\":\"purpose\",\"type\":\"bytes32\"}],\"name\":\"isPurposeUsed\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"}],\"name\":\"joinGame\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"}],\"name\":\"joinGameAsProxy\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"nclabToken\",\"outputs\":[{\"internalType\":\"contract IERC20\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"playerNonces\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"renounceRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"nonce\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"randomValue\",\"type\":\"uint256\"},{\"internalType\":\"bytes32\",\"name\":\"salt\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"purpose\",\"type\":\"bytes32\"}],\"name\":\"revealRandom\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"revokeRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"rewardManager\",\"outputs\":[{\"internalType\":\"contract IRewardManager\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"committer\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"nonce\",\"type\":\"uint256\"}],\"name\":\"setLotteryRandomness\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"shovelNFT\",\"outputs\":[{\"internalType\":\"contract ShovelNFTSlim\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"shovelSynthesizer\",\"outputs\":[{\"internalType\":\"contract ShovelSynthesizer\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"player\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"kills\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"score\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"nonce\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"signature\",\"type\":\"bytes\"}],\"name\":\"submitScore\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"gameId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"player\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"kills\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"score\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"nonce\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"signature\",\"type\":\"bytes\"}],\"name\":\"submitScoreAsProxy\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"interfaceId\",\"type\":\"bytes4\"}],\"name\":\"supportsInterface\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"traitManager\",\"outputs\":[{\"internalType\":\"contract IShovelTraitManager\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"trustedSigner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_nclabToken\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_shovelNFT\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_forgeNFT\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_fragmentManager\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_rewardManager\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_traitManager\",\"type\":\"address\"}],\"name\":\"updateContracts\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"enum SwordBattle.GameLevel\",\"name\":\"level\",\"type\":\"uint8\"},{\"internalType\":\"uint256\",\"name\":\"entryFee\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"killReward\",\"type\":\"uint256\"},{\"internalType\":\"bool\",\"name\":\"active\",\"type\":\"bool\"}],\"name\":\"updateLevelConfig\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"enum SwordBattle.GameLevel\",\"name\":\"level\",\"type\":\"uint8\"},{\"internalType\":\"uint256\",\"name\":\"killPercent\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"survivalPercent\",\"type\":\"uint256\"}],\"name\":\"updatePoolConfig\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newSigner\",\"type\":\"address\"}],\"name\":\"updateSigner\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"usd1Token\",\"outputs\":[{\"internalType\":\"contract IERC20\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"}],\"name\":\"withdrawNclabToken\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"}],\"name\":\"withdrawReservePool\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"}],\"name\":\"withdrawUsdToken\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}],\"devdoc\":{\"events\":{\"RoleAdminChanged(bytes32,bytes32,bytes32)\":{\"details\":\"Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole` `DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite {RoleAdminChanged} not being emitted signaling this. _Available since v3.1._\"},\"RoleGranted(bytes32,address,address)\":{\"details\":\"Emitted when `account` is granted `role`. `sender` is the account that originated the contract call, an admin role bearer except when using {AccessControl-_setupRole}.\"},\"RoleRevoked(bytes32,address,address)\":{\"details\":\"Emitted when `account` is revoked `role`. `sender` is the account that originated the contract call:   - if using `revokeRole`, it is the admin role bearer   - if using `renounceRole`, it is the role bearer (i.e. `account`)\"}},\"kind\":\"dev\",\"methods\":{\"batchCommit(bytes32[],bytes32[])\":{\"details\":\"Batch commit multiple randomness values\",\"params\":{\"commitments\":\"Array of commitment hashes\",\"purposes\":\"Array of purposes for each commitment\"},\"returns\":{\"nonces\":\"Array of nonces for the commits\"}},\"canReveal(address,uint256)\":{\"details\":\"Check if randomness can be revealed\",\"params\":{\"nonce\":\"The commit nonce\",\"user\":\"The user address\"},\"returns\":{\"canRevealNow\":\"Whether the commit can be revealed now\"}},\"cleanupExpiredCommits(address,uint256[])\":{\"details\":\"Clean up expired or used commits to save storage\",\"params\":{\"nonces\":\"Array of nonces to clean\",\"user\":\"The user whose commits to clean\"}},\"commitRandom(bytes32,bytes32)\":{\"details\":\"Commit a randomness hash for a specific purpose\",\"params\":{\"commitment\":\"keccak256(abi.encodePacked(randomValue, salt))\",\"purpose\":\"The intended use of this randomness\"},\"returns\":{\"nonce\":\"The nonce for this commit\"}},\"conductLottery(uint256)\":{\"details\":\"\\u8fdb\\u884c\\u62bd\\u5956 - \\u4ee3\\u7406\\u5230RewardManager\"},\"emergencyWithdrawAll(address)\":{\"details\":\"\\u7d27\\u6025\\u63d0\\u53d6\\u6240\\u6709\\u4ee3\\u5e01\"},\"getCommitInfo(address,uint256)\":{\"details\":\"Get commit information\",\"params\":{\"nonce\":\"The commit nonce\",\"user\":\"The user address\"},\"returns\":{\"blockNumber\":\"Block when committed\",\"commitPurpose\":\"The purpose committed for\",\"deadline\":\"Reveal deadline\",\"revealed\":\"Whether revealed\"}},\"getReservePool()\":{\"details\":\"\\u83b7\\u53d6\\u6ede\\u7559\\u8d44\\u91d1\\u603b\\u989d\"},\"getReservePoolDetails()\":{\"details\":\"\\u83b7\\u53d6\\u6ede\\u7559\\u8d44\\u91d1\\u8be6\\u7ec6\\u4fe1\\u606f\"},\"getRoleAdmin(bytes32)\":{\"details\":\"Returns the admin role that controls `role`. See {grantRole} and {revokeRole}. To change a role's admin, use {_setRoleAdmin}.\"},\"getRoleMember(bytes32,uint256)\":{\"details\":\"Returns one of the accounts that have `role`. `index` must be a value between 0 and {getRoleMemberCount}, non-inclusive. Role bearers are not sorted in any particular way, and their ordering may change at any point. WARNING: When using {getRoleMember} and {getRoleMemberCount}, make sure you perform all queries on the same block. See the following https://forum.openzeppelin.com/t/iterating-over-elements-on-enumerableset-in-openzeppelin-contracts/2296[forum post] for more information.\"},\"getRoleMemberCount(bytes32)\":{\"details\":\"Returns the number of accounts that have `role`. Can be used together with {getRoleMember} to enumerate all bearers of a role.\"},\"getUserNonce(address)\":{\"details\":\"Get user's current nonce\",\"params\":{\"user\":\"The user address\"},\"returns\":{\"_0\":\"Current nonce for the user\"}},\"grantRole(bytes32,address)\":{\"details\":\"Grants `role` to `account`. If `account` had not been already granted `role`, emits a {RoleGranted} event. Requirements: - the caller must have ``role``'s admin role. May emit a {RoleGranted} event.\"},\"hasRole(bytes32,address)\":{\"details\":\"Returns `true` if `account` has been granted `role`.\"},\"isPurposeUsed(address,uint256,bytes32)\":{\"details\":\"Check if a specific purpose has been used for a commit\",\"params\":{\"nonce\":\"The commit nonce\",\"purpose\":\"The purpose to check\",\"user\":\"The user address\"},\"returns\":{\"_0\":\"Whether this purpose has been used\"}},\"joinGameAsProxy(uint256,address)\":{\"details\":\"\\u4f9b\\u805a\\u5408\\u5668\\u8c03\\u7528\\u7684\\u4ee3\\u7406joinGame\\u65b9\\u6cd5\\uff0c\\u63a5\\u53d7\\u7528\\u6237\\u5730\\u5740\\u53c2\\u6570\"},\"renounceRole(bytes32,address)\":{\"details\":\"Revokes `role` from the calling account. Roles are often managed via {grantRole} and {revokeRole}: this function's purpose is to provide a mechanism for accounts to lose their privileges if they are compromised (such as when a trusted device is misplaced). If the calling account had been revoked `role`, emits a {RoleRevoked} event. Requirements: - the caller must be `account`. May emit a {RoleRevoked} event.\"},\"revealRandom(uint256,uint256,bytes32,bytes32)\":{\"details\":\"Reveal the committed randomness\",\"params\":{\"nonce\":\"The nonce from commit\",\"purpose\":\"The purpose this reveal is for\",\"randomValue\":\"The original random value\",\"salt\":\"The salt used in commitment\"},\"returns\":{\"_0\":\"The secure random value\"}},\"revokeRole(bytes32,address)\":{\"details\":\"Revokes `role` from `account`. If `account` had been granted `role`, emits a {RoleRevoked} event. Requirements: - the caller must have ``role``'s admin role. May emit a {RoleRevoked} event.\"},\"setLotteryRandomness(uint256,address,uint256)\":{\"details\":\"\\u8bbe\\u7f6e\\u62bd\\u5956\\u968f\\u673a\\u6570\"},\"submitScoreAsProxy(uint256,address,uint256,uint256,uint256,bytes)\":{\"details\":\"Proxy version of submitScore for aggregator contracts Allows GameAggregator to submit scores on behalf of trusted signer\"},\"supportsInterface(bytes4)\":{\"details\":\"See {IERC165-supportsInterface}.\"},\"updateContracts(address,address,address,address,address,address)\":{\"details\":\"\\u66f4\\u65b0\\u5408\\u7ea6\\u5730\\u5740\"},\"updatePoolConfig(uint8,uint256,uint256)\":{\"details\":\"\\u66f4\\u65b0\\u5956\\u6c60\\u914d\\u7f6e\"},\"withdrawNclabToken(uint256,address)\":{\"details\":\"\\u7ba1\\u7406\\u5458\\u63d0\\u53d6Nclab\\u4ee3\\u5e01\"},\"withdrawReservePool(uint256,address)\":{\"details\":\"\\u63d0\\u53d6\\u6ede\\u7559\\u8d44\\u91d1\\uff08dev\\u6536\\u76ca\\uff09\"},\"withdrawUsdToken(uint256,address)\":{\"details\":\"\\u7ba1\\u7406\\u5458\\u63d0\\u53d6USD\\u4ee3\\u5e01\"}},\"version\":1},\"userdoc\":{\"kind\":\"user\",\"methods\":{},\"version\":1}},\"settings\":{\"compilationTarget\":{\"src/core/SwordBattle.sol\":\"SwordBattle\"},\"evmVersion\":\"paris\",\"libraries\":{},\"metadata\":{\"bytecodeHash\":\"ipfs\"},\"optimizer\":{\"enabled\":true,\"runs\":200000},\"remappings\":[\":@openzeppelin/=lib/openzeppelin-contracts/\",\":ds-test/=lib/openzeppelin-contracts/lib/forge-std/lib/ds-test/src/\",\":erc4626-tests/=lib/openzeppelin-contracts/lib/erc4626-tests/\",\":forge-std/=lib/forge-std/src/\",\":openzeppelin-contracts/=lib/openzeppelin-contracts/\",\":openzeppelin/=lib/openzeppelin-contracts/contracts/\"],\"viaIR\":true},\"sources\":{\"lib/openzeppelin-contracts/contracts/access/AccessControl.sol\":{\"keccak256\":\"0x0dd6e52cb394d7f5abe5dca2d4908a6be40417914720932de757de34a99ab87f\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://dc117ce50ea746cab6b97ed1a1facee17a715ae0cb95d67b943dacbaf15176fb\",\"dweb:/ipfs/QmYRZ2UGNYwsHwfNu7Wjr8L2j1LBZ1mKv6NvbwgterYMXc\"]},\"lib/openzeppelin-contracts/contracts/access/AccessControlEnumerable.sol\":{\"keccak256\":\"0x13f5e15f2a0650c0b6aaee2ef19e89eaf4870d6e79662d572a393334c1397247\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://7ee05f28f549a5d6515e152580716b87636ed4bfab9812499a6e3803df88288b\",\"dweb:/ipfs/QmeEnhdwY1t5Y3YU5a4ffzgXuToydH2PNdNxV9W7dEPRQJ\"]},\"lib/openzeppelin-contracts/contracts/access/IAccessControl.sol\":{\"keccak256\":\"0x59ce320a585d7e1f163cd70390a0ef2ff9cec832e2aa544293a00692465a7a57\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://bb2c137c343ef0c4c7ce7b18c1d108afdc9d315a04e48307288d2d05adcbde3a\",\"dweb:/ipfs/QmUxhrAQM3MM3FF5j7AtcXLXguWCJBHJ14BRdVtuoQc8Fh\"]},\"lib/openzeppelin-contracts/contracts/access/IAccessControlEnumerable.sol\":{\"keccak256\":\"0xba4459ab871dfa300f5212c6c30178b63898c03533a1ede28436f11546626676\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://3dcc7b09bfa6e18aab262ca372f4a9b1fc82e294b430706a4e1378cf58e6a276\",\"dweb:/ipfs/QmT8oSAcesdctR15HMLhr2a1HRpXymxdjTfdtfTYJcj2N2\"]},\"lib/openzeppelin-contracts/contracts/security/Pausable.sol\":{\"keccak256\":\"0x0849d93b16c9940beb286a7864ed02724b248b93e0d80ef6355af5ef15c64773\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://4ddabb16009cd17eaca3143feadf450ac13e72919ebe2ca50e00f61cb78bc004\",\"dweb:/ipfs/QmSPwPxX7d6TTWakN5jy5wsaGkS1y9TW8fuhGSraMkLk2B\"]},\"lib/openzeppelin-contracts/contracts/security/ReentrancyGuard.sol\":{\"keccak256\":\"0xa535a5df777d44e945dd24aa43a11e44b024140fc340ad0dfe42acf4002aade1\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://41319e7f621f2dc3733511332c4fd032f8e32ad2aa7fd6f665c19741d9941a34\",\"dweb:/ipfs/QmcYR3bd862GD1Bc7jwrU9bGxrhUu5na1oP964bDCu2id1\"]},\"lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol\":{\"keccak256\":\"0x287b55befed2961a7eabd7d7b1b2839cbca8a5b80ef8dcbb25ed3d4c2002c305\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://bd39944e8fc06be6dbe2dd1d8449b5336e23c6a7ba3e8e9ae5ae0f37f35283f5\",\"dweb:/ipfs/QmPV3FGYjVwvKSgAXKUN3r9T9GwniZz83CxBpM7vyj2G53\"]},\"lib/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Permit.sol\":{\"keccak256\":\"0xec63854014a5b4f2b3290ab9103a21bdf902a508d0f41a8573fea49e98bf571a\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://bc5b5dc12fbc4002f282eaa7a5f06d8310ed62c1c77c5770f6283e058454c39a\",\"dweb:/ipfs/Qme9rE2wS3yBuyJq9GgbmzbsBQsW2M2sVFqYYLw7bosGrv\"]},\"lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol\":{\"keccak256\":\"0x909d608c2db6eb165ca178c81289a07ed2e118e444d0025b2a85c97d0b44a4fa\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://656cda26512ddd7373c2d5551c8fae759fc30f05b10f0fc2e738e9274199dbd4\",\"dweb:/ipfs/QmTSArSzQRFbQmHgq7U1PZXnsDFhvDZhKVu9CzMG4yo6Lx\"]},\"lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol\":{\"keccak256\":\"0x2c309e7df9e05e6ce15bedfe74f3c61b467fc37e0fae9eab496acf5ea0bbd7ff\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://7063b5c98711a98018ba4635ac74cee1c1cfa2ea01099498e062699ed9530005\",\"dweb:/ipfs/QmeJ8rGXkcv7RrqLdAW8PCXPAykxVsddfYY6g5NaTwmRFE\"]},\"lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol\":{\"keccak256\":\"0x5bce51e11f7d194b79ea59fe00c9e8de9fa2c5530124960f29a24d4c740a3266\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://7e66dfde185df46104c11bc89d08fa0760737aa59a2b8546a656473d810a8ea4\",\"dweb:/ipfs/QmXvyqtXPaPss2PD7eqPoSao5Szm2n6UMoiG8TZZDjmChR\"]},\"lib/openzeppelin-contracts/contracts/token/ERC721/IERC721Receiver.sol\":{\"keccak256\":\"0xa82b58eca1ee256be466e536706850163d2ec7821945abd6b4778cfb3bee37da\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://6e75cf83beb757b8855791088546b8337e9d4684e169400c20d44a515353b708\",\"dweb:/ipfs/QmYvPafLfoquiDMEj7CKHtvbgHu7TJNPSVPSCjrtjV8HjV\"]},\"lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol\":{\"keccak256\":\"0xa8796bd16014cefb8c26449413981a49c510f92a98d6828494f5fd046223ced3\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://63a5e0bb5a7d182e0d0eef87033f78115eab791de3626a929bc98c157087880a\",\"dweb:/ipfs/QmetkXAu2CJKS4qrZtEQPU8okAPwUwa6HL4XYwk8vrYMk8\"]},\"lib/openzeppelin-contracts/contracts/token/ERC721/extensions/IERC721Enumerable.sol\":{\"keccak256\":\"0xd1556954440b31c97a142c6ba07d5cade45f96fafd52091d33a14ebe365aecbf\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://26fef835622b46a5ba08b3ef6b46a22e94b5f285d0f0fb66b703bd30217d2c34\",\"dweb:/ipfs/QmZ548qdwfL1qF7aXz3xh1GCdTiST81kGGuKRqVUfYmPZR\"]},\"lib/openzeppelin-contracts/contracts/token/ERC721/extensions/IERC721Metadata.sol\":{\"keccak256\":\"0x75b829ff2f26c14355d1cba20e16fe7b29ca58eb5fef665ede48bc0f9c6c74b9\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://a0a107160525724f9e1bbbab031defc2f298296dd9e331f16a6f7130cec32146\",\"dweb:/ipfs/QmemujxSd7gX8A9M8UwmNbz4Ms3U9FG9QfudUgxwvTmPWf\"]},\"lib/openzeppelin-contracts/contracts/utils/Address.sol\":{\"keccak256\":\"0x006dd67219697fe68d7fbfdea512e7c4cb64a43565ed86171d67e844982da6fa\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://2455248c8ddd9cc6a7af76a13973cddf222072427e7b0e2a7d1aff345145e931\",\"dweb:/ipfs/QmfYjnjRbWqYpuxurqveE6HtzsY1Xx323J428AKQgtBJZm\"]},\"lib/openzeppelin-contracts/contracts/utils/Context.sol\":{\"keccak256\":\"0xe2e337e6dde9ef6b680e07338c493ebea1b5fd09b43424112868e9cc1706bca7\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://6df0ddf21ce9f58271bdfaa85cde98b200ef242a05a3f85c2bc10a8294800a92\",\"dweb:/ipfs/QmRK2Y5Yc6BK7tGKkgsgn3aJEQGi5aakeSPZvS65PV8Xp3\"]},\"lib/openzeppelin-contracts/contracts/utils/Strings.sol\":{\"keccak256\":\"0x3088eb2868e8d13d89d16670b5f8612c4ab9ff8956272837d8e90106c59c14a0\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://b81d9ff6559ea5c47fc573e17ece6d9ba5d6839e213e6ebc3b4c5c8fe4199d7f\",\"dweb:/ipfs/QmPCW1bFisUzJkyjroY3yipwfism9RRCigCcK1hbXtVM8n\"]},\"lib/openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol\":{\"keccak256\":\"0x809bc3edb4bcbef8263fa616c1b60ee0004b50a8a1bfa164d8f57fd31f520c58\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://8b93a1e39a4a19eba1600b92c96f435442db88cac91e315c8291547a2a7bcfe2\",\"dweb:/ipfs/QmTm34KVe6uZBZwq8dZDNWwPcm24qBJdxqL3rPxBJ4LrMv\"]},\"lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol\":{\"keccak256\":\"0xd10975de010d89fd1c78dc5e8a9a7e7f496198085c151648f20cba166b32582b\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://fb0048dee081f6fffa5f74afc3fb328483c2a30504e94a0ddd2a5114d731ec4d\",\"dweb:/ipfs/QmZptt1nmYoA5SgjwnSgWqgUSDgm4q52Yos3xhnMv3MV43\"]},\"lib/openzeppelin-contracts/contracts/utils/introspection/IERC165.sol\":{\"keccak256\":\"0x447a5f3ddc18419d41ff92b3773fb86471b1db25773e07f877f548918a185bf1\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://be161e54f24e5c6fae81a12db1a8ae87bc5ae1b0ddc805d82a1440a68455088f\",\"dweb:/ipfs/QmP7C3CHdY9urF4dEMb9wmsp1wMxHF6nhA2yQE5SKiPAdy\"]},\"lib/openzeppelin-contracts/contracts/utils/math/Math.sol\":{\"keccak256\":\"0xe4455ac1eb7fc497bb7402579e7b4d64d928b846fce7d2b6fde06d366f21c2b3\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://cc8841b3cd48ad125e2f46323c8bad3aa0e88e399ec62acb9e57efa7e7c8058c\",\"dweb:/ipfs/QmSqE4mXHA2BXW58deDbXE8MTcsL5JSKNDbm23sVQxRLPS\"]},\"lib/openzeppelin-contracts/contracts/utils/math/SignedMath.sol\":{\"keccak256\":\"0xf92515413956f529d95977adc9b0567d583c6203fc31ab1c23824c35187e3ddc\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://c50fcc459e49a9858b6d8ad5f911295cb7c9ab57567845a250bf0153f84a95c7\",\"dweb:/ipfs/QmcEW85JRzvDkQggxiBBLVAasXWdkhEysqypj9EaB6H2g6\"]},\"lib/openzeppelin-contracts/contracts/utils/structs/EnumerableSet.sol\":{\"keccak256\":\"0x9f4357008a8f7d8c8bf5d48902e789637538d8c016be5766610901b4bba81514\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://20bf19b2b851f58a4c24543de80ae70b3e08621f9230eb335dc75e2d4f43f5df\",\"dweb:/ipfs/QmSYuH1AhvJkPK8hNvoPqtExBcgTB42pPRHgTHkS5c5zYW\"]},\"src/abstracts/SecureRandomness.sol\":{\"keccak256\":\"0x75efd9846379b7004d8d296b5ec9cc063c6af40bfa65a8712e8a39c83e0c2135\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://da265648fde6c8a840bebec0ef70a7c60c502b5b7e21c737df4aef830b24c6d7\",\"dweb:/ipfs/Qmf3MTd8GrhaszA6VX2Jio6DYqzUpSguRFxY9kb3jfkFkx\"]},\"src/core/SwordBattle.sol\":{\"keccak256\":\"0x8bf2441cbc052da4d6fb9d42e2d7b2fe1752590f917b6b8673cf9879db7bdfcb\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://e62697075154ba3dceaa5bed557fa3f9a70bcef077461834f26b47caa7127671\",\"dweb:/ipfs/QmdfnhZQHu8TnHzo8mEQuFUbtBsF43gaMVqiQrcFSx84e2\"]},\"src/interfaces/IFragmentManager.sol\":{\"keccak256\":\"0x9f69df0aa7caa991bf3121d3ea3efff18147e5127d15b4a1e4f4f03ba4bf21ef\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://54a73312b9a655e778cb178bdb170b75d45f804dcda21527ecb3f258242dbdf2\",\"dweb:/ipfs/QmRbebpUxMws4Z549mTLfHkzhmVLM2tUAefkKZCu7c2P2x\"]},\"src/interfaces/IRandomnessService.sol\":{\"keccak256\":\"0x2207d9ba7c4d01aac257ff05e4217262c23c14d3700ab91a20affd6af8baf8a0\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://2400ed9dde7c0ef19f540f34df05a4e6b7e6d836dd6c632e744fd2cfa09df895\",\"dweb:/ipfs/QmcnQtWw734j8fwntWcfvbtDxKSPWnMRoWZe7Bx9gi2nWN\"]},\"src/interfaces/IRewardManager.sol\":{\"keccak256\":\"0x4fe880f90077c3fbc700a59bccccd9713fb1f50e3495e91f92c5808d2f28d484\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://1bed6403801e1c3e542bf54b53c470d53a21ef3a97a6489affdb3a3b5b17ebe3\",\"dweb:/ipfs/QmYW6XhiMCVGqb58sagTeP1qXJ88XY7i58VJ5KmAau1y5q\"]},\"src/interfaces/IShovelTraitManager.sol\":{\"keccak256\":\"0x8ae3b67c908f4aee23a647b00c3be876ecfc878f5ffad3e59f618948e2353718\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://b9da7a8a1c060ccb061c5d8e9532628b0518249263fa913be0968d0071c3ced9\",\"dweb:/ipfs/QmTgsJALzL8XSJtV98V9xuvPkjBa3osidqXFFrw29sq9Ts\"]},\"src/interfaces/ISwordBattle.sol\":{\"keccak256\":\"0x8db5848799985af49793c9df4963ab5069b80d7a4241cad6d50c6f2190d83bdd\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://141b8e49644155ec4b0ec42ee8a0a9c40209634c0eb7f66580882c6850b42b94\",\"dweb:/ipfs/QmY3J8SWpipeJLP9ZckdTmeUCBL4dvwD4bJXBn7WQYLrWe\"]},\"src/libraries/FundManagementLib.sol\":{\"keccak256\":\"0xe2499abb67102237265c3404db43210fefdc57c95b0dcc7bc9671dbcf593b3d5\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://eafccc7997005bb1b664cbe5d1b40ef322b2513dad0b425078be6fe348682f87\",\"dweb:/ipfs/QmQJunZcqrYiehusdDwXhisD2Uys3iwAU5nCWebxbW74P1\"]},\"src/libraries/RandomnessTypes.sol\":{\"keccak256\":\"0xf46c822edafd3da2747ea852183bedc755871a170e3c80a100146624fc24a800\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://54e4c992d44edad8abb1ae829db960c31b333944407bfcf0c963f40486a2f501\",\"dweb:/ipfs/QmeCbhxbyKRc7aCVf87uAR159KQrTfqFt8YgBbbmrYwb5t\"]},\"src/managers/GameConfigManager.sol\":{\"keccak256\":\"0x302fb2c5834d4b66f8aebdde85f1c559d53cf6a23d91885984bc0982142f2e8e\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://db17378d48a0c561bb7dd707a586ed647ba083b8079469fd28ba20f00530907c\",\"dweb:/ipfs/QmfTT4usjYgpCXUR9YspPK4BNwffCemfc3jRcsv2yjDX7W\"]},\"src/managers/GameRewardManager.sol\":{\"keccak256\":\"0xf38d4cfb16623d12313146caee7754e1d79c710cd44913683facee76772147b8\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://3562bb459b507e61fe67369d88a1698b5b833f9b2cd19875296985806994f08a\",\"dweb:/ipfs/QmdBocD5c4hwxuDW9bud2qjEkWDn5vU9HpLPxTf14aqgof\"]},\"src/nft/ForgeNFT.sol\":{\"keccak256\":\"0x1c60ab19023001f97735b65f79e576ccae24266fbfe2ad9825440f4b7fda658f\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://1ee64e17c3ba804ca69df90d07c2e2bfa8aad1baa7b4627b4f1062a966074afd\",\"dweb:/ipfs/QmSVenKUGfZsYgF8PL5dU9giQsMKqqDn7ky2iZTu9Rv7BG\"]},\"src/nft/ShovelNFTSlim.sol\":{\"keccak256\":\"0x069b5827ed1daca5efaf10d19433849e2b800856909e67ceefe3536a2f75b7a2\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://47fafb1ff230456b482116bda2679141e97fc4e0c4704e2ba0d6d435294b56fc\",\"dweb:/ipfs/QmemWU6kAHVtHdb3yWnobKaUokE9qPE1GVRVeJgrmqZCZF\"]},\"src/nft/ShovelSynthesizer.sol\":{\"keccak256\":\"0x202ad2c31cf95928849468bc602c34789cb12ac4787ab08cd0bed1b24013f25d\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://d0d132700c148705e2ed73e5a74bfc4036ddcb563f8dc0b6554466bfd8d52888\",\"dweb:/ipfs/QmVCqVYrShyqz7jTFctVvcF2JCWsa99ncRZBvpy9ADWUjP\"]}},\"version\":1}",
    "metadata": {
      "compiler": { "version": "0.8.18+commit.87f61d96" },
      "language": "Solidity",
      "output": {
        "abi": [
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_usd1Token",
                "type": "address"
              },
              { "internalType": "address", "name": "signer", "type": "address" },
              {
                "internalType": "address",
                "name": "_nclabToken",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "_shovelNFT",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "_forgeNFT",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "_fragmentManager",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "_rewardManager",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "_traitManager",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "_shovelSynthesizer",
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
                "internalType": "enum SwordBattle.GameLevel",
                "name": "level",
                "type": "uint8",
                "indexed": false
              },
              {
                "internalType": "uint256",
                "name": "entryFee",
                "type": "uint256",
                "indexed": false
              },
              {
                "internalType": "uint256",
                "name": "killReward",
                "type": "uint256",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "ConfigUpdated",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "player",
                "type": "address",
                "indexed": true
              },
              {
                "internalType": "uint256",
                "name": "gameId",
                "type": "uint256",
                "indexed": true
              },
              {
                "internalType": "uint64",
                "name": "extraFragments",
                "type": "uint64",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "FragmentBonus",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "admin",
                "type": "address",
                "indexed": true
              },
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "FundsWithdrawn",
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
            "name": "GameCleaned",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "gameId",
                "type": "uint256",
                "indexed": false
              },
              {
                "internalType": "enum SwordBattle.GameLevel",
                "name": "level",
                "type": "uint8",
                "indexed": false
              },
              {
                "internalType": "uint256",
                "name": "gameDuration",
                "type": "uint256",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "GameCreated",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "gameId",
                "type": "uint256",
                "indexed": true
              },
              {
                "internalType": "bool",
                "name": "autoEnded",
                "type": "bool",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "GameEnded",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "gameId",
                "type": "uint256",
                "indexed": false
              },
              {
                "internalType": "address",
                "name": "player",
                "type": "address",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "PlayerJoined",
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
                "internalType": "uint256",
                "name": "gameId",
                "type": "uint256",
                "indexed": true
              },
              {
                "internalType": "address",
                "name": "player",
                "type": "address",
                "indexed": true
              },
              {
                "internalType": "uint64",
                "name": "kills",
                "type": "uint64",
                "indexed": false
              },
              {
                "internalType": "uint64",
                "name": "score",
                "type": "uint64",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "ScoreSubmitted",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "player",
                "type": "address",
                "indexed": true
              },
              {
                "internalType": "uint256",
                "name": "newShovelId",
                "type": "uint256",
                "indexed": false
              },
              {
                "internalType": "uint8",
                "name": "fromTier",
                "type": "uint8",
                "indexed": false
              },
              {
                "internalType": "uint8",
                "name": "toTier",
                "type": "uint8",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "ShovelSynthesized",
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
            "name": "GAME_DURATION",
            "outputs": [
              { "internalType": "uint256", "name": "", "type": "uint256" }
            ]
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "MAX_PLAYERS_PER_GAME",
            "outputs": [
              { "internalType": "uint256", "name": "", "type": "uint256" }
            ]
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "SCORE_SUBMISSION_TYPE_HASH",
            "outputs": [
              { "internalType": "bytes32", "name": "", "type": "bytes32" }
            ]
          },
          {
            "inputs": [
              { "internalType": "uint256", "name": "gameId", "type": "uint256" }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "autoEndGame"
          },
          {
            "inputs": [
              {
                "internalType": "bytes32[]",
                "name": "commitments",
                "type": "bytes32[]"
              },
              {
                "internalType": "bytes32[]",
                "name": "purposes",
                "type": "bytes32[]"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "batchCommit",
            "outputs": [
              {
                "internalType": "uint256[]",
                "name": "nonces",
                "type": "uint256[]"
              }
            ]
          },
          {
            "inputs": [
              { "internalType": "uint256", "name": "gameId", "type": "uint256" }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "canAutoEndGame",
            "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }]
          },
          {
            "inputs": [
              { "internalType": "address", "name": "user", "type": "address" },
              { "internalType": "uint256", "name": "nonce", "type": "uint256" }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "canReveal",
            "outputs": [
              { "internalType": "bool", "name": "canRevealNow", "type": "bool" }
            ]
          },
          {
            "inputs": [
              { "internalType": "address", "name": "user", "type": "address" },
              {
                "internalType": "uint256[]",
                "name": "nonces",
                "type": "uint256[]"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "cleanupExpiredCommits"
          },
          {
            "inputs": [
              { "internalType": "uint256", "name": "gameId", "type": "uint256" }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "cleanupGame"
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
            "name": "cleanupGameBatch"
          },
          {
            "inputs": [
              {
                "internalType": "bytes32",
                "name": "commitment",
                "type": "bytes32"
              },
              { "internalType": "bytes32", "name": "purpose", "type": "bytes32" }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "commitRandom",
            "outputs": [
              { "internalType": "uint256", "name": "nonce", "type": "uint256" }
            ]
          },
          {
            "inputs": [
              { "internalType": "uint256", "name": "gameId", "type": "uint256" }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "conductLottery"
          },
          {
            "inputs": [
              {
                "internalType": "enum SwordBattle.GameLevel",
                "name": "level",
                "type": "uint8"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "createGame"
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "domainSeparator",
            "outputs": [
              { "internalType": "bytes32", "name": "", "type": "bytes32" }
            ]
          },
          {
            "inputs": [
              { "internalType": "address", "name": "to", "type": "address" }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "emergencyWithdrawAll"
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
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "forgeNFT",
            "outputs": [
              {
                "internalType": "contract ForgeNFT",
                "name": "",
                "type": "address"
              }
            ]
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "fragmentManager",
            "outputs": [
              {
                "internalType": "contract IFragmentManager",
                "name": "",
                "type": "address"
              }
            ]
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
            "name": "gameCounter",
            "outputs": [
              { "internalType": "uint256", "name": "", "type": "uint256" }
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
              { "internalType": "address", "name": "user", "type": "address" },
              { "internalType": "uint256", "name": "nonce", "type": "uint256" }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "getCommitInfo",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "blockNumber",
                "type": "uint256"
              },
              { "internalType": "bool", "name": "revealed", "type": "bool" },
              {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
              },
              {
                "internalType": "bytes32",
                "name": "commitPurpose",
                "type": "bytes32"
              }
            ]
          },
          {
            "inputs": [
              { "internalType": "uint256", "name": "gameId", "type": "uint256" }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "getGameDuration",
            "outputs": [
              { "internalType": "uint256", "name": "duration", "type": "uint256" }
            ]
          },
          {
            "inputs": [
              { "internalType": "uint256", "name": "gameId", "type": "uint256" }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "getGameInfo",
            "outputs": [
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
              { "internalType": "uint256", "name": "endedAt", "type": "uint256" },
              {
                "internalType": "enum SwordBattle.GameLevel",
                "name": "level",
                "type": "uint8"
              },
              { "internalType": "bool", "name": "ended", "type": "bool" },
              { "internalType": "bool", "name": "cleaned", "type": "bool" },
              {
                "internalType": "uint256",
                "name": "playerCount",
                "type": "uint256"
              }
            ]
          },
          {
            "inputs": [
              { "internalType": "uint256", "name": "gameId", "type": "uint256" }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "getGamePlayerScores",
            "outputs": [
              {
                "internalType": "address[]",
                "name": "players",
                "type": "address[]"
              },
              {
                "internalType": "uint256[]",
                "name": "scores",
                "type": "uint256[]"
              }
            ]
          },
          {
            "inputs": [
              { "internalType": "uint256", "name": "gameId", "type": "uint256" }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "getGamePlayers",
            "outputs": [
              { "internalType": "address[]", "name": "", "type": "address[]" }
            ]
          },
          {
            "inputs": [
              { "internalType": "uint256", "name": "gameId", "type": "uint256" },
              { "internalType": "address", "name": "player", "type": "address" }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "getPlayerInfo",
            "outputs": [
              {
                "internalType": "address",
                "name": "playerAddr",
                "type": "address"
              },
              { "internalType": "uint256", "name": "kills", "type": "uint256" },
              { "internalType": "uint256", "name": "score", "type": "uint256" },
              { "internalType": "bool", "name": "submitted", "type": "bool" },
              {
                "internalType": "uint256",
                "name": "fragmentReward",
                "type": "uint256"
              }
            ]
          },
          {
            "inputs": [
              { "internalType": "address", "name": "player", "type": "address" }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "getPlayerNonce",
            "outputs": [
              { "internalType": "uint256", "name": "", "type": "uint256" }
            ]
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "getReservePool",
            "outputs": [
              { "internalType": "uint256", "name": "", "type": "uint256" }
            ]
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "getReservePoolDetails",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "totalReserve",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "totalRewardsPending",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "availableForWithdraw",
                "type": "uint256"
              }
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
            "inputs": [
              { "internalType": "bytes32", "name": "role", "type": "bytes32" },
              { "internalType": "uint256", "name": "index", "type": "uint256" }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "getRoleMember",
            "outputs": [
              { "internalType": "address", "name": "", "type": "address" }
            ]
          },
          {
            "inputs": [
              { "internalType": "bytes32", "name": "role", "type": "bytes32" }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "getRoleMemberCount",
            "outputs": [
              { "internalType": "uint256", "name": "", "type": "uint256" }
            ]
          },
          {
            "inputs": [
              { "internalType": "address", "name": "user", "type": "address" }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "getUserNonce",
            "outputs": [
              { "internalType": "uint256", "name": "", "type": "uint256" }
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
            "stateMutability": "view",
            "type": "function",
            "name": "isGameExpired",
            "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }]
          },
          {
            "inputs": [
              { "internalType": "address", "name": "user", "type": "address" },
              { "internalType": "uint256", "name": "nonce", "type": "uint256" },
              { "internalType": "bytes32", "name": "purpose", "type": "bytes32" }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "isPurposeUsed",
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
              { "internalType": "uint256", "name": "gameId", "type": "uint256" },
              { "internalType": "address", "name": "user", "type": "address" }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "joinGameAsProxy"
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "nclabToken",
            "outputs": [
              { "internalType": "contract IERC20", "name": "", "type": "address" }
            ]
          },
          {
            "inputs": [
              { "internalType": "address", "name": "", "type": "address" }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "playerNonces",
            "outputs": [
              { "internalType": "uint256", "name": "", "type": "uint256" }
            ]
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
              { "internalType": "uint256", "name": "nonce", "type": "uint256" },
              {
                "internalType": "uint256",
                "name": "randomValue",
                "type": "uint256"
              },
              { "internalType": "bytes32", "name": "salt", "type": "bytes32" },
              { "internalType": "bytes32", "name": "purpose", "type": "bytes32" }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "revealRandom",
            "outputs": [
              { "internalType": "uint256", "name": "", "type": "uint256" }
            ]
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
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "rewardManager",
            "outputs": [
              {
                "internalType": "contract IRewardManager",
                "name": "",
                "type": "address"
              }
            ]
          },
          {
            "inputs": [
              { "internalType": "uint256", "name": "gameId", "type": "uint256" },
              {
                "internalType": "address",
                "name": "committer",
                "type": "address"
              },
              { "internalType": "uint256", "name": "nonce", "type": "uint256" }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "setLotteryRandomness"
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "shovelNFT",
            "outputs": [
              {
                "internalType": "contract ShovelNFTSlim",
                "name": "",
                "type": "address"
              }
            ]
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "shovelSynthesizer",
            "outputs": [
              {
                "internalType": "contract ShovelSynthesizer",
                "name": "",
                "type": "address"
              }
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
              { "internalType": "uint256", "name": "gameId", "type": "uint256" },
              { "internalType": "address", "name": "player", "type": "address" },
              { "internalType": "uint256", "name": "kills", "type": "uint256" },
              { "internalType": "uint256", "name": "score", "type": "uint256" },
              { "internalType": "uint256", "name": "nonce", "type": "uint256" },
              { "internalType": "bytes", "name": "signature", "type": "bytes" }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "submitScoreAsProxy"
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
            "name": "traitManager",
            "outputs": [
              {
                "internalType": "contract IShovelTraitManager",
                "name": "",
                "type": "address"
              }
            ]
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "trustedSigner",
            "outputs": [
              { "internalType": "address", "name": "", "type": "address" }
            ]
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_nclabToken",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "_shovelNFT",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "_forgeNFT",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "_fragmentManager",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "_rewardManager",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "_traitManager",
                "type": "address"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "updateContracts"
          },
          {
            "inputs": [
              {
                "internalType": "enum SwordBattle.GameLevel",
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
            "name": "updateLevelConfig"
          },
          {
            "inputs": [
              {
                "internalType": "enum SwordBattle.GameLevel",
                "name": "level",
                "type": "uint8"
              },
              {
                "internalType": "uint256",
                "name": "killPercent",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "survivalPercent",
                "type": "uint256"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "updatePoolConfig"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "newSigner",
                "type": "address"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "updateSigner"
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "usd1Token",
            "outputs": [
              { "internalType": "contract IERC20", "name": "", "type": "address" }
            ]
          },
          {
            "inputs": [
              { "internalType": "uint256", "name": "amount", "type": "uint256" },
              { "internalType": "address", "name": "to", "type": "address" }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "withdrawNclabToken"
          },
          {
            "inputs": [
              { "internalType": "uint256", "name": "amount", "type": "uint256" },
              { "internalType": "address", "name": "to", "type": "address" }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "withdrawReservePool"
          },
          {
            "inputs": [
              { "internalType": "uint256", "name": "amount", "type": "uint256" },
              { "internalType": "address", "name": "to", "type": "address" }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "withdrawUsdToken"
          }
        ],
        "devdoc": {
          "kind": "dev",
          "methods": {
            "batchCommit(bytes32[],bytes32[])": {
              "details": "Batch commit multiple randomness values",
              "params": {
                "commitments": "Array of commitment hashes",
                "purposes": "Array of purposes for each commitment"
              },
              "returns": { "nonces": "Array of nonces for the commits" }
            },
            "canReveal(address,uint256)": {
              "details": "Check if randomness can be revealed",
              "params": {
                "nonce": "The commit nonce",
                "user": "The user address"
              },
              "returns": {
                "canRevealNow": "Whether the commit can be revealed now"
              }
            },
            "cleanupExpiredCommits(address,uint256[])": {
              "details": "Clean up expired or used commits to save storage",
              "params": {
                "nonces": "Array of nonces to clean",
                "user": "The user whose commits to clean"
              }
            },
            "commitRandom(bytes32,bytes32)": {
              "details": "Commit a randomness hash for a specific purpose",
              "params": {
                "commitment": "keccak256(abi.encodePacked(randomValue, salt))",
                "purpose": "The intended use of this randomness"
              },
              "returns": { "nonce": "The nonce for this commit" }
            },
            "conductLottery(uint256)": {
              "details": "进行抽奖 - 代理到RewardManager"
            },
            "emergencyWithdrawAll(address)": { "details": "紧急提取所有代币" },
            "getCommitInfo(address,uint256)": {
              "details": "Get commit information",
              "params": {
                "nonce": "The commit nonce",
                "user": "The user address"
              },
              "returns": {
                "blockNumber": "Block when committed",
                "commitPurpose": "The purpose committed for",
                "deadline": "Reveal deadline",
                "revealed": "Whether revealed"
              }
            },
            "getReservePool()": { "details": "获取滞留资金总额" },
            "getReservePoolDetails()": { "details": "获取滞留资金详细信息" },
            "getRoleAdmin(bytes32)": {
              "details": "Returns the admin role that controls `role`. See {grantRole} and {revokeRole}. To change a role's admin, use {_setRoleAdmin}."
            },
            "getRoleMember(bytes32,uint256)": {
              "details": "Returns one of the accounts that have `role`. `index` must be a value between 0 and {getRoleMemberCount}, non-inclusive. Role bearers are not sorted in any particular way, and their ordering may change at any point. WARNING: When using {getRoleMember} and {getRoleMemberCount}, make sure you perform all queries on the same block. See the following https://forum.openzeppelin.com/t/iterating-over-elements-on-enumerableset-in-openzeppelin-contracts/2296[forum post] for more information."
            },
            "getRoleMemberCount(bytes32)": {
              "details": "Returns the number of accounts that have `role`. Can be used together with {getRoleMember} to enumerate all bearers of a role."
            },
            "getUserNonce(address)": {
              "details": "Get user's current nonce",
              "params": { "user": "The user address" },
              "returns": { "_0": "Current nonce for the user" }
            },
            "grantRole(bytes32,address)": {
              "details": "Grants `role` to `account`. If `account` had not been already granted `role`, emits a {RoleGranted} event. Requirements: - the caller must have ``role``'s admin role. May emit a {RoleGranted} event."
            },
            "hasRole(bytes32,address)": {
              "details": "Returns `true` if `account` has been granted `role`."
            },
            "isPurposeUsed(address,uint256,bytes32)": {
              "details": "Check if a specific purpose has been used for a commit",
              "params": {
                "nonce": "The commit nonce",
                "purpose": "The purpose to check",
                "user": "The user address"
              },
              "returns": { "_0": "Whether this purpose has been used" }
            },
            "joinGameAsProxy(uint256,address)": {
              "details": "供聚合器调用的代理joinGame方法，接受用户地址参数"
            },
            "renounceRole(bytes32,address)": {
              "details": "Revokes `role` from the calling account. Roles are often managed via {grantRole} and {revokeRole}: this function's purpose is to provide a mechanism for accounts to lose their privileges if they are compromised (such as when a trusted device is misplaced). If the calling account had been revoked `role`, emits a {RoleRevoked} event. Requirements: - the caller must be `account`. May emit a {RoleRevoked} event."
            },
            "revealRandom(uint256,uint256,bytes32,bytes32)": {
              "details": "Reveal the committed randomness",
              "params": {
                "nonce": "The nonce from commit",
                "purpose": "The purpose this reveal is for",
                "randomValue": "The original random value",
                "salt": "The salt used in commitment"
              },
              "returns": { "_0": "The secure random value" }
            },
            "revokeRole(bytes32,address)": {
              "details": "Revokes `role` from `account`. If `account` had been granted `role`, emits a {RoleRevoked} event. Requirements: - the caller must have ``role``'s admin role. May emit a {RoleRevoked} event."
            },
            "setLotteryRandomness(uint256,address,uint256)": {
              "details": "设置抽奖随机数"
            },
            "submitScoreAsProxy(uint256,address,uint256,uint256,uint256,bytes)": {
              "details": "Proxy version of submitScore for aggregator contracts Allows GameAggregator to submit scores on behalf of trusted signer"
            },
            "supportsInterface(bytes4)": {
              "details": "See {IERC165-supportsInterface}."
            },
            "updateContracts(address,address,address,address,address,address)": {
              "details": "更新合约地址"
            },
            "updatePoolConfig(uint8,uint256,uint256)": {
              "details": "更新奖池配置"
            },
            "withdrawNclabToken(uint256,address)": {
              "details": "管理员提取Nclab代币"
            },
            "withdrawReservePool(uint256,address)": {
              "details": "提取滞留资金（dev收益）"
            },
            "withdrawUsdToken(uint256,address)": {
              "details": "管理员提取USD代币"
            }
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
        "compilationTarget": { "src/core/SwordBattle.sol": "SwordBattle" },
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
    "id": 48
  }
];

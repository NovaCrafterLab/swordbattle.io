export const SWORD_BATTLE_ABI = [
  {
    abi: [
      {
        type: 'constructor',
        inputs: [
          { name: '_usd1Token', type: 'address', internalType: 'address' },
          { name: 'signer', type: 'address', internalType: 'address' },
          { name: '_nclabToken', type: 'address', internalType: 'address' },
          { name: '_shovelNFT', type: 'address', internalType: 'address' },
          { name: '_forgeNFT', type: 'address', internalType: 'address' },
          {
            name: '_fragmentManager',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_rewardManager',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_traitManager',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_shovelSynthesizer',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_gameConfigManager',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_gameRewardManager',
            type: 'address',
            internalType: 'address',
          },
        ],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'ADMIN_ROLE',
        inputs: [],
        outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'DEFAULT_ADMIN_ROLE',
        inputs: [],
        outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'GAME_DURATION',
        inputs: [],
        outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'MAX_PLAYERS_PER_GAME',
        inputs: [],
        outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'SCORE_SUBMISSION_TYPE_HASH',
        inputs: [],
        outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'autoEndGame',
        inputs: [{ name: 'gameId', type: 'uint256', internalType: 'uint256' }],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'batchCommit',
        inputs: [
          {
            name: 'commitments',
            type: 'bytes32[]',
            internalType: 'bytes32[]',
          },
          { name: 'purposes', type: 'bytes32[]', internalType: 'bytes32[]' },
        ],
        outputs: [
          { name: 'nonces', type: 'uint256[]', internalType: 'uint256[]' },
        ],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'canAutoEndGame',
        inputs: [{ name: 'gameId', type: 'uint256', internalType: 'uint256' }],
        outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'canReveal',
        inputs: [
          { name: 'user', type: 'address', internalType: 'address' },
          { name: 'nonce', type: 'uint256', internalType: 'uint256' },
        ],
        outputs: [{ name: 'canRevealNow', type: 'bool', internalType: 'bool' }],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'cleanupExpiredCommits',
        inputs: [
          { name: 'user', type: 'address', internalType: 'address' },
          { name: 'nonces', type: 'uint256[]', internalType: 'uint256[]' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'cleanupGame',
        inputs: [{ name: 'gameId', type: 'uint256', internalType: 'uint256' }],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'cleanupGameBatch',
        inputs: [
          { name: 'gameIds', type: 'uint256[]', internalType: 'uint256[]' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'commitRandom',
        inputs: [
          { name: 'commitment', type: 'bytes32', internalType: 'bytes32' },
          { name: 'purpose', type: 'bytes32', internalType: 'bytes32' },
        ],
        outputs: [{ name: 'nonce', type: 'uint256', internalType: 'uint256' }],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'conductLottery',
        inputs: [{ name: 'gameId', type: 'uint256', internalType: 'uint256' }],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'createGame',
        inputs: [
          {
            name: 'level',
            type: 'uint8',
            internalType: 'enum SwordBattle.GameLevel',
          },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'domainSeparator',
        inputs: [],
        outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'emergencyWithdrawAll',
        inputs: [{ name: 'to', type: 'address', internalType: 'address' }],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'endGame',
        inputs: [{ name: 'gameId', type: 'uint256', internalType: 'uint256' }],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'forgeNFT',
        inputs: [],
        outputs: [
          { name: '', type: 'address', internalType: 'contract ForgeNFT' },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'fragmentManager',
        inputs: [],
        outputs: [
          {
            name: '',
            type: 'address',
            internalType: 'contract IFragmentManager',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'gameConfigManager',
        inputs: [],
        outputs: [
          {
            name: '',
            type: 'address',
            internalType: 'contract GameConfigManager',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'gameCounter',
        inputs: [],
        outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'gameRewardManager',
        inputs: [],
        outputs: [
          {
            name: '',
            type: 'address',
            internalType: 'contract GameRewardManager',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'getCommitInfo',
        inputs: [
          { name: 'user', type: 'address', internalType: 'address' },
          { name: 'nonce', type: 'uint256', internalType: 'uint256' },
        ],
        outputs: [
          { name: 'blockNumber', type: 'uint256', internalType: 'uint256' },
          { name: 'revealed', type: 'bool', internalType: 'bool' },
          { name: 'deadline', type: 'uint256', internalType: 'uint256' },
          {
            name: 'commitPurpose',
            type: 'bytes32',
            internalType: 'bytes32',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'getGameDuration',
        inputs: [{ name: 'gameId', type: 'uint256', internalType: 'uint256' }],
        outputs: [
          { name: 'duration', type: 'uint256', internalType: 'uint256' },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'getGameInfo',
        inputs: [{ name: 'gameId', type: 'uint256', internalType: 'uint256' }],
        outputs: [
          { name: 'totalPool', type: 'uint256', internalType: 'uint256' },
          { name: 'createdAt', type: 'uint256', internalType: 'uint256' },
          { name: 'endedAt', type: 'uint256', internalType: 'uint256' },
          {
            name: 'level',
            type: 'uint8',
            internalType: 'enum SwordBattle.GameLevel',
          },
          { name: 'ended', type: 'bool', internalType: 'bool' },
          { name: 'cleaned', type: 'bool', internalType: 'bool' },
          { name: 'playerCount', type: 'uint256', internalType: 'uint256' },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'getGamePlayerScores',
        inputs: [{ name: 'gameId', type: 'uint256', internalType: 'uint256' }],
        outputs: [
          { name: 'players', type: 'address[]', internalType: 'address[]' },
          { name: 'scores', type: 'uint256[]', internalType: 'uint256[]' },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'getGamePlayers',
        inputs: [{ name: 'gameId', type: 'uint256', internalType: 'uint256' }],
        outputs: [{ name: '', type: 'address[]', internalType: 'address[]' }],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'getPlayerInfo',
        inputs: [
          { name: 'gameId', type: 'uint256', internalType: 'uint256' },
          { name: 'player', type: 'address', internalType: 'address' },
        ],
        outputs: [
          { name: 'playerAddr', type: 'address', internalType: 'address' },
          { name: 'kills', type: 'uint256', internalType: 'uint256' },
          { name: 'score', type: 'uint256', internalType: 'uint256' },
          { name: 'submitted', type: 'bool', internalType: 'bool' },
          {
            name: 'fragmentReward',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'getPlayerNonce',
        inputs: [{ name: 'player', type: 'address', internalType: 'address' }],
        outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'getReservePool',
        inputs: [],
        outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'getReservePoolDetails',
        inputs: [],
        outputs: [
          {
            name: 'totalReserve',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'totalRewardsPending',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'availableForWithdraw',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'getRoleAdmin',
        inputs: [{ name: 'role', type: 'bytes32', internalType: 'bytes32' }],
        outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'getRoleMember',
        inputs: [
          { name: 'role', type: 'bytes32', internalType: 'bytes32' },
          { name: 'index', type: 'uint256', internalType: 'uint256' },
        ],
        outputs: [{ name: '', type: 'address', internalType: 'address' }],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'getRoleMemberCount',
        inputs: [{ name: 'role', type: 'bytes32', internalType: 'bytes32' }],
        outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'getUserNonce',
        inputs: [{ name: 'user', type: 'address', internalType: 'address' }],
        outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'grantRole',
        inputs: [
          { name: 'role', type: 'bytes32', internalType: 'bytes32' },
          { name: 'account', type: 'address', internalType: 'address' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'hasRole',
        inputs: [
          { name: 'role', type: 'bytes32', internalType: 'bytes32' },
          { name: 'account', type: 'address', internalType: 'address' },
        ],
        outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'isGameExpired',
        inputs: [{ name: 'gameId', type: 'uint256', internalType: 'uint256' }],
        outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'isPurposeUsed',
        inputs: [
          { name: 'user', type: 'address', internalType: 'address' },
          { name: 'nonce', type: 'uint256', internalType: 'uint256' },
          { name: 'purpose', type: 'bytes32', internalType: 'bytes32' },
        ],
        outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'joinGame',
        inputs: [{ name: 'gameId', type: 'uint256', internalType: 'uint256' }],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'nclabToken',
        inputs: [],
        outputs: [
          { name: '', type: 'address', internalType: 'contract IERC20' },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'playerNonces',
        inputs: [{ name: '', type: 'address', internalType: 'address' }],
        outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'renounceRole',
        inputs: [
          { name: 'role', type: 'bytes32', internalType: 'bytes32' },
          { name: 'account', type: 'address', internalType: 'address' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'revealRandom',
        inputs: [
          { name: 'nonce', type: 'uint256', internalType: 'uint256' },
          { name: 'randomValue', type: 'uint256', internalType: 'uint256' },
          { name: 'salt', type: 'bytes32', internalType: 'bytes32' },
          { name: 'purpose', type: 'bytes32', internalType: 'bytes32' },
        ],
        outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'revokeRole',
        inputs: [
          { name: 'role', type: 'bytes32', internalType: 'bytes32' },
          { name: 'account', type: 'address', internalType: 'address' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'rewardManager',
        inputs: [],
        outputs: [
          {
            name: '',
            type: 'address',
            internalType: 'contract IRewardManager',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'setLotteryRandomness',
        inputs: [
          { name: 'gameId', type: 'uint256', internalType: 'uint256' },
          { name: 'committer', type: 'address', internalType: 'address' },
          { name: 'nonce', type: 'uint256', internalType: 'uint256' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'shovelNFT',
        inputs: [],
        outputs: [
          {
            name: '',
            type: 'address',
            internalType: 'contract ShovelNFTSlim',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'shovelSynthesizer',
        inputs: [],
        outputs: [
          {
            name: '',
            type: 'address',
            internalType: 'contract ShovelSynthesizer',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'submitScore',
        inputs: [
          { name: 'gameId', type: 'uint256', internalType: 'uint256' },
          { name: 'player', type: 'address', internalType: 'address' },
          { name: 'kills', type: 'uint256', internalType: 'uint256' },
          { name: 'score', type: 'uint256', internalType: 'uint256' },
          { name: 'nonce', type: 'uint256', internalType: 'uint256' },
          { name: 'signature', type: 'bytes', internalType: 'bytes' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'supportsInterface',
        inputs: [
          { name: 'interfaceId', type: 'bytes4', internalType: 'bytes4' },
        ],
        outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'traitManager',
        inputs: [],
        outputs: [
          {
            name: '',
            type: 'address',
            internalType: 'contract IShovelTraitManager',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'trustedSigner',
        inputs: [],
        outputs: [{ name: '', type: 'address', internalType: 'address' }],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'updateContracts',
        inputs: [
          { name: '_nclabToken', type: 'address', internalType: 'address' },
          { name: '_shovelNFT', type: 'address', internalType: 'address' },
          { name: '_forgeNFT', type: 'address', internalType: 'address' },
          {
            name: '_fragmentManager',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_rewardManager',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_traitManager',
            type: 'address',
            internalType: 'address',
          },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'updateLevelConfig',
        inputs: [
          {
            name: 'level',
            type: 'uint8',
            internalType: 'enum SwordBattle.GameLevel',
          },
          { name: 'entryFee', type: 'uint256', internalType: 'uint256' },
          { name: 'killReward', type: 'uint256', internalType: 'uint256' },
          { name: 'active', type: 'bool', internalType: 'bool' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'updatePoolConfig',
        inputs: [
          {
            name: 'level',
            type: 'uint8',
            internalType: 'enum SwordBattle.GameLevel',
          },
          { name: 'killPercent', type: 'uint256', internalType: 'uint256' },
          {
            name: 'survivalPercent',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'updateSigner',
        inputs: [
          { name: 'newSigner', type: 'address', internalType: 'address' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'usd1Token',
        inputs: [],
        outputs: [
          { name: '', type: 'address', internalType: 'contract IERC20' },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'withdrawNclabToken',
        inputs: [
          { name: 'amount', type: 'uint256', internalType: 'uint256' },
          { name: 'to', type: 'address', internalType: 'address' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'withdrawReservePool',
        inputs: [
          { name: 'amount', type: 'uint256', internalType: 'uint256' },
          { name: 'to', type: 'address', internalType: 'address' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'withdrawUsdToken',
        inputs: [
          { name: 'amount', type: 'uint256', internalType: 'uint256' },
          { name: 'to', type: 'address', internalType: 'address' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'event',
        name: 'ConfigUpdated',
        inputs: [
          {
            name: 'level',
            type: 'uint8',
            indexed: false,
            internalType: 'enum SwordBattle.GameLevel',
          },
          {
            name: 'entryFee',
            type: 'uint256',
            indexed: false,
            internalType: 'uint256',
          },
          {
            name: 'killReward',
            type: 'uint256',
            indexed: false,
            internalType: 'uint256',
          },
        ],
        anonymous: false,
      },
      {
        type: 'event',
        name: 'FragmentBonus',
        inputs: [
          {
            name: 'player',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'gameId',
            type: 'uint256',
            indexed: true,
            internalType: 'uint256',
          },
          {
            name: 'extraFragments',
            type: 'uint64',
            indexed: false,
            internalType: 'uint64',
          },
        ],
        anonymous: false,
      },
      {
        type: 'event',
        name: 'FundsWithdrawn',
        inputs: [
          {
            name: 'admin',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'amount',
            type: 'uint256',
            indexed: false,
            internalType: 'uint256',
          },
        ],
        anonymous: false,
      },
      {
        type: 'event',
        name: 'GameCleaned',
        inputs: [
          {
            name: 'gameId',
            type: 'uint256',
            indexed: true,
            internalType: 'uint256',
          },
        ],
        anonymous: false,
      },
      {
        type: 'event',
        name: 'GameCreated',
        inputs: [
          {
            name: 'gameId',
            type: 'uint256',
            indexed: false,
            internalType: 'uint256',
          },
          {
            name: 'level',
            type: 'uint8',
            indexed: false,
            internalType: 'enum SwordBattle.GameLevel',
          },
          {
            name: 'gameDuration',
            type: 'uint256',
            indexed: false,
            internalType: 'uint256',
          },
        ],
        anonymous: false,
      },
      {
        type: 'event',
        name: 'GameEnded',
        inputs: [
          {
            name: 'gameId',
            type: 'uint256',
            indexed: true,
            internalType: 'uint256',
          },
          {
            name: 'autoEnded',
            type: 'bool',
            indexed: false,
            internalType: 'bool',
          },
        ],
        anonymous: false,
      },
      {
        type: 'event',
        name: 'PlayerJoined',
        inputs: [
          {
            name: 'gameId',
            type: 'uint256',
            indexed: false,
            internalType: 'uint256',
          },
          {
            name: 'player',
            type: 'address',
            indexed: false,
            internalType: 'address',
          },
        ],
        anonymous: false,
      },
      {
        type: 'event',
        name: 'RoleAdminChanged',
        inputs: [
          {
            name: 'role',
            type: 'bytes32',
            indexed: true,
            internalType: 'bytes32',
          },
          {
            name: 'previousAdminRole',
            type: 'bytes32',
            indexed: true,
            internalType: 'bytes32',
          },
          {
            name: 'newAdminRole',
            type: 'bytes32',
            indexed: true,
            internalType: 'bytes32',
          },
        ],
        anonymous: false,
      },
      {
        type: 'event',
        name: 'RoleGranted',
        inputs: [
          {
            name: 'role',
            type: 'bytes32',
            indexed: true,
            internalType: 'bytes32',
          },
          {
            name: 'account',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'sender',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
        ],
        anonymous: false,
      },
      {
        type: 'event',
        name: 'RoleRevoked',
        inputs: [
          {
            name: 'role',
            type: 'bytes32',
            indexed: true,
            internalType: 'bytes32',
          },
          {
            name: 'account',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'sender',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
        ],
        anonymous: false,
      },
      {
        type: 'event',
        name: 'ScoreSubmitted',
        inputs: [
          {
            name: 'gameId',
            type: 'uint256',
            indexed: true,
            internalType: 'uint256',
          },
          {
            name: 'player',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'kills',
            type: 'uint64',
            indexed: false,
            internalType: 'uint64',
          },
          {
            name: 'score',
            type: 'uint64',
            indexed: false,
            internalType: 'uint64',
          },
        ],
        anonymous: false,
      },
      {
        type: 'event',
        name: 'ShovelSynthesized',
        inputs: [
          {
            name: 'player',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          {
            name: 'newShovelId',
            type: 'uint256',
            indexed: false,
            internalType: 'uint256',
          },
          {
            name: 'fromTier',
            type: 'uint8',
            indexed: false,
            internalType: 'uint8',
          },
          {
            name: 'toTier',
            type: 'uint8',
            indexed: false,
            internalType: 'uint8',
          },
        ],
        anonymous: false,
      },
    ],
    bytecode: {
      object:
        '0x60a0346200033757601f62005aef38819003918201601f19168301926001600160401b03929091838511838610176200032157816101609284926040978852833981010312620003375762000054816200033c565b90602091620000658383016200033c565b91620000738682016200033c565b62000081606083016200033c565b6200008f608084016200033c565b6200009d60a085016200033c565b620000ab60c086016200033c565b91620000ba60e087016200033c565b93620000ca61010088016200033c565b95620000e9610140620000e16101208b016200033c565b99016200033c565b9860016002558d80518d81019142835244908201523360601b60608201523060601b60748201526068815260a081019e8f9082821091111762000321579d8f529c51909c206005556001600160a01b039b8c16608052600880546001600160a01b0319908116928e16929092179055600980548216928d1692909217909155600a80548216928c1692909217909155600b80548216928b1692909217909155600c80548216928a1692909217909155600d8054821692891692909217909155600e80548216928816929092179091556006805482169287169290921790915560078054821692861692909217909155600f8054909116919093161790915560006010819055808052808252828120338252825282812054620002719260019160ff1615620002ea575b828052818152620002263386852062000351565b507fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775808452838252858420338552825260ff868520541615620002b3575b8352528233912062000351565b50516156f09081620003df823960805181818161033601528181610790015281816118df015281816127ed015281816128df015281816137ec0152613a570152f35b80845283825285842033855282528584208360ff1982541617905533338260008051602062005acf8339815191528780a462000264565b82805282815284832033845281528483208260ff1982541617905533338460008051602062005acf8339815191528180a462000212565b634e487b7160e01b600052604160045260246000fd5b600080fd5b51906001600160a01b03821682036200033757565b91906001830160009082825280602052604082205415600014620003d85784549468010000000000000000861015620003c45760018601808255861015620003b057836040949596828552602085200155549382526020522055600190565b634e487b7160e01b83526032600452602483fd5b634e487b7160e01b83526041600452602483fd5b5092505056fe608080604052600436101561001357600080fd5b600090813560e01c90816301ffc9a7146143b55750806302e06cc81461430a5780630f42d191146142905780630f4ef8a61461423e5780631004ff611461412357806315a40f49146140b257806317723e8714614060578063185f31b01461402657806319ead6fa146131025780631b94770714613fa7578063248a9ca314613f5d57806325cb9e5114613f0b5780632e0be39a14613ecf5780632e15f1b714613e7d5780632f2ff15d14613d7457806336568abe14613c8f578063371665b014613c3d5780633ccd10e914613b8b57806347e1d55014613ae85780634efd374914613a9657806354ab6269146139ab578063599706d01461386257806359c1303f1461381057806361412fbc146137a157806361c3ddfa1461335e5780636388607c1461330c57806365b3a7ca146132a95780636834e3a814613246578063686a978c1461316557806368efccbb14613102578063718072e514612a8b57806375b238fc14612a325780637cf4c4cd146129265780638391a665146128455780638cce2d47146127535780639010d07c146126e357806391d148541461266c57806392bf9248146125325780639d8df9ee146123c8578063a217fddf1461238e578063a3dac2de14611fab578063a7ecd37e14611f29578063b2040f2014611e31578063b622c03414611d20578063b6d4d64b14611c8a578063b753204d14611aec578063c31b29ce14611ab1578063c60d199614611a58578063c7d7996e146119bf578063ca15c87314611977578063cf05d9c014611872578063d0399bb8146114bc578063d547741f1461145e578063da79a9c31461117a578063e580f6ab14610f4b578063e87e5f9d14610d83578063eeb7cfa314610d31578063efaa55a01461066a578063f440256d14610489578063f698da2514610448578063f74d5480146103f65763f9f6a812146102cb57600080fd5b346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f3576040517fe33e75c200000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016600482015260608160248173__$bcf66ed587f714e3ffb8bafad5409d838b$__5af480156103e8578291839084926103a0575b506060935060405192835260208301526040820152f35b925050506060813d82116103e0575b816103bc60609383614a87565b810103126103dc5760609150805160406020830151920151909138610389565b5080fd5b3d91506103af565b6040513d84823e3d90fd5b80fd5b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602073ffffffffffffffffffffffffffffffffffffffff600f5416604051908152f35b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35760206104816150e7565b604051908152f35b50346103f35760c07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f3576104c16144f0565b6104c9614513565b60443573ffffffffffffffffffffffffffffffffffffffff90818116809103610665576064359180831680930361066557608435938185168095036106655760a435958287168097036106655782906105206145d4565b1680610636575b501680610607575b50806105d8575b50806105a9575b508061057a575b508061054e575080f35b7fffffffffffffffffffffffff0000000000000000000000000000000000000000600d541617600d5580f35b7fffffffffffffffffffffffff0000000000000000000000000000000000000000600c541617600c5538610544565b7fffffffffffffffffffffffff0000000000000000000000000000000000000000600b541617600b553861053d565b7fffffffffffffffffffffffff0000000000000000000000000000000000000000600a541617600a5538610536565b7fffffffffffffffffffffffff000000000000000000000000000000000000000060095416176009553861052f565b7fffffffffffffffffffffffff0000000000000000000000000000000000000000600854161760085538610527565b600080fd5b50346103f3576020807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103dc57600435906106a76152da565b81151580610d25575b15610cc75781835260118152604083206004810154906106d660ff8360281c1615615210565b6106e660ff8360301c1615615275565b600681013360005280845273ffffffffffffffffffffffffffffffffffffffff8060406000205416610c695760058301603281541015610c0b5760ff826006541695871c169061073582614536565b61073e82614536565b86604051809781947f0d4158c200000000000000000000000000000000000000000000000000000000835261077281614536565b600483015260249485915afa958615610c00578996610bd1575b50827f0000000000000000000000000000000000000000000000000000000000000000166040517f70a0823100000000000000000000000000000000000000000000000000000000815233600482015288818581855afa8015610bc65788918c91610b95575b5010610b3857878a6108af928180604051858101907f23b872dd000000000000000000000000000000000000000000000000000000008252338a8201523060448201528d60648201526064815261084881614a17565b7f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c65646040519761087689614a4f565b808952880152519082855af1903d15610b2f573d61089381614c01565b906108a16040519283614a87565b815280938d3d92013e615347565b805190888215928315610b17575b50505015610a945780549168010000000000000000831015610a695750937f87969bc7faf902221a147b95ceba76e011c5efb0339a0a8ee7a2bb82d9cfbbd697959389610a54946109188560409b9960018098018155614df0565b81549060031b908333831b921b1916179055848a5161093681614a17565b3381528981018481528c820193858552606083019686885260808401968752336000528c528d6000209251167fffffffffffffffffffffff00000000000000000000000000000000000000000074ff000000000000000000000000000000000000000084549351151560a01b16921617178155610a0867ffffffffffffffff8094511682907fffffff0000000000000000ffffffffffffffffffffffffffffffffffffffffff7cffffffffffffffff00000000000000000000000000000000000000000083549260a81b169116179055565b019251167fffffffffffffffffffffffffffffffff000000000000000000000000000000006fffffffffffffffff0000000000000000845493518c1b1692161717905501918254614bc5565b905582519182523390820152a1600160025580f35b897f4e487b710000000000000000000000000000000000000000000000000000000081526041600452fd5b608487602a84604051927f08c379a000000000000000000000000000000000000000000000000000000000845260048401528201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f742073756363656564000000000000000000000000000000000000000000006064820152fd5b610b2793508201810191016151f8565b3888816108bd565b60609250615347565b606488600b85604051927f08c379a000000000000000000000000000000000000000000000000000000000845260048401528201527f4c4f575f42414c414e43450000000000000000000000000000000000000000006044820152fd5b8092508a8092503d8311610bbf575b610bae8183614a87565b8101031261066557879051386107f2565b503d610ba4565b6040513d8d823e3d90fd5b9095508681813d8311610bf9575b610be98183614a87565b810103126106655751943861078c565b503d610bdf565b6040513d8b823e3d90fd5b606486604051907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152600960248201527f47414d455f46554c4c00000000000000000000000000000000000000000000006044820152fd5b606485604051907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152600e60248201527f414c52454144595f4a4f494e45440000000000000000000000000000000000006044820152fd5b606490604051907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152600c60248201527f494e56414c49445f47414d4500000000000000000000000000000000000000006044820152fd5b506010548211156106b0565b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602073ffffffffffffffffffffffffffffffffffffffff600b5416604051908152f35b50346103f35760607ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357600435610dbe614513565b9060443590610dcb6145d4565b808452601160205260ff600460408620015460281c16610eed5773ffffffffffffffffffffffffffffffffffffffff80931680855260036020526040852083865260205260ff60026040872001541615610e8f578493600c5416803b15610e8b5784928360649260405196879586947fe87e5f9d0000000000000000000000000000000000000000000000000000000086526004860152602485015260448401525af180156103e857610e7b5750f35b610e8490614a03565b6103f35780f35b8480fd5b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601b60248201527f52616e646f6d6e657373206e6f742072657665616c65642079657400000000006044820152fd5b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f47616d6520616c726561647920656e64656400000000000000000000000000006044820152fd5b50346103f3576020807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103dc57600435600381101561117657610f906145d4565b73ffffffffffffffffffffffffffffffffffffffff60065416610fb282614536565b8260ff8316610fc081614536565b6024604051809481937f8b0d9f5c000000000000000000000000000000000000000000000000000000008352610ff581614536565b60048301525afa90811561116b57849161113e575b50156110e0577f94d432d34c6bf23aeab9b063a19d03c71d674549cc2ffc9d82c1dd37ee1653579160609161104060105461502f565b908160105581865260118352604086209182556004820161106082614536565b8054926002429101557fffffffffffffffffffffffffffffffffffffffffffffffffff00ffffffffffff6104b080947fffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000064ff0000000086891b1691161717169055601054926040519384526110d482614536565b8301526040820152a180f35b606482604051907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152600e60248201527f4c4556454c5f494e4143544956450000000000000000000000000000000000006044820152fd5b61115e9150833d8511611164575b6111568183614a87565b8101906151f8565b3861100a565b503d61114c565b6040513d86823e3d90fd5b8280fd5b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35767ffffffffffffffff906004358281116103dc576111cc9036906004016145a3565b9290602491823590811161145a576111e89036906004016145a3565b80869296036113fc57600a821161139e5761120582959495615074565b958460018043019485431196600b4301809711985b82811061123b57604051602080825281906112379082018f61456f565b0390f35b33855260206004815289604087205490611372578b611372579081808f8561132f918a8f8f8f8f90868f938f9261136d9f9e966005978f6112828660409a611301996150c3565b359a33895260039b8c83528a8a20848b5283528a8a20553389528b8252898920838a52825243908a8a2001553388528a815288882082895281526002898920017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0081541690553388528a815288882091885252600487872001556150c3565b35933382528a528181208882528a52200155338c526004865260408c20611328815461502f565b90556150d3565b5261133b838b8b6150c3565b35917f2c1c32a0b6860c2d724927516c372f04d3803b0c92051eb45a033c3c83177d46604051918d83523392a461502f565b61121a565b8c877f4e487b710000000000000000000000000000000000000000000000000000000081526011600452fd5b6064846018604051917f08c379a0000000000000000000000000000000000000000000000000000000008352602060048401528201527f546f6f206d616e7920636f6d6d697473206174206f6e636500000000000000006044820152fd5b6064846015604051917f08c379a0000000000000000000000000000000000000000000000000000000008352602060048401528201527f4172726179206c656e677468206d69736d6174636800000000000000000000006044820152fd5b8380fd5b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f3576114b960043561149c614513565b90808452836020526114b460016040862001546148a6565b614b12565b80f35b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f3576114f46145d4565b60043581526011602052600460408220015461152660ff8261151c82809560281c1615615210565b60301c1615615275565b6000906004358252601160205260408220906004820191650100000000007fffffffffffffffffffffffffffffffffffffffffffffffffffff00ffffffffff84541617809355600390428282015560058101546115828161505c565b926115906040519485614a87565b8184527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe06115bd8361505c565b01875b81811061183d57505060068301875b838110611799575050505073ffffffffffffffffffffffffffffffffffffffff6007541692600182015494611608828260201c16614536565b611616828260201c16614536565b843b1561179557949290918694926040519687957f9ae3c51800000000000000000000000000000000000000000000000000000000875260043560048801526024870152611668828260201c16614536565b60201c16604485015261168a60a091826064870152600560a487019101615649565b7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc8582030160848601526020808451928381520193019186905b82821061172357505050508383809203925af180156103e857611714575b506040519081527f716f3063a3b0e65531660dc2d5d241dfcf3b2983d26d7a70df643ad232d51783602060043592a280f35b61171d90614a03565b386116e2565b6001929597508396506020919481945173ffffffffffffffffffffffffffffffffffffffff815116825267ffffffffffffffff808583015116858401528060408301511660408401526060808301511515908401526080809201511690820152019501920192879593879593926116c4565b8680fd5b806117aa6118389260058801614df0565b9073ffffffffffffffffffffffffffffffffffffffff9182915490871b1c168b528360205260408b2060018154910154604051926117e784614a17565b821683528a67ffffffffffffffff92838160a81c166020860152838316604086015260a01c161515606084015260401c16608082015261182782896150d3565b5261183281886150d3565b5061502f565b6115cf565b60209060405161184c81614a17565b8a81528a838201528a60408201528a60608201528a6080820152828289010152016115c0565b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357604051907f3d6086d200000000000000000000000000000000000000000000000000000000825273ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016600483015260208260248173__$bcf66ed587f714e3ffb8bafad5409d838b$__5af490811561196b5790611939575b602090604051908152f35b506020813d8211611963575b8161195260209383614a87565b81010312610665576020905161192e565b3d9150611945565b604051903d90823e3d90fd5b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35760406020916004358152600183522054604051908152f35b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357604060809173ffffffffffffffffffffffffffffffffffffffff611a116144f0565b168152600360205281812060243582526020522060018101549060ff6002820154169060056004820154910154916040519384521515602084015260408301526060820152f35b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35760206040517f83aeca795846b427cef798c5053d6b58222df44008576b8d6159e88e329175ad8152f35b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35760206040516104b08152f35b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357611b246144f0565b60243567ffffffffffffffff811161117657611b449036906004016145a3565b9073ffffffffffffffffffffffffffffffffffffffff849316925b828110611bd4575060405190602082528260208301527f07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8311610e8b57816040917f78d0c440b837302f1d84bd6b81e603f079ef72d8bad8c935d13002d4d2e7cd199460051b8091848401378101030190a280f35b611c1990848652600360209080825260408820611bf28488886150c3565b3589528252604088206001908181015415159081611c64575b50611c1e575b50505061502f565b611b5f565b600060059281948a8c5281815260408c2090611c3b888c8c6150c3565b358d52528160408c20938185558401558a60028401558201558260048201550155388080611c11565b6004810154431191508115611c7b575b5038611c0b565b60ff9150600201541638611c74565b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357604060209160043581526011835220600481015460ff8160281c16159182611d10575b82611cef575b50506040519015158152f35b611d069250600263ffffffff910154911690614bc5565b4210153880611ce3565b915060ff8160301c161591611cdd565b50346103f3576020807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103dc5760043567ffffffffffffffff811161117657611d719036906004016145a3565b611d7c9291926145d4565b835b818110611d89578480f35b80611d98611dc59284876150c3565b358087526011855260046040882001805460ff808260281c169081611e23575b50611dca5750505061502f565b611d7e565b7fffffffffffffffffffffffffffffffffffffffffffffffffff00ffffffffffff1666010000000000001790557f0d44df2447ad08457aac2b0eb4cce9cd8220ae20431d62a8ea4dd69629fd2f0c8780a2388080611c11565b90508160301c161538611db8565b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35773ffffffffffffffffffffffffffffffffffffffff611e7e6144f0565b1681526003602052604081206024358252602052604081206001810154908115159182611f19575b82611ed1575b506020925081611ec2575b506040519015158152f35b60049150015443111538611eb7565b90915060018101809111611eec576020925043119038611eac565b6024837f4e487b710000000000000000000000000000000000000000000000000000000081526011600452fd5b600282015460ff16159250611ea6565b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35773ffffffffffffffffffffffffffffffffffffffff611f766144f0565b611f7e6145d4565b167fffffffffffffffffffffffff0000000000000000000000000000000000000000600f541617600f5580f35b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc818136011261117657600435918284526011815260408420612026600482015463ffffffff600260ff9461200d868560281c1615615210565b61201c868560301c1615615275565b0154911690614bc5565b42106123305783600052601182526040600020906004820193650100000000007fffffffffffffffffffffffffffffffffffffffffffffffffffff00ffffffffff8654161780955560039042828501556005840180546120858161505c565b936120936040519586614a87565b8185527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe06120c08361505c565b018860005b8281106122f7575050506006870160005b83811061225a575050505073ffffffffffffffffffffffffffffffffffffffff9081600754169460018097015498881c1661211081614536565b61211981614536565b853b156106655797939290916040519889957f9ae3c5180000000000000000000000000000000000000000000000000000000087528b6004880152602487015261216281614536565b604486015261217d60a09384606488015260a4870190615649565b918583030160848601528780855193848152019401926000915b888a85851061220657505050505050509181600081819503925af19283156121fa577f716f3063a3b0e65531660dc2d5d241dfcf3b2983d26d7a70df643ad232d51783936121eb575b50604051908152a280f35b6121f490614a03565b386121e0565b6040513d6000823e3d90fd5b86518051841689528082015167ffffffffffffffff9081168a8401526040808301518216908b01526060808301511515908b015260809182015116908901528c985096830196959095019490920191612197565b806122686122f29287614df0565b9073ffffffffffffffffffffffffffffffffffffffff9182915490871b1c16600052838c528b60406000208b6001825492015491604051946122a986614a17565b8116855267ffffffffffffffff93848260a81c1690860152838316604086015260a01c161515606084015260401c1660808201526122e7828a6150d3565b5261183281896150d3565b6120d6565b60405161230381614a17565b6000815260008382015260006040820152600060608201526000608082015282828a0101520189906120c5565b606482604051907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152600b60248201527f4e4f545f455850495245440000000000000000000000000000000000000000006044820152fd5b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602090604051908152f35b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f3576024359033815260209160048352604082205491600143019081431161250557600b43018092116125055790604084923381526003875281812084825287526004358282205533815260038752818120848252875243600183832001553381526003875281812084825287526002828220017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0081541690553381526003875281812084825287528260048383200155338152600387528181208482528752846005838320015533815260048752206124d0815461502f565b90556040519081527f2c1c32a0b6860c2d724927516c372f04d3803b0c92051eb45a033c3c83177d46853392a4604051908152f35b807f4e487b7100000000000000000000000000000000000000000000000000000000602492526011600452fd5b50346103f35760807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35760043560038110156103dc5760243560443591836064358015158091036103dc5761258b6145d4565b73ffffffffffffffffffffffffffffffffffffffff60065416906125ae84614536565b60ff8416906125bc82614536565b823b1561145a57608484928360405195869485937f92bf92480000000000000000000000000000000000000000000000000000000085526125fc81614536565b60048501528a60248501528b604485015260648401525af180156103e857612658575b50506126527f661124c8826d75343ee919baad251f50d4348b31f86cd88dabc18a6d96e351bd936040519384938461569c565b0390a180f35b61266190614a03565b61145a57833861261f565b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35773ffffffffffffffffffffffffffffffffffffffff60406126bb614513565b92600435815280602052209116600052602052602060ff604060002054166040519015158152f35b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35773ffffffffffffffffffffffffffffffffffffffff61274360209260043581526001845260406024359120614df0565b9190546040519260031b1c168152f35b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f3578061278c614513565b6127946145d4565b73__$bcf66ed587f714e3ffb8bafad5409d838b$__803b15612841576040517ff955b50100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000081166004808401919091523560248301529092166044830152829082908180606481015b03915af480156103e857610e7b5750f35b5050fd5b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f3578061287e614513565b6128866145d4565b73__$bcf66ed587f714e3ffb8bafad5409d838b$__803b15612841576040517f686f5a0c00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000008116600480840191909152356024830152909216604483015282908290818060648101612830565b50346103f35760607ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35760043560038110156103dc57602435604435916129716145d4565b8373ffffffffffffffffffffffffffffffffffffffff6007541661299483614536565b60ff83166129a181614536565b813b156111765782916064839260405194859384927f7cf4c4cd0000000000000000000000000000000000000000000000000000000084526129e281614536565b60048401528960248401528a60448401525af180156103e8576126585750506126527f661124c8826d75343ee919baad251f50d4348b31f86cd88dabc18a6d96e351bd936040519384938461569c565b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35760206040517fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c217758152f35b50346103f35760c07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357612ac3614513565b67ffffffffffffffff60a435116103dc5736602360a4350112156103dc5767ffffffffffffffff60a43560040135116103dc5736602460a4356004013560a4350101116103dc57612b126152da565b73ffffffffffffffffffffffffffffffffffffffff600f5416908133036130a45760043583526011602052600660408420612b5c60ff600483015461151c828260281c1615615210565b73ffffffffffffffffffffffffffffffffffffffff831660005201602052604060002090815473ffffffffffffffffffffffffffffffffffffffff821673ffffffffffffffffffffffffffffffffffffffff8216036130465760a01c60ff16612fe857606435928315612f8a5773ffffffffffffffffffffffffffffffffffffffff821685526012602052604085205460843503612f2c57612bfc6150e7565b604051907f83aeca795846b427cef798c5053d6b58222df44008576b8d6159e88e329175ad6020830152600435604083015273ffffffffffffffffffffffffffffffffffffffff8416606083015260443560808301528560a083015260843560c083015260c082528160e081011067ffffffffffffffff60e084011117612efd5760e0820160405281516020830120907f1901000000000000000000000000000000000000000000000000000000000000610100840152610102830152610122820152604260e082015260e0810161016082011067ffffffffffffffff61016083011117612efd57612d5f612d578261016073ffffffffffffffffffffffffffffffffffffffff940160405261010060e0820151910120612d2260a43560040135614c01565b90612d306040519283614a87565b60a435600481013580845290602401602084013789602060a4356004013584010152615575565b91909161540b565b1603612e9f5773ffffffffffffffffffffffffffffffffffffffff9167ffffffffffffffff806044351694612ddd8684907fffffff0000000000000000ffffffffffffffffffffffffffffffffffffffffff7cffffffffffffffff00000000000000000000000000000000000000000083549260a81b169116179055565b169060018101827fffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000825416179055740100000000000000000000000000000000000000007fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff8254161790558282168552601260205260408520612e60815461502f565b9055604051938452602084015216907f0666c04fa5fbe0b05a88e385492b569fcd91f702c82580f2ff0a2013ec12d295604060043592a3600160025580f35b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600b60248201527f494e56414c49445f5349470000000000000000000000000000000000000000006044820152fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600d60248201527f494e56414c49445f4e4f4e4345000000000000000000000000000000000000006044820152fd5b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f5a45524f5f53434f5245000000000000000000000000000000000000000000006044820152fd5b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600960248201527f5355424d495454454400000000000000000000000000000000000000000000006044820152fd5b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f4e4f545f504c41594552000000000000000000000000000000000000000000006044820152fd5b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f4e4f545f5349474e4552000000000000000000000000000000000000000000006044820152fd5b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357604060209173ffffffffffffffffffffffffffffffffffffffff6131546144f0565b168152601283522054604051908152f35b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f3578061319e614513565b6131a66145d4565b73__$bcf66ed587f714e3ffb8bafad5409d838b$__9073ffffffffffffffffffffffffffffffffffffffff6008541690823b15613241576040517fad7cc5a300000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff928316600480830191909152356024820152911660448201529082908290818060648101612830565b505050fd5b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357604060209173ffffffffffffffffffffffffffffffffffffffff6132986144f0565b168152600483522054604051908152f35b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35761330160406020926004358152601184522063ffffffff600460028301549201541690614bc5565b421015604051908152f35b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602073ffffffffffffffffffffffffffffffffffffffff60075416604051908152f35b50346103f35760807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f3576004359060248035926044938435906064938435943387526020966003885260408120868252885260408120600181015480156137465760ff6002830154166136eb57600181018091116136bf57431115613664576004015443116136095760409033815260038952818120878252895220978660058a0154036135af57604051888101908582528660408201526040815261342981614a33565b519020895403613555575050600187015491600554926040519488860192835260408601524460608601528040608086015260a08501523360601b60c08501528560d48501528260f485015260f4845261012084019184831067ffffffffffffffff84111761352857509181600393610160989993604052855190208098866101408398019485520152604081526134c081614a33565b5190206005556002810160017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0082541617905501556040518381527f5ed67831b1d8ad7d0b81cce82eff245333944fa87fe281fa31c2417f52b38733853392a4604051908152f35b7f4e487b710000000000000000000000000000000000000000000000000000000060005260416004526000fd5b7f496e76616c69642072657665616c0000000000000000000000000000000000008891600e85604051947f08c379a00000000000000000000000000000000000000000000000000000000086526004860152840152820152fd5b7f507572706f7365206d69736d61746368000000000000000000000000000000008891601085604051947f08c379a00000000000000000000000000000000000000000000000000000000086526004860152840152820152fd5b50867f52657665616c20646561646c696e65207061737365640000000000000000000089601685604051947f08c379a00000000000000000000000000000000000000000000000000000000086526004860152840152820152fd5b82897f546f6f206561726c7920746f2072657665616c000000000000000000000000008c601388604051947f08c379a00000000000000000000000000000000000000000000000000000000086526004860152840152820152fd5b84837f4e487b710000000000000000000000000000000000000000000000000000000081526011600452fd5b838a7f416c72656164792072657665616c6564000000000000000000000000000000008d601089604051947f08c379a00000000000000000000000000000000000000000000000000000000086526004860152840152820152fd5b838a7f4e6f20636f6d6d697420666f756e6400000000000000000000000000000000008d600f89604051947f08c379a00000000000000000000000000000000000000000000000000000000086526004860152840152820152fd5b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602060405173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168152f35b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602073ffffffffffffffffffffffffffffffffffffffff600d5416604051908152f35b50346103f357602090817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357600435815260118252604081209060058201918254906138b38261505c565b936138c16040519586614a87565b8285527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe06138ee8461505c565b01368787013760066138ff84615074565b949201915b838110613935576139288661123789886040519485946040865260408601906144a6565b918483039085015261456f565b806139436139a69284614df0565b73ffffffffffffffffffffffffffffffffffffffff809254600392831b1c1661396c848b6150d3565b526139778386614df0565b9054911b1c1660005283885267ffffffffffffffff600160406000200154166139a082886150d3565b5261502f565b613904565b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357806139e46144f0565b6139ec6145d4565b73__$bcf66ed587f714e3ffb8bafad5409d838b$__73ffffffffffffffffffffffffffffffffffffffff91826008541691803b15610e8b57849260649160405195869485937ff71c165e000000000000000000000000000000000000000000000000000000008552827f000000000000000000000000000000000000000000000000000000000000000016600486015260248501521660448301525af480156103e857610e7b5750f35b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602073ffffffffffffffffffffffffffffffffffffffff600e5416604051908152f35b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357604060e091600435815260116020522060018101549060ff6002820154916003810154906004810154916005848460201c169201549460405196875260208701526040860152613b6781614536565b6060850152818160281c161515608085015260301c16151560a083015260c0820152f35b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35760a09060066040613bca614513565b9260043581526011602052200173ffffffffffffffffffffffffffffffffffffffff809216600052602052604060002060018154910154604051928216835260ff67ffffffffffffffff92838160a81c1660208601528383166040860152851c161515606084015260401c166080820152f35b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602073ffffffffffffffffffffffffffffffffffffffff60095416604051908152f35b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357613cc7614513565b3373ffffffffffffffffffffffffffffffffffffffff821603613cf0576114b990600435614b12565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201527f20726f6c657320666f722073656c6600000000000000000000000000000000006064820152fd5b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357613e106004356001613db4614513565b91808552602090858252613dcd836040882001546148a6565b80865285825273ffffffffffffffffffffffffffffffffffffffff6040872094169384600052825260ff6040600020541615613e14575b85525260408320614e08565b5080f35b808652858252604086208460005282526040600020837fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff008254161790553384827f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d8980a4613e04565b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602073ffffffffffffffffffffffffffffffffffffffff60065416604051908152f35b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f3576020601054604051908152f35b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602073ffffffffffffffffffffffffffffffffffffffff600a5416604051908152f35b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357600160406020926004358152808452200154604051908152f35b50346103f35760607ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35760ff604060209273ffffffffffffffffffffffffffffffffffffffff613ffb6144f0565b1681526003845281812060243582528452600682822001604435825284522054166040519015158152f35b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602060405160328152f35b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602073ffffffffffffffffffffffffffffffffffffffff60085416604051908152f35b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35761410861410f600560406112379460043581526011602052200160405192838092615649565b0382614a87565b6040519182916020835260208301906144a6565b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35760043561415e6145d4565b808252601160205260046040832001805460ff8160281c16156141e0577fffffffffffffffffffffffffffffffffffffffffffffffffff00ffffffffffff816141b560ff66010000000000009460301c1615615275565b161790557f0d44df2447ad08457aac2b0eb4cce9cd8220ae20431d62a8ea4dd69629fd2f0c8280a280f35b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600b60248201527f47414d455f4143544956450000000000000000000000000000000000000000006044820152fd5b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602073ffffffffffffffffffffffffffffffffffffffff600c5416604051908152f35b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357604081602092506004358152601183522060ff600482015460281c166000146142f757806002600361048193015491015490614ec9565b600261430591015442614ec9565b610481565b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f3576143426145d4565b8073ffffffffffffffffffffffffffffffffffffffff600c5416803b156143b25781906024604051809481937f02e06cc800000000000000000000000000000000000000000000000000000000835260043560048401525af180156103e8576143a9575080f35b6114b990614a03565b50fd5b9050346103dc5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103dc576004357fffffffff00000000000000000000000000000000000000000000000000000000811680910361117657602092507f5a05180f000000000000000000000000000000000000000000000000000000008114908115614449575b5015158152f35b7f7965db0b0000000000000000000000000000000000000000000000000000000081149150811561447c575b5038614442565b7f01ffc9a70000000000000000000000000000000000000000000000000000000091501438614475565b90815180825260208080930193019160005b8281106144c6575050505090565b835173ffffffffffffffffffffffffffffffffffffffff16855293810193928101926001016144b8565b6004359073ffffffffffffffffffffffffffffffffffffffff8216820361066557565b6024359073ffffffffffffffffffffffffffffffffffffffff8216820361066557565b6003111561454057565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b90815180825260208080930193019160005b82811061458f575050505090565b835185529381019392810192600101614581565b9181601f840112156106655782359167ffffffffffffffff8311610665576020808501948460051b01011161066557565b3360009081527f7d7ffb7a348e1c6a02869081a26547b49160dd3df72d1d75a570eb9b698292ec60209081526040808320549092907fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c217759060ff16156146395750505050565b61464233614c7b565b84519161464e83614a6b565b6042835284830193606036863783511561487957603085538351906001918210156148795790607860218601536041915b8183116147ae57505050614752576146da93859361471e9361470f60489461474e995198857f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008b9788015282519283916037890191016149e0565b8401917f206973206d697373696e6720726f6c65200000000000000000000000000000006037840152518093868401906149e0565b01036028810185520183614a87565b519182917f08c379a000000000000000000000000000000000000000000000000000000000835260048301614ac8565b0390fd5b6064848651907f08c379a000000000000000000000000000000000000000000000000000000000825280600483015260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152fd5b909192600f8116601081101561484c577f3031323334353637383961626364656600000000000000000000000000000000901a6147eb8588614c3b565b5360041c92801561481f577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01919061467f565b6024827f4e487b710000000000000000000000000000000000000000000000000000000081526011600452fd5b6024837f4e487b710000000000000000000000000000000000000000000000000000000081526032600452fd5b807f4e487b7100000000000000000000000000000000000000000000000000000000602492526032600452fd5b6000818152602090808252604092838220338352835260ff8483205416156148ce5750505050565b6148d733614c7b565b8451916148e383614a6b565b6042835284830193606036863783511561487957603085538351906001918210156148795790607860218601536041915b81831161496f57505050614752576146da93859361471e9361470f60489461474e995198857f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008b9788015282519283916037890191016149e0565b909192600f8116601081101561484c577f3031323334353637383961626364656600000000000000000000000000000000901a6149ac8588614c3b565b5360041c92801561481f577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff019190614914565b60005b8381106149f35750506000910152565b81810151838201526020016149e3565b67ffffffffffffffff8111612efd57604052565b60a0810190811067ffffffffffffffff821117612efd57604052565b6060810190811067ffffffffffffffff821117612efd57604052565b6040810190811067ffffffffffffffff821117612efd57604052565b6080810190811067ffffffffffffffff821117612efd57604052565b90601f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0910116810190811067ffffffffffffffff821117612efd57604052565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f60409360208452614b0b81518092816020880152602088880191016149e0565b0116010190565b906040614b5d926000908082528160205273ffffffffffffffffffffffffffffffffffffffff83832094169384835260205260ff8383205416614b60575b8152600160205220614ed6565b50565b808252816020528282208483526020528282207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0081541690553384827ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b8580a4614b50565b91908201809211614bd257565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b67ffffffffffffffff8111612efd57601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b908151811015614c4c570160200190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60405190614c8882614a33565b602a8252602082016040368237825115614c4c57603090538151600190811015614c4c57607860218401536029905b808211614d25575050614cc75790565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602060248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152fd5b9091600f81166010811015614dc2577f3031323334353637383961626364656600000000000000000000000000000000901a614d618486614c3b565b5360041c918015614d94577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0190614cb7565b602460007f4e487b710000000000000000000000000000000000000000000000000000000081526011600452fd5b602460007f4e487b710000000000000000000000000000000000000000000000000000000081526032600452fd5b8054821015614c4c5760005260206000200190600090565b91906001830160009082825280602052604082205415600014614ec35784549468010000000000000000861015614e965783614e86614e51886001604098999a01855584614df0565b81939154907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9060031b92831b921b19161790565b9055549382526020522055600190565b6024837f4e487b710000000000000000000000000000000000000000000000000000000081526041600452fd5b50925050565b91908203918211614bd257565b90600182019060009281845282602052604084205490811515600014615028577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff91828101818111614ffb57825490848201918211614fce57808203614f99575b50505080548015614f6c57820191614f4f8383614df0565b909182549160031b1b191690555582526020526040812055600190565b6024867f4e487b710000000000000000000000000000000000000000000000000000000081526031600452fd5b614fb9614fa9614e519386614df0565b90549060031b1c92839286614df0565b90558652846020526040862055388080614f37565b6024887f4e487b710000000000000000000000000000000000000000000000000000000081526011600452fd5b6024877f4e487b710000000000000000000000000000000000000000000000000000000081526011600452fd5b5050505090565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8114614bd25760010190565b67ffffffffffffffff8111612efd5760051b60200190565b9061507e8261505c565b61508b6040519182614a87565b8281527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe06150b9829461505c565b0190602036910137565b9190811015614c4c5760051b0190565b8051821015614c4c5760209160051b010190565b7f53776f7264426174746c65000000000000000000000000000000000000000000602060405161511681614a4f565b600b815201527f3100000000000000000000000000000000000000000000000000000000000000602060405161514b81614a4f565b60018152015260405160208101907f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f82527f3f696bb35ca88e80cd8e6d0597864b656823873afba3fefff14622cda27ab5d060408201527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc660608201524660808201523060a082015260a0815260c0810181811067ffffffffffffffff821117612efd5760405251902090565b90816020910312610665575180151581036106655790565b1561521757565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f47414d455f454e444544000000000000000000000000000000000000000000006044820152fd5b1561527c57565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600c60248201527f47414d455f434c45414e454400000000000000000000000000000000000000006044820152fd5b60028054146152e95760028055565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152fd5b919290156153c2575081511561535b575090565b3b156153645790565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152fd5b8251909150156153d55750805190602001fd5b61474e906040519182917f08c379a000000000000000000000000000000000000000000000000000000000835260048301614ac8565b6005811015614540578061541c5750565b600181036154825760646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152fd5b600281036154e85760646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152fd5b6003146154f157565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c60448201527f75650000000000000000000000000000000000000000000000000000000000006064820152fd5b9060418151146000146155a35761559f916020820151906060604084015193015160001a906155ad565b9091565b5050600090600290565b9291907f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0831161563d5791608094939160ff602094604051948552168484015260408301526060820152600093849182805260015afa1561563057815173ffffffffffffffffffffffffffffffffffffffff81161561562a579190565b50600190565b50604051903d90823e3d90fd5b50505050600090600390565b90815480825260208092019260005281600020916000905b82821061566f575050505090565b835473ffffffffffffffffffffffffffffffffffffffff1685529384019360019384019390910190615661565b606081019493926040926156af81614536565b82526020820152015256fea264697066735822122073f33ffa97014f436852a00f3c581dea901e353f3746e1934ed59f487cf2fc3764736f6c634300081200332f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d',
      sourceMap:
        '888:24821:52:-:0;;;;;;;;;;;;;-1:-1:-1;;888:24821:52;;;;-1:-1:-1;;;;;888:24821:52;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;:::i;:::-;;;;;;:::i;:::-;;;;;;:::i;:::-;;;;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;;:::i;:::-;;;;:::i;:::-;;;1821:22:20;888:24821:52;;;;1356:176:43;;;1394:15;;888:24821:52;;1431:16:43;888:24821:52;;;;1469:10:43;888:24821:52;;;;;;1509:4:43;888:24821:52;;;;;;1356:176:43;;;888:24821:52;;;;;;;;;;;;;;;;;;;1329:217:43;;;1287:269;888:24821:52;-1:-1:-1;;;;;888:24821:52;;;;4834:30;4874:32;888:24821;;-1:-1:-1;;;;;;888:24821:52;;;;;;;;;;;;4916:37;888:24821;;;;;;;;;;;;;;4963:30;888:24821;;;;;;;;;;;;;;5003:52;888:24821;;;;;;;;;;;;;;5065:46;888:24821;;;;;;;;;;;;;;5121:49;888:24821;;;;;;;;;;;;;;5180:57;888:24821;;;;;;;;;;;;;;5247:57;888:24821;;;;;;;;;;;;;;-1:-1:-1;888:24821:52;;;;;;;;;;;;;;5381:22;888:24821;;;;;;;;;;;;;-1:-1:-1;5413:15:52;888:24821;;;;;;;;;;;;1469:10:43;888:24821:52;;;;;;;;8398:50:40;;888:24821:52;;;;7669:23:15;7665:149;;-1:-1:-1;888:24821:52;;;;;;8398:50:40;1469:10:43;888:24821:52;;;8398:50:40;:::i;:::-;;1187:23:52;888:24821;;;;;;;;;1469:10:43;888:24821:52;;;;;;;;;;7669:23:15;7665:149;;-1:-1:-1;888:24821:52;;;1469:10:43;;888:24821:52;;8398:50:40;:::i;:::-;;888:24821:52;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;7665:149:15;888:24821:52;;;;;;;;;1469:10:43;888:24821:52;;;;;;;;;;;;;;;;1469:10:43;;7763:40:15;-1:-1:-1;;;;;;;;;;;7763:40:15;;;7665:149;;;888:24821:52;;;;;;;;;1469:10:43;888:24821:52;;;;;;;;;;;;;;;;1469:10:43;;7763:40:15;-1:-1:-1;;;;;;;;;;;7763:40:15;;;7665:149;;888:24821:52;;;;;;;;;;;;;-1:-1:-1;888:24821:52;;;;;-1:-1:-1;;;;;888:24821:52;;;;;;:::o;2214:404:40:-;;;4351:12;;;-1:-1:-1;888:24821:52;;;;;;;;;;;4351:24:40;2293:319;888:24821:52;;;;;;;;;;;;4351:12:40;888:24821:52;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;4351:12:40;2547:11;:::o;888:24821:52:-;-1:-1:-1;;;888:24821:52;;;;;;;;;-1:-1:-1;;;888:24821:52;;;;;;;;2293:319:40;-1:-1:-1;2589:12:40;-1:-1:-1;;2589:12:40:o',
      linkReferences: {
        'src/libraries/FundManagementLib.sol': {
          FundManagementLib: [
            { start: 1858, length: 20 },
            { start: 7403, length: 20 },
            { start: 11125, length: 20 },
            { start: 11367, length: 20 },
            { start: 13703, length: 20 },
            { start: 15821, length: 20 },
          ],
        },
      },
    },
    deployedBytecode: {
      object:
        '0x608080604052600436101561001357600080fd5b600090813560e01c90816301ffc9a7146143b55750806302e06cc81461430a5780630f42d191146142905780630f4ef8a61461423e5780631004ff611461412357806315a40f49146140b257806317723e8714614060578063185f31b01461402657806319ead6fa146131025780631b94770714613fa7578063248a9ca314613f5d57806325cb9e5114613f0b5780632e0be39a14613ecf5780632e15f1b714613e7d5780632f2ff15d14613d7457806336568abe14613c8f578063371665b014613c3d5780633ccd10e914613b8b57806347e1d55014613ae85780634efd374914613a9657806354ab6269146139ab578063599706d01461386257806359c1303f1461381057806361412fbc146137a157806361c3ddfa1461335e5780636388607c1461330c57806365b3a7ca146132a95780636834e3a814613246578063686a978c1461316557806368efccbb14613102578063718072e514612a8b57806375b238fc14612a325780637cf4c4cd146129265780638391a665146128455780638cce2d47146127535780639010d07c146126e357806391d148541461266c57806392bf9248146125325780639d8df9ee146123c8578063a217fddf1461238e578063a3dac2de14611fab578063a7ecd37e14611f29578063b2040f2014611e31578063b622c03414611d20578063b6d4d64b14611c8a578063b753204d14611aec578063c31b29ce14611ab1578063c60d199614611a58578063c7d7996e146119bf578063ca15c87314611977578063cf05d9c014611872578063d0399bb8146114bc578063d547741f1461145e578063da79a9c31461117a578063e580f6ab14610f4b578063e87e5f9d14610d83578063eeb7cfa314610d31578063efaa55a01461066a578063f440256d14610489578063f698da2514610448578063f74d5480146103f65763f9f6a812146102cb57600080fd5b346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f3576040517fe33e75c200000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016600482015260608160248173__$bcf66ed587f714e3ffb8bafad5409d838b$__5af480156103e8578291839084926103a0575b506060935060405192835260208301526040820152f35b925050506060813d82116103e0575b816103bc60609383614a87565b810103126103dc5760609150805160406020830151920151909138610389565b5080fd5b3d91506103af565b6040513d84823e3d90fd5b80fd5b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602073ffffffffffffffffffffffffffffffffffffffff600f5416604051908152f35b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35760206104816150e7565b604051908152f35b50346103f35760c07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f3576104c16144f0565b6104c9614513565b60443573ffffffffffffffffffffffffffffffffffffffff90818116809103610665576064359180831680930361066557608435938185168095036106655760a435958287168097036106655782906105206145d4565b1680610636575b501680610607575b50806105d8575b50806105a9575b508061057a575b508061054e575080f35b7fffffffffffffffffffffffff0000000000000000000000000000000000000000600d541617600d5580f35b7fffffffffffffffffffffffff0000000000000000000000000000000000000000600c541617600c5538610544565b7fffffffffffffffffffffffff0000000000000000000000000000000000000000600b541617600b553861053d565b7fffffffffffffffffffffffff0000000000000000000000000000000000000000600a541617600a5538610536565b7fffffffffffffffffffffffff000000000000000000000000000000000000000060095416176009553861052f565b7fffffffffffffffffffffffff0000000000000000000000000000000000000000600854161760085538610527565b600080fd5b50346103f3576020807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103dc57600435906106a76152da565b81151580610d25575b15610cc75781835260118152604083206004810154906106d660ff8360281c1615615210565b6106e660ff8360301c1615615275565b600681013360005280845273ffffffffffffffffffffffffffffffffffffffff8060406000205416610c695760058301603281541015610c0b5760ff826006541695871c169061073582614536565b61073e82614536565b86604051809781947f0d4158c200000000000000000000000000000000000000000000000000000000835261077281614536565b600483015260249485915afa958615610c00578996610bd1575b50827f0000000000000000000000000000000000000000000000000000000000000000166040517f70a0823100000000000000000000000000000000000000000000000000000000815233600482015288818581855afa8015610bc65788918c91610b95575b5010610b3857878a6108af928180604051858101907f23b872dd000000000000000000000000000000000000000000000000000000008252338a8201523060448201528d60648201526064815261084881614a17565b7f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c65646040519761087689614a4f565b808952880152519082855af1903d15610b2f573d61089381614c01565b906108a16040519283614a87565b815280938d3d92013e615347565b805190888215928315610b17575b50505015610a945780549168010000000000000000831015610a695750937f87969bc7faf902221a147b95ceba76e011c5efb0339a0a8ee7a2bb82d9cfbbd697959389610a54946109188560409b9960018098018155614df0565b81549060031b908333831b921b1916179055848a5161093681614a17565b3381528981018481528c820193858552606083019686885260808401968752336000528c528d6000209251167fffffffffffffffffffffff00000000000000000000000000000000000000000074ff000000000000000000000000000000000000000084549351151560a01b16921617178155610a0867ffffffffffffffff8094511682907fffffff0000000000000000ffffffffffffffffffffffffffffffffffffffffff7cffffffffffffffff00000000000000000000000000000000000000000083549260a81b169116179055565b019251167fffffffffffffffffffffffffffffffff000000000000000000000000000000006fffffffffffffffff0000000000000000845493518c1b1692161717905501918254614bc5565b905582519182523390820152a1600160025580f35b897f4e487b710000000000000000000000000000000000000000000000000000000081526041600452fd5b608487602a84604051927f08c379a000000000000000000000000000000000000000000000000000000000845260048401528201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f742073756363656564000000000000000000000000000000000000000000006064820152fd5b610b2793508201810191016151f8565b3888816108bd565b60609250615347565b606488600b85604051927f08c379a000000000000000000000000000000000000000000000000000000000845260048401528201527f4c4f575f42414c414e43450000000000000000000000000000000000000000006044820152fd5b8092508a8092503d8311610bbf575b610bae8183614a87565b8101031261066557879051386107f2565b503d610ba4565b6040513d8d823e3d90fd5b9095508681813d8311610bf9575b610be98183614a87565b810103126106655751943861078c565b503d610bdf565b6040513d8b823e3d90fd5b606486604051907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152600960248201527f47414d455f46554c4c00000000000000000000000000000000000000000000006044820152fd5b606485604051907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152600e60248201527f414c52454144595f4a4f494e45440000000000000000000000000000000000006044820152fd5b606490604051907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152600c60248201527f494e56414c49445f47414d4500000000000000000000000000000000000000006044820152fd5b506010548211156106b0565b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602073ffffffffffffffffffffffffffffffffffffffff600b5416604051908152f35b50346103f35760607ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357600435610dbe614513565b9060443590610dcb6145d4565b808452601160205260ff600460408620015460281c16610eed5773ffffffffffffffffffffffffffffffffffffffff80931680855260036020526040852083865260205260ff60026040872001541615610e8f578493600c5416803b15610e8b5784928360649260405196879586947fe87e5f9d0000000000000000000000000000000000000000000000000000000086526004860152602485015260448401525af180156103e857610e7b5750f35b610e8490614a03565b6103f35780f35b8480fd5b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601b60248201527f52616e646f6d6e657373206e6f742072657665616c65642079657400000000006044820152fd5b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f47616d6520616c726561647920656e64656400000000000000000000000000006044820152fd5b50346103f3576020807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103dc57600435600381101561117657610f906145d4565b73ffffffffffffffffffffffffffffffffffffffff60065416610fb282614536565b8260ff8316610fc081614536565b6024604051809481937f8b0d9f5c000000000000000000000000000000000000000000000000000000008352610ff581614536565b60048301525afa90811561116b57849161113e575b50156110e0577f94d432d34c6bf23aeab9b063a19d03c71d674549cc2ffc9d82c1dd37ee1653579160609161104060105461502f565b908160105581865260118352604086209182556004820161106082614536565b8054926002429101557fffffffffffffffffffffffffffffffffffffffffffffffffff00ffffffffffff6104b080947fffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000064ff0000000086891b1691161717169055601054926040519384526110d482614536565b8301526040820152a180f35b606482604051907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152600e60248201527f4c4556454c5f494e4143544956450000000000000000000000000000000000006044820152fd5b61115e9150833d8511611164575b6111568183614a87565b8101906151f8565b3861100a565b503d61114c565b6040513d86823e3d90fd5b8280fd5b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35767ffffffffffffffff906004358281116103dc576111cc9036906004016145a3565b9290602491823590811161145a576111e89036906004016145a3565b80869296036113fc57600a821161139e5761120582959495615074565b958460018043019485431196600b4301809711985b82811061123b57604051602080825281906112379082018f61456f565b0390f35b33855260206004815289604087205490611372578b611372579081808f8561132f918a8f8f8f8f90868f938f9261136d9f9e966005978f6112828660409a611301996150c3565b359a33895260039b8c83528a8a20848b5283528a8a20553389528b8252898920838a52825243908a8a2001553388528a815288882082895281526002898920017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0081541690553388528a815288882091885252600487872001556150c3565b35933382528a528181208882528a52200155338c526004865260408c20611328815461502f565b90556150d3565b5261133b838b8b6150c3565b35917f2c1c32a0b6860c2d724927516c372f04d3803b0c92051eb45a033c3c83177d46604051918d83523392a461502f565b61121a565b8c877f4e487b710000000000000000000000000000000000000000000000000000000081526011600452fd5b6064846018604051917f08c379a0000000000000000000000000000000000000000000000000000000008352602060048401528201527f546f6f206d616e7920636f6d6d697473206174206f6e636500000000000000006044820152fd5b6064846015604051917f08c379a0000000000000000000000000000000000000000000000000000000008352602060048401528201527f4172726179206c656e677468206d69736d6174636800000000000000000000006044820152fd5b8380fd5b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f3576114b960043561149c614513565b90808452836020526114b460016040862001546148a6565b614b12565b80f35b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f3576114f46145d4565b60043581526011602052600460408220015461152660ff8261151c82809560281c1615615210565b60301c1615615275565b6000906004358252601160205260408220906004820191650100000000007fffffffffffffffffffffffffffffffffffffffffffffffffffff00ffffffffff84541617809355600390428282015560058101546115828161505c565b926115906040519485614a87565b8184527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe06115bd8361505c565b01875b81811061183d57505060068301875b838110611799575050505073ffffffffffffffffffffffffffffffffffffffff6007541692600182015494611608828260201c16614536565b611616828260201c16614536565b843b1561179557949290918694926040519687957f9ae3c51800000000000000000000000000000000000000000000000000000000875260043560048801526024870152611668828260201c16614536565b60201c16604485015261168a60a091826064870152600560a487019101615649565b7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc8582030160848601526020808451928381520193019186905b82821061172357505050508383809203925af180156103e857611714575b506040519081527f716f3063a3b0e65531660dc2d5d241dfcf3b2983d26d7a70df643ad232d51783602060043592a280f35b61171d90614a03565b386116e2565b6001929597508396506020919481945173ffffffffffffffffffffffffffffffffffffffff815116825267ffffffffffffffff808583015116858401528060408301511660408401526060808301511515908401526080809201511690820152019501920192879593879593926116c4565b8680fd5b806117aa6118389260058801614df0565b9073ffffffffffffffffffffffffffffffffffffffff9182915490871b1c168b528360205260408b2060018154910154604051926117e784614a17565b821683528a67ffffffffffffffff92838160a81c166020860152838316604086015260a01c161515606084015260401c16608082015261182782896150d3565b5261183281886150d3565b5061502f565b6115cf565b60209060405161184c81614a17565b8a81528a838201528a60408201528a60608201528a6080820152828289010152016115c0565b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357604051907f3d6086d200000000000000000000000000000000000000000000000000000000825273ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016600483015260208260248173__$bcf66ed587f714e3ffb8bafad5409d838b$__5af490811561196b5790611939575b602090604051908152f35b506020813d8211611963575b8161195260209383614a87565b81010312610665576020905161192e565b3d9150611945565b604051903d90823e3d90fd5b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35760406020916004358152600183522054604051908152f35b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357604060809173ffffffffffffffffffffffffffffffffffffffff611a116144f0565b168152600360205281812060243582526020522060018101549060ff6002820154169060056004820154910154916040519384521515602084015260408301526060820152f35b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35760206040517f83aeca795846b427cef798c5053d6b58222df44008576b8d6159e88e329175ad8152f35b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35760206040516104b08152f35b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357611b246144f0565b60243567ffffffffffffffff811161117657611b449036906004016145a3565b9073ffffffffffffffffffffffffffffffffffffffff849316925b828110611bd4575060405190602082528260208301527f07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8311610e8b57816040917f78d0c440b837302f1d84bd6b81e603f079ef72d8bad8c935d13002d4d2e7cd199460051b8091848401378101030190a280f35b611c1990848652600360209080825260408820611bf28488886150c3565b3589528252604088206001908181015415159081611c64575b50611c1e575b50505061502f565b611b5f565b600060059281948a8c5281815260408c2090611c3b888c8c6150c3565b358d52528160408c20938185558401558a60028401558201558260048201550155388080611c11565b6004810154431191508115611c7b575b5038611c0b565b60ff9150600201541638611c74565b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357604060209160043581526011835220600481015460ff8160281c16159182611d10575b82611cef575b50506040519015158152f35b611d069250600263ffffffff910154911690614bc5565b4210153880611ce3565b915060ff8160301c161591611cdd565b50346103f3576020807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103dc5760043567ffffffffffffffff811161117657611d719036906004016145a3565b611d7c9291926145d4565b835b818110611d89578480f35b80611d98611dc59284876150c3565b358087526011855260046040882001805460ff808260281c169081611e23575b50611dca5750505061502f565b611d7e565b7fffffffffffffffffffffffffffffffffffffffffffffffffff00ffffffffffff1666010000000000001790557f0d44df2447ad08457aac2b0eb4cce9cd8220ae20431d62a8ea4dd69629fd2f0c8780a2388080611c11565b90508160301c161538611db8565b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35773ffffffffffffffffffffffffffffffffffffffff611e7e6144f0565b1681526003602052604081206024358252602052604081206001810154908115159182611f19575b82611ed1575b506020925081611ec2575b506040519015158152f35b60049150015443111538611eb7565b90915060018101809111611eec576020925043119038611eac565b6024837f4e487b710000000000000000000000000000000000000000000000000000000081526011600452fd5b600282015460ff16159250611ea6565b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35773ffffffffffffffffffffffffffffffffffffffff611f766144f0565b611f7e6145d4565b167fffffffffffffffffffffffff0000000000000000000000000000000000000000600f541617600f5580f35b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc818136011261117657600435918284526011815260408420612026600482015463ffffffff600260ff9461200d868560281c1615615210565b61201c868560301c1615615275565b0154911690614bc5565b42106123305783600052601182526040600020906004820193650100000000007fffffffffffffffffffffffffffffffffffffffffffffffffffff00ffffffffff8654161780955560039042828501556005840180546120858161505c565b936120936040519586614a87565b8185527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe06120c08361505c565b018860005b8281106122f7575050506006870160005b83811061225a575050505073ffffffffffffffffffffffffffffffffffffffff9081600754169460018097015498881c1661211081614536565b61211981614536565b853b156106655797939290916040519889957f9ae3c5180000000000000000000000000000000000000000000000000000000087528b6004880152602487015261216281614536565b604486015261217d60a09384606488015260a4870190615649565b918583030160848601528780855193848152019401926000915b888a85851061220657505050505050509181600081819503925af19283156121fa577f716f3063a3b0e65531660dc2d5d241dfcf3b2983d26d7a70df643ad232d51783936121eb575b50604051908152a280f35b6121f490614a03565b386121e0565b6040513d6000823e3d90fd5b86518051841689528082015167ffffffffffffffff9081168a8401526040808301518216908b01526060808301511515908b015260809182015116908901528c985096830196959095019490920191612197565b806122686122f29287614df0565b9073ffffffffffffffffffffffffffffffffffffffff9182915490871b1c16600052838c528b60406000208b6001825492015491604051946122a986614a17565b8116855267ffffffffffffffff93848260a81c1690860152838316604086015260a01c161515606084015260401c1660808201526122e7828a6150d3565b5261183281896150d3565b6120d6565b60405161230381614a17565b6000815260008382015260006040820152600060608201526000608082015282828a0101520189906120c5565b606482604051907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152600b60248201527f4e4f545f455850495245440000000000000000000000000000000000000000006044820152fd5b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602090604051908152f35b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f3576024359033815260209160048352604082205491600143019081431161250557600b43018092116125055790604084923381526003875281812084825287526004358282205533815260038752818120848252875243600183832001553381526003875281812084825287526002828220017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0081541690553381526003875281812084825287528260048383200155338152600387528181208482528752846005838320015533815260048752206124d0815461502f565b90556040519081527f2c1c32a0b6860c2d724927516c372f04d3803b0c92051eb45a033c3c83177d46853392a4604051908152f35b807f4e487b7100000000000000000000000000000000000000000000000000000000602492526011600452fd5b50346103f35760807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35760043560038110156103dc5760243560443591836064358015158091036103dc5761258b6145d4565b73ffffffffffffffffffffffffffffffffffffffff60065416906125ae84614536565b60ff8416906125bc82614536565b823b1561145a57608484928360405195869485937f92bf92480000000000000000000000000000000000000000000000000000000085526125fc81614536565b60048501528a60248501528b604485015260648401525af180156103e857612658575b50506126527f661124c8826d75343ee919baad251f50d4348b31f86cd88dabc18a6d96e351bd936040519384938461569c565b0390a180f35b61266190614a03565b61145a57833861261f565b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35773ffffffffffffffffffffffffffffffffffffffff60406126bb614513565b92600435815280602052209116600052602052602060ff604060002054166040519015158152f35b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35773ffffffffffffffffffffffffffffffffffffffff61274360209260043581526001845260406024359120614df0565b9190546040519260031b1c168152f35b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f3578061278c614513565b6127946145d4565b73__$bcf66ed587f714e3ffb8bafad5409d838b$__803b15612841576040517ff955b50100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000081166004808401919091523560248301529092166044830152829082908180606481015b03915af480156103e857610e7b5750f35b5050fd5b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f3578061287e614513565b6128866145d4565b73__$bcf66ed587f714e3ffb8bafad5409d838b$__803b15612841576040517f686f5a0c00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000008116600480840191909152356024830152909216604483015282908290818060648101612830565b50346103f35760607ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35760043560038110156103dc57602435604435916129716145d4565b8373ffffffffffffffffffffffffffffffffffffffff6007541661299483614536565b60ff83166129a181614536565b813b156111765782916064839260405194859384927f7cf4c4cd0000000000000000000000000000000000000000000000000000000084526129e281614536565b60048401528960248401528a60448401525af180156103e8576126585750506126527f661124c8826d75343ee919baad251f50d4348b31f86cd88dabc18a6d96e351bd936040519384938461569c565b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35760206040517fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c217758152f35b50346103f35760c07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357612ac3614513565b67ffffffffffffffff60a435116103dc5736602360a4350112156103dc5767ffffffffffffffff60a43560040135116103dc5736602460a4356004013560a4350101116103dc57612b126152da565b73ffffffffffffffffffffffffffffffffffffffff600f5416908133036130a45760043583526011602052600660408420612b5c60ff600483015461151c828260281c1615615210565b73ffffffffffffffffffffffffffffffffffffffff831660005201602052604060002090815473ffffffffffffffffffffffffffffffffffffffff821673ffffffffffffffffffffffffffffffffffffffff8216036130465760a01c60ff16612fe857606435928315612f8a5773ffffffffffffffffffffffffffffffffffffffff821685526012602052604085205460843503612f2c57612bfc6150e7565b604051907f83aeca795846b427cef798c5053d6b58222df44008576b8d6159e88e329175ad6020830152600435604083015273ffffffffffffffffffffffffffffffffffffffff8416606083015260443560808301528560a083015260843560c083015260c082528160e081011067ffffffffffffffff60e084011117612efd5760e0820160405281516020830120907f1901000000000000000000000000000000000000000000000000000000000000610100840152610102830152610122820152604260e082015260e0810161016082011067ffffffffffffffff61016083011117612efd57612d5f612d578261016073ffffffffffffffffffffffffffffffffffffffff940160405261010060e0820151910120612d2260a43560040135614c01565b90612d306040519283614a87565b60a435600481013580845290602401602084013789602060a4356004013584010152615575565b91909161540b565b1603612e9f5773ffffffffffffffffffffffffffffffffffffffff9167ffffffffffffffff806044351694612ddd8684907fffffff0000000000000000ffffffffffffffffffffffffffffffffffffffffff7cffffffffffffffff00000000000000000000000000000000000000000083549260a81b169116179055565b169060018101827fffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000825416179055740100000000000000000000000000000000000000007fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff8254161790558282168552601260205260408520612e60815461502f565b9055604051938452602084015216907f0666c04fa5fbe0b05a88e385492b569fcd91f702c82580f2ff0a2013ec12d295604060043592a3600160025580f35b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600b60248201527f494e56414c49445f5349470000000000000000000000000000000000000000006044820152fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600d60248201527f494e56414c49445f4e4f4e4345000000000000000000000000000000000000006044820152fd5b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f5a45524f5f53434f5245000000000000000000000000000000000000000000006044820152fd5b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600960248201527f5355424d495454454400000000000000000000000000000000000000000000006044820152fd5b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f4e4f545f504c41594552000000000000000000000000000000000000000000006044820152fd5b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f4e4f545f5349474e4552000000000000000000000000000000000000000000006044820152fd5b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357604060209173ffffffffffffffffffffffffffffffffffffffff6131546144f0565b168152601283522054604051908152f35b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f3578061319e614513565b6131a66145d4565b73__$bcf66ed587f714e3ffb8bafad5409d838b$__9073ffffffffffffffffffffffffffffffffffffffff6008541690823b15613241576040517fad7cc5a300000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff928316600480830191909152356024820152911660448201529082908290818060648101612830565b505050fd5b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357604060209173ffffffffffffffffffffffffffffffffffffffff6132986144f0565b168152600483522054604051908152f35b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35761330160406020926004358152601184522063ffffffff600460028301549201541690614bc5565b421015604051908152f35b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602073ffffffffffffffffffffffffffffffffffffffff60075416604051908152f35b50346103f35760807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f3576004359060248035926044938435906064938435943387526020966003885260408120868252885260408120600181015480156137465760ff6002830154166136eb57600181018091116136bf57431115613664576004015443116136095760409033815260038952818120878252895220978660058a0154036135af57604051888101908582528660408201526040815261342981614a33565b519020895403613555575050600187015491600554926040519488860192835260408601524460608601528040608086015260a08501523360601b60c08501528560d48501528260f485015260f4845261012084019184831067ffffffffffffffff84111761352857509181600393610160989993604052855190208098866101408398019485520152604081526134c081614a33565b5190206005556002810160017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0082541617905501556040518381527f5ed67831b1d8ad7d0b81cce82eff245333944fa87fe281fa31c2417f52b38733853392a4604051908152f35b7f4e487b710000000000000000000000000000000000000000000000000000000060005260416004526000fd5b7f496e76616c69642072657665616c0000000000000000000000000000000000008891600e85604051947f08c379a00000000000000000000000000000000000000000000000000000000086526004860152840152820152fd5b7f507572706f7365206d69736d61746368000000000000000000000000000000008891601085604051947f08c379a00000000000000000000000000000000000000000000000000000000086526004860152840152820152fd5b50867f52657665616c20646561646c696e65207061737365640000000000000000000089601685604051947f08c379a00000000000000000000000000000000000000000000000000000000086526004860152840152820152fd5b82897f546f6f206561726c7920746f2072657665616c000000000000000000000000008c601388604051947f08c379a00000000000000000000000000000000000000000000000000000000086526004860152840152820152fd5b84837f4e487b710000000000000000000000000000000000000000000000000000000081526011600452fd5b838a7f416c72656164792072657665616c6564000000000000000000000000000000008d601089604051947f08c379a00000000000000000000000000000000000000000000000000000000086526004860152840152820152fd5b838a7f4e6f20636f6d6d697420666f756e6400000000000000000000000000000000008d600f89604051947f08c379a00000000000000000000000000000000000000000000000000000000086526004860152840152820152fd5b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602060405173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168152f35b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602073ffffffffffffffffffffffffffffffffffffffff600d5416604051908152f35b50346103f357602090817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357600435815260118252604081209060058201918254906138b38261505c565b936138c16040519586614a87565b8285527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe06138ee8461505c565b01368787013760066138ff84615074565b949201915b838110613935576139288661123789886040519485946040865260408601906144a6565b918483039085015261456f565b806139436139a69284614df0565b73ffffffffffffffffffffffffffffffffffffffff809254600392831b1c1661396c848b6150d3565b526139778386614df0565b9054911b1c1660005283885267ffffffffffffffff600160406000200154166139a082886150d3565b5261502f565b613904565b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357806139e46144f0565b6139ec6145d4565b73__$bcf66ed587f714e3ffb8bafad5409d838b$__73ffffffffffffffffffffffffffffffffffffffff91826008541691803b15610e8b57849260649160405195869485937ff71c165e000000000000000000000000000000000000000000000000000000008552827f000000000000000000000000000000000000000000000000000000000000000016600486015260248501521660448301525af480156103e857610e7b5750f35b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602073ffffffffffffffffffffffffffffffffffffffff600e5416604051908152f35b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357604060e091600435815260116020522060018101549060ff6002820154916003810154906004810154916005848460201c169201549460405196875260208701526040860152613b6781614536565b6060850152818160281c161515608085015260301c16151560a083015260c0820152f35b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35760a09060066040613bca614513565b9260043581526011602052200173ffffffffffffffffffffffffffffffffffffffff809216600052602052604060002060018154910154604051928216835260ff67ffffffffffffffff92838160a81c1660208601528383166040860152851c161515606084015260401c166080820152f35b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602073ffffffffffffffffffffffffffffffffffffffff60095416604051908152f35b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357613cc7614513565b3373ffffffffffffffffffffffffffffffffffffffff821603613cf0576114b990600435614b12565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201527f20726f6c657320666f722073656c6600000000000000000000000000000000006064820152fd5b50346103f35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357613e106004356001613db4614513565b91808552602090858252613dcd836040882001546148a6565b80865285825273ffffffffffffffffffffffffffffffffffffffff6040872094169384600052825260ff6040600020541615613e14575b85525260408320614e08565b5080f35b808652858252604086208460005282526040600020837fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff008254161790553384827f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d8980a4613e04565b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602073ffffffffffffffffffffffffffffffffffffffff60065416604051908152f35b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f3576020601054604051908152f35b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602073ffffffffffffffffffffffffffffffffffffffff600a5416604051908152f35b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357600160406020926004358152808452200154604051908152f35b50346103f35760607ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35760ff604060209273ffffffffffffffffffffffffffffffffffffffff613ffb6144f0565b1681526003845281812060243582528452600682822001604435825284522054166040519015158152f35b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602060405160328152f35b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602073ffffffffffffffffffffffffffffffffffffffff60085416604051908152f35b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35761410861410f600560406112379460043581526011602052200160405192838092615649565b0382614a87565b6040519182916020835260208301906144a6565b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f35760043561415e6145d4565b808252601160205260046040832001805460ff8160281c16156141e0577fffffffffffffffffffffffffffffffffffffffffffffffffff00ffffffffffff816141b560ff66010000000000009460301c1615615275565b161790557f0d44df2447ad08457aac2b0eb4cce9cd8220ae20431d62a8ea4dd69629fd2f0c8280a280f35b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600b60248201527f47414d455f4143544956450000000000000000000000000000000000000000006044820152fd5b50346103f357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357602073ffffffffffffffffffffffffffffffffffffffff600c5416604051908152f35b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f357604081602092506004358152601183522060ff600482015460281c166000146142f757806002600361048193015491015490614ec9565b600261430591015442614ec9565b610481565b50346103f35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103f3576143426145d4565b8073ffffffffffffffffffffffffffffffffffffffff600c5416803b156143b25781906024604051809481937f02e06cc800000000000000000000000000000000000000000000000000000000835260043560048401525af180156103e8576143a9575080f35b6114b990614a03565b50fd5b9050346103dc5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103dc576004357fffffffff00000000000000000000000000000000000000000000000000000000811680910361117657602092507f5a05180f000000000000000000000000000000000000000000000000000000008114908115614449575b5015158152f35b7f7965db0b0000000000000000000000000000000000000000000000000000000081149150811561447c575b5038614442565b7f01ffc9a70000000000000000000000000000000000000000000000000000000091501438614475565b90815180825260208080930193019160005b8281106144c6575050505090565b835173ffffffffffffffffffffffffffffffffffffffff16855293810193928101926001016144b8565b6004359073ffffffffffffffffffffffffffffffffffffffff8216820361066557565b6024359073ffffffffffffffffffffffffffffffffffffffff8216820361066557565b6003111561454057565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b90815180825260208080930193019160005b82811061458f575050505090565b835185529381019392810192600101614581565b9181601f840112156106655782359167ffffffffffffffff8311610665576020808501948460051b01011161066557565b3360009081527f7d7ffb7a348e1c6a02869081a26547b49160dd3df72d1d75a570eb9b698292ec60209081526040808320549092907fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c217759060ff16156146395750505050565b61464233614c7b565b84519161464e83614a6b565b6042835284830193606036863783511561487957603085538351906001918210156148795790607860218601536041915b8183116147ae57505050614752576146da93859361471e9361470f60489461474e995198857f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008b9788015282519283916037890191016149e0565b8401917f206973206d697373696e6720726f6c65200000000000000000000000000000006037840152518093868401906149e0565b01036028810185520183614a87565b519182917f08c379a000000000000000000000000000000000000000000000000000000000835260048301614ac8565b0390fd5b6064848651907f08c379a000000000000000000000000000000000000000000000000000000000825280600483015260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152fd5b909192600f8116601081101561484c577f3031323334353637383961626364656600000000000000000000000000000000901a6147eb8588614c3b565b5360041c92801561481f577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01919061467f565b6024827f4e487b710000000000000000000000000000000000000000000000000000000081526011600452fd5b6024837f4e487b710000000000000000000000000000000000000000000000000000000081526032600452fd5b807f4e487b7100000000000000000000000000000000000000000000000000000000602492526032600452fd5b6000818152602090808252604092838220338352835260ff8483205416156148ce5750505050565b6148d733614c7b565b8451916148e383614a6b565b6042835284830193606036863783511561487957603085538351906001918210156148795790607860218601536041915b81831161496f57505050614752576146da93859361471e9361470f60489461474e995198857f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008b9788015282519283916037890191016149e0565b909192600f8116601081101561484c577f3031323334353637383961626364656600000000000000000000000000000000901a6149ac8588614c3b565b5360041c92801561481f577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff019190614914565b60005b8381106149f35750506000910152565b81810151838201526020016149e3565b67ffffffffffffffff8111612efd57604052565b60a0810190811067ffffffffffffffff821117612efd57604052565b6060810190811067ffffffffffffffff821117612efd57604052565b6040810190811067ffffffffffffffff821117612efd57604052565b6080810190811067ffffffffffffffff821117612efd57604052565b90601f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0910116810190811067ffffffffffffffff821117612efd57604052565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f60409360208452614b0b81518092816020880152602088880191016149e0565b0116010190565b906040614b5d926000908082528160205273ffffffffffffffffffffffffffffffffffffffff83832094169384835260205260ff8383205416614b60575b8152600160205220614ed6565b50565b808252816020528282208483526020528282207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0081541690553384827ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b8580a4614b50565b91908201809211614bd257565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b67ffffffffffffffff8111612efd57601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b908151811015614c4c570160200190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60405190614c8882614a33565b602a8252602082016040368237825115614c4c57603090538151600190811015614c4c57607860218401536029905b808211614d25575050614cc75790565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602060248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152fd5b9091600f81166010811015614dc2577f3031323334353637383961626364656600000000000000000000000000000000901a614d618486614c3b565b5360041c918015614d94577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0190614cb7565b602460007f4e487b710000000000000000000000000000000000000000000000000000000081526011600452fd5b602460007f4e487b710000000000000000000000000000000000000000000000000000000081526032600452fd5b8054821015614c4c5760005260206000200190600090565b91906001830160009082825280602052604082205415600014614ec35784549468010000000000000000861015614e965783614e86614e51886001604098999a01855584614df0565b81939154907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9060031b92831b921b19161790565b9055549382526020522055600190565b6024837f4e487b710000000000000000000000000000000000000000000000000000000081526041600452fd5b50925050565b91908203918211614bd257565b90600182019060009281845282602052604084205490811515600014615028577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff91828101818111614ffb57825490848201918211614fce57808203614f99575b50505080548015614f6c57820191614f4f8383614df0565b909182549160031b1b191690555582526020526040812055600190565b6024867f4e487b710000000000000000000000000000000000000000000000000000000081526031600452fd5b614fb9614fa9614e519386614df0565b90549060031b1c92839286614df0565b90558652846020526040862055388080614f37565b6024887f4e487b710000000000000000000000000000000000000000000000000000000081526011600452fd5b6024877f4e487b710000000000000000000000000000000000000000000000000000000081526011600452fd5b5050505090565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8114614bd25760010190565b67ffffffffffffffff8111612efd5760051b60200190565b9061507e8261505c565b61508b6040519182614a87565b8281527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe06150b9829461505c565b0190602036910137565b9190811015614c4c5760051b0190565b8051821015614c4c5760209160051b010190565b7f53776f7264426174746c65000000000000000000000000000000000000000000602060405161511681614a4f565b600b815201527f3100000000000000000000000000000000000000000000000000000000000000602060405161514b81614a4f565b60018152015260405160208101907f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f82527f3f696bb35ca88e80cd8e6d0597864b656823873afba3fefff14622cda27ab5d060408201527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc660608201524660808201523060a082015260a0815260c0810181811067ffffffffffffffff821117612efd5760405251902090565b90816020910312610665575180151581036106655790565b1561521757565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f47414d455f454e444544000000000000000000000000000000000000000000006044820152fd5b1561527c57565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600c60248201527f47414d455f434c45414e454400000000000000000000000000000000000000006044820152fd5b60028054146152e95760028055565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152fd5b919290156153c2575081511561535b575090565b3b156153645790565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152fd5b8251909150156153d55750805190602001fd5b61474e906040519182917f08c379a000000000000000000000000000000000000000000000000000000000835260048301614ac8565b6005811015614540578061541c5750565b600181036154825760646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152fd5b600281036154e85760646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152fd5b6003146154f157565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c60448201527f75650000000000000000000000000000000000000000000000000000000000006064820152fd5b9060418151146000146155a35761559f916020820151906060604084015193015160001a906155ad565b9091565b5050600090600290565b9291907f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0831161563d5791608094939160ff602094604051948552168484015260408301526060820152600093849182805260015afa1561563057815173ffffffffffffffffffffffffffffffffffffffff81161561562a579190565b50600190565b50604051903d90823e3d90fd5b50505050600090600390565b90815480825260208092019260005281600020916000905b82821061566f575050505090565b835473ffffffffffffffffffffffffffffffffffffffff1685529384019360019384019390910190615661565b606081019493926040926156af81614536565b82526020820152015256fea264697066735822122073f33ffa97014f436852a00f3c581dea901e353f3746e1934ed59f487cf2fc3764736f6c63430008120033',
      sourceMap:
        '888:24821:52:-:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;24225:43;888:24821;24225:43;;;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;24568:50;;888:24821;24608:9;888:24821;;24568:50;;888:24821;24568:50;:17;888:24821;24568:17;;:50;;;;;;;;;;;;;;888:24821;;24568:50;888:24821;;;;;;;;;;;;;;;;24568:50;;;;;;;;;;;;;;;;;;;:::i;:::-;;;888:24821;;;;24568:50;888:24821;;;;;;;;;;;;24568:50;;;;;888:24821;;;;24568:50;;;-1:-1:-1;24568:50:52;;;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;;2718:28;888:24821;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2642:4:15;;;;:::i;:::-;888:24821:52;22970:25;22966:88;;888:24821;;;23067:24;23063:92;;888:24821;23168:23;;23164:84;;888:24821;23261:30;;23257:113;;888:24821;23383:28;;23379:105;;888:24821;23497:27;;23493:107;;888:24821;;;23493:107;888:24821;23540:49;888:24821;;;23540:49;888:24821;;;23379:105;888:24821;23427:46;888:24821;;;23427:46;888:24821;23379:105;;;23257:113;888:24821;23307:52;888:24821;;;23307:52;888:24821;23257:113;;;23164:84;888:24821;23207:30;888:24821;;;23207:30;888:24821;23164:84;;;23063:92;888:24821;23107:37;888:24821;;;23107:37;888:24821;23063:92;;;22966:88;888:24821;23011:32;888:24821;;;23011:32;888:24821;22966:88;;;888:24821;;;;;;;;;;;;;;;;;;;2227:103:20;;;:::i;:::-;6224:10:52;;;:35;;;888:24821;;;;;;;6306:6;888:24821;;;;;;6339:10;;888:24821;;6330:34;888:24821;;;;;6338:11;6330:34;:::i;:::-;6374:38;888:24821;;;;;6382:13;6374:38;:::i;:::-;6443:16;;;6460:10;888:24821;;;;;;;;;;;;;;6550:12;;;2906:2;888:24821;;6550:42;888:24821;;;;;6443:16;888:24821;;;;;;;;;;:::i;:::-;;;;:::i;:::-;;;;6636:99;;;;888:24821;6636:99;;888:24821;;;:::i;:::-;;6636:99;;888:24821;;6636:99;;;;;;;;;;;;;;888:24821;6753:9;;;888:24821;;;;6753:31;;6460:10;888:24821;6753:31;;888:24821;6753:31;;;;;;;;;;;;;;;;;888:24821;6753:43;;888:24821;;;;5535:69:32;888:24821:52;;;;;1482:68:25;;;;888:24821:52;1482:68:25;;6460:10:52;1482:68:25;;;888:24821:52;6870:4;888:24821;;;;;;;;;;1482:68:25;;;;;:::i;:::-;888:24821:52;;;;;;;:::i;:::-;;;;;;;5487:31:32;;;;;;;888:24821:52;;;;;;;;:::i;:::-;;;;;;;;:::i;:::-;;;;;;;;;;5535:69:32;:::i;:::-;888:24821:52;;5705:22:25;;;;:56;;;;;888:24821:52;;;;;;;;;;;;;;;;;;7177:32;888:24821;;;;7135:26;888:24821;;;;;;;;;;;;;:::i;:::-;;;;;;6460:10;;;888:24821;;;;;;;;;;;;;;;:::i;:::-;6460:10;888:24821;;6966:159;;;888:24821;;;6966:159;;;888:24821;;;;;6966:159;;888:24821;;;;6966:159;;;888:24821;;;6460:10;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;7135:14;888:24821;;;7135:26;:::i;:::-;888:24821;;;;;;;6460:10;888:24821;;;;7177:32;888:24821;2809:22:20;888:24821:52;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;5705:56:25;5731:30;;-1:-1:-1;5731:30:25;;;;;;;:::i;:::-;5705:56;;;;;888:24821:52;;;-1:-1:-1;5535:69:32;:::i;888:24821:52:-;;;;;;;;;;;;;;;;;;;;;;;;6753:31;;;;;;;;;;;;;;;;;;:::i;:::-;;;888:24821;;;;;;;6753:31;;;;;;;;;888:24821;;;;;;;;;6636:99;;;;;;;;;;;;;;;;;:::i;:::-;;;888:24821;;;;;6636:99;;;;;;;;;;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;6224:35;888:24821;6248:11;888:24821;6238:21;;;6224:35;;888:24821;;;;;;;;;;;;;;2538:39;888:24821;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;2642:4:15;;;:::i;:::-;888:24821:52;;;19422:6;888:24821;;;;;;;19455:10;888:24821;;;;;;;;;;;;;19519:8;888:24821;;;;;;;;;;;19519:35;888:24821;;;19519:35;888:24821;;;;;;;19618:13;888:24821;;19618:60;;;;;888:24821;;;;;;;19618:60;;;;;888:24821;19618:60;;888:24821;19618:60;;888:24821;;;;;;;;;19618:60;;;;;;;;888:24821;;19618:60;;;;:::i;:::-;888:24821;;19618:60;888:24821;19618:60;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2642:4:15;;:::i;:::-;888:24821:52;5672:17;888:24821;;;;;:::i;:::-;;;;;;;;:::i;:::-;;;;5672:104;;;;888:24821;5672:104;;888:24821;;;:::i;:::-;;5672:104;;888:24821;5672:104;;;;;;;;;;;888:24821;;;;;6091:46;888:24821;;;5827:13;;888:24821;5827:13;:::i;:::-;888:24821;;5827:13;888:24821;;;;5870:6;888:24821;;;;;;;;;5934:10;;888:24821;;;:::i;:::-;;;5979:15;5962:14;5979:15;5962:14;;888:24821;;2824:4;888:24821;;;;;;;;;;;;;;;5827:13;888:24821;;;;;;;;;;:::i;:::-;;;;;;;;6091:46;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;;5672:104;;;;;;;;;;;;;;;:::i;:::-;;;;;:::i;:::-;;;;;;;;;;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;:::i;:::-;4869:37:43;;;;;888:24821:52;;4972:2:43;4950:24;;888:24821:52;;5023:33:43;;;;;;:::i;:::-;5072:13;;1506:1:60;5202:12:43;;888:24821:52;5202:12:43;;;888:24821:52;5202:12:43;888:24821:52;5202:12:43;888:24821:52;;;;5067:839:43;5087:22;;;;;;888:24821:52;;;;;;;;;;;;;;:::i;:::-;;;;5111:3:43;5158:10;888:24821:52;;;;;;;;;;;;;;;;;5379:14:43;;;;;5703:17;5379:14;;;;;;;;;;;;5111:3;5379:14;;;5594:41;5379:14;;;;888:24821:52;5379:14:43;5638:11;5379:14;;:::i;:::-;888:24821:52;5158:10:43;;888:24821:52;;5338:8:43;888:24821:52;;;;;;;;;;;;;;;;5158:10:43;888:24821:52;;;;;;;;;;;;;5202:12:43;888:24821:52;;;;5407:39:43;888:24821:52;5158:10:43;888:24821:52;;;;;;;;;;;;;5475:36:43;888:24821:52;;;5475:36:43;888:24821:52;;;;;;5158:10:43;888:24821:52;;;;;;;;;;;;;;;;5533:36:43;888:24821:52;5638:11:43;:::i;:::-;888:24821:52;5158:10:43;;888:24821:52;;;;;;;;;;;;;5594:41:43;888:24821:52;5158:10:43;888:24821:52;;;;;;;;5664:25:43;888:24821:52;;5664:25:43;:::i;:::-;888:24821:52;;5703:17:43;:::i;:::-;888:24821:52;5844:11:43;;;;;:::i;:::-;888:24821:52;;5740:155:43;888:24821:52;;;;;;5158:10:43;5740:155;;5111:3;:::i;:::-;5072:13;;888:24821:52;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;5486:7:15;888:24821:52;;;;:::i;:::-;;;;;;;;2642:4:15;888:24821:52;;;;4604:22:15;888:24821:52;2642:4:15;:::i;:::-;5486:7;:::i;:::-;888:24821:52;;;;;;;;;;;;;;2642:4:15;;:::i;:::-;888:24821:52;;;;9502:6;888:24821;;;;;;9535:10;888:24821;9570:38;888:24821;;9526:34;888:24821;;;;;;9534:11;9526:34;:::i;:::-;888:24821;;;9578:13;9570:38;:::i;:::-;888:24821;;;;;;9502:6;888:24821;;;;;9783:10;888:24821;9783:10;;888:24821;;;;;;;;;;9810:12;9825:15;;9810:12;;;888:24821;10274:12;;;888:24821;;;;:::i;:::-;;;;;;;;:::i;:::-;;;;;;;;:::i;:::-;;;;;;;;;-1:-1:-1;;10407:16:52;;;10322:13;10337:23;;;;;;888:24821;;;;;10795:17;888:24821;;10868:14;9796:4;10868:14;;888:24821;;;;;;;;;:::i;:::-;;;;;;;;:::i;:::-;10795:208;;;;;888:24821;;;;;;;;;10795:208;;;888:24821;10795:208;;888:24821;;;10795:208;;888:24821;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;10274:12;888:24821;;;10274:12;;888:24821;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;10795:208;;;;;;;;;;;;;;;;;;888:24821;;;;;;;9964:28;888:24821;;;9964:28;;888:24821;;10795:208;;;;:::i;:::-;;;;888:24821;9796:4;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;10795:208;888:24821;;;10362:3;10274:12;10424:15;10362:3;10274:12;;;;10424:15;:::i;:::-;888:24821;;;;;;;;;;;;;;;;;;;9796:4;888:24821;;10597:10;;888:24821;;;;;;;:::i;:::-;;;;;;;;;;;;;;10471:247;;888:24821;;;;;10471:247;;888:24821;;;;;;;10471:247;;888:24821;;;;;10471:247;;888:24821;10454:264;;;;:::i;:::-;;;;;;:::i;:::-;;10362:3;:::i;:::-;10322:13;;888:24821;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;24225:43;888:24821;24225:43;;888:24821;24258:9;888:24821;;24225:43;;888:24821;24225:43;:17;888:24821;24225:17;;:43;;;;;;;;;;888:24821;24225:43;888:24821;;;;;;;24225:43;;;;;;;;;;;;;;;;:::i;:::-;;;888:24821;;;;24225:43;888:24821;;24225:43;;;;;-1:-1:-1;24225:43:52;;;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;9781:8:43;888:24821:52;;;;;;;;;;;;;9833:18:43;;888:24821:52;9865:15:43;888:24821:52;9865:15:43;;;888:24821:52;;9894:15:43;9923:20;888:24821:52;9894:15:43;;888:24821:52;9923:20:43;;888:24821:52;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2246:123;888:24821;;;;;;;;;;;;;;;;;;2824:4;888:24821;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;:::i;:::-;7229:13:43;888:24821:52;7229:13:43;888:24821:52;;7224:431:43;7244:17;;;;;;888:24821:52;;;;;;;;;;;;;;;;;;;;7670:46:43;888:24821:52;;;;;;;;;;;7670:46:43;;;;888:24821:52;;7263:3:43;;888:24821:52;;;;7331:8:43;888:24821:52;;;;;;;;7363:9:43;;;;;:::i;:::-;888:24821:52;;;;;;;;;7472:18:43;;;;888:24821:52;7472:22:43;;:93;;;;7263:3;7451:194;;;7263:3;;;;;:::i;:::-;7229:13;;7451:194;888:24821:52;;;;;;;;;;;;;;7620:9:43;;;;;;:::i;:::-;888:24821:52;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;7451:194:43;;;;;7472:93;888:24821:52;7530:15:43;;888:24821:52;7515:12:43;:30;;-1:-1:-1;7515:49:43;;;;7472:93;;;;;7515:49;888:24821:52;7549:15:43;;;;888:24821:52;;7515:49:43;;;888:24821:52;;;;;;;;;;;;;;;;;;;12788:6;888:24821;;;;12832:10;;888:24821;;;;;;12831:11;:40;;;;888:24821;12831:109;;;888:24821;;;;;;;;;;;12831:109;12906:34;:14;;;888:24821;12906:14;;888:24821;;;12906:34;;:::i;:::-;12887:15;:53;;12831:109;;;;:40;888:24821;;;;;;;12858:13;12831:40;;;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;2642:4:15;;;;;:::i;:::-;20279:13:52;20294:18;;;;;;888:24821;;;20314:3;20350:10;;20314:3;20350:10;;;;:::i;:::-;888:24821;;;;20394:6;888:24821;;;;;;20427:10;888:24821;;;;;;;;20427:27;;;;20314:3;20423:127;;;20314:3;;;;:::i;:::-;20279:13;;20423:127;888:24821;;;;;;20516:19;;;;20423:127;;;;;20427:27;888:24821;;;;;;20441:13;20427:27;;;888:24821;;;;;;;;;;;;;;;:::i;:::-;;;;8891:8:43;888:24821:52;;;;;;;;;;;;;;;8941:18:43;;888:24821:52;8941:22:43;;;;:54;;;;888:24821:52;8941:153:43;;;888:24821:52;8941:200:43;888:24821:52;8941:200:43;;;;;888:24821:52;;;;;;;;;;8941:200:43;888:24821:52;9126:15:43;;;888:24821:52;9110:12:43;:31;;8941:200;;;:153;888:24821:52;;;;;;;;;;;;9011:12:43;;;:83;8941:153;;;;888:24821:52;;;;;;;;;;8941:54:43;8980:15;;;888:24821:52;;;8979:16:43;;-1:-1:-1;8941:54:43;;888:24821:52;;;;;;;;;;;;;;;:::i;:::-;2642:4:15;;:::i;:::-;888:24821:52;;21726:25;888:24821;;;21726:25;888:24821;;;;;;;;;;;;;;;;;;;;;;;9129:6;888:24821;;;;;9285:34;888:24821;9162:10;;888:24821;;9285:14;888:24821;;9153:34;888:24821;;;;;9161:11;9153:34;:::i;:::-;9197:38;888:24821;;;;;9205:13;9197:38;:::i;:::-;9285:14;888:24821;;;9285:34;;:::i;:::-;9266:15;:53;888:24821;;;;;9129:6;888:24821;;;;;9783:10;888:24821;9783:10;;888:24821;;;;;;;;;;9810:12;9266:15;;9810:12;;;888:24821;10274:12;;;888:24821;;;;;:::i;:::-;;;;;;;;:::i;:::-;;;;;;;;:::i;:::-;;;;;;;;;;-1:-1:-1;;;10407:16:52;;;888:24821;10337:23;;;;;;888:24821;;;;;;;10795:17;888:24821;;9391:4;;10868:14;;;888:24821;;;;;;;;:::i;:::-;;;;:::i;:::-;10795:208;;;;;888:24821;;;;;;;10795:208;;;888:24821;10795:208;;;888:24821;10795:208;;888:24821;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;10795:208;;;;;;;;;888:24821;10795:208;;;;;;;;;;;;9964:28;10795:208;;;888:24821;;;;;;;9964:28;888:24821;;10795:208;;;;:::i;:::-;;;;;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;888:24821:52;;;;;;;;;;;;;;;10362:3;10424:15;;10362:3;10424:15;;;:::i;:::-;888:24821;;;;;;;;;;;;;;;;;;;;;9391:4;888:24821;;10597:10;;888:24821;;;;;;;;:::i;:::-;;;;;;;;;;;;10471:247;;;888:24821;;;;;10471:247;;888:24821;;;;;;;10471:247;;888:24821;;;;;10471:247;;888:24821;10454:264;;;;:::i;:::-;;;;;;:::i;10362:3::-;10322:13;;888:24821;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1974:10:43;;888:24821:52;;;;;;;;;;;2014:12:43;888:24821:52;2014:12:43;888:24821:52;2014:12:43;;;888:24821:52;;;;2014:12:43;888:24821:52;;;;;;1974:10:43;888:24821:52;1974:10:43;;;888:24821:52;;2138:8:43;888:24821:52;;;;;;;;;;;;;;;;1974:10:43;888:24821:52;;2138:8:43;888:24821:52;;;;;;;;;;2014:12:43;888:24821:52;;;;2199:39:43;888:24821:52;1974:10:43;888:24821:52;;2138:8:43;888:24821:52;;;;;;;;;;2263:36:43;888:24821:52;;;2263:36:43;888:24821:52;;;;;;1974:10:43;888:24821:52;;2138:8:43;888:24821:52;;;;;;;;;;;;;;;2317:36:43;888:24821:52;1974:10:43;888:24821:52;;2138:8:43;888:24821:52;;;;;;;;;;;2374:41:43;888:24821:52;;;2374:41:43;888:24821:52;1974:10:43;888:24821:52;;;;;;2436:25:43;888:24821:52;;2436:25:43;:::i;:::-;888:24821:52;;;;;;;2477:131:43;1974:10;;2477:131;;888:24821:52;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2642:4:15;;:::i;:::-;888:24821:52;21937:17;888:24821;;;;;;:::i;:::-;;;;;;;;:::i;:::-;21937:166;;;;;888:24821;;;;;;21937:166;;;;;888:24821;21937:166;;888:24821;;;:::i;:::-;;21937:166;;888:24821;;;;;;;;;;;;;;;21937:166;;;;;;;;888:24821;;;22118:42;;888:24821;;;22118:42;;;;;:::i;:::-;;;;888:24821;;21937:166;;;;:::i;:::-;888:24821;;21937:166;;;;888:24821;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;5005:18:40;888:24821:52;;;;;;;;;;;;;;5005:18:40;:::i;:::-;888:24821:52;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;2642:4:15;;:::i;:::-;23781:17:52;:57;;;;;888:24821;;;23781:57;;888:24821;23816:9;888:24821;;;23781:57;;;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;23781:57;;;;;;;;;;;888:24821;;23781:57;888:24821;;;;;;;;;;;;;;;;;;:::i;:::-;2642:4:15;;:::i;:::-;24812:17:52;:60;;;;;888:24821;;;24812:60;;888:24821;24850:9;888:24821;;;24812:60;;;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;24812:60;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;2642:4:15;;;:::i;:::-;888:24821:52;;22379:17;888:24821;;;;;:::i;:::-;;;;;;;:::i;:::-;22379:153;;;;;888:24821;;;;;;;22379:153;;;;;888:24821;22379:153;;888:24821;;;:::i;:::-;;22379:153;;888:24821;;;;;;;;;;;22379:153;;;;;;;;888:24821;;22604:50;;888:24821;;;22604:50;;;;;:::i;888:24821::-;;;;;;;;;;;;;;;1187:23;888:24821;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2227:103:20;;:::i;:::-;888:24821:52;1562:13;888:24821;;1548:10;;;:27;888:24821;;;;;;8191:6;888:24821;;8339:16;888:24821;;;8259:38;888:24821;;8224:10;;888:24821;8215:34;888:24821;;;;;8223:11;8215:34;:::i;8259:38::-;888:24821;;;;;8339:16;888:24821;;;;;;;;;;;;;;8381:27;888:24821;;;;;;;;;;8494:9;;;888:24821;;;;;;;8545:12;888:24821;;;;;;;;8536:29;888:24821;;7533:17;;:::i;:::-;888:24821;;7607:269;2246:123;888:24821;7607:269;;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;7607:269;;888:24821;;;;;;;;;;;;;;;;;;;;;7607:269;;7572:326;7463:453;888:24821;7463:453;;;888:24821;;;;;;;;;;;;;7463:453;888:24821;;;;;;;;;;;;;;;3849:5:35;3800:27;888:24821:52;;;;;;;7463:453;888:24821;;;;7463:453;;7436:494;888:24821;;;;;;;:::i;:::-;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;3800:27:35;:::i;:::-;3849:5;;;;:::i;:::-;888:24821:52;8754:40;888:24821;;;;;;;;;8821:32;;;;888:24821;;;;;;;;;;;;;;;8821:32;888:24821;8863:16;888:24821;8863:16;;888:24821;;;;;;;;;;;;;;;;;;;;;8545:12;888:24821;;;;;8942:22;888:24821;;8942:22;:::i;:::-;888:24821;;;;;;;;;;;;;8980:60;888:24821;;;8980:60;;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;21566:12;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;2642:4:15;;:::i;:::-;24024:17:52;888:24821;;24061:10;888:24821;;24024:60;;;;;;888:24821;;;24024:60;;888:24821;;;;;24024:60;;;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;24024:60;888:24821;24024:60;888:24821;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;12642:34;888:24821;;;;;;;12592:6;888:24821;;;;;12642:14;;;888:24821;12659:17;;888:24821;;12642:34;;:::i;:::-;12623:15;:53;;888:24821;;;;;;;;;;;;;;;;;;;;1379:42;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;3087:10:43;;888:24821:52;;;;822:8:43;888:24821:52;;;;;;;;;;;;;;861:18:43;;888:24821:52;861:22:43;;888:24821:52;;;922:15:43;;;888:24821:52;;;;;;;;;;;;989:12:43;:87;888:24821:52;;;;1155:15:43;888:24821:52;989:12:43;1139:31;888:24821:52;;;3087:10:43;;888:24821:52;;822:8:43;888:24821:52;;;;;;;;;;;3311:20:43;;;;;888:24821:52;3311:31:43;888:24821:52;;;;3440:35:43;;;888:24821:52;;;;;;;;;;3440:35:43;;;;;:::i;:::-;888:24821:52;3430:46:43;;888:24821:52;;3494:33:43;888:24821:52;;3837:18:43;;888:24821:52;3837:18:43;;888:24821:52;;3311:20:43;888:24821:52;;;;3692:323:43;;;;888:24821:52;;;;;;;3789:16:43;888:24821:52;;;;3827:29:43;;888:24821:52;;;;;;;;3087:10:43;888:24821:52;;;;;;;;;;;;;;;;;3692:323:43;;888:24821:52;;;;;;;;;;;;;;;;822:8:43;888:24821:52;;;;;;;;;3665:364:43;;4135:50;;;;;;;888:24821:52;;;;;;4135:50:43;;;;;:::i;:::-;888:24821:52;4125:61:43;;3311:20;888:24821:52;922:15:43;4207;;888:24821:52;;;;;;;;4239:22:43;888:24821:52;;;;;;4292:134:43;3087:10;;4292:134;;888:24821:52;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2376:33;888:24821;;;;;;;;;;;;;;;;;;2624:39;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;;11838:6;888:24821;;;;;11884:12;;;;888:24821;;;;;;;:::i;:::-;;;;;;;;:::i;:::-;;;;;;;;:::i;:::-;;;;;;;12115:16;11968:26;;;:::i;:::-;12010:13;12115:16;;12005:160;12025:15;;;;;;888:24821;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;:::i;12042:3::-;12074:15;;12042:3;12074:15;;;:::i;:::-;888:24821;;;;;;;;;;12061:28;;;;:::i;:::-;888:24821;12132:15;;;;:::i;:::-;888:24821;;;;;;;;;;;;;;;;12115:39;888:24821;;12103:51;;;;:::i;:::-;888:24821;12042:3;:::i;:::-;12010:13;;888:24821;;;;;;;;;;;;;;;:::i;:::-;2642:4:15;;:::i;:::-;25020:17:52;888:24821;;;25070:10;888:24821;;25020:65;;;;;;888:24821;;;;;;25020:65;;;;;888:24821;25020:65;;25059:9;;888:24821;;25020:65;;888:24821;;;;;;;;;;25020:65;;;;;;;;888:24821;;;;;;;;;;;;;;;;2669:42;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;;;11404:6;888:24821;;;;11449:14;;888:24821;11477:14;888:24821;11477:14;;;888:24821;11505:12;;;;888:24821;11531:10;888:24821;11531:10;;888:24821;;11605:12;888:24821;;;;;11605:12;;888:24821;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;20984:16;888:24821;;;:::i;:::-;;;;;;20928:6;888:24821;;;20984:16;888:24821;;;;;;;;;;;;;;21100:16;;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2445:30;888:24821;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;719:10:33;888:24821:52;;;6133:23:15;888:24821:52;;6237:7:15;888:24821:52;;;6237:7:15;:::i;888:24821:52:-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;8398:50:40;888:24821:52;;;;;:::i;:::-;;;;;;;;;;2642:4:15;888:24821:52;;;;4604:22:15;888:24821:52;2642:4:15;:::i;:::-;888:24821:52;;;;;;;;;;;;;;;;;;;;;;;;7669:23:15;7665:149;;888:24821:52;;;;;;;8398:50:40;:::i;:::-;;888:24821:52;;7665:149:15;888:24821:52;;;;;;;;;;;;;;;;;;;;;;;;;719:10:33;7763:40:15;;;;;;7665:149;;888:24821:52;;;;;;;;;;;;;;1331:42;888:24821;;;;;;;;;;;;;;;;;;;;;2752:26;888:24821;;;;;;;;;;;;;;;;;;;;;2481:24;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;4604:22:15;888:24821:52;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;10636:8:43;888:24821:52;;;;;;;;;;;10636:34:43;888:24821:52;;;10636:34:43;888:24821:52;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2906:2;888:24821;;;;;;;;;;;;;;;;;2415:24;888:24821;;;;;;;;;;;;;;;;;;;;;;21368:12;888:24821;;;;;;;21337:6;888:24821;;;21368:12;888:24821;;;;;;;:::i;:::-;;;;:::i;:::-;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;2642:4:15;;:::i;:::-;888:24821:52;;;19983:6;888:24821;;;;;;20015:10;888:24821;;;;;;;;;;;;20051:38;888:24821;;;;;;20059:13;20051:38;:::i;:::-;888:24821;;;;20134:19;;;;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2583:35;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;;;;;12303:6;888:24821;;;;;12331:10;;888:24821;;;;12327:155;888:24821;;;12368:12;12383:14;12368:12;:29;:12;;888:24821;12383:14;;888:24821;12368:29;;:::i;12327:155::-;12457:14;12439:32;12457:14;;888:24821;12439:15;:32;:::i;:::-;12327:155;;888:24821;;;;;;;;;;;;2642:4:15;;:::i;:::-;888:24821:52;;19837:13;888:24821;;19837:36;;;;;888:24821;;;;;19837:36;;;;888:24821;19837:36;;888:24821;;;19837:36;;888:24821;19837:36;;;;;;;;888:24821;;;19837:36;;;;:::i;:::-;888:24821;;;;;;;;;;;;;;;;;;;;;;;;;;742:57:16;;757:42;742:57;;:97;;;;;888:24821:52;;;;;;;742:97:16;2855:32:15;2840:47;;;-1:-1:-1;2840:87:15;;;;742:97:16;;;;;2840:87:15;952:25:36;937:40;;;2840:87:15;;;888:24821:52;;;;;;;;;;;;;;;-1:-1:-1;888:24821:52;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;:::o;:::-;;-1:-1:-1;888:24821:52;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;888:24821:52;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;3460:103:15:-;719:10:33;3130:6:15;888:24821:52;;;;;;;;;;;;;;;3130:6:15;1187:23:52;;888:24821;;3931:23:15;3927:390;;3460:103;;;;:::o;3927:390::-;2497:52:34;719:10:33;2497:52:34;:::i;:::-;888:24821:52;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;1975:15:34;;;888:24821:52;;;;;;;;;;;2000:15:34;888:24821:52;;;2000:15:34;888:24821:52;2025:128:34;2058:5;;;;;;2170:10;;;278:18;;888:24821:52;;;;4022:252:15;888:24821:52;;;;3970:336:15;888:24821:52;;4022:252:15;;888:24821:52;4022:252:15;;;;888:24821:52;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;:::i;:::-;;4022:252:15;;;;;;;;;:::i;:::-;888:24821:52;3970:336:15;;;;;;2141:1:34;3970:336:15;;;:::i;:::-;;;;278:18:34;;888:24821:52;;;278:18:34;;;;;2141:1;278:18;;;;;;888:24821:52;278:18:34;888:24821:52;;;278:18:34;;2065:3;2105:11;;;2113:3;2105:11;;2096:21;;;;;;888:24821:52;2096:21:34;;2084:33;;;;:::i;:::-;;2141:1;888:24821:52;2065:3:34;888:24821:52;;;;;;2030:26:34;;;;888:24821:52;;;;;;;2141:1:34;888:24821:52;;2096:21:34;888:24821:52;;;;;;2141:1:34;888:24821:52;;;;;;;;;;;;3460:103:15;3130:6;888:24821:52;;;;;;;;;;;;;719:10:33;888:24821:52;;;;;;;;;;3931:23:15;3927:390;;3460:103;;;;:::o;3927:390::-;2497:52:34;719:10:33;2497:52:34;:::i;:::-;888:24821:52;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;1975:15:34;;;888:24821:52;;;;;;;;;;;2000:15:34;888:24821:52;;;2000:15:34;888:24821:52;2025:128:34;2058:5;;;;;;2170:10;;;278:18;;888:24821:52;;;;4022:252:15;888:24821:52;;;;3970:336:15;888:24821:52;;4022:252:15;;888:24821:52;4022:252:15;;;;888:24821:52;;;;;;;;;;;;:::i;2065:3:34:-;2105:11;;;2113:3;2105:11;;2096:21;;;;;;888:24821:52;2096:21:34;;2084:33;;;;:::i;:::-;;2141:1;888:24821:52;2065:3:34;888:24821:52;;;;;;2030:26:34;;;;888:24821:52;;;;;;;;-1:-1:-1;;888:24821:52;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;:::o;2233:171:16:-;;888:24821:52;8719:53:40;2233:171:16;3130:6:15;888:24821:52;;;;;;;;;;;;;;;;;;;;;;;;;8070:149:15;;2233:171:16;888:24821:52;;2363:12:16;888:24821:52;;;8719:53:40;:::i;:::-;;2233:171:16:o;8070:149:15:-;888:24821:52;;;;;;;;;;;;;;;;;;;;;;;719:10:33;8168:40:15;;;;;;8070:149;;888:24821:52;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;1818:437:34;888:24821:52;;;;;;:::i;:::-;;;;;;;;;;;;;;;;1975:15:34;;;888:24821:52;;;;;;;;;2000:15:34;888:24821:52;;;2000:15:34;888:24821:52;2025:128:34;2058:5;;;;;;2170:10;;278:18;;1818:437;:::o;278:18::-;;888:24821:52;;278:18:34;;;888:24821:52;2141:1:34;278:18;;;888:24821:52;278:18:34;;;888:24821:52;278:18:34;888:24821:52;;;278:18:34;;2065:3;2105:11;;2113:3;2105:11;;2096:21;;;;;;888:24821:52;2096:21:34;;2084:33;;;;:::i;:::-;;2141:1;888:24821:52;2065:3:34;888:24821:52;;;;;;2030:26:34;;;888:24821:52;;-1:-1:-1;888:24821:52;;;;2141:1:34;888:24821:52;;2096:21:34;888:24821:52;-1:-1:-1;888:24821:52;;;;2141:1:34;888:24821:52;;;;;;;;;;-1:-1:-1;888:24821:52;;-1:-1:-1;888:24821:52;;;-1:-1:-1;888:24821:52;:::o;2214:404:40:-;;;4351:12;;;-1:-1:-1;888:24821:52;;;;;;;;;;;4351:24:40;2293:319;888:24821:52;;;;;;;;;;;;;;;;4351:12:40;888:24821:52;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;4351:12:40;2547:11;:::o;888:24821:52:-;;;;;;;;;;2293:319:40;-1:-1:-1;2589:12:40;-1:-1:-1;;2589:12:40:o;888:24821:52:-;;;;;;;;;;:::o;2786:1388:40:-;;2989:12;;;-1:-1:-1;;888:24821:52;;;;;;;;;;;3023:15:40;;;;3019:1149;3023:15;;;888:24821:52;;;;;;;;;;;;;;;;;;;;;3505:26:40;;;3501:398;;3019:1149;888:24821:52;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;2989:12:40;4103:11;:::o;888:24821:52:-;;;;;;;;;;3501:398:40;888:24821:52;3571:22:40;3693:26;3571:22;;;:::i;:::-;888:24821:52;;;;;;3693:26:40;;;;;:::i;888:24821:52:-;;;;;;;;;;;;3501:398:40;;;;;888:24821:52;;;;;;;;;;;;;;;;;;;;3019:1149:40;4145:12;;;;;:::o;1579:2:60:-;;;;;;;;;:::o;888:24821:52:-;;;;;;;;;;;:::o;:::-;;;;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;;:::i;:::-;;;;;;;;:::o;:::-;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;:::o;1646:491::-;888:24821;;;;;;;:::i;:::-;;;;;;;;;;;;;:::i;:::-;;;;;;;;;1759:357;;888:24821;1791:141;888:24821;;1954:31;888:24821;;;;2007:21;888:24821;;;;2050:13;888:24821;;;;2093:4;888:24821;;;;;1759:357;;888:24821;;;;;;;;;;;;;;;1732:398;;1646:491;:::o;888:24821::-;;;;;;;;;;;;;;;;;;:::o;:::-;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;2336:287:20;2468:7;888:24821:52;;2468:19:20;1759:1;;2468:7;888:24821:52;;2336:287:20:o;1759:1::-;;888:24821:52;;1759:1:20;;;;;;;;;;;;888:24821:52;1759:1:20;888:24821:52;;;1759:1:20;;7671:628:32;;;;7875:418;;;888:24821:52;;;7906:22:32;7902:286;;8201:17;;:::o;7902:286::-;1702:19;:23;888:24821:52;;8201:17:32;:::o;888:24821:52:-;;;;;;;;;;;;;;;;;;;;;;;7875:418:32;888:24821:52;;;;-1:-1:-1;8980:21:32;:17;;9152:142;;;;;;;8976:379;9324:20;888:24821:52;;;9324:20:32;;;;;;;;;;:::i;570:511:35:-;888:24821:52;;;;;;638:29:35;;;683:7;:::o;634:441::-;888:24821:52;734:38:35;;888:24821:52;;;;;788:34:35;;;888:24821:52;788:34:35;;;888:24821:52;;;;;;;;;;;788:34:35;730:345;852:35;843:44;;852:35;;888:24821:52;;;903:41:35;;;888:24821:52;903:41:35;;;888:24821:52;;;;;;;;;;;903:41:35;839:236;974:30;965:39;961:114;;570:511::o;961:114::-;888:24821:52;;;1020:44:35;;;888:24821:52;1020:44:35;;;888:24821:52;;;;;;;;;;;;;;;;1020:44:35;2145:730;;2283:2;888:24821:52;;2263:22:35;2259:610;2283:2;;;2746:25;2546:180;;;;;;;;;;;;;;-1:-1:-1;2546:180:35;2746:25;;:::i;:::-;2739:32;;:::o;2259:610::-;2802:56;;2818:1;2802:56;2822:35;2802:56;:::o;5009:1456::-;;;;6021:66;6008:79;;6004:161;;888:24821:52;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;6276:24:35;;;;;;;;;;;;;;888:24821:52;;;6314:20:35;6310:101;;6421:37;5009:1456;:::o;6310:101::-;6350:50;6276:24;6350:50;:::o;6276:24::-;888:24821:52;;;;;;;;;;;6004:161:35;6103:51;;;;6119:1;6103:51;6123:30;6103:51;:::o;888:24821:52:-;;;;;;;;;;;;-1:-1:-1;888:24821:52;;-1:-1:-1;888:24821:52;;-1:-1:-1;888:24821:52;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;:::o',
      linkReferences: {
        'src/libraries/FundManagementLib.sol': {
          FundManagementLib: [
            { start: 867, length: 20 },
            { start: 6412, length: 20 },
            { start: 10134, length: 20 },
            { start: 10376, length: 20 },
            { start: 12712, length: 20 },
            { start: 14830, length: 20 },
          ],
        },
      },
      immutableReferences: {
        '50017': [
          { start: 822, length: 32 },
          { start: 1936, length: 32 },
          { start: 6367, length: 32 },
          { start: 10221, length: 32 },
          { start: 10463, length: 32 },
          { start: 14316, length: 32 },
          { start: 14935, length: 32 },
        ],
      },
    },
    methodIdentifiers: {
      'ADMIN_ROLE()': '75b238fc',
      'DEFAULT_ADMIN_ROLE()': 'a217fddf',
      'GAME_DURATION()': 'c31b29ce',
      'MAX_PLAYERS_PER_GAME()': '185f31b0',
      'SCORE_SUBMISSION_TYPE_HASH()': 'c60d1996',
      'autoEndGame(uint256)': 'a3dac2de',
      'batchCommit(bytes32[],bytes32[])': 'da79a9c3',
      'canAutoEndGame(uint256)': 'b6d4d64b',
      'canReveal(address,uint256)': 'b2040f20',
      'cleanupExpiredCommits(address,uint256[])': 'b753204d',
      'cleanupGame(uint256)': '1004ff61',
      'cleanupGameBatch(uint256[])': 'b622c034',
      'commitRandom(bytes32,bytes32)': '9d8df9ee',
      'conductLottery(uint256)': '02e06cc8',
      'createGame(uint8)': 'e580f6ab',
      'domainSeparator()': 'f698da25',
      'emergencyWithdrawAll(address)': '54ab6269',
      'endGame(uint256)': 'd0399bb8',
      'forgeNFT()': '25cb9e51',
      'fragmentManager()': 'eeb7cfa3',
      'gameConfigManager()': '2e15f1b7',
      'gameCounter()': '2e0be39a',
      'gameRewardManager()': '6388607c',
      'getCommitInfo(address,uint256)': 'c7d7996e',
      'getGameDuration(uint256)': '0f42d191',
      'getGameInfo(uint256)': '47e1d550',
      'getGamePlayerScores(uint256)': '599706d0',
      'getGamePlayers(uint256)': '15a40f49',
      'getPlayerInfo(uint256,address)': '3ccd10e9',
      'getPlayerNonce(address)': '68efccbb',
      'getReservePool()': 'cf05d9c0',
      'getReservePoolDetails()': 'f9f6a812',
      'getRoleAdmin(bytes32)': '248a9ca3',
      'getRoleMember(bytes32,uint256)': '9010d07c',
      'getRoleMemberCount(bytes32)': 'ca15c873',
      'getUserNonce(address)': '6834e3a8',
      'grantRole(bytes32,address)': '2f2ff15d',
      'hasRole(bytes32,address)': '91d14854',
      'isGameExpired(uint256)': '65b3a7ca',
      'isPurposeUsed(address,uint256,bytes32)': '1b947707',
      'joinGame(uint256)': 'efaa55a0',
      'nclabToken()': '17723e87',
      'playerNonces(address)': '19ead6fa',
      'renounceRole(bytes32,address)': '36568abe',
      'revealRandom(uint256,uint256,bytes32,bytes32)': '61c3ddfa',
      'revokeRole(bytes32,address)': 'd547741f',
      'rewardManager()': '0f4ef8a6',
      'setLotteryRandomness(uint256,address,uint256)': 'e87e5f9d',
      'shovelNFT()': '371665b0',
      'shovelSynthesizer()': '4efd3749',
      'submitScore(uint256,address,uint256,uint256,uint256,bytes)': '718072e5',
      'supportsInterface(bytes4)': '01ffc9a7',
      'traitManager()': '59c1303f',
      'trustedSigner()': 'f74d5480',
      'updateContracts(address,address,address,address,address,address)':
        'f440256d',
      'updateLevelConfig(uint8,uint256,uint256,bool)': '92bf9248',
      'updatePoolConfig(uint8,uint256,uint256)': '7cf4c4cd',
      'updateSigner(address)': 'a7ecd37e',
      'usd1Token()': '61412fbc',
      'withdrawNclabToken(uint256,address)': '686a978c',
      'withdrawReservePool(uint256,address)': '8391a665',
      'withdrawUsdToken(uint256,address)': '8cce2d47',
    },
    rawMetadata:
      '{"compiler":{"version":"0.8.18+commit.87f61d96"},"language":"Solidity","output":{"abi":[{"inputs":[{"internalType":"address","name":"_usd1Token","type":"address"},{"internalType":"address","name":"signer","type":"address"},{"internalType":"address","name":"_nclabToken","type":"address"},{"internalType":"address","name":"_shovelNFT","type":"address"},{"internalType":"address","name":"_forgeNFT","type":"address"},{"internalType":"address","name":"_fragmentManager","type":"address"},{"internalType":"address","name":"_rewardManager","type":"address"},{"internalType":"address","name":"_traitManager","type":"address"},{"internalType":"address","name":"_shovelSynthesizer","type":"address"},{"internalType":"address","name":"_gameConfigManager","type":"address"},{"internalType":"address","name":"_gameRewardManager","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"enum SwordBattle.GameLevel","name":"level","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"entryFee","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"killReward","type":"uint256"}],"name":"ConfigUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":true,"internalType":"uint256","name":"gameId","type":"uint256"},{"indexed":false,"internalType":"uint64","name":"extraFragments","type":"uint64"}],"name":"FragmentBonus","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"admin","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"FundsWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"gameId","type":"uint256"}],"name":"GameCleaned","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"gameId","type":"uint256"},{"indexed":false,"internalType":"enum SwordBattle.GameLevel","name":"level","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"gameDuration","type":"uint256"}],"name":"GameCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"gameId","type":"uint256"},{"indexed":false,"internalType":"bool","name":"autoEnded","type":"bool"}],"name":"GameEnded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"gameId","type":"uint256"},{"indexed":false,"internalType":"address","name":"player","type":"address"}],"name":"PlayerJoined","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"gameId","type":"uint256"},{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint64","name":"kills","type":"uint64"},{"indexed":false,"internalType":"uint64","name":"score","type":"uint64"}],"name":"ScoreSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256","name":"newShovelId","type":"uint256"},{"indexed":false,"internalType":"uint8","name":"fromTier","type":"uint8"},{"indexed":false,"internalType":"uint8","name":"toTier","type":"uint8"}],"name":"ShovelSynthesized","type":"event"},{"inputs":[],"name":"ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"GAME_DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_PLAYERS_PER_GAME","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SCORE_SUBMISSION_TYPE_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"}],"name":"autoEndGame","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"commitments","type":"bytes32[]"},{"internalType":"bytes32[]","name":"purposes","type":"bytes32[]"}],"name":"batchCommit","outputs":[{"internalType":"uint256[]","name":"nonces","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"}],"name":"canAutoEndGame","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"}],"name":"canReveal","outputs":[{"internalType":"bool","name":"canRevealNow","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256[]","name":"nonces","type":"uint256[]"}],"name":"cleanupExpiredCommits","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"}],"name":"cleanupGame","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"gameIds","type":"uint256[]"}],"name":"cleanupGameBatch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"commitment","type":"bytes32"},{"internalType":"bytes32","name":"purpose","type":"bytes32"}],"name":"commitRandom","outputs":[{"internalType":"uint256","name":"nonce","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"}],"name":"conductLottery","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"enum SwordBattle.GameLevel","name":"level","type":"uint8"}],"name":"createGame","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"domainSeparator","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"emergencyWithdrawAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"}],"name":"endGame","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"forgeNFT","outputs":[{"internalType":"contract ForgeNFT","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fragmentManager","outputs":[{"internalType":"contract IFragmentManager","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"gameConfigManager","outputs":[{"internalType":"contract GameConfigManager","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"gameCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"gameRewardManager","outputs":[{"internalType":"contract GameRewardManager","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"}],"name":"getCommitInfo","outputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"},{"internalType":"bool","name":"revealed","type":"bool"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bytes32","name":"commitPurpose","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"}],"name":"getGameDuration","outputs":[{"internalType":"uint256","name":"duration","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"}],"name":"getGameInfo","outputs":[{"internalType":"uint256","name":"totalPool","type":"uint256"},{"internalType":"uint256","name":"createdAt","type":"uint256"},{"internalType":"uint256","name":"endedAt","type":"uint256"},{"internalType":"enum SwordBattle.GameLevel","name":"level","type":"uint8"},{"internalType":"bool","name":"ended","type":"bool"},{"internalType":"bool","name":"cleaned","type":"bool"},{"internalType":"uint256","name":"playerCount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"}],"name":"getGamePlayerScores","outputs":[{"internalType":"address[]","name":"players","type":"address[]"},{"internalType":"uint256[]","name":"scores","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"}],"name":"getGamePlayers","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"},{"internalType":"address","name":"player","type":"address"}],"name":"getPlayerInfo","outputs":[{"internalType":"address","name":"playerAddr","type":"address"},{"internalType":"uint256","name":"kills","type":"uint256"},{"internalType":"uint256","name":"score","type":"uint256"},{"internalType":"bool","name":"submitted","type":"bool"},{"internalType":"uint256","name":"fragmentReward","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"player","type":"address"}],"name":"getPlayerNonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getReservePool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getReservePoolDetails","outputs":[{"internalType":"uint256","name":"totalReserve","type":"uint256"},{"internalType":"uint256","name":"totalRewardsPending","type":"uint256"},{"internalType":"uint256","name":"availableForWithdraw","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserNonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"}],"name":"isGameExpired","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes32","name":"purpose","type":"bytes32"}],"name":"isPurposeUsed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"}],"name":"joinGame","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"nclabToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"playerNonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"randomValue","type":"uint256"},{"internalType":"bytes32","name":"salt","type":"bytes32"},{"internalType":"bytes32","name":"purpose","type":"bytes32"}],"name":"revealRandom","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rewardManager","outputs":[{"internalType":"contract IRewardManager","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"},{"internalType":"address","name":"committer","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"}],"name":"setLotteryRandomness","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"shovelNFT","outputs":[{"internalType":"contract ShovelNFTSlim","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"shovelSynthesizer","outputs":[{"internalType":"contract ShovelSynthesizer","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"},{"internalType":"address","name":"player","type":"address"},{"internalType":"uint256","name":"kills","type":"uint256"},{"internalType":"uint256","name":"score","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"submitScore","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"traitManager","outputs":[{"internalType":"contract IShovelTraitManager","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"trustedSigner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_nclabToken","type":"address"},{"internalType":"address","name":"_shovelNFT","type":"address"},{"internalType":"address","name":"_forgeNFT","type":"address"},{"internalType":"address","name":"_fragmentManager","type":"address"},{"internalType":"address","name":"_rewardManager","type":"address"},{"internalType":"address","name":"_traitManager","type":"address"}],"name":"updateContracts","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"enum SwordBattle.GameLevel","name":"level","type":"uint8"},{"internalType":"uint256","name":"entryFee","type":"uint256"},{"internalType":"uint256","name":"killReward","type":"uint256"},{"internalType":"bool","name":"active","type":"bool"}],"name":"updateLevelConfig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"enum SwordBattle.GameLevel","name":"level","type":"uint8"},{"internalType":"uint256","name":"killPercent","type":"uint256"},{"internalType":"uint256","name":"survivalPercent","type":"uint256"}],"name":"updatePoolConfig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newSigner","type":"address"}],"name":"updateSigner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"usd1Token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"to","type":"address"}],"name":"withdrawNclabToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"to","type":"address"}],"name":"withdrawReservePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"to","type":"address"}],"name":"withdrawUsdToken","outputs":[],"stateMutability":"nonpayable","type":"function"}],"devdoc":{"events":{"RoleAdminChanged(bytes32,bytes32,bytes32)":{"details":"Emitted when `newAdminRole` is set as ``role``\'s admin role, replacing `previousAdminRole` `DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite {RoleAdminChanged} not being emitted signaling this. _Available since v3.1._"},"RoleGranted(bytes32,address,address)":{"details":"Emitted when `account` is granted `role`. `sender` is the account that originated the contract call, an admin role bearer except when using {AccessControl-_setupRole}."},"RoleRevoked(bytes32,address,address)":{"details":"Emitted when `account` is revoked `role`. `sender` is the account that originated the contract call:   - if using `revokeRole`, it is the admin role bearer   - if using `renounceRole`, it is the role bearer (i.e. `account`)"}},"kind":"dev","methods":{"batchCommit(bytes32[],bytes32[])":{"details":"Batch commit multiple randomness values","params":{"commitments":"Array of commitment hashes","purposes":"Array of purposes for each commitment"},"returns":{"nonces":"Array of nonces for the commits"}},"canReveal(address,uint256)":{"details":"Check if randomness can be revealed","params":{"nonce":"The commit nonce","user":"The user address"},"returns":{"canRevealNow":"Whether the commit can be revealed now"}},"cleanupExpiredCommits(address,uint256[])":{"details":"Clean up expired or used commits to save storage","params":{"nonces":"Array of nonces to clean","user":"The user whose commits to clean"}},"commitRandom(bytes32,bytes32)":{"details":"Commit a randomness hash for a specific purpose","params":{"commitment":"keccak256(abi.encodePacked(randomValue, salt))","purpose":"The intended use of this randomness"},"returns":{"nonce":"The nonce for this commit"}},"conductLottery(uint256)":{"details":"\\u8fdb\\u884c\\u62bd\\u5956 - \\u4ee3\\u7406\\u5230RewardManager"},"emergencyWithdrawAll(address)":{"details":"\\u7d27\\u6025\\u63d0\\u53d6\\u6240\\u6709\\u4ee3\\u5e01"},"getCommitInfo(address,uint256)":{"details":"Get commit information","params":{"nonce":"The commit nonce","user":"The user address"},"returns":{"blockNumber":"Block when committed","commitPurpose":"The purpose committed for","deadline":"Reveal deadline","revealed":"Whether revealed"}},"getReservePool()":{"details":"\\u83b7\\u53d6\\u6ede\\u7559\\u8d44\\u91d1\\u603b\\u989d"},"getReservePoolDetails()":{"details":"\\u83b7\\u53d6\\u6ede\\u7559\\u8d44\\u91d1\\u8be6\\u7ec6\\u4fe1\\u606f"},"getRoleAdmin(bytes32)":{"details":"Returns the admin role that controls `role`. See {grantRole} and {revokeRole}. To change a role\'s admin, use {_setRoleAdmin}."},"getRoleMember(bytes32,uint256)":{"details":"Returns one of the accounts that have `role`. `index` must be a value between 0 and {getRoleMemberCount}, non-inclusive. Role bearers are not sorted in any particular way, and their ordering may change at any point. WARNING: When using {getRoleMember} and {getRoleMemberCount}, make sure you perform all queries on the same block. See the following https://forum.openzeppelin.com/t/iterating-over-elements-on-enumerableset-in-openzeppelin-contracts/2296[forum post] for more information."},"getRoleMemberCount(bytes32)":{"details":"Returns the number of accounts that have `role`. Can be used together with {getRoleMember} to enumerate all bearers of a role."},"getUserNonce(address)":{"details":"Get user\'s current nonce","params":{"user":"The user address"},"returns":{"_0":"Current nonce for the user"}},"grantRole(bytes32,address)":{"details":"Grants `role` to `account`. If `account` had not been already granted `role`, emits a {RoleGranted} event. Requirements: - the caller must have ``role``\'s admin role. May emit a {RoleGranted} event."},"hasRole(bytes32,address)":{"details":"Returns `true` if `account` has been granted `role`."},"isPurposeUsed(address,uint256,bytes32)":{"details":"Check if a specific purpose has been used for a commit","params":{"nonce":"The commit nonce","purpose":"The purpose to check","user":"The user address"},"returns":{"_0":"Whether this purpose has been used"}},"renounceRole(bytes32,address)":{"details":"Revokes `role` from the calling account. Roles are often managed via {grantRole} and {revokeRole}: this function\'s purpose is to provide a mechanism for accounts to lose their privileges if they are compromised (such as when a trusted device is misplaced). If the calling account had been revoked `role`, emits a {RoleRevoked} event. Requirements: - the caller must be `account`. May emit a {RoleRevoked} event."},"revealRandom(uint256,uint256,bytes32,bytes32)":{"details":"Reveal the committed randomness","params":{"nonce":"The nonce from commit","purpose":"The purpose this reveal is for","randomValue":"The original random value","salt":"The salt used in commitment"},"returns":{"_0":"The secure random value"}},"revokeRole(bytes32,address)":{"details":"Revokes `role` from `account`. If `account` had been granted `role`, emits a {RoleRevoked} event. Requirements: - the caller must have ``role``\'s admin role. May emit a {RoleRevoked} event."},"setLotteryRandomness(uint256,address,uint256)":{"details":"\\u8bbe\\u7f6e\\u62bd\\u5956\\u968f\\u673a\\u6570"},"supportsInterface(bytes4)":{"details":"See {IERC165-supportsInterface}."},"updateContracts(address,address,address,address,address,address)":{"details":"\\u66f4\\u65b0\\u5408\\u7ea6\\u5730\\u5740"},"updatePoolConfig(uint8,uint256,uint256)":{"details":"\\u66f4\\u65b0\\u5956\\u6c60\\u914d\\u7f6e"},"withdrawNclabToken(uint256,address)":{"details":"\\u7ba1\\u7406\\u5458\\u63d0\\u53d6Nclab\\u4ee3\\u5e01"},"withdrawReservePool(uint256,address)":{"details":"\\u63d0\\u53d6\\u6ede\\u7559\\u8d44\\u91d1\\uff08dev\\u6536\\u76ca\\uff09"},"withdrawUsdToken(uint256,address)":{"details":"\\u7ba1\\u7406\\u5458\\u63d0\\u53d6USD\\u4ee3\\u5e01"}},"version":1},"userdoc":{"kind":"user","methods":{},"version":1}},"settings":{"compilationTarget":{"src/core/SwordBattle.sol":"SwordBattle"},"evmVersion":"paris","libraries":{},"metadata":{"bytecodeHash":"ipfs"},"optimizer":{"enabled":true,"runs":200000},"remappings":[":@openzeppelin/=lib/openzeppelin-contracts/",":ds-test/=lib/openzeppelin-contracts/lib/forge-std/lib/ds-test/src/",":erc4626-tests/=lib/openzeppelin-contracts/lib/erc4626-tests/",":forge-std/=lib/forge-std/src/",":openzeppelin-contracts/=lib/openzeppelin-contracts/",":openzeppelin/=lib/openzeppelin-contracts/contracts/"],"viaIR":true},"sources":{"lib/openzeppelin-contracts/contracts/access/AccessControl.sol":{"keccak256":"0x0dd6e52cb394d7f5abe5dca2d4908a6be40417914720932de757de34a99ab87f","license":"MIT","urls":["bzz-raw://dc117ce50ea746cab6b97ed1a1facee17a715ae0cb95d67b943dacbaf15176fb","dweb:/ipfs/QmYRZ2UGNYwsHwfNu7Wjr8L2j1LBZ1mKv6NvbwgterYMXc"]},"lib/openzeppelin-contracts/contracts/access/AccessControlEnumerable.sol":{"keccak256":"0x13f5e15f2a0650c0b6aaee2ef19e89eaf4870d6e79662d572a393334c1397247","license":"MIT","urls":["bzz-raw://7ee05f28f549a5d6515e152580716b87636ed4bfab9812499a6e3803df88288b","dweb:/ipfs/QmeEnhdwY1t5Y3YU5a4ffzgXuToydH2PNdNxV9W7dEPRQJ"]},"lib/openzeppelin-contracts/contracts/access/IAccessControl.sol":{"keccak256":"0x59ce320a585d7e1f163cd70390a0ef2ff9cec832e2aa544293a00692465a7a57","license":"MIT","urls":["bzz-raw://bb2c137c343ef0c4c7ce7b18c1d108afdc9d315a04e48307288d2d05adcbde3a","dweb:/ipfs/QmUxhrAQM3MM3FF5j7AtcXLXguWCJBHJ14BRdVtuoQc8Fh"]},"lib/openzeppelin-contracts/contracts/access/IAccessControlEnumerable.sol":{"keccak256":"0xba4459ab871dfa300f5212c6c30178b63898c03533a1ede28436f11546626676","license":"MIT","urls":["bzz-raw://3dcc7b09bfa6e18aab262ca372f4a9b1fc82e294b430706a4e1378cf58e6a276","dweb:/ipfs/QmT8oSAcesdctR15HMLhr2a1HRpXymxdjTfdtfTYJcj2N2"]},"lib/openzeppelin-contracts/contracts/security/Pausable.sol":{"keccak256":"0x0849d93b16c9940beb286a7864ed02724b248b93e0d80ef6355af5ef15c64773","license":"MIT","urls":["bzz-raw://4ddabb16009cd17eaca3143feadf450ac13e72919ebe2ca50e00f61cb78bc004","dweb:/ipfs/QmSPwPxX7d6TTWakN5jy5wsaGkS1y9TW8fuhGSraMkLk2B"]},"lib/openzeppelin-contracts/contracts/security/ReentrancyGuard.sol":{"keccak256":"0xa535a5df777d44e945dd24aa43a11e44b024140fc340ad0dfe42acf4002aade1","license":"MIT","urls":["bzz-raw://41319e7f621f2dc3733511332c4fd032f8e32ad2aa7fd6f665c19741d9941a34","dweb:/ipfs/QmcYR3bd862GD1Bc7jwrU9bGxrhUu5na1oP964bDCu2id1"]},"lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol":{"keccak256":"0x287b55befed2961a7eabd7d7b1b2839cbca8a5b80ef8dcbb25ed3d4c2002c305","license":"MIT","urls":["bzz-raw://bd39944e8fc06be6dbe2dd1d8449b5336e23c6a7ba3e8e9ae5ae0f37f35283f5","dweb:/ipfs/QmPV3FGYjVwvKSgAXKUN3r9T9GwniZz83CxBpM7vyj2G53"]},"lib/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Permit.sol":{"keccak256":"0xec63854014a5b4f2b3290ab9103a21bdf902a508d0f41a8573fea49e98bf571a","license":"MIT","urls":["bzz-raw://bc5b5dc12fbc4002f282eaa7a5f06d8310ed62c1c77c5770f6283e058454c39a","dweb:/ipfs/Qme9rE2wS3yBuyJq9GgbmzbsBQsW2M2sVFqYYLw7bosGrv"]},"lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol":{"keccak256":"0x909d608c2db6eb165ca178c81289a07ed2e118e444d0025b2a85c97d0b44a4fa","license":"MIT","urls":["bzz-raw://656cda26512ddd7373c2d5551c8fae759fc30f05b10f0fc2e738e9274199dbd4","dweb:/ipfs/QmTSArSzQRFbQmHgq7U1PZXnsDFhvDZhKVu9CzMG4yo6Lx"]},"lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol":{"keccak256":"0x2c309e7df9e05e6ce15bedfe74f3c61b467fc37e0fae9eab496acf5ea0bbd7ff","license":"MIT","urls":["bzz-raw://7063b5c98711a98018ba4635ac74cee1c1cfa2ea01099498e062699ed9530005","dweb:/ipfs/QmeJ8rGXkcv7RrqLdAW8PCXPAykxVsddfYY6g5NaTwmRFE"]},"lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol":{"keccak256":"0x5bce51e11f7d194b79ea59fe00c9e8de9fa2c5530124960f29a24d4c740a3266","license":"MIT","urls":["bzz-raw://7e66dfde185df46104c11bc89d08fa0760737aa59a2b8546a656473d810a8ea4","dweb:/ipfs/QmXvyqtXPaPss2PD7eqPoSao5Szm2n6UMoiG8TZZDjmChR"]},"lib/openzeppelin-contracts/contracts/token/ERC721/IERC721Receiver.sol":{"keccak256":"0xa82b58eca1ee256be466e536706850163d2ec7821945abd6b4778cfb3bee37da","license":"MIT","urls":["bzz-raw://6e75cf83beb757b8855791088546b8337e9d4684e169400c20d44a515353b708","dweb:/ipfs/QmYvPafLfoquiDMEj7CKHtvbgHu7TJNPSVPSCjrtjV8HjV"]},"lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol":{"keccak256":"0xa8796bd16014cefb8c26449413981a49c510f92a98d6828494f5fd046223ced3","license":"MIT","urls":["bzz-raw://63a5e0bb5a7d182e0d0eef87033f78115eab791de3626a929bc98c157087880a","dweb:/ipfs/QmetkXAu2CJKS4qrZtEQPU8okAPwUwa6HL4XYwk8vrYMk8"]},"lib/openzeppelin-contracts/contracts/token/ERC721/extensions/IERC721Enumerable.sol":{"keccak256":"0xd1556954440b31c97a142c6ba07d5cade45f96fafd52091d33a14ebe365aecbf","license":"MIT","urls":["bzz-raw://26fef835622b46a5ba08b3ef6b46a22e94b5f285d0f0fb66b703bd30217d2c34","dweb:/ipfs/QmZ548qdwfL1qF7aXz3xh1GCdTiST81kGGuKRqVUfYmPZR"]},"lib/openzeppelin-contracts/contracts/token/ERC721/extensions/IERC721Metadata.sol":{"keccak256":"0x75b829ff2f26c14355d1cba20e16fe7b29ca58eb5fef665ede48bc0f9c6c74b9","license":"MIT","urls":["bzz-raw://a0a107160525724f9e1bbbab031defc2f298296dd9e331f16a6f7130cec32146","dweb:/ipfs/QmemujxSd7gX8A9M8UwmNbz4Ms3U9FG9QfudUgxwvTmPWf"]},"lib/openzeppelin-contracts/contracts/utils/Address.sol":{"keccak256":"0x006dd67219697fe68d7fbfdea512e7c4cb64a43565ed86171d67e844982da6fa","license":"MIT","urls":["bzz-raw://2455248c8ddd9cc6a7af76a13973cddf222072427e7b0e2a7d1aff345145e931","dweb:/ipfs/QmfYjnjRbWqYpuxurqveE6HtzsY1Xx323J428AKQgtBJZm"]},"lib/openzeppelin-contracts/contracts/utils/Context.sol":{"keccak256":"0xe2e337e6dde9ef6b680e07338c493ebea1b5fd09b43424112868e9cc1706bca7","license":"MIT","urls":["bzz-raw://6df0ddf21ce9f58271bdfaa85cde98b200ef242a05a3f85c2bc10a8294800a92","dweb:/ipfs/QmRK2Y5Yc6BK7tGKkgsgn3aJEQGi5aakeSPZvS65PV8Xp3"]},"lib/openzeppelin-contracts/contracts/utils/Strings.sol":{"keccak256":"0x3088eb2868e8d13d89d16670b5f8612c4ab9ff8956272837d8e90106c59c14a0","license":"MIT","urls":["bzz-raw://b81d9ff6559ea5c47fc573e17ece6d9ba5d6839e213e6ebc3b4c5c8fe4199d7f","dweb:/ipfs/QmPCW1bFisUzJkyjroY3yipwfism9RRCigCcK1hbXtVM8n"]},"lib/openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol":{"keccak256":"0x809bc3edb4bcbef8263fa616c1b60ee0004b50a8a1bfa164d8f57fd31f520c58","license":"MIT","urls":["bzz-raw://8b93a1e39a4a19eba1600b92c96f435442db88cac91e315c8291547a2a7bcfe2","dweb:/ipfs/QmTm34KVe6uZBZwq8dZDNWwPcm24qBJdxqL3rPxBJ4LrMv"]},"lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol":{"keccak256":"0xd10975de010d89fd1c78dc5e8a9a7e7f496198085c151648f20cba166b32582b","license":"MIT","urls":["bzz-raw://fb0048dee081f6fffa5f74afc3fb328483c2a30504e94a0ddd2a5114d731ec4d","dweb:/ipfs/QmZptt1nmYoA5SgjwnSgWqgUSDgm4q52Yos3xhnMv3MV43"]},"lib/openzeppelin-contracts/contracts/utils/introspection/IERC165.sol":{"keccak256":"0x447a5f3ddc18419d41ff92b3773fb86471b1db25773e07f877f548918a185bf1","license":"MIT","urls":["bzz-raw://be161e54f24e5c6fae81a12db1a8ae87bc5ae1b0ddc805d82a1440a68455088f","dweb:/ipfs/QmP7C3CHdY9urF4dEMb9wmsp1wMxHF6nhA2yQE5SKiPAdy"]},"lib/openzeppelin-contracts/contracts/utils/math/Math.sol":{"keccak256":"0xe4455ac1eb7fc497bb7402579e7b4d64d928b846fce7d2b6fde06d366f21c2b3","license":"MIT","urls":["bzz-raw://cc8841b3cd48ad125e2f46323c8bad3aa0e88e399ec62acb9e57efa7e7c8058c","dweb:/ipfs/QmSqE4mXHA2BXW58deDbXE8MTcsL5JSKNDbm23sVQxRLPS"]},"lib/openzeppelin-contracts/contracts/utils/math/SignedMath.sol":{"keccak256":"0xf92515413956f529d95977adc9b0567d583c6203fc31ab1c23824c35187e3ddc","license":"MIT","urls":["bzz-raw://c50fcc459e49a9858b6d8ad5f911295cb7c9ab57567845a250bf0153f84a95c7","dweb:/ipfs/QmcEW85JRzvDkQggxiBBLVAasXWdkhEysqypj9EaB6H2g6"]},"lib/openzeppelin-contracts/contracts/utils/structs/EnumerableSet.sol":{"keccak256":"0x9f4357008a8f7d8c8bf5d48902e789637538d8c016be5766610901b4bba81514","license":"MIT","urls":["bzz-raw://20bf19b2b851f58a4c24543de80ae70b3e08621f9230eb335dc75e2d4f43f5df","dweb:/ipfs/QmSYuH1AhvJkPK8hNvoPqtExBcgTB42pPRHgTHkS5c5zYW"]},"src/abstracts/SecureRandomness.sol":{"keccak256":"0x75efd9846379b7004d8d296b5ec9cc063c6af40bfa65a8712e8a39c83e0c2135","license":"MIT","urls":["bzz-raw://da265648fde6c8a840bebec0ef70a7c60c502b5b7e21c737df4aef830b24c6d7","dweb:/ipfs/Qmf3MTd8GrhaszA6VX2Jio6DYqzUpSguRFxY9kb3jfkFkx"]},"src/core/SwordBattle.sol":{"keccak256":"0x4f9784170ae0b16ff54d66bd923042294413a9640217cbb649cfe962e048a16a","license":"MIT","urls":["bzz-raw://ad077858517e30e34d8da4b73d7089a25c6175f2fc93f8a15deab8f7963203fa","dweb:/ipfs/QmXZjzwCnrGSaaGKdNaaEXit9gJiYGc5Yjtg9TixQdKeAT"]},"src/interfaces/IFragmentManager.sol":{"keccak256":"0x9f69df0aa7caa991bf3121d3ea3efff18147e5127d15b4a1e4f4f03ba4bf21ef","license":"MIT","urls":["bzz-raw://54a73312b9a655e778cb178bdb170b75d45f804dcda21527ecb3f258242dbdf2","dweb:/ipfs/QmRbebpUxMws4Z549mTLfHkzhmVLM2tUAefkKZCu7c2P2x"]},"src/interfaces/IRandomnessService.sol":{"keccak256":"0x2207d9ba7c4d01aac257ff05e4217262c23c14d3700ab91a20affd6af8baf8a0","license":"MIT","urls":["bzz-raw://2400ed9dde7c0ef19f540f34df05a4e6b7e6d836dd6c632e744fd2cfa09df895","dweb:/ipfs/QmcnQtWw734j8fwntWcfvbtDxKSPWnMRoWZe7Bx9gi2nWN"]},"src/interfaces/IRewardManager.sol":{"keccak256":"0x4fe880f90077c3fbc700a59bccccd9713fb1f50e3495e91f92c5808d2f28d484","license":"MIT","urls":["bzz-raw://1bed6403801e1c3e542bf54b53c470d53a21ef3a97a6489affdb3a3b5b17ebe3","dweb:/ipfs/QmYW6XhiMCVGqb58sagTeP1qXJ88XY7i58VJ5KmAau1y5q"]},"src/interfaces/IShovelTraitManager.sol":{"keccak256":"0x8ae3b67c908f4aee23a647b00c3be876ecfc878f5ffad3e59f618948e2353718","license":"MIT","urls":["bzz-raw://b9da7a8a1c060ccb061c5d8e9532628b0518249263fa913be0968d0071c3ced9","dweb:/ipfs/QmTgsJALzL8XSJtV98V9xuvPkjBa3osidqXFFrw29sq9Ts"]},"src/interfaces/ISwordBattle.sol":{"keccak256":"0x8db5848799985af49793c9df4963ab5069b80d7a4241cad6d50c6f2190d83bdd","license":"MIT","urls":["bzz-raw://141b8e49644155ec4b0ec42ee8a0a9c40209634c0eb7f66580882c6850b42b94","dweb:/ipfs/QmY3J8SWpipeJLP9ZckdTmeUCBL4dvwD4bJXBn7WQYLrWe"]},"src/libraries/FundManagementLib.sol":{"keccak256":"0xe2499abb67102237265c3404db43210fefdc57c95b0dcc7bc9671dbcf593b3d5","license":"MIT","urls":["bzz-raw://eafccc7997005bb1b664cbe5d1b40ef322b2513dad0b425078be6fe348682f87","dweb:/ipfs/QmQJunZcqrYiehusdDwXhisD2Uys3iwAU5nCWebxbW74P1"]},"src/libraries/RandomnessTypes.sol":{"keccak256":"0xf46c822edafd3da2747ea852183bedc755871a170e3c80a100146624fc24a800","license":"MIT","urls":["bzz-raw://54e4c992d44edad8abb1ae829db960c31b333944407bfcf0c963f40486a2f501","dweb:/ipfs/QmeCbhxbyKRc7aCVf87uAR159KQrTfqFt8YgBbbmrYwb5t"]},"src/managers/GameConfigManager.sol":{"keccak256":"0x302fb2c5834d4b66f8aebdde85f1c559d53cf6a23d91885984bc0982142f2e8e","license":"MIT","urls":["bzz-raw://db17378d48a0c561bb7dd707a586ed647ba083b8079469fd28ba20f00530907c","dweb:/ipfs/QmfTT4usjYgpCXUR9YspPK4BNwffCemfc3jRcsv2yjDX7W"]},"src/managers/GameRewardManager.sol":{"keccak256":"0xb7cea8b2f2251635666d62302555e7954d558bd10316be9505d6846f69b536a4","license":"MIT","urls":["bzz-raw://2651ea24f3635a9018eedaf0d82676dfdc22d888139f6399b6685bb5091f1ebb","dweb:/ipfs/QmNpGHRXstrEe4i3CQ8yJhzFJ5cgktTFKRvcBPaFaW1z9f"]},"src/nft/ForgeNFT.sol":{"keccak256":"0xab393456469d8f568bf3f4c1953d6aaee253a1ada8a03f14acfdc6b209c63723","license":"MIT","urls":["bzz-raw://46fff74ea2655634476d2bc63fdfb3e63ea1a448a741c5e0cac6733513b35a14","dweb:/ipfs/QmdruDKGkDxQw26or8hwREfDdRjY57JX3PNFAB4hR3GDAS"]},"src/nft/ShovelNFTSlim.sol":{"keccak256":"0x2d7d903391fb82558210f03996268a302dfbc41f1b8dc427c4d7fcdd1997bc0f","license":"MIT","urls":["bzz-raw://82eaed911015907fd8bbf068faa3de5ea7309404ca50f512fdb8508a20a7a994","dweb:/ipfs/Qma8ZkjT4DzzkR51jfQgyKTVvuCaUGA39J5EJo4Q5VSUrU"]},"src/nft/ShovelSynthesizer.sol":{"keccak256":"0x202ad2c31cf95928849468bc602c34789cb12ac4787ab08cd0bed1b24013f25d","license":"MIT","urls":["bzz-raw://d0d132700c148705e2ed73e5a74bfc4036ddcb563f8dc0b6554466bfd8d52888","dweb:/ipfs/QmVCqVYrShyqz7jTFctVvcF2JCWsa99ncRZBvpy9ADWUjP"]}},"version":1}',
    metadata: {
      compiler: { version: '0.8.18+commit.87f61d96' },
      language: 'Solidity',
      output: {
        abi: [
          {
            inputs: [
              {
                internalType: 'address',
                name: '_usd1Token',
                type: 'address',
              },
              { internalType: 'address', name: 'signer', type: 'address' },
              {
                internalType: 'address',
                name: '_nclabToken',
                type: 'address',
              },
              {
                internalType: 'address',
                name: '_shovelNFT',
                type: 'address',
              },
              {
                internalType: 'address',
                name: '_forgeNFT',
                type: 'address',
              },
              {
                internalType: 'address',
                name: '_fragmentManager',
                type: 'address',
              },
              {
                internalType: 'address',
                name: '_rewardManager',
                type: 'address',
              },
              {
                internalType: 'address',
                name: '_traitManager',
                type: 'address',
              },
              {
                internalType: 'address',
                name: '_shovelSynthesizer',
                type: 'address',
              },
              {
                internalType: 'address',
                name: '_gameConfigManager',
                type: 'address',
              },
              {
                internalType: 'address',
                name: '_gameRewardManager',
                type: 'address',
              },
            ],
            stateMutability: 'nonpayable',
            type: 'constructor',
          },
          {
            inputs: [
              {
                internalType: 'enum SwordBattle.GameLevel',
                name: 'level',
                type: 'uint8',
                indexed: false,
              },
              {
                internalType: 'uint256',
                name: 'entryFee',
                type: 'uint256',
                indexed: false,
              },
              {
                internalType: 'uint256',
                name: 'killReward',
                type: 'uint256',
                indexed: false,
              },
            ],
            type: 'event',
            name: 'ConfigUpdated',
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'player',
                type: 'address',
                indexed: true,
              },
              {
                internalType: 'uint256',
                name: 'gameId',
                type: 'uint256',
                indexed: true,
              },
              {
                internalType: 'uint64',
                name: 'extraFragments',
                type: 'uint64',
                indexed: false,
              },
            ],
            type: 'event',
            name: 'FragmentBonus',
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'admin',
                type: 'address',
                indexed: true,
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
                indexed: false,
              },
            ],
            type: 'event',
            name: 'FundsWithdrawn',
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: 'uint256',
                name: 'gameId',
                type: 'uint256',
                indexed: true,
              },
            ],
            type: 'event',
            name: 'GameCleaned',
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: 'uint256',
                name: 'gameId',
                type: 'uint256',
                indexed: false,
              },
              {
                internalType: 'enum SwordBattle.GameLevel',
                name: 'level',
                type: 'uint8',
                indexed: false,
              },
              {
                internalType: 'uint256',
                name: 'gameDuration',
                type: 'uint256',
                indexed: false,
              },
            ],
            type: 'event',
            name: 'GameCreated',
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: 'uint256',
                name: 'gameId',
                type: 'uint256',
                indexed: true,
              },
              {
                internalType: 'bool',
                name: 'autoEnded',
                type: 'bool',
                indexed: false,
              },
            ],
            type: 'event',
            name: 'GameEnded',
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: 'uint256',
                name: 'gameId',
                type: 'uint256',
                indexed: false,
              },
              {
                internalType: 'address',
                name: 'player',
                type: 'address',
                indexed: false,
              },
            ],
            type: 'event',
            name: 'PlayerJoined',
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32',
                indexed: true,
              },
              {
                internalType: 'bytes32',
                name: 'previousAdminRole',
                type: 'bytes32',
                indexed: true,
              },
              {
                internalType: 'bytes32',
                name: 'newAdminRole',
                type: 'bytes32',
                indexed: true,
              },
            ],
            type: 'event',
            name: 'RoleAdminChanged',
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32',
                indexed: true,
              },
              {
                internalType: 'address',
                name: 'account',
                type: 'address',
                indexed: true,
              },
              {
                internalType: 'address',
                name: 'sender',
                type: 'address',
                indexed: true,
              },
            ],
            type: 'event',
            name: 'RoleGranted',
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32',
                indexed: true,
              },
              {
                internalType: 'address',
                name: 'account',
                type: 'address',
                indexed: true,
              },
              {
                internalType: 'address',
                name: 'sender',
                type: 'address',
                indexed: true,
              },
            ],
            type: 'event',
            name: 'RoleRevoked',
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: 'uint256',
                name: 'gameId',
                type: 'uint256',
                indexed: true,
              },
              {
                internalType: 'address',
                name: 'player',
                type: 'address',
                indexed: true,
              },
              {
                internalType: 'uint64',
                name: 'kills',
                type: 'uint64',
                indexed: false,
              },
              {
                internalType: 'uint64',
                name: 'score',
                type: 'uint64',
                indexed: false,
              },
            ],
            type: 'event',
            name: 'ScoreSubmitted',
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'player',
                type: 'address',
                indexed: true,
              },
              {
                internalType: 'uint256',
                name: 'newShovelId',
                type: 'uint256',
                indexed: false,
              },
              {
                internalType: 'uint8',
                name: 'fromTier',
                type: 'uint8',
                indexed: false,
              },
              {
                internalType: 'uint8',
                name: 'toTier',
                type: 'uint8',
                indexed: false,
              },
            ],
            type: 'event',
            name: 'ShovelSynthesized',
            anonymous: false,
          },
          {
            inputs: [],
            stateMutability: 'view',
            type: 'function',
            name: 'ADMIN_ROLE',
            outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
          },
          {
            inputs: [],
            stateMutability: 'view',
            type: 'function',
            name: 'DEFAULT_ADMIN_ROLE',
            outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
          },
          {
            inputs: [],
            stateMutability: 'view',
            type: 'function',
            name: 'GAME_DURATION',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          },
          {
            inputs: [],
            stateMutability: 'view',
            type: 'function',
            name: 'MAX_PLAYERS_PER_GAME',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          },
          {
            inputs: [],
            stateMutability: 'view',
            type: 'function',
            name: 'SCORE_SUBMISSION_TYPE_HASH',
            outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
          },
          {
            inputs: [
              { internalType: 'uint256', name: 'gameId', type: 'uint256' },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'autoEndGame',
          },
          {
            inputs: [
              {
                internalType: 'bytes32[]',
                name: 'commitments',
                type: 'bytes32[]',
              },
              {
                internalType: 'bytes32[]',
                name: 'purposes',
                type: 'bytes32[]',
              },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'batchCommit',
            outputs: [
              {
                internalType: 'uint256[]',
                name: 'nonces',
                type: 'uint256[]',
              },
            ],
          },
          {
            inputs: [
              { internalType: 'uint256', name: 'gameId', type: 'uint256' },
            ],
            stateMutability: 'view',
            type: 'function',
            name: 'canAutoEndGame',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
          },
          {
            inputs: [
              { internalType: 'address', name: 'user', type: 'address' },
              { internalType: 'uint256', name: 'nonce', type: 'uint256' },
            ],
            stateMutability: 'view',
            type: 'function',
            name: 'canReveal',
            outputs: [
              { internalType: 'bool', name: 'canRevealNow', type: 'bool' },
            ],
          },
          {
            inputs: [
              { internalType: 'address', name: 'user', type: 'address' },
              {
                internalType: 'uint256[]',
                name: 'nonces',
                type: 'uint256[]',
              },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'cleanupExpiredCommits',
          },
          {
            inputs: [
              { internalType: 'uint256', name: 'gameId', type: 'uint256' },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'cleanupGame',
          },
          {
            inputs: [
              {
                internalType: 'uint256[]',
                name: 'gameIds',
                type: 'uint256[]',
              },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'cleanupGameBatch',
          },
          {
            inputs: [
              {
                internalType: 'bytes32',
                name: 'commitment',
                type: 'bytes32',
              },
              { internalType: 'bytes32', name: 'purpose', type: 'bytes32' },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'commitRandom',
            outputs: [
              { internalType: 'uint256', name: 'nonce', type: 'uint256' },
            ],
          },
          {
            inputs: [
              { internalType: 'uint256', name: 'gameId', type: 'uint256' },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'conductLottery',
          },
          {
            inputs: [
              {
                internalType: 'enum SwordBattle.GameLevel',
                name: 'level',
                type: 'uint8',
              },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'createGame',
          },
          {
            inputs: [],
            stateMutability: 'view',
            type: 'function',
            name: 'domainSeparator',
            outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
          },
          {
            inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'emergencyWithdrawAll',
          },
          {
            inputs: [
              { internalType: 'uint256', name: 'gameId', type: 'uint256' },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'endGame',
          },
          {
            inputs: [],
            stateMutability: 'view',
            type: 'function',
            name: 'forgeNFT',
            outputs: [
              {
                internalType: 'contract ForgeNFT',
                name: '',
                type: 'address',
              },
            ],
          },
          {
            inputs: [],
            stateMutability: 'view',
            type: 'function',
            name: 'fragmentManager',
            outputs: [
              {
                internalType: 'contract IFragmentManager',
                name: '',
                type: 'address',
              },
            ],
          },
          {
            inputs: [],
            stateMutability: 'view',
            type: 'function',
            name: 'gameConfigManager',
            outputs: [
              {
                internalType: 'contract GameConfigManager',
                name: '',
                type: 'address',
              },
            ],
          },
          {
            inputs: [],
            stateMutability: 'view',
            type: 'function',
            name: 'gameCounter',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          },
          {
            inputs: [],
            stateMutability: 'view',
            type: 'function',
            name: 'gameRewardManager',
            outputs: [
              {
                internalType: 'contract GameRewardManager',
                name: '',
                type: 'address',
              },
            ],
          },
          {
            inputs: [
              { internalType: 'address', name: 'user', type: 'address' },
              { internalType: 'uint256', name: 'nonce', type: 'uint256' },
            ],
            stateMutability: 'view',
            type: 'function',
            name: 'getCommitInfo',
            outputs: [
              {
                internalType: 'uint256',
                name: 'blockNumber',
                type: 'uint256',
              },
              { internalType: 'bool', name: 'revealed', type: 'bool' },
              {
                internalType: 'uint256',
                name: 'deadline',
                type: 'uint256',
              },
              {
                internalType: 'bytes32',
                name: 'commitPurpose',
                type: 'bytes32',
              },
            ],
          },
          {
            inputs: [
              { internalType: 'uint256', name: 'gameId', type: 'uint256' },
            ],
            stateMutability: 'view',
            type: 'function',
            name: 'getGameDuration',
            outputs: [
              { internalType: 'uint256', name: 'duration', type: 'uint256' },
            ],
          },
          {
            inputs: [
              { internalType: 'uint256', name: 'gameId', type: 'uint256' },
            ],
            stateMutability: 'view',
            type: 'function',
            name: 'getGameInfo',
            outputs: [
              {
                internalType: 'uint256',
                name: 'totalPool',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'createdAt',
                type: 'uint256',
              },
              { internalType: 'uint256', name: 'endedAt', type: 'uint256' },
              {
                internalType: 'enum SwordBattle.GameLevel',
                name: 'level',
                type: 'uint8',
              },
              { internalType: 'bool', name: 'ended', type: 'bool' },
              { internalType: 'bool', name: 'cleaned', type: 'bool' },
              {
                internalType: 'uint256',
                name: 'playerCount',
                type: 'uint256',
              },
            ],
          },
          {
            inputs: [
              { internalType: 'uint256', name: 'gameId', type: 'uint256' },
            ],
            stateMutability: 'view',
            type: 'function',
            name: 'getGamePlayerScores',
            outputs: [
              {
                internalType: 'address[]',
                name: 'players',
                type: 'address[]',
              },
              {
                internalType: 'uint256[]',
                name: 'scores',
                type: 'uint256[]',
              },
            ],
          },
          {
            inputs: [
              { internalType: 'uint256', name: 'gameId', type: 'uint256' },
            ],
            stateMutability: 'view',
            type: 'function',
            name: 'getGamePlayers',
            outputs: [
              { internalType: 'address[]', name: '', type: 'address[]' },
            ],
          },
          {
            inputs: [
              { internalType: 'uint256', name: 'gameId', type: 'uint256' },
              { internalType: 'address', name: 'player', type: 'address' },
            ],
            stateMutability: 'view',
            type: 'function',
            name: 'getPlayerInfo',
            outputs: [
              {
                internalType: 'address',
                name: 'playerAddr',
                type: 'address',
              },
              { internalType: 'uint256', name: 'kills', type: 'uint256' },
              { internalType: 'uint256', name: 'score', type: 'uint256' },
              { internalType: 'bool', name: 'submitted', type: 'bool' },
              {
                internalType: 'uint256',
                name: 'fragmentReward',
                type: 'uint256',
              },
            ],
          },
          {
            inputs: [
              { internalType: 'address', name: 'player', type: 'address' },
            ],
            stateMutability: 'view',
            type: 'function',
            name: 'getPlayerNonce',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          },
          {
            inputs: [],
            stateMutability: 'view',
            type: 'function',
            name: 'getReservePool',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          },
          {
            inputs: [],
            stateMutability: 'view',
            type: 'function',
            name: 'getReservePoolDetails',
            outputs: [
              {
                internalType: 'uint256',
                name: 'totalReserve',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'totalRewardsPending',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'availableForWithdraw',
                type: 'uint256',
              },
            ],
          },
          {
            inputs: [
              { internalType: 'bytes32', name: 'role', type: 'bytes32' },
            ],
            stateMutability: 'view',
            type: 'function',
            name: 'getRoleAdmin',
            outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
          },
          {
            inputs: [
              { internalType: 'bytes32', name: 'role', type: 'bytes32' },
              { internalType: 'uint256', name: 'index', type: 'uint256' },
            ],
            stateMutability: 'view',
            type: 'function',
            name: 'getRoleMember',
            outputs: [{ internalType: 'address', name: '', type: 'address' }],
          },
          {
            inputs: [
              { internalType: 'bytes32', name: 'role', type: 'bytes32' },
            ],
            stateMutability: 'view',
            type: 'function',
            name: 'getRoleMemberCount',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          },
          {
            inputs: [
              { internalType: 'address', name: 'user', type: 'address' },
            ],
            stateMutability: 'view',
            type: 'function',
            name: 'getUserNonce',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          },
          {
            inputs: [
              { internalType: 'bytes32', name: 'role', type: 'bytes32' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'grantRole',
          },
          {
            inputs: [
              { internalType: 'bytes32', name: 'role', type: 'bytes32' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            stateMutability: 'view',
            type: 'function',
            name: 'hasRole',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
          },
          {
            inputs: [
              { internalType: 'uint256', name: 'gameId', type: 'uint256' },
            ],
            stateMutability: 'view',
            type: 'function',
            name: 'isGameExpired',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
          },
          {
            inputs: [
              { internalType: 'address', name: 'user', type: 'address' },
              { internalType: 'uint256', name: 'nonce', type: 'uint256' },
              { internalType: 'bytes32', name: 'purpose', type: 'bytes32' },
            ],
            stateMutability: 'view',
            type: 'function',
            name: 'isPurposeUsed',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
          },
          {
            inputs: [
              { internalType: 'uint256', name: 'gameId', type: 'uint256' },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'joinGame',
          },
          {
            inputs: [],
            stateMutability: 'view',
            type: 'function',
            name: 'nclabToken',
            outputs: [
              { internalType: 'contract IERC20', name: '', type: 'address' },
            ],
          },
          {
            inputs: [{ internalType: 'address', name: '', type: 'address' }],
            stateMutability: 'view',
            type: 'function',
            name: 'playerNonces',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          },
          {
            inputs: [
              { internalType: 'bytes32', name: 'role', type: 'bytes32' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'renounceRole',
          },
          {
            inputs: [
              { internalType: 'uint256', name: 'nonce', type: 'uint256' },
              {
                internalType: 'uint256',
                name: 'randomValue',
                type: 'uint256',
              },
              { internalType: 'bytes32', name: 'salt', type: 'bytes32' },
              { internalType: 'bytes32', name: 'purpose', type: 'bytes32' },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'revealRandom',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          },
          {
            inputs: [
              { internalType: 'bytes32', name: 'role', type: 'bytes32' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'revokeRole',
          },
          {
            inputs: [],
            stateMutability: 'view',
            type: 'function',
            name: 'rewardManager',
            outputs: [
              {
                internalType: 'contract IRewardManager',
                name: '',
                type: 'address',
              },
            ],
          },
          {
            inputs: [
              { internalType: 'uint256', name: 'gameId', type: 'uint256' },
              {
                internalType: 'address',
                name: 'committer',
                type: 'address',
              },
              { internalType: 'uint256', name: 'nonce', type: 'uint256' },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setLotteryRandomness',
          },
          {
            inputs: [],
            stateMutability: 'view',
            type: 'function',
            name: 'shovelNFT',
            outputs: [
              {
                internalType: 'contract ShovelNFTSlim',
                name: '',
                type: 'address',
              },
            ],
          },
          {
            inputs: [],
            stateMutability: 'view',
            type: 'function',
            name: 'shovelSynthesizer',
            outputs: [
              {
                internalType: 'contract ShovelSynthesizer',
                name: '',
                type: 'address',
              },
            ],
          },
          {
            inputs: [
              { internalType: 'uint256', name: 'gameId', type: 'uint256' },
              { internalType: 'address', name: 'player', type: 'address' },
              { internalType: 'uint256', name: 'kills', type: 'uint256' },
              { internalType: 'uint256', name: 'score', type: 'uint256' },
              { internalType: 'uint256', name: 'nonce', type: 'uint256' },
              { internalType: 'bytes', name: 'signature', type: 'bytes' },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'submitScore',
          },
          {
            inputs: [
              {
                internalType: 'bytes4',
                name: 'interfaceId',
                type: 'bytes4',
              },
            ],
            stateMutability: 'view',
            type: 'function',
            name: 'supportsInterface',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
          },
          {
            inputs: [],
            stateMutability: 'view',
            type: 'function',
            name: 'traitManager',
            outputs: [
              {
                internalType: 'contract IShovelTraitManager',
                name: '',
                type: 'address',
              },
            ],
          },
          {
            inputs: [],
            stateMutability: 'view',
            type: 'function',
            name: 'trustedSigner',
            outputs: [{ internalType: 'address', name: '', type: 'address' }],
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: '_nclabToken',
                type: 'address',
              },
              {
                internalType: 'address',
                name: '_shovelNFT',
                type: 'address',
              },
              {
                internalType: 'address',
                name: '_forgeNFT',
                type: 'address',
              },
              {
                internalType: 'address',
                name: '_fragmentManager',
                type: 'address',
              },
              {
                internalType: 'address',
                name: '_rewardManager',
                type: 'address',
              },
              {
                internalType: 'address',
                name: '_traitManager',
                type: 'address',
              },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'updateContracts',
          },
          {
            inputs: [
              {
                internalType: 'enum SwordBattle.GameLevel',
                name: 'level',
                type: 'uint8',
              },
              {
                internalType: 'uint256',
                name: 'entryFee',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'killReward',
                type: 'uint256',
              },
              { internalType: 'bool', name: 'active', type: 'bool' },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'updateLevelConfig',
          },
          {
            inputs: [
              {
                internalType: 'enum SwordBattle.GameLevel',
                name: 'level',
                type: 'uint8',
              },
              {
                internalType: 'uint256',
                name: 'killPercent',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'survivalPercent',
                type: 'uint256',
              },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'updatePoolConfig',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'newSigner',
                type: 'address',
              },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'updateSigner',
          },
          {
            inputs: [],
            stateMutability: 'view',
            type: 'function',
            name: 'usd1Token',
            outputs: [
              { internalType: 'contract IERC20', name: '', type: 'address' },
            ],
          },
          {
            inputs: [
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
              { internalType: 'address', name: 'to', type: 'address' },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'withdrawNclabToken',
          },
          {
            inputs: [
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
              { internalType: 'address', name: 'to', type: 'address' },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'withdrawReservePool',
          },
          {
            inputs: [
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
              { internalType: 'address', name: 'to', type: 'address' },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'withdrawUsdToken',
          },
        ],
        devdoc: {
          kind: 'dev',
          methods: {
            'batchCommit(bytes32[],bytes32[])': {
              details: 'Batch commit multiple randomness values',
              params: {
                commitments: 'Array of commitment hashes',
                purposes: 'Array of purposes for each commitment',
              },
              returns: { nonces: 'Array of nonces for the commits' },
            },
            'canReveal(address,uint256)': {
              details: 'Check if randomness can be revealed',
              params: {
                nonce: 'The commit nonce',
                user: 'The user address',
              },
              returns: {
                canRevealNow: 'Whether the commit can be revealed now',
              },
            },
            'cleanupExpiredCommits(address,uint256[])': {
              details: 'Clean up expired or used commits to save storage',
              params: {
                nonces: 'Array of nonces to clean',
                user: 'The user whose commits to clean',
              },
            },
            'commitRandom(bytes32,bytes32)': {
              details: 'Commit a randomness hash for a specific purpose',
              params: {
                commitment: 'keccak256(abi.encodePacked(randomValue, salt))',
                purpose: 'The intended use of this randomness',
              },
              returns: { nonce: 'The nonce for this commit' },
            },
            'conductLottery(uint256)': {
              details: '进行抽奖 - 代理到RewardManager',
            },
            'emergencyWithdrawAll(address)': { details: '紧急提取所有代币' },
            'getCommitInfo(address,uint256)': {
              details: 'Get commit information',
              params: {
                nonce: 'The commit nonce',
                user: 'The user address',
              },
              returns: {
                blockNumber: 'Block when committed',
                commitPurpose: 'The purpose committed for',
                deadline: 'Reveal deadline',
                revealed: 'Whether revealed',
              },
            },
            'getReservePool()': { details: '获取滞留资金总额' },
            'getReservePoolDetails()': { details: '获取滞留资金详细信息' },
            'getRoleAdmin(bytes32)': {
              details:
                "Returns the admin role that controls `role`. See {grantRole} and {revokeRole}. To change a role's admin, use {_setRoleAdmin}.",
            },
            'getRoleMember(bytes32,uint256)': {
              details:
                'Returns one of the accounts that have `role`. `index` must be a value between 0 and {getRoleMemberCount}, non-inclusive. Role bearers are not sorted in any particular way, and their ordering may change at any point. WARNING: When using {getRoleMember} and {getRoleMemberCount}, make sure you perform all queries on the same block. See the following https://forum.openzeppelin.com/t/iterating-over-elements-on-enumerableset-in-openzeppelin-contracts/2296[forum post] for more information.',
            },
            'getRoleMemberCount(bytes32)': {
              details:
                'Returns the number of accounts that have `role`. Can be used together with {getRoleMember} to enumerate all bearers of a role.',
            },
            'getUserNonce(address)': {
              details: "Get user's current nonce",
              params: { user: 'The user address' },
              returns: { _0: 'Current nonce for the user' },
            },
            'grantRole(bytes32,address)': {
              details:
                "Grants `role` to `account`. If `account` had not been already granted `role`, emits a {RoleGranted} event. Requirements: - the caller must have ``role``'s admin role. May emit a {RoleGranted} event.",
            },
            'hasRole(bytes32,address)': {
              details: 'Returns `true` if `account` has been granted `role`.',
            },
            'isPurposeUsed(address,uint256,bytes32)': {
              details: 'Check if a specific purpose has been used for a commit',
              params: {
                nonce: 'The commit nonce',
                purpose: 'The purpose to check',
                user: 'The user address',
              },
              returns: { _0: 'Whether this purpose has been used' },
            },
            'renounceRole(bytes32,address)': {
              details:
                "Revokes `role` from the calling account. Roles are often managed via {grantRole} and {revokeRole}: this function's purpose is to provide a mechanism for accounts to lose their privileges if they are compromised (such as when a trusted device is misplaced). If the calling account had been revoked `role`, emits a {RoleRevoked} event. Requirements: - the caller must be `account`. May emit a {RoleRevoked} event.",
            },
            'revealRandom(uint256,uint256,bytes32,bytes32)': {
              details: 'Reveal the committed randomness',
              params: {
                nonce: 'The nonce from commit',
                purpose: 'The purpose this reveal is for',
                randomValue: 'The original random value',
                salt: 'The salt used in commitment',
              },
              returns: { _0: 'The secure random value' },
            },
            'revokeRole(bytes32,address)': {
              details:
                "Revokes `role` from `account`. If `account` had been granted `role`, emits a {RoleRevoked} event. Requirements: - the caller must have ``role``'s admin role. May emit a {RoleRevoked} event.",
            },
            'setLotteryRandomness(uint256,address,uint256)': {
              details: '设置抽奖随机数',
            },
            'supportsInterface(bytes4)': {
              details: 'See {IERC165-supportsInterface}.',
            },
            'updateContracts(address,address,address,address,address,address)':
              {
                details: '更新合约地址',
              },
            'updatePoolConfig(uint8,uint256,uint256)': {
              details: '更新奖池配置',
            },
            'withdrawNclabToken(uint256,address)': {
              details: '管理员提取Nclab代币',
            },
            'withdrawReservePool(uint256,address)': {
              details: '提取滞留资金（dev收益）',
            },
            'withdrawUsdToken(uint256,address)': {
              details: '管理员提取USD代币',
            },
          },
          version: 1,
        },
        userdoc: { kind: 'user', methods: {}, version: 1 },
      },
      settings: {
        remappings: [
          '@openzeppelin/=lib/openzeppelin-contracts/',
          'ds-test/=lib/openzeppelin-contracts/lib/forge-std/lib/ds-test/src/',
          'erc4626-tests/=lib/openzeppelin-contracts/lib/erc4626-tests/',
          'forge-std/=lib/forge-std/src/',
          'openzeppelin-contracts/=lib/openzeppelin-contracts/',
          'openzeppelin/=lib/openzeppelin-contracts/contracts/',
        ],
        optimizer: { enabled: true, runs: 200000 },
        metadata: { bytecodeHash: 'ipfs' },
        compilationTarget: { 'src/core/SwordBattle.sol': 'SwordBattle' },
        evmVersion: 'paris',
        libraries: {},
        viaIR: true,
      },
      sources: {
        'lib/openzeppelin-contracts/contracts/access/AccessControl.sol': {
          keccak256:
            '0x0dd6e52cb394d7f5abe5dca2d4908a6be40417914720932de757de34a99ab87f',
          urls: [
            'bzz-raw://dc117ce50ea746cab6b97ed1a1facee17a715ae0cb95d67b943dacbaf15176fb',
            'dweb:/ipfs/QmYRZ2UGNYwsHwfNu7Wjr8L2j1LBZ1mKv6NvbwgterYMXc',
          ],
          license: 'MIT',
        },
        'lib/openzeppelin-contracts/contracts/access/AccessControlEnumerable.sol':
          {
            keccak256:
              '0x13f5e15f2a0650c0b6aaee2ef19e89eaf4870d6e79662d572a393334c1397247',
            urls: [
              'bzz-raw://7ee05f28f549a5d6515e152580716b87636ed4bfab9812499a6e3803df88288b',
              'dweb:/ipfs/QmeEnhdwY1t5Y3YU5a4ffzgXuToydH2PNdNxV9W7dEPRQJ',
            ],
            license: 'MIT',
          },
        'lib/openzeppelin-contracts/contracts/access/IAccessControl.sol': {
          keccak256:
            '0x59ce320a585d7e1f163cd70390a0ef2ff9cec832e2aa544293a00692465a7a57',
          urls: [
            'bzz-raw://bb2c137c343ef0c4c7ce7b18c1d108afdc9d315a04e48307288d2d05adcbde3a',
            'dweb:/ipfs/QmUxhrAQM3MM3FF5j7AtcXLXguWCJBHJ14BRdVtuoQc8Fh',
          ],
          license: 'MIT',
        },
        'lib/openzeppelin-contracts/contracts/access/IAccessControlEnumerable.sol':
          {
            keccak256:
              '0xba4459ab871dfa300f5212c6c30178b63898c03533a1ede28436f11546626676',
            urls: [
              'bzz-raw://3dcc7b09bfa6e18aab262ca372f4a9b1fc82e294b430706a4e1378cf58e6a276',
              'dweb:/ipfs/QmT8oSAcesdctR15HMLhr2a1HRpXymxdjTfdtfTYJcj2N2',
            ],
            license: 'MIT',
          },
        'lib/openzeppelin-contracts/contracts/security/Pausable.sol': {
          keccak256:
            '0x0849d93b16c9940beb286a7864ed02724b248b93e0d80ef6355af5ef15c64773',
          urls: [
            'bzz-raw://4ddabb16009cd17eaca3143feadf450ac13e72919ebe2ca50e00f61cb78bc004',
            'dweb:/ipfs/QmSPwPxX7d6TTWakN5jy5wsaGkS1y9TW8fuhGSraMkLk2B',
          ],
          license: 'MIT',
        },
        'lib/openzeppelin-contracts/contracts/security/ReentrancyGuard.sol': {
          keccak256:
            '0xa535a5df777d44e945dd24aa43a11e44b024140fc340ad0dfe42acf4002aade1',
          urls: [
            'bzz-raw://41319e7f621f2dc3733511332c4fd032f8e32ad2aa7fd6f665c19741d9941a34',
            'dweb:/ipfs/QmcYR3bd862GD1Bc7jwrU9bGxrhUu5na1oP964bDCu2id1',
          ],
          license: 'MIT',
        },
        'lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol': {
          keccak256:
            '0x287b55befed2961a7eabd7d7b1b2839cbca8a5b80ef8dcbb25ed3d4c2002c305',
          urls: [
            'bzz-raw://bd39944e8fc06be6dbe2dd1d8449b5336e23c6a7ba3e8e9ae5ae0f37f35283f5',
            'dweb:/ipfs/QmPV3FGYjVwvKSgAXKUN3r9T9GwniZz83CxBpM7vyj2G53',
          ],
          license: 'MIT',
        },
        'lib/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Permit.sol':
          {
            keccak256:
              '0xec63854014a5b4f2b3290ab9103a21bdf902a508d0f41a8573fea49e98bf571a',
            urls: [
              'bzz-raw://bc5b5dc12fbc4002f282eaa7a5f06d8310ed62c1c77c5770f6283e058454c39a',
              'dweb:/ipfs/Qme9rE2wS3yBuyJq9GgbmzbsBQsW2M2sVFqYYLw7bosGrv',
            ],
            license: 'MIT',
          },
        'lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol':
          {
            keccak256:
              '0x909d608c2db6eb165ca178c81289a07ed2e118e444d0025b2a85c97d0b44a4fa',
            urls: [
              'bzz-raw://656cda26512ddd7373c2d5551c8fae759fc30f05b10f0fc2e738e9274199dbd4',
              'dweb:/ipfs/QmTSArSzQRFbQmHgq7U1PZXnsDFhvDZhKVu9CzMG4yo6Lx',
            ],
            license: 'MIT',
          },
        'lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol': {
          keccak256:
            '0x2c309e7df9e05e6ce15bedfe74f3c61b467fc37e0fae9eab496acf5ea0bbd7ff',
          urls: [
            'bzz-raw://7063b5c98711a98018ba4635ac74cee1c1cfa2ea01099498e062699ed9530005',
            'dweb:/ipfs/QmeJ8rGXkcv7RrqLdAW8PCXPAykxVsddfYY6g5NaTwmRFE',
          ],
          license: 'MIT',
        },
        'lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol': {
          keccak256:
            '0x5bce51e11f7d194b79ea59fe00c9e8de9fa2c5530124960f29a24d4c740a3266',
          urls: [
            'bzz-raw://7e66dfde185df46104c11bc89d08fa0760737aa59a2b8546a656473d810a8ea4',
            'dweb:/ipfs/QmXvyqtXPaPss2PD7eqPoSao5Szm2n6UMoiG8TZZDjmChR',
          ],
          license: 'MIT',
        },
        'lib/openzeppelin-contracts/contracts/token/ERC721/IERC721Receiver.sol':
          {
            keccak256:
              '0xa82b58eca1ee256be466e536706850163d2ec7821945abd6b4778cfb3bee37da',
            urls: [
              'bzz-raw://6e75cf83beb757b8855791088546b8337e9d4684e169400c20d44a515353b708',
              'dweb:/ipfs/QmYvPafLfoquiDMEj7CKHtvbgHu7TJNPSVPSCjrtjV8HjV',
            ],
            license: 'MIT',
          },
        'lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol':
          {
            keccak256:
              '0xa8796bd16014cefb8c26449413981a49c510f92a98d6828494f5fd046223ced3',
            urls: [
              'bzz-raw://63a5e0bb5a7d182e0d0eef87033f78115eab791de3626a929bc98c157087880a',
              'dweb:/ipfs/QmetkXAu2CJKS4qrZtEQPU8okAPwUwa6HL4XYwk8vrYMk8',
            ],
            license: 'MIT',
          },
        'lib/openzeppelin-contracts/contracts/token/ERC721/extensions/IERC721Enumerable.sol':
          {
            keccak256:
              '0xd1556954440b31c97a142c6ba07d5cade45f96fafd52091d33a14ebe365aecbf',
            urls: [
              'bzz-raw://26fef835622b46a5ba08b3ef6b46a22e94b5f285d0f0fb66b703bd30217d2c34',
              'dweb:/ipfs/QmZ548qdwfL1qF7aXz3xh1GCdTiST81kGGuKRqVUfYmPZR',
            ],
            license: 'MIT',
          },
        'lib/openzeppelin-contracts/contracts/token/ERC721/extensions/IERC721Metadata.sol':
          {
            keccak256:
              '0x75b829ff2f26c14355d1cba20e16fe7b29ca58eb5fef665ede48bc0f9c6c74b9',
            urls: [
              'bzz-raw://a0a107160525724f9e1bbbab031defc2f298296dd9e331f16a6f7130cec32146',
              'dweb:/ipfs/QmemujxSd7gX8A9M8UwmNbz4Ms3U9FG9QfudUgxwvTmPWf',
            ],
            license: 'MIT',
          },
        'lib/openzeppelin-contracts/contracts/utils/Address.sol': {
          keccak256:
            '0x006dd67219697fe68d7fbfdea512e7c4cb64a43565ed86171d67e844982da6fa',
          urls: [
            'bzz-raw://2455248c8ddd9cc6a7af76a13973cddf222072427e7b0e2a7d1aff345145e931',
            'dweb:/ipfs/QmfYjnjRbWqYpuxurqveE6HtzsY1Xx323J428AKQgtBJZm',
          ],
          license: 'MIT',
        },
        'lib/openzeppelin-contracts/contracts/utils/Context.sol': {
          keccak256:
            '0xe2e337e6dde9ef6b680e07338c493ebea1b5fd09b43424112868e9cc1706bca7',
          urls: [
            'bzz-raw://6df0ddf21ce9f58271bdfaa85cde98b200ef242a05a3f85c2bc10a8294800a92',
            'dweb:/ipfs/QmRK2Y5Yc6BK7tGKkgsgn3aJEQGi5aakeSPZvS65PV8Xp3',
          ],
          license: 'MIT',
        },
        'lib/openzeppelin-contracts/contracts/utils/Strings.sol': {
          keccak256:
            '0x3088eb2868e8d13d89d16670b5f8612c4ab9ff8956272837d8e90106c59c14a0',
          urls: [
            'bzz-raw://b81d9ff6559ea5c47fc573e17ece6d9ba5d6839e213e6ebc3b4c5c8fe4199d7f',
            'dweb:/ipfs/QmPCW1bFisUzJkyjroY3yipwfism9RRCigCcK1hbXtVM8n',
          ],
          license: 'MIT',
        },
        'lib/openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol': {
          keccak256:
            '0x809bc3edb4bcbef8263fa616c1b60ee0004b50a8a1bfa164d8f57fd31f520c58',
          urls: [
            'bzz-raw://8b93a1e39a4a19eba1600b92c96f435442db88cac91e315c8291547a2a7bcfe2',
            'dweb:/ipfs/QmTm34KVe6uZBZwq8dZDNWwPcm24qBJdxqL3rPxBJ4LrMv',
          ],
          license: 'MIT',
        },
        'lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol': {
          keccak256:
            '0xd10975de010d89fd1c78dc5e8a9a7e7f496198085c151648f20cba166b32582b',
          urls: [
            'bzz-raw://fb0048dee081f6fffa5f74afc3fb328483c2a30504e94a0ddd2a5114d731ec4d',
            'dweb:/ipfs/QmZptt1nmYoA5SgjwnSgWqgUSDgm4q52Yos3xhnMv3MV43',
          ],
          license: 'MIT',
        },
        'lib/openzeppelin-contracts/contracts/utils/introspection/IERC165.sol':
          {
            keccak256:
              '0x447a5f3ddc18419d41ff92b3773fb86471b1db25773e07f877f548918a185bf1',
            urls: [
              'bzz-raw://be161e54f24e5c6fae81a12db1a8ae87bc5ae1b0ddc805d82a1440a68455088f',
              'dweb:/ipfs/QmP7C3CHdY9urF4dEMb9wmsp1wMxHF6nhA2yQE5SKiPAdy',
            ],
            license: 'MIT',
          },
        'lib/openzeppelin-contracts/contracts/utils/math/Math.sol': {
          keccak256:
            '0xe4455ac1eb7fc497bb7402579e7b4d64d928b846fce7d2b6fde06d366f21c2b3',
          urls: [
            'bzz-raw://cc8841b3cd48ad125e2f46323c8bad3aa0e88e399ec62acb9e57efa7e7c8058c',
            'dweb:/ipfs/QmSqE4mXHA2BXW58deDbXE8MTcsL5JSKNDbm23sVQxRLPS',
          ],
          license: 'MIT',
        },
        'lib/openzeppelin-contracts/contracts/utils/math/SignedMath.sol': {
          keccak256:
            '0xf92515413956f529d95977adc9b0567d583c6203fc31ab1c23824c35187e3ddc',
          urls: [
            'bzz-raw://c50fcc459e49a9858b6d8ad5f911295cb7c9ab57567845a250bf0153f84a95c7',
            'dweb:/ipfs/QmcEW85JRzvDkQggxiBBLVAasXWdkhEysqypj9EaB6H2g6',
          ],
          license: 'MIT',
        },
        'lib/openzeppelin-contracts/contracts/utils/structs/EnumerableSet.sol':
          {
            keccak256:
              '0x9f4357008a8f7d8c8bf5d48902e789637538d8c016be5766610901b4bba81514',
            urls: [
              'bzz-raw://20bf19b2b851f58a4c24543de80ae70b3e08621f9230eb335dc75e2d4f43f5df',
              'dweb:/ipfs/QmSYuH1AhvJkPK8hNvoPqtExBcgTB42pPRHgTHkS5c5zYW',
            ],
            license: 'MIT',
          },
        'src/abstracts/SecureRandomness.sol': {
          keccak256:
            '0x75efd9846379b7004d8d296b5ec9cc063c6af40bfa65a8712e8a39c83e0c2135',
          urls: [
            'bzz-raw://da265648fde6c8a840bebec0ef70a7c60c502b5b7e21c737df4aef830b24c6d7',
            'dweb:/ipfs/Qmf3MTd8GrhaszA6VX2Jio6DYqzUpSguRFxY9kb3jfkFkx',
          ],
          license: 'MIT',
        },
        'src/core/SwordBattle.sol': {
          keccak256:
            '0x4f9784170ae0b16ff54d66bd923042294413a9640217cbb649cfe962e048a16a',
          urls: [
            'bzz-raw://ad077858517e30e34d8da4b73d7089a25c6175f2fc93f8a15deab8f7963203fa',
            'dweb:/ipfs/QmXZjzwCnrGSaaGKdNaaEXit9gJiYGc5Yjtg9TixQdKeAT',
          ],
          license: 'MIT',
        },
        'src/interfaces/IFragmentManager.sol': {
          keccak256:
            '0x9f69df0aa7caa991bf3121d3ea3efff18147e5127d15b4a1e4f4f03ba4bf21ef',
          urls: [
            'bzz-raw://54a73312b9a655e778cb178bdb170b75d45f804dcda21527ecb3f258242dbdf2',
            'dweb:/ipfs/QmRbebpUxMws4Z549mTLfHkzhmVLM2tUAefkKZCu7c2P2x',
          ],
          license: 'MIT',
        },
        'src/interfaces/IRandomnessService.sol': {
          keccak256:
            '0x2207d9ba7c4d01aac257ff05e4217262c23c14d3700ab91a20affd6af8baf8a0',
          urls: [
            'bzz-raw://2400ed9dde7c0ef19f540f34df05a4e6b7e6d836dd6c632e744fd2cfa09df895',
            'dweb:/ipfs/QmcnQtWw734j8fwntWcfvbtDxKSPWnMRoWZe7Bx9gi2nWN',
          ],
          license: 'MIT',
        },
        'src/interfaces/IRewardManager.sol': {
          keccak256:
            '0x4fe880f90077c3fbc700a59bccccd9713fb1f50e3495e91f92c5808d2f28d484',
          urls: [
            'bzz-raw://1bed6403801e1c3e542bf54b53c470d53a21ef3a97a6489affdb3a3b5b17ebe3',
            'dweb:/ipfs/QmYW6XhiMCVGqb58sagTeP1qXJ88XY7i58VJ5KmAau1y5q',
          ],
          license: 'MIT',
        },
        'src/interfaces/IShovelTraitManager.sol': {
          keccak256:
            '0x8ae3b67c908f4aee23a647b00c3be876ecfc878f5ffad3e59f618948e2353718',
          urls: [
            'bzz-raw://b9da7a8a1c060ccb061c5d8e9532628b0518249263fa913be0968d0071c3ced9',
            'dweb:/ipfs/QmTgsJALzL8XSJtV98V9xuvPkjBa3osidqXFFrw29sq9Ts',
          ],
          license: 'MIT',
        },
        'src/interfaces/ISwordBattle.sol': {
          keccak256:
            '0x8db5848799985af49793c9df4963ab5069b80d7a4241cad6d50c6f2190d83bdd',
          urls: [
            'bzz-raw://141b8e49644155ec4b0ec42ee8a0a9c40209634c0eb7f66580882c6850b42b94',
            'dweb:/ipfs/QmY3J8SWpipeJLP9ZckdTmeUCBL4dvwD4bJXBn7WQYLrWe',
          ],
          license: 'MIT',
        },
        'src/libraries/FundManagementLib.sol': {
          keccak256:
            '0xe2499abb67102237265c3404db43210fefdc57c95b0dcc7bc9671dbcf593b3d5',
          urls: [
            'bzz-raw://eafccc7997005bb1b664cbe5d1b40ef322b2513dad0b425078be6fe348682f87',
            'dweb:/ipfs/QmQJunZcqrYiehusdDwXhisD2Uys3iwAU5nCWebxbW74P1',
          ],
          license: 'MIT',
        },
        'src/libraries/RandomnessTypes.sol': {
          keccak256:
            '0xf46c822edafd3da2747ea852183bedc755871a170e3c80a100146624fc24a800',
          urls: [
            'bzz-raw://54e4c992d44edad8abb1ae829db960c31b333944407bfcf0c963f40486a2f501',
            'dweb:/ipfs/QmeCbhxbyKRc7aCVf87uAR159KQrTfqFt8YgBbbmrYwb5t',
          ],
          license: 'MIT',
        },
        'src/managers/GameConfigManager.sol': {
          keccak256:
            '0x302fb2c5834d4b66f8aebdde85f1c559d53cf6a23d91885984bc0982142f2e8e',
          urls: [
            'bzz-raw://db17378d48a0c561bb7dd707a586ed647ba083b8079469fd28ba20f00530907c',
            'dweb:/ipfs/QmfTT4usjYgpCXUR9YspPK4BNwffCemfc3jRcsv2yjDX7W',
          ],
          license: 'MIT',
        },
        'src/managers/GameRewardManager.sol': {
          keccak256:
            '0xb7cea8b2f2251635666d62302555e7954d558bd10316be9505d6846f69b536a4',
          urls: [
            'bzz-raw://2651ea24f3635a9018eedaf0d82676dfdc22d888139f6399b6685bb5091f1ebb',
            'dweb:/ipfs/QmNpGHRXstrEe4i3CQ8yJhzFJ5cgktTFKRvcBPaFaW1z9f',
          ],
          license: 'MIT',
        },
        'src/nft/ForgeNFT.sol': {
          keccak256:
            '0xab393456469d8f568bf3f4c1953d6aaee253a1ada8a03f14acfdc6b209c63723',
          urls: [
            'bzz-raw://46fff74ea2655634476d2bc63fdfb3e63ea1a448a741c5e0cac6733513b35a14',
            'dweb:/ipfs/QmdruDKGkDxQw26or8hwREfDdRjY57JX3PNFAB4hR3GDAS',
          ],
          license: 'MIT',
        },
        'src/nft/ShovelNFTSlim.sol': {
          keccak256:
            '0x2d7d903391fb82558210f03996268a302dfbc41f1b8dc427c4d7fcdd1997bc0f',
          urls: [
            'bzz-raw://82eaed911015907fd8bbf068faa3de5ea7309404ca50f512fdb8508a20a7a994',
            'dweb:/ipfs/Qma8ZkjT4DzzkR51jfQgyKTVvuCaUGA39J5EJo4Q5VSUrU',
          ],
          license: 'MIT',
        },
        'src/nft/ShovelSynthesizer.sol': {
          keccak256:
            '0x202ad2c31cf95928849468bc602c34789cb12ac4787ab08cd0bed1b24013f25d',
          urls: [
            'bzz-raw://d0d132700c148705e2ed73e5a74bfc4036ddcb563f8dc0b6554466bfd8d52888',
            'dweb:/ipfs/QmVCqVYrShyqz7jTFctVvcF2JCWsa99ncRZBvpy9ADWUjP',
          ],
          license: 'MIT',
        },
      },
      version: 1,
    },
    id: 52,
  },
];

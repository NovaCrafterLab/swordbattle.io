// 区块链服务
// 提供区块链相关的业务逻辑

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { createPublicClient, createWalletClient, http, formatEther, parseEther, getAddress } from 'viem';
import { bsc, bscTestnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { BlockchainConfig, defaultBlockchainConfig, validateBlockchainConfig } from './blockchain.config';

// 导入ABI - 只使用GameAggregator
import { GAME_AGGREGATOR_ABI } from './abis/GameAggregator.abi';

// RPC池配置
const BSC_MAINNET_RPC_POOL = [
  'https://rpc.ankr.com/bsc/861a4f3afee73437812056e2efd748f76db6220c614f0e34a9c7b2f66c9e97d5',
  'https://rpc.ankr.com/bsc/45608a7cdae0c7873dcbd9196953b7015f8d7127736df17480472224b128e67e',
  'https://rpc.ankr.com/bsc/6912fa941610bbd399c033a47c0103ac0611db7e30b95c19b8087d5363670537',
  'https://rpc.ankr.com/bsc/c5c5e3d8c1b1b285ba4778fb16c35fc211b3eb691cf9bd2a9b9a155eca0f4bc2',
];

const BSC_TESTNET_RPC_POOL = [
  'https://bsc-testnet-dataseed.bnbchain.org',
  'https://bsc-testnet.bnbchain.org',
  'https://bsc-testnet-rpc.publicnode.com',
  'https://endpoints.omniatech.io/v1/bsc/testnet/public',
];

@Injectable()
export class BlockchainService implements OnModuleInit {
  private readonly logger = new Logger(BlockchainService.name);
  private config: BlockchainConfig;
  private publicClient: any;
  private walletClient: any;
  private account: any;
  private isInitialized = false;

  constructor() {
    this.config = defaultBlockchainConfig;
  }

  async onModuleInit() {
    if (this.config.enabled) {
      await this.initialize();
    } else {
      this.logger.log('Blockchain service disabled');
    }
  }

  private async initialize() {
    try {
      this.logger.log('Initializing blockchain service...');

      // 验证配置
      if (!validateBlockchainConfig(this.config)) {
        throw new Error('Invalid blockchain configuration');
      }

      // 选择链和RPC
      const chain = this.config.environment.isDev ? bscTestnet : bsc;
      const rpcPool = this.config.environment.isDev ? BSC_TESTNET_RPC_POOL : BSC_MAINNET_RPC_POOL;
      const rpcUrl = this.config.rpcUrl || rpcPool[0];

      this.logger.log(`Using ${chain.name} (Chain ID: ${chain.id})`);
      this.logger.log(`RPC URL: ${rpcUrl}`);

      // 创建公共客户端
      this.publicClient = createPublicClient({
        chain,
        transport: http(rpcUrl),
      });

      // 创建钱包客户端（如果有私钥）
      if (this.config.trustedSigner) {
        this.account = privateKeyToAccount(this.config.trustedSigner as `0x${string}`);
        this.walletClient = createWalletClient({
          account: this.account,
          chain,
          transport: http(rpcUrl),
        });
        this.logger.log(`Wallet account: ${this.account.address}`);
      }

      // 测试连接
      const blockNumber = await this.publicClient.getBlockNumber();
      this.logger.log(`Connected to blockchain, current block: ${blockNumber}`);

      this.isInitialized = true;
      this.logger.log('Blockchain service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize blockchain service:', error);
      throw error;
    }
  }

  // 检查服务是否可用
  isAvailable(): boolean {
    return this.config.enabled && this.isInitialized;
  }

  // 获取游戏信息
  async getGameInfo(gameId: number) {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service not available');
    }

    try {
      const result = await this.publicClient.readContract({
        address: this.config.contracts.gameAggregator as `0x${string}`,
        abi: GAME_AGGREGATOR_ABI,
        functionName: 'getGameFullInfo',
        args: [BigInt(gameId)],
      });

      // GameAggregator返回GameFullInfo结构体
      return {
        gameId: Number(result.gameId),
        level: Number(result.level), // 游戏级别：0=EASY, 1=MEDIUM, 2=HARD
        status: Number(result.status), // 游戏状态：0=WAITING, 1=ACTIVE, 2=ENDED
        totalPool: formatEther(result.totalPool),
        createdAt: Number(result.createdAt),
        endedAt: Number(result.endedAt),
        gameDuration: Number(result.gameDuration),
        playerCount: Number(result.playerCount),
        maxPlayers: Number(result.maxPlayers),
        activePlayers: result.activePlayers,
        canJoin: result.canJoin,
        entryFee: formatEther(result.entryFee),
      };
    } catch (error) {
      this.logger.error(`Failed to get game info for game ${gameId}:`, error);
      throw error;
    }
  }

  // 获取游戏玩家列表 - 现在从getGameFullInfo获取activePlayers
  async getGamePlayers(gameId: number): Promise<string[]> {
    const gameInfo = await this.getGameInfo(gameId);
    return gameInfo.activePlayers || [];
  }

  // 游戏分数和排名现在通过GameAggregator的其他方法获取
  // 可以使用 getPlayerCompleteRewards 或 getPlayerDashboard 等方法

  // ========== 新的GameAggregator函数 ==========

  // 获取游戏完整信息
  async getGameFullInfo(gameId: number) {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service not available');
    }

    try {
      const result = await this.publicClient.readContract({
        address: this.config.contracts.gameAggregator as `0x${string}`,
        abi: GAME_AGGREGATOR_ABI,
        functionName: 'getGameFullInfo',
        args: [BigInt(gameId)],
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to get game full info for game ${gameId}:`, error);
      throw error;
    }
  }

  // 获取玩家完整奖励信息
  async getPlayerCompleteRewards(gameId: number, playerAddress: string) {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service not available');
    }

    try {
      const result = await this.publicClient.readContract({
        address: this.config.contracts.gameAggregator as `0x${string}`,
        abi: GAME_AGGREGATOR_ABI,
        functionName: 'getPlayerCompleteRewards',
        args: [BigInt(gameId), playerAddress as `0x${string}`],
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to get player complete rewards for game ${gameId}, player ${playerAddress}:`, error);
      throw error;
    }
  }

  // 获取玩家仪表板
  async getPlayerDashboard(playerAddress: string) {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service not available');
    }

    try {
      const result = await this.publicClient.readContract({
        address: this.config.contracts.gameAggregator as `0x${string}`,
        abi: GAME_AGGREGATOR_ABI,
        functionName: 'getPlayerDashboard',
        args: [playerAddress as `0x${string}`],
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to get player dashboard for ${playerAddress}:`, error);
      throw error;
    }
  }

  // 获取玩家所有奖励
  async getPlayerAllRewards(playerAddress: string) {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service not available');
    }

    try {
      const result = await this.publicClient.readContract({
        address: this.config.contracts.gameAggregator as `0x${string}`,
        abi: GAME_AGGREGATOR_ABI,
        functionName: 'getPlayerAllRewards',
        args: [playerAddress as `0x${string}`],
      });

      // 返回: [totalUsd, totalNclab, fragmentBalance, claimableGames, nextClaimTime]
      return {
        totalUsd: result[0] as bigint,
        totalNclab: result[1] as bigint,
        fragmentBalance: result[2] as bigint,
        claimableGames: result[3] as bigint,
        nextClaimTime: result[4] as bigint,
      };
    } catch (error) {
      this.logger.error(`Failed to get player all rewards for ${playerAddress}:`, error);
      throw error;
    }
  }

  // 获取可领取奖励的游戏
  async getPlayerClaimableGames(playerAddress: string, maxGames: number = 25) {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service not available');
    }

    try {
      const result = await this.publicClient.readContract({
        address: this.config.contracts.gameAggregator as `0x${string}`,
        abi: GAME_AGGREGATOR_ABI,
        functionName: 'getPlayerClaimableGames',
        args: [playerAddress as `0x${string}`, BigInt(maxGames)],
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to get player claimable games for ${playerAddress}:`, error);
      throw error;
    }
  }

  // 获取玩家奖励信息（新合约功能）
  async getPlayerRewards(gameId: number, playerAddress: string) {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service not available');
    }

    try {
      const result = await this.publicClient.readContract({
        address: this.config.contracts.gameAggregator as `0x${string}`,
        abi: GAME_AGGREGATOR_ABI,
        functionName: 'getPlayerCompleteRewards',
        args: [BigInt(gameId), playerAddress as `0x${string}`],
      });

      // 检查返回结果是否有效 - 支持对象和数组两种格式
      if (!result) {
        this.logger.warn(`Invalid result from getPlayerCompleteRewards for game ${gameId}, player ${playerAddress}: result is null/undefined`);
        // 返回默认值而不是抛出错误
        return {
          killReward: '0',
          lotteryReward: '0',
          guaranteedReward: '0',
          fragmentReward: '0',
          totalReward: '0',
          claimableTime: 0,
          canClaim: false,
          claimed: false,
          usdAmount: '0',
          nclabAmount: '0',
          usdClaimable: false,
          nclabClaimable: false,
          usdClaimed: false,
          nclabClaimed: false,
        };
      }

      let usdAmount: bigint, nclabAmount: bigint, fragmentBonus: bigint;
      let usdClaimable: boolean, nclabClaimable: boolean, nclabClaimableTime: bigint;
      let usdClaimed: boolean, nclabClaimed: boolean;

      // 处理对象格式的返回值（新格式）
      if (typeof result === 'object' && !Array.isArray(result)) {
        usdAmount = result.usdRewards ? BigInt(result.usdRewards) : BigInt(0);
        nclabAmount = result.nclabRewards ? BigInt(result.nclabRewards) : BigInt(0);
        fragmentBonus = result.fragmentBalance ? BigInt(result.fragmentBalance) : BigInt(0);
        usdClaimable = Boolean(result.usdClaimable);
        nclabClaimable = Boolean(result.nclabClaimable);
        nclabClaimableTime = result.nclabClaimableTime ? BigInt(result.nclabClaimableTime) : BigInt(0);
        usdClaimed = Boolean(result.usdClaimed);
        nclabClaimed = Boolean(result.nclabClaimed);
      }
      // 处理数组格式的返回值（旧格式）
      else if (Array.isArray(result) && result.length >= 8) {
        usdAmount = result[0] ? BigInt(result[0]) : BigInt(0);
        nclabAmount = result[1] ? BigInt(result[1]) : BigInt(0);
        fragmentBonus = result[2] ? BigInt(result[2]) : BigInt(0);
        usdClaimable = Boolean(result[3]);
        nclabClaimable = Boolean(result[4]);
        nclabClaimableTime = result[5] ? BigInt(result[5]) : BigInt(0);
        usdClaimed = Boolean(result[6]);
        nclabClaimed = Boolean(result[7]);
      }
      // 无效格式
      else {
        this.logger.warn(`Invalid result format from getPlayerCompleteRewards for game ${gameId}, player ${playerAddress}: expected object or array with 8+ elements`);
        return {
          killReward: '0',
          lotteryReward: '0',
          guaranteedReward: '0',
          fragmentReward: '0',
          totalReward: '0',
          claimableTime: 0,
          canClaim: false,
          claimed: false,
          usdAmount: '0',
          nclabAmount: '0',
          usdClaimable: false,
          nclabClaimable: false,
          usdClaimed: false,
          nclabClaimed: false,
        };
      }

      // 计算总USD1奖励
      const totalReward = usdAmount;

      return {
        killReward: formatEther(usdAmount), // 兼容旧接口
        lotteryReward: formatEther(BigInt(0)), // 兼容旧接口
        guaranteedReward: formatEther(BigInt(0)), // 兼容旧接口
        fragmentReward: formatEther(fragmentBonus),
        totalReward: formatEther(totalReward),
        claimableTime: Number(nclabClaimableTime),
        canClaim: usdClaimable,
        claimed: usdClaimed, // 使用真实的已领取状态
        // 新增字段
        usdAmount: formatEther(usdAmount),
        nclabAmount: formatEther(nclabAmount),
        usdClaimable,
        nclabClaimable,
        usdClaimed,
        nclabClaimed,
      };
    } catch (error) {
      this.logger.error(`Failed to get player rewards for ${playerAddress} in game ${gameId}:`, error);
      // 返回默认值而不是抛出错误，避免影响整个API响应
      return {
        killReward: '0',
        lotteryReward: '0',
        guaranteedReward: '0',
        fragmentReward: '0',
        totalReward: '0',
        claimableTime: 0,
        canClaim: false,
        claimed: false,
        usdAmount: '0',
        nclabAmount: '0',
        usdClaimable: false,
        nclabClaimable: false,
        usdClaimed: false,
        nclabClaimed: false,
      };
    }
  }

  // 获取玩家nonce
  async getPlayerNonce(playerAddress: string): Promise<number> {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service not available');
    }

    try {
      const nonce = await this.publicClient.readContract({
        address: this.config.contracts.gameAggregator as `0x${string}`,
        abi: GAME_AGGREGATOR_ABI,
        functionName: 'getPlayerNonce',
        args: [playerAddress as `0x${string}`],
      });

      return Number(nonce);
    } catch (error) {
      this.logger.error(`Failed to get player nonce for ${playerAddress}:`, error);
      throw error;
    }
  }

  // 获取玩家基本信息（仅返回奖励相关数据）
  async getPlayerInfo(gameId: number, playerAddress: string) {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service not available');
    }

    try {
      // 新合约没有getPlayerInfo函数，从奖励数据推断基本信息
      const rewardData = await this.getPlayerRewards(gameId, playerAddress);
      
      return {
        playerAddr: playerAddress,
        kills: 0, // 从奖励数据无法获取击杀数
        score: 0, // 从奖励数据无法获取分数
        submitted: rewardData.usdAmount !== '0' || rewardData.nclabAmount !== '0', // 有奖励说明已提交
        fragmentReward: rewardData.fragmentReward,
        // 添加奖励相关字段作为补充
        reward: rewardData.totalReward,
        claimed: rewardData.claimed,
        // 添加新的字段以支持前端
        usdAmount: rewardData.usdAmount,
        nclabAmount: rewardData.nclabAmount,
        usdClaimable: rewardData.usdClaimable,
        nclabClaimable: rewardData.nclabClaimable,
        usdClaimed: rewardData.usdClaimed,
        nclabClaimed: rewardData.nclabClaimed,
        totalReward: rewardData.totalReward,
        claimableTime: rewardData.claimableTime,
      };
    } catch (error) {
      this.logger.error(`Failed to get player info for ${playerAddress} in game ${gameId}:`, error);
      // 返回默认值而不是抛出错误
      return {
        playerAddr: playerAddress,
        kills: 0,
        score: 0,
        submitted: false,
        fragmentReward: '0',
        reward: '0',
        claimed: false,
        usdAmount: '0',
        nclabAmount: '0',
        usdClaimable: false,
        nclabClaimable: false,
        usdClaimed: false,
        nclabClaimed: false,
        totalReward: '0',
        claimableTime: 0,
      };
    }
  }

  // 获取入场费
  async getEntryFee(): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service not available');
    }

    try {
      const entryFee = await this.publicClient.readContract({
        address: this.config.contracts.gameAggregator as `0x${string}`,
        abi: GAME_AGGREGATOR_ABI,
        functionName: 'entryFee',
        args: [],
      });

      return formatEther(entryFee);
    } catch (error) {
      this.logger.error('Failed to get entry fee:', error);
      throw error;
    }
  }

  // 获取游戏计数器
  async getGameCounter(): Promise<number> {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service not available');
    }

    try {
      const counter = await this.publicClient.readContract({
        address: this.config.contracts.gameAggregator as `0x${string}`,
        abi: GAME_AGGREGATOR_ABI,
        functionName: 'getCurrentGameId',
      });

      return Number(counter);
    } catch (error) {
      this.logger.error('Failed to get game counter:', error);
      throw error;
    }
  }

  // 获取玩家游戏历史
  async getPlayerGameHistory(playerAddress: string, maxGames: number = 50) {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service not available');
    }

    try {
      this.logger.log(`Getting game history for player: ${playerAddress}`);
      
      // 获取当前游戏计数器，从最新的游戏开始查找
      const currentGameId = await this.getGameCounter();
      
      const gameHistory = [];
      let foundGames = 0;
      
      // 从最新的游戏往前查找，直到找到足够多的游戏或检查完所有游戏
      for (let gameId = currentGameId; gameId >= 1 && foundGames < maxGames; gameId--) {
        try {
          // 检查玩家是否参与了这个游戏
          const players = await this.getGamePlayers(gameId);
          const playerLowerCase = playerAddress.toLowerCase();
          
          if (players.some(p => p.toLowerCase() === playerLowerCase)) {
            // 获取玩家在这个游戏中的详细信息
            const playerInfo = await this.getPlayerInfo(gameId, playerAddress);
            const playerRewards = await this.getPlayerRewards(gameId, playerAddress);
            const gameInfo = await this.getGameInfo(gameId);
            
            // 获取排名
            let rank = 0;
            let isWinner = false;
            
            // 排名信息现在从GameAggregator的奖励数据推断
            // 如果有奖励且大于0，认为是获胜者
            isWinner = parseFloat(playerRewards.totalReward) > 0;
            rank = isWinner ? 1 : 0; // 简化排名逻辑
            
            gameHistory.push({
              gameId,
              score: playerInfo.score,
              reward: playerRewards.totalReward,
              hasClaimed: playerRewards.claimed,
              rank,
              isWinner,
              level: gameInfo.level,
              timestamp: gameInfo.endedAt > 0 ? gameInfo.endedAt * 1000 : gameInfo.createdAt * 1000,
              gameEnded: gameInfo.status === 2, // status 2 = ENDED
            });
            
            foundGames++;
          }
        } catch (error) {
          // 跳过有问题的游戏，继续查找
          this.logger.warn(`Error processing game ${gameId}:`, error);
          continue;
        }
      }
      
      this.logger.log(`Found ${gameHistory.length} games for player ${playerAddress}`);
      return gameHistory;
    } catch (error) {
      this.logger.error(`Failed to get player game history for ${playerAddress}:`, error);
      throw error;
    }
  }

  // EIP-712签名分数提交
  async signScoreSubmission(gameId: number, playerAddress: string, kills: number, score: number, nonce: number): Promise<string> {
    if (!this.isAvailable() || !this.walletClient) {
      throw new Error('Blockchain service or wallet not available');
    }

    try {
      // EIP-712域定义
      const domain = {
        name: 'SwordBattle',
        version: '1',
        chainId: await this.publicClient.getChainId(),
        verifyingContract: getAddress(this.config.contracts.gameAggregator as `0x${string}`),
      };

      // 消息类型定义
      const types = {
        ScoreSubmission: [
          { name: 'gameId', type: 'uint256' },
          { name: 'player', type: 'address' },
          { name: 'kills', type: 'uint256' },
          { name: 'score', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
        ],
      };

      // 消息数据
      const message = {
        gameId: BigInt(gameId),
        player: getAddress(playerAddress as `0x${string}`),
        kills: BigInt(kills),
        score: BigInt(score),
        nonce: BigInt(nonce),
      };

      const signature = await this.walletClient.signTypedData({
        account: this.account,
        domain,
        types,
        primaryType: 'ScoreSubmission',
        message,
      });

      this.logger.log(`Signed score submission for player ${playerAddress}, game ${gameId}, kills ${kills}, score ${score}`);
      return signature;
    } catch (error) {
      this.logger.error(`Failed to sign score submission:`, error);
      throw error;
    }
  }

  // 获取玩家奖励状态（使用新的RewardManager合约）
  async getPlayerRewardStatus(gameId: number, playerAddress: string) {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service not available');
    }

    try {
      const result = await this.publicClient.readContract({
        address: this.config.contracts.gameAggregator as `0x${string}`,
        abi: GAME_AGGREGATOR_ABI,
        functionName: 'getPlayerCompleteRewards',
        args: [BigInt(gameId), playerAddress as `0x${string}`],
      });

      // getPlayerRewardStatus返回: [usdRewards, nclabRewards, usdClaimable, nclabClaimable, nclabClaimableTime, usdClaimed, nclabClaimed]
      return result;
    } catch (error) {
      this.logger.error(`Failed to get player reward status for game ${gameId}, player ${playerAddress}:`, error);
      throw error;
    }
  }

  // 获取配置信息
  getConfig() {
    return {
      enabled: this.config.enabled,
      environment: this.config.environment,
      contracts: this.config.contracts,
      isInitialized: this.isInitialized,
    };
  }
} 
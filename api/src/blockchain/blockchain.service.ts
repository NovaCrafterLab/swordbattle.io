// 区块链服务
// 提供区块链相关的业务逻辑

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { createPublicClient, createWalletClient, http, formatEther, parseEther, getAddress } from 'viem';
import { bsc, bscTestnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { BlockchainConfig, defaultBlockchainConfig, validateBlockchainConfig } from './blockchain.config';

// 导入ABI（从游戏服务器复制）
import { SWORD_BATTLE_ABI } from './abis/swordBattle.abi';
import { ERC20_ABI } from './abis/erc20.abi';

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
        address: this.config.contracts.swordBattle as `0x${string}`,
        abi: SWORD_BATTLE_ABI,
        functionName: 'getGameInfo',
        args: [BigInt(gameId)],
      });

      return {
        gameId: Number(result[0]),
        playerCount: Number(result[1]),
        totalPool: formatEther(result[2]),
        ended: result[3],
        createdAt: Number(result[4]),
        endedAt: Number(result[5]),
        cleaned: result[6],
        gameDuration: Number(result[7]),
        isExpired: result[8],
      };
    } catch (error) {
      this.logger.error(`Failed to get game info for game ${gameId}:`, error);
      throw error;
    }
  }

  // 获取游戏玩家列表
  async getGamePlayers(gameId: number): Promise<string[]> {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service not available');
    }

    try {
      const players = await this.publicClient.readContract({
        address: this.config.contracts.swordBattle as `0x${string}`,
        abi: SWORD_BATTLE_ABI,
        functionName: 'getGamePlayers',
        args: [BigInt(gameId)],
      });

      return players as string[];
    } catch (error) {
      this.logger.error(`Failed to get game players for game ${gameId}:`, error);
      throw error;
    }
  }

  // 获取游戏分数
  async getGameScores(gameId: number) {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service not available');
    }

    try {
      const result = await this.publicClient.readContract({
        address: this.config.contracts.swordBattle as `0x${string}`,
        abi: SWORD_BATTLE_ABI,
        functionName: 'getGameScores',
        args: [BigInt(gameId)],
      });

      const players = result[0] as string[];
      const scores = result[1] as bigint[];

      return players.map((player, index) => ({
        player,
        score: Number(scores[index]),
      }));
    } catch (error) {
      this.logger.error(`Failed to get game scores for game ${gameId}:`, error);
      throw error;
    }
  }

  // 获取游戏排名
  async getGameRankings(gameId: number): Promise<string[]> {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service not available');
    }

    try {
      const rankings = await this.publicClient.readContract({
        address: this.config.contracts.swordBattle as `0x${string}`,
        abi: SWORD_BATTLE_ABI,
        functionName: 'getGameRankings',
        args: [BigInt(gameId)],
      });

      return rankings as string[];
    } catch (error) {
      this.logger.error(`Failed to get game rankings for game ${gameId}:`, error);
      throw error;
    }
  }

  // 获取玩家信息
  async getPlayerInfo(gameId: number, playerAddress: string) {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service not available');
    }

    try {
      const result = await this.publicClient.readContract({
        address: this.config.contracts.swordBattle as `0x${string}`,
        abi: SWORD_BATTLE_ABI,
        functionName: 'getPlayerInfo',
        args: [BigInt(gameId), playerAddress as `0x${string}`],
      });

      return {
        playerAddr: result[0] as string,
        score: Number(result[1]),
        submitted: result[2] as boolean,
        claimed: result[3] as boolean,
        reward: formatEther(result[4]),
      };
    } catch (error) {
      this.logger.error(`Failed to get player info for ${playerAddress} in game ${gameId}:`, error);
      throw error;
    }
  }

  // 获取玩家nonce
  async getPlayerNonce(playerAddress: string): Promise<number> {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service not available');
    }

    try {
      const nonce = await this.publicClient.readContract({
        address: this.config.contracts.swordBattle as `0x${string}`,
        abi: SWORD_BATTLE_ABI,
        functionName: 'getPlayerNonce',
        args: [playerAddress as `0x${string}`],
      });

      return Number(nonce);
    } catch (error) {
      this.logger.error(`Failed to get player nonce for ${playerAddress}:`, error);
      throw error;
    }
  }

  // 获取入场费
  async getEntryFee(): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service not available');
    }

    try {
      const entryFee = await this.publicClient.readContract({
        address: this.config.contracts.swordBattle as `0x${string}`,
        abi: SWORD_BATTLE_ABI,
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
        address: this.config.contracts.swordBattle as `0x${string}`,
        abi: SWORD_BATTLE_ABI,
        functionName: 'gameCounter',
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
            const gameInfo = await this.getGameInfo(gameId);
            
            // 获取排名
            let rank = 0;
            let isWinner = false;
            
            try {
              const rankings = await this.getGameRankings(gameId);
              const playerIndex = rankings.findIndex(p => p.toLowerCase() === playerLowerCase);
              
              if (playerIndex >= 0) {
                rank = playerIndex + 1;
                // 假设前3名为获胜者，并且奖励大于0
                isWinner = rank <= 3 && parseFloat(playerInfo.reward) > 0;
              }
            } catch (error) {
              this.logger.warn(`Failed to get rankings for game ${gameId}:`, error);
            }
            
            gameHistory.push({
              gameId,
              score: playerInfo.score,
              reward: playerInfo.reward,
              hasClaimed: playerInfo.claimed,
              rank,
              isWinner,
              timestamp: gameInfo.endedAt > 0 ? gameInfo.endedAt * 1000 : gameInfo.createdAt * 1000,
              gameEnded: gameInfo.ended,
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
  async signScoreSubmission(gameId: number, playerAddress: string, score: number, nonce: number): Promise<string> {
    if (!this.isAvailable() || !this.walletClient) {
      throw new Error('Blockchain service or wallet not available');
    }

    try {
      // EIP-712域定义
      const domain = {
        name: 'SwordBattle',
        version: '1',
        chainId: await this.publicClient.getChainId(),
        verifyingContract: getAddress(this.config.contracts.swordBattle as `0x${string}`),
      };

      // 消息类型定义
      const types = {
        ScoreSubmission: [
          { name: 'gameId', type: 'uint256' },
          { name: 'player', type: 'address' },
          { name: 'score', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
        ],
      };

      // 消息数据
      const message = {
        gameId: BigInt(gameId),
        player: getAddress(playerAddress as `0x${string}`),
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

      this.logger.log(`Signed score submission for player ${playerAddress}, game ${gameId}, score ${score}`);
      return signature;
    } catch (error) {
      this.logger.error(`Failed to sign score submission:`, error);
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
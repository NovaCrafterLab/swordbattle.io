import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { getSwordBattleContract, getUSD1TokenContract } from '../config/walletConfig';

// 游戏相关数据类型
export interface GameInfo {
  gameId: number;
  isActive: boolean;
  playerCount: number;
  entryFee: bigint;
  totalPrize: bigint;
  endTime: number;
  players: string[];
}

export interface PlayerData {
  address: string;
  score: number;
  hasJoined: boolean;
  hasClaimed: boolean;
  reward: bigint;
  nonce: number;
}

/**
 * 区块链交互主hook
 */
export const useBlockchain = () => {
  const swordBattleContract = getSwordBattleContract();
  const usd1TokenContract = getUSD1TokenContract();

  // 写入合约hook
  const { writeContract, data: writeData, isPending: isWritePending, error: writeError } = useWriteContract();

  // 等待交易确认
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // ============ 读取方法 ============

  /**
   * 获取当前游戏计数器
   */
  const useGameCounter = () => {
    return useReadContract({
      ...swordBattleContract,
      functionName: 'gameCounter',
      query: {
        enabled: true,
        refetchInterval: 3000, // 每3秒自动刷新
      },
    });
  };

  /**
   * 获取入场费
   */
  const useEntryFee = () => {
    return useReadContract({
      ...swordBattleContract,
      functionName: 'entryFee',
      query: {
        enabled: true,
      },
    });
  };

  /**
   * 获取游戏信息
   */
  const useGameInfo = (gameId: number) => {
    return useReadContract({
      ...swordBattleContract,
      functionName: 'games',
      args: [BigInt(gameId)],
      query: {
        enabled: gameId >= 0,
      },
    });
  };

  /**
   * 获取游戏玩家列表
   */
  const useGamePlayers = (gameId: number) => {
    return useReadContract({
      ...swordBattleContract,
      functionName: 'getGamePlayers',
      args: [BigInt(gameId)],
      query: {
        enabled: gameId >= 0,
      },
    });
  };

  /**
   * 获取玩家nonce
   */
  const usePlayerNonce = (playerAddress: string) => {
    return useReadContract({
      ...swordBattleContract,
      functionName: 'playerNonces',
      args: [playerAddress as `0x${string}`],
      query: {
        enabled: !!playerAddress,
      },
    });
  };

  /**
   * 获取玩家分数
   */
  const usePlayerScore = (gameId: number, playerAddress: string) => {
    return useReadContract({
      ...swordBattleContract,
      functionName: 'playerScores',
      args: [BigInt(gameId), playerAddress as `0x${string}`],
      query: {
        enabled: gameId >= 0 && !!playerAddress,
      },
    });
  };

  /**
   * 获取玩家奖励
   */
  const usePlayerReward = (gameId: number, playerAddress: string) => {
    return useReadContract({
      ...swordBattleContract,
      functionName: 'playerRewards',
      args: [BigInt(gameId), playerAddress as `0x${string}`],
      query: {
        enabled: gameId >= 0 && !!playerAddress,
      },
    });
  };

  /**
   * 检查玩家是否已领取奖励
   */
  const useHasClaimedReward = (gameId: number, playerAddress: string) => {
    return useReadContract({
      ...swordBattleContract,
      functionName: 'hasClaimed',
      args: [BigInt(gameId), playerAddress as `0x${string}`],
      query: {
        enabled: gameId >= 0 && !!playerAddress,
      },
    });
  };

  // ============ USD1代币相关 ============

  /**
   * 获取USD1代币余额
   */
  const useUSD1Balance = (address: string) => {
    return useReadContract({
      ...usd1TokenContract,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
      query: {
        enabled: !!address,
      },
    });
  };

  /**
   * 获取USD1代币授权额度
   */
  const useUSD1Allowance = (owner: string, spender: string) => {
    return useReadContract({
      ...usd1TokenContract,
      functionName: 'allowance',
      args: [owner as `0x${string}`, spender as `0x${string}`],
      query: {
        enabled: !!owner && !!spender,
      },
    });
  };

  // ============ 写入方法 ============

  /**
   * 授权USD1代币
   */
  const approveUSD1 = (amount: bigint) => {
    writeContract({
      ...usd1TokenContract,
      functionName: 'approve',
      args: [swordBattleContract.address, amount],
    });
  };

  /**
   * 加入游戏
   */
  const joinGame = (gameId: number) => {
    writeContract({
      ...swordBattleContract,
      functionName: 'joinGame',
      args: [BigInt(gameId)],
    });
  };

  /**
   * 领取奖励
   */
  const claimReward = (gameId: number) => {
    writeContract({
      ...swordBattleContract,
      functionName: 'claimReward',
      args: [BigInt(gameId)],
    });
  };

  return {
    // 读取hooks
    useGameCounter,
    useEntryFee,
    useGameInfo,
    useGamePlayers,
    usePlayerNonce,
    usePlayerScore,
    usePlayerReward,
    useHasClaimedReward,
    useUSD1Balance,
    useUSD1Allowance,

    // 写入方法
    approveUSD1,
    joinGame,
    claimReward,

    // 交易状态
    isWritePending,
    isConfirming,
    isConfirmed,
    writeError,
    writeData,
  };
}; 
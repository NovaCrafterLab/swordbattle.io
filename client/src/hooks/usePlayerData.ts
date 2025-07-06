import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { useBlockchain } from './useBlockchain'
import { getGameAggregatorContract } from '@/config/walletConfig'
import { endpoint as API_ROOT } from '@/api'

// 新的GameAggregator接口类型定义
export interface GameFullInfo {
  gameId: string;           // 游戏ID
  level: number;            // 游戏等级 (0=EASY, 1=MEDIUM, 2=HARD)
  status: number;           // 游戏状态 (0=WAITING, 1=ACTIVE, 2=ENDED)
  totalPool: string;        // 奖池总额 (wei)
  createdAt: string;        // 创建时间戳
  endedAt: string;          // 结束时间戳
  gameDuration: number;     // 游戏持续时间 (秒)
}

export interface PlayerCompleteRewards {
  usdRewards: string;        // 🟡 USD1 奖励数量 (wei)
  nclabRewards: string;      // 🔵 NCLab 奖励数量 (wei)
  fragmentBalance: string;   // 🟠 碎片余额
  usdClaimable: boolean;     // USD1 是否可领取
  nclabClaimable: boolean;   // NCLab 是否可领取
  nclabClaimableTime: string; // NCLab 可领取时间戳
  usdClaimed: boolean;       // USD1 是否已领取
  nclabClaimed: boolean;     // NCLab 是否已领取
}

export interface PlayerDashboard {
  // 游戏统计
  totalGamesPlayed: string;    // 总游戏局数
  totalKills: string;          // 总击杀数
  totalScore: string;          // 总分数
  winRate: string;             // 胜率 (百分比 * 100)
  
  // 奖励统计
  totalUsdEarned: string;      // 🟡 总 USD1 收益 (wei)
  totalNclabEarned: string;    // 🔵 总 NCLab 收益 (wei)
  totalFragmentsEarned: string; // 🟠 总碎片收益
  
  // 待领取奖励
  pendingUsdRewards: string;   // 🟡 待领取 USD1 (wei)
  pendingNclabRewards: string; // 🔵 待领取 NCLab (wei)
  fragmentBalance: string;     // 🟠 当前碎片余额
  
  // 当前状态
  currentGameCount: string;    // 当前参与游戏数量
  hasClaimableRewards: boolean; // 是否有可领取奖励
}

// 兼容现有代码的玩家数据类型
export interface PlayerGameData {
  gameId: number
  score: number
  reward: bigint // 总奖励（USD + NCLab）
  usdReward: bigint // USD奖励
  nclabReward: bigint // NCLab奖励
  hasClaimed: boolean // 是否已领取（任何奖励）
  usdClaimed: boolean // USD是否已领取
  nclabClaimed: boolean // NCLab是否已领取
  usdClaimable: boolean // USD是否可领取
  nclabClaimable: boolean // NCLab是否可领取
  nclabClaimableTime?: number // NCLab可领取时间
  rank: number
  isWinner: boolean
  level?: number // 游戏级别：0=EASY, 1=MEDIUM, 2=HARD
  timestamp?: number // 添加时间戳字段
}

export interface PlayerProfile {
  address: string
  usd1Balance: bigint
  allowance: bigint
  nonce: number
  gameHistory: PlayerGameData[]
  totalRewards: bigint
  totalGamesPlayed: number
  winRate: number
}

/* == API == */
const api = (p: string) => `${API_ROOT}${p.startsWith('/') ? '' : '/'}${p}`;


/**
 * 玩家数据管理hook
 */
export const usePlayerData = () => {
  const { address } = useAccount()
  const blockchain = useBlockchain()

  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 获取USD1余额
  const { data: usd1Balance, refetch: refetchBalance } =
    blockchain.useUSD1Balance(address || '')

  // 获取SwordBattle地址
  const { data: swordBattleAddress } = blockchain.useSwordBattleAddress();

  // 获取USD1授权额度 - 查询对SwordBattle合约的授权
  const { data: allowance, refetch: refetchAllowance } =
    blockchain.useUSD1Allowance(address || '', (swordBattleAddress as string) || '')

  // 获取玩家nonce
  const { data: playerNonce, refetch: refetchNonce } =
    blockchain.usePlayerNonce(address || '')

  /**
   * 从区块链获取特定游戏的玩家数据（通过API而不是直接调用hooks）
   */
  const getPlayerGameDataFromBlockchain = useCallback(
    async (gameId: number): Promise<PlayerGameData | null> => {
      if (!address) return null

      try {
        // 通过API端点获取区块链数据
        const apiUrl = api(`/blockchain/games/${gameId}/players/${address}`)

        const response = await fetch(apiUrl)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch blockchain data')
        }

        const playerInfo = result.data
        const score = Number(playerInfo.score || 0)
        const reward = BigInt(Math.floor(parseFloat(playerInfo.reward) * 1e18))
        const hasClaimed = Boolean(playerInfo.claimed)
        const level =
          typeof playerInfo.level === 'number' ? playerInfo.level : undefined

        // 如果没有奖励，跳过这个游戏
        if (reward === BigInt(0)) {
          return null
        }

        // 简单的排名计算（基于奖励金额）
        let rank = 1
        if (reward >= BigInt('10000000000000000000')) {
          // 10 USD1
          rank = 1
        } else if (reward >= BigInt('5000000000000000000')) {
          // 5 USD1
          rank = 2
        } else if (reward >= BigInt('1000000000000000000')) {
          // 1 USD1
          rank = 3
        } else {
          rank = 4
        }

        return {
          gameId,
          score,
          reward,
          usdReward: reward, // 假设都是USD奖励
          nclabReward: BigInt(0),
          hasClaimed,
          usdClaimed: hasClaimed,
          nclabClaimed: false,
          usdClaimable: !hasClaimed && reward > BigInt(0),
          nclabClaimable: false,
          rank,
          isWinner: reward > BigInt(0),
          level,
          timestamp: playerInfo.timestamp,
        }
      } catch (err) {
        console.error(`Failed to get blockchain data for game ${gameId}:`, err)
        return null
      }
    },
    [address]
  )

  /**
   * 获取玩家特定游戏的数据
   */
  const getPlayerGameData = useCallback(
    async (gameId: number): Promise<PlayerGameData | null> => {
      if (!address) return null

      try {
        // 获取玩家分数
        const { data: score } = blockchain.usePlayerScore(gameId, address)

        // 获取玩家奖励
        const { data: reward } = blockchain.usePlayerRewards(gameId, address)

        // 检查是否已领取
        const { data: hasClaimed } = blockchain.useCanClaimReward(
          gameId,
          address
        )

        const rewardBigInt =
          typeof reward === 'bigint' ? reward : BigInt(String(reward || 0))
        const hasClaimedBool =
          typeof hasClaimed === 'boolean' ? hasClaimed : false

        return {
          gameId,
          score: score ? Number(score) : 0,
          reward: rewardBigInt,
          usdReward: rewardBigInt, // 假设都是USD奖励
          nclabReward: BigInt(0),
          hasClaimed: hasClaimedBool,
          usdClaimed: hasClaimedBool,
          nclabClaimed: false,
          usdClaimable: !hasClaimedBool && rewardBigInt > BigInt(0),
          nclabClaimable: false,
          rank: 0, // TODO: 计算排名
          isWinner: rewardBigInt > BigInt(0),
          timestamp: 0, // TODO: 获取真实时间戳
        }
      } catch (err) {
        console.error(`Failed to get player data for game ${gameId}:`, err)
        return null
      }
    },
    [address, blockchain]
  )

  /**
   * 获取玩家游戏历史数据
   */
  const getPlayerHistory = useCallback(
    async (gameIds: number[]): Promise<PlayerGameData[]> => {
      if (!address || gameIds.length === 0) return []

      try {
        const gameDataPromises = gameIds.map((gameId) =>
          getPlayerGameData(gameId)
        )
        const gameDataResults = await Promise.all(gameDataPromises)

        return gameDataResults.filter(
          (data): data is PlayerGameData => data !== null
        )
      } catch (err) {
        console.error('Failed to get player history:', err)
        return []
      }
    },
    [address, getPlayerGameData]
  )

  /**
   * 从区块链获取玩家游戏历史（使用真实的链上数据）
   */
  const fetchPlayerGameHistoryFromBlockchain = useCallback(async (): Promise<
    PlayerGameData[]
  > => {
    if (!address) {
      return []
    }

    try {
      // 首先获取当前游戏计数器，确定需要查询的游戏范围
      const gameCounterUrl = api(`/blockchain/game-counter`)
      const gameCounterResponse = await fetch(gameCounterUrl)

      if (!gameCounterResponse.ok) {
        throw new Error(
          `Failed to get game counter: ${gameCounterResponse.status}`
        )
      }

      const gameCounterResult = await gameCounterResponse.json()
      if (!gameCounterResult.success) {
        throw new Error('Failed to get game counter')
      }

      const currentGameId = Number(gameCounterResult.data.counter || 0)

      if (currentGameId === 0) {
        return []
      }

      // 查询最近50个游戏的数据（可以根据需要调整）
      const gameHistoryPromises: Promise<PlayerGameData | null>[] = []
      const startGameId = Math.max(1, currentGameId - 49) // 查询最近50个游戏

      for (let gameId = startGameId; gameId <= currentGameId; gameId++) {
        gameHistoryPromises.push(getPlayerGameDataFromBlockchain(gameId))
      }

      // 并行查询所有游戏数据
      const gameHistoryResults = await Promise.all(gameHistoryPromises)

      // 过滤掉空数据（玩家没有参与的游戏）
      const validGameHistory = gameHistoryResults.filter(
        (data): data is PlayerGameData =>
          data !== null && data.reward > BigInt(0)
      )

      return validGameHistory.sort((a, b) => b.gameId - a.gameId) // 按游戏ID降序排列
    } catch (err) {
      console.error('Failed to fetch blockchain game history:', err)
      return []
    }
  }, [address, getPlayerGameDataFromBlockchain])

  /**
   * 从区块链获取特定游戏的奖励信息（通过API而不是直接调用hooks）
   */
  const getGameRewardFromBlockchain = useCallback(
    async (
      gameId: number
    ): Promise<{ 
      reward: bigint; 
      hasClaimed: boolean;
      usdReward?: bigint;
      nclabReward?: bigint;
      usdClaimed?: boolean;
      nclabClaimed?: boolean;
      usdClaimable?: boolean;
      nclabClaimable?: boolean;
      nclabClaimableTime?: number;
    }> => {
      if (!address) return { reward: BigInt(0), hasClaimed: false }

      try {
        // 通过API端点获取区块链数据，而不是直接调用hooks
        const apiUrl = api(`/blockchain/games/${gameId}/players/${address}`)

        const response = await fetch(apiUrl)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch blockchain data')
        }

        // 解析API返回的数据
        const playerInfo = result.data
        
        // 使用新的API字段
        const usdAmount = BigInt(Math.floor(parseFloat(playerInfo.usdAmount || playerInfo.totalReward || '0') * 1e18))
        const nclabAmount = BigInt(Math.floor(parseFloat(playerInfo.nclabAmount || '0') * 1e18))
        const totalReward = usdAmount + nclabAmount
        
        // 获取准确的领取状态
        const usdClaimed = Boolean(playerInfo.usdClaimed)
        const nclabClaimed = Boolean(playerInfo.nclabClaimed)
        const hasClaimed = usdClaimed || nclabClaimed || Boolean(playerInfo.claimed)

        return { 
          reward: totalReward, 
          hasClaimed,
          // 扩展返回信息以支持分离的USD/NCLab状态
          usdReward: usdAmount,
          nclabReward: nclabAmount,
          usdClaimed,
          nclabClaimed,
          usdClaimable: Boolean(playerInfo.usdClaimable),
          nclabClaimable: Boolean(playerInfo.nclabClaimable),
          nclabClaimableTime: Number(playerInfo.claimableTime || 0)
        }
      } catch (err) {
        console.error(`Failed to get reward info for game ${gameId}:`, err)
        return { reward: BigInt(0), hasClaimed: false }
      }
    },
    [address]
  )

  /**
   * 从数据库API获取玩家游戏历史（仅基础数据，不包含准确的奖励信息）
   */
  const fetchPlayerGameHistoryFromDatabase = useCallback(async (): Promise<
    PlayerGameData[]
  > => {
    if (!address) {
      return []
    }

    try {
      // 构建API URL
      const apiUrl = api(`/race-games/players/${address}/games`)

      // 添加超时控制
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10秒超时

      // 调用数据库API
      const response = await fetch(apiUrl, {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch game history')
      }

      // 转换API数据为组件需要的格式
      const databaseGames: PlayerGameData[] = result.data.games.map(
        (game: any) => {
          const rewardAmount = BigInt(Math.floor(parseFloat(game.reward || '0') * 1e18))
          console.log(`🎮 Processing game ${game.gameId}: reward="${game.reward}" -> ${rewardAmount.toString()} wei`)
          return {
            gameId: game.gameId,
            score: game.score,
            reward: rewardAmount,
            usdReward: rewardAmount, // 暂时假设所有奖励都是USD
            nclabReward: BigInt(0),
            hasClaimed: game.hasClaimed || false,
            usdClaimed: game.hasClaimed || false,
            nclabClaimed: false,
            usdClaimable: !game.hasClaimed && rewardAmount > BigInt(0),
            nclabClaimable: false,
            rank: game.rank || 0,
            isWinner: game.isWinner,
            timestamp: game.timestamp, // 使用API返回的真实时间戳
          }
        }
      )

      console.log('📊 Database API returned', databaseGames.length, 'games')
      console.log('💰 Total rewards from database:', databaseGames.reduce((sum, g) => sum + g.reward, BigInt(0)).toString())

      return databaseGames.sort((a, b) => b.gameId - a.gameId) // 按游戏ID降序排列
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.error('Database API request timeout')
      } else {
        console.error('Failed to fetch game history from database:', err)
      }
      return []
    }
  }, [address])

  /**
   * 混合查询：从数据库获取游戏列表，从区块链获取奖励信息
   */
  const fetchPlayerGameHistoryMixed = useCallback(async (): Promise<
    PlayerGameData[]
  > => {
    try {
      // 步骤1：从数据库获取游戏基础数据
      const databaseGames = await fetchPlayerGameHistoryFromDatabase()

      if (databaseGames.length === 0) {
        return []
      }

      // 步骤2：从区块链获取奖励信息
      const rewardPromises = databaseGames.map((game) =>
        getGameRewardFromBlockchain(game.gameId)
      )

      const rewardResults = await Promise.all(rewardPromises)

      // 步骤3：合并数据
      const mergedGames: PlayerGameData[] = databaseGames.map((game, index) => {
        const rewardInfo = rewardResults[index]

        // 如果区块链查询失败或返回0奖励，使用数据库中的奖励数据
        let finalReward = rewardInfo.reward
        let finalHasClaimed = rewardInfo.hasClaimed

        if (rewardInfo.reward === BigInt(0) && game.reward > BigInt(0)) {
          finalReward = game.reward
          finalHasClaimed = game.hasClaimed
        }

        return {
          ...game,
          reward: finalReward,
          hasClaimed: finalHasClaimed,
          // 添加新的奖励状态字段
          usdReward: rewardInfo.usdReward || BigInt(0),
          nclabReward: rewardInfo.nclabReward || BigInt(0),
          usdClaimed: rewardInfo.usdClaimed || false,
          nclabClaimed: rewardInfo.nclabClaimed || false,
          usdClaimable: rewardInfo.usdClaimable || false,
          nclabClaimable: rewardInfo.nclabClaimable || false,
          nclabClaimableTime: rewardInfo.nclabClaimableTime || 0,
          isWinner: finalReward > BigInt(0) || game.isWinner,
        }
      })

      // 异步同步区块链奖励数据到数据库
      if (mergedGames.length > 0) {
        syncRewardsToDatabase().catch((error) => {
          console.error('Failed to sync rewards to database:', error)
        })
      }

      return mergedGames.sort((a, b) => b.gameId - a.gameId)
    } catch (err) {
      console.error('Mixed query failed:', err)
      return []
    }
  }, [fetchPlayerGameHistoryFromDatabase, getGameRewardFromBlockchain])

  /**
   * 同步区块链奖励数据到数据库
   */
  const syncRewardsToDatabase = useCallback(async (): Promise<void> => {
    if (!address) return

    try {
      const apiUrl = api(`/race-games/players/${address}/sync-rewards`)

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.warn(
          'Sync API call failed:',
          response.status,
          response.statusText
        )
      }
    } catch (error) {
      console.error('Failed to sync blockchain rewards:', error)
    }
  }, [address])

  /**
   * 主要的数据获取方法 - 默认使用混合查询
   */
  const fetchPlayerGameHistory = useCallback(
    async (useBlockchain: boolean = false): Promise<PlayerGameData[]> => {
      if (useBlockchain) {
        return await fetchPlayerGameHistoryFromBlockchain()
      } else {
        return await fetchPlayerGameHistoryMixed()
      }
    },
    [fetchPlayerGameHistoryFromBlockchain, fetchPlayerGameHistoryMixed]
  )

  /**
   * 刷新玩家数据
   */
  const refreshPlayerData = useCallback(async () => {
    if (!address) {
      setPlayerProfile(null)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // 刷新基础数据
      refetchBalance();
      refetchAllowance();
      refetchNonce();

      // 使用混合查询获取玩家游戏历史（数据库 + 区块链）
      const gameHistory = await fetchPlayerGameHistory(false) // false = 使用混合查询
      
      console.log('🔄 Refreshing player data for:', address)
      console.log('📊 Game history loaded:', gameHistory.length, 'games')
      if (gameHistory.length > 0) {
        console.log('🎮 Latest game:', gameHistory[0].gameId, 'reward:', gameHistory[0].reward.toString())
      }

      // 计算统计数据
      const totalRewards = gameHistory.reduce(
        (sum, game) => sum + game.reward,
        BigInt(0)
      )
      const totalGamesPlayed = gameHistory.length
      const winCount = gameHistory.filter((game) => game.isWinner).length
      const winRate =
        totalGamesPlayed > 0 ? (winCount / totalGamesPlayed) * 100 : 0

      // 使用当前数据（因为refetch返回void）
      const latestBalance = usd1Balance || BigInt(0)
      const latestAllowance = allowance || BigInt(0)
      const latestNonce = playerNonce || BigInt(0)

      const usd1BalanceBigInt =
        typeof latestBalance === 'bigint'
          ? latestBalance
          : BigInt(String(latestBalance || 0))
      const allowanceBigInt =
        typeof latestAllowance === 'bigint'
          ? latestAllowance
          : BigInt(String(latestAllowance || 0))

      const profile: PlayerProfile = {
        address,
        usd1Balance: usd1BalanceBigInt,
        allowance: allowanceBigInt,
        nonce: latestNonce ? Number(latestNonce) : 0,
        gameHistory,
        totalRewards,
        totalGamesPlayed,
        winRate,
      }

      setPlayerProfile(profile)
    } catch (err) {
      console.error('Failed to refresh player data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [
    address,
    refetchBalance,
    refetchAllowance,
    refetchNonce,
    fetchPlayerGameHistory,
  ])

  // 定期同步机制
  useEffect(() => {
    if (!address) return

    // 设置定期刷新间隔（每30秒）
    const syncInterval = setInterval(() => {
      refreshPlayerData()
    }, 30000) // 30秒

    // 组件卸载时清除定时器
    return () => {
      clearInterval(syncInterval)
    }
  }, [address, refreshPlayerData])

  // 当地址变化时刷新数据
  useEffect(() => {
    if (address) {
      refreshPlayerData()
    } else {
      setPlayerProfile(null)
    }
  }, [address]) // 只依赖address，避免无限循环

  /**
   * 检查是否需要授权USD1代币
   */
  const needsApproval = useCallback(
    (amount: bigint): boolean => {
      const currentAllowance =
        (typeof allowance === 'bigint' ? allowance : null) ||
        playerProfile?.allowance ||
        BigInt(0)
      return currentAllowance < amount
    },
    [allowance, playerProfile]
  )

  /**
   * 检查是否有足够的USD1余额
   */
  const hasSufficientBalance = useCallback(
    (amount: bigint): boolean => {
      const currentBalance =
        (typeof usd1Balance === 'bigint' ? usd1Balance : null) ||
        playerProfile?.usd1Balance ||
        BigInt(0)
      return currentBalance >= amount
    },
    [usd1Balance, playerProfile]
  )

  /**
   * 格式化USD1金额
   */
  const formatUSD1Amount = useCallback((amount: bigint): string => {
    return formatEther(amount)
  }, [])

  /**
   * 获取玩家等级（基于总奖励）
   */
  const getPlayerLevel = useCallback((): number => {
    if (!playerProfile) return 1

    const totalRewardsEth = Number(formatEther(playerProfile.totalRewards))

    // 简单的等级计算：每100 USD1为一级
    return Math.floor(totalRewardsEth / 100) + 1
  }, [playerProfile])

  /**
   * 获取玩家称号
   */
  const getPlayerTitle = useCallback((): string => {
    const level = getPlayerLevel()
    const winRate = playerProfile?.winRate || 0

    if (level >= 10 && winRate >= 80) return 'Legendary Warrior'
    if (level >= 7 && winRate >= 70) return 'Master Fighter'
    if (level >= 5 && winRate >= 60) return 'Skilled Combatant'
    if (level >= 3 && winRate >= 50) return 'Experienced Player'
    if (level >= 2) return 'Novice Fighter'
    return 'Newcomer'
  }, [getPlayerLevel, playerProfile])

  return {
    playerProfile,
    isLoading,
    error,
    refreshPlayerData,
    getPlayerGameData,
    getPlayerHistory,
    fetchPlayerGameHistory,
    needsApproval,
    hasSufficientBalance,
    formatUSD1Amount,
    getPlayerLevel,
    getPlayerTitle,

    // 便捷访问 - 改进逻辑，优先使用实时数据
    address,
    usd1Balance:
      (typeof usd1Balance === 'bigint' ? usd1Balance : null) ||
      playerProfile?.usd1Balance ||
      BigInt(0),
    allowance:
      (typeof allowance === 'bigint' ? allowance : null) ||
      playerProfile?.allowance ||
      BigInt(0),
    nonce:
      (typeof playerNonce === 'number' ? playerNonce : null) ||
      playerProfile?.nonce ||
      0,
    isConnected: !!address,

    // 添加数据获取状态
    isBalanceLoading: !usd1Balance && !!address,
    isAllowanceLoading: !allowance && !!address,
  }
}

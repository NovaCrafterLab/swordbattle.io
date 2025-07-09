import * as anchor from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  NATIVE_MINT,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token';
import {
  VaultConfig,
  VaultInfo,
  InitializeGameVaultParams,
  BuyTicketParams,
  ClaimRewardParams,
  FinalizeGameParams,
  AdminWithdrawParams,
  ChangeTokenMintParams,
  GameVault,
  UserTicket,
  RewardMap,
  RewardEntry,
  GameVaultInitializedEvent,
  TicketPurchasedEvent,
  RewardClaimedEvent,
  GameFinalizedEvent,
  AdminWithdrawnEvent,
  TokenMintChangedEvent,
  EventFilter,
  EventSubscription,
  GameInfo,
  GameDiscoveryOptions,
} from './types';
import { Vault, IDL } from './idl';
import { Program } from '@coral-xyz/anchor';

export class VaultSDK {
  private program: Program<Vault>;
  private connection: any;
  private wallet: any;

  constructor(config: VaultConfig) {
    this.connection = config.connection;
    this.wallet = config.wallet;

    // Create program instance
    const provider = new anchor.AnchorProvider(
      config.connection,
      config.wallet,
      { commitment: 'confirmed' },
    );

    this.program = new Program<Vault>(IDL as Vault, provider);
  }

  /**
   * Get vault PDA and related accounts
   */
  private getVaultPdas(gameId: number): {
    vault: PublicKey;
    vaultSigner: PublicKey;
  } {
    const [vault] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('vault'),
        new anchor.BN(gameId).toArrayLike(Buffer, 'le', 8),
      ],
      this.program.programId,
    );

    const [vaultSigner] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('vault'),
        new anchor.BN(gameId).toArrayLike(Buffer, 'le', 8),
      ],
      this.program.programId,
    );

    return { vault, vaultSigner };
  }

  /**
   * Get user ticket PDA
   */
  private getUserTicketPda(gameId: number, user: PublicKey): PublicKey {
    const { vault } = this.getVaultPdas(gameId);
    const [userTicket] = PublicKey.findProgramAddressSync(
      [Buffer.from('ticket'), vault.toBuffer(), user.toBuffer()],
      this.program.programId,
    );
    return userTicket;
  }

  /**
   * Get reward map PDA
   */
  private getRewardMapPda(gameId: number): PublicKey {
    const { vault } = this.getVaultPdas(gameId);
    const [rewardMap] = PublicKey.findProgramAddressSync(
      [Buffer.from('reward_map'), vault.toBuffer()],
      this.program.programId,
    );
    return rewardMap;
  }

  /**
   * Initialize a new game vault
   */
  async initializeGameVault(
    params: InitializeGameVaultParams,
  ): Promise<string> {
    const { vault } = this.getVaultPdas(params.gameId);

    const tx = await this.program.methods
      .initializeGameVault(new anchor.BN(params.gameId))
      .accounts({
        authority: this.wallet.publicKey,
        tokenMint: params.tokenMint,
      })
      .rpc();

    // Create vault token account after initialization
    // 🔧 修复：统一创建SPL Token账户（包括WSOL）
    console.log(
      `🪙 Creating Associated Token Account for token ${params.tokenMint.toString()}`,
    );
    try {
      await getOrCreateAssociatedTokenAccount(
        this.connection,
        this.wallet,
        params.tokenMint,
        vault,
        true, // allowOwnerOffCurve
      );
      console.log('✅ Associated Token Account created successfully');
    } catch (error) {
      console.warn('⚠️ Failed to create Associated Token Account:', error);
      // For SPL tokens (including WSOL), this is a critical error
      throw new Error(`Failed to create token account for SPL token: ${error}`);
    }

    return tx;
  }

  /**
   * Buy a ticket for a game with server-side price validation
   */
  async buyTicket(
    params: BuyTicketParams & { tier?: string; expectedAmount?: string },
  ): Promise<string> {
    const { vault } = this.getVaultPdas(params.gameId);
    const userTicket = this.getUserTicketPda(
      params.gameId,
      this.wallet.publicKey,
    );

    // Get vault token account with actual mint
    const vaultAccount = await this.program.account.gameVault.fetch(vault);

    // 🔧 修复：统一使用SPL Token处理（包括WSOL）
    const vaultToken = await getAssociatedTokenAddress(
      vaultAccount.tokenMint as PublicKey,
      vault,
      true,
    );

    console.log(
      `🪙 Using SPL token ${(vaultAccount.tokenMint as PublicKey).toString()} for ticket purchase with vault ATA ${vaultToken.toString()}`,
    );

    // Server-side price validation for security
    if (params.tier && params.expectedAmount) {
      const actualAmount = new anchor.BN(params.amount);
      const expectedAmount = new anchor.BN(params.expectedAmount);

      if (!actualAmount.eq(expectedAmount)) {
        throw new Error(
          `Price validation failed: expected ${params.expectedAmount} for tier ${params.tier}, got ${params.amount}`,
        );
      }
    }

    const tx = await this.program.methods
      .buyTicket(new anchor.BN(params.amount))
      .accounts({
        vault: vault,
        userToken: params.userTokenAccount,
        vaultToken: vaultToken,
        user: this.wallet.publicKey,
      })
      .rpc();

    return tx;
  }

  /**
   * Claim reward for a user
   */
  async claimReward(params: ClaimRewardParams): Promise<string> {
    const { vault, vaultSigner } = this.getVaultPdas(params.gameId);
    const userTicket = this.getUserTicketPda(
      params.gameId,
      this.wallet.publicKey,
    );
    const rewardMap = this.getRewardMapPda(params.gameId);

    // Get vault token account with actual mint
    const vaultAccount = await this.program.account.gameVault.fetch(vault);

    // 🔧 修复：统一使用SPL Token处理（包括WSOL）
    const vaultToken = await getAssociatedTokenAddress(
      vaultAccount.tokenMint as PublicKey,
      vault,
      true,
    );

    console.log(
      `🪙 Using SPL token ${(vaultAccount.tokenMint as PublicKey).toString()} for reward claim with vault ATA ${vaultToken.toString()}`,
    );

    const tx = await this.program.methods
      .claimReward()
      .accounts({
        vault: vault,
        userTicket: userTicket,
        rewardMap: rewardMap,
        vaultToken: vaultToken,
        userToken: params.userTokenAccount,
        user: this.wallet.publicKey,
      })
      .rpc();

    return tx;
  }

  /**
   * Finalize a game with rewards
   */
  async finalizeGame(params: FinalizeGameParams): Promise<string> {
    const { vault } = this.getVaultPdas(params.gameId);
    const rewardMap = this.getRewardMapPda(params.gameId);

    const tx = await this.program.methods
      .finalizeGame(
        params.rewards.map((reward: RewardEntry) => ({
          user: reward.user,
          amount: new anchor.BN(reward.amount),
        })),
      )
      .accounts({
        vault: vault,
        authority: this.wallet.publicKey,
      })
      .rpc();

    return tx;
  }

  /**
   * Admin withdraw from vault
   */
  async adminWithdraw(params: AdminWithdrawParams): Promise<string> {
    const { vault, vaultSigner } = this.getVaultPdas(params.gameId);

    // Get vault token account with actual mint
    const vaultAccount = await this.program.account.gameVault.fetch(vault);

    // 🔧 修复：统一使用SPL Token处理（包括WSOL）
    const vaultToken = await getAssociatedTokenAddress(
      vaultAccount.tokenMint as PublicKey,
      vault,
      true,
    );

    console.log(
      `🪙 Using SPL token ${(vaultAccount.tokenMint as PublicKey).toString()} for admin withdraw with vault ATA ${vaultToken.toString()}`,
    );

    const tx = await this.program.methods
      .adminWithdraw(new anchor.BN(params.amount))
      .accounts({
        vault: vault,
        vaultToken: vaultToken,
        adminToken: params.adminTokenAccount,
        authority: this.wallet.publicKey,
      })
      .rpc();

    return tx;
  }

  /**
   * Change token mint for a vault
   */
  async changeTokenMint(params: ChangeTokenMintParams): Promise<string> {
    const { vault } = this.getVaultPdas(params.gameId);

    const tx = await this.program.methods
      .changeTokenMint(params.newMint)
      .accounts({
        vault: vault,
        authority: this.wallet.publicKey,
      })
      .rpc();

    return tx;
  }

  /**
   * Validate ticket price for a specific tier
   */
  validateTierPrice(tier: string, amount: string, config: any): boolean {
    if (!config?.tiers?.[tier]) {
      throw new Error(`Invalid tier: ${tier}`);
    }

    const expectedAmountSOL = config.tiers[tier].entranceFee;
    const expectedAmountLamports = Math.floor(expectedAmountSOL * 1e9);
    const actualAmountLamports = parseInt(amount);

    // Strict validation - no price deviation allowed
    return actualAmountLamports === expectedAmountLamports;
  }

  /**
   * Get tier configuration for server-side validation
   */
  getTierConfig(tier: string, config: any): any {
    if (!config?.tiers?.[tier]) {
      throw new Error(
        `Invalid tier: ${tier}. Available tiers: ${Object.keys(config?.tiers || {}).join(', ')}`,
      );
    }
    return config.tiers[tier];
  }

  /**
   * Initialize a new game vault with tier specification
   */
  async initializeGameVaultWithTier(
    params: InitializeGameVaultParams & { tier: string },
  ): Promise<string> {
    const { vault } = this.getVaultPdas(params.gameId);

    const tx = await this.program.methods
      .initializeGameVault(new anchor.BN(params.gameId))
      .accounts({
        authority: this.wallet.publicKey,
        tokenMint: params.tokenMint,
      })
      .rpc();

    // Create vault token account after initialization
    // 🔧 修复：统一创建SPL Token账户（包括WSOL）
    console.log(
      `🪙 Creating Associated Token Account for token ${params.tokenMint.toString()}`,
    );
    try {
      await getOrCreateAssociatedTokenAccount(
        this.connection,
        this.wallet,
        params.tokenMint,
        vault,
        true, // allowOwnerOffCurve
      );
      console.log('✅ Associated Token Account created successfully');
    } catch (error) {
      console.warn('⚠️ Failed to create Associated Token Account:', error);
      // For SPL tokens (including WSOL), this is a critical error
      throw new Error(`Failed to create token account for SPL token: ${error}`);
    }

    return tx;
  }

  /**
   * Get vault account data
   */
  async getVaultAccount(gameId: number): Promise<GameVault> {
    const { vault } = this.getVaultPdas(gameId);
    const account = await this.program.account.gameVault.fetch(vault);

    return {
      gameId: (account.gameId as anchor.BN).toString(),
      authority: account.authority as PublicKey,
      totalDeposit: (account.totalDeposit as anchor.BN).toString(),
      finalized: account.finalized as boolean,
      withdrawEnabled: account.withdrawEnabled as boolean,
      tokenMint: account.tokenMint as PublicKey,
    };
  }

  /**
   * Get token mint for a specific game from on-chain vault
   */
  async getGameTokenMint(gameId: number): Promise<PublicKey> {
    try {
      const vaultAccount = await this.getVaultAccount(gameId);
      return vaultAccount.tokenMint as PublicKey;
    } catch (error) {
      const err = error as Error;
      throw new Error(
        `Failed to get token mint for game ${gameId}: ${err.message}`,
      );
    }
  }

  /**
   * Get comprehensive game information including token details
   */
  async getGameInfo(gameId: number): Promise<{
    vault: GameVault;
    tokenMint: PublicKey;
    gameId: string;
    isActive: boolean;
    canBuyTickets: boolean;
  }> {
    try {
      const vaultAccount = await this.getVaultAccount(gameId);

      return {
        vault: vaultAccount,
        tokenMint: vaultAccount.tokenMint as PublicKey,
        gameId: vaultAccount.gameId,
        isActive: !vaultAccount.finalized,
        canBuyTickets: !vaultAccount.finalized && !vaultAccount.withdrawEnabled,
      };
    } catch (error) {
      const err = error as Error;
      throw new Error(
        `Failed to get game info for game ${gameId}: ${err.message}`,
      );
    }
  }

  /**
   * Get user ticket account data
   */
  async getUserTicketAccount(
    gameId: number,
    user: PublicKey,
  ): Promise<UserTicket | null> {
    try {
      const userTicket = this.getUserTicketPda(gameId, user);
      const account = await this.program.account.userTicket.fetch(userTicket);

      return {
        gameId: (account.gameId as anchor.BN).toString(),
        user: account.user as PublicKey,
        amount: (account.amount as anchor.BN).toString(),
        hasWithdrawn: account.hasWithdrawn as boolean,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Get reward map account data
   */
  async getRewardMapAccount(gameId: number): Promise<RewardMap | null> {
    try {
      const rewardMap = this.getRewardMapPda(gameId);
      const account = await this.program.account.rewardMap.fetch(rewardMap);

      return {
        gameId: (account.gameId as anchor.BN).toString(),
        rewards: (account.rewards as any[]).map((reward: any) => ({
          user: reward.user as PublicKey,
          amount: (reward.amount as anchor.BN).toString(),
        })),
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Get all vault info including PDAs
   */
  async getVaultInfo(gameId: number): Promise<VaultInfo> {
    const { vault, vaultSigner } = this.getVaultPdas(gameId);
    const userTicket = this.getUserTicketPda(gameId, this.wallet.publicKey);
    const rewardMap = this.getRewardMapPda(gameId);

    // Get the actual token mint from the vault account
    let vaultToken: PublicKey;
    try {
      const vaultAccount = await this.program.account.gameVault.fetch(vault);

      // 🔧 修复：统一使用SPL Token处理（包括WSOL）
      console.log(
        `🪙 Using SPL token ${(vaultAccount.tokenMint as PublicKey).toString()} for vault info - getting associated token account`,
      );
      vaultToken = await getAssociatedTokenAddress(
        vaultAccount.tokenMint as PublicKey,
        vault,
        true,
      );
    } catch (error) {
      // Fallback to vault PDA if account doesn't exist yet
      vaultToken = vault;
    }

    return {
      vault,
      vaultSigner,
      vaultToken,
      userTicket,
      rewardMap,
    };
  }

  // ==================== Event Methods ====================

  /**
   * Listen to all vault events
   */
  onAllEvents(callback: (event: any, slot: number) => void): EventSubscription {
    const subscriptionId = this.connection.onProgramAccountChange(
      this.program.programId,
      (accountInfo: any, context: any) => {
        try {
          const event = this.program.coder.events.decode(
            accountInfo.accountInfo.data,
          );
          if (event) {
            callback(event, context.slot);
          }
        } catch (error) {
          // Ignore decoding errors for non-event data
        }
      },
      'confirmed',
    );

    return {
      unsubscribe: () => {
        this.connection.removeProgramAccountChangeListener(subscriptionId);
      },
    };
  }

  /**
   * Listen to specific event types
   */
  onEvent<T>(
    eventName: string,
    callback: (event: T, slot: number) => void,
  ): EventSubscription {
    const subscriptionId = this.connection.onProgramAccountChange(
      this.program.programId,
      (accountInfo: any, context: any) => {
        try {
          const event = this.program.coder.events.decode(
            accountInfo.accountInfo.data,
          );
          if (event && (event as any).eventName === eventName) {
            callback((event as any).data as T, context.slot);
          }
        } catch (error) {
          // Ignore decoding errors for non-event data
        }
      },
      'confirmed',
    );

    return {
      unsubscribe: () => {
        this.connection.removeProgramAccountChangeListener(subscriptionId);
      },
    };
  }

  /**
   * Listen to GameVaultInitialized events
   */
  onGameVaultInitialized(
    callback: (event: GameVaultInitializedEvent, slot: number) => void,
  ): EventSubscription {
    return this.onEvent<GameVaultInitializedEvent>(
      'GameVaultInitialized',
      callback,
    );
  }

  /**
   * Listen to TicketPurchased events
   */
  onTicketPurchased(
    callback: (event: TicketPurchasedEvent, slot: number) => void,
  ): EventSubscription {
    return this.onEvent<TicketPurchasedEvent>('TicketPurchased', callback);
  }

  /**
   * Listen to RewardClaimed events
   */
  onRewardClaimed(
    callback: (event: RewardClaimedEvent, slot: number) => void,
  ): EventSubscription {
    return this.onEvent<RewardClaimedEvent>('RewardClaimed', callback);
  }

  /**
   * Listen to GameFinalized events
   */
  onGameFinalized(
    callback: (event: GameFinalizedEvent, slot: number) => void,
  ): EventSubscription {
    return this.onEvent<GameFinalizedEvent>('GameFinalized', callback);
  }

  /**
   * Listen to AdminWithdrawn events
   */
  onAdminWithdrawn(
    callback: (event: AdminWithdrawnEvent, slot: number) => void,
  ): EventSubscription {
    return this.onEvent<AdminWithdrawnEvent>('AdminWithdrawn', callback);
  }

  /**
   * Listen to TokenMintChanged events
   */
  onTokenMintChanged(
    callback: (event: TokenMintChangedEvent, slot: number) => void,
  ): EventSubscription {
    return this.onEvent<TokenMintChangedEvent>('TokenMintChanged', callback);
  }

  /**
   * Get historical events with filters
   */
  async getEvents(filter?: EventFilter): Promise<any[]> {
    const signatures = await this.connection.getSignaturesForAddress(
      this.program.programId,
      {
        limit: 1000,
        before: filter?.toSlot ? undefined : undefined,
        until: filter?.fromSlot ? undefined : undefined,
      },
    );

    const events: any[] = [];

    for (const sig of signatures) {
      try {
        const tx = await this.connection.getTransaction(sig.signature, {
          commitment: 'confirmed',
          maxSupportedTransactionVersion: 0,
        });

        if (tx?.meta?.logMessages) {
          for (const log of tx.meta.logMessages) {
            try {
              // Parse program logs for events
              if (log.includes('Program log:')) {
                const eventData = log.replace('Program log:', '').trim();
                const event = this.program.coder.events.decode(eventData);

                if (event) {
                  // Apply filters
                  if (
                    filter?.gameId &&
                    event.data.gameId?.toString() !== filter.gameId.toString()
                  ) {
                    continue;
                  }
                  if (
                    filter?.user &&
                    event.data.user?.toString() !== filter.user.toString()
                  ) {
                    continue;
                  }
                  if (
                    filter?.authority &&
                    event.data.authority?.toString() !==
                      filter.authority.toString()
                  ) {
                    continue;
                  }

                  events.push({
                    ...event,
                    signature: sig.signature,
                    slot: sig.slot,
                    blockTime: sig.blockTime,
                  });
                }
              }
            } catch (error) {
              // Ignore parsing errors
            }
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch transaction ${sig.signature}:`, error);
      }
    }

    return events;
  }

  /**
   * Get events for a specific game
   */
  async getGameEvents(gameId: number): Promise<any[]> {
    return this.getEvents({ gameId });
  }

  /**
   * Get events for a specific user
   */
  async getUserEvents(user: PublicKey): Promise<any[]> {
    return this.getEvents({ user });
  }

  /**
   * Get events from a specific authority
   */
  async getAuthorityEvents(authority: PublicKey): Promise<any[]> {
    return this.getEvents({ authority });
  }

  /**
   * Get recent events (last 1000 transactions)
   */
  async getRecentEvents(): Promise<any[]> {
    return this.getEvents();
  }

  // ==================== Game Discovery Methods ====================

  /**
   * Get all game IDs by scanning program accounts
   */
  async getAllGameIds(): Promise<string[]> {
    try {
      // Try to get all program accounts without discriminator first
      const accounts = await this.connection.getProgramAccounts(
        this.program.programId,
      );

      const gameIds: string[] = [];

      for (const account of accounts) {
        try {
          // Try to decode as gameVault account
          const vaultAccount = this.program.coder.accounts.decode(
            'gameVault',
            account.account.data,
          );
          gameIds.push((vaultAccount.gameId as anchor.BN).toString());
        } catch (error) {
          // Skip accounts that can't be decoded as gameVault
          continue;
        }
      }

      return gameIds.sort((a, b) => parseInt(a) - parseInt(b));
    } catch (error) {
      // If no accounts exist or query fails, return empty array
      console.log(
        'No existing game vaults found, starting fresh:',
        error instanceof Error ? error.message : String(error),
      );
      return [];
    }
  }

  /**
   * Get all game vaults with detailed information
   */
  async getAllGames(options?: GameDiscoveryOptions): Promise<GameInfo[]> {
    const accounts = await this.connection.getProgramAccounts(
      this.program.programId,
      {
        filters: [
          {
            memcmp: {
              offset: 0,
              bytes: (this.program.coder.accounts as any).accountDiscriminator(
                'gameVault',
              ),
            },
          },
        ],
      },
    );

    const games: GameInfo[] = [];

    for (const account of accounts) {
      try {
        const vaultAccount = this.program.coder.accounts.decode(
          'gameVault',
          account.account.data,
        );

        const gameInfo: GameInfo = {
          gameId: (vaultAccount.gameId as anchor.BN).toString(),
          vault: account.pubkey,
          authority: vaultAccount.authority as PublicKey,
          totalDeposit: (vaultAccount.totalDeposit as anchor.BN).toString(),
          finalized: vaultAccount.finalized as boolean,
          withdrawEnabled: vaultAccount.withdrawEnabled as boolean,
          tokenMint: vaultAccount.tokenMint as PublicKey,
          createdAt: account.account.lamports ? undefined : undefined, // Could be enhanced with block time
        };

        // Apply filters
        if (
          options?.authority &&
          !gameInfo.authority.equals(options.authority)
        ) {
          continue;
        }
        if (
          options?.finalized !== undefined &&
          gameInfo.finalized !== options.finalized
        ) {
          continue;
        }
        if (
          options?.withdrawEnabled !== undefined &&
          gameInfo.withdrawEnabled !== options.withdrawEnabled
        ) {
          continue;
        }
        if (
          options?.tokenMint &&
          !gameInfo.tokenMint.equals(options.tokenMint)
        ) {
          continue;
        }

        games.push(gameInfo);
      } catch (error) {
        // Skip invalid accounts
        continue;
      }
    }

    // Sort by game ID
    games.sort((a, b) => parseInt(a.gameId) - parseInt(b.gameId));

    // Apply limit
    if (options?.limit) {
      return games.slice(0, options.limit);
    }

    return games;
  }

  /**
   * Get games by authority
   */
  async getGamesByAuthority(authority: PublicKey): Promise<GameInfo[]> {
    return this.getAllGames({ authority });
  }

  /**
   * Get active (non-finalized) games
   */
  async getActiveGames(): Promise<GameInfo[]> {
    return this.getAllGames({ finalized: false });
  }

  /**
   * Get finalized games
   */
  async getFinalizedGames(): Promise<GameInfo[]> {
    return this.getAllGames({ finalized: true });
  }

  /**
   * Get games with withdraw enabled
   */
  async getGamesWithWithdrawEnabled(): Promise<GameInfo[]> {
    return this.getAllGames({ withdrawEnabled: true });
  }

  /**
   * Get games by token mint
   */
  async getGamesByTokenMint(tokenMint: PublicKey): Promise<GameInfo[]> {
    return this.getAllGames({ tokenMint });
  }

  /**
   * Get the latest game ID (highest number)
   */
  async getLatestGameId(): Promise<string | null> {
    const gameIds = await this.getAllGameIds();
    return gameIds.length > 0 ? gameIds[gameIds.length - 1] : null;
  }

  /**
   * Get the next available game ID
   */
  async getNextGameId(): Promise<number> {
    const latestGameId = await this.getLatestGameId();
    return latestGameId ? parseInt(latestGameId) + 1 : 1;
  }

  /**
   * Atomically create the next available game ID and initialize vault
   * Prevents race conditions when multiple servers start simultaneously
   */
  async createNextGameAtomically(
    params: Omit<InitializeGameVaultParams, 'gameId'> & {
      tier?: string;
      maxRetries?: number;
    },
  ): Promise<{ gameId: number; txHash: string }> {
    const maxRetries = params.maxRetries || 5;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Get the next available game ID
        const nextGameId = await this.getNextGameId();

        console.log(
          `🎯 Attempt ${attempt}/${maxRetries}: Trying to create game ${nextGameId}`,
        );

        // Try to initialize the vault for this game ID
        const txHash = await this.initializeGameVault({
          gameId: nextGameId,
          tokenMint: params.tokenMint,
        });

        console.log(
          `✅ Successfully created game ${nextGameId} atomically on attempt ${attempt}`,
        );

        return {
          gameId: nextGameId,
          txHash,
        };
      } catch (error) {
        const err = error as Error;
        lastError = err;
        console.warn(
          `❌ Attempt ${attempt}/${maxRetries} failed:`,
          err.message,
        );

        // If this is likely a duplicate gameId error, we should retry
        if (
          err.message.includes('already in use') ||
          err.message.includes('already exists') ||
          err.message.includes('InvalidAccountData') ||
          attempt < maxRetries
        ) {
          // Wait a random amount between 1-3 seconds before retrying
          const delay = 1000 + Math.random() * 2000;
          console.log(`⏳ Waiting ${delay.toFixed(0)}ms before retry...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        throw error;
      }
    }

    throw new Error(
      `Failed to create game atomically after ${maxRetries} attempts. Last error: ${lastError?.message}`,
    );
  }

  /**
   * Check if a game ID exists
   */
  async gameExists(gameId: number): Promise<boolean> {
    try {
      const { vault } = this.getVaultPdas(gameId);
      const account = await this.program.account.gameVault.fetch(vault);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get game count statistics
   */
  async getGameStats(): Promise<{
    total: number;
    active: number;
    finalized: number;
    withWithdrawEnabled: number;
  }> {
    const allGames = await this.getAllGames();

    return {
      total: allGames.length,
      active: allGames.filter((g) => !g.finalized).length,
      finalized: allGames.filter((g) => g.finalized).length,
      withWithdrawEnabled: allGames.filter((g) => g.withdrawEnabled).length,
    };
  }
}

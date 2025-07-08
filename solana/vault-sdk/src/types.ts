import { PublicKey } from '@solana/web3.js';

export interface VaultConfig {
  programId: PublicKey;
  connection: any;
  wallet: any;
}

export interface GameVault {
  gameId: string;
  authority: PublicKey;
  totalDeposit: string;
  finalized: boolean;
  withdrawEnabled: boolean;
  tokenMint: PublicKey;
}

export interface UserTicket {
  gameId: string;
  user: PublicKey;
  amount: string;
  hasWithdrawn: boolean;
}

export interface RewardMap {
  gameId: string;
  rewards: RewardEntry[];
}

export interface RewardEntry {
  user: PublicKey;
  amount: string;
}

export interface InitializeGameVaultParams {
  gameId: number;
  tokenMint: PublicKey;
}

export interface BuyTicketParams {
  gameId: number;
  amount: number;
  userTokenAccount: PublicKey;
}

export interface ClaimRewardParams {
  gameId: number;
  userTokenAccount: PublicKey;
}

export interface FinalizeGameParams {
  gameId: number;
  rewards: RewardEntry[];
}

export interface AdminWithdrawParams {
  gameId: number;
  amount: number;
  adminTokenAccount: PublicKey;
}

export interface ChangeTokenMintParams {
  gameId: number;
  newMint: PublicKey;
}

export interface VaultInfo {
  vault: PublicKey;
  vaultToken: PublicKey;
  vaultSigner: PublicKey;
  userTicket?: PublicKey;
  rewardMap?: PublicKey;
}

// Event types
export interface GameVaultInitializedEvent {
  gameId: string;
  authority: PublicKey;
  tokenMint: PublicKey;
  vault: PublicKey;
}

export interface TicketPurchasedEvent {
  gameId: string;
  user: PublicKey;
  amount: string;
  totalDeposit: string;
  userTicket: PublicKey;
}

export interface RewardClaimedEvent {
  gameId: string;
  user: PublicKey;
  rewardAmount: string;
  userTicket: PublicKey;
}

export interface GameFinalizedEvent {
  gameId: string;
  authority: PublicKey;
  totalDeposit: string;
  rewardCount: string;
  rewardMap: PublicKey;
}

export interface AdminWithdrawnEvent {
  gameId: string;
  authority: PublicKey;
  amount: string;
  adminToken: PublicKey;
}

export interface TokenMintChangedEvent {
  gameId: string;
  authority: PublicKey;
  oldMint: PublicKey;
  newMint: PublicKey;
}

export interface EventFilter {
  gameId?: number;
  user?: PublicKey;
  authority?: PublicKey;
  fromSlot?: number;
  toSlot?: number;
}

export interface EventSubscription {
  unsubscribe: () => void;
}

// Game discovery types
export interface GameInfo {
  gameId: string;
  vault: PublicKey;
  authority: PublicKey;
  totalDeposit: string;
  finalized: boolean;
  withdrawEnabled: boolean;
  tokenMint: PublicKey;
  createdAt?: number;
}

export interface GameDiscoveryOptions {
  limit?: number;
  authority?: PublicKey;
  finalized?: boolean;
  withdrawEnabled?: boolean;
  tokenMint?: PublicKey;
} 
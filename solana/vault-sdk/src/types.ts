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
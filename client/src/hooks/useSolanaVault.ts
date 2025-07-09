// Direct Solana vault interaction using vault-sdk
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useState, useCallback, useMemo } from 'react';
import { PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';

/**
 * Hook for direct Solana vault operations using vault-sdk approach
 */
export const useSolanaVault = () => {
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Vault program ID - use a valid placeholder or skip if not configured
  const VAULT_PROGRAM_ID = useMemo(() => {
    const programIdStr = process.env.REACT_APP_VAULT_PROGRAM_ID;

    // If no program ID configured, return null to indicate vault operations not available
    if (!programIdStr) {
      return null;
    }

    try {
      return new PublicKey(programIdStr);
    } catch (error) {
      console.warn(
        'Invalid VAULT_PROGRAM_ID in environment variables:',
        programIdStr,
      );
      return null;
    }
  }, []);

  // Generate vault PDAs (Program Derived Addresses)
  const getVaultPdas = useCallback(
    (gameId: number) => {
      if (!VAULT_PROGRAM_ID) {
        throw new Error('Vault program ID not configured');
      }

      const gameIdBuffer = Buffer.alloc(8);
      gameIdBuffer.writeBigUInt64LE(BigInt(gameId), 0);

      const [vault] = PublicKey.findProgramAddressSync(
        [Buffer.from('vault'), gameIdBuffer],
        VAULT_PROGRAM_ID,
      );

      const [vaultSigner] = PublicKey.findProgramAddressSync(
        [Buffer.from('vault_signer'), gameIdBuffer],
        VAULT_PROGRAM_ID,
      );

      return { vault, vaultSigner };
    },
    [VAULT_PROGRAM_ID],
  );

  // Generate user ticket PDA
  const getUserTicketPda = useCallback(
    (gameId: number, userPubkey: PublicKey) => {
      if (!VAULT_PROGRAM_ID) {
        throw new Error('Vault program ID not configured');
      }

      const gameIdBuffer = Buffer.alloc(8);
      gameIdBuffer.writeBigUInt64LE(BigInt(gameId), 0);

      const [userTicket] = PublicKey.findProgramAddressSync(
        [Buffer.from('user_ticket'), gameIdBuffer, userPubkey.toBuffer()],
        VAULT_PROGRAM_ID,
      );

      return userTicket;
    },
    [VAULT_PROGRAM_ID],
  );

  // Get user's token account (reuse existing logic instead of duplicating)
  const getUserTokenAccount = useCallback(
    async (tokenMint: PublicKey, isSOL: boolean): Promise<PublicKey> => {
      if (!publicKey) {
        throw new Error('Wallet not connected');
      }

      if (isSOL) {
        // For native SOL, use the user's wallet address directly
        return publicKey;
      } else {
        // For SPL tokens, get the associated token account
        return await getAssociatedTokenAddress(tokenMint, publicKey);
      }
    },
    [publicKey],
  );

  // Simplified buy ticket using server-side transaction building
  const buyTicket = useCallback(
    async (
      gameId: number,
      amount: bigint,
      tokenMint: PublicKey,
      tier?: string,
      expectedAmount?: bigint,
    ): Promise<string> => {
      if (!publicKey || !signTransaction || !sendTransaction) {
        throw new Error('Wallet not connected or missing required methods');
      }

      if (!VAULT_PROGRAM_ID) {
        throw new Error(
          'Vault program not configured - please set REACT_APP_VAULT_PROGRAM_ID',
        );
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log(
          `🎫 Buying ticket for game ${gameId} with amount ${amount} tokens`,
        );

        // Server-side price validation (if tier and expected amount provided)
        if (tier && expectedAmount && amount !== expectedAmount) {
          throw new Error(
            `Price validation failed: expected ${expectedAmount} for tier ${tier}, got ${amount}`,
          );
        }

        // Call server to build and handle the transaction
        const serverUrl =
          localStorage.getItem('selectedServer') || 'localhost:8000';
        const protocol = serverUrl.includes('localhost') ? 'http' : 'https';

        const response = await fetch(
          `${protocol}://${serverUrl}/api/solana/buy-ticket`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              gameId,
              amount: amount.toString(),
              walletAddress: publicKey.toString(),
              tier,
              tokenMint: tokenMint.toString(),
              programId: VAULT_PROGRAM_ID.toString(),
            }),
          },
        );

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to buy ticket');
        }

        console.log(`✅ Ticket purchased successfully - TX: ${result.txHash}`);
        return result.txHash;
      } catch (err) {
        const error = err as Error;
        console.error('❌ Failed to buy ticket:', error);
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [publicKey, signTransaction, sendTransaction, VAULT_PROGRAM_ID],
  );

  // Check if user has a ticket for a game
  const hasTicket = useCallback(
    async (gameId: number): Promise<boolean> => {
      if (!publicKey || !VAULT_PROGRAM_ID) return false;

      try {
        const userTicket = getUserTicketPda(gameId, publicKey);
        const accountInfo = await connection.getAccountInfo(userTicket);
        return accountInfo !== null;
      } catch (error) {
        console.error('Error checking ticket:', error);
        return false;
      }
    },
    [publicKey, connection, getUserTicketPda, VAULT_PROGRAM_ID],
  );

  // Get vault information
  const getVaultInfo = useCallback(
    async (gameId: number) => {
      if (!VAULT_PROGRAM_ID) {
        throw new Error('Vault program not configured');
      }

      try {
        const { vault } = getVaultPdas(gameId);
        const accountInfo = await connection.getAccountInfo(vault);

        if (!accountInfo) {
          throw new Error(`Vault for game ${gameId} not found`);
        }

        return {
          vault,
          exists: true,
          balance: accountInfo.lamports,
        };
      } catch (error) {
        console.error('Error fetching vault info:', error);
        return null;
      }
    },
    [connection, getVaultPdas, VAULT_PROGRAM_ID],
  );

  return {
    buyTicket,
    hasTicket,
    getVaultInfo,
    getVaultPdas,
    getUserTicketPda,
    getUserTokenAccount,
    isLoading,
    error,
    VAULT_PROGRAM_ID,
    isVaultConfigured: !!VAULT_PROGRAM_ID,
  };
};

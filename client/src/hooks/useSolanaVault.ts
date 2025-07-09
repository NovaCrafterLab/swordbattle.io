// Server-based Solana vault interaction (avoids browser Buffer compatibility issues)
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useState, useCallback } from 'react';
import { PublicKey } from '@solana/web3.js';

/**
 * Hook for Solana vault operations using server-side transaction building
 * This approach avoids Buffer compatibility issues in the browser
 */
export const useSolanaVault = () => {
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [txStatus, setTxStatus] = useState<
    | 'idle'
    | 'building'
    | 'signing'
    | 'sending'
    | 'confirming'
    | 'verifying'
    | 'completed'
  >('idle');
  const [currentTxHash, setCurrentTxHash] = useState<string | null>(null);

  // Server-side ticket purchase using proper vault program (Fixed treasury issue)
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

      try {
        setIsLoading(true);
        setError(null);
        setTxStatus('building');
        setCurrentTxHash(null);

        console.log(
          `🎫 Starting server-side ticket purchase for game ${gameId} with amount ${amount} tokens`,
        );

        // 🔍 Debug: Check wallet connection and methods
        console.log('🔍 Wallet Debug Info:', {
          connected: !!publicKey,
          publicKey: publicKey?.toString(),
          hasSignTransaction: !!signTransaction,
          hasSendTransaction: !!sendTransaction,
          walletType: (window as any).solana?.isPhantom ? 'Phantom' : 'Unknown',
        });

        // Check if wallet methods are available
        if (!signTransaction) {
          throw new Error('Wallet does not support transaction signing');
        }
        if (!sendTransaction) {
          throw new Error('Wallet does not support transaction sending');
        }

        // Server-side price validation (if tier and expected amount provided)
        if (tier && expectedAmount && amount !== expectedAmount) {
          throw new Error(
            `Price validation failed: expected ${expectedAmount} for tier ${tier}, got ${amount}`,
          );
        }

        // 🔧 修复：使用服务器API进行正确的票据购买，而不是客户端直接转账
        console.log(
          '🏦 Using server-side buyTicket API for proper vault interaction...',
        );

        const serverUrl =
          localStorage.getItem('selectedServer') || 'localhost:8000';
        const protocol = serverUrl.includes('localhost') ? 'http' : 'https';

        setTxStatus('building');
        console.log('📡 Calling server buyTicket API...');

        // Call server-side buyTicket API
        const buyTicketResponse = await fetch(
          `${protocol}://${serverUrl}/api/buy-ticket`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              gameId,
              amount: amount.toString(),
              walletAddress: publicKey.toString(),
              tier,
              playerLevel: 1, // TODO: Get from player profile
            }),
          },
        );

        if (!buyTicketResponse.ok) {
          const errorData = await buyTicketResponse.json().catch(() => ({}));
          throw new Error(
            `Server buyTicket failed: ${errorData.error || buyTicketResponse.statusText}`,
          );
        }

        const buyTicketResult = await buyTicketResponse.json();
        if (!buyTicketResult.success) {
          throw new Error(`BuyTicket API error: ${buyTicketResult.error}`);
        }

        console.log('✅ Server buyTicket completed:', {
          txHash: buyTicketResult.txHash,
          gameId: buyTicketResult.gameId,
          tier: buyTicketResult.tier,
          amount: buyTicketResult.amount,
        });

        const signature = buyTicketResult.txHash;
        setCurrentTxHash(signature);
        setTxStatus('confirming');

        console.log(`✅ Transaction completed via server: ${signature}`);

        // Step 6: Notify server of successful transaction for game state sync
        setTxStatus('verifying');
        console.log('🔍 Notifying server of successful transaction...');

        try {
          const response = await fetch(
            `${protocol}://${serverUrl}/api/player-joined`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                gameId,
                playerAddress: publicKey.toString(),
                txHash: signature,
                tier,
                amount: amount.toString(),
              }),
            },
          );

          if (response.ok) {
            console.log('✅ Server notified of successful transaction');
          } else {
            console.warn(
              '⚠️ Server notification failed but transaction completed',
            );
          }
        } catch (syncError) {
          console.warn(
            '⚠️ Failed to sync with server, but transaction completed:',
            syncError,
          );
        }

        // Wait a bit for state to update
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Verify ticket by checking server state (with fallback)
        try {
          const verifyResponse = await fetch(
            `${protocol}://${serverUrl}/api/vault-info/${gameId}/${publicKey.toString()}`,
          );
          if (verifyResponse.ok) {
            const verifyResult = await verifyResponse.json();
            if (verifyResult.success && verifyResult.hasTicket) {
              console.log('✅ Ticket verified successfully on server');
            } else {
              console.warn(
                '⚠️ Ticket verification failed on server, but transaction completed',
              );
            }
          } else {
            console.warn(
              '⚠️ Server verification endpoint not available, but transaction completed',
            );
          }
        } catch (verifyError) {
          console.warn(
            '⚠️ Failed to verify ticket on server, but transaction completed:',
            verifyError,
          );
        }

        setTxStatus('completed');
        console.log(
          `🎉 Ticket purchase completed successfully via server - TX: ${signature}`,
        );
        return signature;
      } catch (err) {
        const error = err as Error;
        console.error('❌ Failed to buy ticket:', error);
        setError(error);
        setTxStatus('idle');
        setCurrentTxHash(null);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [publicKey, signTransaction, sendTransaction, connection],
  );

  // Check if user has a ticket for a game using server API
  const hasTicket = useCallback(
    async (gameId: number): Promise<boolean> => {
      if (!publicKey) return false;

      try {
        const serverUrl =
          localStorage.getItem('selectedServer') || 'localhost:8000';
        const protocol = serverUrl.includes('localhost') ? 'http' : 'https';

        const response = await fetch(
          `${protocol}://${serverUrl}/api/vault-info/${gameId}/${publicKey.toString()}`,
        );
        if (!response.ok) return false;

        const result = await response.json();
        return result.success && result.hasTicket;
      } catch (error) {
        console.error('Error checking ticket:', error);
        return false;
      }
    },
    [publicKey],
  );

  // Get vault information using server API
  const getVaultInfo = useCallback(async (gameId: number) => {
    try {
      const serverUrl =
        localStorage.getItem('selectedServer') || 'localhost:8000';
      const protocol = serverUrl.includes('localhost') ? 'http' : 'https';

      const response = await fetch(
        `${protocol}://${serverUrl}/api/vault-info/${gameId}`,
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch vault info: ${response.statusText}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(`Vault info request failed: ${result.error}`);
      }

      return {
        vault: result.vault,
        exists: true,
        tokenMint: result.tokenMint,
        gameStatus: result.gameStatus,
      };
    } catch (error) {
      console.error('Error fetching vault info:', error);
      return null;
    }
  }, []);

  // Test wallet connection and signing capability
  const testWalletConnection = useCallback(async () => {
    console.log('🧪 Testing wallet connection...');

    if (!publicKey || !signTransaction || !sendTransaction) {
      console.error('❌ Wallet not connected or methods missing');
      return false;
    }

    try {
      // Create a simple test transaction
      const { Transaction, SystemProgram } = await import('@solana/web3.js');

      const testTransaction = new Transaction();
      testTransaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: publicKey, // Send to self for testing
          lamports: 1, // 1 lamport for testing
        }),
      );

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      testTransaction.recentBlockhash = blockhash;
      testTransaction.feePayer = publicKey;

      console.log('🔍 About to test wallet signing - popup should appear!');

      // This should trigger the wallet plugin
      await signTransaction(testTransaction);
      console.log('✅ Wallet signing test successful!');

      return true;
    } catch (error) {
      console.error('❌ Wallet signing test failed:', error);
      return false;
    }
  }, [publicKey, signTransaction, sendTransaction, connection]);

  return {
    buyTicket,
    hasTicket,
    getVaultInfo,
    testWalletConnection, // Add test function
    isLoading,
    error,
    txStatus,
    currentTxHash,
    isVaultConfigured: true, // Server handles vault configuration
  };
};

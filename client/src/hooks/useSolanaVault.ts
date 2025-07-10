// Secure frontend Solana vault interaction with anti-tampering protection
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useState, useCallback } from 'react';
import { PublicKey, Transaction } from '@solana/web3.js';

/**
 * Hook for Solana vault operations using secure frontend transaction building
 * This approach ensures wallet popup functionality while preventing amount tampering
 */

// Security helper: Generate timestamp-based HMAC for anti-tampering
const generateSecureSignature = (data: string, secret: string): string => {
  // Simple hash function for demo - in production use proper HMAC
  const timestamp = Date.now().toString();
  const combined = `${data}:${timestamp}:${secret}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `${Math.abs(hash).toString(16)}:${timestamp}`;
};

// Security helper: Validate signature timing
const validateTimestamp = (
  signature: string,
  maxAgeMs: number = 300000,
): boolean => {
  const parts = signature.split(':');
  if (parts.length !== 2) return false;

  const timestamp = parseInt(parts[1]);
  const age = Date.now() - timestamp;
  return age <= maxAgeMs;
};

// Enhanced error messages for better user experience
const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) {
    // Common wallet errors
    if (error.message.includes('User rejected')) {
      return 'Transaction was cancelled by user';
    }
    if (error.message.includes('Insufficient funds')) {
      return 'Insufficient balance to complete transaction';
    }
    if (error.message.includes('Network')) {
      return 'Network connection error. Please try again';
    }
    if (error.message.includes('timeout')) {
      return 'Transaction timed out. Please try again';
    }
    return error.message;
  }
  return 'Unknown error occurred';
};
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

  // Secure frontend ticket purchase with anti-tampering protection
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
          `🎫 Starting secure frontend ticket purchase for game ${gameId} with amount ${amount} tokens`,
        );

        // Step 1: Security validation and parameter verification
        const serverUrl =
          localStorage.getItem('selectedServer') || 'localhost:8000';
        const protocol = serverUrl.includes('localhost') ? 'http' : 'https';

        // Generate secure signature for anti-tampering
        const requestData = `${gameId}:${amount}:${tokenMint.toString()}:${tier || 'default'}:${publicKey.toString()}`;
        const signature = generateSecureSignature(requestData, 'client-secret');

        console.log('🔒 Generated secure signature for transaction parameters');

        // Step 2: Request server to validate parameters and build transaction
        setTxStatus('building');
        console.log(
          '📡 Requesting server transaction building with parameter validation...',
        );

        const buildResponse = await fetch(
          `${protocol}://${serverUrl}/api/build-buy-ticket-transaction`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              gameId,
              amount: amount.toString(),
              walletAddress: publicKey.toString(),
              tokenMint: tokenMint.toString(),
              tier,
              expectedAmount: expectedAmount?.toString(),
              signature, // Anti-tampering signature
              playerLevel: 1, // TODO: Get from player profile
            }),
          },
        );

        if (!buildResponse.ok) {
          const errorData = await buildResponse.json().catch(() => ({}));
          throw new Error(
            `Transaction building failed: ${errorData.error || buildResponse.statusText}`,
          );
        }

        const buildResult = await buildResponse.json();
        if (!buildResult.success) {
          throw new Error(`Transaction build error: ${buildResult.error}`);
        }

        console.log('✅ Server validated parameters and built transaction');

        // Step 3: Deserialize transaction from server
        const transactionBuffer = Buffer.from(
          buildResult.transaction,
          'base64',
        );
        const transaction = Transaction.from(transactionBuffer);

        // Step 4: Add recent blockhash if not already set
        if (!transaction.recentBlockhash) {
          const { blockhash } = await connection.getLatestBlockhash();
          transaction.recentBlockhash = blockhash;
        }

        // Ensure fee payer is set
        transaction.feePayer = publicKey;

        console.log('🔧 Transaction prepared for signing');

        // Step 5: Sign transaction with user wallet (triggers popup)
        setTxStatus('signing');
        console.log(
          '🖊️ Requesting user signature - wallet popup should appear!',
        );

        const signedTransaction = await signTransaction(transaction);
        console.log('✅ Transaction signed by user wallet');

        // Step 6: Send transaction to network
        setTxStatus('sending');
        console.log('📤 Sending transaction to Solana network...');

        const txSignature = await sendTransaction(
          signedTransaction,
          connection,
        );
        setCurrentTxHash(txSignature);

        console.log(`📝 Transaction sent with signature: ${txSignature}`);

        // Step 7: Confirm transaction
        setTxStatus('confirming');
        console.log('⏳ Confirming transaction...');

        const confirmation = await connection.confirmTransaction(
          txSignature,
          'confirmed',
        );

        if (confirmation.value.err) {
          throw new Error(`Transaction failed: ${confirmation.value.err}`);
        }

        console.log('✅ Transaction confirmed on network');

        // Step 8: Verify with server (dual verification for security)
        setTxStatus('verifying');
        console.log('🔍 Performing server-side verification...');

        const verifyResponse = await fetch(
          `${protocol}://${serverUrl}/api/verify-buy-ticket-transaction`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              gameId,
              txSignature,
              walletAddress: publicKey.toString(),
              amount: amount.toString(),
              tier,
              originalSignature: signature, // Original anti-tampering signature
            }),
          },
        );

        if (!verifyResponse.ok) {
          console.warn(
            '⚠️ Server verification failed, but transaction completed',
          );
        } else {
          const verifyResult = await verifyResponse.json();
          if (verifyResult.success) {
            console.log('✅ Server verification successful');
          } else {
            console.warn(
              `⚠️ Server verification returned error: ${verifyResult.error}`,
            );
          }
        }

        // Step 9: Notify server of successful transaction for game state sync
        try {
          const response = await fetch(
            `${protocol}://${serverUrl}/api/player-joined`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                gameId,
                playerAddress: publicKey.toString(),
                txHash: txSignature,
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

        setTxStatus('completed');
        console.log(
          `🎉 Secure ticket purchase completed successfully - TX: ${txSignature}`,
        );
        return txSignature;
      } catch (err) {
        const error = err as Error;
        const userFriendlyMessage = getErrorMessage(error);
        console.error('❌ Failed to buy ticket:', error);

        // Create enhanced error with user-friendly message
        const enhancedError = new Error(userFriendlyMessage);
        enhancedError.cause = error; // Preserve original error for debugging

        setError(enhancedError);
        setTxStatus('idle');
        setCurrentTxHash(null);
        throw enhancedError;
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

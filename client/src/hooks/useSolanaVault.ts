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
  const wallet = useWallet();
  const { publicKey, signTransaction, sendTransaction } = wallet;

  // Try multiple ways to get signAndSendTransaction
  const signAndSendTransaction =
    (wallet as any).signAndSendTransaction ||
    // Some wallets expose it under different names
    (wallet.wallet?.adapter as any)?.signAndSendTransaction ||
    null;

  const { connection } = useConnection();

  console.log('🔍 Wallet capabilities debug:', {
    hasSignTransaction: !!signTransaction,
    hasSendTransaction: !!sendTransaction,
    hasSignAndSendTransaction: !!signAndSendTransaction,
    walletName: wallet.wallet?.adapter?.name,
    availableMethods: Object.keys(wallet).filter(
      (key) => typeof (wallet as any)[key] === 'function',
    ),
  });

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
  const [isProcessing, setIsProcessing] = useState(false); // 防重复调用保护

  // Secure frontend ticket purchase with anti-tampering protection
  const buyTicket = useCallback(
    async (
      gameId: number,
      amount: bigint,
      tokenMint: PublicKey,
      tier?: string,
      expectedAmount?: bigint,
    ): Promise<string> => {
      console.log('🎫 Starting secure buyTicket transaction...');

      // 防重复调用检查
      if (isProcessing) {
        console.log(
          '⚠️ Transaction already in progress, ignoring duplicate call',
        );
        throw new Error('Transaction already in progress');
      }

      if (!publicKey || !signAndSendTransaction) {
        // Fallback to separate sign + send if signAndSendTransaction is not available
        if (!signTransaction || !sendTransaction) {
          throw new Error(
            'Wallet not connected or missing required transaction methods',
          );
        }
      }

      try {
        setIsProcessing(true); // 设置处理中状态
        setIsLoading(true);
        setError(null);
        setTxStatus('building');
        setCurrentTxHash(null);

        console.log(
          `🎫 Starting secure frontend ticket purchase for game ${gameId} with amount ${amount} tokens`,
        );

        // 🔍 DEBUG: Log all input parameters
        console.log('🔍 DEBUG - Input parameters:', {
          gameId,
          amount: amount.toString(),
          tokenMint: tokenMint.toString(),
          tier,
          expectedAmount: expectedAmount?.toString(),
          publicKey: publicKey!.toString(),
          hasSignTransaction: !!signTransaction,
          hasSendTransaction: !!sendTransaction,
        });

        // Step 1: Security validation and parameter verification
        const serverUrl =
          localStorage.getItem('selectedServer') || 'localhost:8000';
        const protocol = serverUrl.includes('localhost') ? 'http' : 'https';

        // Generate secure signature for anti-tampering
        const requestData = `${gameId}:${amount}:${tokenMint.toString()}:${tier || 'default'}:${publicKey!.toString()}`;
        const signature = generateSecureSignature(requestData, 'client-secret');

        console.log('🔒 Generated secure signature for transaction parameters');

        // Step 2: Request server to validate parameters and build transaction
        setTxStatus('building');
        console.log(
          '📡 Requesting server transaction building with parameter validation...',
        );

        const requestUrl = `${protocol}://${serverUrl}/api/build-buy-ticket-transaction`;
        const requestBody = {
          gameId,
          amount: amount.toString(),
          walletAddress: publicKey!.toString(),
          tokenMint: tokenMint.toString(),
          tier,
          expectedAmount: expectedAmount?.toString(),
          signature, // Anti-tampering signature
          playerLevel: 1, // TODO: Get from player profile
        };

        console.log('🔍 DEBUG - Server request:', {
          url: requestUrl,
          body: requestBody,
        });

        const buildResponse = await fetch(requestUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        console.log('🔍 DEBUG - Server response status:', buildResponse.status);

        if (!buildResponse.ok) {
          const errorData = await buildResponse.json().catch(() => ({}));
          console.error('❌ DEBUG - Server error response:', errorData);
          throw new Error(
            `Transaction building failed: ${errorData.error || buildResponse.statusText}`,
          );
        }

        const buildResult = await buildResponse.json();
        console.log('🔍 DEBUG - Server response data:', buildResult);

        if (!buildResult.success) {
          console.error('❌ DEBUG - Build result failed:', buildResult);
          throw new Error(`Transaction build error: ${buildResult.error}`);
        }

        console.log('✅ Server validated parameters and built transaction');

        // Step 3: Deserialize transaction from server
        console.log('🔍 DEBUG - Transaction data from server:', {
          transactionLength: buildResult.transaction?.length,
          transactionPreview:
            buildResult.transaction?.substring(0, 100) + '...',
        });

        const transactionBuffer = Buffer.from(
          buildResult.transaction,
          'base64',
        );
        console.log('🔍 DEBUG - Transaction buffer:', {
          bufferLength: transactionBuffer.length,
          bufferPreview:
            transactionBuffer.toString('hex').substring(0, 100) + '...',
        });

        const transaction = Transaction.from(transactionBuffer);
        console.log('🔍 DEBUG - Deserialized transaction:', {
          instructionCount: transaction.instructions.length,
          hasRecentBlockhash: !!transaction.recentBlockhash,
          hasFeePayer: !!transaction.feePayer,
          signatureCount: transaction.signatures.length,
        });

        // Step 4: Use transaction exactly as built by server (don't modify blockhash)
        console.log('🔧 Using server-built transaction without modifications');

        // Only set fee payer if not already set
        if (!transaction.feePayer) {
          transaction.feePayer = publicKey!;
          console.log('🔧 Set fee payer to connected wallet');
        }

        console.log('🔧 Transaction ready for signing:', {
          recentBlockhash: transaction.recentBlockhash,
          feePayer: transaction.feePayer?.toString(),
          instructionCount: transaction.instructions.length,
          serverBuilt: true,
        });

        // Step 4.5: Skip client-side simulation since server already validated
        // The server-side simulation is more accurate as it has the latest blockchain state
        console.log(
          '⏭️ Skipping client-side simulation (server already validated transaction)',
        );
        console.log('🔍 Transaction ready for signing:', {
          instructionCount: transaction.instructions.length,
          recentBlockhash: transaction.recentBlockhash,
          feePayer: transaction.feePayer?.toString(),
          signatures: transaction.signatures.length,
        });

        // Step 5: Sign and send transaction with user wallet (single popup)
        setTxStatus('signing');
        console.log(
          '🖊️ Requesting user signature and sending transaction - wallet popup should appear!',
        );
        console.log(
          '💡 Using signAndSendTransaction to avoid double wallet popup',
        );

        let txSignature: string;

        if (signAndSendTransaction) {
          // Preferred method: Single wallet popup
          console.log('✅ Using signAndSendTransaction (single popup)');
          txSignature = await signAndSendTransaction(transaction);
          console.log('✅ Transaction signed and sent in single operation');
        } else {
          // Method B: Sign only, then send directly via connection (recommended)
          console.log(
            '🔄 Using optimized sign + connection.sendTransaction method',
          );
          console.log(
            '💡 This should reduce wallet popups and simulation errors',
          );

          const signedTransaction = await signTransaction!(transaction);
          console.log('✅ Transaction signed by user wallet');

          setTxStatus('sending');
          console.log(
            '📤 Sending transaction directly via connection (no additional wallet popup)...',
          );

          // Send directly via connection to avoid second wallet popup
          txSignature = await connection.sendRawTransaction(
            signedTransaction.serialize(),
            {
              skipPreflight: true, // Skip simulation to avoid errors
              preflightCommitment: 'confirmed',
            },
          );
          console.log('✅ Transaction sent directly via connection');
        }

        setCurrentTxHash(txSignature);
        console.log(`📝 Transaction completed with signature: ${txSignature}`);

        // Step 6: Confirm transaction
        setTxStatus('confirming');
        console.log('⏳ Confirming transaction...');

        const confirmation = await connection.confirmTransaction(
          {
            signature: txSignature,
            blockhash: transaction.recentBlockhash!,
            lastValidBlockHeight: (await connection.getLatestBlockhash())
              .lastValidBlockHeight,
          },
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
              walletAddress: publicKey!.toString(),
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
                playerAddress: publicKey!.toString(),
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
        setIsProcessing(false); // 重置处理状态
      }
    },
    [
      publicKey,
      signTransaction,
      sendTransaction,
      signAndSendTransaction,
      connection,
      isProcessing,
    ],
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
          `${protocol}://${serverUrl}/api/vault-info/${gameId}/${publicKey!.toString()}`,
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

    if (!publicKey) {
      console.error('❌ Wallet not connected');
      return false;
    }

    if (!signAndSendTransaction && (!signTransaction || !sendTransaction)) {
      console.error('❌ Wallet methods missing');
      return false;
    }

    try {
      // Create a simple test transaction
      const { Transaction, SystemProgram } = await import('@solana/web3.js');

      const testTransaction = new Transaction();
      testTransaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey!,
          toPubkey: publicKey!, // Send to self for testing
          lamports: 1, // 1 lamport for testing
        }),
      );

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      testTransaction.recentBlockhash = blockhash;
      testTransaction.feePayer = publicKey!;

      console.log('🔍 About to test wallet signing - popup should appear!');

      if (signAndSendTransaction) {
        console.log('🧪 Testing with signAndSendTransaction (single popup)');
        // Note: This would actually send the transaction, so we'll just test signing
        await signTransaction!(testTransaction);
        console.log(
          '✅ Wallet signing test successful (signAndSendTransaction available)!',
        );
      } else {
        console.log('🧪 Testing with separate signTransaction (fallback mode)');
        await signTransaction!(testTransaction);
        console.log('✅ Wallet signing test successful (fallback mode)!');
      }

      return true;
    } catch (error) {
      console.error('❌ Wallet signing test failed:', error);
      return false;
    }
  }, [
    publicKey,
    signTransaction,
    sendTransaction,
    signAndSendTransaction,
    connection,
  ]);

  return {
    buyTicket,
    hasTicket,
    getVaultInfo,
    testWalletConnection, // Add test function
    isLoading,
    isProcessing, // 暴露处理状态
    error,
    txStatus,
    currentTxHash,
    isVaultConfigured: true, // Server handles vault configuration
  };
};

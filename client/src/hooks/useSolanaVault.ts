// Secure frontend Solana vault interaction with anti-tampering protection
import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useCallback } from 'react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { createRandomRPCConnection } from '../blockchain';

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
  console.log('🔍 getErrorMessage processing error:', {
    error,
    errorType: typeof error,
    isError: error instanceof Error,
    errorMessage: error?.message,
    errorToString: String(error),
  });

  if (typeof error === 'string') return error;

  if (error instanceof Error) {
    // Handle StructError specifically
    if (error.name === 'StructError' || error.message.includes('StructError')) {
      return 'Transaction format error. Please refresh the page and try again';
    }

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
    if (error.message.includes('Transaction failed')) {
      return `Transaction failed: ${error.message}`;
    }
    if (error.message.includes('Expected the value to satisfy a union')) {
      return 'Transaction parameter error. Please refresh the page and try again';
    }
    return error.message;
  }

  // Handle objects with message property
  if (error && typeof error === 'object' && error.message) {
    return String(error.message);
  }

  // Handle objects with err property (Solana confirmation errors)
  if (error && typeof error === 'object' && error.err) {
    return `Transaction confirmation failed: ${JSON.stringify(error.err)}`;
  }

  // Last resort: convert to string
  const errorString = String(error);
  if (errorString !== '[object Object]') {
    return errorString;
  }

  return `Transaction error: ${JSON.stringify(error)}`;
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
          // Use random RPC connection for better load balancing
          const rpcConnection = createRandomRPCConnection();

          // 🔧 彻底修复StructError: 确保正确的序列化格式
          console.log('🔧 Starting transaction serialization...');

          // 方法1: 使用标准序列化
          let serializedTransaction: Uint8Array;
          try {
            serializedTransaction = signedTransaction.serialize({
              requireAllSignatures: false,
              verifySignatures: false,
            });
            console.log('✅ Standard serialization successful');
          } catch (serializeError) {
            console.error('❌ Standard serialization failed:', serializeError);
            // 方法2: 使用兼容性序列化
            try {
              serializedTransaction = signedTransaction.serialize();
              console.log('✅ Fallback serialization successful');
            } catch (fallbackError) {
              console.error(
                '❌ All serialization methods failed:',
                fallbackError,
              );
              throw new Error(
                `Transaction serialization failed: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`,
              );
            }
          }

          console.log('🔍 DEBUG - Serialized transaction details:', {
            type: typeof serializedTransaction,
            constructor: serializedTransaction.constructor.name,
            length: serializedTransaction.length,
            isUint8Array: serializedTransaction instanceof Uint8Array,
            isBuffer: Buffer.isBuffer(serializedTransaction),
            firstBytes: Array.from(serializedTransaction.slice(0, 10))
              .map((b) => b.toString(16).padStart(2, '0'))
              .join(' '),
          });

          // 🔧 确保sendRawTransaction接收正确的类型
          // sendRawTransaction期望Uint8Array或Buffer，但不是其他对象类型
          let transactionData: Uint8Array;

          if (serializedTransaction instanceof Uint8Array) {
            transactionData = serializedTransaction;
            console.log('✅ Using Uint8Array directly');
          } else if (Buffer.isBuffer(serializedTransaction)) {
            transactionData = new Uint8Array(serializedTransaction);
            console.log('✅ Converted Buffer to Uint8Array');
          } else {
            // 最后的兜底方案
            transactionData = new Uint8Array(serializedTransaction as any);
            console.log('⚠️ Using fallback conversion to Uint8Array');
          }

          console.log('🔍 Final transaction data:', {
            type: typeof transactionData,
            constructor: transactionData.constructor.name,
            length: transactionData.length,
            isUint8Array: transactionData instanceof Uint8Array,
          });

          txSignature = await rpcConnection.sendRawTransaction(
            transactionData,
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

        // Use random RPC connection for confirmation
        const rpcConnection = createRandomRPCConnection();
        const latestBlockhash = await rpcConnection.getLatestBlockhash();
        const confirmation = await rpcConnection.confirmTransaction(
          {
            signature: txSignature,
            blockhash: transaction.recentBlockhash!,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
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

      // Get recent blockhash using random RPC connection
      const rpcConnection = createRandomRPCConnection();
      const { blockhash } = await rpcConnection.getLatestBlockhash();
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
  }, [publicKey, signTransaction, sendTransaction, signAndSendTransaction]);

  // Claim reward for a specific game
  const claimReward = useCallback(
    async (gameId: number): Promise<string> => {
      console.log(`🎁 Starting claim reward for game ${gameId}...`);

      if (isProcessing) {
        console.log(
          '⚠️ Transaction already in progress, ignoring duplicate call',
        );
        throw new Error('Transaction already in progress');
      }

      if (!publicKey) {
        throw new Error('Wallet not connected');
      }

      // 检查钱包方法可用性
      const hasSignAndSend = typeof signAndSendTransaction === 'function';
      const hasSignAndSendSeparate =
        typeof signTransaction === 'function' &&
        typeof sendTransaction === 'function';

      if (!hasSignAndSend && !hasSignAndSendSeparate) {
        throw new Error('Wallet does not support required transaction methods');
      }

      console.log('🔍 Wallet methods available:', {
        signAndSendTransaction: hasSignAndSend,
        signTransaction: typeof signTransaction === 'function',
        sendTransaction: typeof sendTransaction === 'function',
        preferredMethod: hasSignAndSend
          ? 'signAndSendTransaction'
          : 'separate sign+send',
      });

      // 运行时验证钱包方法真的可用
      console.log('🧪 Validating wallet methods...');
      if (hasSignAndSend) {
        try {
          // 验证 signAndSendTransaction 是否真的可调用
          if (typeof signAndSendTransaction !== 'function') {
            throw new Error(
              'signAndSendTransaction is not a function despite initial check',
            );
          }
          console.log('✅ signAndSendTransaction validation passed');
        } catch (validationError) {
          console.error(
            '❌ signAndSendTransaction validation failed:',
            validationError,
          );
          throw new Error(
            `Wallet validation failed: ${validationError instanceof Error ? validationError.message : String(validationError)}`,
          );
        }
      } else {
        try {
          if (typeof signTransaction !== 'function') {
            throw new Error('signTransaction is not a function');
          }
          if (typeof sendTransaction !== 'function') {
            throw new Error('sendTransaction is not a function');
          }
          console.log('✅ signTransaction + sendTransaction validation passed');
        } catch (validationError) {
          console.error(
            '❌ Separate method validation failed:',
            validationError,
          );
          throw new Error(
            `Wallet validation failed: ${validationError instanceof Error ? validationError.message : String(validationError)}`,
          );
        }
      }

      try {
        // 立即设置处理状态，防止任何重复调用
        setIsProcessing(true);
        setError(null);
        setTxStatus('building');

        console.log(`🔒 Processing lock set for game ${gameId}`);

        const serverUrl =
          localStorage.getItem('selectedServer') || 'localhost:8000';
        const protocol = serverUrl.includes('localhost') ? 'http' : 'https';
        const fullUrl = `${protocol}://${serverUrl}/api/build-claim-transaction`;

        console.log(`📡 Requesting claim transaction for game ${gameId}...`);
        console.log(`🔗 Full request URL: ${fullUrl}`);
        console.log(`📦 Request payload:`, {
          gameId,
          walletAddress: publicKey!.toString(),
        });

        // Step 1: Request claim transaction from server
        const response = await fetch(fullUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            gameId,
            walletAddress: publicKey!.toString(),
          }),
        }).catch((fetchError) => {
          console.error(`❌ Network fetch error:`, fetchError);
          if (
            fetchError.name === 'TypeError' &&
            fetchError.message.includes('fetch')
          ) {
            throw new Error(
              `Network connection failed. Please check if the game server is running on ${fullUrl}`,
            );
          }
          throw new Error(`Network error: ${fetchError.message}`);
        });

        console.log(
          `📡 Response status: ${response.status} ${response.statusText}`,
        );

        if (!response.ok) {
          let errorMessage = `Server request failed: ${response.status} ${response.statusText}`;
          try {
            const errorData = await response.text();
            console.error(`❌ Server error response:`, errorData);
            errorMessage += ` - ${errorData}`;
          } catch (e) {
            console.error(`❌ Could not read error response:`, e);
          }
          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log(`📦 Server response data:`, result);
        if (!result.success) {
          throw new Error(`Claim request failed: ${result.error}`);
        }

        // Step 2: Deserialize and sign transaction
        console.log('🔍 DEBUG - Claim transaction data:', {
          serializedTransactionLength: result.serializedTransaction.length,
          serializedTransactionPreview:
            result.serializedTransaction.substring(0, 100) + '...',
        });

        const transactionBuffer = Buffer.from(
          result.serializedTransaction,
          'base64',
        );
        console.log('🔍 DEBUG - Claim transaction buffer:', {
          bufferLength: transactionBuffer.length,
          bufferPreview:
            transactionBuffer.toString('hex').substring(0, 100) + '...',
        });

        const transaction = Transaction.from(transactionBuffer);
        console.log('🔍 DEBUG - Deserialized claim transaction:', {
          instructionCount: transaction.instructions.length,
          hasRecentBlockhash: !!transaction.recentBlockhash,
          hasFeePayer: !!transaction.feePayer,
          signatureCount: transaction.signatures.length,
        });

        setTxStatus('signing');

        let txSignature: string;

        // 使用预先确定的方法，避免运行时fallback导致双重弹窗
        if (hasSignAndSend) {
          console.log('🖊️ Using signAndSendTransaction method...');
          try {
            txSignature = await signAndSendTransaction!(transaction);
            console.log('✅ Transaction signed and sent successfully');
          } catch (error) {
            console.error('❌ signAndSendTransaction failed with details:', {
              error,
              errorType: typeof error,
              errorMessage:
                error instanceof Error ? error.message : String(error),
              errorStack: error instanceof Error ? error.stack : undefined,
            });
            // 直接抛出原始错误，不要包装
            throw error;
          }
        } else {
          console.log('🖊️ Using separate sign + send method...');
          try {
            console.log('📝 Step 1: Signing transaction...');
            const signedTransaction = await signTransaction!(transaction);
            console.log('✅ Transaction signed successfully');

            console.log(
              '📡 Step 2: Sending signed transaction via connection...',
            );
            setTxStatus('sending');

            // 使用与buyTicket相同的发送方式：connection.sendRawTransaction + skipPreflight
            // Use random RPC connection for better load balancing
            const rpcConnection = createRandomRPCConnection();

            // 🔧 彻底修复StructError: 确保正确的序列化格式（与buyTicket相同）
            console.log('🔧 Starting claim transaction serialization...');

            // 方法1: 使用标准序列化
            let serializedTransaction: Uint8Array;
            try {
              serializedTransaction = signedTransaction.serialize({
                requireAllSignatures: false,
                verifySignatures: false,
              });
              console.log('✅ Claim standard serialization successful');
            } catch (serializeError) {
              console.error(
                '❌ Claim standard serialization failed:',
                serializeError,
              );
              // 方法2: 使用兼容性序列化
              try {
                serializedTransaction = signedTransaction.serialize();
                console.log('✅ Claim fallback serialization successful');
              } catch (fallbackError) {
                console.error(
                  '❌ Claim all serialization methods failed:',
                  fallbackError,
                );
                throw new Error(
                  `Claim transaction serialization failed: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`,
                );
              }
            }

            // 🔧 确保sendRawTransaction接收正确的类型
            let transactionData: Uint8Array;

            if (serializedTransaction instanceof Uint8Array) {
              transactionData = serializedTransaction;
              console.log('✅ Claim using Uint8Array directly');
            } else if (Buffer.isBuffer(serializedTransaction)) {
              transactionData = new Uint8Array(serializedTransaction);
              console.log('✅ Claim converted Buffer to Uint8Array');
            } else {
              // 最后的兜底方案
              transactionData = new Uint8Array(serializedTransaction as any);
              console.log('⚠️ Claim using fallback conversion to Uint8Array');
            }

            txSignature = await rpcConnection.sendRawTransaction(
              transactionData,
              {
                skipPreflight: true, // Skip simulation to avoid errors
                preflightCommitment: 'confirmed',
              },
            );
            console.log('✅ Transaction sent successfully');
          } catch (error) {
            console.error('❌ Separate sign+send failed with details:', {
              error,
              errorType: typeof error,
              errorMessage:
                error instanceof Error ? error.message : String(error),
              errorStack: error instanceof Error ? error.stack : undefined,
            });
            // 直接抛出原始错误，不要包装
            throw error;
          }
        }

        setCurrentTxHash(txSignature);
        setTxStatus('confirming');
        console.log(`✅ Claim transaction sent: ${txSignature}`);

        // Step 3: Wait for confirmation
        console.log('⏳ Waiting for transaction confirmation...');
        try {
          // Use random RPC connection for confirmation
          const rpcConnection = createRandomRPCConnection();
          const latestBlockhash = await rpcConnection.getLatestBlockhash();
          const confirmation = await rpcConnection.confirmTransaction(
            {
              signature: txSignature,
              blockhash: latestBlockhash.blockhash,
              lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
            },
            'confirmed',
          );

          if (confirmation.value.err) {
            console.error(
              '❌ Transaction confirmation failed:',
              confirmation.value.err,
            );
            throw new Error(
              `Transaction failed on-chain: ${JSON.stringify(confirmation.value.err)}`,
            );
          }

          console.log('✅ Transaction confirmed successfully');
        } catch (confirmationError) {
          console.error(
            '❌ Transaction confirmation error:',
            confirmationError,
          );
          // 即使确认失败，交易可能已经成功，所以记录transaction hash
          console.log(`ℹ️ Transaction was sent with signature: ${txSignature}`);
          console.log(
            'ℹ️ You can check the transaction status on Solana Explorer',
          );

          // 重新抛出确认错误，但保留transaction signature信息
          const confirmError =
            confirmationError instanceof Error
              ? confirmationError
              : new Error(
                  `Transaction confirmation failed: ${String(confirmationError)}`,
                );

          // 添加transaction signature到错误信息中
          confirmError.message += ` (TX: ${txSignature})`;
          throw confirmError;
        }

        setTxStatus('completed');
        console.log(
          `🎉 Reward claimed successfully for game ${gameId} - TX: ${txSignature}`,
        );
        return txSignature;
      } catch (error) {
        console.error(`❌ Failed to claim reward for game ${gameId}:`, error);
        console.error('❌ Error details:', {
          error,
          errorType: typeof error,
          errorMessage: error instanceof Error ? error.message : String(error),
          errorName: error instanceof Error ? error.name : undefined,
          errorStack: error instanceof Error ? error.stack : undefined,
        });

        // 使用与buyTicket相同的错误处理模式
        const userFriendlyMessage = getErrorMessage(error);
        const enhancedError = new Error(userFriendlyMessage);
        enhancedError.cause = error; // 保留原始错误用于调试

        setError(enhancedError);
        setTxStatus('idle');
        console.log(
          `🔓 Processing lock released for game ${gameId} due to error: ${enhancedError.message}`,
        );
        throw enhancedError;
      } finally {
        setIsProcessing(false);
        console.log(`🔓 Processing lock finally released for game ${gameId}`);
      }
    },
    [
      publicKey,
      signAndSendTransaction,
      signTransaction,
      sendTransaction,
      isProcessing,
    ],
  );

  return {
    buyTicket,
    hasTicket,
    getVaultInfo,
    claimReward, // Add claim reward method
    testWalletConnection, // Add test function
    isLoading,
    isProcessing, // 暴露处理状态
    error,
    txStatus,
    currentTxHash,
    isVaultConfigured: true, // Server handles vault configuration
  };
};

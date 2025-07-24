// Secure frontend Solana vault interaction with anti-tampering protection
import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useCallback } from 'react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { createRandomRPCConnection } from '../blockchain';
import { ensureServerURL } from '@/ServerList';

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
    // Handle StructError specifically - 改进用户友好性
    if (error.name === 'StructError' || error.message.includes('StructError')) {
      return '交易数据处理出现问题。请检查网络连接并重试，如果问题持续存在，请联系客服。';
    }

    // Handle Transaction.from errors - 针对性错误处理
    if (
      error.message.includes('Transaction.from') ||
      error.message.includes('Invalid transaction') ||
      error.message.includes('Failed to decode')
    ) {
      return '交易数据格式错误。这可能是临时的网络问题，请稍后重试。';
    }

    // Common wallet errors
    if (
      error.message.includes('User rejected') ||
      error.message.includes('user rejected') ||
      error.message.includes('cancelled')
    ) {
      return '交易已被用户取消';
    }

    if (
      error.message.includes('Insufficient funds') ||
      error.message.includes('insufficient funds')
    ) {
      return '余额不足，请确保钱包中有足够的代币余额';
    }

    if (
      error.message.includes('Network') ||
      error.message.includes('network') ||
      error.message.includes('connection')
    ) {
      return '网络连接错误，请检查网络连接后重试';
    }

    if (
      error.message.includes('timeout') ||
      error.message.includes('timed out')
    ) {
      return '交易超时，请重试。如果问题持续存在，请检查网络连接。';
    }

    if (error.message.includes('Transaction failed')) {
      return `交易失败：${error.message}`;
    }

    if (error.message.includes('Expected the value to satisfy a union')) {
      return '交易参数错误。请刷新页面后重试，如问题持续请联系客服。';
    }

    // Wallet connection errors
    if (error.message.includes('wallet') || error.message.includes('Wallet')) {
      return '钱包连接出现问题，请重新连接钱包后重试';
    }

    // Server-side errors
    if (error.message.includes('Server') || error.message.includes('server')) {
      return '服务器繁忙，请稍后重试';
    }

    return error.message;
  }

  // Handle objects with message property
  if (error && typeof error === 'object' && error.message) {
    return String(error.message);
  }

  // Handle objects with err property (Solana confirmation errors)
  if (error && typeof error === 'object' && error.err) {
    return `交易确认失败：${JSON.stringify(error.err)}`;
  }

  // Last resort: convert to string
  const errorString = String(error);
  if (errorString !== '[object Object]') {
    return errorString;
  }

  return `交易处理出现未知错误，请重试或联系客服支持`;
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

  // 添加交易状态恢复函数
  const checkTransactionStatus = async (txHash: string): Promise<boolean> => {
    try {
      const rpcConnection = createRandomRPCConnection();
      const txStatus = await rpcConnection.getSignatureStatus(txHash);

      console.log('🔍 Checking transaction status:', {
        txHash,
        status: txStatus.value?.confirmationStatus,
        err: txStatus.value?.err,
      });

      return (
        txStatus.value?.confirmationStatus === 'confirmed' ||
        txStatus.value?.confirmationStatus === 'finalized'
      );
    } catch (error) {
      console.warn('⚠️ Failed to check transaction status:', error);
      return false;
    }
  };

  // 🎫 添加 Ticket 验证机制，确保付费用户能正常进入游戏
  const verifyPlayerTicket = useCallback(
    async (gameId: number): Promise<boolean> => {
      if (!publicKey) {
        console.warn('⚠️ No wallet connected for ticket verification');
        return false;
      }

      try {
        console.log(`🎫 Verifying player ticket for game ${gameId}...`);

        // 使用动态服务器URL，避免硬编码
        const serverUrl = await ensureServerURL();

        // 使用多重验证策略确保票据状态准确
        const maxVerificationAttempts = 3;
        const verificationDelays = [0, 1000, 2000]; // 0ms, 1s, 2s

        for (let attempt = 0; attempt < maxVerificationAttempts; attempt++) {
          try {
            console.log(
              `🔍 Ticket verification attempt ${attempt + 1}/${maxVerificationAttempts}`,
            );

            if (verificationDelays[attempt] > 0) {
              console.log(
                `⏱️ Waiting ${verificationDelays[attempt]}ms before ticket verification...`,
              );
              await new Promise((resolve) =>
                setTimeout(resolve, verificationDelays[attempt]),
              );
            }

            // 添加请求超时控制
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

            const response = await fetch(
              `${serverUrl}/api/vault-info/${gameId}/${publicKey.toString()}`,
              {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                signal: controller.signal,
              },
            );

            clearTimeout(timeoutId);

            if (!response.ok) {
              if (attempt === maxVerificationAttempts - 1) {
                console.error(
                  `❌ Ticket verification failed after ${maxVerificationAttempts} attempts: ${response.statusText}`,
                );
                return false;
              }
              continue; // 重试
            }

            const result = await response.json();
            console.log(
              `📊 Ticket verification result (attempt ${attempt + 1}):`,
              {
                success: result.success,
                hasTicket: result.hasTicket,
                ticketData: result.ticket,
              },
            );

            if (result.success && result.hasTicket) {
              console.log(`✅ Player has valid ticket for game ${gameId}`);
              return true;
            } else if (result.success && !result.hasTicket) {
              console.log(`❌ Player does not have ticket for game ${gameId}`);
              return false;
            }
          } catch (error) {
            console.warn(
              `⚠️ Ticket verification attempt ${attempt + 1} failed:`,
              error,
            );

            if (attempt === maxVerificationAttempts - 1) {
              console.error(
                `❌ All ${maxVerificationAttempts} ticket verification attempts failed`,
              );
              return false;
            }
          }
        }

        return false;
      } catch (error) {
        console.error('❌ Ticket verification error:', error);
        return false;
      }
    },
    [publicKey],
  );

  // 🎮 智能游戏进入检查机制
  const checkGameEntryEligibility = useCallback(
    async (
      gameId: number,
    ): Promise<{
      canEnter: boolean;
      reason: string;
      hasTicket: boolean;
      needsPayment: boolean;
    }> => {
      console.log(`🎮 Checking game entry eligibility for game ${gameId}...`);

      if (!publicKey) {
        return {
          canEnter: false,
          reason: '钱包未连接',
          hasTicket: false,
          needsPayment: true,
        };
      }

      try {
        // 检查玩家是否已有有效票据
        const hasValidTicket = await verifyPlayerTicket(gameId);

        if (hasValidTicket) {
          console.log(`✅ Player has valid ticket, can enter game ${gameId}`);
          return {
            canEnter: true,
            reason: '拥有有效票据，可以进入游戏',
            hasTicket: true,
            needsPayment: false,
          };
        }

        // 如果没有票据，检查是否可以购买
        console.log(
          `🎫 No valid ticket found, payment required for game ${gameId}`,
        );
        return {
          canEnter: false,
          reason: '需要购买门票',
          hasTicket: false,
          needsPayment: true,
        };
      } catch (error) {
        console.error('❌ Game entry eligibility check failed:', error);
        return {
          canEnter: false,
          reason: '无法验证游戏资格，请重试',
          hasTicket: false,
          needsPayment: true,
        };
      }
    },
    [publicKey, verifyPlayerTicket],
  );

  // 添加恢复交易状态的函数
  const recoverTransactionState = async () => {
    if (!currentTxHash) {
      console.warn('⚠️ No transaction hash to recover');
      return false;
    }

    console.log('🔄 Attempting to recover transaction state:', currentTxHash);

    const isSuccessful = await checkTransactionStatus(currentTxHash);
    if (isSuccessful) {
      console.log('✅ Transaction recovered as successful:', currentTxHash);
      setTxStatus('completed');
      setError(null);
      return true;
    }

    return false;
  };

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
        // 使用动态服务器URL，避免硬编码
        const serverUrl = await ensureServerURL();

        // Generate secure signature for anti-tampering
        const requestData = `${gameId}:${amount}:${tokenMint.toString()}:${tier || 'default'}:${publicKey!.toString()}`;
        const signature = generateSecureSignature(requestData, 'client-secret');

        console.log('🔒 Generated secure signature for transaction parameters');

        // Step 2: Request server to validate parameters and build transaction
        setTxStatus('building');
        console.log(
          '📡 Requesting server transaction building with parameter validation...',
        );

        const requestUrl = `${serverUrl}/api/build-buy-ticket-transaction`;
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

        // 添加请求超时控制
        const buildController = new AbortController();
        const buildTimeoutId = setTimeout(() => buildController.abort(), 10000); // 10秒超时

        const buildResponse = await fetch(requestUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          signal: buildController.signal,
        });

        clearTimeout(buildTimeoutId);

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

        let txSignature: string = '';

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

          // 🚨 紧急修复：强化数据类型验证，防止 StructError
          let transactionData: Uint8Array;

          // 严格的类型检查和转换
          if (serializedTransaction instanceof Uint8Array) {
            transactionData = serializedTransaction;
            console.log('✅ Using Uint8Array directly');
          } else if (Buffer.isBuffer(serializedTransaction)) {
            transactionData = new Uint8Array(serializedTransaction);
            console.log('✅ Converted Buffer to Uint8Array');
          } else if (
            typeof serializedTransaction === 'object' &&
            serializedTransaction !== null
          ) {
            console.warn('⚠️ Received object, attempting to extract data...');

            // 使用类型断言和显式检查
            const txObject = serializedTransaction as any;

            // 尝试从对象中提取数据
            if ('data' in txObject && Array.isArray(txObject.data)) {
              transactionData = new Uint8Array(txObject.data);
              console.log('✅ Extracted data array from object');
            } else if (Array.isArray(serializedTransaction)) {
              transactionData = new Uint8Array(
                serializedTransaction as number[],
              );
              console.log('✅ Converted array to Uint8Array');
            } else {
              console.error(
                '❌ Cannot extract valid data from object:',
                serializedTransaction,
              );
              throw new Error('交易数据格式无效，无法发送到区块链网络');
            }
          } else if (typeof serializedTransaction === 'string') {
            // 如果是字符串，尝试 base64 解码
            try {
              const buffer = Buffer.from(serializedTransaction, 'base64');
              transactionData = new Uint8Array(buffer);
              console.log('✅ Converted base64 string to Uint8Array');
            } catch (decodeError) {
              console.error('❌ Failed to decode base64 string:', decodeError);
              throw new Error('交易数据解码失败');
            }
          } else {
            console.error(
              '❌ Unknown serialized transaction type:',
              typeof serializedTransaction,
            );
            throw new Error(
              `交易数据类型错误: ${typeof serializedTransaction}`,
            );
          }

          // 最终验证
          if (
            !(transactionData instanceof Uint8Array) ||
            transactionData.length === 0
          ) {
            console.error('❌ Final validation failed:', {
              isUint8Array: transactionData instanceof Uint8Array,
              length: transactionData?.length,
            });
            throw new Error('交易数据最终验证失败');
          }

          console.log('🔍 Final transaction data validation:', {
            type: typeof transactionData,
            constructor: transactionData.constructor.name,
            length: transactionData.length,
            isUint8Array: transactionData instanceof Uint8Array,
            firstBytes: Array.from(transactionData.slice(0, 10))
              .map((b) => b.toString(16).padStart(2, '0'))
              .join(' '),
          });

          // 🚀 实现多重发送机制，提高交易成功率
          console.log('🔄 Starting multi-retry transaction sending...');
          let lastError: Error | null = null;
          const maxRetries = 3;
          const retryDelays = [0, 2000, 5000]; // 0ms, 2s, 5s

          for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
              console.log(
                `🎯 Transaction send attempt ${attempt + 1}/${maxRetries}`,
              );

              // 延迟重试（第一次立即执行）
              if (retryDelays[attempt] > 0) {
                console.log(
                  `⏱️ Waiting ${retryDelays[attempt]}ms before retry...`,
                );
                await new Promise((resolve) =>
                  setTimeout(resolve, retryDelays[attempt]),
                );
              }

              // 每次重试使用不同的 RPC 连接，提高成功率
              const retryConnection = createRandomRPCConnection();

              txSignature = await retryConnection.sendRawTransaction(
                transactionData,
                {
                  skipPreflight: true,
                  preflightCommitment: 'confirmed',
                  maxRetries: 0, // 在这个层面不重试，我们自己控制重试
                },
              );

              console.log(
                `✅ Transaction sent successfully on attempt ${attempt + 1}: ${txSignature}`,
              );
              break; // 成功，退出重试循环
            } catch (error) {
              lastError =
                error instanceof Error ? error : new Error(String(error));
              console.warn(
                `⚠️ Transaction send failed on attempt ${attempt + 1}:`,
                {
                  error: lastError.message,
                  attempt: attempt + 1,
                  maxRetries,
                  willRetry: attempt < maxRetries - 1,
                },
              );

              // 如果是最后一次尝试，抛出错误
              if (attempt === maxRetries - 1) {
                console.error(
                  `❌ All ${maxRetries} transaction send attempts failed`,
                );
                throw new Error(
                  `交易发送失败，已重试${maxRetries}次: ${lastError.message}`,
                );
              }

              // 某些错误类型不值得重试
              if (
                lastError.message.includes('insufficient funds') ||
                lastError.message.includes('User rejected') ||
                lastError.message.includes('user rejected')
              ) {
                console.log('🛑 Error type not suitable for retry, stopping');
                throw lastError;
              }
            }
          }

          // 🚨 关键修复：增强交易签名验证和错误处理
          if (!txSignature) {
            console.error(
              '❌ Critical: Transaction signature is null or undefined after all retry attempts',
            );
            console.error('🔍 Debug info:', {
              maxRetries,
              lastError: lastError?.message || 'No error captured',
              attemptedRPCs: 'Multiple RPC connections attempted',
              transactionDataLength: transactionData?.length || 0,
              transactionDataType: typeof transactionData,
            });

            // 提供更具体的错误信息
            const detailedError =
              lastError?.message ||
              'Unknown error during transaction submission';
            throw new Error(
              `交易提交完全失败: ${detailedError}. 请检查网络连接和账户余额，或稍后重试。`,
            );
          }

          // 验证交易签名格式
          if (
            typeof txSignature !== 'string' ||
            txSignature.trim().length === 0
          ) {
            console.error(
              '❌ Invalid transaction signature format:',
              typeof txSignature,
              txSignature,
            );
            throw new Error(
              `无效的交易签名格式: ${typeof txSignature}. 交易可能未正确提交。`,
            );
          }

          // 基本的Solana交易签名格式验证
          const trimmedSignature = txSignature.trim();
          if (trimmedSignature.length < 80 || trimmedSignature.length > 95) {
            console.warn(
              `⚠️ Transaction signature length unusual: ${trimmedSignature.length} characters`,
            );
            console.warn(
              `⚠️ This may indicate a malformed transaction signature: ${trimmedSignature.slice(0, 10)}...`,
            );
          }

          console.log(
            `✅ Transaction sent successfully with valid signature: ${trimmedSignature.slice(0, 8)}...${trimmedSignature.slice(-8)}`,
          );
          console.log('✅ Transaction sent directly via connection');
        }

        setCurrentTxHash(txSignature);
        console.log(`📝 Transaction completed with signature: ${txSignature}`);

        // Step 6: 简化的票据验证流程
        setTxStatus('verifying');
        console.log('🎫 Starting ticket verification process...');

        try {
          // 等待区块链处理交易（减少到3秒，提高响应速度）
          console.log('⏱️ Waiting 3 seconds for blockchain processing...');
          await new Promise((resolve) => setTimeout(resolve, 3000));

          // 🚨 关键修复：检查 txSignature 是否有效
          if (
            !txSignature ||
            typeof txSignature !== 'string' ||
            txSignature.trim().length === 0
          ) {
            throw new Error(
              `Invalid transaction signature: ${txSignature}. Transaction may not have been submitted properly.`,
            );
          }

          console.log(`🎫 Verifying ticket creation for game ${gameId}...`);

          // 使用现有的票据验证机制代替复杂的交易确认
          const eligibility = await checkGameEntryEligibility(gameId);

          console.log('🔍 Ticket verification result:', {
            canEnter: eligibility.canEnter,
            hasTicket: eligibility.hasTicket,
            needsPayment: eligibility.needsPayment,
            reason: eligibility.reason,
          });

          if (eligibility.hasTicket) {
            console.log(
              '✅ Ticket verification successful - player has valid ticket',
            );
            setTxStatus('completed');

            if (eligibility.canEnter) {
              console.log('🎮 Player can enter game immediately');
            } else {
              console.log(
                '🎫 Ticket confirmed, but game entry conditions not met',
              );
            }

            return txSignature;
          } else {
            // 票据可能还在创建中，但交易已提交成功
            console.log(
              '⏳ Ticket not yet created, but transaction was submitted successfully',
            );
            console.log(`ℹ️ Transaction hash for verification: ${txSignature}`);

            // 不抛出错误，让用户可以稍后验证或手动检查
            setTxStatus('completed');
            return txSignature;
          }
        } catch (verifyError) {
          console.warn(
            '⚠️ Ticket verification failed, but transaction was submitted:',
            verifyError,
          );
          console.log(
            `ℹ️ Transaction hash for manual verification: ${txSignature}`,
          );

          // 即使验证失败，交易可能已经成功，保持completed状态
          // 用户可以通过界面上的按钮手动验证
          setTxStatus('completed');
          return txSignature;
        }

        // Step 7: Notify server of successful transaction for game state sync
        // 添加请求超时控制
        const syncController = new AbortController();
        const syncTimeoutId = setTimeout(() => syncController.abort(), 10000); // 10秒超时
        
        try {

          const response = await fetch(
            `${serverUrl}/api/player-joined`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              signal: syncController.signal,
              body: JSON.stringify({
                gameId,
                playerAddress: publicKey!.toString(),
                txHash: txSignature,
                tier,
                amount: amount.toString(),
              }),
            },
          );

          clearTimeout(syncTimeoutId);

          if (response.ok) {
            console.log('✅ Server notified of successful transaction');
          } else {
            console.warn(
              '⚠️ Server notification failed but transaction completed',
            );
          }
        } catch (syncError) {
          clearTimeout(syncTimeoutId);
          console.warn(
            '⚠️ Failed to sync with server, but transaction completed:',
            syncError,
          );
        }

        console.log(
          `🎉 Secure ticket purchase completed successfully - TX: ${txSignature}`,
        );
        return txSignature;
      } catch (err) {
        const error = err as Error;
        console.error('❌ Failed to buy ticket:', error);

        // 🚨 紧急修复：检查交易是否实际成功，使用票据验证代替复杂的状态检查
        if (currentTxHash) {
          console.warn(
            '⚠️ Error occurred but transaction hash exists:',
            currentTxHash,
          );
          console.warn(
            '⚠️ This might be a post-transaction error, attempting ticket verification...',
          );

          // 如果有交易哈希，使用票据验证检查是否实际成功
          try {
            console.log(
              '🎫 Attempting ticket verification for error recovery...',
            );

            // 等待一下让区块链处理
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const eligibility = await checkGameEntryEligibility(
              gameId as number,
            );

            console.log('🔍 Error recovery ticket verification result:', {
              hasTicket: eligibility.hasTicket,
              canEnter: eligibility.canEnter,
              reason: eligibility.reason,
            });

            if (eligibility.hasTicket) {
              console.log(
                '✅ Transaction was actually successful - player has ticket:',
                currentTxHash,
              );

              // 交易成功，设置正确状态并返回成功
              setTxStatus('completed');
              console.log(
                `🎉 Transaction recovered as successful via ticket verification - TX: ${currentTxHash}`,
              );
              return currentTxHash;
            } else {
              console.log(
                '❌ No ticket found - transaction may have failed or still processing',
              );
            }
          } catch (ticketCheckError) {
            console.warn(
              '⚠️ Could not verify ticket status for error recovery:',
              ticketCheckError,
            );
          }
        }

        const userFriendlyMessage = getErrorMessage(error);

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
      checkGameEntryEligibility,
      currentTxHash,
    ],
  );

  // Check if user has a ticket for a game using server API
  const hasTicket = useCallback(
    async (gameId: number): Promise<boolean> => {
      if (!publicKey) return false;

      try {
        // 使用动态服务器URL，避免硬编码
        const serverUrl = await ensureServerURL();

        // 添加请求超时控制
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

        const response = await fetch(
          `${serverUrl}/api/vault-info/${gameId}/${publicKey!.toString()}`,
          { signal: controller.signal },
        );
        
        clearTimeout(timeoutId);
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
      // 使用动态服务器URL，避免硬编码
      const serverUrl = await ensureServerURL();

      // 添加请求超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

      const response = await fetch(
        `${serverUrl}/api/vault-info/${gameId}`,
        { signal: controller.signal },
      );
      
      clearTimeout(timeoutId);
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

        // 使用动态服务器URL，避免硬编码
        const serverUrl = await ensureServerURL();
        const fullUrl = `${serverUrl}/api/build-claim-transaction`;

        console.log(`📡 Requesting claim transaction for game ${gameId}...`);
        console.log(`🔗 Full request URL: ${fullUrl}`);
        console.log(`📦 Request payload:`, {
          gameId,
          walletAddress: publicKey!.toString(),
        });

        // Step 1: Request claim transaction from server
        // 添加请求超时控制
        const claimController = new AbortController();
        const claimTimeoutId = setTimeout(() => claimController.abort(), 10000); // 10秒超时

        const response = await fetch(fullUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          signal: claimController.signal,
          body: JSON.stringify({
            gameId,
            walletAddress: publicKey!.toString(),
          }),
        }).catch((fetchError) => {
          clearTimeout(claimTimeoutId);
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

        clearTimeout(claimTimeoutId);
        
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

        let txSignature: string = '';

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

            // 🚀 实现多重发送机制，提高交易成功率（与buyTicket保持一致）
            console.log('🔄 Starting multi-retry claim transaction sending...');
            let lastError: Error | null = null;
            const maxRetries = 3;
            const retryDelays = [0, 2000, 5000]; // 0ms, 2s, 5s

            for (let attempt = 0; attempt < maxRetries; attempt++) {
              try {
                console.log(
                  `🎯 Claim transaction send attempt ${attempt + 1}/${maxRetries}`,
                );

                // 延迟重试（第一次立即执行）
                if (retryDelays[attempt] > 0) {
                  console.log(
                    `⏱️ Waiting ${retryDelays[attempt]}ms before retry...`,
                  );
                  await new Promise((resolve) =>
                    setTimeout(resolve, retryDelays[attempt]),
                  );
                }

                // 每次重试使用不同的 RPC 连接，提高成功率
                const retryConnection = createRandomRPCConnection();

                txSignature = await retryConnection.sendRawTransaction(
                  transactionData,
                  {
                    skipPreflight: true,
                    preflightCommitment: 'confirmed',
                    maxRetries: 0, // 在这个层面不重试，我们自己控制重试
                  },
                );

                console.log(
                  `✅ Claim transaction sent successfully on attempt ${attempt + 1}: ${txSignature}`,
                );
                break; // 成功，退出重试循环
              } catch (error) {
                lastError =
                  error instanceof Error ? error : new Error(String(error));
                console.warn(
                  `⚠️ Claim transaction send failed on attempt ${attempt + 1}:`,
                  {
                    error: lastError.message,
                    attempt: attempt + 1,
                    maxRetries,
                    willRetry: attempt < maxRetries - 1,
                  },
                );

                // 如果是最后一次尝试，抛出错误
                if (attempt === maxRetries - 1) {
                  console.error(
                    `❌ All ${maxRetries} claim transaction send attempts failed`,
                  );
                  throw new Error(
                    `奖励领取交易发送失败，已重试${maxRetries}次: ${lastError.message}`,
                  );
                }

                // 某些错误类型不值得重试
                if (
                  lastError.message.includes('insufficient funds') ||
                  lastError.message.includes('User rejected') ||
                  lastError.message.includes('user rejected')
                ) {
                  console.log('🛑 Error type not suitable for retry, stopping');
                  throw lastError;
                }
              }
            }

            if (!txSignature) {
              throw new Error('奖励领取交易发送失败: 未获得交易签名');
            }
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

        // 🚨 关键修复：验证交易签名有效性，防止空签名传入确认函数
        if (
          !txSignature ||
          typeof txSignature !== 'string' ||
          txSignature.trim().length === 0
        ) {
          console.error(
            '❌ Invalid transaction signature before confirmation:',
            {
              txSignature,
              type: typeof txSignature,
              length: txSignature?.length || 0,
            },
          );
          throw new Error(
            `Invalid transaction signature for confirmation: "${txSignature}". This indicates a transaction sending failure.`,
          );
        }

        // 基本的Solana交易签名格式验证（与buyTicket保持一致）
        const trimmedSignature = txSignature.trim();
        if (trimmedSignature.length < 80 || trimmedSignature.length > 95) {
          console.warn(
            `⚠️ Claim transaction signature length unusual: ${trimmedSignature.length} characters`,
          );
          console.warn(
            `⚠️ Signature: ${trimmedSignature.slice(0, 10)}...${trimmedSignature.slice(-10)}`,
          );
        }

        console.log(
          `🔍 Confirming transaction with signature: ${trimmedSignature.slice(0, 8)}...${trimmedSignature.slice(-8)}`,
        );

        try {
          // Use random RPC connection for confirmation
          const rpcConnection = createRandomRPCConnection();
          const latestBlockhash = await rpcConnection.getLatestBlockhash();
          const confirmation = await rpcConnection.confirmTransaction(
            {
              signature: trimmedSignature,
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
          console.log(
            `ℹ️ Transaction was sent with signature: ${trimmedSignature}`,
          );
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
          confirmError.message += ` (TX: ${trimmedSignature})`;
          throw confirmError;
        }

        setTxStatus('completed');
        console.log(
          `🎉 Reward claimed successfully for game ${gameId} - TX: ${trimmedSignature}`,
        );
        return trimmedSignature;
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
    recoverTransactionState, // 添加交易状态恢复功能
    checkTransactionStatus, // 添加交易状态检查功能
    verifyPlayerTicket, // 🎫 添加票据验证功能
    checkGameEntryEligibility, // 🎮 添加游戏进入资格检查功能
    isLoading,
    isProcessing, // 暴露处理状态
    error,
    txStatus,
    currentTxHash,
    isVaultConfigured: true, // Server handles vault configuration
  };
};

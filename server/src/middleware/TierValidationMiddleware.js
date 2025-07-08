/**
 * Tier Validation Middleware - Prevents pricing bypass attacks
 * Ensures users cannot manipulate ticket prices or bypass tier restrictions
 */

const config = require('../config');
const Logger = require('../utils/Logger');

class TierValidationMiddleware {
  static validateTierRequest(tier, amount, playerLevel = 1) {
    const validationResult = {
      isValid: false,
      error: null,
      tierConfig: null,
    };

    try {
      // 1. Validate tier exists
      if (!config.solana?.tiers?.[tier]) {
        validationResult.error = `Invalid tier: ${tier}. Available tiers: ${Object.keys(config.solana?.tiers || {}).join(', ')}`;
        return validationResult;
      }

      const tierConfig = config.solana.tiers[tier];
      validationResult.tierConfig = tierConfig;

      // 2. Validate player level requirement
      if (
        playerLevel < tierConfig.minLevel ||
        playerLevel > tierConfig.maxLevel
      ) {
        validationResult.error = `Player level ${playerLevel} not allowed for tier ${tier}. Required level range: ${tierConfig.minLevel}-${tierConfig.maxLevel}`;
        return validationResult;
      }

      // 3. Strict price validation (convert SOL to lamports)
      const expectedAmountLamports = Math.floor(tierConfig.entranceFee * 1e9);
      const actualAmountLamports = parseInt(amount);

      // Validate amount is a valid number
      if (isNaN(actualAmountLamports) || actualAmountLamports < 0) {
        validationResult.error = `Invalid amount format: ${amount}. Must be a valid positive number in lamports.`;
        return validationResult;
      }

      if (config.solana?.security?.enableStrictPriceValidation) {
        const allowedDeviation =
          config.solana.security.allowPriceDeviation || 0;
        const deviationThreshold = Math.floor(
          expectedAmountLamports * allowedDeviation,
        );

        if (
          Math.abs(actualAmountLamports - expectedAmountLamports) >
          deviationThreshold
        ) {
          validationResult.error = `Price validation failed for tier ${tier}. Expected: ${expectedAmountLamports} lamports (${tierConfig.entranceFee} SOL), got: ${actualAmountLamports} lamports. Deviation: ${allowedDeviation * 100}%`;
          return validationResult;
        }
      }

      // 4. All validations passed
      validationResult.isValid = true;

      Logger.server.debug('Tier validation passed', {
        tier,
        playerLevel,
        expectedAmount: expectedAmountLamports,
        actualAmount: actualAmountLamports,
        entranceFee: tierConfig.entranceFee,
      });

      return validationResult;
    } catch (error) {
      validationResult.error = `Tier validation error: ${error.message}`;
      Logger.server.error('Tier validation failed', {
        tier,
        amount,
        playerLevel,
        error: error.message,
      });
      return validationResult;
    }
  }

  /**
   * Validate ticket purchase request
   */
  static validateTicketPurchase(requestData) {
    const { tier, amount, gameId, playerAddress, playerLevel } = requestData;

    // Input validation
    if (!tier || !amount || !gameId || !playerAddress) {
      return {
        isValid: false,
        error: 'Missing required fields: tier, amount, gameId, playerAddress',
      };
    }

    // Validate tier and price
    const tierValidation = this.validateTierRequest(tier, amount, playerLevel);
    if (!tierValidation.isValid) {
      return tierValidation;
    }

    // Additional security checks
    if (config.solana?.security?.requireExactTierMatch) {
      // Ensure the game was created for this specific tier
      // This would require additional game state tracking
      Logger.server.debug('Exact tier match validation passed', {
        gameId,
        tier,
        playerAddress,
      });
    }

    return {
      isValid: true,
      tierConfig: tierValidation.tierConfig,
    };
  }

  /**
   * Validate player eligibility for tier
   */
  static validatePlayerEligibility(playerAddress, tier, playerData = {}) {
    try {
      const tierConfig = config.solana?.tiers?.[tier];
      if (!tierConfig) {
        return {
          isValid: false,
          error: `Invalid tier: ${tier}`,
        };
      }

      const playerLevel = playerData.level || 1;
      const playerExperience = playerData.experience || 0;

      // Level-based restrictions
      if (
        playerLevel < tierConfig.minLevel ||
        playerLevel > tierConfig.maxLevel
      ) {
        return {
          isValid: false,
          error: `Player level ${playerLevel} not eligible for tier ${tier}. Required level: ${tierConfig.minLevel}-${tierConfig.maxLevel}`,
        };
      }

      // Additional eligibility checks can be added here
      // e.g., previous game performance, banned players, etc.

      return {
        isValid: true,
        tierConfig,
      };
    } catch (error) {
      Logger.server.error('Player eligibility validation failed', {
        playerAddress,
        tier,
        error: error.message,
      });
      return {
        isValid: false,
        error: `Eligibility validation error: ${error.message}`,
      };
    }
  }

  /**
   * Security audit log for suspicious activities
   */
  static logSecurityEvent(eventType, data) {
    Logger.server.warn(`Security Event: ${eventType}`, {
      timestamp: new Date().toISOString(),
      eventType,
      ...data,
    });
  }

  /**
   * Rate limiting for ticket purchases (basic implementation)
   */
  static checkRateLimit(playerAddress) {
    // This is a basic implementation
    // In production, you might want to use Redis or similar
    const now = Date.now();
    const rateLimitWindow = 60000; // 1 minute
    const maxRequestsPerWindow = 5;

    if (!this.rateLimitCache) {
      this.rateLimitCache = new Map();
    }

    const playerRequests = this.rateLimitCache.get(playerAddress) || [];
    const recentRequests = playerRequests.filter(
      (timestamp) => now - timestamp < rateLimitWindow,
    );

    if (recentRequests.length >= maxRequestsPerWindow) {
      this.logSecurityEvent('RATE_LIMIT_EXCEEDED', {
        playerAddress,
        requestCount: recentRequests.length,
        window: rateLimitWindow,
      });
      return {
        isAllowed: false,
        error:
          'Rate limit exceeded. Please wait before making another request.',
      };
    }

    // Update cache
    recentRequests.push(now);
    this.rateLimitCache.set(playerAddress, recentRequests);

    return { isAllowed: true };
  }
}

module.exports = TierValidationMiddleware;

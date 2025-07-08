/**
 * Security Test Suite for Tier-based Pricing System
 * Tests various attack vectors and ensures pricing security
 */

const TierValidationMiddleware = require('../middleware/TierValidationMiddleware');

// Mock config for testing
const mockConfig = {
  solana: {
    tiers: {
      low: {
        name: 'Low Tier Arena',
        entranceFee: 0.01,
        killReward: 0.001,
        minLevel: 1,
        maxLevel: 10,
      },
      medium: {
        name: 'Medium Tier Arena',
        entranceFee: 0.05,
        killReward: 0.005,
        minLevel: 11,
        maxLevel: 25,
      },
      high: {
        name: 'High Tier Arena',
        entranceFee: 0.1,
        killReward: 0.01,
        minLevel: 26,
        maxLevel: 999,
      },
    },
    security: {
      enableStrictPriceValidation: true,
      allowPriceDeviation: 0,
      requireExactTierMatch: true,
    },
  },
};

// Temporarily override config for testing
const originalConfig = require('../config');
Object.assign(originalConfig, mockConfig);

class SecurityTestSuite {
  static runAllTests() {
    console.log('🧪 Running Security Test Suite for Tier-based Pricing System');
    console.log('='.repeat(60));

    const tests = [
      this.testValidTicketPurchases,
      this.testPriceManipulationAttacks,
      this.testTierBypassAttacks,
      this.testLevelRestrictionEnforcement,
      this.testRateLimiting,
      this.testInputValidation,
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
      try {
        test.call(this);
        console.log(`✅ ${test.name} - PASSED`);
        passed++;
      } catch (error) {
        console.log(`❌ ${test.name} - FAILED: ${error.message}`);
        failed++;
      }
    }

    console.log('='.repeat(60));
    console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);

    if (failed === 0) {
      console.log('🎉 All security tests passed! The system is secure.');
    } else {
      console.log(
        '⚠️ Some security tests failed. Please review the implementation.',
      );
    }

    return { passed, failed };
  }

  // Test 1: Valid ticket purchases should work
  static testValidTicketPurchases() {
    // Low tier
    const lowTierResult = TierValidationMiddleware.validateTicketPurchase({
      tier: 'low',
      amount: '10000000', // 0.01 SOL in lamports
      gameId: 1,
      playerAddress: 'test123',
      playerLevel: 5,
    });

    if (!lowTierResult.isValid) {
      throw new Error(`Low tier validation failed: ${lowTierResult.error}`);
    }

    // Medium tier
    const mediumTierResult = TierValidationMiddleware.validateTicketPurchase({
      tier: 'medium',
      amount: '50000000', // 0.05 SOL in lamports
      gameId: 1,
      playerAddress: 'test123',
      playerLevel: 15,
    });

    if (!mediumTierResult.isValid) {
      throw new Error(
        `Medium tier validation failed: ${mediumTierResult.error}`,
      );
    }

    // High tier
    const highTierResult = TierValidationMiddleware.validateTicketPurchase({
      tier: 'high',
      amount: '100000000', // 0.1 SOL in lamports
      gameId: 1,
      playerAddress: 'test123',
      playerLevel: 30,
    });

    if (!highTierResult.isValid) {
      throw new Error(`High tier validation failed: ${highTierResult.error}`);
    }
  }

  // Test 2: Price manipulation attacks should be blocked
  static testPriceManipulationAttacks() {
    // Attack 1: Too low payment
    const lowPaymentResult = TierValidationMiddleware.validateTicketPurchase({
      tier: 'high',
      amount: '10000000', // 0.01 SOL instead of 0.1 SOL
      gameId: 1,
      playerAddress: 'attacker1',
      playerLevel: 30,
    });

    if (lowPaymentResult.isValid) {
      throw new Error('Low payment attack was not blocked!');
    }

    // Attack 2: Zero payment
    const zeroPaymentResult = TierValidationMiddleware.validateTicketPurchase({
      tier: 'low',
      amount: '0',
      gameId: 1,
      playerAddress: 'attacker2',
      playerLevel: 5,
    });

    if (zeroPaymentResult.isValid) {
      throw new Error('Zero payment attack was not blocked!');
    }

    // Attack 3: Negative payment
    const negativePaymentResult =
      TierValidationMiddleware.validateTicketPurchase({
        tier: 'medium',
        amount: '-1000000',
        gameId: 1,
        playerAddress: 'attacker3',
        playerLevel: 15,
      });

    if (negativePaymentResult.isValid) {
      throw new Error('Negative payment attack was not blocked!');
    }
  }

  // Test 3: Tier bypass attacks should be blocked
  static testTierBypassAttacks() {
    // Attack 1: Pay low tier price for high tier
    const tierBypassResult = TierValidationMiddleware.validateTicketPurchase({
      tier: 'high',
      amount: '10000000', // Low tier price for high tier
      gameId: 1,
      playerAddress: 'attacker4',
      playerLevel: 30,
    });

    if (tierBypassResult.isValid) {
      throw new Error('Tier bypass attack was not blocked!');
    }

    // Attack 2: Invalid tier name
    const invalidTierResult = TierValidationMiddleware.validateTicketPurchase({
      tier: 'free',
      amount: '0',
      gameId: 1,
      playerAddress: 'attacker5',
      playerLevel: 1,
    });

    if (invalidTierResult.isValid) {
      throw new Error('Invalid tier attack was not blocked!');
    }
  }

  // Test 4: Level restriction enforcement
  static testLevelRestrictionEnforcement() {
    // Attack 1: Low level player trying high tier
    const lowLevelHighTierResult =
      TierValidationMiddleware.validateTicketPurchase({
        tier: 'high',
        amount: '100000000',
        gameId: 1,
        playerAddress: 'lowlevelplayer',
        playerLevel: 5, // Too low for high tier (requires 26+)
      });

    if (lowLevelHighTierResult.isValid) {
      throw new Error('Low level player was allowed in high tier!');
    }

    // Attack 2: High level player trying low tier (should work)
    const highLevelLowTierResult =
      TierValidationMiddleware.validateTicketPurchase({
        tier: 'low',
        amount: '10000000',
        gameId: 1,
        playerAddress: 'highlevelplayer',
        playerLevel: 50, // Too high for low tier (max 10)
      });

    if (highLevelLowTierResult.isValid) {
      throw new Error('High level player was allowed in low tier!');
    }
  }

  // Test 5: Rate limiting
  static testRateLimiting() {
    const playerAddress = 'ratelimitplayer';

    // Should allow first 5 requests
    for (let i = 0; i < 5; i++) {
      const rateLimitResult =
        TierValidationMiddleware.checkRateLimit(playerAddress);
      if (!rateLimitResult.isAllowed) {
        throw new Error(`Request ${i + 1} was blocked but should be allowed`);
      }
    }

    // 6th request should be blocked
    const blockedResult =
      TierValidationMiddleware.checkRateLimit(playerAddress);
    if (blockedResult.isAllowed) {
      throw new Error('Rate limit was not enforced!');
    }
  }

  // Test 6: Input validation
  static testInputValidation() {
    // Missing fields
    const missingFieldsResult = TierValidationMiddleware.validateTicketPurchase(
      {
        tier: 'low',
        // missing amount, gameId, playerAddress
      },
    );

    if (missingFieldsResult.isValid) {
      throw new Error('Missing fields validation failed!');
    }

    // Invalid amount format
    const invalidAmountResult = TierValidationMiddleware.validateTicketPurchase(
      {
        tier: 'low',
        amount: 'notanumber',
        gameId: 1,
        playerAddress: 'test',
        playerLevel: 5,
      },
    );

    if (invalidAmountResult.isValid) {
      throw new Error('Invalid amount format was accepted!');
    }
  }
}

// Export for use in tests
module.exports = SecurityTestSuite;

// Auto-run tests if this file is executed directly
if (require.main === module) {
  SecurityTestSuite.runAllTests();
}

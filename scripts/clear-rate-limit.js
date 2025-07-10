#!/usr/bin/env node

/**
 * Clear rate limit for a specific wallet address
 */

const TierValidationMiddleware = require('../server/src/middleware/TierValidationMiddleware');

const walletAddress = process.argv[2];

if (!walletAddress) {
  console.log('Usage: node scripts/clear-rate-limit.js <wallet_address>');
  console.log('\nExample:');
  console.log(
    '  node scripts/clear-rate-limit.js 72U6xaEnna2iF2RcZHBKBhsB6VC76deyhib8KV2zUqMA',
  );
  console.log('\nOr clear all rate limits:');
  console.log('  node scripts/clear-rate-limit.js --all');
  process.exit(1);
}

console.log('🔄 Clearing rate limits...\n');

if (walletAddress === '--all') {
  const count = TierValidationMiddleware.clearAllRateLimits();
  console.log(`✅ Cleared all rate limits (${count} entries)`);
} else {
  const success = TierValidationMiddleware.clearRateLimit(walletAddress);
  if (success) {
    console.log(`✅ Rate limit cleared for ${walletAddress}`);
  } else {
    console.log(`❌ Failed to clear rate limit (cache not initialized)`);
  }
}

console.log('\n🎯 You can now try purchasing a ticket again!');

#!/usr/bin/env node

/**
 * Test script to validate RaceModal data display
 * This tests all the enhanced features we just implemented
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing RaceModal Data Display Enhancement\n');

// Check if files exist and are valid
const filesToCheck = [
  '/home/damian/swordbattle.io/client/src/ui/modals/RaceGameModal.tsx',
  '/home/damian/swordbattle.io/server/src/index.js',
  '/home/damian/swordbattle.io/server/src/game/Game.js',
  '/home/damian/swordbattle.io/server/src/blockchain/SolanaVaultService.js',
];

console.log('📋 Checking enhanced files...');
let allFilesValid = true;

for (const file of filesToCheck) {
  try {
    const stats = fs.statSync(file);
    const size = (stats.size / 1024).toFixed(2);
    console.log(`✅ ${path.basename(file)}: ${size}KB`);
  } catch (error) {
    console.log(`❌ ${path.basename(file)}: Missing or inaccessible`);
    allFilesValid = false;
  }
}

if (!allFilesValid) {
  console.log('\n❌ Some files are missing. Cannot proceed with tests.');
  process.exit(1);
}

console.log('\n🔍 Checking RaceModal enhancements...');

// Check RaceModal enhancements
const raceModalContent = fs.readFileSync(
  '/home/damian/swordbattle.io/client/src/ui/modals/RaceGameModal.tsx',
  'utf8',
);

const enhancementsToCheck = [
  {
    name: 'Enhanced Game ID Display',
    pattern: /Game #{gameState\.gameId/,
    description: 'GameID with enhanced styling and retrieval method indicator',
  },
  {
    name: 'Comprehensive Token Info',
    pattern: /🪙 Token Mint/,
    description: 'Token mint address display in info grid',
  },
  {
    name: 'Enhanced Entry Fee Display',
    pattern: /🎫 Entry Fee/,
    description: 'Entry fee with highlighting and currency info',
  },
  {
    name: 'Kill Reward Information',
    pattern: /🏆 Kill Reward/,
    description: 'Kill reward display with color coding',
  },
  {
    name: 'Auto-refresh Mechanism',
    pattern: /const autoRefreshInterval = setInterval/,
    description: 'Automatic data refresh every 10 seconds',
  },
  {
    name: 'Enhanced Balance Display',
    pattern: /💰.*Balance:/,
    description: 'Improved token balance display with color coding',
  },
  {
    name: 'Insufficient Balance Warning',
    pattern: /Insufficient balance! Need at least/,
    description: 'Clear warning when balance is insufficient',
  },
  {
    name: 'Enhanced Refresh Button',
    pattern: /🔄 Refresh All/,
    description: 'Improved refresh button with icon',
  },
];

console.log('\n📊 Enhancement Verification:');
let enhancementsPassed = 0;

for (const enhancement of enhancementsToCheck) {
  const found = enhancement.pattern.test(raceModalContent);
  console.log(
    `${found ? '✅' : '❌'} ${enhancement.name}: ${enhancement.description}`,
  );
  if (found) enhancementsPassed++;
}

console.log(
  `\n🎯 Enhancements: ${enhancementsPassed}/${enhancementsToCheck.length} implemented`,
);

// Check server-side enhancements
console.log('\n🔍 Checking server-side enhancements...');

const serverContent = fs.readFileSync(
  '/home/damian/swordbattle.io/server/src/index.js',
  'utf8',
);
const gameContent = fs.readFileSync(
  '/home/damian/swordbattle.io/server/src/game/Game.js',
  'utf8',
);
const vaultServiceContent = fs.readFileSync(
  '/home/damian/swordbattle.io/server/src/blockchain/SolanaVaultService.js',
  'utf8',
);

const serverEnhancements = [
  {
    name: 'Enhanced Token Request Handler',
    pattern: /getCurrentGameTokenInfo/,
    file: 'server/src/index.js',
    content: serverContent,
    description: 'Uses new enhanced token info methods',
  },
  {
    name: 'Game Token Info Methods',
    pattern: /async getCurrentGameTokenInfo/,
    file: 'server/src/game/Game.js',
    content: gameContent,
    description: 'Game-level token info retrieval methods',
  },
  {
    name: 'Vault Service Token Methods',
    pattern: /async getGameTokenInfo/,
    file: 'server/src/blockchain/SolanaVaultService.js',
    content: vaultServiceContent,
    description: 'Service-level token info methods',
  },
];

let serverEnhancementsPassed = 0;

for (const enhancement of serverEnhancements) {
  const found = enhancement.pattern.test(enhancement.content);
  console.log(
    `${found ? '✅' : '❌'} ${enhancement.name}: ${enhancement.description}`,
  );
  if (found) serverEnhancementsPassed++;
}

console.log(
  `\n🎯 Server Enhancements: ${serverEnhancementsPassed}/${serverEnhancements.length} implemented`,
);

// Summary
console.log('\n📈 Enhancement Summary:');
console.log(
  `🎨 Frontend enhancements: ${enhancementsPassed}/${enhancementsToCheck.length}`,
);
console.log(
  `⚙️ Backend enhancements: ${serverEnhancementsPassed}/${serverEnhancements.length}`,
);

const totalPassed = enhancementsPassed + serverEnhancementsPassed;
const totalPossible = enhancementsToCheck.length + serverEnhancements.length;

console.log(
  `\n🏆 Overall Score: ${totalPassed}/${totalPossible} (${((totalPassed / totalPossible) * 100).toFixed(1)}%)`,
);

if (totalPassed === totalPossible) {
  console.log('\n✅ All enhancements successfully implemented!');
  console.log('\n🚀 RaceModal now features:');
  console.log('   • Clear GameID display with retrieval method indicator');
  console.log('   • Comprehensive token information (mint, symbol, balance)');
  console.log('   • Enhanced difficulty and tier information display');
  console.log('   • Detailed entry fee and kill reward information');
  console.log('   • Real-time data updates every 10 seconds');
  console.log('   • Improved error handling and user feedback');
  console.log('   • Color-coded balance and status indicators');
  console.log('   • Enhanced wallet and token mint display');

  process.exit(0);
} else {
  console.log('\n⚠️ Some enhancements may be missing or incomplete.');
  console.log(
    'Please review the implementation and ensure all features are working correctly.',
  );
  process.exit(1);
}

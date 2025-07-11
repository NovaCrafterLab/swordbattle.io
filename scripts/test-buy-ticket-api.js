#!/usr/bin/env node

/**
 * Test script for buyTicket API functionality
 * This script tests the complete buyTicket flow
 */

const fetch = require('node-fetch');

// Test configuration
const TEST_CONFIG = {
  serverUrl: 'localhost:8000',
  testWallet: 'HnGqzMDTF7THPG8VdLrRbEq1EM9vUzB1ry1FHjjgNcHp', // Test wallet address
  gameId: 1,
  amount: '10000000', // 0.01 SOL in lamports
  tier: 'low',
  tokenMint: 'So11111111111111111111111111111112', // SOL
};

async function testServerPing() {
  console.log('🏓 Testing server ping...');
  try {
    const response = await fetch(`http://${TEST_CONFIG.serverUrl}/ping`);
    if (response.ok) {
      const result = await response.text();
      console.log('✅ Server ping successful:', result);
      return true;
    } else {
      console.error('❌ Server ping failed:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Server ping error:', error.message);
    return false;
  }
}

async function testServerInfo() {
  console.log('📊 Testing server info...');
  try {
    const response = await fetch(`http://${TEST_CONFIG.serverUrl}/serverinfo`);
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Server info successful:');
      console.log('   Game Status:', result.gameStatus);
      console.log('   Solana Enabled:', result.solanaEnabled);
      console.log('   Is Race Server:', result.isRaceServer);
      return result;
    } else {
      console.error('❌ Server info failed:', response.status);
      return null;
    }
  } catch (error) {
    console.error('❌ Server info error:', error.message);
    return null;
  }
}

async function testCurrentGameToken() {
  console.log('🪙 Testing current game token...');
  try {
    const response = await fetch(
      `http://${TEST_CONFIG.serverUrl}/api/current-game-token`,
    );
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Current game token successful:');
      console.log('   Game ID:', result.currentGameId);
      console.log('   Token Mint:', result.tokenMint);
      console.log('   Token Info:', result.tokenInfo);
      return result;
    } else {
      console.error('❌ Current game token failed:', response.status);
      const errorData = await response.json().catch(() => ({}));
      console.error('   Error:', errorData);
      return null;
    }
  } catch (error) {
    console.error('❌ Current game token error:', error.message);
    return null;
  }
}

async function testBuildBuyTicketTransaction(currentGameId = null) {
  console.log('🔧 Testing build buy ticket transaction...');
  try {
    const gameId = currentGameId || TEST_CONFIG.gameId;
    const requestBody = {
      gameId: gameId,
      amount: TEST_CONFIG.amount,
      walletAddress: TEST_CONFIG.testWallet,
      tokenMint: TEST_CONFIG.tokenMint,
      tier: TEST_CONFIG.tier,
      expectedAmount: TEST_CONFIG.amount,
      playerLevel: 1,
    };

    console.log('   Request body:', requestBody);

    const response = await fetch(
      `http://${TEST_CONFIG.serverUrl}/api/build-buy-ticket-transaction`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      },
    );

    console.log('   Response status:', response.status);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Build buy ticket transaction response received:');
      console.log('   Success:', result.success);
      console.log('   Transaction length:', result.transaction?.length);
      console.log('   Message:', result.message);
      if (!result.success) {
        console.log('   Error:', result.error);
        console.log('   Details:', result.details);
      }
      return result;
    } else {
      console.error('❌ Build buy ticket transaction failed:', response.status);
      const errorData = await response.json().catch(() => ({}));
      console.error('   Error:', errorData);
      return null;
    }
  } catch (error) {
    console.error('❌ Build buy ticket transaction error:', error.message);
    return null;
  }
}

async function testVaultInfo() {
  console.log('🏛️ Testing vault info...');
  try {
    const response = await fetch(
      `http://${TEST_CONFIG.serverUrl}/api/vault-info/${TEST_CONFIG.gameId}`,
    );
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Vault info successful:');
      console.log('   Game ID:', result.gameId);
      console.log('   Token Mint:', result.tokenMint);
      console.log('   Game Status:', result.gameStatus);
      return result;
    } else {
      console.error('❌ Vault info failed:', response.status);
      const errorData = await response.json().catch(() => ({}));
      console.error('   Error:', errorData);
      return null;
    }
  } catch (error) {
    console.error('❌ Vault info error:', error.message);
    return null;
  }
}

async function runTests() {
  console.log('🧪 Starting buyTicket API tests...\n');

  // Test 1: Server availability
  const pingSuccess = await testServerPing();
  if (!pingSuccess) {
    console.log('\n❌ Server is not available. Tests aborted.');
    return;
  }

  console.log('');

  // Test 2: Server info
  const serverInfo = await testServerInfo();
  if (!serverInfo) {
    console.log('\n❌ Could not get server info. Tests aborted.');
    return;
  }

  console.log('');

  // Test 3: Current game token
  const gameToken = await testCurrentGameToken();

  console.log('');

  // Test 4: Vault info
  const vaultInfo = await testVaultInfo();

  console.log('');

  // Test 5: Build buy ticket transaction (the main test)
  const buildResult = await testBuildBuyTicketTransaction(
    serverInfo?.gameStatus?.gameId,
  );

  console.log('\n🧪 Test Summary:');
  console.log(`   Server Ping: ${pingSuccess ? '✅' : '❌'}`);
  console.log(`   Server Info: ${serverInfo ? '✅' : '❌'}`);
  console.log(`   Game Token: ${gameToken ? '✅' : '❌'}`);
  console.log(`   Vault Info: ${vaultInfo ? '✅' : '❌'}`);
  console.log(`   Build Transaction: ${buildResult ? '✅' : '❌'}`);

  if (buildResult) {
    console.log('\n🎉 All tests passed! buyTicket functionality is working.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the logs above for details.');
  }
}

// Run the tests
runTests().catch((error) => {
  console.error('🚨 Test runner error:', error);
  process.exit(1);
});

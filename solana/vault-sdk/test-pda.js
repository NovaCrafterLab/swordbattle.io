#!/usr/bin/env node

/**
 * Test PDA calculation differences
 */

const { PublicKey } = require('@solana/web3.js');
const anchor = require('@coral-xyz/anchor');

// Configuration
const PROGRAM_ID = 'AqDb3BxQhL5wmszt3iy8qrvPJ9Mu5MeF5uoUd1e65EaV';
const GAME_ID = 424;

function testPDACalculation() {
  console.log('🔍 Testing PDA calculation differences...\n');

  const programId = new PublicKey(PROGRAM_ID);
  console.log(`📋 Program ID: ${programId.toString()}`);
  console.log(`🎮 Game ID: ${GAME_ID}\n`);

  // Method 1: Using anchor.BN (VaultSDK method)
  const anchorBuffer = new anchor.BN(GAME_ID).toArrayLike(Buffer, 'le', 8);
  const [vaultAnchor] = PublicKey.findProgramAddressSync(
    [Buffer.from('vault'), anchorBuffer],
    programId,
  );

  console.log(`🔧 Anchor BN method:`);
  console.log(`   Buffer: [${Array.from(anchorBuffer).join(', ')}]`);
  console.log(`   Vault PDA: ${vaultAnchor.toString()}`);

  // Method 2: Manual buffer creation (test script method)
  function gameIdToBuffer(gameId) {
    const buffer = Buffer.alloc(8);
    buffer.writeUInt32LE(gameId, 0);
    buffer.writeUInt32LE(0, 4);
    return buffer;
  }

  const manualBuffer = gameIdToBuffer(GAME_ID);
  const [vaultManual] = PublicKey.findProgramAddressSync(
    [Buffer.from('vault'), manualBuffer],
    programId,
  );

  console.log(`\n🔧 Manual method:`);
  console.log(`   Buffer: [${Array.from(manualBuffer).join(', ')}]`);
  console.log(`   Vault PDA: ${vaultManual.toString()}`);

  console.log(`\n🔍 Comparison:`);
  if (vaultAnchor.equals(vaultManual)) {
    console.log('✅ Both methods produce the same PDA');
  } else {
    console.log('❌ Methods produce DIFFERENT PDAs!');
    console.log('This is the root cause of the issue.');
  }

  // Method 3: Try different buffer encodings
  console.log(`\n🔧 Testing different encodings:`);

  // Big endian
  const beBuf = new anchor.BN(GAME_ID).toArrayLike(Buffer, 'be', 8);
  const [vaultBE] = PublicKey.findProgramAddressSync(
    [Buffer.from('vault'), beBuf],
    programId,
  );
  console.log(`   Big endian: ${vaultBE.toString()}`);

  // Different sizes
  const buf4 = new anchor.BN(GAME_ID).toArrayLike(Buffer, 'le', 4);
  try {
    const [vault4] = PublicKey.findProgramAddressSync(
      [Buffer.from('vault'), buf4],
      programId,
    );
    console.log(`   4-byte LE: ${vault4.toString()}`);
  } catch (e) {
    console.log(`   4-byte LE: Error - ${e.message}`);
  }

  console.log('\n✅ Test completed!');
}

// Run the test
testPDACalculation();

const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { VaultSDK } = require('./dist/index.js');

// Example usage of VaultSDK
async function main() {
  // Setup connection and wallet
  const connection = new Connection('http://localhost:8899', 'confirmed');
  const wallet = Keypair.generate(); // In real app, this would be user's wallet
  
  // Program ID from your deployed contract
  const programId = new PublicKey('AqDb3BxQhL5wmszt3iy8qrvPJ9Mu5MeF5uoUd1e65EaV');
  
  // Initialize SDK
  const vaultSDK = new VaultSDK({
    programId,
    connection,
    wallet
  });

  console.log('VaultSDK initialized successfully!');
  
  // Example: Get vault info for a game
  const gameId = 12345;
  const vaultInfo = vaultSDK.getVaultInfo(gameId);
  
  console.log('Vault Info:', {
    vault: vaultInfo.vault.toString(),
    vaultSigner: vaultInfo.vaultSigner.toString(),
    userTicket: vaultInfo.userTicket.toString(),
    rewardMap: vaultInfo.rewardMap.toString()
  });
}

// Run the example
main().catch(console.error); 
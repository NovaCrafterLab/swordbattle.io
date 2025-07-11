import { VaultSDK } from './vault-sdk';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';

// Mock test for SDK functionality
describe('VaultSDK', () => {
  let sdk: VaultSDK;
  let connection: Connection;
  let wallet: Keypair;
  let programId: PublicKey;

  beforeEach(() => {
    connection = new Connection('http://localhost:8899', 'confirmed');
    wallet = Keypair.generate();
    programId = new PublicKey('AqDb3BxQhL5wmszt3iy8qrvPJ9Mu5MeF5uoUd1e65EaV');

    sdk = new VaultSDK({
      programId,
      connection,
      wallet,
    });
  });

  test('should initialize SDK correctly', () => {
    expect(sdk).toBeDefined();
  });

  test('should calculate vault PDAs correctly', async () => {
    const gameId = 12345;
    const vaultInfo = await sdk.getVaultInfo(gameId);

    expect(vaultInfo.vault).toBeDefined();
    expect(vaultInfo.vaultSigner).toBeDefined();
    expect(vaultInfo.userTicket).toBeDefined();
    expect(vaultInfo.rewardMap).toBeDefined();
  });

  test('should have all required methods', () => {
    expect(typeof sdk.initializeGameVault).toBe('function');
    expect(typeof sdk.buyTicket).toBe('function');
    expect(typeof sdk.claimReward).toBe('function');
    expect(typeof sdk.finalizeGame).toBe('function');
    expect(typeof sdk.adminWithdraw).toBe('function');
    expect(typeof sdk.changeTokenMint).toBe('function');
    expect(typeof sdk.getVaultAccount).toBe('function');
    expect(typeof sdk.getUserTicketAccount).toBe('function');
    expect(typeof sdk.getRewardMapAccount).toBe('function');
  });
});

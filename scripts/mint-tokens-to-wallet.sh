#!/bin/bash

# Helper script to mint test tokens to your wallet
# Usage: ./mint-tokens-to-wallet.sh <wallet-address> [amount]

WALLET_ADDRESS="$1"
AMOUNT="${2:-1000}"

if [ -z "$WALLET_ADDRESS" ]; then
  echo "❌ Please provide a wallet address"
  echo "Usage: $0 <wallet-address> [amount]"
  echo ""
  echo "Example:"
  echo "  $0 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM 1000"
  exit 1
fi

echo "🪙 Minting $AMOUNT SBTT tokens to wallet: $WALLET_ADDRESS"
echo ""

# Run the minting script
node scripts/mint-test-tokens.js "$WALLET_ADDRESS" "$AMOUNT"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Successfully minted $AMOUNT SBTT tokens!"
  echo ""
  echo "🔧 Next steps:"
  echo "1. Restart your client development server to use the new token"
  echo "2. Connect your wallet in the RaceModal"
  echo "3. You should now see your SBTT balance!"
  echo ""
  echo "📋 Token Details:"
  echo "   Name: SwordBattle Test Token"
  echo "   Symbol: SBTT"
  echo "   Mint: Hk4BerAoKbemG277HShrk8DSHiMEUKbm6D23RKhLDLKq"
  echo "   Network: Solana Devnet"
else
  echo "❌ Failed to mint tokens. Please check the error above."
  exit 1
fi
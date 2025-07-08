# 🎯 Dynamic Token Integration for RaceModal

## ✨ Features Implemented

### 🚀 Dynamic Token Retrieval

- **On-chain Token Detection**: Automatically fetches the current game's token from Solana vault
- **Real-time Token Info**: Gets token symbol, name, and contract address dynamically
- **Fallback System**: Uses server configuration if on-chain retrieval fails

### 🎮 Tier-based Gaming System

- **Three Tiers**: Low, Medium, High with different entrance fees and rewards
- **Dynamic Pricing**: Entry fees and rewards are fetched based on current game tier
- **Level Restrictions**: Each tier has player level requirements

### 💰 Smart Balance Management

- **Multi-Token Support**: Automatically detects SOL vs SPL tokens
- **Dynamic Balance Checking**: Fetches balance for the specific token used in current game
- **Real-time Updates**: Balances update automatically when game token changes

### 🔒 Enhanced Security

- **Server-side Validation**: All pricing is validated server-side to prevent manipulation
- **Tier Authentication**: Players must meet level requirements for each tier
- **Rate Limiting**: Prevents spam ticket purchases

## 📋 New API Endpoints

### GET `/api/current-game-token`

Returns current active game's token information:

```json
{
  "success": true,
  "currentGameId": "123",
  "tokenMint": "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
  "tokenInfo": {
    "address": "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
    "isSOL": false,
    "isUSDC": true,
    "isWSol": false
  },
  "gameStatus": {
    "isActive": true,
    "canBuyTickets": true,
    "tier": "medium"
  },
  "retrievalMethod": "on-chain-dynamic"
}
```

### POST `/api/buy-ticket` (Enhanced)

Now supports tier-based validation:

```json
{
  "gameId": 123,
  "amount": "50000000",
  "walletAddress": "player_wallet_address",
  "tier": "medium",
  "playerLevel": 15
}
```

## 🎯 User Experience Flow

### 1. **Player Opens RaceModal**

- Automatically fetches current game token information
- Displays dynamic token symbol and tier information
- Shows appropriate balance for the specific token

### 2. **Game Information Display**

- **Payment Token**: Shows token symbol with retrieval method indicator
- **Entry Fee**: Dynamic pricing based on current tier
- **Kill Reward**: Tier-specific reward amounts
- **Level Range**: Required player levels for current tier

### 3. **Smart Ticket Purchase**

- Automatically uses correct token amount for current tier
- Validates player level eligibility
- Shows real-time balance in correct token
- Handles both SOL and SPL tokens seamlessly

## 🔧 New React Hooks

### `useCurrentGameToken()`

```typescript
const gameToken = useCurrentGameToken();
// Returns: tokenMint, tokenSymbol, tier, canBuyTickets, etc.
```

### `useTierPricing(tier)`

```typescript
const tierPricing = useTierPricing('medium');
// Returns: entranceFee, killReward, levelRange, description
```

### `useDynamicTokenBalance(walletAddress)`

```typescript
const balance = useDynamicTokenBalance(address);
// Returns: balance for current game token (SOL or SPL)
```

## 🎮 Tier Configuration

### Low Tier (Entry Level)

- **Entry Fee**: 0.01 SOL/USDC
- **Kill Reward**: 0.001 SOL/USDC per kill
- **Level Range**: 1-10
- **Description**: "Beginner-friendly arena with basic rewards"

### Medium Tier (Intermediate)

- **Entry Fee**: 0.05 SOL/USDC
- **Kill Reward**: 0.005 SOL/USDC per kill
- **Level Range**: 11-25
- **Description**: "Intermediate arena with enhanced rewards"

### High Tier (Advanced)

- **Entry Fee**: 0.1 SOL/USDC
- **Kill Reward**: 0.01 SOL/USDC per kill
- **Level Range**: 26+
- **Description**: "Advanced arena with premium rewards"

## 🔒 Security Features

### Server-side Validation

- **Price Matching**: Exact entry fee validation for each tier
- **Level Verification**: Player level must meet tier requirements
- **Rate Limiting**: 5 requests per minute per wallet
- **Input Sanitization**: All inputs validated and sanitized

### Attack Prevention

- **Price Manipulation**: Users cannot modify entry fees
- **Tier Bypass**: Cannot join higher tiers without meeting requirements
- **Token Spoofing**: Token address retrieved from on-chain vault
- **Balance Bypass**: Real-time balance checking

## 🚀 Usage Example

```typescript
// In RaceGameModal component:
const gameToken = useCurrentGameToken();
const tierPricing = useTierPricing(gameToken.data?.tier || 'low');
const dynamicBalance = useDynamicTokenBalance(address || '');

// Displays:
// - Token: USDC (🔗 On-chain)
// - Entry Fee: 0.05 USDC
// - Your Balance: 1.25 USDC
// - Tier: Medium Tier Arena
```

## 📈 Benefits

1. **🎯 Flexibility**: Supports any SPL token or SOL
2. **🔄 Dynamic**: Token and pricing info updates automatically
3. **🔒 Secure**: Server-side validation prevents manipulation
4. **🎮 Scalable**: Easy to add new tiers or modify pricing
5. **👥 User-Friendly**: Clear display of token, fees, and balances
6. **⚡ Real-time**: All information fetched dynamically

This integration provides a complete solution for dynamic token management in the racing game modal, ensuring both security and excellent user experience!

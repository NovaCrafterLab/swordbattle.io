# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Swordbattle.io is a multiplayer Web3-enabled .io game built with a Node.js backend and React frontend. This is the NovaCrafterLab fork which adds experimental Web3/blockchain features while maintaining compatibility with the original game.

## Architecture

### Monorepo Structure
- **Root**: Yarn workspace configuration and Docker setup
- **`client/`**: React frontend (Phaser.js game engine + UI)
- **`server/`**: Node.js WebSocket game server (pure JavaScript)
- **`api/`**: NestJS REST API for user accounts and blockchain integration

### Key Technologies
- **Frontend**: React, TypeScript, Phaser 3, Redux Toolkit, Solana Web3 (wallet-adapter)
- **Backend**: Node.js, uWebSockets.js, Protocol Buffers, SAT.js (collision detection)
- **API**: NestJS, TypeORM, PostgreSQL
- **Blockchain**: Solana Web3.js, Anchor framework, Viem for EVM chains

## Development Commands

### Core Development
```bash
# Start client + server in parallel
yarn dev

# Start all services (client + server + api)
yarn dev:full

# Individual services
yarn dev:client    # React dev server on port 8000
yarn dev:server    # Game server on port 3000
yarn dev:api       # NestJS API server
```

### Building and Deployment
```bash
# Build all workspaces
yarn build

# Clean all build artifacts
yarn clean

# Format code
yarn fmt
```

### Docker
```bash
# Development environment
yarn docker:dev

# Production environment
yarn docker:prod

# Race mode (special game mode)
yarn docker:dev:race
```

## Game Architecture

### Authoritative Server Design
- **Server Authority**: `server/src/game/Game.js` maintains authoritative game state
- **Client Prediction**: Client-side movement prediction with server reconciliation
- **Delta Updates**: Only changed entity data transmitted via Protocol Buffers
- **Spatial Optimization**: SpatialHash and dynamic Quadtree for collision detection

### Server-Side Game Loop
- **Game Loop**: `server/src/game/Game.js` - Main game state management at 20 TPS
- **Entities**: `server/src/game/entities/` - Game objects (Player, Coin, Chest, etc.)
- **Collision Detection**: Uses SAT.js for polygon collision detection
- **Spatial Partitioning**: SpatialHash for efficient entity queries
- **Network Protocol**: Protocol Buffers for client-server communication

### Client-Side Game
- **Phaser 3**: Game rendering engine in `client/src/game/scenes/Game.ts`
- **GameState**: `client/src/game/GameState.ts` - Client-side game state management
- **Entity System**: `client/src/game/entities/` - Client-side entity representations
- **HUD**: `client/src/game/hud/` - UI overlays and game interface
- **State Interpolation**: Smooth movement between server updates

### Protocol Buffers
- Schema: `client/src/game/network/schema.proto` and `server/src/network/protocol/schema.proto`
- Rebuild with: `yarn workspace @swordbattle/client run build-protocol`
- Supports: Player input, entity updates, map data, wallet addresses for Web3

## Web3 Integration

### Blockchain Components
- **Client**: `client/src/blockchain.ts` - Web3 wallet connection and contract interaction
- **Server**: `server/src/blockchain/` - Server-side blockchain validation and rewards
- **API**: `api/src/blockchain/` - Blockchain service and database integration

### Solana Integration
- **Vault System**: `solana/vault-sdk/` - Custom Solana program for game rewards
- **Wallet Adapters**: Phantom, Solflare wallet support
- **Token Support**: SOL, USDC, wrapped SOL payments
- **Race Mode**: Blockchain-verified competitive game mode

### Smart Contracts
- **Solana Vault Program**: Custom game rewards and payment system
- **EVM Support**: Legacy support for Ethereum-compatible chains
- ABIs stored in `/abis/` directories

## Testing and Quality

### Testing Status
- **No Automated Tests**: Client, server, and API lack comprehensive test suites
- **Manual Testing Required**: All features must be tested manually
- **Test Commands**: Placeholder commands exist but don't run actual tests

### Code Quality Tools
- **Linting**: ESLint configured for client and API (server has no linting)
- **Formatting**: Prettier with lint-staged for consistent code style
- **Type Checking**: TypeScript in client and API (server is pure JavaScript)

### Quality Commands
```bash
# Format all code (works)
yarn fmt

# Lint client code
yarn workspace @swordbattle/client run lint  # Note: may not exist

# Lint API code
yarn workspace @swordbattle/api run lint
```

## Database

### API Database (PostgreSQL)
- **Entities**: User accounts, game statistics, blockchain transactions
- **Migrations**: Use TypeORM CLI for database schema changes
- **Configuration**: Environment-based database connection

## Environment Setup

### Required Environment Variables
- Database connection strings
- Blockchain RPC endpoints (Solana mainnet/devnet)
- API keys for external services
- JWT secrets for authentication
- Recaptcha keys for bot protection

### Branch Strategy
- **`web3-main`**: Main development branch (Web3 features)
- **`main`**: Upstream sync branch (no Web3 code)
- **`upstream-main`**: Mirror of original repository

## Performance Considerations

### Server Optimization
- **Spatial Hashing**: Entity queries optimized with SpatialHash
- **Object Pooling**: Entity reuse to reduce garbage collection
- **Dynamic Quadtree**: Rebuild frequency based on player count
- **Viewport Culling**: Only send entities within player view
- **Profiling Tools**: `yarn dev:devtool:server` and `yarn dev:autocannon:server`

### Client Optimization
- **Phaser 3 Object Pooling**: Efficient entity rendering
- **Asset Loading**: Dynamic skin loading with fallbacks
- **Frame Rate Adaptation**: Particle effects disabled at low FPS
- **Minimal DOM Updates**: Game state changes don't affect DOM during gameplay

## Debugging

### Server Debugging
```bash
# Debug mode with inspector
yarn dev:mon:server

# Production debugging with inspector
yarn dev:devtool:server

# Load testing with autocannon
yarn dev:autocannon:server
```

### Client Debugging
- React DevTools for UI components
- Browser DevTools for Phaser debugging
- Source maps generated in development
- Redux DevTools for state management

## Entity System Architecture

### Component-Based Design
- **Base Entity**: Both client and server extend base entity classes
- **Components**: Health, Viewport, LevelSystem, EvolutionSystem, Inputs
- **Effects System**: SpeedEffect, BurningEffect, SlippingEffect
- **Evolution System**: Berserker, Knight, Rook, Samurai, Stalker, Tank, Vampire

### Data Flow
```
Input → Controls → Network → Server Game Logic → Collision Detection → 
State Updates → Network → Client State → Interpolation → Rendering
```

## Common Development Patterns

### Adding New Entities
1. Create server entity in `server/src/game/entities/`
2. Add corresponding client entity in `client/src/game/entities/`
3. Update Protocol Buffer schema if needed
4. Rebuild protocol with `yarn workspace @swordbattle/client run build-protocol`

### Blockchain Integration
1. Server-side validation in `server/src/blockchain/`
2. Client-side wallet interaction in `client/src/blockchain.ts`
3. API-side database integration in `api/src/blockchain/`

### Performance Debugging
- Use `yarn dev:devtool:server` for server performance analysis
- Monitor spatial hash performance in game console logs
- Check client FPS and adjust particle effects accordingly
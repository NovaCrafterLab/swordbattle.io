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
- **Frontend**: React, TypeScript, Phaser 3, Redux Toolkit, Web3 (RainbowKit/Wagmi)
- **Backend**: Node.js, uWebSockets.js, Protocol Buffers, SAT.js (collision detection)
- **API**: NestJS, TypeORM, PostgreSQL
- **Blockchain**: Viem, Ethereum-compatible chains

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

### Server-Side Game Loop
- **Game Loop**: `server/src/game/Game.js` - Main game state management
- **Entities**: `server/src/game/entities/` - Game objects (Player, Coin, Chest, etc.)
- **Collision Detection**: Uses SAT.js for polygon collision detection
- **Spatial Partitioning**: SpatialHash for efficient entity queries
- **Network Protocol**: Protocol Buffers for client-server communication

### Client-Side Game
- **Phaser 3**: Game rendering engine in `client/src/game/scenes/Game.ts`
- **GameState**: `client/src/game/GameState.ts` - Client-side game state management
- **Entity System**: `client/src/game/entities/` - Client-side entity representations
- **HUD**: `client/src/game/hud/` - UI overlays and game interface

### Protocol Buffers
- Schema: `client/src/game/network/schema.proto` and `server/src/network/protocol/schema.proto`
- Rebuild with: `yarn workspace @swordbattle/client run build-protocol`

## Web3 Integration

### Blockchain Components
- **Client**: `client/src/blockchain.ts` - Web3 wallet connection and contract interaction
- **Server**: `server/src/blockchain/` - Server-side blockchain validation
- **API**: `api/src/blockchain/` - Blockchain service and database integration

### Smart Contracts
- **DeploySword**: Main game contract for Web3 features
- **ERC20**: Token support for rewards
- ABIs stored in `/abis/` directories

## Testing and Quality

### No Automated Tests
- Client has placeholder test command
- Server and API have no test suites
- Manual testing required

### Code Quality
- **Linting**: ESLint configured for client and API
- **Formatting**: Prettier for consistent code style
- **Type Checking**: TypeScript in client and API (server is pure JS)

## Database

### API Database (PostgreSQL)
- **Entities**: User accounts, game statistics, blockchain transactions
- **Migrations**: Use TypeORM CLI for database schema changes
- **Configuration**: Environment-based database connection

## Environment Setup

### Required Environment Variables
- Database connection strings
- Blockchain RPC endpoints
- API keys for external services
- JWT secrets for authentication

### Branch Strategy
- **`web3-main`**: Main development branch (Web3 features)
- **`main`**: Upstream sync branch (no Web3 code)
- **`upstream-main`**: Mirror of original repository

## Performance Considerations

### Server Optimization
- Spatial hashing for entity queries
- Object pooling for entities
- Efficient WebSocket message handling
- Profiling tools available (`dev:devtool:server`)

### Client Optimization
- Phaser 3 object pooling
- Efficient entity rendering
- Minimal DOM manipulation during gameplay

## Debugging

### Server Debugging
```bash
# Debug mode with inspector
yarn dev:mon:server

# Production debugging
yarn dev:devtool:server

# Load testing
yarn dev:autocannon:server
```

### Client Debugging
- React DevTools for UI components
- Phaser debug mode available
- Source maps generated in development
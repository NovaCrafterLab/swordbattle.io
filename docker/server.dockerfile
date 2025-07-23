# syntax=docker/dockerfile:1.7
# docker/api.dockerfile

###########################################################
# 1. builder-base
###########################################################
FROM node:22-slim AS builder-base
WORKDIR /app

# native toolchain for node-gyp
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# Yarn version
RUN corepack enable && corepack prepare yarn@4.9.2 --activate

###########################################################
# 2. deps-prod —— install production deps only
###########################################################
FROM builder-base AS deps-prod
ENV NODE_OPTIONS="--max-old-space-size=2048"
# root manifests
COPY package.json yarn.lock .yarnrc.yml ./
# workspace manifest
COPY server/package.json ./server/package.json
# install minimal deps (builds native addons here)
RUN yarn workspaces focus @swordbattle/server --production

###########################################################
# 3. runtime —— bring deps + source, run as non-root
###########################################################
FROM node:22-slim AS runtime
WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=2048"

# create unified user: swordbattle (uid/gid 1001)
RUN addgroup --system --gid 1001 swordbattle \
    && adduser  --system --uid 1001 --gid 1001 swordbattle

RUN mkdir -p /app/logs \
    && chown -R swordbattle:swordbattle /app

ENV NODE_ENV=production \
    SERVER_PORT=8000

# copy production deps
COPY --chown=swordbattle:swordbattle solana/vault-sdk /solana/vault-sdk
COPY --from=deps-prod --chown=swordbattle:swordbattle /app/node_modules ./node_modules

# copy plain-JS source
COPY server/package.json ./package.json
COPY server/src          ./src

# abis
COPY server/abis/id.json ./abis/id.json

USER swordbattle
EXPOSE 8000
CMD ["node", "src/index.js"]

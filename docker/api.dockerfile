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
# 2. deps-dev
###########################################################
FROM builder-base AS deps-dev
ENV NODE_OPTIONS="--max-old-space-size=2048"
# rarely-changed root manifests
COPY package.json yarn.lock .yarnrc.yml ./
# workspace manifest
COPY api/package.json ./api/package.json
# install all deps for @swordbattle/api
RUN yarn workspaces focus @swordbattle/api

###########################################################
# 3. deps-prod
###########################################################
FROM deps-dev AS deps-prod
RUN yarn workspaces focus @swordbattle/api --production

###########################################################
# 4. builder
###########################################################
FROM builder-base AS builder
# same root manifests
COPY package.json yarn.lock .yarnrc.yml ./
# re-use node_modules compiled in deps-dev
COPY --from=deps-dev /app/node_modules ./node_modules

# add: workspace manifest (FIX)
COPY api/package.json ./api/package.json

# relatively static configs
COPY api/tsconfig*.json ./api/
COPY api/nest-cli.json  ./api/

# frequently changing source code
COPY api/src ./api/src

# compile → api/dist
RUN yarn workspace @swordbattle/api build

###########################################################
# 5. runtime
###########################################################
FROM node:22-slim AS runtime
WORKDIR /app

# create non-root user: swordbattle (uid/gid 1001)
RUN addgroup --system --gid 1001 swordbattle \
    && adduser  --system --uid 1001 --gid 1001 swordbattle

ENV NODE_ENV=production \
    API_PORT=8080

# copy runtime deps & dist with correct ownership
COPY --from=deps-prod --chown=swordbattle:swordbattle /app/node_modules ./node_modules
COPY --from=builder   --chown=swordbattle:swordbattle /app/api/dist     ./dist

USER swordbattle
EXPOSE 8080
CMD ["node", "dist/main.js"]

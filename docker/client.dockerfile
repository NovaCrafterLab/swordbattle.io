# docker/client.dockerfile
# syntax=docker/dockerfile:1.7

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
# root manifests
COPY package.json yarn.lock .yarnrc.yml ./
# workspace manifest
COPY client/package.json ./client/package.json
# install all deps for @swordbattle/client
RUN yarn workspaces focus @swordbattle/client

###########################################################
# 3. builder
###########################################################
FROM builder-base AS builder

# same manifests for consistency
COPY package.json yarn.lock .yarnrc.yml ./
# re-use node_modules
COPY --from=deps-dev /app/node_modules ./node_modules

# ---------- build-time public args ----------
ARG PUBLIC_URL
ARG REACT_APP_API
ARG REACT_APP_ENDPOINT_TEST
ARG REACT_APP_ENDPOINT_RACE

ENV PUBLIC_URL=${PUBLIC_URL} \
    REACT_APP_API=${REACT_APP_API} \
    REACT_APP_ENDPOINT_TEST=${REACT_APP_ENDPOINT_TEST} \
    REACT_APP_ENDPOINT_RACE=${REACT_APP_ENDPOINT_RACE}

# add: workspace manifest (FIX)
COPY client/package.json  ./client/package.json
COPY client/tsconfig.json ./client/tsconfig.json

# relatively static configs
COPY client/config   ./client/config
COPY client/scripts  ./client/scripts
COPY client/.env*    ./client/
# frequently changing source & assets
COPY client/public   ./client/public
COPY client/src      ./client/src

# compile → client/build
RUN ls client/src
RUN yarn workspace @swordbattle/client build

###########################################################
# 4. runtime - Nginx
###########################################################
FROM nginx:1.27-alpine AS runtime
WORKDIR /usr/share/nginx/html

ENV NODE_ENV=production \
    GENERATE_SOURCEMAP=false

# copy built files (change owner to swordbattle)
COPY --from=builder --chown=nginx:nginx /app/client/build .

# custom nginx config
COPY client/nginx/default.conf /etc/nginx/conf.d/default.conf

# drop root: listen on non-privileged port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

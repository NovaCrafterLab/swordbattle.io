# syntax=docker/dockerfile:1.7

########################  builder  ########################
FROM node:22-slim AS builder
WORKDIR /app

# native toolchain (needed only to build native addons)
RUN apt-get update && apt-get install -y --no-install-recommends \
        python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# install runtime deps without lockfile
COPY package.json ./
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
    yarn install --network-timeout 600000

# copy plain-JS game source
COPY src ./src

########################  runtime  ########################
FROM node:22-slim AS runtime
WORKDIR /app

# non-root user for safety
RUN addgroup --system app && adduser --system --ingroup app app

# bring deps + code from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src          ./src

ENV NODE_ENV=production \
    SERVER_PORT=8000

EXPOSE 8000
USER app
CMD ["node", "src/index.js"]

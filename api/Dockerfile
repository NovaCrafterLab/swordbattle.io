# syntax=docker/dockerfile:1.7

########################  builder  ########################
FROM node:22-slim AS builder
WORKDIR /app

# native toolchain (only for build)
RUN apt-get update && apt-get install -y --no-install-recommends \
        python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# install all deps once
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 600000

# copy source & compile (NestJS -> dist/)
COPY . .
RUN yarn build

########################  runtime  ########################
FROM node:22-slim AS runtime
WORKDIR /app

# non-root user
RUN addgroup --system app && adduser --system --ingroup app app

# bring runtime deps + compiled code
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist          ./dist

ENV NODE_ENV=production \
    API_PORT=8080

EXPOSE 8080
USER app
CMD ["node", "dist/main.js"]

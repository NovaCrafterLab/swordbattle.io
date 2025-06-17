# syntax=docker/dockerfile:1.7

########################  builder  ########################
FROM node:22-slim AS builder
WORKDIR /app

# ---------- build-time public args ----------
ARG PUBLIC_URL
ARG REACT_APP_API
ARG REACT_APP_ENDPOINT_DEV
ARG REACT_APP_ENDPOINT_TEST

# 导出为 ENV，供 yarn build 时读取
ENV PUBLIC_URL=$PUBLIC_URL \
    REACT_APP_API=$REACT_APP_API \
    REACT_APP_ENDPOINT_DEV=$REACT_APP_ENDPOINT_DEV \
    REACT_APP_ENDPOINT_TEST=$REACT_APP_ENDPOINT_TEST

# ---------- install & build ----------
COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
    yarn install --frozen-lockfile --network-timeout 600000

COPY . .
RUN yarn build

########################  runtime  ########################
FROM nginx:1.27-alpine AS runtime
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
COPY --from=builder /app/build ./

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

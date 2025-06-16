# syntax=docker/dockerfile:1.7

########## builder ##########
FROM node:22-slim AS builder
WORKDIR /app

COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
    yarn install --frozen-lockfile

COPY . .
RUN yarn build

########## runtime ##########
FROM nginx:1.27-alpine AS runtime
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/build ./

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

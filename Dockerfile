# This stage builds the svelte application.
# Use the official lightweight Node.js 14 image.
# https://hub.docker.com/_/node
FROM node:14-slim as build-app
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install build-essential python -y

WORKDIR /app
# COPY svelte.config.js svelte.config.cjs
# COPY snowpack.config.js snowpack.config.cjs
COPY package.json .
COPY package-lock.json .
# RUN npm install --no-audit --unsafe-perm
RUN npm ci
COPY . .
ARG COMMIT_SHA=$COMMIT_SHA
RUN NODE_ENV=production COMMIT_SHA=$COMMIT_SHA npm run build

ENV HOST 0.0.0.0
EXPOSE $PORT
# EXPOSE 3000
CMD ["npm", "run", "start"]

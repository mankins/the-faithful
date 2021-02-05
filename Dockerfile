# This stage builds the svelte application.
# Use the official lightweight Node.js 14 image.
# https://hub.docker.com/_/node
FROM node:14-slim as build-app
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install python -y

WORKDIR /app
COPY . .
COPY svelte.config.js svelte.config.cjs
COPY snowpack.config.js snowpack.config.cjs
RUN npm install --no-audit --unsafe-perm
RUN NODE_ENV=production npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]

# This stage builds the svelte application.
# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:14-slim as build-app
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install python -y

WORKDIR /app
COPY . .
COPY svelte.config.js svelte.config.cjs
COPY snowpack.config.js snowpack.config.cjs
RUN npm install --no-audit --unsafe-perm
RUN npm run build

# This stage installs the runtime dependencies.
# FROM node:12-slim as build-runtime
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm ci --production --unsafe-perm
# Not using this method because svelte needs a bunch of dev dependencies to run

# This stage only needs the compiled application
# and the runtime dependencies.
# FROM node:12-slim
# WORKDIR /app
# # COPY --from=build-app /app/build ./build
# # COPY --from=build-app /app/static ./static
# COPY --from=build-app /app/.svelte ./.svelte
# COPY --from=build-runtime /app/node_modules ./node_modules
# COPY --from=build-runtime /app/package.json ./

EXPOSE 3000
CMD ["npm", "run", "start"]

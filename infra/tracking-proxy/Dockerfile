FROM node:12-alpine

RUN mkdir -p /app/infra/tracking-proxy
WORKDIR /app/infra/tracking-proxy
COPY . .

ENV HOST 0.0.0.0
RUN npm ci
EXPOSE $PORT

CMD [ "node", "index.js" ]

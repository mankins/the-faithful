# nginx ingress, used until we can get gzip working at the load balancer or backend
FROM nginx:alpine

WORKDIR /app/infra/ingress
COPY nginx.conf.template .

# ENV PORT 3000
ENV HOST 0.0.0.0
EXPOSE 3000
CMD sh -c "envsubst '\$PORT' < /app/infra/ingress/nginx.conf.template > /app/infra/ingress/nginx.conf && nginx  -c /app/infra/ingress/nginx.conf -g 'daemon off;'"

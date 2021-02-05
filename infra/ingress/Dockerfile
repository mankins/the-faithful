# nginx ingress, used until we can get gzip working at the load balancer or backend
FROM nginx:alpine

WORKDIR /app/infra/ingress
COPY nginx.conf .

EXPOSE 3000
CMD ["nginx", "-c", "/app/infra/ingress/nginx.conf", "-g", "daemon off;"]

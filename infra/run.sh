#¡/bin/bash

/usr/sbin/nginx -c /app/infra/nginx.conf -g "daemon off;" &
exec ./node_modules/.bin/svelte-kit start -p 3001


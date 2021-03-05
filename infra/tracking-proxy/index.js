const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

const server = http.createServer(function (req, res) {
  proxy.web(req, res, {
    target: {
      host: 'mailgun.org',
      port: 80,
    },
  });
});

console.log('tracking proxy listening on port 3000');
server.listen(3000);

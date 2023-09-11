export async function get(req, context) {
  return Promise.resolve({
    status: 200,
    headers: {
      "content-type": "text/plain",
      "cache-control": "no-cache; max-age=0",
    },
    body: 'pong'
  });
};

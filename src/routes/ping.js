export async function get(req, res, next) {
  return Promise.resolve({
    status: 200,
    headers: {
      "content-type": "text/plain",
      "cache-control": "no-cache; max-age=0",
    },
    body: 'ponger'
  });
};

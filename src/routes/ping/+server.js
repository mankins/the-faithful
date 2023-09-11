export async function GET(req, context) {
  return new Response('pong', {
    status: 200,
    headers: {
      'content-type': 'text/plain',
      'cache-control': 'no-cache; max-age=0',
    },
  });
}

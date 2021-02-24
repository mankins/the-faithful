import btoa from 'btoa';
import fetch from 'node-fetch';

const coilClientId = process.env.COIL_CLIENT_ID;
const coilClientSecret = process.env.COIL_CLIENT_SECRET;

const oauthLeg2 = async ({ url, code, redirectUri }) => {
  const b64Auth = btoa(`${coilClientId}:${coilClientSecret}`);

  let data;
  try {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${b64Auth}`,
    };

      const formData = `client_id=${encodeURIComponent(coilClientId)}&client_secret=${encodeURIComponent(coilClientSecret)}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&code=${encodeURIComponent(code)}&client_assertion_type=client_secret_post`;

      const request = {
          body: formData,
          method: 'POST',
          headers,
      };
      console.log({ request });
      const response = await fetch(url, request);
    data = await response.json();
  } catch (error) {
    console.log('err', error);
    data = error;
  }

  console.log({ data });
  return JSON.stringify({ data });
};

export async function get(req, res, next) {
  // 'https://coil.com/oauth/token '

  // curl -X POST https://coil.com/oauth/token \
  //   -H 'Content-Type: application/x-www-form-urlencoded' \
  //   -H 'Authorization: Basic MzE0YWMxMzQt...ZmMzYy00ZDI4U=' \
  //   -d 'code=CU6LG36vKvVmUbF9QWFwj7F5zvY' \
  //   -d '&grant_type=authorization_code' \
  //   -d '&redirect_uri=https://example.com'

  const query = {};
  for (const [key, value] of req.query) {
    // each 'entry' is a [key, value] tupple
    query[key] = value;
  }

    // const body = JSON.stringify(query);

  const body = await oauthLeg2({
    code: query.code,
    url: 'https://coil.com/oauth/token',
    redirectUri: 'http://localhost:5000/oauth/callback',
  });

  return Promise.resolve({
    status: 200,
    headers: {
      'content-type': 'text/plain',
      'cache-control': 'no-cache; max-age=0',
    },
    body,
  });
}

//  http://localhost:5000/oauth/authorize?code=UJqPsF46tA1PCoFKRT66kASq3ks&state=98b32c7e2d754cad8d9d16d8624ec5b0&scope=openid+email+simple_wm

const get = require('lodash.get');

const functions = require('firebase-functions');
const btoa = require('btoa');

const fetch = require('node-fetch');

const getSecrets = require('../../lib/env'); // load environment config
const admin = require('../../lib/firebase');

const secrets = getSecrets('the-faithful');

const getCoilUser = async ({
  access_token,
  url = 'https://api.coil.com/user/info',
}) => {
  let data;
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Bearer ${access_token}`,
  };

  const request = {
    method: 'GET',
    headers,
  };

  const response = await fetch(url, request);
  data = await response.json();

  console.log({ user: data });
  return data;
};

const oauthLeg2 = async ({
  config,
  url = 'https://coil.com/oauth/token',
  code,
}) => {
  let data;

  const coilClientId = config.COIL_CLIENT_ID;
  const coilClientSecret = config.COIL_CLIENT_SECRET;
  const coilRedirectUri =
    config.COIL_REDIRECT_URI || 'https://www.the-faithful.com/oauth/authorize';

  console.log({ config });

  const b64Auth = btoa(
    `${coilClientId.replace('+', '%2b')}:${coilClientSecret.replace(
      '+',
      '%2b'
    )}`
  );

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${b64Auth}`,
  };

  const formData = `code=${encodeURIComponent(
    code
  )}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(
    coilRedirectUri
  )}`;

  const request = {
    body: formData,
    method: 'POST',
    headers,
  };

  const response = await fetch(url, request);
  data = await response.json();

  console.log({ data });
  return data;
};

exports.oauthAuthorize = functions.https.onCall(async (data, context) => {
  const cookies = get(data, 'cookies', {});
  const query = get(data, 'query', {});

  if (cookies._oauth_state !== query.state) {
    throw new functions.https.HttpsError(
      'internal',
      'Internal Error: Auth state does not match',
      {
        error: 'oauth state does not match',
      }
    );
  }

  const config = await secrets;

  let coilUser = {};
  let firebaseToken = {};
  let coilResponse = {};
  try {
    coilResponse = await oauthLeg2({
      config,
      code: query.code,
    });

    // and then get the user info
    console.log({ coilResponse });
    coilUser = await getCoilUser(coilResponse); // {email, sub}

    // create a firebase token / associate with user
      if (coilUser.sub) {
          try {
              const cred = await admin.auth().createUser({
                  email: coilUser.email,
                  uid: coilUser.sub
              });
              console.log({ cred });
            //   await admin.auth.currentUser.linkWithCredential(credential)
          } catch (ee) {
              console.log({ ee, code: ee.code });
              if (ee.code === 'auth/uid-already-exists') {
                  await admin
                      .auth()
                      .updateUser(coilUser.sub, {
                          email: coilUser.email,
                      });
              } else if (ee.code === 'auth/email-already-exists') {
                 // not actually an error
              } else {
                  console.log(`code: ${ee.code}`);
                  throw ee;
              }
          }
          firebaseToken = await admin.auth().createCustomToken(coilUser.sub);          
    }
    // now take the token and store it in firebase user doc
  } catch (e) {
    console.log({ e });
    // return Promise.resolve({
    //   status: 400,
    //   headers: {
    //     'content-type': 'application/json',
    //     'cache-control': 'no-cache; max-age=0',
    //     'set-cookie': '_oauth_state=; path=/; Max-Age=-1;',
    //   },
    //   body: e,
    // });
    throw new functions.https.HttpsError('internal', e.message, {
      error: e,
    });
  }
  if (coilResponse.error) {
    throw new functions.https.HttpsError(
      'internal',
      `${coilResponse.error_description || 'Unknown'}`,
      {
        error: coilResponse.error,
      }
    );
  }
  if (coilUser.error) {
    throw new functions.https.HttpsError(
      'internal',
      `${coilUser.error_description || 'Unknown'}`,
      {
        error: coilUser.error,
      }
    );
  }

  return { firebaseToken, coilUser, coilResponse };
});

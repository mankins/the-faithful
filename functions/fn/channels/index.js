const get = require('lodash.get');

const Ably = require('ably/promises');
const functions = require('firebase-functions');
// const admin = require("../../lib/firebase");

const getSecrets = require('../../lib/env'); // load environment config
// const { shortId } = require('../../lib/short-uuid');
// const { sendEvent } = require('../../lib/events');

const secrets = getSecrets('the-faithful');

const express = require('express');
// const get = require("lodash.get");

// const qs = require('qs');
// const cookieParser = require('cookie-parser')();

const app = express();
//app.use(cookieParser);

let realtime;

const channelToken = async (req, res) => {

  // TODO: send token from client, verify with admin here
  const config = await secrets;

  // we give out a token to everyone coming in from cloud function
  // assumption is that we've auth'd them somehow and this isn't a big risk because tokens are time limited

  if (!realtime) {
    realtime = new Ably.Rest.Promise({ key: config.ABLY_KEY });
  }

  const clientId = 'the-faithful';

  // https://ably.com/documentation/rest/authentication#token-params
  const ttl = 4 * 60 * 60 * 1000;
  const tokenRequest = await realtime.auth.createTokenRequest({
    clientId,
    ttl,
  });

  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST','GET');
  res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.set('Access-Control-Max-Age', '3600');

  return res.status(200).send(tokenRequest);
};

app.all('/', channelToken);
exports.channelToken = functions.https.onRequest(app);

// exports.channelToken2 = functions.https.onCall(async (data, context) => {
//   // let isAdmin = get(data, 'admin', false);
//   const uid = get(context, 'auth.uid');
//   if (!context.auth || !uid) {
//     throw new functions.https.HttpsError(
//       'unauthenticated',
//       'Request had invalid credentials',
//       {
//         error: 'invalid credentials',
//       }
//     );
//   }
//   const email = get(context, 'auth.token.email', 'anonymous');

//   // use the email for clientid if logged in, otherwise uid
//   const clientId = email !== 'anonymous' ? email : uid;

//   const config = await secrets;

//   // we give out a token to everyone coming in from cloud function
//   // assumption is that we've auth'd them somehow and this isn't a big risk because tokens are time limited

//   if (!realtime) {
//     realtime = new Ably.Rest.Promise({ key: config.ABLY_KEY });
//   }

//   // https://ably.com/documentation/rest/authentication#token-params
//   const ttl = 4 * 60 * 60 * 1000;
//   const tokenRequest = await realtime.auth.createTokenRequest({
//     clientId,
//     ttl,
//   });
//   return tokenRequest;
// });

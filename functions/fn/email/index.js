const {PubSub} = require('@google-cloud/pubsub');
const get = require('lodash.get');

const functions = require('firebase-functions');

const fetch = require('node-fetch');

const getSecrets = require('../../lib/env'); // load environment config

const secrets = getSecrets('the-faithful');

const renderers = require('./renderers');
const { sendEmail } = require('./email.js');

const pubsub = new PubSub(); // {projectId}

const emailTopicName = "send-email";

async function publishMessage(data) {
    // Publishes the message as a string
    data._ts = Date.now();
    const dataBuffer = Buffer.from(JSON.stringify(data));
    const messageId = await pubsub.topic(emailTopicName).publish(dataBuffer);
    console.log(`Message ${messageId} published.`);
    return { messageId, data };
};

exports.sendEmailPubSub = functions.pubsub
  .topic(emailTopicName)
  .onPublish(async (message, context) => {
    let eventAge = Date.now() - Date.parse(context.timestamp);
    const eventMaxAge = 60 * 60 * 1000;

    // Ignore events that are too old TODO: is this in context or the payload?
    if (eventAge > eventMaxAge) {
      console.log(`Dropping event ${context.eventId} with age ${eventAge} ms.`);
      return;
    }

    console.log('Processing', context.eventId);

    let payload = {};
    try {
      // Decode the PubSub Message body.
      const rawPayload = message.data
        ? Buffer.from(message.data, 'base64').toString()
        : null;

      payload = JSON.parse(rawPayload);
      if (payload._ts) {
        // check payload timestamp
        eventAge = Date.now() - Date.parse(payload._ts);
        if (eventAge > eventMaxAge) {
          console.log(
            `Dropping event ${context.eventId} with age ${eventAge} ms [from payload]`
          );
          return;
        }
      }

        const out = await sendEmail(payload, { eventId: context.eventId });
        console.log({ out });
    } catch (e) {
      console.log({ e, src: 'pubsub-send-email' });
      throw new Error('error processing send-email');
    }

    console.log({ payload, context });
    return true;
  });

exports.apiEmail = functions.https.onRequest(async (req, res) => {
    console.log({ q: req.query })
    try {
        const result = await publishMessage({ ...req.query });
        return res.status(200).send(result);
    } catch (e) {
        return res.status(500).send(e.code);
    }
});

exports.apiImage = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  const config = await secrets;

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    //functions.logger.info({cors: req}, {structuredData: true});
    res.set('Access-Control-Allow-Methods', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.set('Access-Control-Max-Age', '3600');
    functions.logger.info('cors', { structuredData: true });
    return res.status(204).send('');
    // } else if (req.method === 'GET') {
  }

  const { template = 'plaintext' } = req.query;

  if (renderers[template]) {
    console.log(template, 'query-->', req.query);

    try {
      const surface = await renderers[template].process(req.query);
      if (surface.result) {
        res.set('Content-type', 'image/png');
        return res.status(200).send(surface.result);
      }
    } catch (e) {
        console.log({ e });
      return res.status(500).send(JSON.stringify({ err: { code: e.code } }));
    }
  }

  res.set('Content-type', 'application/json');
  return res.status(404).send(JSON.stringify({ err: { code: 'not-here' } }));
});

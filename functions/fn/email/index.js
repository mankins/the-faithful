const functions = require('firebase-functions');
require('../../lib/firebase');

const { PubSub } = require('@google-cloud/pubsub');
const get = require('lodash.get');


// const fetch = require('node-fetch');

const getSecrets = require('../../lib/env'); // load environment config

const secrets = getSecrets('the-faithful');

const mailgunJs = require('mailgun-js');

let mailgun;

const renderers = require('./renderers');
const { sendEmail, composeEmail } = require('./email.js');
const { sendEvent } = require('../../lib/events');

const pubsub = new PubSub({ projectId: 'the-faithful' }); // {projectId}

const TOPIC_EMAIL = 'send-email';
const CREATE_TOPIC_EMAIL = false;

async function publishMessage(data) {
  // Publishes the message as a string
  if (CREATE_TOPIC_EMAIL) {
    const [topic] = await pubsub.createTopic(TOPIC_EMAIL);
    console.log(`Topic ${topic.name} created.`);
  }

  data._ts = Date.now();
  const dataBuffer = Buffer.from(JSON.stringify(data));
  const messageId = await pubsub.topic(TOPIC_EMAIL).publish(dataBuffer);
  console.log(`Message ${messageId} published.`);
  return { messageId, data };
}

exports.sendEmailPubSub = functions.pubsub
  .topic(TOPIC_EMAIL)
  .onPublish(async (message, context) => {
    let eventAge = Date.now() - Date.parse(context.timestamp);
    const eventMaxAge = 60 * 60 * 1000;

    // Ignore events that are too old TODO: is this in context or the payload?
    if (eventAge > eventMaxAge) {
      console.log(`Dropping event ${context.eventId} with age ${eventAge} ms.`);
      return;
    }

    console.log('Processing', context);

    let payload = {};
    let events = [];
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

      const email = payload.email;
      const msgParams = {
        templateName: payload.template,
        email,
        to: payload.to || email,
        name: payload.name || '',
      };
      console.log('calling sendemail', { payload, msgParams });
      const out = await sendEmail(payload, msgParams);
      console.log({ out });
      // event: consumer charged
      events.push(
        sendEvent(
          {
            payload,
            response: { ...out, via: 'mg' },
            _email: email,
          },
          {
            topic: 'email.sent',
            source: 'api.email',
            email: payload.to,
          }
        )
      );
    } catch (e) {
      console.log(e.code);
      if (e.code !== 'invalid email format') {
        console.log({ e, src: 'pubsub-send-email' });
        throw new Error(`error processing send-email ${e}`);
      }
    }

    // send in ||
    await Promise.all(events);

    console.log({ payload, context });
    return true;
  });

exports.webhookMailgun = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('bad method');
  }

  const config = await secrets;

  if (!mailgun) {
    // init
    mailgun = mailgunJs({
      apiKey: config.MAILGUN_PRIVATE,
      domain: 'elvis.the-faithful.com',
    });
  }

  const body = req.body;
  console.log({ body });

    let signatureOk = true;
    
  if (!mailgun.validateWebhook(parseInt(body.timestamp,10), body.token, body.signature)) {
    // console.error('Request came, but not from Mailgun');
    // res.status(400).send({ error: { message: 'Invalid signature' } });
    // return;
      signatureOk = false; // TODO: make the above work when validated
  }

  // valid, add to events
  const email = get(body, 'event-data.recipient') || get(body, 'event-data.message.headers.to');

  const ev = {
    _email: email,
      ...body['event-data'],
    _sigOk: signatureOk 
  };

  console.log({ ev });

  sendEvent(ev, {
    topic: 'email.events',
    source: 'api.email.mg',
    email,
  });
    
    return res.status(200).send('ok');
});

exports.apiEmail = functions.https.onRequest(async (req, res) => {
//   console.log({ q: req.query });
  const payload = { ...req.query };

  if (req.query.preview) {
    try {
      const email = payload.email;
      const msgParams = {
        templateName: payload.template,
        email,
        to: payload.to || email,
        name: payload.name || '',
      };
      console.log('calling composeemail', { payload, msgParams });
      const composed = await composeEmail(payload, msgParams);
      return res.status(200).send(composed.rendered.html);
    } catch (e) {
      return res.status(500).send(e.code);
    }
  } else {
    try {
      const result = await publishMessage(payload);
      return res.status(200).send(result);
    } catch (e) {
      return res.status(500).send(e.code);
    }
  }
});

exports.apiImage = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  //   const config = await secrets;

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

  const { template } = req.query;

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

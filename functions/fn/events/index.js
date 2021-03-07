const express = require('express');
// const get = require("lodash.get");

const functions = require('firebase-functions');
// const admin = require("../../lib/firebase");

const qs = require('qs');
const cookieParser = require('cookie-parser')();

const { TRANSPARENT_GIF_BUFFER } = require('../../lib/gif');
const { decodeJwt, signJwt } = require('../../lib/jwt');
const {
  processEvents,
  storeEvent,
  MAX_PAYLOAD_ITEMS,
} = require('../../lib/events');

const app = express();
app.use(cookieParser);

exports.eventsFirehosePubSub = functions.pubsub
  .topic('events')
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

      payload = await storeEvent(payload, { eventId: context.eventId });
    } catch (e) {
      console.log({ e, src: 'pubsub-firehose' });
      throw new Error('error processing event');
    }

    console.log({ payload, context });
    return true;
  });

// ^^^ that writes to big query / streaming / figures out the right table for the topic
// data may be extracted from the json input if it needs to be? or just stored as a document
// columns timestamp, document(rawJSON)

const getEventsFromQuery = (req) => {
  const events = [];

  if (req.query.data && req.query.data.length) {
    const data = JSON.parse(req.query.data);
    if (data && data.length) {
      if (data > MAX_PAYLOAD_ITEMS) {
        throw new Error('request too large');
      }
      data.forEach((event) => {
        events.push(event);
      });
    }
  }

  if (Object.keys(req.query).length >= 1) {
    // we want to support a single query string event, supporting dot notation for nested.things
    // /api/event?country.state=florida&country.name=usa => {country:{name:"usa", state:"florida"}}
    const queryString = req.originalUrl.substr(
      req.originalUrl.indexOf('?') + 1
    ); // recompose query string. TODO: A bit silly? better way?

    const newEvent = qs.parse(queryString, { allowDots: true });
    if (newEvent && Object.keys(newEvent).length) {
      delete newEvent.data; // json data gets stripped out TODO: ideally this variable would be called `_data` and then this isn't needed

      // remove any "private _variables"
      Object.keys(newEvent).forEach((k) => {
        if (k.startsWith('_')) {
          delete newEvent[k];
        }
      });

      if (Object.keys(newEvent).length) {
        events.push(newEvent);
      }
    }
  }

  console.log('---------', { events });
  return events;
};

const getHeadersFilter = (req) => {
  if (req.query._headers && req.query._headers === '*') {
    return ['*']; // store all headers
  }

  if (req.query._headers && req.query._headers === '^') {
    return []; // store none
  }

  if (req.query._headers) {
    return req.query._headers.split(','); // store only specfic headers
  }

  return ['host', 'accept-language']; // default
};

const getContextFromRequest = async (req) => {
  const { headers } = req;
  const ip = (
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    ''
  ).split(',')[0];

  const cookies = req.cookies || {};

  const referrer = req.get('Referrer') || ''; // spelled two ways, this takes care of it for us

  let segments = [];
  if (req.cookies.segments) {
    segments = req.cookies.segments.split('|');
  }

  const topic = req.query._topic || 'events'; // this topic is applied globally if each event doesn't have a _topic

  // if we have a jwt and it's signed, we add that to our context
  let payloadContext = {};
  if (req.cookies.ev) {
    try {
      const decoded = await decodeJwt(req.cookies.ev);
      payloadContext = { ...decoded.payload };
    } catch (e) {
      console.log({ e });
    }
  } else {
    const thing = await signJwt({ source: 'internal-api-todo' });
    console.log({ thing });
  }

  console.log({ payloadContext });
  let source = payloadContext.source ? payloadContext.source : 'web';

  const context = {
    cookies,
    headers,
    headersFilter: getHeadersFilter(req),
    ip,
    referrer,
    segments,
    source,
    topic,
    ...payloadContext,
  };

  return context;
};

const eventsIn = async (req, res) => {
  // eventsIn: http -> pubsub gateway
  // add event to main pubsub topic
  // and optionally to any known repeater pseudo-topics that need pubsub triggers (manually added here)

  // subscribers (another fn) will then write to bigquery:
  // allows us to have unique schemas per-topic
  // as well as be able to see all events
  // main firehose will write to bigquery one table per topic

  res.set('Access-Control-Allow-Origin', '*');
  res.set('Cache-Control', 'no-store, max-age=0');

  if (req.query._api !== 'anAy') {
    return res.status(401).send('bad api key');
  }

  const context = await getContextFromRequest(req);

  switch (req.method) {
    case 'GET':
      // allow us to shut off older clients by changing this

      try {
        const events = getEventsFromQuery(req);
        await processEvents(events, context);
      } catch (e) {
        return handleErrors(e, res);
      }

      handleResponse(req, res);
      break;

    case 'POST':
      try {
        await processEvents(req.body, context);
      } catch (e) {
        return handleErrors(e, res);
      }

      handleResponse(req, res);
      break;

    case 'OPTIONS':
      // Send response to OPTIONS requests
      //functions.logger.info({cors: req}, {structuredData: true});
      res.set('Access-Control-Allow-Methods', 'POST');
      res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
      res.set('Access-Control-Max-Age', '3600');
      // functions.logger.info("cors", { structuredData: true });
      return res.status(204).send('');

    default:
      return res.status(404).send('');
  }
};

app.all('/', eventsIn);
exports.eventsIn = functions.https.onRequest(app);

const handleResponse = (req, res) => {
  if (req.query._redir) {
    // allow redirect instead of invisible gif
    const location = req.query._redir;
    return res.redirect(302, location);
  }

  if (req.query._dev || process.env.NODE_ENV === 'dev') {
    // when we debug this is easier to see
    // we send back a 1x1 pixel and use the 200 status code
    res.set('Content-Type', 'image/gif');
    return res.end(TRANSPARENT_GIF_BUFFER, 'binary');
  }

  // default, no content, 204 status code
  // NB: your browser status bar may not update. use query string parameter _dev=1 to override
  return res.status(204).send('');
};

const handleErrors = (e, res) => {
  if (e.message === 'request too large') {
    console.log('request too large');
    res.set('Content-Type', 'image/gif');
    return res.status(413).end(TRANSPARENT_GIF_BUFFER, 'binary');
  }

  console.log(e);
  res.set('content-type', 'text/plain');
  return res.status(500).send(`error ${e.message}`);
};

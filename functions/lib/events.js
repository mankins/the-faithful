const flatten = require('flat');
const { PubSub } = require('@google-cloud/pubsub');
const stringify = require('json-stable-stringify');
const { sha1UrlSafe } = require('./hasher');

const admin = require('./firebase');
const { decorateEvent } = require('./decorators');
const { dePrefix } = require('./id-utils');

const MAX_PAYLOAD_LENGTH = 40960;

// if in this list, the event is relayed to both the main firehose and this topic
const ALLOWED_TOPICS = [
  //        'events.thing'
];

const pubSubClient = new PubSub();

const MAX_PAYLOAD_ITEMS = 99;
exports.MAX_PAYLOAD_ITEMS = MAX_PAYLOAD_ITEMS;

exports.storeEvent = async (payload) => {
  // the archive table is for storing the raw data
  // minimal columns here
  const flattenedPayload = flatten(payload);
  const fingerprint =
    payload._payload_hash || sha1UrlSafe(stringify(flattenedPayload));

  const db = admin.firestore();

  // add to general event table in firebase
  await db.doc(`events/${fingerprint}`).set(flattenedPayload);

  if (payload._email) {
    // write to user's colleciton too
    const userPayload = {
      ...payload.payload,
      _ts: payload._ts,
      _source: payload._source,
      _topic: payload._topic,
    };

    await db
      .doc(`email/${payload._email}/events/${fingerprint}`)
      .set(userPayload);
  }

  //   >  {
  //     >    payload: {
  //     >      _cookies: {},
  //     >      _device: 'desktop',
  //     >      '_geo.city': 'Miami',
  //     >      '_geo.country': 'US',
  //     >      '_geo.eu': false,
  //     >      '_geo.ip': '',
  //     >      '_geo.ll.0': 25.7207,
  //     >      '_geo.ll.1': -80.2776,
  //     >      '_geo.metro': 528,
  //     >      '_geo.region': 'FL',
  //     >      '_geo.timezone': 'America/New_York',
  //     >      '_headers.accept-language': 'en-US,en;q=0.9, fr,q=1',
  //     >      '_headers.host': 'localhost:5001',
  //     >      _payload_hash: 'LZSpm22aR9KI8eLm0U5PFjAR87g=',
  //     >      _segments: [],
  //     >      _source: 'web',
  //     >      _topic: 'events',
  //     >      _ts: '2021-01-27T11:46:13.572Z',
  //     >      'payload.hi': true
  //     >    },
  //     >    context: {
  //     >      eventId: '679074da-afc6-46dc-8762-c4430171a021',
  //     >      resource: 'projects/tktk/topics/events',
  //     >      eventType: 'google.pubsub.topic.publish',
  //     >      timestamp: '2021-01-27T11:46:13.000000000Z',
  //     >      params: {}
  //     >    }
  //     >  }

  return flattenedPayload;
};

// process an array of events, sending along to our event stream
const processEvents = async (events, context) => {
  if (process.env.LOG_EVENTS || process.env.NODE_ENV === 'dev') {
    console.log(
      `Received events (total: ${events.length}): ${JSON.stringify(events)}`
    );
  }

  if (events.length > MAX_PAYLOAD_ITEMS) {
    throw new Error('request too large');
  }

  await Promise.all(
    events.map(async (event) => {
      const { eventStringified } = await decorateEvent(event, context);

      // console.log(decoratedEvent);
      const topics = ['events']; // always send to events
      const topic = `${event._topic || context.topic || 'events'}`;

      if (ALLOWED_TOPICS.indexOf(topic) !== -1) {
        // sometimes also relay here too.
        topics.push(topic);
      }

      if (eventStringified.length > MAX_PAYLOAD_LENGTH) {
        throw new Error('request too large'); // NB: rejects all. Better to just skip this one silently? Currently think: Better to error all
      }

      const dataBuffer = Buffer.from(eventStringified);

      await Promise.all(
        topics.map(async (topicName) => {
          try {
            const messageId = await pubSubClient
              .topic(topicName)
              .publish(dataBuffer);
            console.log(`Message ${messageId} published.`);
          } catch (e) {
            if (e.code === 5) {
              console.log('warning: topic not found', topicName);
              throw new Error(`topic '${topicName}' not found`);
            } else {
              console.log(e.message, e.code);
              throw new Error(e.message);
            }
          }
        })
      );
    })
  );
};
exports.processEvents = processEvents;

// simple interface for sending a single event
exports.sendEvent = async (ev, context) => {

  return await processEvents([ev], {
    headers: {},
    cookies: {},
    headersFilter: [],
    ip: '',
    referrer: '',
    segments: [],
    source: 'unknown',
    topic: 'events',
    ...context,
  });
};


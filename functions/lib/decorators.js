/*
 *  Event decoration with:
 *     _geo     geographic info of request
 *     _ref     page referrer, parsed into url parts
 *     _rid     request id, unique per event
 *     _ts      timestamp
 *     _ua      user agent (browser)
 *     _uid     user id
 */

const { parse } = require('url');
const memoize = require('memoizee');
const { lookup } = require('geoip-lite'); // NB: this requires 512MB+ memory to be fast
const { UAParser } = require('ua-parser-js');
const stringify = require('json-stable-stringify');
const acceptLanguageParser = require('accept-language-parser');

const { shortId } = require('./short-uuid');
const { deviceType } = require('./device-type');
const { sha1UrlSafe } = require('./hasher');

// we memoize common lookups, trading off memory for performance. Longer cache time for things with fewer values
const deviceDetector = memoize(deviceType, {
  maxAge: 60 * 1000,
});

const geoLookup = memoize(lookup, {
  maxAge: 15 * 1000,
});

const userAgentParser = memoize(
  (ua) => {
    const parser = new UAParser(ua);
    const uaResult = parser.getResult();
    return {
      ua: uaResult.ua,
      browser: {
        ...uaResult.browser,
      },
      os: {
        ...uaResult.os,
      },
    };
  },
  {
    maxAge: 5 * 60 * 1000,
  }
);

const urlParser = memoize(parse, {
  maxAge: 5 * 1000,
});

// each event goes through these transformation stages
const getTransforms = (_event, context) => ({
  _cookies: (val) => {
    if (val && typeof val === 'boolean') {
      // includes all cookies
      return context.cookies;
    }
    if (val && Array.isArray(val)) {
      // includes selected cookies: _cookies: ['CN_xid','xid1']
      const cookies = {};
      val.forEach((name) => {
        cookies[name] = context.cookies[name];
      });

      return cookies;
    }
    return val;
  },
  _device: (val) => {
    if (val && typeof val === 'boolean') {
      return deviceDetector(context.headers['user-agent']);
    }
  },
  _headers: (val) => {
    // includes selected headers: _headers: ['x-foo','accept']
    const headers = {};
    if (val.includes('*')) {
      // everything
      return context.headers;
    }
    // filter
    val.forEach((name) => {
      if (context.headers[name]) {
        headers[name] = context.headers[name];
      }
    });
    return headers;
  },
  _geo: (val) => {
    if (val && typeof val === 'boolean') {
      const geoInfo = geoLookup(context.ip);
      if (geoInfo) {
        const loc = {
          city: geoInfo.city,
          country: geoInfo.country,
          eu: geoInfo.eu !== '0',
          ip: context.ip,
          ll: geoInfo.ll,
          metro: geoInfo.metro,
          region: geoInfo.region,
          timezone: geoInfo.timezone,
        };

        // remove anything empty
        if (!loc.metro) {
          delete loc.metro; // intentionally removes 0 too
        }
        if (!loc.region) {
          delete loc.region;
        }
        if (!loc.timezone) {
          delete loc.timezone;
        }
        if (!loc.city) {
          delete loc.city;
        }

        return loc;
      }
      return {
        ip: context.ip,
      };
    }
  },
  _lang: (val) => {
    if (
      val &&
      typeof val === 'boolean' &&
      context.headers &&
      context.headers['accept-language']
    ) {
      return acceptLanguageParser.parse(
        context.headers['accept-language'] || 'en-us'
      );
    }
  },
  _ref: (val) => {
    let ref = val;
    if (ref && typeof ref === 'boolean') {
      // automatically set to referrer if requested
      ref = context.referrer;
    }

    if (ref && typeof ref === 'string') {
      // convert any url to its parts
      ref = urlParser(ref || '', true);
    }

    return ref;
  },
  _rid: (val) =>
    // unique per event
    val && typeof val === 'boolean' ? shortId() : null,
  _topic: (val) =>
    // use per-event topic first, fall back to context topic
    val || context.topic,
  _ts: (val) => val || new Date().toISOString(),
  _ua: (val) => {
    if (
      val &&
      typeof val === 'boolean' &&
      context.headers &&
      context.headers['accept-language']
    ) {
      return userAgentParser(context.headers['user-agent']);
    }
  },
  _segments: (val) =>
    // segments a user is in at the moment
    val && typeof val === 'boolean' ? context.segments : null,
  // _sid: (val: unknown) =>
  //   // session, resets with browser reloads
  //   val && typeof val === 'boolean' ? context.cookies.mt_sid : null,
  _source: (val) =>
    // source
    val && typeof val === 'boolean' ? context.source : 'unknown',
  _uid: (val) =>
    // uid
    val && typeof val === 'boolean' ? context.uid : null,
    _email: (val) =>
    // email
    val && typeof val === 'boolean' ? context.email : null,
});

exports.decorateEvent = async (payload, context) => {
  // setup default values
  const decoratorParams = {
    // _cookies: ['thing_m'],
    _cookies: payload._cookies || [],
    _device: true, // not overwritabble
    _geo: true,
    _headers: context.headersFilter, // which headers should we add?
    _ref: true,
    _lang: false,
    _segments: true,
    _topic: payload._topic || context.topic,
    _ua: false,
    _source: true,
    _uid: true,
    _email: true,
  };
  let decoratedEvent = { ...decoratorParams };

  // each event passes through these transforms to see if anything should be added to our event object
  const transforms = getTransforms(payload, context);

  // apply transforms
  decoratedEvent = Object.keys(transforms).reduce((acc, transformKey) => {
    const result = transforms[transformKey](decoratorParams[transformKey]);
    if (result) {
      acc[transformKey] = result;
    } else {
      delete acc[transformKey];
    }
    return acc;
  }, decoratedEvent);

  const payloadStringified = stringify(payload); // deterministic version of JSON.stringify() so you can get a consistent hash from stringified results

  const _event = {
    payload,
    _payload_hash: sha1UrlSafe(payloadStringified), // so we can fingerprint raw event that might come in via query params for re-play
    ...decoratedEvent,
  };

  if (!_event._uid) {
    delete _event._uid;
  }

  const eventStringified = stringify(_event); // deterministic version of JSON.stringify() so you can get a consistent hash from stringified results
  return Promise.resolve({ decoratedEvent: _event, eventStringified });
};

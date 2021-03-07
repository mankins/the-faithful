const env = require('./env'); // load environment config
const jwt = require('jsonwebtoken');

exports.signJwt = async (payload, meta = {}) => {
  return env()
    .then((config) => {
      meta.expiresIn = meta.expiresIn || '1d';

      const token = jwt.sign(
        {
          payload,
        },
        config.API_JWT_KEY || 'CHANGEMEshhhhh!', // HMAC SHA256
        meta
      );

      return token;
    })
    .catch((e) => {
      console.log({ e });
    });
};

exports.decodeJwt = async (token) => {
  return env()
    .then((config) => {
      const secret = config.API_JWT_KEY || 'CHANGEMEshhhhh!';
      if (secret === 'CHANGEMEshhhhh!') {
        console.warn('using default jwt. unsecure');
      }

      return jwt.verify(token, secret);
    })
    .catch((err) => {
      console.log({ err });
    });
};

// Convert from ascii base64 to original string
const atob = (val) => {
  return Buffer.from(val, 'base64').toString();
};
exports.atob = atob;

const btoa = (val) => {
  return Buffer.from(val).toString('base64');
};
exports.btoa = btoa;

/**
 *
 * @param {string} token - The JWT string
 * @returns {object} - payload
 */
exports.peekJwt = (token) => {
  let parsed = {};
  if (token.indexOf('.') !== -1) {
    try {
      parsed = JSON.parse(
        atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
      );
    } catch (e) {
      console.log('parse error', e);
    }
  }

  return parsed;
};

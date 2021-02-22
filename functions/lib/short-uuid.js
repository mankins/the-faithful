const UuidEncoder = require('uuid-encoder');
const uuid = require('uuid');

const shortId = () => {
  const encoder = new UuidEncoder('base58');
  return encoder.encode(uuid.v1());
};

module.exports = { shortId };

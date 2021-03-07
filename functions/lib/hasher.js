const crypto = require('crypto');
const safeB64 = require('url-safe-base64');

const sha1 = (data) => {
  const shasum = crypto.createHash('sha1');
  shasum.update(data);
  return shasum.digest('base64');
};
exports.sha1 = sha1;

exports.sha1UrlSafe = (data) => {
  return safeB64.encode(sha1(data));
};

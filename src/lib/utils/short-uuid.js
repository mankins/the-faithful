import { v1 as uuid } from 'uuid';
import UuidEncoder from '$lib/patched/uuid-encoder/lib';

const encoder = new UuidEncoder('base58');

const shortId = function() {
  return encoder.encode(uuid());
};

export {
  shortId
};

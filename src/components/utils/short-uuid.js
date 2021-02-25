import UuidEncoder from 'uuid-encoder';
import uuid from 'uuid';

const shortId = () => {
  const encoder = new UuidEncoder('base58');
  return encoder.encode(uuid.v1());
};

export { shortId };

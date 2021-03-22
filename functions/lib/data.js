const get = require('lodash.get');

// 19th - 2pm
//      - 7pm
// 20th - 2pm
//      - 7pm
// 21st - 2pm
//      - 7pm
// 23rd -> 30th anytime

const PRODUCTS = {
  'cinema-premiere': {
    product: 'cinema-premiere',
    productTitle: 'Virtual Premiere Opening - The Faithful',
    quantity: 1,
    productId: 'video:thefaithful:20210319:1900',
    variations: [
      {
        id: 'video:thefaithful:20210319:1400',
        name: 'Virtual Premiere Opening - The Faithful',
        description: 'March 19, 2021 at 2:00pm',
      },
      {
        id: 'video:thefaithful:20210319:1900',
        name: 'Virtual Premiere Opening - The Faithful',
        description: 'March 19, 2021 at 7:00pm',
      },
      {
        id: 'video:thefaithful:20210320:1400',
        name: 'Virtual Premiere Weekend - The Faithful',
        description: 'March 20, 2021 at 2:00pm',
      },
      {
        id: 'video:thefaithful:20210320:1900',
        name: 'Virtual Premiere Weekend - The Faithful',
        description: 'March 20, 2021 at 7:00pm',
      },
      {
        id: 'video:thefaithful:20210321:1400',
        name: 'Virtual Premiere Weekend - The Faithful',
        description: 'March 21, 2021 at 2:00pm',
      },
      {
        id: 'video:thefaithful:20210321:1900',
        name: 'Virtual Premiere Weekend - The Faithful',
        description: 'March 21, 2021 at 7:00pm',
      },
    ],
    price: { currency: 'usd', amount: 1250 },
  },
  'cinema-virtual': {
    product: 'cinema-virtual',
    productId: 'video:thefaithful:20210320:1900',
    productTitle: 'Virtual Premiere Weekend - The Faithful',
    quantity: 1,
    variations: [
      {
        id: 'video:thefaithful:20210320:1400',
        name: 'Virtual Premiere Weekend - The Faithful',
        description: 'March 20, 2021 at 2:00pm',
      },
      {
        id: 'video:thefaithful:20210320:1900',
        name: 'Virtual Premiere Weekend - The Faithful',
        description: 'March 20, 2021 at 7:00pm',
      },
      {
        id: 'video:thefaithful:20210321:1400',
        name: 'Virtual Premiere Weekend - The Faithful',
        description: 'March 21, 2021 at 2:00pm',
      },
      {
        id: 'video:thefaithful:20210321:1900',
        name: 'Virtual Premiere Weekend - The Faithful',
        description: 'March 21, 2021 at 7:00pm',
      },
    ],
    price: { currency: 'usd', amount: 750 },
  },
  'cinema-stream': {
    product: 'cinema-stream',
    productId: 'video:thefaithful:streaming',
    productTitle: 'Streaming Access - The Faithful',
    quantity: 1,
    variations: [
      {
        id: 'video:thefaithful:streaming',
        name: 'Streaming Access - The Faithful',
        description: 'Access anytime',
      }
    ],
    price: { currency: 'usd', amount: 500 },
  },
};

const getProduct = (type, variationId) => {
  let product = PRODUCTS[type] || {};

  if (variationId) {
    product.productId = variationId;
  }

  return { ...product };
};

const getProductDescription = (type, variationId) => {

  let item = getProduct(type, variationId);

  // look for variation description
  let description = '';

  let variations = get(item, 'variations', []);
  variations.forEach((variation) => {
    if (get(variation, 'id') === variationId) {
      description = get(variation, 'description');
    }
  });

  return `${description}`;
};

const getProductName = (type, variationId) => {

  let item = getProduct(type, variationId);

  // look for variation name
  let name = '';

  let variations = get(item, 'variations', []);
  variations.forEach((variation) => {
    if (get(variation, 'id') === variationId) {
      name = get(variation, 'name');
    }
  });

  return `${name}`;
};

// export { PRODUCTS, getProduct, getProductDescription, getProductName };
module.exports = { PRODUCTS, getProduct, getProductDescription, getProductName };

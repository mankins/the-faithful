const get = require('lodash.get');

// 19th - 3pm
//      - 8pm
// 20th - 3pm
//      - 8pm
// 21st - 3pm
//      - 8pm
// 23rd -> 30th anytime

const PRODUCTS = {
  'cinema-premiere': {
    product: 'cinema-premiere',
    productTitle: 'Cinema Premiere - The Faithful',
    quantity: 1,
    productId: 'video:thefaithful:20210319:2000',
    variations: [
      {
        id: 'video:thefaithful:20210319:1500',
        name: 'Cinema Premiere - The Faithful',
        description: 'March 19, 2021 at 3:00pm',
      },
      {
        id: 'video:thefaithful:20210319:2000',
        name: 'Cinema Premiere - The Faithful',
        description: 'March 19, 2021 at 8:00pm',
      },
    ],
    price: { currency: 'usd', amount: 1250 },
  },
  'cinema-virtual': {
    product: 'cinema-virtual',
    productId: 'video:thefaithful:20210320:2000',
    productTitle: 'Virtual Viewing - The Faithful',
    quantity: 1,
    variations: [
      {
        id: 'video:thefaithful:20210320:1500',
        name: 'Virtual Viewing - The Faithful',
        description: 'March 20, 2021 at 3:00pm',
      },
      {
        id: 'video:thefaithful:20210320:2000',
        name: 'Virtual Viewing - The Faithful',
        description: 'March 20, 2021 at 8:00pm',
      },
      {
        id: 'video:thefaithful:20210321:1500',
        name: 'Virtual Viewing - The Faithful',
        description: 'March 21, 2021 at 3:00pm',
      },
      {
        id: 'video:thefaithful:20210321:2000',
        name: 'Virtual Viewing - The Faithful',
        description: 'March 21, 2021 at 8:00pm',
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
        name: 'Steaming Access - The Faithful',
        description: 'March 23 to April 30, 2021',
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

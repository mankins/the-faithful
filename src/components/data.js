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

export { PRODUCTS, getProduct };

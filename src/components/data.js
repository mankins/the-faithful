const PRODUCTS = {
  'cinema-premiere': {
    product: 'cinema-premiere',
    productTitle: 'Cinema Premiere',
    quantity: 1,
    variations: [
      {
        id: 'video:premiere:20210319:2000',
        description: 'March 19, 2021 at 8:00pm',
      },
      {
        id: 'video:premiere:20210319:1400',
        description: 'March 19, 2021 at 2:00pm',
      },
    ],
    price: { currency: 'usd', amount: 1250 },
  },
  'cinema-virtual': {
    product: 'cinema-virtual',
    productTitle: 'Virtual Viewing Event',
    quantity: 1,
    variations: [
      {
        id: 'video:premiere:20210320:2000',
        description: 'March 20, 2021 at 8:00pm',
      },
      {
        id: 'video:premiere:20210320:1400',
        description: 'March 20, 2021 at 2:00pm',
      },
    ],
    price: { currency: 'usd', amount: 750 },
  },
};

const getProduct = (type) => {
  return PRODUCTS[type];
};

export { PRODUCTS, getProduct };

const get = require('lodash.get');

const functions = require('firebase-functions');
const { Stripe } = require('stripe');

// const fetch = require('node-fetch');

const getSecrets = require('../../lib/env'); // load environment config

const secrets = getSecrets('the-faithful');

let _stripe;

const stripeConfig = async () => {
  const config = await secrets;

  const conf = {
    // TODO: these are the test mode keys. It's currently unclear how to get this to deploy correctly without hard coding?
    pub: config.STRIPE_PUBLIC,
    secret: config.STRIPE_SECRET,
    webhook: config.STRIPE_WEBHOOK,
    //            ...functions.config().stripe,
  };

  // console.log({ conf });
  return conf;
};

const stripe = async () => {
  const _stripeConfig = await stripeConfig();

  if (typeof _stripe !== 'undefined') {
    return { _stripe, config: _stripeConfig };
  }

  _stripe = new Stripe(_stripeConfig.secret, {
    apiVersion: '2020-08-27',
  });

  return { _stripe, config: _stripeConfig };
};

exports.stripeCheckoutSession = functions.https.onCall(
  async (data, context) => {
    const items = get(data, 'items', '[]');
    const baseUrl = get(data, 'base', 'https://www.the-faithful.com');

    // TODO: get url of this request and use it to form the baseUrl
    // console.log({ todo: context });

    // const items = JSON.parse(rawItems); // allow to fail if bad input

    if (!items || items.length <= 0) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'missing items',
        {
          error: 'items not found',
        }
      );
    }

    const config = await secrets;
    const stripeProps = await stripe();
    const { _stripe } = stripeProps;

    const lineItems = [];

    // [
    //     {
    //       price_data: {
    //         currency: 'usd',
    //         product_data: {
    //           name: 'T-shirt',
    //         },
    //         unit_amount: 2000,
    //       },
    //       quantity: 1,
    //     },
    //   ],

    // var input = [
    //   {
    //     product: 'cinema-virtual',
    //     productTitle: 'Virtual Viewing Event',
    //     quantity: 2,
    //     variations: [
    //       {
    //         id: 'video:premiere:20210320:2000',
    //         description: 'March 20, 2021 at 8:00pm',
    //       },
    //       {
    //         id: 'video:premiere:20210320:1400',
    //         description: 'March 20, 2021 at 2:00pm',
    //       },
    //     ],
    //     price: { currency: 'usd', amount: 750 },
    //     selected: 'video:premiere:20210320:1400',
    //   },
    //   {
    //     product: 'cinema-premiere',
    //     productTitle: 'Cinema Premiere',
    //     quantity: 1,
    //     variations: [
    //       {
    //         id: 'video:premiere:20210319:2000',
    //         description: 'March 19, 2021 at 8:00pm',
    //       },
    //       {
    //         id: 'video:premiere:20210319:1400',
    //         description: 'March 19, 2021 at 2:00pm',
    //       },
    //     ],
    //     price: { currency: 'usd', amount: 1250 },
    //     selected: 'video:premiere:20210319:2000',
    //   },
    // ];

    items.forEach((item) => {
      const stripeItem = {};
      stripeItem.quantity = item.quantity || 1;
      stripeItem.price_data = {};
      stripeItem.price_data.currency = get(item, 'price.currency', 'usd');
      stripeItem.price_data.unit_amount = get(item, 'price.amount', 100);
      stripeItem.price_data.product_data = {};
      stripeItem.price_data.product_data.name = get(
        item,
        'productTitle',
        'Ticket'
      );

      lineItems.push(stripeItem);
    });

    const session = await _stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/api/stripe/checkout-success`,
      cancel_url: `${baseUrl}/api/stripe/checkout-cancel`,
    });
        console.log({ stripeProps: stripeProps.config.pub });

    return { id: session.id, stripePubKey: stripeProps.config.pub };
  }
);

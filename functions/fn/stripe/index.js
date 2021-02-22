const get = require('lodash.get');

const functions = require('firebase-functions');
const { Stripe } = require('stripe');

// const fetch = require('node-fetch');

const getSecrets = require('../../lib/env'); // load environment config
const { formatCurrency } = require('../../lib/i18n');
const { shortId } = require('../../lib/short-uuid');
const admin = require('../../lib/firebase');

const { getProductName, getProductDescription } = require('../../lib/data');

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

    const productIds = {};

    items.forEach((item) => {
      productIds[item.productId] = true;

      const stripeItem = {};
      stripeItem.quantity = item.quantity || 1;
      stripeItem.price_data = {};
      stripeItem.price_data.currency = get(item, 'price.currency', 'usd');
      stripeItem.price_data.unit_amount = get(item, 'price.amount', 100);
      stripeItem.price_data.product_data = {};

      const description = getProductDescription(item.product, item.productId);
      stripeItem.price_data.product_data.description = description;

      const name = getProductName(item.product, item.productId);
      stripeItem.price_data.product_data.name = name;

      console.log(JSON.stringify(stripeItem, null, 2));

      lineItems.push(stripeItem);
    });

    const metadata = {};
    metadata.products = JSON.stringify(Object.keys(productIds)); // array of video:thing shiro

    const session = await _stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      allow_promotion_codes: true,
      line_items: lineItems,
      metadata,
      mode: 'payment',
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel?session_id={CHECKOUT_SESSION_ID}`,
    });
    // console.log({ stripeProps: stripeProps.config.pub });
    // http://localhost:5000/checkout/success?session_id=cs_test_b1VppFxojQNZyu708HCLeA3UCByepbbsQaf3FJQfvuxZ3jHd3EYluDK12s
    //http://localhost:5000/checkout/success?session_id=cs_test_b1tsZsr6H1xwb9Wcio5HSXq8i4GEiBYyxecLvb39323VfxTVMb2ZOTP04z
    return { id: session.id, stripePubKey: stripeProps.config.pub };
  }
);

exports.stripeCheckoutSuccess = functions.https.onCall(
  async (data, context) => {
    const sessionId = get(data, 'sessionId', '');

    const stripeProps = await stripe();
    const { _stripe } = stripeProps;

    const uid = get(context, 'auth.uid');
    console.log(`----UID-----${uid}-------UID------`);
    // verify Firebase Auth ID token and presence of UID
    if (!context.auth || !uid) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Request had invalid credentials',
        {
          error: 'invalid credentials',
        }
      );
    }

    const session = await _stripe.checkout.sessions.retrieve(sessionId);

    const email = get(session, 'customer_details.email');
    if (!email) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Request missing associated email',
        {
          error: 'invalid credentials',
        }
      );
    }

    let products = JSON.parse(get(session, 'metadata.products', '[]'));

    // send email receipt?
    // write to firebase?

    const total = formatCurrency(session.amount_total, session.currency);
    const amount_decimal = parseInt(session.amount_total, 10) / 100;

    const receipt = {};
    receipt.id = shortId();
    receipt.ts = new Date(Date.now()).toISOString();
    receipt.src = 'stripe';

    receipt.paid = `${total}`;
    receipt.raw = JSON.stringify(session);
    receipt.products = products; // this is the most important part
    receipt.type = 'payment';

    // add products to email table
    const db = admin.firestore();

    try {
      await db
        .doc(`email/${email}/receipts/${receipt.id}`)
        .set({ receipt, email });
    } catch (ee) {
      throw new functions.https.HttpsError('internal', 'Internal Error', {
        error: 'email store error',
      });
    }

    const output = {
      amount: session.amount_total,
      amount_decimal,
      currency: session.currency,
      total,
      products,
      customer: { id: session.customer, ...session.customer_details },
      livemode: session.livemode,
    };
    // console.log({ output });

    return output;
  }
);

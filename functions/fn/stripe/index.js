const get = require('lodash.get');

const functions = require('firebase-functions');
const { Stripe } = require('stripe');

// const fetch = require('node-fetch');

const getSecrets = require('../../lib/env'); // load environment config
const { formatCurrency } = require('../../lib/i18n');
const { shortId } = require('../../lib/short-uuid');
const admin = require('../../lib/firebase');
const { sendEvent } = require('../../lib/events');
const { publishMessage } = require('../email');

const { getProductName, getProductDescription } = require('../../lib/data');

const secrets = getSecrets('the-faithful');

let _stripe;
let _stripe_test;

const stripeConfig = async () => {
  const config = await secrets;

  const conf = {
    pub: config.STRIPE_PUBLIC,
    secret: config.STRIPE_SECRET,
    webhook: config.STRIPE_WEBHOOK,
    //            ...functions.config().stripe,
  };

  // use test keys in dev if they're defined
  if (process.env.FUNCTIONS_EMULATOR === 'true') {
    if (config.STRIPE_PUBLIC_TEST) {
      conf.pub = config.STRIPE_PUBLIC_TEST;
      conf.secret = config.STRIPE_SECRET_TEST;
      conf.webhook = config.STRIPE_WEBHOOK_TEST;
      console.log({ conf });
    }
  }

  if (config.STRIPE_PUBLIC_TEST) {
    conf.pubTest = config.STRIPE_PUBLIC_TEST;
    conf.secretTest = config.STRIPE_SECRET_TEST;
    conf.webhookTest = config.STRIPE_WEBHOOK_TEST;
  }

  return conf;
};

const stripe = async () => {
  const _stripeConfig = await stripeConfig();

  if (typeof _stripe !== 'undefined') {
    return { _stripe, _stripe_test, config: _stripeConfig };
  }

  _stripe = new Stripe(_stripeConfig.secret, {
    apiVersion: '2020-08-27',
  });

  if (_stripeConfig.pubTest) {
    _stripe_test = new Stripe(_stripeConfig.secretTest, {
      apiVersion: '2020-08-27',
    });
  }

  return { _stripe, _stripe_test, config: _stripeConfig };
};

const processChargeEvent = async (ev) => {
  const paid = get(ev, 'data.object.paid');
  const id = get(ev, 'data.object.id');
  const amount = get(ev, 'data.object.amount');
  const currency = get(ev, 'data.object.currency');
  const metadata = get(ev, 'data.object.metadata', {});

  let minEv = { id, amount, currency, metadata, paid };
  minEv._ts = new Date(Date.now()).toISOString();
  minEv.src = 'stripe';
  minEv.stripeCustomerId = `${get(ev, 'data.object.customer')}`;
  minEv.email = `${get(ev, 'data.object.billing_details.email')}`;
  minEv.name = `${get(ev, 'data.object.billing_details.name')}`;
  minEv.created = `${get(ev, 'data.object.created')}`;
  minEv.livemode = `${get(ev, 'data.object.livemode')}`;
  minEv.details = `${JSON.stringify(
    get(ev, 'data.object.payment_method_details')
  )}`;
  minEv.type = 'receipt';
  minEv.paperUrl = `${get(ev, 'data.object.receipt_url')}`;
  minEv.status = `${get(ev, 'data.object.status')}`;

  if (minEv.email) {
    const payload = {
      template: 'receipt',
      to: minEv.email,
      name: minEv.name,
      receiptUrl: minEv.paperUrl,
    };

    try {
      minEv.receiptEmail = await publishMessage(payload);
    } catch (e) {
      console.log('receipt email error', e);
    }
  }

  return minEv;
};

const recordChargeRefunded = async (ev) => {
  const amount = get(ev, 'data.object.amount_refunded');
  const currency = get(ev, 'data.object.currency');
  const livemode = get(ev, 'data.object.livemode');
  const metadata = get(ev, 'data.object.metadata', {});
  const email = get(ev, 'data.object.billing_details.email');
  const status = get(ev, 'data.object.status');
  const refunded = get(ev, 'data.object.refunded');

  const entry = {
    ts: new Date(Date.now()).toISOString(),
    email,
    type: 'refund',
    amount,
    currency,
    metadata,
    livemode,
    status,
    refunded,
  };

  return entry;
};

exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const signature = req.headers['stripe-signature'];

  const stripeProps = await stripe();
  const { _stripe, config } = stripeProps; // ignores test mode extra switch

  //  console.log({ signature, body: req.rawBody, config });
  let events = [];
  let ev;
  try {
    ev = _stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      config.webhook
    );
    console.log(ev);
  } catch (err) {
    if (err.message && err.message.indexOf('No signatures found') !== -1) {
      console.log('bad signature');
    } else {
      console.log({ err });
    }
    res.status(400).end();
    return;
  }

  // Handle the event
  let minEvent = {}; // we don't store everything, but just what we need to show the business value
  try {
    console.log('new event-----', JSON.stringify(ev, null, 2));

    switch (ev.type) {
      // case 'payment_intent.succeeded': {
      //   //        const paymentIntent = ev.data.object;
      //   console.log('PaymentIntent was successful!');
      //   break;
      // }
      // case 'charge.captured': {
      //   // await processCaptureEvent(ev);
      //   break;
      // }
      case 'charge.succeeded': {
        minEvent = await processChargeEvent(ev);
        break;
      }
      case 'charge.refunded': {
        minEvent = await recordChargeRefunded(ev);
        break;
      }
      // ... handle other event types
      // on payment success -> add to future-capture-log, update user receipt (24hour expiry)
      // on payment captureed -> create user receipt with no expiry
      default: {
        // we don't know the exact shape to get the email
        events.push(
          sendEvent(
            { ...ev },
            {
              topic: ev.type,
              source: 'stripe.webhook',
            }
          )
        );
      }
    }

    if (minEvent && Object.keys(minEvent)) {
      events.push(
        sendEvent(
          {
            payload: minEvent,
            _email: minEvent.email,
          },
          {
            topic: ev.type,
            source: 'stripe.webhook',
            email: minEvent.email,
          }
        )
      );
    }
  } catch (e) {
    console.log('error:', e);
    res.status(500).end();
    return;
  }

  // send in || to pubsub topic
  await Promise.all(events);

  return res.send(JSON.stringify({ ok: true }));
});

exports.stripeCheckoutSession = functions.https.onCall(async (data) => {
  const items = get(data, 'items', '[]');
  const baseUrl = get(data, 'base', 'https://www.the-faithful.com');
  const testMode = get(data, 'testMode', false);

  // TODO: get url of this request and use it to form the baseUrl
  // console.log({ todo: context });

  // const items = JSON.parse(rawItems); // allow to fail if bad input

  if (!items || items.length <= 0) {
    throw new functions.https.HttpsError('invalid-argument', 'missing items', {
      error: 'items not found',
    });
  }

  // const config = await secrets;
  const stripeProps = await stripe();
  let _stripe;
  let stripePubKey;
  if (testMode) {
    _stripe = stripeProps._stripe_test;
    stripePubKey = stripeProps.config.pubTest;
  } else {
    // production
    stripePubKey = stripeProps.config.pub;
    _stripe = stripeProps._stripe;
  }

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
  let quantity = 0;

  items.forEach((item) => {
    productIds[item.productId] =
      (+productIds[item.productId] || 0) + (item.quantity || 1);
    quantity = quantity + (item.quantity || 1);

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
  metadata.productQuantity = JSON.stringify(productIds); // video:thing = 1
  metadata.quantity = quantity;

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
  return { id: session.id, stripePubKey };
});

exports.receiptDetails = functions.https.onCall(async (data, context) => {
  const ticket = get(data, 'ticket', {});
  const testMode = get(data, 'testMode', false);
  const liveMode = get(data, 'ticket.livemode', false);

  const stripeProps = await stripe();
  let _stripe;
  if (testMode || !liveMode) {
    _stripe = stripeProps._stripe_test;
  } else {
    // production
    _stripe = stripeProps._stripe;
  }

  const uid = get(context, 'auth.uid');
  console.log(`----UID-----${uid}-------`);
  // verify Firebase Auth ID token and presence of UID
  if (!context.auth || !uid) {
    // throw new functions.https.HttpsError(
    //   'unauthenticated',
    //   'Request had invalid credentials',
    //   {
    //     error: 'invalid credentials',
    //   }
    // );
    console.log('--invalid credentials would have thrown here--', {
      auth: context.auth,
      uid,
    });
  }

  // see if this is a type we know about
  let ticketType = get(ticket, 'receipt.src', 'unknown');
  if (ticketType !== 'stripe') {
    return { ticket, status: 'no-additional-info' };
  }

  let raw = JSON.parse(get(ticket, 'receipt.raw', '{}'));
  let pi = get(raw, 'payment_intent');
  let customerId = get(raw, 'customer');
  if (!customerId) {
    console.log('no customer');
    return { ticket, status: 'no-additional-info' };
  }

  // let customer;
  let payment;

  try {
    // customer = await _stripe.customers.retrieve(customerId);
    payment = await _stripe.paymentIntents.retrieve(pi);
  } catch (error) {
    console.log('retrieve cus/pi error.', error);
    return { ticket, status: 'no-additional-info', error: error.code };
  }

  let receiptUrl = get(payment, 'charges.data[0].receipt_url');
  let paid = get(payment, 'charges.data[0].paid');
  let refunded = get(payment, 'charges.data[0].refunded', false);

  const output = {
    refunded,
    paid,
    receiptUrl,
    // customer,
    // payment
  };
  // console.log({ output });

  return output;
});

exports.stripeCheckoutSuccess = functions.https.onCall(
  async (data, context) => {
    const sessionId = get(data, 'sessionId', '');
    const testMode = get(data, 'testMode', false);

    const stripeProps = await stripe();
    let _stripe;
    if (testMode) {
      _stripe = stripeProps._stripe_test;
    } else {
      // production
      _stripe = stripeProps._stripe;
    }

    let uid = get(context, 'auth.uid');
    console.log(`----UID-----${uid}-------SESSION--${sessionId}----`);
    // verify Firebase Auth ID token and presence of UID
    if (!context.auth || !uid) {
      // throw new functions.https.HttpsError(
      //   'unauthenticated',
      //   'Request had invalid credentials',
      //   {
      //     error: 'invalid credentials',
      //   }
      // );
      console.log('--invalid credentials would have thrown here--', {
        auth: context.auth,
        uid,
      });
    }

    let session;

    try {
      session = await _stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
      console.log('retrieve session error. trying again.', error);
      session = await _stripe.checkout.sessions.retrieve(sessionId);
    }

    console.log({ session });
    let email = get(session, 'customer_details.email', '');
    email = email.toLowerCase();

    if (!email) {
      console.log('missing email');

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
      console.log('error::::email store', receipt);
      throw new functions.https.HttpsError('internal', 'Internal Error', {
        error: 'email store error',
      });
    }

    // get the user's id or create a new one
    let firebaseToken = '';
    let existingUser;
    try {
      existingUser = await admin.auth().getUserByEmail(email);
      console.log({ existingUser });
      uid = existingUser.uid;
    } catch (e1) {
      if (e1.code === 'auth/user-not-found') {
        try {
          uid = shortId(); // new uid - no collision, but lose anon uid
          await admin.auth().createUser({
            email,
            uid, 
          });
        } catch (e2) {
          console.log({ e2 });
          throw e2;
        }  
      } else {
        console.log({ e1 });
        throw e1;
      }
    }

    // console.log({ cred });
    //   await admin.auth.currentUser.linkWithCredential(credential)
    // } catch (ee) {
    //   console.log({ ee, code: ee.code });
    //   if (ee.code === 'auth/uid-already-exists') {
    //     await admin.auth().updateUser(uid, {
    //       email,
    //     });
    //   } else if (ee.code === 'auth/email-already-exists') {
    //     // const existingUser = await admin.auth().getUserByEmail(email);

    //     // uid = existingUser.uid;
    //     // console.log({existingUser});
    //   } else {
    //     console.log(`code: ${ee.code}`);
    //     throw ee;
    //   }
    // }
    try {
      firebaseToken = await admin.auth().createCustomToken(uid);
    } catch (fbe) {
      console.log({ fbe });
    }

    const output = {
      amount: session.amount_total,
      amount_decimal,
      currency: session.currency,
      total,
      products,
      customer: { id: session.customer, ...session.customer_details },
      livemode: session.livemode,
      firebaseToken,
    };
    // console.log({ output });

    return output;
  }
);

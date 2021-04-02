const get = require('lodash.get');

const functions = require('firebase-functions');

const { createGiftReceipt } = require('../../lib/entitlements');
const { publishMessage } = require('../email');

const admin = require('../../lib/firebase');

// const secrets = getSecrets('the-faithful');

const productsFromReceipts = async (receipts) => {
  const productIds = {};

  //   console.log('all receipts', receipts);

  // loop through all receipts, look for purchases, guest and refunds
  for (const receipt of receipts) {
    // sort by timestamp?
    try {
      if (receipt.receipt.type === 'payment') {
        const purchasedProducts = receipt.receipt.products || [];

        // console.log('purchased products', purchasedProducts);
        if (purchasedProducts && purchasedProducts.length) {
          purchasedProducts.forEach((productId) => {
            productIds[productId] = (productIds[productId] ?? 0) + 1;
          });
        }
      } else if (receipt.receipt.type === 'refund') {
        const refundedProducts = receipt.receipt.products || [];

        // console.log('canceled products', refundedProducts);
        if (refundedProducts && refundedProducts.length) {
          refundedProducts.forEach((productId) => {
            productIds[productId] = (productIds[productId] ?? 0) - 1;
          });
        }
      } else if (receipt.receipt.type === 'guest') {
        const giftedProducts = receipt.receipt.products || [];
        if (giftedProducts && giftedProducts.length) {
          giftedProducts.forEach((productId) => {
            productIds[productId] = (productIds[productId] ?? 0) + 1;
          });
        }
      } else {
        console.log('unknown receipt type', receipt);
      }
    } catch (e) {
      console.log('skipping receipt', { e });
    }
  }

  // remove cancels.
  Object.keys(productIds).forEach((productId) => {
    if (productIds[productId] <= 0) {
      delete productIds[productId];
    }
  });

  // return what's left
  return Object.keys(productIds).sort();
};

exports.screenerAdd = functions.https.onCall(async (data, context) => {
  let email = get(data, 'email', ''); // email to add
  email = email.toLowerCase();

  let entitlementsToAdd = get(data, 'entitlements', []);
  if (!entitlementsToAdd || !entitlementsToAdd.length) {
    throw new Error('missing entitlements');
  }

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

  // check to see if the email is set, if not, assume this is an anonymous user
  let requestEmail = get(context, 'auth.token.email', 'anonymous');
  requestEmail = requestEmail.toLowerCase();
  if (requestEmail === 'anonymous') {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Request had invalid credentials',
      {
        error: 'invalid credentials',
      }
    );
  }

  // console.log(`email/${requestEmail}/receipts/${ticketId}`, { data });
  const db = admin.firestore();

  let adminFound = false;

  const requestUserDoc = await db.doc(`email/${requestEmail}`).get();
  const requestUserDocData = requestUserDoc.data();
  if (
    requestUserDocData &&
    requestUserDocData.entitlements &&
    requestUserDocData.entitlements.length
  ) {
    requestUserDocData.entitlements.forEach((entitlement) => {
      if (entitlement === 'site:admin') {
        adminFound = true;
      }
    });
  }
  if (!adminFound) {
    throw new Error('Must be admin');
  }

  // if we're here, we're authorized
  // let's add the entitlements to the user, creating if needed.
  let currentEntitlements = {};
  const userDoc = await db.doc(`email/${email}`).get();
  if (userDoc.exists) {
    const userDocData = userDoc.data();
    if (
      userDocData &&
      userDocData.entitlements &&
      userDocData.entitlements.length
    ) {
      userDocData.entitlements.forEach((entitlement) => {
        currentEntitlements[entitlement] = true;
      });
    }
  }

  const docRef = db.collection(`email`).doc(`${email}`);
  entitlementsToAdd.forEach((newEntitlement) => {
    currentEntitlements[newEntitlement] = true;
  });
  let entitlements = Object.keys(currentEntitlements).sort();

  await docRef.set(
    {
      entitlements,
      _ts: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  return { status: 'ok' };
});

exports.guestList = functions.https.onCall(async (data, context) => {
  const ticketId = get(data, 'ticketId', '');
  let isAdmin = get(data, 'admin', false);

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

  // check to see if the email is set, if not, assume this is an anonymous user
  const requestEmail = get(context, 'auth.token.email', 'anonymous');
  if (requestEmail === 'anonymous') {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Request had invalid credentials',
      {
        error: 'invalid credentials',
      }
    );
  }

  // console.log(`email/${requestEmail}/receipts/${ticketId}`, { data });
  const db = admin.firestore();

  if (!isAdmin) {
    const docRef = db
      .collection(`email/${requestEmail}/receipts`)
      .doc(`${ticketId}`);

    const doc = await docRef.get();
    if (!doc.exists) {
      throw new Error('missing ticket');
    }

    const ticket = doc.data();

    if (ticket.email !== requestEmail) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Request had invalid credentials for action',
        {
          error: 'invalid credentials for action',
        }
      );
    }

    const guests = get(ticket, 'guests', []);
    const toAdd = get(data, 'add', []);
    const products = get(ticket, 'receipt.products', []);

    // TODO quantity check?
    await Promise.all(
      toAdd.map(async ({ email }) => {
        guests.push(email);

        // create the guest pass
        await createGiftReceipt({
          src: 'purchase',
          email,
          originalReceiptId: ticketId,
          gifter: requestEmail,
          products,
        });

        // send them a welcome email
        const payload = {
          template: 'guest-list-1',
          to: email,
          gifter: requestEmail,
        };

        await publishMessage(payload);
      })
    );

    if (guests && guests.length) {
      await docRef.set(
        {
          guests,
          _ts: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      ticket.guests = guests;
    }

    return ticket;
  } else {
    // is admin mode
    let adminFound = false;

    const userDoc = await db.doc(`email/${requestEmail}`).get();
    const userDocData = userDoc.data();
    if (
      userDocData &&
      userDocData.entitlements &&
      userDocData.entitlements.length
    ) {
      userDocData.entitlements.forEach((entitlement) => {
        if (entitlement === 'site:admin') {
          adminFound = true;
        }
      });
    }
    if (!adminFound) {
      throw new Error('Must be admin');
    }

    // add the guest
    // create the guest pass
    const email = get(data, 'email', '');
    if (!email || email.indexOf('@') === -1) {
      throw new Error('missing email');
    }

    const products = get(data, 'products', []);
    if (!products.length) {
      throw new Error('missing products');
    }

    await createGiftReceipt({
      src: 'admin',
      email,
      gifter: requestEmail,
      products,
    });

    // send them a welcome email
    const payload = {
      template: 'guest-list-1',
      to: email,
      gifter: requestEmail,
    };

    await publishMessage(payload);

    return { ticket: {}, status: 'ok' };
  }
});

exports.userEntitlements = functions.https.onCall(async (data, context) => {
  // lookup a user's email
  // get receipts for user
  // reduce to valid ones
  // return

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
  //   console.log(get(context, 'auth.token.firebase.identities.email'));
  // check to see if the email is set, if not, assume this is an anonymous user
  const email = get(context, 'auth.token.email', 'anonymous');
  let userProducts = [];
  if (email === 'anonymous') {
    return { userProducts, anonymous: true };
  }

  const db = admin.firestore();
  let user = {};
  try {
    user = await admin.auth().getUser(uid);
  } catch (e) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User fetch error',
      {
        error: 'invalid credentials',
      }
    );
  }
  //   console.log({ user });
  const receipts = await db.collection(`email/${user.email}/receipts`).get();
  const receiptsArray = [];
  if (receipts) {
    receipts.forEach((rec) => {
      const receiptData = rec.data();
      // console.log({ receiptData });

      receiptsArray.push(receiptData);
    });
  }

  // now reduce down to valid product entitlements
  const validProducts = await productsFromReceipts(receiptsArray);
  validProducts.forEach((validProductId) => {
    userProducts.push(validProductId);
  });

  // add in the ability to login
  userProducts.push('site:user:my:*');

  try {
    const userDoc = await db.doc(`email/${user.email}`).get();
    const userDocData = userDoc.data();
    if (
      userDocData &&
      userDocData.entitlements &&
      userDocData.entitlements.length
    ) {
      userDocData.entitlements.forEach((entitlement) => {
        userProducts.push(entitlement);
      });
    }
  } catch (e) {
    console.log(e, 'userdoc entitlements');
  }

  return { userProducts };
});

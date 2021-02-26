const get = require('lodash.get');

const functions = require('firebase-functions');

// const fetch = require('node-fetch');

// const getSecrets = require('../../lib/env'); // load environment config
const admin = require('../../lib/firebase');

// const secrets = getSecrets('the-faithful');

const productsFromReceipts = async (receipts) => {
  const productIds = {};

//   console.log('all receipts', receipts);

  // loop through all receipts, look for purchases and refunds
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

  const db = admin.firestore();
  let userProducts = [];
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
      console.log({ receiptData });

      receiptsArray.push(receiptData);
    });
  }

  // now reduce down to valid product entitlements
  const validProducts = await productsFromReceipts(receiptsArray);
  validProducts.forEach((validProductId) => {
    userProducts.push(validProductId);
  });

  return { userProducts };
});

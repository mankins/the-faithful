const admin = require('./firebase');
const { shortId } = require('./short-uuid');
// const FieldValue = admin.firestore.FieldValue;

exports.createGiftReceipt = async ({ email, gifter, originalReceiptId, src = 'internal', products = [] }) => {

  const receipt = {};
  receipt.id = shortId();
  receipt.ts = new Date(Date.now()).toISOString();
  receipt.src = src;
  if (gifter) {
    receipt.gifter = gifter;
  }
  if (originalReceiptId) {
    receipt.originalReceiptId = originalReceiptId;
  }

  receipt.products = products; // this is the most important part
  receipt.type = 'gift';

  // add products to email table
  const db = admin.firestore();

  await db.doc(`email/${email}/receipts/${receipt.id}`).set({ receipt, email });

  return receipt;
};

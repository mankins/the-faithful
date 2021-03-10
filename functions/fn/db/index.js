const functions = require('firebase-functions');
const admin = require('../../lib/firebase');
const FieldValue = admin.firestore.FieldValue;

exports.updateEmailSegmentIndex = functions.firestore
  .document('email/{email}/{segmentId}/{docId}')
  .onWrite(async (_change, context) => {
    // due to a data modeling misunderstanding we have to update the "main" user
    // document whenever we create something in a sub-colleciton

    // this is definitely a bit expensive/weird. A rewrite should correct this TODO
    const email = context.params.email;

    const collections = await admin
      .firestore()
      .doc(`email/${email}`)
      .listCollections();
    const segments = collections.map((col) => col.id);

    // console.log({ segments });

    const docRef = admin.firestore().collection('email').doc(email);

    await docRef.set(
      {
        segments: segments,
        _ts: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return true;
  });

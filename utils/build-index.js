const getSecrets = require('../functions/lib/env'); // load environment config

// const functions = require('firebase-functions');
const emails = require('./emails.json');

const admin = require('../functions/lib/firebase');
const FieldValue = admin.firestore.FieldValue;

const calcSegmentsForEmail = async ({ email }) => {
  //   const db = admin.firestore();

  const collections = await admin
    .firestore()
    .doc(`email/${email}`)
    .listCollections();
  const segments = collections.map((col) => col.id);

  return { segments };
};

const updateEmailSegments = async ({ email, segments }) => {
  const docRef = admin.firestore().collection('email').doc(email);

  return await docRef.set(
    {
      segments: segments,
      _ts: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
};

const getAllEmails = async () => {
  //   const snapshot = admin.firestore().collectionGroup('emails').get();
  const snapshot = await admin.firestore().collection('email').get();
  const emails = [];
  snapshot.docs.map((doc) => {
    emails.push(doc.id);
  });
  return emails;
  // return snapshot.docs.map((doc) => {
  //     return { id: doc.id, ...doc.data() }
  //   })
};

(async () => {
  const config = await getSecrets('the-faithful');
  // console.log({ config });

  // iterate through /email, get all emails
  // const emails = ['mankins@gmail.com'];
  // const emails = await getAllEmails();
  // console.log({ emails });
  // return;
  // await Promise.all(emails.map(async (email) => {
  // get a starting list of all emails
  const emailsStart = await getAllEmails();
  console.log(emailsStart);

  for (const email of emails) {
    if (emailsStart.includes(email)) {
      console.log(`skipping ${email} already done - not updated`);
      continue;
    }

    const { segments } = await calcSegmentsForEmail({ email });
    console.log({ email, segments });

    // now update the user's document to include these segments
    await updateEmailSegments({ email, segments });
    process.exit();
  }

  const emailsNow = await getAllEmails();
  console.log({ emailsNow });
})();

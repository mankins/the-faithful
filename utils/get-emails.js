const getSecrets = require('../functions/lib/env'); // load environment config

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
  const emails = await getAllEmails();
  // console.log(emailsStart);
  console.log('email\tsegments');
  for (const email of emails) {
    const { segments } = await calcSegmentsForEmail({ email });
    console.log(`${email}\t${segments}`);
  }
})();

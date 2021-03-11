const admin = require('./firebase');
const { shortId } = require('./short-uuid');
const FieldValue = admin.firestore.FieldValue;

exports.getSegmentEmails = async (segmentId) => {
  const docsRef = admin.firestore().collection('email');

  let emails = [];

  let snapshot = await docsRef
    .where('segments', 'array-contains', segmentId)
    .orderBy('_ts')
    .get();

  if (snapshot.empty) {
    return emails;
  }

  snapshot.forEach((doc) => {
    const data = doc.data();
    emails.push({ email: doc.id, ...data });
  });

  return emails;
};

exports.importEmailSegment = async ({ segment, data, email }) => {
  const docRef = admin.firestore().collection('email').doc(email);

  // update email/$email -> data
  await docRef.set(
    {
      ...data,
      _ts: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  // then add email/$email/$segment/$shortId = data
  const segmentDocId = shortId();

  const docRef2 = admin.firestore().collection(`email/${email}/${segment}`).doc(segmentDocId);
  await docRef2.set(
    {
      ...data,
      _ts: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
};

const admin = require('./firebase');
const FieldValue = admin.firestore.FieldValue;

exports.getCampaign = async (campaignId) => {
  const doc = await admin.firestore().collection('campaign').doc(campaignId).get();

  if (!doc.exists) {
    throw new Error('missing campaign');
  }

  return doc.data();
};

exports.createCampaign = async (campaign) => {

  const docRef = admin.firestore().collection('campaign').doc(campaign.campaignId);

  return await docRef.set(
    {
      ...campaign,
      _ts: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
};

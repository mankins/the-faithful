'use strict';

const { updateEmailSegmentIndex } = require('./fn/db');
const { guestList, userEntitlements } = require('./fn/entitlements');
const { eventsIn, eventsFirehosePubSub } = require('./fn/events');
const { oauthAuthorize, accessCode } = require('./fn/oauth');
const { slackRelay } = require('./fn/slack');
const { transcoderIn } = require('./fn/transcode');
const { receiptDetails, stripeCheckoutSession, stripeCheckoutSuccess, stripeWebhook } = require('./fn/stripe');
const { channelToken } = require('./fn/channels');

const {
  apiImage,
  apiEmail,
  sendEmailPubSub,
  webhookMailgun,
} = require('./fn/email');

const startTime = new Date().toISOString();

const environment =
  process.env.NODE_ENV === 'production' ? 'production' : 'dev';
const release = process.env.COMMIT_SHA
  ? `tf-${process.env.COMMIT_SHA}`
  : 'tf-unset';

console.log({ release, environment, startTime });

// http functions
exports.accessCode = accessCode;
exports.eventsIn = eventsIn;
exports.slackRelay = slackRelay;
exports.receiptDetails = receiptDetails;
exports.stripeCheckoutSession = stripeCheckoutSession;
exports.stripeCheckoutSuccess = stripeCheckoutSuccess;
exports.stripeWebhook = stripeWebhook;
exports.userEntitlements = userEntitlements;
exports.oauthAuthorize = oauthAuthorize;
exports.apiImage = apiImage;
exports.apiEmail = apiEmail;
exports.webhookMailgun = webhookMailgun;
exports.guestList = guestList;
exports.channelToken = channelToken;

// pubsub event functions
exports.sendEmailPubSub = sendEmailPubSub;
exports.eventsFirehosePubSub = eventsFirehosePubSub;

// firebase event functions
exports.updateEmailSegmentIndex = updateEmailSegmentIndex;

// deprecated, TODO: remove
exports.transcoderIn = transcoderIn;

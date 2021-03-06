'use strict';

const { userEntitlements } = require('./fn/entitlements');
const { oauthAuthorize } = require('./fn/oauth');
const { slackRelay } = require('./fn/slack');
const { transcoderIn } = require('./fn/transcode');
const { stripeCheckoutSession, stripeCheckoutSuccess } = require('./fn/stripe');
const { apiImage,apiEmail,sendEmailPubSub } = require('./fn/email');

const startTime = (new Date()).toISOString();

const environment =
  process.env.NODE_ENV === 'production' ? 'production' : 'dev';
const release = process.env.COMMIT_SHA
  ? `tf-${process.env.COMMIT_SHA}`
  : 'tf-unset';

console.log({ release, environment, startTime });

// http functions
exports.slackRelay = slackRelay;
exports.stripeCheckoutSession = stripeCheckoutSession;
exports.stripeCheckoutSuccess = stripeCheckoutSuccess;
exports.userEntitlements = userEntitlements;
exports.oauthAuthorize = oauthAuthorize;
exports.apiImage = apiImage;
exports.apiEmail = apiEmail;

// event functions
exports.sendEmailPubSub = sendEmailPubSub;

// deprecated, TODO: remove
exports.transcoderIn = transcoderIn;

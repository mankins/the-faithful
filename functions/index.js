'use strict';

const { slackRelay } = require('./fn/slack');
const { transcoderIn } = require('./fn/transcode');

exports.slackRelay = slackRelay;
exports.transcoderIn = transcoderIn;
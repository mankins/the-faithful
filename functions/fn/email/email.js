const getSecrets = require('../../lib/env'); // load environment config
const secrets = getSecrets('the-faithful');

const composer = require('./composer');
const mailgunJs = require('mailgun-js');

let mailgun;
const composeEmail = async (payload = {}, context = {}) => {
  const templateName = context.templateName;
  if (!templateName) {
    throw new Error('MISSING-TEMPLATE');
  }

  context.from = 'hello@the-faithful.com';

  let composed;
  try {
    composed = await composer.composeEmail(templateName, payload, context);
  } catch (e) {
    console.log({ e });
    throw new Error('COMPOSE-ERROR');
  }

  return composed;
};
exports.composeEmail = composeEmail;

exports.sendEmail = async (payload = {}, context = {}) => {
  console.log({ payload, context });

  const composed = await composeEmail(payload, context);

  const dataToSend = {
    to: context.to,
    message: composed.mime,
  };

  console.log('ds', dataToSend);

  const config = await secrets;

  if (!mailgun) {
    // init
    mailgun = mailgunJs({
      apiKey: config.MAILGUN_PRIVATE,
      domain: 'elvis.the-faithful.com',
    });
  }

  mailgun.messages().sendMime(dataToSend, function (err, body) {
    // mailgun.sendRaw(from, message.context.to, mimeMessage.toString(), function mailgunned(err) {
    if (err) {
      console.log('mg error', err);
    } else {
      console.log('mg ok', body);
    }
  });
};

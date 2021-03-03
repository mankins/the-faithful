const composer = require('./composer');
// const mailgun = require('./mailgun');

exports.sendEmail = async (payload = {}, context = {}) => {
  console.log({ payload, context });

  const templateName = context.templateName;
  if (!templateName) {
    throw new Error('MISSING-TEMPLATE');
  }

  try {
    const mimeMessage = await composer.composeEmail(
      templateName,
      payload,
      context
    );

      console.log('mime', { mimeMessage });
  } catch (e) {
    console.log({ e });
    throw new Error('COMPOSE-ERROR');
  }
};

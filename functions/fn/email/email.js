const composer = require('./composer');
// const mailgun = require('./mailgun');

const sendEmail = async (payload = {}, context = {}) => {
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

        console.log(mimeMessage);
    } catch (e) {
        console.log({ e }); 
        throw new Error('COMPOSE-ERROR');
    }
};
 
exports = { sendEmail };

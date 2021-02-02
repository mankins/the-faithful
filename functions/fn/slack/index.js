const get = require('lodash.get');

const functions = require('firebase-functions');

const fetch = require('node-fetch');

const getSecrets = require('../../lib/env'); // load environment config

const secrets = getSecrets();

const sendToSlack = (url, payload) => {
  return fetch(url, {
    method: 'post',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.text())
    .catch((err) => console.error(err));
};

// Relay from Github to Slack Webhooks
exports.slackRelay = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  const config = await secrets;

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    //functions.logger.info({cors: req}, {structuredData: true});
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.set('Access-Control-Max-Age', '3600');
    functions.logger.info('cors', { structuredData: true });
    res.status(204).send('');
  } else if (req.method === 'POST') {
    // functions.logger.info("Hello logs!", {structuredData: true});
    //console.log(req);
    // read from github, relay to slack

    if (!config.SLACK_ENDPOINT) {
      res.set('Content-type', 'application/json');
      res
        .status(500)
        .send(JSON.stringify({ err: { message: 'endpoint not defined.' } }));
      return;
    }

    let ua = req.header('User-Agent');
    ua = ua.toLowerCase();
    if (ua.indexOf('github') === -1) {
      // GitHub-Hookshot/7905f48
      res.set('Content-type', 'application/json');
      return res
        .status(403)
        .send(JSON.stringify({ err: { message: 'denied' } }));
    }

    // parse payload
    const payload = req.body;

    const type = get(payload, 'action');
    const projectCard = get(payload, 'project_card');

    let text;
    let response = '';

    // get these by looking for the data-id on the github project page
    let columnMap = {};
    columnMap['12726477'] = 'Todo';
    columnMap['12726478'] = 'In progress';
    columnMap['12726479'] = 'Done';

    if (projectCard) {
      let template = {};
      template.blocks = [];
      let place = '';
      let to = columnMap['' + get(projectCard, 'column_id')];

      if (type === 'deleted') {
        place = `in *${to}*`;
      }
      if (type === 'create') {
        place = `in *${to}*`;
      }
      if (type === 'moved') {
        let from = columnMap['' + get(payload, 'changes.column_id.from')];
        place = `from *${from}* to *${to}*`;
      }

      template.text = `> *${get(
        projectCard,
        'creator.login',
        ''
      )}* _${type}_ a card ${place}`;

      // template.blocks.push(
      //   {
      //     "type": "section",
      //     "text": {
      //       "type": "mrkdwn",
      //       "text": `${get(projectCard, 'creator.login', '')} ${type} a card` // "Mankins created a card / moved a card"
      //     },
      //     "accessory": {
      //       "type": "image",
      //       "image_url": `${get(projectCard, 'creator.avatar_url')}`,
      //       "alt_text": `${get(projectCard, 'creator.login', '')}`
      //     }
      //   });

      if (get(projectCard, 'note')) {
        template.blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `> <https://github.com/orgs/fishinthehand/projects/1|${get(
              projectCard,
              'creator.login',
              ''
            )} *${get(
              projectCard,
              'creator.login',
              ''
            )}* _${type}_ a card ${place}>
> ${get(projectCard, 'note')}`,
          },
        });
        text = template;
      }
      response = await sendToSlack(config.SLACK_ENDPOINT, text);
      // console.log(response);
    }

    // relay to slack
    res.set('Content-type', 'text/plain');
    res.send(response);
  } else {
    return res.status(400).send(JSON.stringify({ err: { message: 'bad' } }));
  }
});

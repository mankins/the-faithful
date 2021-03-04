const addressParser = require('address-rfc2822');
const validateEmail = require('rfc822-validate');
const mailcomposer = require('mailcomposer');
const inlineCss = require('inline-css');
const cheerio = require('cheerio');

const _ = require('lodash');
const md5 = require('md5');

const renderers = require('./renderers');
const templates = require('./templates');

var DEFAULT_EMAIL = 'info@the-faithful.com';

function getTo(Context) {
  console.log({ Context }, 'getTo');
  var to = Context.to || Context.email;

  if (Context.name && to) {
    // "Yohan Alvarez" <yohan@moo.com> (preferred, passes through more filters.)
    Context.name = Context.name.replace(/"/g, ''); // just in case?
    return `"${Context.name || ''}" <${to}>`;
  }

  // yohan@moo.com
  return `<${to}>`;
}

function normalizeContext(Context) {
  Context.year = new Date().getFullYear();

  Context.subjectSimple = Context.subject; // allow in templates w/o []

  if (Context.subject && Context.subject.indexOf('[The Faithful]') === -1) {
    Context.subject = '' + Context.subject;
  }
}

async function expandInlineImages(rendered, Context) {
  // cheerio, search for our special html types: <img smallText="" id="idhere" />
  console.log('looking for inlines');
  if (rendered && rendered.html) {
    let atris = {}; // list of ids that we will replace.
    console.log('expanding inlines');
    let $;
    let promises = [];
    let contextData = [];

    try {
      $ = cheerio.load(rendered.html);
      $('.atri').each(function doAtris(index, atri) {
        // which should get inlined into an img?
        // search for all occurrences
        // async out to the api server to expand them, using our local disk-cache
        // replace if appropriate.
        // <img class="atri" id="uniquehere" type="sampletext" txt="Hello World?" />
        console.log('atri found', index);
        let atriType = $(atri).attr('type');
        let atriId = $(atri).attr('id');
        console.log({ atriType, atriId });
        if (atriType && atriId) {
          console.log('converting', atriType, atriId, { ...atri.attribs });
          promises.push(renderers[atriType].process({ ...atri.attribs }, true));
          contextData.push({ atriId, atriType });
        }
      });
      atris = await Promise.all(promises);

      atris.forEach((data, i) => {
        const { atriId } = contextData[i];
        console.log(atriId, data);
        const imgData = data.result;

        console.log('got', atriId, imgData.length);

        const imgCid = md5(imgData);
        console.log(imgCid, 'cid');
        if (Context.preview) {
          $('#' + atriId).replaceWith('<img src="' + imgData + '">');
        } else {
          $('#' + atriId).replaceWith(
            `<img id="${atriId}" src="cid:${imgCid}" />`
          );
        }

        const attachment = {};
        attachment.cid = imgCid;
        attachment.path = imgData;
        attachment.filename = `${imgCid}.png`;
        // console.log({ attachment });
        rendered.attachments.push(attachment);
      });
    } catch (e) {
      console.log('problem parsing html', e);
    }
    rendered.html = $.html();
  }

  return { ...rendered };
}

async function doRenderEmailTemplate(templateName, Context, options) {
  let rendered = {};
  rendered.attachments = [];

  if (templates.has(templateName + '-html')) {
    rendered.html = templates.render(templateName + '-html', Context);

    rendered = await expandInlineImages(rendered, Context);
  }

  if (rendered && rendered.html) {
    options = options || {};
    options.url = options.url || './';

    rendered.html = await inlineCss(rendered.html, options);
  }

  if (templates.has(templateName + '-plain')) {
    rendered.plain = templates.render(templateName + '-plain', Context);
  }

  return rendered;
}
module.exports.renderEmailTemplate = doRenderEmailTemplate;

module.exports.composeEmail = async function composeEmail(
  templateName,
  Context,
  options
) {
  console.log('t', templateName, Context, options);

  // Now create the SMTP message
  let msgParams = {};

  // merge default context
  const defaultContext = templates.defaultContext(templateName) || {};
  _.extend(Context, defaultContext);

  normalizeContext(Context);
  console.log('Context now', Context);

  msgParams = {
    from: Context.from || DEFAULT_EMAIL,
    to: getTo(Context),
    subject: Context.subject,
    forceEmbeddedImages: false,
    headers: {
      'x-mailer': 'faithful-elvis-mailer',
    },
  };
  console.log('mp', msgParams);

  if (!msgParams.from || !msgParams.to) {
    throw new Error('from and to addresses must be set');
  }

  console.log('validating?');
  var addresses = addressParser.parse(msgParams.to);
  if (!validateEmail(addresses[0].address)) {
    console.log('email not valid?', addresses, msgParams.to);
    throw new Error('invalid email format');
  }

  console.log('ok valid email', addresses);

  console.log('rendering');
  let rendered = await doRenderEmailTemplate(templateName, Context, options);

  if (!rendered.html && !rendered.plain) {
    throw new Error(`template not found [${templateName}]`);
  }
  // optionally add html/plain parts
  if (rendered.html) {
    msgParams.html = rendered.html;
  }
  if (rendered.plain) {
    msgParams.body = rendered.plain;
  }
  if (rendered.attachments) {
    msgParams.attachments = rendered.attachments;
  }

  console.log('running mail composer?');
  const composer = async () => {
    return new Promise(function (resolve, reject) {
      mailcomposer(msgParams).build(function (composerErr, mimeMessage) {
        if (composerErr) {
          console.log('composer err', composerErr);
          return reject(composerErr);
        }
        resolve(mimeMessage);
      });
    });
  };

  let mimeMessage = await composer(msgParams);
  // console.log(mimeMessage, '?');
  // console.log(`msg\n------\n${mimeMessage.toString()}\n-----\n`);

  return { mime: `${mimeMessage.toString()}`, rendered };
};

const fs = require('fs');

const prompts = require('prompts');
const optimist = require('optimist');
const parse = require('csv-parse');
const slugify = require('slugify');
const get = require('lodash.get');

const getSecrets = require('../functions/lib/env'); // load environment config
const admin = require('../functions/lib/firebase');

const { getSegmentEmails, importEmailSegment } = require('../functions/lib/segments');
const { getCampaign, createCampaign, updateEmailCampaigns } = require('../functions/lib/campaigns');
const { createGiftReceipt } = require('../functions/lib/entitlements');
const { publishMessage } = require('../functions/fn/email'); // TODO: refactor

let config;

// MAIN:
(async () => {
  config = await getSecrets('the-faithful');

  const myArgs = process.argv.slice(2);

  // IMPORT
  if (myArgs[0] === 'import') {
    const segment = optimist.argv.segment;
    const inputFile = optimist.argv.file;
    const limit = optimist.argv.limit;
    const yes = optimist.argv.yes;

    if (!segment || !inputFile) {
      console.log(
        'Usage: send-email import --segment $segment --file $filename [--limit 1] [[--yes 1]'
      );
      process.exit(1);
    }

    // read in the input file
    // parse into columns
    // make sure we have email
    // skip column header

    const csvData = [];
    let header = [];
    let rowCount = 0;
    fs.createReadStream(inputFile)
      .pipe(parse({ delimiter: ',' }))
      .on('data', function (csvrow) {
        rowCount++;
        if (rowCount === 1) {
          csvrow.forEach((col) => {
            header.push(col);
          });
          return;
        }
        let row = {};
        csvrow.forEach((col, j) => {
          row[header[j]] = col;
        });

        // some cleanup :|
        if (true) {
          // kickstarter cleanup
          if (row.first && !row.last) {
            if (row.first.indexOf(' ') !== -1) {
              let parts = row.first.split(' ');
              if (parts[0] && parts[1]) {
                row.first = parts[0];
                row.last = parts[1];
              }
            }
          }
          if (
            row.email &&
            !row.first &&
            !row.last &&
            row.email.indexOf('.') !== -1
          ) {
            let parts = row.email.split('@');
            let nameParts = parts[0].split('.');
            if (nameParts.length === 2) {
              row.first = nameParts[0];
              row.last = nameParts[1];
            }
          }
          if (row.source) {
            row.source = row.source.toLowerCase();
            row.source = row.source.replace(/\W/g, '-');
          }
          if (row.tags) {
            row.tags = row.tags.toLowerCase();
            row.tags = row.tags.split(/\s*[-,|\/]\s*/);
            row.tags = row.tags.map((tag) => {
              tag = tag.replace(' and ', '');
              tag = tag.replace(/\"/g, '');
              tag = slugify(tag, {remove: /[*+~.()'"!:@\\]/g});
              return tag;
            });
            // still a mess donor: / ...
          }
          if (row.donation) {
            row.donation = row.donation.replace('$', '');
            row.donation = row.donation.replace('n', '');
            row.donation = parseInt(row.donation, 10) || row.donation;
          }
        }

        // console.log({ csvrow, header, row });
        csvData.push(row);
      })
      .on('end', function () {
        (async () => {
          if (optimist.argv.debug) {
            console.log('done', csvData);
          }

          const questions = [
            {
              type: 'confirm',
              name: 'commit',
              message: `Are you sure you sure?`,
              initial: false,
            },
          ];

          let toProcess;
          if (limit && parseInt(limit, 10) < csvData.length) {
            // do only first limit
            toProcess = csvData.slice(0, limit);
          } else {
            toProcess = csvData;
          }

          console.log(
            `Going to import ${toProcess.length} of ${csvData.length} users to segment ${segment}`
          );
          let response = {};
          if (yes) {
            response.commit = true;
          } else {
            response = await prompts(questions);
          }
          if (optimist.argv.debug) {
            console.log(response);
          }

          if (response.commit) {
            // console.log('Would import', toProcess);
            await Promise.all(
              toProcess.map(async (data) => {
                const doc = {
                  data,
                  segment,
                  email: data.email,
                };
                console.log(doc);
                await importEmailSegment(doc);
              })
            );
            console.log('imported');
          } else {
            console.log('import aborted');
            process.exit(1);
          }
        })();
      });
  }

  // SEGMENTS
  if (myArgs[0] === 'send') {
    const campaignName = slugify(optimist.argv.campaignName, {remove: /[*+~.()'"!:@\\]/g});
    const segment = optimist.argv.segment;
    const debug = optimist.argv.debug;
    const limit = parseInt(optimist.argv.limit, 10) || 1;

    if (!segment || !campaignName) {
      console.log(
        'Usage: send-email send --segment $segment --campaignName campaign-name-here [--limit 1] --debug'
      );
      process.exit(1);
    }

    if (debug) {
      console.log({ segment, campaignName });
    }

    const emails = await getSegmentEmails(segment);
    if (debug) {
      console.log({ emails });
    }

    // fetch the campaign to send to
    let campaign = {};
    try {
      campaign = await getCampaign(campaignName);
    } catch (e) {
      console.log(e);
      console.log('You may need to create the campaign first.');
      console.log(`send-emails campaign create --campaignName ${campaignName}`)
      process.exit(1);
    }
    console.log({ campaign });

    // are you sure you want to send to list, limit set to
    const questions = [
      {
        type: 'confirm',
        name: 'commit',
        message: `Are you sure you sure?`,
        initial: false,
      },
    ];
    console.log(
      `Going to send campaign ${campaignName} to segment ${segment}, limited to ${limit}`
    );
    const response = await prompts(questions);
    console.log(response);

    if (response.commit) {
      console.log('Would send');
    } else {
      console.log('send aborted');
    }
  }

    // SEND RECEIPTS
  if (myArgs[0] === 'receipts') {
    const debug = optimist.argv.debug;
    const limit = parseInt(optimist.argv.limit, 10) || 1;
    const yes = optimist.argv.yes;

    // const payload = {
    //   template: 'receipt-late',
    //   to: 'mankins+abc@gmail.com',
    // };
    // const status = await publishMessage(payload);
    // process.exit();

    // get users we've already sent the receipts to
    const done = {};
    const querySnapshot2 = await admin.firestore().collectionGroup('events').where('payload.template', '==', 'receipt').get();
    querySnapshot2.forEach((doc) => {
      const data = doc.data();
      const email = get(data, 'payload.to');
      done[email] = true;
  console.log(doc.id, ' => ', email);
});

const querySnapshot3 = await admin.firestore().collectionGroup('events').where('payload.template', '==', 'receipt-late').get();
querySnapshot3.forEach((doc) => {
  const data = doc.data();
  const email = get(data, 'payload.to');
  done[email] = true;
console.log(doc.id, ' LATE => ', email);
});

    const toDo = {};
const querySnapshot = await admin.firestore().collectionGroup('receipts').where('receipt.type', '==', 'payment').get();
querySnapshot.forEach((doc) => {
  const data = doc.data();
  const email = data.email;
  if (done[email]) {
    console.log('skipping (sent already)', email);
    return;
  }
  toDo[email] = data;
});

    console.log({ toDo });
    let count = 0;
    await Promise.all(
      Object.keys(toDo).map(async (email) => {
        if (limit && (count >= limit)) {
          return;
        }
        if (debug) {
          console.log('sending ', email);
        }
        count++;

        const payload = {
          template: 'receipt-late',
          to: email,
        };
        const status = await publishMessage(payload);
        if (debug) {
          console.log({ payload, status });
        }
      }));

    process.exit();
  }  


    // SEND TICKETS
    if (myArgs[0] === 'guest') {
      const campaignName = slugify(optimist.argv.campaignName, {remove: /[*+~.()'"!:@\\]/g});
      const segment = optimist.argv.segment;
      const debug = optimist.argv.debug;
      const limit = parseInt(optimist.argv.limit, 10) || 1;
      const yes = optimist.argv.yes;
      const gifter = optimist.argv.gifter || 'annie@the-faithful.com';
  
      if (!segment || !campaignName) {
        console.log(
          'Usage: send-email guest --segment $segment --campaignName campaign-name-here [--limit 1] --debug'
        );
        process.exit(1);
      }
  
      if (debug) {
        console.log({ segment, campaignName });
      }
  
      const emails = await getSegmentEmails(segment);
      if (debug) {
        console.log({ emails });
      }
  
      // fetch the campaign to send to
      let campaign = {};
      try {
        campaign = await getCampaign(campaignName);
      } catch (e) {
        console.log(e);
        console.log('You may need to create the campaign first.');
        console.log(`send-emails campaign create --campaignName ${campaignName}`)
        process.exit(1);
      }
      console.log({ campaign });
  
      // are you sure you want to send to list, limit set to
      const questions = [
        {
          type: 'confirm',
          name: 'commit',
          message: `Are you sure you sure?`,
          initial: false,
        },
      ];
      console.log(
        `Going to add users to guest list and send via campaign ${campaignName} to segment ${segment}, limited to ${limit}`
      );
      let response = {};
      if (yes) {
        response.commit = true;
      } else {
        response = await prompts(questions);
      }
      if (optimist.argv.debug) {
        console.log(response);
      }
  
      if (response.commit) {
        if (debug) {
          console.log(emails);
        }

        let done = 0;
        await Promise.all(
          emails.map(async (doc) => {
            if (limit && (done >= limit)) {
              return;
            }

            const campaigns = get(doc, 'campaigns', []);
            const segments = get(doc, 'segments', []);
            if (campaigns.includes(campaignName)) {
              console.log('skipping (already sent)', doc.email);
              return;
            }
            if (segments.includes('receipts')) {
              console.log('skipping (already paid)', doc.email);
              return;
            }
            done++;
            if (debug) {
              console.log(doc);
            }

            const email = doc.email;
            if (!email) {
              console.log('missing email');
              process.exit(1);
            }

            if (true) {
              // if we're here, we haven't sent to this campaign before
              await createGiftReceipt({
                src: segment || 'unknown',
                campaignName,
                email,
                gifter,
                products: ['video:thefaithful']
              });
    
              // send them a welcome email
              const payload = {
                template: 'guest-list-1',
                to: email,
                gifter,
              };
    
              const status = await publishMessage(payload);
              if (debug) {
                console.log({ status });
              }
            }
            // if we made it here we should update the "campaign so we don't send again"
            campaigns.push(campaignName);
            await updateEmailCampaigns(campaigns, email);      
          })
        );

      } else {
        console.log('send aborted');
      }
    }
  
  // CAMPAIGNS
  if (myArgs[0] === 'campaign') {
    if (!myArgs[1]) {
      console.log(
        'Usage: send-email campaign create [--campaignName="abc"] [--template="xyz"]'
      );
      process.exit(1);
    }
    if (myArgs[1] === 'create') {
      const questions = [
        {
          type: 'text',
          name: 'campaignName',
          initial:  slugify(optimist.argv.campaignName, {remove: /[*+~.()'"!:@\\]/g}),
          message: 'Campaign Name (dash-case)?',
          validate: (input) => {
            return input.match(/^[\w-]+$/);
          },
        },
        {
          type: 'text',
          name: 'template',
          message: 'Email template?',
          initial: optimist.argv.template,
        },
        {
          type: 'confirm',
          name: 'commit',
          message: 'Are you sure you want to create this?',
          initial: false,
        },
      ];
      const response = await prompts(questions);
      console.log(response);

      if (response.commit) {
        const campaign = {
          campaignName: slugify(response.campaignName, {remove: /[*+~.()'"!:@\\]/g}),
          template: response.template,
        };
        await createCampaign(campaign);
      } else {
        console.log('\nnot created');
        process.exit();
      }
    }
  }
})();

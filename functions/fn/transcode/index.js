const path = require('path');
const functions = require('firebase-functions');

const { createTranscodeJob } = require('../../lib/transcode');

exports.transcoderIn = functions.storage
  .bucket('video.the-faithful.com')
  .object()
  .onFinalize(async (object) => {
    console.log({ object });

    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const fileDir = path.dirname(filePath);
    const contentType = object.contentType; // File content type.
    // const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.
    // const fileName = path.basename(filePath);

    if (!filePath.startsWith('input/')) {
      return;
    }

    if (!contentType.startsWith('video/')) {
      return console.log('Skipping, only video content types supported?');
    }

    // if we're here, let's kick off a transcoder job
    const projectId = 'the-faithful';
    const location = 'us-central1';
    const inputUri = `gs://${fileBucket}/${filePath}`;
    const outputUri = `gs://${fileBucket}/${fileDir.replace(
      'input/',
      'output/'
    )}`;

    const result = await createTranscodeJob({
      projectId,
      location,
      inputUri,
      outputUri,
    });
    console.log(result);
  });

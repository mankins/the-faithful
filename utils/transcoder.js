const getSecrets = require('./lib/env'); // load environment config

const secrets = getSecrets('the-faithful');

// Imports the Transcoder library
const { TranscoderServiceClient } = require('@google-cloud/video-transcoder');

// Instantiates a client
const transcoderServiceClient = new TranscoderServiceClient();

async function createJobTemplate() {
  const config = await secrets;

  const projectId = config.PROJECT_ID || 'the-faithful';
  const location = 'us-central1';
  const templateId = 'tf-video-presets';

  // Construct request
  const request = {
    parent: transcoderServiceClient.locationPath(projectId, location),
    jobTemplateId: templateId,
    jobTemplate: {
      config: {
        elementaryStreams: [
          {
            key: 'video-stream0',
            videoStream: {
              codec: 'h264',
              heightPixels: 360,
              widthPixels: 640,
              bitrateBps: 550000,
              frameRate: 60,
            },
          },
          {
            key: 'video-stream1',
            videoStream: {
              codec: 'h264',
              heightPixels: 720,
              widthPixels: 1280,
              bitrateBps: 2500000,
              frameRate: 60,
            },
          },
          {
            key: 'audio-stream0',
            audioStream: {
              codec: 'aac',
              bitrateBps: 64000,
            },
          },
        ],
        muxStreams: [
          {
            key: 'sd',
            container: 'mp4',
            elementaryStreams: ['video-stream0', 'audio-stream0'],
          },
          {
            key: 'hd',
            container: 'mp4',
            elementaryStreams: ['video-stream1', 'audio-stream0'],
          },
        ],
      },
    },
  };

  // Run request
  const [jobTemplate] = await transcoderServiceClient.createJobTemplate(
    request
  );
  console.log(`Job template: ${jobTemplate.name}`);
}

async function getJobTemplate({
  templateId = 'presets/web-hd',
  projectId = 'the-faithful',
  location = 'us-central1',
}) {
  // Construct request
  const request = {
    name: transcoderServiceClient.jobTemplatePath(
      projectId,
      location,
      templateId
    ),
  };
  const [jobTemplate] = await transcoderServiceClient.getJobTemplate(request);
  console.log(`Job template: ${jobTemplate.name}`);
}

async function createJobFromAdHoc({
  projectId,
  location,
  inputUri,
  outputUri,
}) {
  // Construct request
  // https://cloud.google.com/transcoder/docs/reference/rest/v1beta1/JobConfig#SpriteSheet
  // https://support.video.ibm.com/hc/en-us/articles/207852117-Internet-connection-and-recommended-encoding-settings
  const request = {
    parent: transcoderServiceClient.locationPath(projectId, location),
    job: {
      inputUri: inputUri,
      outputUri: outputUri,
      config: {
        elementaryStreams: [
          {
            key: 'video-stream0',
            videoStream: {
              codec: 'h264',
              heightPixels: 720,
              widthPixels: 1280,
              bitrateBps: 400000,
              frameRate: 60,
            },
          },
          {
            key: 'video-stream1',
            videoStream: {
              codec: 'h264',
              heightPixels: 1080,
              widthPixels: 1920,
              bitrateBps: 700000,
              frameRate: 60,
            },
          },
          {
            key: 'video-stream2',
            videoStream: {
              codec: 'h264',
              heightPixels: 1080,
              widthPixels: 1920,
              bitrateBps: 1400000,
              frameRate: 60,
            },
          },
          {
            key: 'video-stream3',
            videoStream: {
              codec: 'h264',
              heightPixels: 1080,
              widthPixels: 1920,
              bitrateBps: 2100000,
              frameRate: 60,
            },
          },
          {
            key: 'video-stream4',
            videoStream: {
              codec: 'h264',
              heightPixels: 1080,
              widthPixels: 1920,
              bitrateBps: 4200000,
              frameRate: 60,
            },
          },
          {
            key: 'audio-stream0',
            audioStream: {
              codec: 'aac',
              bitrateBps: 64000,
              sampleRateHertz: 48000,
            },
          },
          {
            key: 'audio-stream1',
            audioStream: {
              codec: 'aac',
              bitrateBps: 128000,
              sampleRateHertz: 48000,
            },
          },
        ],
        muxStreams: [
          {
            key: '400kbs',
            container: 'mp4',
            elementaryStreams: ['video-stream0', 'audio-stream0'],
          },
          {
            key: 'video-only-400kbs',
            container: 'fmp4',
            elementaryStreams: ['video-stream0'],
          },
          {
            key: '700kbs',
            container: 'mp4',
            elementaryStreams: ['video-stream1', 'audio-stream0'],
          },
          {
            key: 'video-only-700kbs',
            container: 'fmp4',
            elementaryStreams: ['video-stream1'],
          },
          {
            key: '1400kbs',
            container: 'mp4',
            elementaryStreams: ['video-stream2', 'audio-stream0'],
          },
          {
            key: 'video-only-1400kbs',
            container: 'fmp4',
            elementaryStreams: ['video-stream2'],
          },
          {
            key: '2100kbs',
            container: 'mp4',
            elementaryStreams: ['video-stream3', 'audio-stream1'],
          },
          {
            key: 'video-only-2100kbs',
            container: 'fmp4',
            elementaryStreams: ['video-stream3'],
          },
          {
            key: '4200kbs',
            container: 'mp4',
            elementaryStreams: ['video-stream4', 'audio-stream1'],
          },
          {
            key: 'video-only-4200kbs',
            container: 'fmp4',
            elementaryStreams: ['video-stream4'],
          },

          {
            key: 'audio-only',
            container: 'fmp4',
            elementaryStreams: ['audio-stream0'],
          },
          {
            key: 'audio-only-high',
            container: 'fmp4',
            elementaryStreams: ['audio-stream1'],
          },
        ],
        manifests: [
          {
            fileName: 'manifest.m3u8',
            type: 'HLS',
            muxStreams: [
              'video-only-400kbs',
              'video-only-700kbs',
              'video-only-1400kbs',
              'video-only-2100kbs',
              'video-only-4200kbs',
              'audio-only',
              'audio-only-high',
            ],
          },
          {
            fileName: 'manifest.mpd',
            type: 'DASH',
            muxStreams: [
              'video-only-400kbs',
              'video-only-700kbs',
              'video-only-1400kbs',
              'video-only-2100kbs',
              'video-only-4200kbs',
              'audio-only',
              'audio-only-high',
            ],
          },
        ],
        spriteSheets: [
          {
            filePrefix: 'small-sprite-sheets',
            spriteHeightPixels: 32,
            spriteWidthPixels: 64,
            //              interval: '7s',
            columnCount: 10,
            rowCount: 10,
            totalCount: 100,
          },
          {
            filePrefix: 'large-sprite-sheets',
            spriteHeightPixels: 72,
            spriteWidthPixels: 128,
            //             interval: '7s',
            columnCount: 10,
            rowCount: 10,
            totalCount: 100,
          },
        ],
      },
    },
  };

  // Run request
  const [response] = await transcoderServiceClient.createJob(request);
  console.log(`Job: ${response.name}`, response);
}

async function main() {
  const config = await secrets;

  const projectId = config.PROJECT_ID || 'the-faithful';
  const location = 'us-central1';

  const myArgs = process.argv.slice(2);
  //console.log('myArgs: ', myArgs);
  let props = { projectId, location, templateId: 'preset/web-hd' };

  if (myArgs[0] === 'template') {
    if (myArgs[1]) {
      props.templateId = myArgs[1];
    }
    console.log({ props });
    await getJobTemplate(props);
  } else if (myArgs[0] === 'create-job-template') {
    if (myArgs[1]) {
      props.templateId = myArgs[1];
    }
    console.log({ props });
    await createJobTemplate(props);
  } else if (myArgs[0] === 'transcode') {
    if (myArgs[1]) {
      props.inputUri = myArgs[1];
    }
    if (myArgs[2]) {
      props.outputUri = myArgs[2];
    }

    console.log({ props });
    if (props.outputUri && props.inputUri) {
      await createJobFromAdHoc(props);
    } else {
        // node transcoder.js transcode gs://video.the-faithful.com/input/trailer-2021-02-10/Faithful%20Trailer%20KEITH%20CUT%20Full%20resolution%20Avid%20DNxHD%20175x%20_200810.mov gs://video.the-faithful.com/output/trailer-2021-02-11/

      console.log('missing output / input uri');
    }
  } else {
    console.log('Usage: transcoder.js [template|create-job-template]');
  }
}

main();

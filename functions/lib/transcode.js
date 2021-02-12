const { TranscoderServiceClient } = require('@google-cloud/video-transcoder');

// Instantiates a client
const transcoderServiceClient = new TranscoderServiceClient();

const createTranscodeJob = async ({
  projectId,
  location,
  inputUri,
  outputUri,
}) => {

    console.log('create transcode', { projectId, location, inputUri, outputUri });
    
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
              preset: 'medium',
              tune: 'grain', // film?
              enableTwoPass: true,
              heightPixels: 720,
              widthPixels: 1280,
              bitrateBps: 400000,
              frameRate: 30,
            },
          },
          {
            key: 'video-stream0-vp9',
            videoStream: {
              codec: 'vp9',
              preset: 'medium',
              tune: 'grain', // film?
              enableTwoPass: true,
              heightPixels: 720,
              widthPixels: 1280,
              bitrateBps: 400000,
              frameRate: 30,
            },
          },
          {
            key: 'video-stream0-h265',
            videoStream: {
              codec: 'h265',
              preset: 'medium',
              tune: 'grain', // film?
              enableTwoPass: true,
              heightPixels: 720,
              widthPixels: 1280,
              bitrateBps: 400000,
              frameRate: 30,
            },
          },
          {
            key: 'video-stream1',
            videoStream: {
              codec: 'h264',
              preset: 'medium',
              tune: 'grain', // film?
              enableTwoPass: true,
              heightPixels: 1080,
              widthPixels: 1920,
              bitrateBps: 700000,
              frameRate: 30,
            },
          },
          {
            key: 'video-stream1-vp9',
            videoStream: {
              codec: 'vp9',
              preset: 'medium',
              tune: 'grain', // film?
              enableTwoPass: true,
              heightPixels: 1080,
              widthPixels: 1920,
              bitrateBps: 700000,
              frameRate: 30,
            },
          },
          {
            key: 'video-stream1-h265',
            videoStream: {
              codec: 'h265',
              preset: 'medium',
              tune: 'grain', // film?
              enableTwoPass: true,
              heightPixels: 1080,
              widthPixels: 1920,
              bitrateBps: 700000,
              frameRate: 30,
            },
          },
          {
            key: 'video-stream2',
            videoStream: {
              codec: 'h264',
              preset: 'medium',
              tune: 'grain', // film?
              enableTwoPass: true,
              heightPixels: 1080,
              widthPixels: 1920,
              bitrateBps: 1400000,
              frameRate: 30,
            },
          },
          {
            key: 'video-stream2-vp9',
            videoStream: {
              codec: 'vp9',
              preset: 'medium',
              tune: 'grain', // film?
              enableTwoPass: true,
              heightPixels: 1080,
              widthPixels: 1920,
              bitrateBps: 1400000,
              frameRate: 30,
            },
          },
          {
            key: 'video-stream2-h265',
            videoStream: {
              codec: 'h265',
              preset: 'medium',
              tune: 'grain', // film?
              enableTwoPass: true,
              heightPixels: 1080,
              widthPixels: 1920,
              bitrateBps: 1400000,
              frameRate: 30,
            },
          },
          {
            key: 'video-stream3',
            videoStream: {
              codec: 'h264',
              preset: 'medium',
              tune: 'grain', // film?
              enableTwoPass: true,
              heightPixels: 1080,
              widthPixels: 1920,
              bitrateBps: 2100000,
              frameRate: 30,
            },
          },
          {
            key: 'video-stream3-vp9',
            videoStream: {
              codec: 'vp9',
              preset: 'medium',
              tune: 'grain', // film?
              enableTwoPass: true,
              heightPixels: 1080,
              widthPixels: 1920,
              bitrateBps: 2100000,
              frameRate: 30,
            },
          },
          {
            key: 'video-stream3-h265',
            videoStream: {
              codec: 'h265',
              preset: 'medium',
              tune: 'grain', // film?
              enableTwoPass: true,
              heightPixels: 1080,
              widthPixels: 1920,
              bitrateBps: 2100000,
              frameRate: 30,
            },
          },
          {
            key: 'video-stream4',
            videoStream: {
              codec: 'h264',
              preset: 'medium',
              tune: 'grain', // film?
              enableTwoPass: true,
              heightPixels: 1080,
              widthPixels: 1920,
              bitrateBps: 4200000,
              frameRate: 30,
            },
          },
          {
            key: 'video-stream4-vp9',
            videoStream: {
              codec: 'vp9',
              preset: 'medium',
              tune: 'grain', // film?
              enableTwoPass: true,
              heightPixels: 1080,
              widthPixels: 1920,
              bitrateBps: 4200000,
              frameRate: 30,
            },
          },
          {
            key: 'video-stream4-h265',
            videoStream: {
              codec: 'h265',
              preset: 'medium',
              tune: 'grain', // film?
              enableTwoPass: true,
              heightPixels: 1080,
              widthPixels: 1920,
              bitrateBps: 4200000,
              frameRate: 30,
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
            key: '400kbs-vp9',
            container: 'mp4',
            elementaryStreams: ['video-stream0-vp9', 'audio-stream0'],
          },
          {
            key: '400kbs-h265',
            container: 'mp4',
            elementaryStreams: ['video-stream0-h265', 'audio-stream0'],
          },
          {
            key: 'video-only-400kbs',
            container: 'fmp4',
            elementaryStreams: ['video-stream0'],
          },
          {
            key: 'video-only-400kbs-vp9',
            container: 'fmp4',
            elementaryStreams: ['video-stream0-vp9'],
          },
          {
            key: 'video-only-400kbs-h265',
            container: 'fmp4',
            elementaryStreams: ['video-stream0-h265'],
          },
          {
            key: '700kbs',
            container: 'mp4',
            elementaryStreams: ['video-stream1', 'audio-stream0'],
          },
          {
            key: '700kbs-vp9',
            container: 'mp4',
            elementaryStreams: ['video-stream1-vp9', 'audio-stream0'],
          },
          {
            key: '700kbs-h265',
            container: 'mp4',
            elementaryStreams: ['video-stream1-h265', 'audio-stream0'],
          },
          {
            key: 'video-only-700kbs',
            container: 'fmp4',
            elementaryStreams: ['video-stream1'],
          },
          {
            key: 'video-only-700kbs-vp9',
            container: 'fmp4',
            elementaryStreams: ['video-stream1-vp9'],
          },
          {
            key: 'video-only-700kbs-h265',
            container: 'fmp4',
            elementaryStreams: ['video-stream1-h265'],
          },
          {
            key: '1400kbs',
            container: 'mp4',
            elementaryStreams: ['video-stream2', 'audio-stream0'],
          },
          {
            key: '1400kbs-vp9',
            container: 'mp4',
            elementaryStreams: ['video-stream2-vp9', 'audio-stream0'],
          },
          {
            key: '1400kbs-h265',
            container: 'mp4',
            elementaryStreams: ['video-stream2-h265', 'audio-stream0'],
          },
          {
            key: 'video-only-1400kbs',
            container: 'fmp4',
            elementaryStreams: ['video-stream2'],
          },
          {
            key: 'video-only-1400kbs-vp9',
            container: 'fmp4',
            elementaryStreams: ['video-stream2-vp9'],
          },
          {
            key: 'video-only-1400kbs-h265',
            container: 'fmp4',
            elementaryStreams: ['video-stream2-h265'],
          },
          {
            key: '2100kbs',
            container: 'mp4',
            elementaryStreams: ['video-stream3', 'audio-stream1'],
          },
          {
            key: '2100kbs-vp9',
            container: 'mp4',
            elementaryStreams: ['video-stream3-vp9', 'audio-stream1'],
          },
          {
            key: '2100kbs-h265',
            container: 'mp4',
            elementaryStreams: ['video-stream3-h265', 'audio-stream1'],
          },
          {
            key: 'video-only-2100kbs',
            container: 'fmp4',
            elementaryStreams: ['video-stream3'],
          },
          {
            key: 'video-only-2100kbs-vp9',
            container: 'fmp4',
            elementaryStreams: ['video-stream3-vp9'],
          },
          {
            key: 'video-only-2100kbs-h265',
            container: 'fmp4',
            elementaryStreams: ['video-stream3-h265'],
          },

          {
            key: '4200kbs',
            container: 'mp4',
            elementaryStreams: ['video-stream4', 'audio-stream1'],
          },
          {
            key: '4200kbs-vp9',
            container: 'mp4',
            elementaryStreams: ['video-stream4-vp9', 'audio-stream1'],
          },
          {
            key: '4200kbs-h265',
            container: 'mp4',
            elementaryStreams: ['video-stream4-h265', 'audio-stream1'],
          },

          {
            key: 'video-only-4200kbs',
            container: 'fmp4',
            elementaryStreams: ['video-stream4'],
          },
          {
            key: 'video-only-4200kbs-vp9',
            container: 'fmp4',
            elementaryStreams: ['video-stream4-vp9'],
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
  return response;
};

module.exports = { createTranscodeJob };

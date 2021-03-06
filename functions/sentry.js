// const Sentry = require('@sentry/node');
// const Tracing = require("@sentry/tracing");

// const startTime = (new Date()).toISOString();

// const environment =
//   process.env.NODE_ENV === 'production' ? 'production' : 'dev';
// const release = process.env.COMMIT_SHA
//   ? `tf-${process.env.COMMIT_SHA}`
//   : 'tf-unset';

// Sentry.init({
//   environment,
//   release,
//   dsn:
//     'https://49b3f74fd7bc4b7884c2f29c12a1966d@o541573.ingest.sentry.io/5664711',
//   tracesSampleRate: 1.0,
// });

// console.log({ release, environment, startTime });

// exports = { Sentry, Tracing };

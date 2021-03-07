const fs = require('fs');
const dotenv = require('dotenv');

const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const secrets = new SecretManagerServiceClient();
const environment = process.env.NODE_ENV || 'dev';

let _env;

const getSecrets = (project = "") => {
  return new Promise((resolve) => {
    if (typeof _env !== 'undefined') {
      return resolve(_env);
    }

    if (environment !== 'production' && fs.existsSync('.env')) {
      const result = dotenv.config();

      if (result.error) {
        throw result.error;
      }
      _env = process.env;
      return resolve(process.env);
    }

    // try to get from our secrets manager
    const secretPath = `projects/${project}/secrets/env-${environment}/versions/latest`;
    console.log(`loading secrets from ${environment} / ${secretPath}`);

    return secrets
      .accessSecretVersion({
        name: secretPath,
      })
      .then(([secret]) => {
        return secret.payload.data.toString('utf8');
      })
      .then((config) => {
        return dotenv.parse(config) || {};
      })
      .then((parsed) => {
        Object.keys(parsed).forEach((key) => {
          // console.log('key', key, parsed[key]);
          process.env[key] = parsed[key];
        });
        _env = parsed;
        resolve(parsed);
      })
      .catch((e) => {
        console.log('config error', e);
        //reject(e);
        // NB: this will continue to bang on the secrets until it loads correctly?
        resolve(process.env);
      });
  });
};

module.exports = getSecrets;

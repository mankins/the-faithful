# Functions

For development, install firebase locally:

```
npm install -g firebase-tools
```

### Production / Development Config

Via `dotenv` and `.env`, although don't check in secrets to `.env`.

Instead we try to load `.env` and fall back on Google Secrets Manager, with secrets per environment: `env-dev`, `env-production` (based on `NODE_ENV`). Load these into the secrets manager via the command line:

```
cat .env | gcloud secrets create env-dev \
    --replication-policy="automatic" \
    --data-file=-
```

Or for `production`:

```
cat .env | gcloud secrets create env-production \
    --replication-policy="automatic" \
    --data-file=-
```

To update a secret

```
 cat .env | gcloud secrets versions add env-dev --data-file=-
```

You'll need IAM permissions on `the-faithful@appspot.gserviceaccount.com` of `Secret Manager Secret Accessor`.

### Emulator Config

```
firebase functions:config:get > .runtimeconfig.json

vi .runtimeconfig.json
```

### Run Emulator

```
npm run serve
```


## Create Functions

https://console.cloud.google.com/functions/add?authuser=0&project=the-faithful


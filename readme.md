# The Faithful

Built with SvelteKit. Hosted on Google Cloud.

## Dev

```
npm i
npm run dev
```

May need to install dotenv if you don't have it already installed.

```
npm install -g dotenv-cli
```

## Deployment 

We use a combination of Firebase, Cloud Functions, and Cloud Run.

Cloud functions are deployed via the `cloudbuild.yaml` file. On push to `main`, Cloud Build looks at this file and builds accordingly.

### For static files

Dynamic files are served via a "ssr" process, but pure static files are served from Firebase Hosting directly. If you change the static files you can update via:

```
firebase deploy --only hosting
```

## Cloud Run

Cloud Run has three main containers: `the-faithful-ssr` (server side render), `the-faithful-ssr-ingress` (reverse proxy), `the-faithful-tracking-proxy` (mailgun analytics https proxy)

The SSR ingress controller (nginx) maps to `origin.the-faithful.com` which is another Cloud Run container called `the-faithful-ssr`.

```
Firebase -> firebase.json -> Cloud Run SSR Ingress -> Cloud Run SSR
```

The ingress seemed to be needed to do gzip.

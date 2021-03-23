# The Faithful

Built with SvelteKit. Hosted on Google Cloud.

## Dev

```
npm run dev
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

Cloud Run has two main containers: an ingress controller (nginx) that maps to `origin.the-faithful.com` which is another Cloud Run container called `the-faithful ssr`.

```
Firebase -> firebase.json -> Cloud Run SSR Ingress -> Cloud Run SSR
```

The ingress does gzip. 
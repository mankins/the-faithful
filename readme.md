# The Faithful

Built with SvelteKit. Hosted on Google Cloud.

## Dev

```
npm run dev
```

## Deployment 

We use a combination of Firebase, Cloud Functions, and Cloud Run.

```
firebase init
firebase deploy           
```

## Cloud Run

Cloud Run has two main containers: an ingress controller (nginx) that maps to `origin.the-faithful.com` which is another Cloud Run container called `the-faithful ssr`.

```
Firebase -> firebase.json -> Cloud Run SSR Ingress -> Cloud Run SSR
```

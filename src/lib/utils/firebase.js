import { browser } from '$app/environment';
import { firebaseConfig } from '$lib/config/index.js';

const firebasePromise = new Promise(async (resolve) => {
  if (!browser) {
    return resolve(); // no ssr
  }

  // * as tmpFn from ... so "require is not defined" doesn't happen TODO(mankins)
  await import('firebase/auth/dist/index.cjs.js');
  await import('firebase/firestore/dist/index.node.cjs.js');
  // const fn = await import('firebase/functions/dist/index.cjs.js');
  await import('firebase/functions/dist/index.cjs.js');

  const fb = await import('firebase/app/dist/index.cjs.js');
  const firebase = fb.default;

  if (firebase.apps && firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }

  if (window.location.href.indexOf('localhost') !== -1) {
    // dev mode
    firebase.functions().useEmulator('localhost', 15001);
  }
  resolve(firebase);
});

// (async () => {
// })();

// export const firebaseAuth = firebase.auth
export default firebasePromise;

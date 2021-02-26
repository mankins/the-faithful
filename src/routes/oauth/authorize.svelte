<script>
  import FirebaseProvider from '$components/FirebaseProvider.svelte';

  import AccessDenied from '$components/AccessDenied.svelte';
  import Processing from '$components/Processing.svelte';

  import { onMount } from 'svelte';

  let db;
  let firebase;
  let loaded = false;
  let user = {};
  let query = {};
  let cookies = {};
  let errorMessage = '';

  const handleLogin = async (u) => {
      console.log({u});
  };

  const handleDbInit = async (ev) => {
    firebase = ev.detail.firebase;
    db = firebase.firestore();

    const oauthAuthorize = firebase.functions().httpsCallable('oauthAuthorize');
    try {
      const reply = await oauthAuthorize({ query, cookies });
      const authResponse = reply.data;
      // console.log({ authResponse });

      if (authResponse && authResponse.firebaseToken) {
        const userCredential = await firebase.auth().signInWithCustomToken(authResponse.firebaseToken);
        console.log({userCredential});
      }

    } catch (e) {
        // {"error":{"details":{"error":"oauth state does not match"},"message":"Internal Error","status":"INTERNAL"}}
      errorMessage = `${e.message || 'Unknown Error'}`;
    }

    loaded = true;
    window.location.href = '/';
  };

  const parseParams = (querystring) => {
    // parse query string
    const params = new URLSearchParams(querystring);

    const obj = {};

    // iterate over all keys
    for (const key of params.keys()) {
      if (params.getAll(key).length > 1) {
        obj[key] = params.getAll(key);
      } else {
        obj[key] = params.get(key);
      }
    }
    return obj;
  };
  const getCookies = (req) => {
    return req.split(';').reduce((res, item) => {
      const data = item.trim().split('=');
      return { ...res, [data[0]]: data[1] };
    }, {});
  };

  onMount(async () => {
    query = parseParams(window.location.search);
    cookies = getCookies(document.cookie);
  });
</script>

<svelte:head>
  <meta name="twitter:site" content="@TheFaithful" />
  <title
    >The Faithful: The King, The Pope, The Princess – A Movie by Annie Berman.</title
  >
</svelte:head>

<Processing processing={!loaded} />
{#if errorMessage}
<AccessDenied
message={errorMessage}
/>
{/if}

<FirebaseProvider on:init={handleDbInit} on:auth-success={handleLogin} />

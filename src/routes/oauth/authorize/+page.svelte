<script>
  import FirebaseProvider from '$lib/FirebaseProvider.svelte';

  import AccessDenied from '$lib/AccessDenied.svelte';
  import Processing from '$lib/Processing.svelte';
  import { getCookies } from '$lib/utils/cookies';
  import { parseParams } from '$lib/utils/query';
  import { sendEvent } from '$lib/utils/events';

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
 
      if (authResponse && authResponse.firebaseToken) {
        const userCredential = await firebase.auth().signInWithCustomToken(authResponse.firebaseToken);
        console.log({userCredential: JSON.stringify(userCredential)});
        sendEvent({ topic: 'user.login.success', type: 'coil' });
      }

      if (authResponse && authResponse.btpToken) {
         document.cookie = `_coil_btp=${authResponse.btpToken}; path=/`; // session
         document.cookie = '_oauth_state=; path=/; max-age=-1';
         document.cookie = '_oauth_redir=; path=/; max-age=-1';
      }

    } catch (e) {
        // {"error":{"details":{"error":"oauth state does not match"},"message":"Internal Error","status":"INTERNAL"}}
      errorMessage = `${e.message || 'Unknown Error'}`;
    }

    loaded = true;
    const nextUrl = decodeURIComponent(cookies._oauth_redir || '/') || '/';
    window.location.href = nextUrl;
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

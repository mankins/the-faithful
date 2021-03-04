<script context="module">
  export async function load({ page }) {
    const { ticketId } = page.params;
    return { props: { ticketId } };
  }
</script>

<script>
  import FirebaseProvider from '$components/FirebaseProvider.svelte';

  import { onMount } from 'svelte';
  import { parseParams } from '$components/utils/query';

  let db;
  let firebase;
  let loaded = false;
  let user = {};
  export let ticketId;

  const handleDbInit = async (ev) => {
    firebase = ev.detail.firebase;
    db = firebase.firestore();
    loaded = true;
  };

  let handleLogin = async (profile) => {
    if (!profile.detail) {
      console.log('not logged in.');
      window.location.href = '/?err=not+logged+in';
      return;
    }
    user = profile.detail.user;
    console.log({ user });
    firebase = firebase || profile.detail.firebase;
    db = db || firebase.firestore();
  };

  onMount(async () => {
    loaded = true;
  });
</script>

<svelte:head>
  <meta name="twitter:site" content="@TheFaithful" />
  <title
    >Preview for The Faithful: The King, The Pope, The Princess – A Movie by
    Annie Berman.</title
  >
  <meta
  property="og:image"
  content="https://www.the-faithful.com/img/the-faithful-poster-3.jpg"
  />

<meta
  property="twitter:image"
  content="https://www.the-faithful.com/img/the-faithful-poster-3.jpg"

/>
<meta property="twitter:card" content="summary_large_image" />

</svelte:head>

<FirebaseProvider on:init={handleDbInit} on:auth-success={handleLogin}>
  {#if loaded}
  hi there tickets {ticketId}
  {/if}

</FirebaseProvider>


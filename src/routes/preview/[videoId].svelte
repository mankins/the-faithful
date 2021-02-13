<script context="module">
  export async function load({ page }) {
    const { videoId } = page.params;
    return { props: { videoId } };
  }
</script>

<script>
  import FirebaseProvider from '$components/FirebaseProvider.svelte';

  // import Toast from '$components/Toast.svelte';

  import AccessDenied from '$components/AccessDenied.svelte';
  import VideoPlayer from '$components/VideoPlayer.svelte';
  import { onMount } from 'svelte';
  import { productsEntitle } from '$components/utils/entitles.js';
  import { baseProducts } from '$components/utils/auth.js';

  let db;
  let firebase;
  let loaded = false;
  let user = {};
  let userProducts = [...baseProducts]; // these are the products that the user has
  // f8NFF01pyowaiq6H1jJxWnODzFFRFYMqRM0101U4RqYMqE vs t2jYTAKc71QbCfyTlau3GJfErwcJLmnLQS8xHWclWvE

  // require logged in user
  //  user has products=[]

  let player;
  let title = 'The Faithful: The King, The Pope, The Princess';
  let poster = '/img/trailer-cover-1b.jpg';

  export let videoId = 't2jYTAKc71QbCfyTlau3GJfErwcJLmnLQS8xHWclWvE'; // 'f8NFF01pyowaiq6H1jJxWnODzFFRFYMqRM0101U4RqYMqE';

  let entitled = false;

  let captionsSrc = '/subtitles/faithful-trailer.mp4.vtt';

  const handleDbInit = async (ev) => {
    firebase = ev.detail.firebase;
    db = firebase.firestore();
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
    console.log({ userProducts });
    entitled = await productsEntitle(userProducts, `video:${videoId}:preview`);
    console.log({ entitled });
    loaded = true;
  });
</script>

<svelte:head>
  <meta name="twitter:site" content="@TheFaithful" />
  <title
    >Preview for The Faithful: The King, The Pope, The Princess – A Movie by
    Annie Berman.</title
  >
</svelte:head>

<FirebaseProvider on:init={handleDbInit} on:auth-success={handleLogin}>
  {#if loaded}
    {#if entitled}
      <VideoPlayer {poster} {videoId} {captionsSrc} />
    {:else}
      <AccessDenied message="Sorry you don't have access to this video." />
    {/if}
  {/if}
</FirebaseProvider>

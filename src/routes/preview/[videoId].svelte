<script context="module">
  export async function load({ page }) {
    const { videoId } = page.params;
    return { props: { videoId } };
  }
</script>

<script>
  import FirebaseProvider from '$components/FirebaseProvider.svelte';

  // import Toast from '$components/Toast.svelte';
  import Footer from '$components/nav/Footer.svelte';
  import LoginModal from '$components/LoginModal.svelte';

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
  let nextUrl = '/';
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

    nextUrl = window.location.href;

    const goal = 'W6DQW4K3';
    if (entitled) {
      window.fathom.trackGoal(goal, 0);
    }
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
      <Footer />
      {:else}
      {#if user && user.email}
      <AccessDenied message={`Sorry you don't have access to this video as ${user.email}`} />
      {:else}
      <LoginModal nextUrl={nextUrl} />
      {/if}
    {/if}
    {/if}
</FirebaseProvider>

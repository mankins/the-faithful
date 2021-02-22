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
  import Processing from '$components/Processing.svelte';
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
  let goal = 'W6DQW4K3';

  let requiredEntitlement = `video:${videoId}:preview`; // 'video:thefaithful:20210320'; // 'video:thefaithful:20210320:2000' `video:${videoId}:preview`;

  const handleDbInit = async (ev) => {
    firebase = ev.detail.firebase;
    db = firebase.firestore();

    const userProductsFn = firebase
      .functions()
      .httpsCallable('userEntitlements');
    try {
      const reply = await userProductsFn({});
      const products = reply.data;
      console.log({ products });
      products.userProducts.forEach((product) => {
        userProducts.push(`${product}`);
      });
      await checkEntitlement();
    } catch (e) {
      console.log(e);
    }

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

  const checkEntitlement = async () => {
    console.log('------------------', { userProducts, requiredEntitlement });
    entitled = await productsEntitle(userProducts, requiredEntitlement);
    console.log({ entitled });
  };

  onMount(async () => {
    nextUrl = window.location.href;
    await checkEntitlement();
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
      <VideoPlayer {poster} {videoId} {captionsSrc} {goal} />
      <Footer />
    {:else if user && user.email}
      <AccessDenied
        message={`Sorry you don't have access to this video as ${user.email}`}
      />
    {:else}
      <LoginModal {nextUrl} />
    {/if}
  {/if}
</FirebaseProvider>

<Processing processing={!loaded} />

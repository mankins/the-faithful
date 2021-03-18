<script context="module">
  export async function load({ page }) {
    const { room } = page.params;
    return { props: { room } };
  }
</script>

<script>
  import { onMount, onDestroy } from 'svelte';
  import VideoPlayer from '$components/VideoPlayerTheatre.svelte';
  import FirebaseProvider from '$components/FirebaseProvider.svelte';
  import { fade, fly } from 'svelte/transition';
  import JSPretty from '$components/JSPretty.svelte';
  import WebMonCounter from '$components/WebMonCounter.svelte';
  import { webmon } from '$components/stores/webmon.js';
  import { productsEntitle } from '$components/utils/entitles.js';
  import { userEntitlements } from '$components/stores/entitlements.js';

  let userProducts = [];

  import get from 'lodash.get';
  import timecodes from 'node-timecodes';

  // import Footer from '../../../components/nav/Footer.svelte';
  // import Index from '../index.svelte';

  export let room = 'waiting';
  let theatre = {};
  let db;
  let firebase;
  let user = {};
  let skew = 0;
  let testingOffset = 0;
  let isActive = true;
  let endOfShow = false;
  let closeWebMon = false;

  const handleDbInit = async (ev) => {
    firebase = ev.detail.firebase;
    db = firebase.firestore();

    // const userProductsFn = firebase
    //   .functions()
    //   .httpsCallable('userEntitlements');
    // try {
    //   const reply = await userProductsFn({});
    //   const products = reply.data;
    //   // console.log({ products });
    //   products.userProducts.forEach((product) => {
    //     userProducts.push(`${product}`);
    //   });
    //   // await checkEntitlement();
    // } catch (e) {
    //   console.log(e);
    // }
  };

  const updatePlayerCursor = () => {
    // theatreDuration = media.duration || 1;
    // theatreCurrentTime = timecodes.fromSeconds(media.currentTime);
    if (!theatreDuration) {
      // console.log('no td yet');
      return;
    }
    if (theatre.waiting === true) {
      // special waiting room
      if (!productsEntitle($userEntitlements, 'site:admin')) {
        // redirect
        window.location.href = '/my/theatre/waiting';
      }
    }
    if (theatre.redirect) {
      window.location.href = `${theatre.redirect}`;
    }

    endOfShow =
      theatreDuration &&
      parseInt(playerTheatre.currentTime, 10) >= parseInt(theatreDuration, 10)
        ? true
        : false;

    if (theatre.status === 'paused') {
      // we should seek to this part
      const seekTs = theatre.startTs;
      if (playerTheatre) {
        if (playerTheatre.playing) {
          playerTheatre.currentTime = seekTs;
          setTimeout(() => {
            playerTheatre.pause();
          }, 500);
        } else {
          playerTheatre.currentTime = seekTs;
        }
      }
    } else if (theatre.status === 'playing') {
      // calculate the current position
      const startTs = parseInt(get(theatre, 'eventTs.seconds'), 10);
      if (!startTs) {
        return;
      }

      let currentTs =
        testingOffset +
        Date.now() / 1000 -
        startTs +
        skew +
        parseInt(theatre.startTs, 0);

      if (!playerTheatre.playing) {
        setTimeout(() => {
          playerTheatre.currentTime = currentTs;
          setTimeout(() => {
            if (!playerTheatre.playing) {
              playerTheatre.play();
            }
          }, 100);
        }, 1500);
      } else {
        playerTheatre.currentTime = currentTs;
      }
    }
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

    const tmpRef = db.collection('tmp').doc(user.uid);
    const now = testingOffset + Date.now() / 1000;
    await tmpRef.set(
      {
        now: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    const c = await tmpRef.get();
    const d = c.data();
    // console.log({now:d.now});
    const serverNow =
      get(d, 'now.seconds') + parseInt(get(d, 'now.nanoseconds')) / 1000000000;
    skew = serverNow - now;

    const docRef = db.collection('rooms').doc(room);
    try {
      const doc = await docRef.get();
      if (!doc.exists) {
        console.log('room not found');
        return;
      } else {
        theatre = { ...doc.data() };
      }
    } catch (e) {
      console.log('error loading theatre', e);
    }

    const doc = db.collection('rooms').doc(room);
    doc.onSnapshot((docSnapshot) => {
      theatre = { ...docSnapshot.data() };
    });
  };

  $: playerTheatre && theatre && theatreDuration && updatePlayerCursor();

  // const debugMyStream = () => {
  //   console.log({ gal: $gal });
  // };

  // $: $gal.myStream && debugMyStream();

  onDestroy(() => {
    isActive = false;
  });

  onMount(() => {
    isActive = true;
  });

  let theatreCurrentTime;
  let theatreDuration;
  let playerTheatre;
  let playerTheatreStatus;

  const handleTheatreInit = (ev) => {
    playerTheatre = ev.detail.player;
    playerTheatre.on('ready', () => {
      let media = playerTheatre.media;
      theatreDuration = media.duration;
      if (!media) {
        console.log('warn - no media?', media);
        return;
      }

      setTimeout(() => {
        if (!playerTheatre.playing) {
          playerTheatre.play();
        }
      }, 1500);

      return;
    });

    playerTheatre.on('play', () => {
      // get current timestamp
      // update room to show playing at TS, status to playing, eventTs = now
      const media = playerTheatre.media;
      if (!media) {
        return;
      }
      playerTheatreStatus = 'playing';
      updatePlayerCursor();
    });

    playerTheatre.on('pause', () => {
      // get current timestamp
      // update room to show playing at TS, status to playing, eventTs = now
      const media = playerTheatre.media;
      if (!media) {
        return;
      }
      playerTheatreStatus = 'paused';
    });

    playerTheatre.on('timeupdate', () => {
      const media = playerTheatre.media;
      // console.log({ media });
      if (!media) {
        return;
      }

      theatreDuration = media.duration || 1;
      theatreCurrentTime = timecodes.fromSeconds(media.currentTime);
      if (theatre.loop) {
        if (media.currentTime >= media.duration) {
          media.currentTime = 1; // looper
          playerTheatre.play();
        }
      }
    });
  };

  // <pre class="text-xs bg-white">
  //             <JSPretty obj={get($gal, 'myStream', {})}></JSPretty> </pre>
  //           </div>

  //             {#if get($gal, 'myStream.c.up', false)}
  // $: $downs && console.log($downs, 'downs');
  // $: $downs && console.log('zzaa', get($downs[$talker], 'c.stream.active'));
</script>

<FirebaseProvider on:init={handleDbInit} on:auth-success={handleLogin}>
  <div class="">
    {#if !endOfShow && theatre && theatre.status === 'playing'}
      <section class="overflow-hidden sm:overflow-auto">
        {#if theatre && theatre.muxPlaybackId && isActive}
          <VideoPlayer
            on:newvideoplayer={handleTheatreInit}
            autoplay={false}
            start={true}
            poster={theatre.posterUrl}
            videoId={theatre.muxPlaybackId}
            captionsSrc={theatre.captionsUrl}
            videoPlayerId={`video-player-${room}`}
          />
        {/if}
      </section>
    {:else if endOfShow}
      <div class="aspect-w-16 aspect-h-9" transition:fade>
        <div class="flex max-h-screen bg-gray-900 text-white">
          <div class="m-auto">
            <div id="expand-video" class="expand-video" />
            <h3
              class="text-white items-center m-auto font-serif font-extrabold tracking-tight text-2xl sm:text-5xl"
            >
            {#if theatre.endMessage}
            {theatre.endMessage}
            {:else}
              Movie ended. Q&A time!
              {/if}
            </h3>
          </div>
        </div>
      </div>
    {:else}
      <div class="aspect-w-16 aspect-h-9" transition:fade>
        <div class="flex max-h-screen bg-gray-900 text-white">
          <div class="m-auto">
            <div id="expand-video" class="expand-video" />
            <h3
              class="text-white items-center m-auto font-serif font-extrabold tracking-tight text-2xl sm:text-5xl"
            >
              {#if theatre.pauseMessage}
              {theatre.pauseMessage}
              {:else}
              The show will start soon
                {/if}
  
            </h3>
          </div>
        </div>
      </div>
    {/if}
  </div>
  <div class="mt-6 sm:mt-6 md:mt-8 p-2 sm:p-6 md:p-12 mb-4">
    <div class="bg-gray-500 shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Join us immediately after the screening for a live Q&A with the
          filmmakers.
        </h3>
        <div class="mt-2 max-w-xl text-sm text-gray-800">
          <p>
            If you have any problems, <a
              rel="ext"
              class="underline"
              target="_blank"
              href="https://www.notion.so/The-Faithful-FAQ-s-05fe7a8a5566447e82181a4068198ac4"
              >please reach out</a
            >.
          </p>
        </div>
        <div class="mt-3 text-sm">
          <a
            rel="external"
            target="_blank"
            href={theatre.qaLink}
            class="font-medium text-white hover:text-faithful-500 hover:underline"
          >
            Live Q&A <span aria-hidden="true">&rarr;</span></a
          >
        </div>
      </div>
    </div>
  </div>
  {#if theatre.extraMessage}
  <div class="mt-6 sm:mt-6 md:mt-8 p-2 sm:p-6 md:p-12 mb-4">
    <div class="bg-red-50 shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {theatre.extraMessageHeadline || 'News'}
        </h3>
        <div class="mt-2 max-w-xl text-sm text-gray-800">
          <p>
            {theatre.extraMessage}
          </p>
        </div>
        {#if theatre.extraMessageLink}
        <div class="mt-3 text-sm">
          <a
            rel="external"
            target="_blank"
            href={theatre.extraMessageLink}
            class="font-medium text-black hover:text-faithful-500 hover:underline"
          >
            {theatre.extraMessageCta || 'More'} <span aria-hidden="true">&rarr;</span></a
          >
        </div>
        {/if}
      </div>
    </div>
  </div>
  {/if}
  {#if $webmon.monetized && !closeWebMon}
    <div class="relative bg-faithful-500 opacity-50">
      <div class="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <img src="/svg/congrats-twemoji.svg" alt="congrats emoji" />
        <div class="pr-16 sm:text-center sm:px-16">
          <p class="font-medium text-gray-800">
            <span class="md:hidden"> You're Web Monetized! </span>
            <span class="hidden md:inline">
              You're Web Monetized! Thanks for your support.
            </span>
            <span class="block sm:ml-2 sm:inline-block">
              <WebMonCounter />
            </span>
          </p>
        </div>
        <div
          class="absolute inset-y-0 right-0 pt-1 pr-1 flex items-start sm:pt-1 sm:pr-2 sm:items-start"
        >
          <button
            type="button"
            on:click={() => {
              closeWebMon = true;
            }}
            class="flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <span class="sr-only">Dismiss</span>
            <!-- Heroicon name: outline/x -->
            <svg
              class="h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  {:else if !closeWebMon}
    <div class="relative bg-faithful-500 opacity-50 mt-6">
      <div class="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <img class="p-20" src="/svg/coil-logo-black.svg" alt="coil" />
        <div class="pr-16 sm:text-center sm:px-16">
          <p class="font-medium text-gray-800">
            <span class="md:hidden"> New to Web Monetization? </span>
            <span class="hidden md:inline">
              If you had a Web Monetization pass, this movie would be included
              for free as part of your monthly pass.
            </span>
            <span class="block sm:ml-2 sm:inline-block">
              <a
                href="https://coil.com/signup?ref=mankins1701"
                rel="nofollow"
                target="_blank"
                class="text-white font-bold underline"
              >
                Learn more <span aria-hidden="true">&rarr;</span></a
              >
            </span>
          </p>
        </div>
        <div
          class="absolute inset-y-0 right-0 pt-1 pr-1 flex items-start sm:pt-1 sm:pr-2 sm:items-start"
        >
          <button
            type="button"
            on:click={() => {
              closeWebMon = true;
            }}
            class="flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <span class="sr-only">Dismiss</span>
            <!-- Heroicon name: outline/x -->
            <svg
              class="h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  {/if}

  {#await productsEntitle($userEntitlements, 'site:debug') then debugMode}
    {#if debugMode}
      <pre
        class="text-xs bg-white">
        <JSPretty obj={theatre} />
        <JSPretty obj={{webMon: $webmon, entitlements: $userEntitlements, theatreDuration, currentTs: (playerTheatre && playerTheatre.currentTime) ? parseInt(playerTheatre.currentTime,10):'-' }} />
      </pre>
    {/if}
  {/await}
</FirebaseProvider>

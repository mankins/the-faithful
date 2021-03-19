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
  import { gal, talker, talking, downs, me } from '$components/stores/gal';
  import { fade, fly } from 'svelte/transition';
  import { heroMode } from '$components/stores/room.js';
  import JSPretty from '$components/JSPretty.svelte';

  import get from 'lodash.get';
  import timecodes from 'node-timecodes';

  import Seating from '$components/room/Seating.svelte';
  import UserVideo from '$components/user/UserVideo.svelte';
import Footer from '../../../components/nav/Footer.svelte';
import Index from '../index.svelte';

  export let room = 'waiting';
  let theatre = {};
  let db;
  let firebase;
  let user = {};
  let skew = 0;
  let testingOffset = 0;
  let audienceMode = false;
  let heroState = 'theatre';
  let audienceState = '';

  let mute = false;

  const joinLeaveAudience = async () => {
    if (!audienceMode) {
      audienceState = 'connecting';
      await gal.initialize(); // setup network connection
      await gal.connect({ userName: user.email });
      audienceState = 'connected';
      audienceMode = true;
    } else {
      // keep the connection open?
      await gal.destroy();
      audienceMode = false;
    }
  };

  const enableMedia = async () => {
    // this should start our media stream
    // console.log({ gal: $gal });
    if ($gal.state !== 'connected') {
      window.pushToast(
        `Still starting up, try agian in a few seconds.`,
        'alert'
      );
      return;
    }
    try {
      await gal.startStream({ localId: null, mute: false });
      // window.pushToast(`Audio/video started.`, 'info');
      mediaEnabled = true;
    } catch (e) {
      window.pushToast(`Unable to start media. ${e.message}`, 'alert');
      mediaEnabled = false;
      console.log('error starting media', e);
    }
  };

  const disableMedia = async () => {
    mediaEnabled = false;
    gal.endStream('local');
  };

  const handleDbInit = async (ev) => {
    firebase = ev.detail.firebase;
    db = firebase.firestore();
  };

  const updatePlayerCursor = () => {
    // theatreDuration = media.duration || 1;
    // theatreCurrentTime = timecodes.fromSeconds(media.currentTime);
    if (!theatreDuration) {
      // console.log('no td yet');
      return;
    }
    if (theatre.type === 'waiting') {
      // special waiting room
      return;
    }
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

    // console.log('calling gal init');
  };

  const debugMyStream = () => {
    console.log({ gal: $gal });
  };

  $: playerTheatre && theatre && theatreDuration && updatePlayerCursor();
  // $: $gal.myStream && debugMyStream();

  let isActive = true;
  let canWebrtc = true;
  let mediaEnabled = false;

  onDestroy(() => {
    isActive = false;
  });

  onMount(() => {
    canWebrtc = !(typeof window.RTCPeerConnection === 'undefined');

    heroMode.subscribe(async (value) => {
      heroState = value;

      if (db) {
        if (theatre.mode !== heroState) {
          // should update the state
          const roomRef = db.collection('rooms').doc(room);
          await roomRef.set(
            {
              mode: heroState,
            },
            { merge: true }
          );
        }
      }
      // update the document
    });
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
<svelte:head>
  <title
    >Labs : The Faithful</title
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
  <div class="">
    {#if theatre.mode === 'presentation'}
      <div class="aspect-w-16 aspect-h-9" transition:fade>
        <div class="flex max-h-screen bg-gray-900 text-white">
          {#if $downs[$talker] && get($downs[$talker], 'c.stream.active', false)}
            <div class="bg-gray-800 w-full">
              <UserVideo
                muted={false}
                stream={$downs[$talker].c}
                videoId={$downs[$talker].c.id}
              />
            </div>
          {:else if mediaEnabled && get($gal, 'myStream.c')}
            <div class="bg-gray-800 w-full is-me">
              <UserVideo
                muted={true}
                stream={get($gal, 'myStream.c')}
                videoId={get($gal, 'myStream.c.id')}
              />
            </div>
          {:else}
            <div class="m-auto">
              <div id="expand-video" class="expand-video" />
              <h3
                title={`${$talker} ${mediaEnabled}`} class="text-white items-center m-auto font-serif font-extrabold tracking-tight text-2xl sm:text-5xl"
              >
              {#if audienceMode}
                --
                {:else}
                Join audience for video
                {/if}
              </h3>
            </div>
          {/if}
        </div>
      </div>
    {:else}
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
    {/if}
    {#if false}
      <button
        on:click={() => {
          window.player.fullscreen.toggle();
        }}
      >
        Toggle Full Screen
      </button>
    {/if}
    {#if theatre.fancy}
      <div class="bg-gray-800">
        <div class="flex flex-row justify-between items-center">
          {#if audienceMode}
            <button
              type="button"
              on:click={() => {
                joinLeaveAudience();
                disableMedia();
              }}
              class="inline-flex w-auto ml-4 mr-4 mt-4 mb-4 items-center px-6 py-3 border border-gray-300 shadow-sm text-sm sm:text-base font-medium rounded-md text-gray-500 bg-transparent hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500"
            >
              Leave <span class="hidden sm:block">&nbsp; Audience</span>
            </button>
            {#if mediaEnabled}
              <button
                type="button"
                on:click={() => disableMedia()}
                class="inline-flex w-auto ml-4 mr-4 mt-4 mb-4 items-center px-6 py-3 border border-gray-500 shadow-sm text-sm sm:text-base font-medium rounded-md text-gray-400 bg-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500"
              >
                Disable
                <svg
                  class="ml-2 h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            {:else}
              <button
                type="button"
                on:click={() => enableMedia()}
                class="inline-flex w-auto ml-4 mr-4 mt-4 mb-4 items-center px-6 py-3 border border-gray-500 shadow-sm text-sm sm:text-base font-medium rounded-md text-gray-400 bg-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500"
              >
                Enable
                <svg
                  class="ml-2 h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            {/if}
          {:else}
            <button
              on:click={() => {
                joinLeaveAudience();
              }}
              type="button"
              class="inline-flex w-auto ml-4 mr-4 mt-4 mb-4 items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-500 bg-transparent hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500"
            >
              Join Audience
            </button>
          {/if}
        </div>
      </div>
      {#if audienceMode}
        {#if canWebrtc}
          {#if audienceState === 'connecting'}
            <div class="flex flex-row items-center">
              <h2 class="m-auto text-gray-200 font-serif p-4">
                Connecting to audience
              </h2>
            </div>
          {:else}
            <div transition:fade class="pb-5 border-b border-gray-200 h-screen">
              <Seating {room} />
            </div>
          {/if}
        {:else}
          <div class="p-12">
            <div class="bg-white shadow sm:rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  WebRTC is required for the audience feature.
                </h3>
                <div class="mt-2 max-w-xl text-sm text-gray-500">
                  <p>This browser doesn't support WebRTC.</p>
                </div>
                <div class="mt-3 text-sm">
                  <a
                    rel="external"
                    target="_blank"
                    href="https://en.wikipedia.org/wiki/WebRTC"
                    class="font-medium text-faithful-600 hover:text-faithful-500"
                  >
                    Learn more about WebRTC <span aria-hidden="true"
                      >&rarr;</span
                    ></a
                  >
                </div>
              </div>
            </div>
          </div>
        {/if}
      {/if}
    {/if}
    {#if false}
    <pre
      class="text-xs bg-white">
  <JSPretty obj={$talking} /></pre>
    <pre
      class="text-xs bg-white">
    <JSPretty obj={$talker} /></pre>
  {/if}

  </div>
</FirebaseProvider>

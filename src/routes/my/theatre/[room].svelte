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
  import { chats, gal, peers } from '$components/stores/gal';
  import { fade, fly } from 'svelte/transition';

  // import { realtime } from '$components/stores/channel.js';
  import get from 'lodash.get';
  import timecodes from 'node-timecodes';
  // import Index from '../admin/projector/index.svelte';
  import Seating from '$components/room/Seating.svelte';

  export let room = 'waiting';
  let theatre = {};
  let db;
  let firebase;
  let user = {};
  let skew = 0;
  let testingOffset = 0;
  let audienceMode = false;

  const handleDbInit = async (ev) => {
    firebase = ev.detail.firebase;
    db = firebase.firestore();
  };

  const updatePlayerCursor = () => {
    // theatreDuration = media.duration || 1;
    // theatreCurrentTime = timecodes.fromSeconds(media.currentTime);
    if (!theatreDuration) {
      console.log('no td yet');
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

    gal().connect({userName:user.email});

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
  let isActive = true;
  let galState = {};

  onDestroy(() => {
    isActive = false;
  });

  onMount(() => {});

  let theatreCurrentTime;
  let theatreDuration;
  let playerTheatre;
  let playerTheatreStatus;
  gal().subscribe(async (newState) => {
    galState = { ...newState };
  });

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

      //         if (theatre.type === 'waiting') {
      //   // special waiting room
      //   return;
      // }

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
</script>

<FirebaseProvider on:init={handleDbInit} on:auth-success={handleLogin}>
  <div class="">
    <section class="overflow-hidden sm:overflow-auto">
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
    </section>

    {#if false}
      <button
        on:click={() => {
          window.player.fullscreen.toggle();
        }}
      >
        Toggle Full Screen
      </button>
    {/if}

    <div class="bg-gray-800">
      {#if audienceMode}
    <button type="button" on:click={()=> audienceMode = false} class="inline-flex w-auto ml-4 mr-4 mt-4 mb-4 items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-500 bg-transparent hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500">
      Leave Audience
    </button>
    {:else}
    <button on:click={()=> audienceMode = true} type="button" class="inline-flex w-auto ml-4 mr-4 mt-4 mb-4 items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-500 bg-transparent hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500">
      Join Audience
    </button>
    {/if}
  </div>
  {#if audienceMode}
    <div transition:fade class="pb-5 border-b border-gray-200 h-screen">
      <Seating {room} />
    </div>
    {/if}
  </div>
</FirebaseProvider>

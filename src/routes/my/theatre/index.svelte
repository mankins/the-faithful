<script>
  import { onMount,onDestroy } from 'svelte';
  import VideoPlayer from '$components/VideoPlayerTheatre.svelte';
  import FirebaseProvider from '$components/FirebaseProvider.svelte';
  import { realtime } from '$components/stores/channel.js';
  import get from 'lodash.get';
  import timecodes from 'node-timecodes';
  import Index from '../admin/projector/index.svelte';

  let theatre = {};
  let db;
  let firebase;
  let user = {};
  let skew = 0;
  let testingOffset = 0;

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

    const docRef = db.collection('rooms').doc('theatre');
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

    const doc = db.collection('rooms').doc('theatre');
    doc.onSnapshot((docSnapshot) => {
      theatre = { ...docSnapshot.data() };
    });
  };

  $: playerTheatre && theatre && theatreDuration && updatePlayerCursor();
  let isActive = true;

  onDestroy(()=>{
    isActive = false;
  });

  onMount(() => {
    // <VideoPlayer
    //   poster="/img/trailer-cover-1b.jpg"
    //   videoId="taMah02Uj0286rdwiMyPoh8F6CFF4Uqo4HNQPmojRYGJM"
    //   captionsSrc=""
    //   autoplay={true}
    //   loop={true}
    //   goals={[]}
    // />
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
      // init theatre
      if (theatre.status === 'paused') {
        // we should seek to this part
        const seekTs = parseInt(theatre.startTs, 10);
        theatreCurrentTime = timecodes.fromSeconds(seekTs);
        if (playerTheatre) {
          if (playerTheatre.playing) {
            playerTheatre.pause();
          }
          playerTheatre.currentTime = seekTs;
        }
      } else if (theatre.status === 'playing') {
        // calculate the current position
        const startTs = parseInt(get(theatre, 'eventTs.seconds'), 10);
        if (!startTs) {
          return;
        }
        let currentTs;
        if (false && theatreDuration) {
          currentTs =
            (testingOffset +
              Date.now() / 1000 -
              startTs +
              skew +
              parseInt(theatre.startTs, 10)) %
            theatreDuration;
        } else {
          currentTs =
            testingOffset +
            Date.now() / 1000 -
            startTs +
            skew +
            parseInt(theatre.startTs, 10);
        }
        theatreCurrentTime = timecodes.fromSeconds(currentTs);
        if (!playerTheatre.playing) {
          setTimeout(() => {
            playerTheatre.currentTime = currentTs;
            setTimeout(() => {
              if (!playerTheatre.playing) {
                playerTheatre.play();
              }
            }, 100);
          }, 500);
        } else {
          playerTheatre.currentTime = currentTs;
        }
      }
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
            videoPlayerId="video-player-theatre-1"
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

    <div class="pb-5 border-b border-gray-200">
      <h3
        class="pt-12 md:pt-24 text-3xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-5xl"
      >
        Theatre
      </h3>
    </div>
    <div class="bg-white shadow overflow-hidden sm:rounded-lg m-auto p-12" />
  </div>
</FirebaseProvider>

<script>
  import { onMount, onDestroy } from 'svelte';
  import FirebaseProvider from '$lib/FirebaseProvider.svelte';
  import { realtime } from '$lib/stores/channel.js';
  import get from 'lodash.get';
  import VideoPlayer from '$lib/VideoPlayerTheatre.svelte';
  import timecodes from 'node-timecodes';
  import JSPretty from '$lib/JSPretty.svelte';
  import { debounce } from '$lib/utils/debounce';
  import { page as pageStore } from '$lib/stores';
  import ConfirmModal from '$lib/modals/ConfirmModal.svelte';

  let db;
  let firebase;
  let loaded = false;
  let user = {};
  let channels = {};
  let theatre = {};
  let skew = 0;
  let projectorCurrentTime;
  let projectorDuration;
  let playerProjector;
  let setPlay = () => {};
  let setPaused = () => {};
  let presetSelected;
  let testingOffset = 0;
  let warnMessage = false;
  let warnMessageModal = false;
  let lastWarningTimer;
  let endOfShow = false;

  const handlePresetChange = () => {};

  // let thing = $token.val.keyName;

  const handleDbInit = async (ev) => {
    firebase = ev.detail.firebase;
    db = firebase.firestore();
  };

  const updatePlayerPositions = () => {
    if (!projectorDuration) {
      return;
    }

    if (theatre.status === 'paused') {
      // we should seek to this part
      const seekTs = theatre.startTs;
      projectorCurrentTime = timecodes.fromSeconds(seekTs);
      if (playerProjector) {
        // if (playerProjector.playing) {
        //   playerProjector.pause();
        // }
        playerProjector.currentTime = seekTs;
      } else {
      }
    } else if (theatre.status === 'playing') {
      // calculate the current position
      const startTs = parseInt(get(theatre, 'eventTs.seconds'), 10);
      if (!startTs) {
        return;
      }
      let currentTs;
      if (projectorDuration && false) {
        currentTs =
          (testingOffset +
            Date.now() / 1000 -
            startTs +
            skew +
            parseInt(theatre.startTs, 10)) %
          projectorDuration;
      } else {
        currentTs =
          testingOffset +
          Date.now() / 1000 -
          startTs +
          skew +
          parseInt(theatre.startTs, 10);
      }
      if (playerProjector) {
        projectorCurrentTime = timecodes.fromSeconds(currentTs);
        if (!playerProjector.playing) {
          playerProjector.play();
        }
        playerProjector.currentTime = currentTs;
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
    // console.log({ user });
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

  let handleMessage = () => {
    if (channels && channels.test) {
      channels.test.publish('msg', { msg });
    }
  };

  let msg;
  let isActive = true;
  let page;

  onDestroy(() => {
    isActive = false;
  });

  onMount(() => {
    startupTs = Date.now();

    pageStore.subscribe(async (newPage) => {
      page = newPage;
    });

    realtime.subscribe((rt) => {
      if (rt) {
        console.log('rt init', rt);
        try {
          // rt.connection.on('connected', function (ev) {
          //   console.log('realtime-connected!!');
          // });
          rt.connection.on('failed', function (ev) {
            console.log('failed realtime connection', ev);
          });

          channels.test = rt.channels.get('test');
          channels.test.subscribe(function (message) {
            console.log(get(message, 'data.msg'));
          });
          // setInterval(()=>{
          //   channels.test.publish('eventTYpe?', {'my':Date.now()});
          // }, 2000);
        } catch (e) {
          console.log('rt-1', e);
        }
      }
    });
  });

  //   <input bind:value={msg}             class="block pl-10 w-full border border-transparent bg-gray-100 rounded-md px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-faithful-500"
  //       placeholder="type hello"
  // />
  //       <button on:click={handleMessage}>Click</button>
  let lastUpdate = 0;
  let startupTs = Date.now();
  let initDone = false;

  const handleProjectorInit = (ev) => {
    playerProjector = ev.detail.player;
    Object.defineProperty(
      Object.getPrototypeOf(playerProjector),
      'currentTime',
      {
        set(input) {
          // Bail if media duration isn't available yet
          if (!this.duration) {
            return;
          }
          // Validate input
          input = input - 0;
          const inputIsValid = input == input && input >= 0;
          if (inputIsValid) {
            // Set
            this.media.currentTime = Math.min(input, this.duration);
            let location = (input / this.duration) * 100;
            setTimeout(() => { 
              try {
              this.elements.inputs.seek.setAttribute('value', location);
              this.elements.inputs.seek.setAttribute('aria-valuenow', location);              
              this.elements.inputs.seek.style.setProperty(
                '--value',
                `${location}%`
              );
              } catch (e) {}
            }, 0);
          }
          // Logging
          //console.log(`Seeking to ${this.currentTime} seconds`);
        },
      }
    );
    playerProjector.on('ready', () => {
      let media = playerProjector.media;
      projectorDuration = media.duration;
      if (!media) {
        console.log('warn - no media?', media);
        return;
      }

      endOfShow = ((projectorDuration) && (parseInt(projectorTheatre.currentTime,10) >= parseInt(projectorDuration,10))) ? true : false;

      if (true) {
        // init theatre
        if (theatre.status === 'paused') {
          // we should seek to this part
          const seekTs = parseInt(theatre.startTs, 10);
          projectorCurrentTime = timecodes.fromSeconds(seekTs);
          if (playerProjector) {
            if (playerProjector.playing) {
              playerProjector.pause();
            }
            playerProjector.currentTime = seekTs;
          }
        } else if (theatre.status === 'playing') {
          // calculate the current position
          const startTs = parseInt(get(theatre, 'eventTs.seconds'), 10);
          if (!startTs) {
            return;
          }
          let currentTs;
          if (false && projectorDuration) {
            currentTs =
              (testingOffset +
                Date.now() / 1000 -
                startTs +
                skew +
                parseInt(theatre.startTs, 10)) %
              projectorDuration;
          } else {
            currentTs =
              testingOffset +
              Date.now() / 1000 -
              startTs +
              skew +
              parseInt(theatre.startTs, 10);
          }
          projectorCurrentTime = timecodes.fromSeconds(currentTs);
          if (!playerProjector.playing) {
            setTimeout(() => {
              playerProjector.currentTime = currentTs;
              setTimeout(() => {
                if (!playerProjector.playing) {
                  playerProjector.play();
                }
              }, 100);
            }, 500);
            //playerProjector.play();
            // playerProjector.currentTime = currentTs;
            //   setTimeout(() => {
            //   playerProjector.currentTime = currentTs;
            // }, 500);
          } else {
            playerProjector.currentTime = currentTs;
          }
        }
      }

      setPlay = () => {
        // are we currently playing? is the data already set? if so nothing to do
        projectorDuration = media.duration;
        // alert(theatre.status);

        if (theatre.status !== 'playing') {
          // alert('now playing' + theatre.startTs +':'+ startTs+' ' + theatre.status);
          let startTs;
          if (initDone) {
            startTs = media.currentTime;
          } else {
            startTs = theatre.startTs;
            initDone = true;
          }
          (async () => {
            projectorCurrentTime = timecodes.fromSeconds(media.currentTime);
            const docRef = db.collection('rooms').doc('theatre');
            await docRef.set(
              {
                startTs: parseInt(startTs, 10), // the cursor of playback when we started
                eventTs: firebase.firestore.FieldValue.serverTimestamp(), // used by client to calculate offset
                status: 'playing',
              },
              { merge: true }
            );
          })();
        }
      };
      playerProjector.on('playing', debounce(setPlay, 500));

      setPaused = () => {
        projectorDuration = media.duration;

        // get current timestamp
        // update room to show playing at TS, status to playing, eventTs = now
        (async () => {
          if (!isActive) {
            // alert('skipping, not active');
            return;
          }
          const startTs = media.currentTime;
          projectorCurrentTime = timecodes.fromSeconds(media.currentTime);

          const docRef = db.collection('rooms').doc('theatre');
          await docRef.set(
            {
              startTs: parseInt(startTs, 10), // the cursor of playback when we started
              eventTs: firebase.firestore.FieldValue.serverTimestamp(), // used by client to calculate offset
              status: 'paused',
            },
            { merge: true }
          );
        })();
      };
      playerProjector.on('pause', debounce(setPaused, 500));

      playerProjector.on('timeupdate', () => {
        projectorCurrentTime = timecodes.fromSeconds(media.currentTime);
        projectorDuration = media.duration;
      });
    });
  };

  $: playerProjector && theatre && updatePlayerPositions();
  //           <span class="text-red-500 w-full text-right m-auto">Offline</span>
</script>

<!-- svelte-ignore non-top-level-reactive-declaration -->
<FirebaseProvider on:init={handleDbInit} on:auth-success={handleLogin}>
  <div class="">
    <div class="bg-white shadow overflow-hidden max-w-full">
      <section class="overflow-hidden sm:overflow-auto">
        {#if theatre.muxPlaybackId && isActive}
          <VideoPlayer
            on:newvideoplayer={handleProjectorInit}
            autoplay={false}
            start={true}
            poster={''}
            controls={['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen']}
            videoId={theatre.muxPlaybackId}
            captionsSrc={theatre.captionsUrl}
            videoPlayerId="video-player-projector-1"
          />
        {/if}
        {#if !warnMessage && !warnMessageModal}
          <div
            on:click|stopPropagation|preventDefault={() => {
              warnMessageModal = true;
            }}
            class="fixed inset-0 transition-opacity"
            aria-hidden="true"
          >
            <div class="inset-0 opacity-95" />
          </div>
        {/if}
      </section>
      <div
        class="mt-4 text-faithful-900 font-mono flex flex-row justify-between"
      >
        <div class="">
          {projectorCurrentTime || '00:00:00'}
        </div>
      </div>
      {#if false}
        <div class="mt-24">
          <h3
            class="text-2xl font-serif text-gray-900 font-extrabold tracking-tight flex flex-row"
          >
            Presets
          </h3>

          <select bind:value={presetSelected} on:blur={handlePresetChange}>
            <option value="video:the-faithful:trailer"
              >The Faithful Trailer</option
            >
            <option value="video:the-faithful">The Faithful Movie</option>
          </select>
        </div>
      {/if}
    </div>
    <div
      class="bg-white shadow overflow-hidden sm:rounded-lg m-auto p-12 mt-12"
    >
      <pre class="text-xs"><JSPretty obj={theatre} />
        <JSPretty obj={{projectorDuration, endOfShow, mediaTs: get(playerProjector, 'media.currentTs'), currentTime: get(playerProjector,'currentTime'), currentTs: projectorCurrentTime }} />
      </pre>
    </div>
  </div>
</FirebaseProvider>
<ConfirmModal
  bind:open={warnMessageModal}
  handleConfirm={async () => {
    warnMessage = true;
    clearTimeout(lastWarningTimer);
    lastWarningTimer = setTimeout(() => {
      warnMessage = false;
    }, 15000);
  }}
>
  <span slot="buttonyes">Unlock</span>
  <span slot="buttoncancel">Cancel</span>
  <span slot="confirmation">
    <h3
    class="text-lg leading-6 font-medium text-gray-900"
    id="modal-headline"
  >
    Modify the live presentation?
  </h3>
  <div class="mt-4">
    <p class="text-sm text-gray-500">
      Changes to the timeline and start/stop are seen by everyone.
    </p>
  </div>


  </span>
</ConfirmModal>

<script>
  import { onMount } from 'svelte';
  import FirebaseProvider from '$components/FirebaseProvider.svelte';
  import { realtime } from '$components/stores/channel.js';
  import get from 'lodash.get';
  import VideoPlayer from '$components/VideoPlayer.svelte';
  import timecodes from 'node-timecodes';

  let db;
  let firebase;
  let loaded = false;
  let user = {};
  let channels = {};
  let theatre = {};
  let skew = 0;
  let synced = false;

  // let thing = $token.val.keyName;

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

    const tmpRef = db.collection('tmp').doc(user.uid);
    const now = Date.now() / 1000;
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
    // console.log(skew, Date.now(), serverNow);

    const docRef = db.collection('rooms').doc('theatre');
    try {
      const doc = await docRef.get();
      if (!doc.exists) {
        console.log('room not found');
        return;
      } else {
        theatre = doc.data();
      }
    } catch (e) {
      console.log('error loading theatre', e);
    }

    const doc = db.collection('rooms').doc('theatre');
    doc.onSnapshot((docSnapshot) => {
      if (!synced) {
        return;
      }
      theatre = docSnapshot.data();
      if (theatre.status === 'paused') {
        // we should seek to this part
        const seekTs = theatre.startTs;
        if (playerProjector) {
          playerProjector.currentTime = seekTs;
        }
      }
      if (theatre.status === 'playing') {
        // calculate the current position
        const startTs = parseInt(get(theatre, 'eventTs.seconds'), 10);
        if (!startTs) {
          return;
        }
        // let currentTs = (Date.now() / 1000) - startTs + skew + theatre.startTs;
        let currentTs =
          (Date.now() / 1000 - startTs + skew + theatre.startTs) %
          projectorDuration;
        playerProjector.currentTime = currentTs;
        playerProjector.play();
      }
    });
  };

  let handleMessage = () => {
    if (channels && channels.test) {
      channels.test.publish('msg', { msg });
    }
  };

  let msg;

  onMount(() => {
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

  let projectorCurrentTime;
  let projectorDuration;
  let playerProjector;
  let playerStatus;
  let setPlay = () => {};
  let setPaused = () => {};
  let presetSelected;

const handlePresetChange = () => {

} ;

  const handleProjectorInit = (ev) => {
    playerProjector = ev.detail.player;

    setPlay = () => {
      // get current timestamp
      // update room to show playing at TS, status to playing, eventTs = now
      const media = playerProjector.media;
      if (!media) {
        return;
      }
      const startTs = media.currentTime;
      const docRef = db.collection('rooms').doc('theatre');
      playerStatus = 'playing';
      if (synced) {
        (async () => {
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

    playerProjector.on('play', setPlay);

    setPaused = () => {
      // get current timestamp
      // update room to show playing at TS, status to playing, eventTs = now
      const media = playerProjector.media;
      if (!media) {
        return;
      }
      const startTs = media.currentTime;
      const docRef = db.collection('rooms').doc('theatre');
      playerStatus = 'paused';

      if (synced) {
        (async () => {
          await docRef.set(
            {
              startTs: parseInt(startTs, 10), // the cursor of playback when we started
              eventTs: firebase.firestore.FieldValue.serverTimestamp(), // used by client to calculate offset
              status: 'paused',
            },
            { merge: true }
          );
        })();
      }
    };

    playerProjector.on('pause', setPaused);

    playerProjector.on('timeupdate', () => {
      const media = playerProjector.media;
      // console.log({ media });
      if (!media) {
        return;
      }

      projectorDuration = media.duration || 1;
      projectorCurrentTime = timecodes.fromSeconds(media.currentTime);
    });
  };
  const handleSyncToggle = () => {
    if (synced) {
      // from unsynced to synced
 //     setPlay();
    } else {
      // transition to un-synced, nothing to do
    }
  };
</script>

<FirebaseProvider on:init={handleDbInit} on:auth-success={handleLogin}>
  <div class="m-6">
    <div class="bg-white shadow overflow-hidden sm:rounded-lg max-w-full p-12">
      <h3
        class="text-2xl font-serif text-gray-900 font-extrabold tracking-tight flex flex-row"
      >
        {#if synced}
          Now Playing
        {:else}
          <span class="text-red-500 w-full text-right m-auto">Offline</span>
        {/if}
      </h3>
      <section class="overflow-hidden sm:overflow-auto">
        <VideoPlayer
          on:newvideoplayer={handleProjectorInit}
          autoplay={false}
          poster={theatre.posterUrl}
          videoId={theatre.muxPlaybackId}
          captionsSrc={theatre.captionsUrl}
          videoPlayerId="video-player-projector-1"
        />
      </section>
      <div
        class="mt-4 text-faithful-900 font-mono flex flex-row justify-between"
      >
        <div class="">
          {projectorCurrentTime || '00:00:00'}
        </div>
        <div>
          <input
            type="checkbox"
            bind:checked={synced}
            on:change={handleSyncToggle}
          /> Live
        </div>
      </div>
      <div class="mt-24">
        <h3
        class="text-2xl font-serif text-gray-900 font-extrabold tracking-tight flex flex-row"
      >
          Presets
      </h3>

        <select bind:value={presetSelected} on:change="{handlePresetChange}">
          <option value="video:the-faithful:trailer">The Faithful Trailer</option>
          <option value="video:the-faithful">The Faithful Movie</option>
          </select>
      </div>
    </div>
    <div
      class="bg-white shadow overflow-hidden sm:rounded-lg m-auto p-12 mt-12"
    >
      {JSON.stringify(theatre)}
    </div>
  </div>
</FirebaseProvider>

<script>
  import Duration from 'duration';
  import { onMount } from 'svelte';
  import Seating from '$components/room/Seating.svelte';
  import FirebaseProvider from '$components/FirebaseProvider.svelte';
  import { gal, talker, talking, downs, me } from '$components/stores/gal';

  let hours = 0;
  let min = 0;
  let sec = 0;
  let days = 0;

  const tick = () => {
    const duration = new Duration(
      new Date(),
      new Date('2021-03-18T14:00:00.000Z')
    );
    days = duration.day;
    hours = duration.hour;
    min = duration.minute;
    sec = duration.second;
  };

  let firebase;
  let db;
  let user = {};
  let room = 'lobby';

  let canWebrtc = false;
  let audienceState = 'init';
  let mediaEnabled = false;

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

    // await gal.initialize(); // setup network connection
    // await gal.connect({ userName: user.email });
    // try {
    //   await gal.startStream({ localId: null, mute: false });
    //   // window.pushToast(`Audio/video started.`, 'info');
    // } catch (e) {
    //   window.pushToast(`Unable to start media. ${e.message}`, 'alert');
    //   console.log('error starting media', e);
    // }
  };

let audienceMode = false;

  const joinLeaveAudience = async () => {
    try {
    if (!audienceMode) {
      audienceState = 'connecting';
      await gal.initialize(); // setup network connection
      await gal.connect({ userName: user.email });
      audienceState = 'connected';
      audienceMode = true;
    } else {
      await gal.destroy();
      audienceMode = false;
    }
  }catch (e) {console.log('joinleave', e);}
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

  onMount(() => {
    tick();
    const ticker = setInterval(() => {
      tick();
    }, 1000);

    canWebrtc = !(typeof window.RTCPeerConnection === 'undefined');

    return () => {
      clearInterval(ticker);
    };
  });
</script>

<FirebaseProvider on:init={handleDbInit} on:auth-success={handleLogin}>
  <div class="">
    <div class="m-6 pb-5 border-b border-gray-200">
      <h3
        class="pt-2 md:pt-4 text-3xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-5xl"
      >
        Lobby
      </h3>
    </div>
    <div class="m-6 mb-12">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        Countdown until the first show
      </h3>
      <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">Days</dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {days}
            </dd>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">Hours</dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {hours}
            </dd>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">Minutes</dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {min}
            </dd>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">Seconds</dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {sec}
            </dd>
          </div>
        </div>
      </dl>
    </div>

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
            class="inline-flex w-auto ml-4 mr-4 mt-4 mb-4 items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-500 bg-faithful-500 opacity-80 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500"
          >
            Join Audience
          </button>
        {/if}
      </div>
    </div>

    {#if canWebrtc}
      {#if audienceState === 'connecting'}
        <div class="flex flex-row items-center">
          <h2 class="m-auto text-gray-800 font-serif p-4">TCB one moment...</h2>
        </div>
      {:else}
        <div class="pb-5 border-b border-gray-200 h-screen">
          {#if audienceMode}
          <Seating {room} />?
          {/if}
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
                Learn more about WebRTC <span aria-hidden="true">&rarr;</span
                ></a
              >
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</FirebaseProvider>

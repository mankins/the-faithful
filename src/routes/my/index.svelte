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

    await gal.initialize(); // setup network connection
    await gal.connect({ userName: user.email });
    try {
      await gal.startStream({ localId: null, mute: false });
      // window.pushToast(`Audio/video started.`, 'info');
    } catch (e) {
      window.pushToast(`Unable to start media. ${e.message}`, 'alert');
      console.log('error starting media', e);
    }
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

    {#if canWebrtc}
      {#if audienceState === 'connecting'}
        <div class="flex flex-row items-center">
          <h2 class="m-auto text-gray-800 font-serif p-4">TCB one moment...</h2>
        </div>
      {:else}
        <div class="pb-5 border-b border-gray-200 h-screen">
          <Seating {room} />?
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

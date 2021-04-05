<script>
  import * as Duration from '$lib/patched/duration';
  import { onMount } from 'svelte';
  import FirebaseProvider from '$lib/FirebaseProvider.svelte';
  import { parseParams } from '$lib/utils/query';

  let hours = 0;
  let min = 0;
  let sec = 0;
  let days = 0;
  let now = Date.now();
  let nextShow = {};
  let showPart = 'intro';

  // let nextShow = new Date('2021-03-19T18:00:00.000Z');
  let doorsOpen; // = new Date('2021-03-19T17:00:00.000Z');
  let nextShowDate;
  let lobbyUi = {};

  let signupLink = 'https://coil.com/signup?ref=mankins1701';

  const tick = () => {
    if (!loaded || !nextShow || !nextShow.startTs) {
      return;
    }

    now = new Date();
    nextShowDate = new Date(nextShow.startTs.toDate());
    // doorsOpen = nextShowDate;
    const duration = new Duration(now, nextShowDate);
    days = duration.day;
    hours = duration.hour;
    min = duration.minute;
    sec = duration.second;

    if (now < doorsOpen) {
      doors = 'closed';
    } else {
      doors = 'open';
    }
    if (query.doors) {
      doors = query.doors;
    }

    const introStartDate = new Date(nextShowDate);
    introStartDate.setMinutes(introStartDate.getMinutes() - 30);

    const watchDate = new Date(nextShowDate);
    watchDate.setMinutes(watchDate.getMinutes() + 10);

    const qaStartDate = new Date(nextShowDate);
    qaStartDate.setMinutes(qaStartDate.getMinutes() + 60);

    if (now < introStartDate) {
      showPart = 'before';
    } else if (now < watchDate) {
      showPart = 'intro';
    } else if (now < qaStartDate) {
      showPart = 'watch';
    } else {
      showPart = 'qa';
    }

    if (query.part) {
      showPart = query.part;
    }
  };

  // const layers = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  // let y;

  let db;
  let firebase;
  let loaded = false;
  let user = {};
  let showTimes = [];
  let showingTimesFound = false;

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

    const docsRef = db.collection('showtimes');
    try {
      const snapshot = await docsRef.orderBy('startTs').get();
      if (snapshot.empty) {
        // no thumbs
        console.log('no showtimes');
        loaded = true;
        showingTimesFound = false;
        return;
      } else {
        snapshot.forEach((doc) => {
          let data = doc.data();
          if (!data.disabled) {
            showTimes.push(data);
          }
        });
        showTimes = [...showTimes]; // update $
        showingTimesFound = true;
      }
      // snapshot.onSnapshot((docSnapshot) => {
      //   theatre = { ...docSnapshot.data() };
      // });
    } catch (e) {
      console.log('ticket err', e);
    }

    try {
      const docRef = db.collection('rooms').doc('lobby');
      const doc = await docRef.get();
      if (doc.empty) {
        console.log('missing lobby');
      } else {
        lobbyUi = { ...doc.data() };
      }
      docRef.onSnapshot((docSnapshot) => {
        lobbyUi = { ...docSnapshot.data() };
        // console.log({ lobbyUi });
      });
    } catch (ee) {
      console.log({ ee });
    }
    loaded = true;
  };

  const updateNextShow = () => {
    // get Next Show
    if (!loaded || !showTimes || !showTimes.length) {
      return;
    }
    // console.log('update?');
    showTimes.forEach((showTime) => {
      // console.log({ showTime });
      let thisStart = new Date(showTime.startTs.toDate());
      if (
        now - thisStart < 0 &&
        nextShow &&
        nextShow.startTs &&
        thisStart < nextShow.startTs
      ) {
        nextShow = showTime;
      } else if (!nextShow.startTs) {
        nextShow = showTime;
      }
    });

    if (nextShow && nextShow.startTs) {
      doorsOpen = new Date(nextShow.startTs.toDate());
      showingTimesFound = true;
    } else {
      showingTimesFound = false;
    }
    // console.log({nextShow,showingTimesFound})
  };
  let query = {};
  let doors = 'closed';
  const getCtaUrl = () => {
    if (!nextShow) {
      return '/my';
    }

    if (showPart === 'intro') {
      return nextShow.qaUrl;
    } else if (showPart === 'before') {
      return nextShow.qaUrl;
    } else if (showPart === 'qa') {
      return nextShow.qaUrl;
    }
    return '/my/theatre/theatre';
  };
  onMount(() => {
    query = parseParams(window.location.search);

    showTimes = [];
    tick();
    const ticker = setInterval(() => {
      tick();
    }, 1000);

    return () => {
      clearInterval(ticker);
    };
  });

  $: showTimes && updateNextShow();
  $: lobbyUi && updateNextShow();
</script>

<svelte:head>
  <title>Lobby : The Faithful</title>
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
  {#if loaded}
    <div class="m-6">
      <div class="pb-5 ">
        <h3
          class="pt-2 md:pt-4 text-3xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-5xl"
        >
          Lobby
        </h3>
      </div>
      {#if lobbyUi.doors === 'closed' && (showingTimesFound && showTimes && showTimes.length)}
        <div class="mb-12">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mt-3">
            Countdown until the next show
            <span
              class="float-right inline-flex items-center hidden sm:block px-3 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              Starting soon
            </span>
          </h3>
          <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
            <div class="bg-white overflow-hidden shadow rounded-md">
              <div class="px-4 py-5 sm:p-6">
                <dt class="text-xs font-medium text-gray-500 truncate">Days</dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">
                  {days}
                </dd>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-md">
              <div class="px-4 py-5 sm:p-6">
                <dt class="text-xs font-medium text-gray-500 truncate">
                  Hours
                </dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">
                  {hours}
                </dd>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-md">
              <div class="px-4 py-5 sm:p-6">
                <dt class="text-xs font-medium text-gray-500 truncate">
                  Minutes
                </dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">
                  {min}
                </dd>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-md">
              <div class="px-4 py-5 sm:p-6">
                <dt class="text-xs font-medium text-gray-500 truncate">
                  Seconds
                </dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">
                  {sec}
                </dd>
              </div>
            </div>
          </dl>
        </div>
      {:else}
        <div class="mb-6 mt-6 pt-6">
          <div class="">
            {#if false}
              <picture>
                <source type="image/webp" srcset="/img/Pope-Snowglobes2.webp" />
                <img
                  class="h-32 w-full object-cover lg:h-48"
                  src="/img/Pope-Snowglobes2.jpg"
                  alt="Pope John Paul and some Snow globes"
                />
              </picture>
            {/if}
            {#if false}
              <img
                class="h-32 w-full object-cover lg:h-96"
                src="/img/nora-annie-iceland-horse.jpg"
                alt=""
              />
            {/if}
          </div>
          <div class="max-w-5xl mx-auto sm:px-6 lg:px-8">
            <div class="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
              <div
                class="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1"
              >
                <div
                  class="-mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4"
                >
                  {#if nextShow && nextShow.features && nextShow.features.includes('qa') && lobbyUi.qaCta}
                    <button
                      on:click={() => {
                        window.location.href =
                          lobbyUi.qaButtonUrl || nextShow.qaUrl;
                      }}
                      type="button"
                      class="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                    >
                      <svg
                        class="-ml-1 mr-2 h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        />
                      </svg>
                      <span>{lobbyUi.qaCta || `Q & A - Zoom`}</span>
                    </button>
                  {/if}
                  <button
                    type="button"
                    on:click={() => {
                      window.location.href = '/my/theatre/streaming';
                    }}
                    class="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    <svg
                      class="-ml-1 mr-2 h-5 w-5 text-gray-400"
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
                    </svg> <span>Watch</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {#if (showingTimesFound && showTimes && showTimes.length)}
        <div class="bg-white shadow sm:rounded-md mb-12">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              {#if lobbyUi.headline}
                {lobbyUi.headline}
              {:else}
                Welcome to today's screening of The Faithful.
              {/if}
              {#if now < nextShowDate}
                <span
                  class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  Starts in {hours} hours {min} minute{#if min !== 1}s{/if}
                </span>
              {:else}
                <span
                  class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  Now Playing
                </span>
              {/if}
            </h3>
            <div class="mt-2 max-w-xl text-xs text-gray-500">
              <p />
            </div>
            <div class="mt-3 text-sm">
              <a
                href={lobbyUi.ctaUrl || '/my/theatre'}
                rel="ext"
                target="_blank"
                class="font-medium text-faithful-800 hover:text-faithful-500"
              >
                {lobbyUi.cta || 'Watch'}
                <span aria-hidden="true">&rarr;</span></a
              >
            </div>
          </div>
        </div>
        {/if}
      {/if}
      {#if showingTimesFound && showTimes && showTimes.length}
        <div class="flex flex-col pb-8 mb-8">
          <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
            >
              <div
                class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
              >
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Event
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Time
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        &nbsp;
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each showTimes as showTime, i}
                      {#if i % 2 === 1}
                        <tr class="bg-white">
                          <td
                            class="px-6 py-4 whitespace-nowrap text-xs font-medium text-gray-900"
                          >
                            {showTime.name}
                          </td>
                          <td
                            class="px-6 py-4 whitespace-nowrap text-xs text-gray-500"
                          >
                            {new Date(
                              showTime.startTs.toDate()
                            ).toLocaleDateString()}
                          </td>
                          <td
                            class="px-6 py-4 whitespace-nowrap text-xs text-gray-500"
                          >
                            {new Date(
                              showTime.startTs.toDate()
                            ).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              timeZoneName: 'short',
                            })}
                          </td>
                          <td
                            class="px-6 py-4 whitespace-nowrap text-xs text-gray-500"
                          >
                            {#if (showTime.features || []).includes('qa')}
                              <span
                                class="float-right inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                Q&A
                              </span>
                            {/if}
                          </td>
                        </tr>
                      {/if}

                      {#if i % 2 === 0}
                        <tr class="bg-gray-50">
                          <td
                            class="px-6 py-4 whitespace-nowrap text-xs font-medium text-gray-900"
                          >
                            {showTime.name}
                          </td>
                          <td
                            class="px-6 py-4 whitespace-nowrap text-xs text-gray-500"
                          >
                            {new Date(
                              showTime.startTs.toDate()
                            ).toLocaleDateString()}
                          </td>
                          <td
                            class="px-6 py-4 whitespace-nowrap text-xs text-gray-500"
                          >
                            {new Date(
                              showTime.startTs.toDate()
                            ).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              timeZoneName: 'short',
                            })}
                          </td>
                          <td
                            class="px-6 py-4 whitespace-nowrap text-xs text-gray-500"
                          >
                            {#if (showTime.features || []).includes('qa')}
                              <span
                                class="float-right inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                Q&A
                              </span>
                            {/if}
                          </td>
                        </tr>
                      {/if}
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      {/if}
      <div class="bg-white overflow-hidden shadow sm:rounded-md max-w-lg">
        <div class="px-4 py-5 sm:p-6">
          <a href="/img/the-faithful-poster-2.jpg" target="_blank"
            ><img
              src="/img/the-faithful-poster-2.jpg"
              alt="The Faithful Poster"
              class="w-full"
            /></a
          >
        </div>
      </div>
    </div>
  {/if}
</FirebaseProvider>

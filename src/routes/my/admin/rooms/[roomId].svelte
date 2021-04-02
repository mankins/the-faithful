<script context="module">
  export async function load({ page }) {
    const { roomId } = page.params;
    return { props: { roomId } };
  }
</script>

<script>
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';

  import FirebaseProvider from '$components/FirebaseProvider.svelte';
  import EventRow from '$components/EventRow.svelte';
  import Visibility from '$components/Visibility.svelte';

  import JSPretty from '$components/JSPretty.svelte';
  import { sendEvent } from '$components/utils/events';

  let db;
  let firebase;
  let loaded = false;
  let user = {};
  let room = {};
  let active = 'setup';
  let previous = {};

  let events = [];
  let eventsFound = false;
  let cursor;
  let pageSize = 25;
  let saveState = 'ready';

  export let roomId;
  let roomFound = false;

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
    // console.log({ user });
    firebase = firebase || profile.detail.firebase;
    db = db || firebase.firestore();

    if (roomFound) {
      loaded = true;
      return;
    }
    const docRef = db.collection(`rooms`).doc(`${roomId}`);
    try {
      const doc = await docRef.get();
      if (!doc.exists) {
        console.log('room not found');
        loaded = true;
        roomFound = false;
        return;
      } else {
        room = doc.data();
        previous = { ...room };
        // console.log({ room });
        room.id = roomId;
        room.captions = room.captions || {};
        room.captions.new = {};
        room.controls = room.controls || {};
        loaded = true;
        roomFound = true;
      }
    } catch (e) {
      console.log('room err', e);
    }

    let FieldPath = firebase.firestore.FieldPath;

    const docsRef = db.collection(`events`);
    try {
      let snapshot;
      if (cursor) {
        snapshot = await docsRef
          .where(new FieldPath('payload.room'), '==', roomId)
          .orderBy('_ts')
          .endBefore(cursor)
          .limitToLast(pageSize)
          .get();
      } else {
        snapshot = await docsRef
          .where(new FieldPath('payload.room'), '==', roomId)
          .orderBy('_ts')
          .limitToLast(pageSize)
          .get();
      }

      if (snapshot.empty) {
        // no thumbs
        console.log('no events');
        eventsFound = false;
        const empty = [];
        events = [...empty];
        return;
      } else {
        snapshot.forEach((doc) => {
          const ev = doc.data();
          events.push(ev);
        });
        cursor = events[0]._ts;
        events = events.reverse();
        eventsFound = true;
      }
    } catch (e) {
      console.error('event err', e);
    }
    loaded = true;
  };

  const loadMore = async () => {
    let FieldPath = firebase.firestore.FieldPath;

    const docsRef = db.collection(`events`);
    try {
      let snapshot;
      if (cursor) {
        snapshot = await docsRef
          .where(new FieldPath('payload.room'), '==', roomId)
          .orderBy('_ts')
          .endBefore(cursor)
          .limitToLast(pageSize)
          .get();
      } else {
        snapshot = await docsRef.orderBy('_ts').limitToLast(pageSize).get();
      }

      if (snapshot.empty) {
        // no thumbs
        // const empty = [];
        // events = [...empty];
        return;
      } else {
        let batch = [];
        snapshot.forEach((doc) => {
          batch.push(doc.data());
        });
        batch = batch.reverse();
        batch.forEach((ev) => {
          cursor = ev._ts;
          events.push(ev);
        });
        events = [...events];
        eventsFound = true;
        console.log({ events });
      }
    } catch (e) {
      console.error('event err', e);
    }
  };

  onMount(async () => {
    // loaded = true;
  });

  const camelCaseToWords = function (str) {
    return str
      .match(/^[a-z]+|[A-Z][a-z]*/g)
      .map(function (x) {
        return x[0].toUpperCase() + x.substr(1).toLowerCase();
      })
      .join(' ');
  };

  const setTime = (startTs) => {
    (async () => {
      const docRef = db.collection('rooms').doc(roomId);
      await docRef.set(
        {
          eventTs: firebase.firestore.FieldValue.serverTimestamp(), // used by client to calculate offset
          startTs,
        },
        { merge: true }
      );
    })();
  };

  const handleSave = async () => {
    //
    saveState = 'processing';

    sendEvent({
      topic: 'room.admin.updated',
      room: roomId,
      email: user.email,
      previous,
      newRoom: room,
    });

    const docRef = db.collection('rooms').doc(roomId);
    await docRef.set(room, { merge: true });

    setTimeout(() => {
      saveState = 'ready';
    }, 1000);
  };
</script>

<svelte:head>
  <meta name="twitter:site" content="@TheFaithful" />
  <title>Room : {roomId} : The Faithful</title>
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
      <div class="pb-5">
        <h3
          class="pt-2 text-3xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-5xl capitalize"
        >
          Room: {roomId}
        </h3>
      </div>
      {#if roomFound}
        <div class="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <aside class="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
            <nav class="space-y-1">
              <!-- Current: "bg-gray-50 text-faithful-700 hover:text-faithful-700 hover:bg-white", Default: "text-gray-900 hover:text-gray-900 hover:bg-gray-50" -->
              <a
                on:click|preventDefault={() => {
                  active = 'setup';
                }}
                href="#"
                class="text-gray-900 hover:text-gray-900 hover:bg-white group rounded-md px-3 py-2 flex items-center text-sm font-medium"
                class:text-gray-700={active === 'setup'}
                class:bg-gray-50={active === 'setup'}
                aria-current="page"
              >
                <!--
                  Heroicon name: outline/cog
        
                  Current: "text-faithful-500 group-hover:text-faithful-500", Default: "text-gray-400 group-hover:text-gray-500"
                -->
                <svg
                  class="text-gray-400 group-hover:text-faithful-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span class="truncate"> Setup </span>
              </a>

              <a
                on:click|preventDefault={() => {
                  active = 'access';
                }}
                href="#access"
                class="text-gray-900 hover:text-gray-900 hover:bg-gray-50 group rounded-md px-3 py-2 flex items-center text-sm font-medium"
                class:text-gray-700={active === 'access'}
                class:bg-gray-50={active === 'access'}
              >
                <!-- Heroicon name: outline/key -->
                <svg
                  class="text-gray-400 group-hover:text-faithful-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6"
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
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                <span class="truncate"> Access </span>
              </a>

              <a
                on:click|preventDefault={() => {
                  active = 'features';
                }}
                class:text-gray-700={active === 'features'}
                class:bg-gray-50={active === 'features'}
                href="#features"
                class="text-gray-900 hover:text-gray-900 hover:bg-gray-50 group rounded-md px-3 py-2 flex items-center text-sm font-medium"
              >
                <!-- Heroicon name: outline/template -->
                <svg
                  class="text-gray-400 group-hover:text-faithful-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
                <span class="truncate"> Features </span>
              </a>

              <a
                on:click|preventDefault={() => {
                  active = 'captions';
                }}
                class:text-gray-700={active === 'captions'}
                class:bg-gray-50={active === 'captions'}
                href="#captions"
                class="text-gray-900 hover:text-gray-900 hover:bg-gray-50 group rounded-md px-3 py-2 flex items-center text-sm font-medium"
              >
                <!-- Heroicon name: outline/translate -->
                <svg
                  class="text-gray-400 group-hover:text-faithful-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
                <span class="truncate"> Captions </span>
              </a>

              <a
                on:click|preventDefault={() => {
                  active = 'projector';
                }}
                class:text-gray-700={active === 'projector'}
                class:bg-gray-50={active === 'projector'}
                href="#projector"
                class="text-gray-900 hover:bg-gray-50 group rounded-md px-3 py-2 flex items-center text-sm font-medium"
              >
                <svg
                  class="text-gray-400 group-hover:text-faithful-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                  stroke="currentColor"
                >
                  <path
                    d="M4.375 10c-0.345 0-0.625 0.28-0.625 0.625s0.28 0.625 0.625 0.625h1.875c0.345 0 0.625-0.28 0.625-0.625s-0.28-0.625-0.625-0.625h-1.875z"
                  />
                  <path
                    d="M13.125 3.75c1.881 0 3.438 1.385 3.708 3.19 1.115 0.255 1.917 1.229 1.917 2.435v2.5c0 1.408-1.092 2.5-2.5 2.5v1.25c0 0.345-0.28 0.625-0.625 0.625s-0.625-0.28-0.625-0.625v-1.25h-10v1.25c0 0.345-0.28 0.625-0.625 0.625s-0.625-0.28-0.625-0.625v-1.25c-1.408 0-2.5-1.092-2.5-2.5v-2.5c0-1.408 1.092-2.5 2.5-2.5h5.677c0.297-1.774 1.84-3.125 3.698-3.125zM13.125 5c-1.381 0-2.5 1.119-2.5 2.5s1.119 2.5 2.5 2.5 2.5-1.119 2.5-2.5c0-1.381-1.119-2.5-2.5-2.5zM16.25 13.125c0.717 0 1.25-0.533 1.25-1.25v-2.5c0-0.517-0.276-0.937-0.698-1.132-0.345 1.715-1.86 3.007-3.677 3.007-1.858 0-3.401-1.351-3.698-3.125h-5.677c-0.717 0-1.25 0.533-1.25 1.25v2.5c0 0.717 0.533 1.25 1.25 1.25h12.5z"
                  />
                </svg>

                <span class="truncate"> Projector </span>
              </a>

              <a
                on:click|preventDefault={() => {
                  active = 'billboards';
                }}
                class:text-gray-700={active === 'billboards'}
                class:bg-gray-50={active === 'billboards'}
                href="#billboards"
                class="text-gray-900 hover:bg-gray-50 group rounded-md px-3 py-2 flex items-center text-sm font-medium"
              >
                <svg
                  class="text-gray-400 group-hover:text-faithful-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                <span class="truncate"> Billboards </span>
              </a>

              <a
                on:click|preventDefault={() => {
                  active = 'ticket';
                }}
                class:text-gray-700={active === 'ticket'}
                class:bg-gray-50={active === 'ticket'}
                href="#ticket"
                class="text-gray-900 hover:bg-gray-50 group rounded-md px-3 py-2 flex items-center text-sm font-medium"
              >
                <svg
                  class="text-gray-400 group-hover:text-faithful-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
    
                <span class="truncate"> Tickets </span>
              </a>

    

              <a
                on:click|preventDefault={() => {
                  active = 'events';
                }}
                href="#events"
                class:text-gray-700={active === 'events'}
                class:bg-gray-50={active === 'events'}
                class="text-gray-900 hover:bg-gray-50 group rounded-md px-3 py-2 flex items-center text-sm font-medium"
              >
                <!-- Heroicon name: sparkles -->
                <svg
                  class="text-gray-400 group-hover:text-faithful-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                <span class="truncate"> Events </span>
              </a>

              <a
                on:click|preventDefault={() => {
                  active = 'debug';
                }}
                href="#debug"
                class:text-gray-700={active === 'debug'}
                class:bg-gray-50={active === 'debug'}
                class="text-gray-900 hover:bg-gray-50 group rounded-md px-3 py-2 flex items-center text-sm font-medium"
              >
                <!-- Heroicon name: outline/code -->
                <svg
                  class="text-gray-400 group-hover:text-faithful-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                <span class="truncate"> Debug </span>
              </a>
            </nav>
          </aside>

          <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            <div class="flex flex-row">
              <a
                href={`${window && window.location.protocol}//${
                  window && window.location.host
                }/my/theatre/${roomId}`}
                target="_blank"
                class="px-4 py-3 bg-gray-50 pt-6 text-left sm:px-6 text-xs font-mono underline"
              >
                {`${window && window.location.protocol}//${
                  window && window.location.host
                }/my/theatre/${roomId}`}
              </a>
              <div class="px-4 py-3 bg-gray-50 text-right sm:px-6 w-full">
                {#if active === 'projector'}
                  <button
                    type="button"
                    on:click={() => {
                      let confirm = prompt('Rewind to start? "y" to confirm. Takes effect immediately.');
                      if (confirm === 'y') {
                        setTime(1);
                        room.startTs = 1;
                        window.location.href = window.location.href; // reload to get new values
                      }
                    }}
                    class="ml-3 relative inline-flex items-center px-4 py-2 rounded-l-md rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    Rewind
                  </button>
                  <button
                    type="button"
                    on:click={() => {
                      let confirm = prompt('End playback? "y" to confirm. Takes effect immediately.');
                      if (confirm === 'y') {
                        setTime(99999);
                        room.startTs = 99999;
                        window.location.href = window.location.href; // reload to get new values

                      }
                    }}
                    class="ml-3 mr-3 relative inline-flex items-center px-4 py-2 rounded-l-md rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    End
                  </button>
                {/if}

                <button
                  type="submit"
                  on:click={() => {
                    handleSave();
                  }}
                  disabled={saveState !== 'ready'}
                  class="bg-faithful-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500"
                >
                  Save
                </button>
              </div>
            </div>
            {#if active === 'debug'}
              <div class="shadow sm:rounded-md sm:overflow-hidden">
                <div class="bg-white py-6 px-4 space-y-6 sm:p-6">
                  <pre
                    class="text-xs">        
                    <JSPretty obj={room} />
                  </pre>
                </div>
              </div>
            {/if}
            {#if active === 'events'}
              <div class="shadow sm:rounded-md sm:overflow-hidden">
                <div class="flow-root overflow-auto">
                  <ul class="-mb-8">
                    {#each events as ev, i}
                      <li class="py-4">
                        <EventRow {ev} isLast={i == events.length - 1} />
                      </li>
                    {/each}
                  </ul>
                </div>

                {#if events.length === 0}
                  <div
                    class="bg-white shadow overflow-hidden sm:rounded-lg m-auto p-12 flex"
                  >
                    <svg
                      class="text-faithful-800 h-10 w-10 ml-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 class="p-2">No events found</h3>
                  </div>
                {:else}
                  <div class="mt-8">
                    <Visibility
                      threshold={10}
                      steps={100}
                      inView={() => {
                        loadMore();
                      }}
                    >
                      <button
                        on:click={() => {
                          loadMore();
                        }}
                        type="button"
                        class="pl-4 pr-4 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-faithful-600 hover:bg-faithful-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500"
                      >
                        More
                      </button>
                    </Visibility>
                  </div>
                {/if}
              </div>
            {/if}
            {#if active === 'setup'}
              <div class="shadow sm:rounded-md sm:overflow-hidden">
                <div class="bg-white py-6 px-4 space-y-6 sm:p-6">
                  <fieldset>
                    <legend class="text-base font-medium text-gray-900"
                      >Notes</legend
                    >
                    <div class="mt-1">
                      <textarea
                        id="description"
                        bind:value={room.description}
                        name="description"
                        rows="3"
                        class="shadow-sm focus:ring-faithful-500 focus:border-faithful-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Screening on April 1"
                      />
                    </div>
                    <p class="mt-2 text-sm text-gray-500">
                      Internal use. A brief description of the room and what
                      it's for.
                    </p>
                  </fieldset>
                  <fieldset>
                    <legend class="text-base font-medium text-gray-900"
                      >Room type</legend
                    >
                    <div class="mt-4 space-y-4">
                      <div>
                        <div class="flex items-start">
                          <div class="h-5 flex items-center">
                            <input
                              id="candidates"
                              name="candidates"
                              type="radio"
                              bind:group={room.type}
                              value="theatre"
                              class="focus:ring-faithful-500 h-4 w-4 text-faithful-600 border-gray-300 rounded"
                            />
                          </div>
                          <div class="ml-3 text-sm">
                            <label
                              for="candidates"
                              class="font-medium text-gray-700"
                              >Live Event</label
                            >
                            <p class="text-gray-500">
                              Everyone sees same media at the same time.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="flex items-start">
                          <div class="h-5 flex items-center">
                            <input
                              id="offers"
                              name="offers"
                              type="radio"
                              bind:group={room.type}
                              value="streaming"
                              class="focus:ring-faithful-500 h-4 w-4 text-faithful-600 border-gray-300 rounded"
                            />
                          </div>
                          <div class="ml-3 text-sm">
                            <label
                              for="offers"
                              class="font-medium text-gray-700">Streaming</label
                            >
                            <p class="text-gray-500">
                              Users independently control when media starts.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="flex items-start">
                          <div class="h-5 flex items-center">
                            <input
                              id="offers"
                              name="offers"
                              type="radio"
                              bind:group={room.type}
                              value="lobby"
                              class="focus:ring-faithful-500 h-4 w-4 text-faithful-600 border-gray-300 rounded"
                            />
                          </div>
                          <div class="ml-3 text-sm">
                            <label
                              for="offers"
                              class="font-medium text-gray-700">Lobby</label
                            >
                            <p class="text-gray-500">
                              Looped / no media playback.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            {/if}
            {#if active === 'access'}
              <div class="shadow sm:rounded-md sm:overflow-hidden">
                <div class="bg-white py-6 px-4 space-y-6 sm:p-6">
                  <fieldset>
                    <legend class="text-base font-medium text-gray-900"
                      >Access</legend
                    >
                    <p class="mt-1 text-sm text-gray-500">
                      What entitlement status is required?
                    </p>
                    <div>
                      <div class="flex items-start">
                        <div class="m-3 text-xs">
                          <input
                            id="special_access_value"
                            name="special_access_value"
                            bind:value={room.accessRequired}
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-faithful-500 focus:border-faithful-500 sm:text-sm bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="mt-4 space-y-4">
                      <div>
                        <h3 class="font-medium">Presets</h3>
                      </div>
                      <div>
                        <div class="flex items-start">
                          <div class="h-5 flex items-center">
                            <input
                              id="public_access"
                              name="public_access"
                              type="radio"
                              bind:group={room.accessRequired}
                              value="*"
                              class="focus:ring-faithful-500 h-4 w-4 text-faithful-600 border-gray-300 rounded"
                            />
                          </div>
                          <div class="ml-3 text-sm">
                            <label
                              for="public_access"
                              class="font-medium text-gray-700">Public</label
                            >
                            <p class="text-gray-500">No login required.</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="flex items-start">
                          <div class="h-5 flex items-center">
                            <input
                              id="user_access"
                              name="user_access"
                              type="radio"
                              bind:group={room.accessRequired}
                              value="site:user:my"
                              class="focus:ring-faithful-500 h-4 w-4 text-faithful-600 border-gray-300 rounded"
                            />
                          </div>
                          <div class="ml-3 text-sm">
                            <label
                              for="user_access"
                              class="font-medium text-gray-700">User</label
                            >
                            <p class="text-gray-500">Must login.</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="flex items-start">
                          <div class="h-5 flex items-center">
                            <input
                              id="ticketed_access"
                              name="ticketed_access"
                              type="radio"
                              bind:group={room.accessRequired}
                              value="video:thefaithful"
                              class="focus:ring-faithful-500 h-4 w-4 text-faithful-600 border-gray-300 rounded"
                            />
                          </div>
                          <div class="ml-3 text-sm">
                            <label
                              for="ticketed_access"
                              class="font-medium text-gray-700">Ticketed</label
                            >
                            <p class="text-gray-500">
                              Login and ticket required.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="flex items-start">
                          <div class="h-5 flex items-center">
                            <input
                              id="ticketed_access"
                              name="ticketed_access"
                              type="radio"
                              bind:group={room.accessRequired}
                              value="site:admin"
                              class="focus:ring-faithful-500 h-4 w-4 text-faithful-600 border-gray-300 rounded"
                            />
                          </div>
                          <div class="ml-3 text-sm">
                            <label
                              for="ticketed_access"
                              class="font-medium text-gray-700">Admin</label
                            >
                            <p class="text-gray-500">
                              Site administrator required.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div class="flex items-start pt-4">
                        <div class="h-5 flex items-center">
                          <input
                            id="custom_access"
                            name="custom_access"
                            type="radio"
                            bind:group={room.accessRequired}
                            class="focus:ring-faithful-500 h-4 w-4 text-faithful-600 border-gray-300 rounded"
                          />
                        </div>
                        <div class="ml-3 text-sm">
                          <label
                            for="custom_access"
                            class="font-medium text-gray-700">Custom</label
                          >
                          <p class="text-gray-500">Set access above.</p>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            {/if}
            {#if active === 'features'}
              <form action="#" method="POST">
                <div class="shadow sm:rounded-md sm:overflow-hidden">
                  <div class="bg-white py-6 px-4 space-y-6 sm:p-6">
                    <fieldset>
                      <legend class="text-base font-medium text-gray-900"
                        >Video Playback</legend
                      >
                      <div class="mt-4 space-y-4">
                        <div>
                          <div class="flex items-start">
                            <div class="h-5 flex items-center">
                              <input
                                id="candidates"
                                name="controls_progress"
                                type="checkbox"
                                bind:checked={room.controls.progress}
                                class="focus:ring-faithful-500 h-4 w-4 text-faithful-600 border-gray-300 rounded"
                              />
                            </div>
                            <div class="ml-3 text-sm">
                              <label
                                for="controls_progress"
                                class="font-medium text-gray-700"
                                >Show Progress</label
                              >
                              <p class="text-gray-500">
                                Makes timeline / progress indicator visible.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div class="flex items-start">
                            <div class="h-5 flex items-center">
                              <input
                                id="controls_settings"
                                name="controls_settings"
                                type="checkbox"
                                bind:checked={room.controls.settings}
                                class="focus:ring-faithful-500 h-4 w-4 text-faithful-600 border-gray-300 rounded"
                              />
                            </div>
                            <div class="ml-3 text-sm">
                              <label
                                for="controls_settings"
                                class="font-medium text-gray-700"
                                >Show Settings</label
                              >
                              <p class="text-gray-500">
                                Allow user to control video playback settings.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div class="flex items-start">
                            <div class="h-5 flex items-center">
                              <input
                                id="controls_captions"
                                name="controls_captions"
                                type="checkbox"
                                bind:checked={room.controls.captions}
                                class="focus:ring-faithful-500 h-4 w-4 text-faithful-600 border-gray-300 rounded"
                              />
                            </div>
                            <div class="ml-3 text-sm">
                              <label
                                for="controls_captions"
                                class="font-medium text-gray-700"
                                >Show Captions Control</label
                              >
                              <p class="text-gray-500">
                                Allow user to control captions settings.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div class="flex items-start">
                            <div class="h-5 flex items-center">
                              <input
                                id="controls_time"
                                name="controls_time"
                                type="checkbox"
                                bind:checked={room.controls['current-time']}
                                class="focus:ring-faithful-500 h-4 w-4 text-faithful-600 border-gray-300 rounded"
                              />
                            </div>
                            <div class="ml-3 text-sm">
                              <label
                                for="controls_captions"
                                class="font-medium text-gray-700"
                                >Show Current Time</label
                              >
                              <p class="text-gray-500">
                                Show playback time. Disable for live.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                    <div class="col-span-6">
                      <label
                        for="startTs"
                        class="block text-sm font-medium text-gray-700"
                        >Analytics Interval</label
                      >
                      <input
                        type="numeric"
                        name="stats"
                        id="stats"
                        spellcheck="false"
                        bind:value={room.stats}
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-faithful-500 focus:border-faithful-500 sm:text-sm"
                      />
                      <p class="text-gray-500 text-xs">
                        1 / n. 20 = 1 / 20 = every 5%. 0 or blank to disable.
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            {/if}
            {#if active === 'captions'}
              <div class="shadow sm:rounded-md sm:overflow-hidden">
                <div class="bg-white py-6 px-4 space-y-6 sm:p-6">
                  <div>
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                      Captions
                    </h3>
                    <p class="text-sm text-gray-500">Settings for captions</p>
                  </div>

                  {#each Object.keys(room.captions).sort() as captionId, i}
                    <div class:bg-gray-50={i % 2} class="p-4 rounded-md">
                      <div class="col-span-6 sm:col-span-4 mt-4">
                        <label
                          for="caption_label"
                          class="block text-sm font-medium text-gray-700"
                        />
                        <input
                          type="text"
                          name="caption_label"
                          id="caption_label"
                          placeholder="Language Name"
                          bind:value={room.captions[captionId].label}
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-faithful-500 focus:border-faithful-500 sm:text-sm"
                        />
                      </div>
                      <div class="col-span-6 sm:col-span-4 mt-4">
                        <label
                          for="caption_code"
                          class="block text-sm font-medium text-gray-700"
                        />
                        <input
                          type="text"
                          name="caption_code"
                          id="caption_code"
                          placeholder="Language Code (en)"
                          bind:value={room.captions[captionId].lang}
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-faithful-500 focus:border-faithful-500 sm:text-sm"
                        />
                      </div>

                      <div class="col-span-3 mt-4">
                        <label class="block text-sm font-medium text-gray-700">
                          Captions file
                        </label>
                        {#if room.captions[captionId].src}
                          <a
                            href={room.captions[captionId].src}
                            class="underline text-faithful-800 font-mono text-xs"
                            target="_blank"
                            title="Current captions file"
                            >{room.captions[captionId].src}</a
                          >
                          <button
                            type="button"
                            class="ml-5 bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500"
                          >
                            Change
                          </button>
                        {:else}
                          <div
                            class="mt-1 border-2 border-gray-300 border-dashed rounded-md px-6 pt-5 pb-6 flex justify-center"
                          >
                            <div class="space-y-1 text-center">
                              <svg
                                class="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                              >
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                              <div class="flex text-sm text-gray-600">
                                <label
                                  for="file-upload"
                                  class="relative cursor-pointer bg-white rounded-md font-medium text-faithful-600 hover:text-faithful-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-faithful-500"
                                >
                                  <span>Upload captions file</span>
                                  <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    class="sr-only"
                                  />
                                </label>
                              </div>
                              <p class="text-xs text-gray-500">.VTT</p>
                            </div>
                          </div>
                        {/if}
                      </div>

                      <div>
                        <div class="flex items-start mt-4">
                          <div class="h-5 flex items-center">
                            <input
                              id="caption_default"
                              name="caption_default"
                              type="checkbox"
                              bind:checked={room.captions[captionId].default}
                              class="focus:ring-faithful-500 h-4 w-4 text-faithful-600 border-gray-300 rounded"
                            />
                          </div>
                          <div class="ml-3 text-sm">
                            <label
                              for="caption_default"
                              class="font-medium text-gray-700">Default</label
                            >
                            <p class="text-gray-500">
                              Is this the default caption language?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
            {#if active === 'projector'}
              <div class="shadow sm:rounded-md sm:overflow-hidden">
                <div class="bg-white py-6 px-4 space-y-6 sm:p-6">
                  <div>
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                      Projector
                    </h3>
                    <p class="mt-1 text-sm text-gray-500">
                      Settings that effect video playback.
                    </p>
                  </div>

                  <div class="col-span-6">
                    <label
                      for="muxPlaybackId"
                      class="block text-sm font-medium text-gray-700"
                      >Playback Ids</label
                    >
                    <textarea
                      id="muxPlaybackId"
                      name="muxPlaybackId"
                      rows="3"
                      spellcheck="false"
                      class="shadow-sm focus:ring-faithful-500 focus:border-faithful-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                      bind:value={room.muxPlaybackId}
                      placeholder="mux ids, one per line"
                    />

                    <p class="text-gray-500 text-xs mt-1">
                      This is the playback ids from mux.com, one per line
                    </p>
                  </div>

                  <div class="col-span-6">
                    <label
                      for="startTs"
                      class="block text-sm font-medium text-gray-700"
                      >Start Timestamp</label
                    >
                    <input
                      type="numeric"
                      name="startTs"
                      id="startTs"
                      spellcheck="false"
                      bind:value={room.startTs}
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-faithful-500 focus:border-faithful-500 sm:text-sm"
                    />
                    <p class="text-gray-500 text-xs">
                      In seconds. 1 = start, 99999 = ended.
                    </p>
                  </div>

                  <div class="col-span-6">
                    <label
                      for="posterUrl"
                      class="block text-sm font-medium text-gray-700"
                      >Poster Url</label
                    >
                    <input
                      name="posterUrl"
                      id="posterUrl"
                      spellcheck="false"
                      bind:value={room.posterUrl}
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-faithful-500 focus:border-faithful-500 sm:text-sm"
                    />
                  </div>

                  <div class="flex items-start">
                    <div class="h-5 flex items-center">
                      <input
                        id="loop"
                        name="comments"
                        type="checkbox"
                        bind:checked={room.loop}
                        class="focus:ring-faithful-500 h-4 w-4 text-faithful-600 border-gray-300 rounded"
                      />
                    </div>
                    <div class="ml-3 text-sm">
                      <label for="loop" class="font-medium text-gray-700"
                        >Loop</label
                      >
                      <p class="text-gray-500">
                        Should the video loop when done?
                      </p>
                    </div>
                  </div>
                  <div
                    class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
                  >
                    <label
                      for="status"
                      class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Status
                    </label>
                    <div class="mt-1 sm:mt-0 sm:col-span-2">
                      <select
                        id="status"
                        name="status"
                        class="max-w-lg block focus:ring-faithful-500 focus:border-faithful-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                      >
                        <option>playing</option>
                        <option>pause</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            {/if}
            {#if active === 'billboards'}
              <div class="shadow sm:rounded-md sm:overflow-hidden">
                <div class="bg-white py-6 px-4 space-y-6 sm:p-6">
                  <div>
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                      Billboards
                    </h3>
                    <p class="mt-1 text-sm text-gray-500">
                      Message the viewers in the room.
                    </p>
                  </div>

                  {#each ['pauseMessage', 'endMessage', 'extraMessage', 'extraMessageCta', 'extraMessageHeadline', 'extraMessageLink'] as inputType}
                    <div class="col-span-6">
                      <label
                        for="pauseMessage"
                        class="block text-sm font-medium text-gray-700"
                        >{camelCaseToWords(inputType)}</label
                      >
                      <input
                        type=""
                        name={inputType}
                        id={inputType}
                        bind:value={room[inputType]}
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-faithful-500 focus:border-faithful-500 sm:text-sm"
                      />
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        </div>

        {#if false}
          <div class="col-span-6 sm:col-span-3">
            <label
              for="first_name"
              class="block text-sm font-medium text-gray-700">First name</label
            >
            <input
              type="text"
              name="first_name"
              id="first_name"
              autocomplete="given-name"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-faithful-500 focus:border-faithful-500 sm:text-sm"
            />
          </div>

          <div class="col-span-6 sm:col-span-3">
            <label
              for="last_name"
              class="block text-sm font-medium text-gray-700">Last name</label
            >
            <input
              type="text"
              name="last_name"
              id="last_name"
              autocomplete="family-name"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-faithful-500 focus:border-faithful-500 sm:text-sm"
            />
          </div>

          <div class="col-span-6 sm:col-span-4">
            <label
              for="email_address"
              class="block text-sm font-medium text-gray-700"
              >Email address</label
            >
            <input
              type="text"
              name="email_address"
              id="email_address"
              autocomplete="email"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-faithful-500 focus:border-faithful-500 sm:text-sm"
            />
          </div>

          <div class="col-span-6">
            <label
              for="street_address"
              class="block text-sm font-medium text-gray-700"
              >Street address</label
            >
            <input
              type="text"
              name="street_address"
              id="street_address"
              autocomplete="street-address"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-faithful-500 focus:border-faithful-500 sm:text-sm"
            />
          </div>

          <div class="col-span-6 sm:col-span-6 lg:col-span-2">
            <label for="city" class="block text-sm font-medium text-gray-700"
              >City</label
            >
            <input
              type="text"
              name="city"
              id="city"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-faithful-500 focus:border-faithful-500 sm:text-sm"
            />
          </div>

          <div class="col-span-6 sm:col-span-3 lg:col-span-2">
            <label for="state" class="block text-sm font-medium text-gray-700"
              >State / Province</label
            >
            <input
              type="text"
              name="state"
              id="state"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-faithful-500 focus:border-faithful-500 sm:text-sm"
            />
          </div>

          <div class="col-span-6 sm:col-span-3 lg:col-span-2">
            <label
              for="postal_code"
              class="block text-sm font-medium text-gray-700"
              >ZIP / Postal</label
            >
            <input
              type="text"
              name="postal_code"
              id="postal_code"
              autocomplete="postal-code"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-faithful-500 focus:border-faithful-500 sm:text-sm"
            />
          </div>

          <div class="grid grid-cols-3 gap-6">
            <div class="col-span-3 sm:col-span-2">
              <label
                for="company_website"
                class="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div class="mt-1 rounded-md shadow-sm flex">
                <span
                  class="bg-gray-50 border border-r-0 border-gray-300 rounded-l-md px-3 inline-flex items-center text-gray-500 sm:text-sm"
                >
                  workcation.com/
                </span>
                <input
                  type="text"
                  name="username"
                  id="username"
                  autocomplete="username"
                  class="focus:ring-faithful-500 focus:border-faithful-500 flex-grow block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                />
              </div>
            </div>

            <div class="col-span-3">
              <label
                for="about"
                class="block text-sm font-medium text-gray-700"
              >
                About
              </label>
              <div class="mt-1">
                <textarea
                  id="about"
                  name="about"
                  rows="3"
                  class="shadow-sm focus:ring-faithful-500 focus:border-faithful-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="you@example.com"
                />
              </div>
              <p class="mt-2 text-sm text-gray-500">
                Brief description for your profile. URLs are hyperlinked.
              </p>
            </div>

            <div class="col-span-3">
              <label class="block text-sm font-medium text-gray-700">
                Photo
              </label>
              <div class="mt-1 flex items-center">
                <span
                  class="inline-block bg-gray-100 rounded-full overflow-hidden h-12 w-12"
                >
                  <svg
                    class="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </span>
                <button
                  type="button"
                  class="ml-5 bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500"
                >
                  Change
                </button>
              </div>
            </div>

            <div class="col-span-3">
              <label class="block text-sm font-medium text-gray-700">
                Cover photo
              </label>
              <div
                class="mt-1 border-2 border-gray-300 border-dashed rounded-md px-6 pt-5 pb-6 flex justify-center"
              >
                <div class="space-y-1 text-center">
                  <svg
                    class="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <div class="flex text-sm text-gray-600">
                    <label
                      for="file-upload"
                      class="relative cursor-pointer bg-white rounded-md font-medium text-faithful-600 hover:text-faithful-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-faithful-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        class="sr-only"
                      />
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>
        {/if}
      {:else}
        <div
          class="bg-white shadow overflow-hidden sm:rounded-lg m-auto p-12 flex"
          transition:fade
        >
          <svg
            class="text-faithful-800 h-10 w-10 ml-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 class="p-2">Room not found</h3>
        </div>
      {/if}
    </div>
  {/if}
</FirebaseProvider>

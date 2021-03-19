<script>
  import FirebaseProvider from '$components/FirebaseProvider.svelte';
  import EventRow from '$components/EventRow.svelte';
  import { parseParams } from '$components/utils/query';
  import Visibility from '$components/Visibility.svelte';

  import { onMount } from 'svelte';

  let db;
  let firebase;
  let loaded = false;
  let user = {};
  let events = [];
  let email = ''; // no filter

  let eventsFound = false;
  let cursor;
  let pageSize = 25;

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

    if (eventsFound) {
      loaded = true;
      return;
    }
    const docsRef = db.collection(`events`);
    try {
      let snapshot;
      if (cursor) {
        if (email) {
          snapshot = await docsRef
            .where('_email', '==', email)
            .orderBy('_ts')
            .endBefore(cursor)
            .limitToLast(pageSize)
            .get();
        } else {
          snapshot = await docsRef
            .orderBy('_ts')
            .endBefore(cursor)
            .limitToLast(pageSize)
            .get();
        }
      } else {
        if (email) {
          snapshot = await docsRef
            .where('_email', '==', email)
            .orderBy('_ts')
            .limitToLast(pageSize)
            .get();
        } else {
          snapshot = await docsRef.orderBy('_ts').limitToLast(pageSize).get();
        }
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
        console.log({ events });
      }
    } catch (e) {
      console.error('event err', e);
    }
    loaded = true;
  };

  const loadMore = async () => {
    console.log('load more');
    const docsRef = db.collection(`events`);
    try {
      let snapshot;
      if (cursor) {
        if (email) {
          snapshot = await docsRef
            .where('_email', '==', email)
            .orderBy('_ts')
            .endBefore(cursor)
            .limitToLast(pageSize)
            .get();
        } else {
          snapshot = await docsRef
            .orderBy('_ts')
            .endBefore(cursor)
            .limitToLast(pageSize)
            .get();
        }
      } else {
        if (email) {
          snapshot = await docsRef
            .where('_email', '==', email)
            .orderBy('_ts')
            .limitToLast(pageSize)
            .get();
        } else {
          snapshot = await docsRef.orderBy('_ts').limitToLast(pageSize).get();
        }
      }

      if (snapshot.empty) {
        // no thumbs
        console.log('no events');
        const empty = [];
        events = [...empty];
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

  const doFilter = async () => {
    events = [];
    cursor = '';
    await loadMore();
  };

  const filterKeyDown = (iev) => {
    let key = iev.key;
    let keyCode = iev.keyCode;
    if (keyCode === 13) {
      doFilter();
    }
  };

  onMount(async () => {
    const query = parseParams(window.location.search);
    if (query.cursor) {
      cursor = query.cursor;
    }
  });
</script>
<svelte:head>
  <title
    >Events : The Faithful</title
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
  {#if loaded}
    <div class="m-6 pb-12 mb-8">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700"
          >Filter</label
        >
        <div class="mt-1 flex rounded-md shadow-sm">
          <div class="relative flex items-stretch flex-grow focus-within:z-10">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <!-- Heroicon name: solid/users -->
              <svg
                class="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
                />
              </svg>
            </div>
            <input
              type="text"
              name="email"
              bind:value={email}
              on:keydown={filterKeyDown}
              id="email"
              class="focus:border-gray-50 focus:border-0 focus:ring-0 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300"
              placeholder="elvis@grace.land"
            />
          </div>
          <button
            on:click={() => {
              doFilter();
            }}
            class="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-faithful-500 focus:border-faithful-500"
          >
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div class="pb-5 border-b border-gray-200">
        <h3
          class="pt-12 text-3xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-5xl"
        >
          Events
        </h3>
      </div>
      <!-- <div>
        <ul class="divide-y divide-gray-200"> -->

      <div class="flow-root overflow-auto">
        <ul class="-mb-8">
          {#each events as ev, i}
            <li class="py-4">
              <EventRow {ev} isLast={i == (events.length -1)} />
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
          <h3 class="p-2">No matches</h3>
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
</FirebaseProvider>

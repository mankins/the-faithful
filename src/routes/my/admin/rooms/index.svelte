<script>
  import FirebaseProvider from '$components/FirebaseProvider.svelte';
  import RoomRow from '$components/RoomRow.svelte';

  import { onMount } from 'svelte';

  let db;
  let firebase;
  let loaded = false;
  let user = {};
  let rooms = [];

  let roomsFound = false;

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

    if (roomsFound) {
      loaded = true;
      return;
    }
    const docsRef = db.collection(`rooms`);
    try {
      const snapshot = await docsRef.get();
      if (snapshot.empty) {
        // no thumbs
        console.log('no rooms');
        loaded = true;
        roomsFound = false;
        return;
      } else {
        snapshot.forEach((doc) => {
          let data = doc.data();
          data.id = doc.id;
          rooms.push(data);
        });

        roomsFound = true;
      }
    } catch (e) {
      console.log('rooms err', e);
    }
    loaded = true;
  };

  onMount(async () => {
    // loaded = true;
  });
</script>
<svelte:head>
  <title
    >Rooms : The Faithful</title
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
    <div class="m-6">
      <div class="pb-5 border-b border-gray-200">
        <h3
          class="pt-2text-3xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-5xl"
        >
          Rooms
        </h3>
      </div>
      {#if roomsFound}
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-gray-200">
            {#each rooms as room, i}
              <li>
                <RoomRow {room} />
              </li>
            {/each}
          </ul>
        </div>
      {:else}
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
          <h3 class="p-2">No rooms found</h3>
        </div>
      {/if}
    </div>
  {/if}
</FirebaseProvider>

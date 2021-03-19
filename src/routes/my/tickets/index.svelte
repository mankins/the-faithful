<script>
  import FirebaseProvider from '$components/FirebaseProvider.svelte';
  import Ticket from '$components/Ticket.svelte';
  import TicketRow from '$components/TicketRow.svelte';

  import { onMount } from 'svelte';

  let db;
  let firebase;
  let loaded = false;
  let user = {};
  let tickets = [];

  let ticketsFound = false;

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

    if (ticketsFound) {
      loaded = true;
      return;
    }
    const docsRef = db.collection(`email/${user.email}/receipts`);
    try {
      const snapshot = await docsRef.orderBy('receipt.ts').get();
      if (snapshot.empty) {
        // no thumbs
        console.log('no tickets');
        loaded = true;
        ticketsFound = false;
        return;
      } else {
        snapshot.forEach((doc) => {
          tickets.push(doc.data());
        });

        ticketsFound = true;
      }
    } catch (e) {
      console.log('ticket err', e);
    }
    loaded = true;
  };

  onMount(async () => {
    // loaded = true;
  });
</script>
<svelte:head>
  <title
    >Tickets : The Faithful</title
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
          class="pt-12 md:pt-24 text-3xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-5xl"
        >
          My Tickets
        </h3>
      </div>
      {#if ticketsFound}
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-gray-200">
            {#each tickets as ticket, i}
              <li>
                <TicketRow {ticket} />
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
          <h3 class="p-2">No tickets found</h3>
          <a
            class="p-2 underline text-faithful-900"
            rel="external"
            href="/tickets">Try the ticket booth?</a
          >
        </div>
      {/if}
    </div>
  {/if}
</FirebaseProvider>

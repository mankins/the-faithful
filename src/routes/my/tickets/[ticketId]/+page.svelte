<script>
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';

  import FirebaseProvider from '$lib/FirebaseProvider.svelte';
  import Ticket from '$lib/Ticket.svelte';
import { update_slot_spread } from 'svelte/internal';
  // import { parseParams } from '$lib/utils/query';

  let db;
  let firebase;
  let loaded = false;
  let user = {};
  let ticket = {};
  let stripeData = {};
  export let data = {};
  let { ticketId } = data;

  let ticketFound = false;

  const handleDbInit = async (ev) => {
    firebase = ev.detail.firebase;
    db = firebase.firestore();
  };

  let handleAddGuest = async () => {}

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

    if (ticketFound) {
      loaded = true;
      return;
    }
    const docRef = db
      .collection(`email/${user.email}/receipts`)
      .doc(`${ticketId}`);
    try {
      const doc = await docRef.get();
      if (!doc.exists) {
        console.log('ticket not found');
        loaded = true;
        ticketFound = false;
        return;
      } else {
        ticket = doc.data();
        // console.log({ ticket });
        ticket.guests = ticket.guests || [];
        if (ticket && ticket.receipt && ticket.receipt.src === 'stripe') {
          try {
            const receiptDetails = firebase
              .functions()
              .httpsCallable('receiptDetails');
            const reply = await receiptDetails({ ticket });
            stripeData = reply.data;
          } catch (ee) {
            console.log({ ee });
          }
        }
        loaded = true;
        ticketFound = true;
        handleAddGuest = async (guestEmail) => {
          try {
            const guestList = firebase
              .functions()
              .httpsCallable('guestList');
            const updated = await guestList({ ticketId, add: [{ email: guestEmail }] });
            ticket = {...updated.data};
            window.pushToast(`Ok, added ${guestEmail}`, 'info');
          } catch (error) {
            console.log({ error });
            window.pushToast(`Unable to add email. ${error.message}`, 'alert');
          }

          // return ticket.guests || [];
        };
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
  <meta name="twitter:site" content="@TheFaithful" />
  <title>My Ticket : The Faithful</title>
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
          Ticket
        </h3>
      </div>
      {#if ticketFound}
        <Ticket {ticket} {stripeData} {handleAddGuest} />
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
          <h3 class="p-2">Ticket not found</h3>
        </div>
      {/if}
    </div>
  {/if}
</FirebaseProvider>

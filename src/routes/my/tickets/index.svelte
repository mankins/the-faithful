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
      loaded = true;
  
      if (ticketsFound) {
        return;
      }
      const docsRef = db
        .collection(`email/${user.email}/receipts`);
      try {
        const snapshot = await docsRef.get();
        if (snapshot.empty) {
          // no thumbs
          console.log('no tickets');
          ticketsFound = false;
          return;
        } else {
        snapshot.forEach(doc => {
                tickets.push(doc.data());
        }); 

          ticketsFound = true;
        }
      } catch (e) {
        console.log('ticket err', e);
      }
    };
  
    onMount(async () => {
      // loaded = true;
    });
  </script>
    
  <FirebaseProvider on:init={handleDbInit} on:auth-success={handleLogin}>
    {#if loaded}
      <div class="m-6">
        <div class="pb-5 border-b border-gray-200">
          <h3
            class="pt-24 text-3xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-5xl"
          >
            My Tickets
          </h3>
        </div>
        {#if ticketsFound}
<div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Details</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                {#each tickets as ticket, i}
                <TicketRow {ticket} />
              {/each}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  
        {:else}
        <div class="bg-white shadow overflow-hidden sm:rounded-lg m-auto p-12 flex">
          <svg class="text-faithful-800 h-10 w-10 ml-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h3 class="p-2">No tickets found</h3>
        </div>    
        {/if}
      </div>
    {/if}
  </FirebaseProvider>
  
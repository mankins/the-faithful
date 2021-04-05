<script>
  import { onMount, onDestroy } from 'svelte';
  import FirebaseProvider from '$lib/FirebaseProvider.svelte';
  import { realtime } from '$lib/stores/channel.js';
  import get from 'lodash.get';
  import JSPretty from '$lib/JSPretty.svelte';
  import { page as pageStore } from '$lib/stores';
  import ConfirmModal from '$lib/modals/ConfirmModal.svelte';
  import { chats, gal, peers } from '$lib/stores/gal';
  import Seating from '$lib/room/Seating.svelte';

  let db;
  let firebase;
  let loaded = false;
  let galState = {};
  let user = {};

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

    gal().connect({userName:user.email});
  };

  onMount(() => {
    console.log({gal});
    gal().subscribe(async (newState) => {
      galState = { ...newState };
    });
    // peers().subscribe(async (newPeers) => {
    //   peersState = { ...newPeers };
    // });
  });
</script>
<FirebaseProvider on:init={handleDbInit} on:auth-success={handleLogin}>

<div class="m-6">
  <div class="pb-5 border-b border-gray-200">
    <h3
      class="pt-4 text-3xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-5xl"
    >
      Chat
    </h3>
  </div>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg m-auto p-4">
    <Seating room="theatre" />

    <pre>    
      <JSPretty obj={galState} />
      <JSPretty obj={$peers} />
      <JSPretty obj={$chats} />
    </pre>


  </div>
</div>
</FirebaseProvider>
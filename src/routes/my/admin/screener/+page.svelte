<script>
  // import { onMount } from 'svelte';
  import GuestRow from '$lib/GuestRow.svelte';
  import ConfirmGuestModal from '$lib/modals/ConfirmGuestModal.svelte';
  import FirebaseProvider from '$lib/FirebaseProvider.svelte';

  let openConfirmGuest = false;
  let confirmEmail = '';

  let db;
  let firebase;
  let loaded = false;
  let user = {};

  const handleDbInit = async (ev) => {
    firebase = ev.detail.firebase;
    db = firebase.firestore();
  };

  let handleAddGuest = async () => {};

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

// tmp copy doc
// const docRef = db.collection('rooms').doc('streaming');
//       const doc = await docRef.get();
//       const tmpRef = db.collection('rooms').doc('screener');
//     await tmpRef.set(
//       doc.data(),
//       { merge: true }
//     );

    handleAddGuest = async (guestEmail) => {
      try {
        const screenerAdd = firebase.functions().httpsCallable('screenerAdd');
        await screenerAdd({
          admin: true,
          email: guestEmail,
          entitlements: ['video:thefaithful:screener'] 
        });
        window.pushToast(`Ok, added ${guestEmail}`, 'info');
      } catch (error) {
        console.log({ error });
        window.pushToast(`Unable to add email. ${error.message}`, 'alert');
      }
    };
  };
</script>
<svelte:head>
  <title
    >Screener : The Faithful</title
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
  <div class="m-6">
    <div class="pb-5 border-b border-gray-200">
      <h3
        class="pt-12 md:pt-24 text-3xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-5xl"
      >
        Screener
      </h3>
    </div>
    <div>
      <blockquote class="bg-gray-50 rounded-md mb-12">
        This adds an entitlement to a user to enable them to see the screener room: 
        <p><span class="font-mono">
          <a target="_blank" class="underline" href="https://www.the-faithful.com/my/theatre/screener">
          https://www.the-faithful.com/my/theatre/screener</a></span></p>
      </blockquote>
    </div>
    <div class="bg-white shadow overflow-hidden sm:rounded-lg m-auto p-12">
      <GuestRow
        noDescription={true}
        multiInput={true}
        handleAdd={(em) => {
          if (em) {
            confirmEmail = em;
            openConfirmGuest = true;
          }
        }}
      />
    </div>
  </div>
  <ConfirmGuestModal
    bind:open={openConfirmGuest}
    toTicket={' '}
    email={confirmEmail}
    handleConfirm={async (em) => {
      await handleAddGuest(em);
    }}
  />
</FirebaseProvider>

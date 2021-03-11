<script>
  // import { onMount } from 'svelte';
  import GuestRow from '$components/GuestRow.svelte';
  import ConfirmGuestModal from '$components/modals/ConfirmGuestModal.svelte';
  import FirebaseProvider from '$components/FirebaseProvider.svelte';

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

    handleAddGuest = async (guestEmail) => {
      try {
        const guestList = firebase.functions().httpsCallable('guestList');
        await guestList({
          admin: true,
          email: guestEmail,
          products: ['video:thefaithful'] // TODO: ui?
        });
        window.pushToast(`Ok, added ${guestEmail}`, 'info');
      } catch (error) {
        console.log({ error });
        window.pushToast(`Unable to add email. ${error.message}`, 'alert');
      }
    };
  };
</script>

<FirebaseProvider on:init={handleDbInit} on:auth-success={handleLogin}>
  <div class="m-6">
    <div class="pb-5 border-b border-gray-200">
      <h3
        class="pt-12 md:pt-24 text-3xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-5xl"
      >
        Guest List
      </h3>
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

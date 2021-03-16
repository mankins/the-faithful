<script>
  import { onMount, onDestroy } from 'svelte';

  import FirebaseProvider from '$components/FirebaseProvider.svelte';
  import UserDot from '$components/user/UserDot.svelte';
  import UserAudio from '$components/user/UserAudio.svelte';
  import { peers } from '$components/stores/gal';
  import get from 'lodash.get';
  import { debounce } from '$components/utils/debounce';

  const DEFAULT_USER_SIZE = 15;

  let canvasWidth = 0;
  let canvasHeight = 0;
  let db;
  let firebase;
  let user = {};

  // this is anyone who has ever been in the room
  let seating = {}; // id = {meta}
  let seats = {}; // subset of seating, the current people in the room

  let isActive = false;

  export let room = '';
  let userDots = [
    //     { r: 25, x: 5, y: 10, email: 'mankins@gmail.com' },
    //     { r: 25, x: 50, y: 50, email: 'zmankins@gmail.com' },
  ];

  onDestroy(() => {
    isActive = false;
  });

  onMount(() => {
    isActive = true;
  });

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
  };

  // keep away from edges 30->60
  const randomPosition = () => {
    return 30 + Math.ceil(Math.random() * 30);
  };

  const updateRoom = async () => {
    if (room) {
      try {
        const docRef = db.collection(`rooms/${room}/people`).doc('seating');
        const doc = await docRef.get();
        if (!doc.exists) {
          // console.log('seating not found 1');
          await docRef.set({}); // race?
          //   return;
        } else {
          seating = { ...doc.data() };
          // console.log('seating found', { seating });
        }

        docRef.onSnapshot((docSnapshot) => {
          seating = { ...docSnapshot.data() };
          // console.log('seating updated', { seating });
        });
      } catch (e) {
        console.log('err', { e });
      }
    }
  };

  const updateSeats = debounce(() => {
    (async () => {
      if (!room || !firebase || !$peers) {
        return;
      }
      // console.log('should update seats', { peers: $peers, seating });
      try {
        const seatingRef = db.collection(`rooms/${room}/people`).doc('seating');
        const doc = await seatingRef.get();
        if (!doc.exists) {
          console.log('seating not found');
          await seatingRef.set({}); // race?
        }
        let updates = {};
        let updated = 0;

        // see if we have any new peers
        Object.keys($peers).forEach((peerId) => {
          // console.log({ p: $peers[peerId] });
          const peerEmail = $peers[peerId].name || peerId;
          if (!seating[peerEmail]) {
            // peer not in our seets, let's update
            updates[peerEmail] = {
              x: get(seating, `${peerEmail}.x`) || randomPosition() || 5,
              y: get(seating, `${peerEmail}.y`) || randomPosition() || 5,
              email: get($peers, `${peerId}.name`, peerId),
              ts: firebase.firestore.FieldValue.serverTimestamp(),
            };
            updated++;
          }
          // console.log(seats[peerEmail]);
          if (!seats[peerEmail]) {
            seats[peerEmail] = {
              ...seating[peerEmail],
              ...updates[peerEmail],
              size: DEFAULT_USER_SIZE,
              streams: get($peers, `${peerId}.streams`, {}),
            };
            delete seats[peerEmail].ts;
          }
          if (peerEmail === get(user, 'email')) {
            // update ourselves
            // console.log(`checking for change to self - ${peerEmail}`);
            const currentSeat = seats[peerEmail] || {};
            const dbSeat = seating[peerEmail] || {};

            if (
              parseInt(dbSeat.x, 10) !== parseInt(currentSeat.x, 10) ||
              parseInt(dbSeat.y, 10) !== parseInt(currentSeat.y, 10)
            ) {
              // console.log({ seats });
              updates[peerEmail] = {
                x:
                  parseInt(get(seats[peerEmail], 'x', randomPosition()), 10) ||
                  5,
                y:
                  parseInt(get(seats[peerEmail], 'y', randomPosition()), 10) ||
                  5,
                email: peerEmail,
                ts: firebase.firestore.FieldValue.serverTimestamp(),
              };
              // console.log(updates[peerEmail], 'updated');
              updated++;
            } else {
              // console.log('no change', dbSeat.x, currentSeat.x);
            }
          }
        });

        if (updated) {
          // console.log('committing', { updates });
          await seatingRef.set(updates, { merge: true });
        }
      } catch (ee) {
        console.log('error updating seats', { ee });
      }
    })();
    // console.log('called update....');
  }, 500);

  //   const debugSeats = debounce(() => {
  //     console.log({ seats, seating });
  //   }, 500);

  //   $: firebase && $peers && seating && seats && updateSeats(); //}, 1000);
  $: firebase && room && updateRoom();
  $: $peers && updateSeats();
  $: seats && updateSeats();
  //   $: seats && debugSeats();
</script>

<FirebaseProvider on:init={handleDbInit} on:auth-success={handleLogin}>
  <section class="w-full">
    <div bind:clientWidth={canvasWidth} bind:clientHeight={canvasHeight}>
      <svg
        style="-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;"
        width="500px"
        height="500px"
        class="w-full h-full bg-gray-800"
      >
        {#each Object.keys(seats) as seatEmail, i}
        {#if seats[seatEmail]}
          {#if seatEmail !== get(user, 'email')}
            <UserDot
              isSelf={seatEmail === get(user, 'email')}
              size={get(seats, `${seatEmail}.size`) || DEFAULT_USER_SIZE}
              email={seatEmail}
              bind:percentX={seats[seatEmail].x}
              bind:percentY={seats[seatEmail].y}
              {canvasWidth}
              {canvasHeight}
            />
            <UserAudio streams={get(seats, `${seatEmail}.streams`) || {}} email={seatEmail} />
          {/if}
          {/if}
        {/each}
        {#if seats[get(user, 'email')]}
        <UserDot
          isSelf={true}
          size={get(seats, `${get(user, 'email')}.size`) || DEFAULT_USER_SIZE}
          streams={get(seats, `${get(user, 'email')}.streams`) || {}}
          email={get(user, 'email')}
          bind:percentX={seats[get(user, 'email')].x}
          bind:percentY={seats[get(user, 'email')].y}
          {canvasWidth}
          {canvasHeight}
        />
        {/if}
        <text x="50%" y="95%" class="text-xl opacity-50 font-extrabold tracking-tight font-serif fill-current text-faithful-500" dominant-baseline="middle" text-anchor="middle">{room}</text>    
    </svg>
    </div>
  </section>
</FirebaseProvider>

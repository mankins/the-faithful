<script>
  import { onMount, onDestroy } from 'svelte';
  import FirebaseProvider from '$components/FirebaseProvider.svelte';
  import get from 'lodash.get';
  import timecodes from 'node-timecodes';
  import JSPretty from '$components/JSPretty.svelte';
  import { debounce } from '$components/utils/debounce';
  import { page as pageStore } from '$components/stores';
  import ConfirmModal from '$components/modals/ConfirmModal.svelte';

  let db;
  let firebase;
  let loaded = false;
  let user = {};
  let channels = {};
  let theatre = {};
  let skew = 0;
  let projectorCurrentTime;
  let projectorDuration;
  let playerProjector;
  let setPlay = () => {};
  let setPaused = () => {};
  let presetSelected;
  let testingOffset = 0;
  let warnMessage = false;
  let warnMessageModal = false;
  let lastWarningTimer;
  let endOfShow = false;

  let ins = {}; // input bindings

  const handlePresetChange = () => {};

  // let thing = $token.val.keyName;

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

    const tmpRef = db.collection('tmp').doc(user.uid);
    const now = testingOffset + Date.now() / 1000;
    await tmpRef.set(
      {
        now: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    const c = await tmpRef.get();
    const d = c.data();
    // console.log({now:d.now});
    const serverNow =
      get(d, 'now.seconds') + parseInt(get(d, 'now.nanoseconds')) / 1000000000;
    skew = serverNow - now;

    const docRef = db.collection('rooms').doc('theatre');
    try {
      const doc = await docRef.get();
      if (!doc.exists) {
        console.log('room not found');
        return;
      } else {
        theatre = { ...doc.data() };
      }
    } catch (e) {
      console.log('error loading theatre', e);
    }

    const doc = db.collection('rooms').doc('theatre');
    doc.onSnapshot((docSnapshot) => {
      theatre = { ...docSnapshot.data() };
      console.log('change', theatre);
    });
  };

  let isActive = true;
  let muxPlaybackId;
  let extraMessage = '';

  onDestroy(() => {
    isActive = false;
  });

  onMount(() => {
    startupTs = Date.now();
  });

  let lastUpdate = 0;
  let startupTs = Date.now();
  let initDone = false;

  // endOfShow = ((projectorDuration) && (parseInt(projectorTheatre.currentTime,10) >= parseInt(projectorDuration,10))) ? true : false;

  const setDoc = (upDoc) => {
    (async () => {
      const docRef = db.collection('rooms').doc('theatre');
      await docRef.set(upDoc, { merge: true });
      debugTs = Date.now();
    })();
  };

  const setStatus = (status) => {
    (async () => {
      const docRef = db.collection('rooms').doc('theatre');
      await docRef.set(
        {
          status,
        },
        { merge: true }
      );
      debugTs = Date.now();
    })();
  };

  const setStatusPause = () => {
    (async () => {
      const docRef = db.collection('rooms').doc('theatre');
      await docRef.set(
        {
          status: 'paused',
        },
        { merge: true }
      );
      debugTs = Date.now();
    })();
  };
  const setWaiting = (waiting) => {
    (async () => {
      const docRef = db.collection('rooms').doc('theatre');
      await docRef.set(
        {
          waiting,
        },
        { merge: true }
      );
      debugTs = Date.now();
    })();
  };

  const setTime = (startTs) => {
    (async () => {
      const docRef = db.collection('rooms').doc('theatre');
      await docRef.set(
        {
          eventTs: firebase.firestore.FieldValue.serverTimestamp(), // used by client to calculate offset
          startTs,
        },
        { merge: true }
      );
      debugTs = Date.now();
    })();
  };

  const setMux = () => {
    if (!muxPlaybackId) {
      alert('enter mux id');
      return;
    }
    (async () => {
      const docRef = db.collection('rooms').doc('theatre');
      await docRef.set(
        {
          // eventTs: firebase.firestore.FieldValue.serverTimestamp(), // used by client to calculate offset
          muxPlaybackId,
        },
        { merge: true }
      );
      debugTs = Date.now();
    })();
  };

  const setExtraMessage = () => {
    if (!extraMessage) {
      alert('enter extra message text');
      return;
    }
    (async () => {
      const docRef = db.collection('rooms').doc('theatre');
      await docRef.set(
        {
          // eventTs: firebase.firestore.FieldValue.serverTimestamp(), // used by client to calculate offset
          extraMessage,
        },
        { merge: true }
      );
      debugTs = Date.now();
    })();
  };

  let debugTs = Date.now();
  const updateUi = async () => {
    debugTs = Date.now();

    const docRef = db.collection('rooms').doc('theatre');
    try {
      const doc = await docRef.get();
      theatre = { ...doc.data() };
    } catch (e) {
      console.log('error updating theatre', e);
    }

    theatre = theatre;
  };

  $: debugTs && updateUi();

  // <button type="button" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
  //     Play
  //   </button>

  //           <span class="text-red-500 w-full text-right m-auto">Offline</span>
</script>

<svelte:head>
  <title
    >Projector : The Faithful</title
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


<!-- svelte-ignore non-top-level-reactive-declaration -->
<FirebaseProvider on:init={handleDbInit} on:auth-success={handleLogin}>
  <div class="">
    <div class="bg-white shadow overflow-hidden max-w-full  m-auto">
      <div class="flex flex-row p-2 bg-black">
        <section class="overflow-hidden sm:overflow-auto m-2 sm:m-12">
          <span class="relative z-0 inline-flex shadow-sm rounded-md  m-auto">
            <button
              type="button"
              on:click={() => {
                setStatus('playing');
              }}
              class="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              Play
            </button>
            <button
              type="button"
              on:click={() => {
                setStatusPause();
              }}
              class="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              Pause
            </button>
            <button
              type="button"
              on:click={() => {
                setWaiting(true);
              }}
              class="ml-3 relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              Wait On
            </button>
            <button
              type="button"
              on:click={() => {
                setWaiting(false);
              }}
              class="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              Wait Off
            </button>
            <button
              type="button"
              on:click={() => {
                setTime(5);
              }}
              class="ml-3 relative inline-flex items-center px-4 py-2 rounded-l-md rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              Reset
            </button>
            <button
              type="button"
              on:click={() => {
                setTime(99999);
              }}
              class="ml-3 relative inline-flex items-center px-4 py-2 rounded-l-md rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              End
            </button>
            <button
              type="button"
              on:click={() => {
                setMux();
              }}
              class="ml-3 relative inline-flex items-center px-4 py-2 rounded-l-md rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              Change Movie Id
            </button>
          </span>
        </section>
      </div>

<div class="">

      <div class="p-4 bg-gray-100">
        <label
          for="extraMessageHeadline"
          class="block text-sm font-medium text-gray-700"
          >Extra Message Headline</label
        >
        <div class="mt-1 flex flex-row">
          <input
            type="text"
            bind:value={ins.extraMessageHeadline}
            name="extraMessageHeadline"
            id="extraMessageHeadline"
            class="shadow-sm focus:ring-faithful-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="News"
          />
          <button
            type="button"
            on:click={() => {
              setDoc({ extraMessageHeadline: ins.extraMessageHeadline });
            }}
            class="ml-3 relative bg-gray-200 inline-flex items-center px-4 py-2 rounded-l-md rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 "
          >
            Set 
          </button>
        </div>
      </div>

      <div class="p-4 bg-gray-100">
        <div />
        <label
          for="extraMessage"
          class="block text-sm font-medium text-gray-700">Extra Message</label
        >
        <div class="mt-1 flex flex-row">
          <input
            type="text"
            bind:value={extraMessage}
            name="extraMessage"
            id="extraMessage"
            class="shadow-sm focus:ring-faithful-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Leave blank to disable"
          />
          <button
            type="button"
            on:click={() => {
              setDoc({ extraMessage: extraMessage });
            }}
            class="ml-3 relative bg-gray-200 inline-flex items-center px-4 py-2 rounded-l-md rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 "
          >
            Set 
          </button>
        </div>
      </div>      
      

      <div class="p-4 bg-gray-100">
        <label
          for="extraMessageLink"
          class="block text-sm font-medium text-gray-700"
          >Extra Message Click Url</label
        >
        <div class="mt-1 flex flex-row">
          <input
            type="text"
            bind:value={ins.extraMessageLink}
            name="extraMessageLink"
            id="extraMessageLink"
            class="shadow-sm focus:ring-faithful-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Leave blank for none"
          />
          <button
            type="button"
            on:click={() => {
              setDoc({ extraMessageLink: ins.extraMessageLink });
            }}
            class="ml-3 relative bg-gray-200 inline-flex items-center px-4 py-2 rounded-l-md rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 "
          >
            Set 
          </button>
        </div>
      </div>


      <div class="p-4 bg-gray-100">
        <label
          for="extraMessage"
          class="block text-sm font-medium text-gray-700"
          >Extra Message CTA ("More")</label
        >
        <div class="mt-1 flex flex-row">
          <input
            type="text"
            bind:value={ins.extraMessageCta}
            name="extraMessageCta"
            id="extraMessageCta"
            class="shadow-sm focus:ring-faithful-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Leave blank for none"
          />
          <button
            type="button"
            on:click={() => {
              setDoc({ extraMessageCta: ins.extraMessageCta });
            }}
            class="ml-3 relative bg-gray-200 inline-flex items-center px-4 py-2 rounded-l-md rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 "
          >
            Set
          </button>
        </div>
      </div>
      
      <div class="p-4 bg-gray-100">
        <label
          for="endMessage"
          class="block text-sm font-medium text-gray-700"
          >End Message</label
        >
        <div class="mt-1 flex flex-row">
          <input
            type="text"
            bind:value={ins.endMessage}
            name="extraMessageCta"
            id="extraMessageCta"
            class="shadow-sm focus:ring-faithful-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder=""
          />
          <button
            type="button"
            on:click={() => {
              setDoc({ endMessage: ins.endMessage });
            }}
            class="ml-3 relative bg-gray-200 inline-flex items-center px-4 py-2 rounded-l-md rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 "
          >
            Set
          </button>
        </div>
      </div>
      <div class="p-4 bg-gray-100">
        <label
          for="pauseMessage"
          class="block text-sm font-medium text-gray-700"
          >Pause Message</label
        >
        <div class="mt-1 flex flex-row">
          <input
            type="text"
            bind:value={ins.pauseMessage}
            name="extraMessageCta"
            id="extraMessageCta"
            class="shadow-sm focus:ring-faithful-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder=""
          />
          <button
            type="button"
            on:click={() => {
              setDoc({ pauseMessage: ins.pauseMessage });
            }}
            class="ml-3 relative bg-gray-200 inline-flex items-center px-4 py-2 rounded-l-md rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 "
          >
            Set
          </button>
        </div>
      </div>
      <div class="p-4 bg-gray-100">
        <label
          for="noticeMode"
          class="block text-sm font-medium text-gray-700"
          >Notice mode</label
        >
        <div class="mt-1 flex flex-row">
          <input
            type="text"
            bind:value={ins.noticeMode}
            name="extraMessageCta"
            id="extraMessageCta"
            class="shadow-sm focus:ring-faithful-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="'joinus' or some other mode"
          />
          <button
            type="button"
            on:click={() => {
              setDoc({ noticeMode: ins.noticeMode });
            }}
            class="ml-3 relative bg-gray-200 inline-flex items-center px-4 py-2 rounded-l-md rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 "
          >
            Set
          </button>
        </div>
      </div>
      
      <div class="p-4 bg-gray-100">
        <label
          for="muxPlaybackId"
          class="block text-sm font-medium text-gray-700"
          >Mux Playback Id (advanced)</label
        >
        <div class="mt-1">
          <input
            type="text"
            bind:value={muxPlaybackId}
            name="muxPlaybackId"
            id="muxPlaybackId"
            class="shadow-sm focus:ring-faithful-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="9yeTuhhsGoW99g0101O2WyximgOyIBnTUwhi2MRHv9ick"
          />
        </div>
        <ul>
          <li>
            <p class="text-xs font-mono p-6">
              9yeTuhhsGoW99g0101O2WyximgOyIBnTUwhi2MRHv9ick = Faithful Full
              Length
            </p>
          </li>
          <li>
            <p class="text-xs font-mono p-6">
              taMah02Uj0286rdwiMyPoh8F6CFF4Uqo4HNQPmojRYGJM = Waiting
            </p>
          </li>
        </ul>
      </div>
    </div>

      <div
        class="bg-white shadow overflow-hidden sm:rounded-lg m-auto p-12 mt-12"
      >
        <pre class="text-xs"><JSPretty obj={{theatre, debugTs}} />
      </pre>
      </div>
    </div>

    <div class="bg-red-50 shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Experiemental, Advanced Projector
        </h3>
        <div class="mt-2 max-w-xl text-sm text-gray-500">
          <p>Still WIP, but more features.</p>
        </div>
        <div class="mt-5">
          <button
            on:click={() => {
              window.location.href = '/my/admin/projector/advanced';
            }}
            type="button"
            class="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
          >
            Experimental Projector
          </button>
        </div>
      </div>
    </div>
  </div></FirebaseProvider
>
<ConfirmModal
  bind:open={warnMessageModal}
  handleConfirm={async () => {
    warnMessage = true;
    clearTimeout(lastWarningTimer);
    lastWarningTimer = setTimeout(() => {
      warnMessage = false;
    }, 15000);
  }}
>
  <span slot="buttonyes">Unlock</span>
  <span slot="buttoncancel">Cancel</span>
  <span slot="confirmation">
    <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
      Modify the live presentation?
    </h3>
    <div class="mt-4">
      <p class="text-sm text-gray-500">
        Changes to the timeline and start/stop are seen by everyone.
      </p>
    </div>
  </span>
</ConfirmModal>

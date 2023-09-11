<script>
  import FirebaseProvider from '$lib/FirebaseProvider.svelte';
  import UserRow from '$lib/UserRow.svelte';
  import { parseParams } from '$lib/utils/query';
  import Visibility from '$lib/Visibility.svelte';
  // import { stringify } from 'querystring';

  import { onMount } from 'svelte';

  let db;
  let firebase;
  let loaded = false;
  let user = {};
  let users = [];
  let email = ''; // no filter

  let usersFound = false;
  let cursor;
  let pageSize = 10;
  let noMore = false;

  let segment = '';

  let handleAddUser = async => {
alert(email);
    // TODO: do a function call out
    // add the user if doesn't exist
    // error toast otherwise
    // on success redo the query?
  };

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

    if (usersFound) {
      loaded = true;
      return;
    }
    const docsRef = db.collection(`email`);
    try {
      let snapshot;

      if (email) {
        snapshot = await docsRef.get(email);
      } else {
        if (segment) {
          snapshot = await docsRef
            .where('segments', 'array-contains', segment)
            .orderBy('_ts')
            .limitToLast(pageSize)
            .get();
        } else {
          if (cursor) {
            // snapshot = await docsRef.endBefore(cursor).limitToLast(pageSize).get();
            snapshot = await docsRef.startAfter(cursor).limit(pageSize).get();
          } else {
            snapshot = await docsRef.limit(pageSize).get();
          }
        }
      }

      if (snapshot.empty) {
        // no thumbs
        console.log('no users');
        usersFound = false;
        const empty = [];
        users = [...empty];
        noMore = true;
        return;
      } else {
        snapshot.forEach((doc) => {
          const ev = doc.data();
          ev.email = doc.id;
          users.push(ev);
          cursor = doc.id;
        });
      }
    } catch (e) {
      console.error('event err', e);
    }
    loaded = true;
  };

  const loadMore = async () => {
    console.log('load more', { email });

    try {
      let snapshot;
      let docsRef;

      if (email) {
        snapshot = await db.collection(`email`).doc(email).get();
      } else {
        docsRef = db.collection(`email`);
        if (segment) {
          snapshot = await docsRef
            .where('segments', 'array-contains', segment)
            .orderBy('_ts')
            .limitToLast(pageSize)
            .get();
        } else {
          if (cursor) {
            // snapshot = await docsRef.endBefore(cursor).limitToLast(pageSize).get();
            snapshot = await docsRef
              .orderBy(firebase.firestore.FieldPath.documentId())
              .startAfter(cursor)
              .limit(pageSize)
              .get();
          } else {
            snapshot = await docsRef.limit(pageSize).get();
          }
        }
      }

      if (snapshot.empty) {
        // no thumbs
        console.log('no more users');
        noMore = true;
        return;
      } else {
        if (email) {
          let u = snapshot.data();
          u.email = email;
          users.push(u);
          cursor = email;
          users = [...users];
          noMore = true;
        } else {
          snapshot.forEach((doc) => {
            const ev = doc.data();
            ev.email = doc.id;
            users.push(ev);
            cursor = doc.id;
            users = [...users];
          });
        }
      }
    } catch (e) {
      console.error('event err', e);
    }
  };

  const doFilter = async () => {
    const empty = [];
    users = [...empty];
    cursor = '';
    noMore = false;
    await loadMore();
  };

  const filterKeyDown = (iev) => {
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

<FirebaseProvider on:init={handleDbInit} on:auth-success={handleLogin}>
  {#if loaded}
    <div class="m-0">
      <div class="m-6">
        <div class="mt-1 flex rounded-md shadow-sm">
          <div class="relative flex items-stretch flex-grow focus-within:z-10">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-users-none"
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
            <span>Find</span>
          </button>
        </div>
      </div>

      <div class="pb-5 ml-4 border-b border-gray-200">
        <h3
          class="pt-12 text-3xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-5xl"
        >
          Users
        </h3>
      </div>

      <div class="flow-root">
        <ul class="-mb-8">
          {#each users as user, i}
            <li class="py-4" class:bg-gray-50={i % 2}>
              <UserRow
                {user}
                isLast={i == users.length - 1}
                saveUser={(mods) => {
                  (async () => {
                    let em = user.email.toLowerCase();
                    if (em && mods) {
//  alert(JSON.stringify({mods}));
                    const docRef = db.collection('email').doc(em);
                    await docRef.set({...mods}, { merge: true });
                    }
                  })();
                }}
              />
            </li>
          {/each}
        </ul>
      </div>

      {#if users.length === 0}
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
          <div clas="flex flex-row  items-end justify-end">
            <h3 class="p-2">No matches</h3>
          </div>
          <button on:click={() => {handleAddUser()}} class="underline text-faithful-800 focus:outline-none focus:border-transparent cursor-pointer">Add User</button>  
        </div>
      {:else if !noMore}
        <div class="mt-8 mb-8">
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

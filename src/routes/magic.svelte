<script>

  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import firebase from 'firebase/app';
  import 'firebase/auth';
  import 'firebase/firestore';
  import { firebaseConfig } from '$components/config/index.js';

  import { sendEvent } from '$components/utils/events';
  import Footer from '$components/nav/Footer.svelte';
  import Toast from '$components/Toast.svelte';

  let authActions;
  let processing = true;
  let requireEmail = false;
  let email;
  let nextUrl = '/?logged=1';

  let status = 'Hold on...';
  let subStatus = 'TCB';

  const processLogin = () => {
    // The client SDK will parse the code from the link for you.
    firebase
      .auth()
      .signInWithEmailLink(email, window.location.href)
      .then((result) => {
        // Clear email from storage.
        window.localStorage.removeItem('emailForSignIn');
        // You can access the new user via result.user
        // Additional user info profile not available via:
        // result.additionalUserInfo.profile == null
        // You can check if the user is new or existing:
        // result.additionalUserInfo.isNewUser
        sendEvent({topic:'user.login.completed', email, type:'magic'});

        window.location.href = nextUrl || '/';
      })
      .catch((error) => {
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
        window.pushToast(`Error logging in. ${error.message}`, 'alert');
        status = 'Error logging in.';
        subStatus = 'Try again?';
      });
  };

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    nextUrl = urlParams.get('next');

    if (firebase.apps.length === 0) {
      await firebase.initializeApp(firebaseConfig);
    }

    await import('firebase/functions');
    if (window && window.location.href.indexOf('localhost') !== -1) {
      // dev mode
      firebase.functions().useEmulator('localhost', 15001);
    }

    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again.
        processing = false;
        return;
      }
      processLogin();
    }
  });
</script>

<div class="min-h-screen bg-white overscroll-x-contain overflow-hidden">
  <div class="min-h-screen bg-white flex">
    <div
      class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
    >
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <a href="/" target="_parent">
            <img class="h-12 w-auto" src="/svg/logo.svg" alt="Faithful Logo" />
          </a>
          <Toast duration={60000} />
          <h2 class="mt-6 text-3xl bg-transparent font-extrabold text-gray-900">
            Sign in for access
          </h2>
        </div>

        <div class="mt-8">
          <div>
            <div class="mt-6 space-y-6">
              <div>
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div class="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    bind:value={email}
                    required
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-faithful-500 focus:border-faithful-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  on:click={() => {
                      processing = true;
                    processLogin();
                    return false;
                  }}
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="hidden lg:block relative w-0 flex-1">
        <picture>
          <source type="image/webp" srcset="/img/Pope-Snowglobes2.webp" />
          <img
            class="absolute inset-0 h-full w-full object-cover"
            src="/img/Pope-Snowglobes2.jpg"
            alt="Pope John Paul and some Snow globes"
          />
        </picture>
      </div>
  </div>

  <aside>
    <Toast duration={30000} />
  </aside>
  <Footer />
</div>

{#if processing}
  <div
    transition:fade={{ duration: 250 }}
    class="fixed z-10 inset-0 overflow-y-auto"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-faithful-500 opacity-100" />
      </div>

      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true">&#8203;</span
      >
      {#if subStatus === 'TCB'}
        <div
          transition:fade={{ duration: 250 }}
          class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div>
            <div
              class="mx-auto flex items-center justify-center h-12 w-12 rounded-full"
              class:bg-yellow-200={subStatus === 'TCB'}
              class:bg-gray-50={subStatus !== 'TCB'}
            >
              <svg
                class:hidden={subStatus !== 'TCB'}
                class="h-6 w-6 text-black"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-5">
              <h3
                class="text-lg leading-6 font-medium text-gray-900"
                id="modal-headline"
              >
                {status}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">{subStatus}</p>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

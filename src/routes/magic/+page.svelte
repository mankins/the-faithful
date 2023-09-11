<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import firebasePromise from '$lib/utils/firebase';
  import { browser } from '$app/environment';

  import { sendEvent } from '$lib/utils/events';
  import Footer from '$lib/nav/Footer.svelte';
  import Toast from '$lib/Toast.svelte';

  let firebase;
  let authActions;
  let processing = true;
  let requireEmail = false;
  let nextUrl = '/my';

  let status = 'Hold on...';
  let subStatus = 'TCB';

  let query = {};
  let email = '';

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
        sendEvent({ topic: 'user.login.completed', email, type: 'magic' });

        window.location.href = nextUrl || '/my';
      })
      .catch(async (error) => {
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
        let accessCode = '977705';
        let BAD_IDEA = true; // i know

        if (BAD_IDEA && error.code === 'auth/invalid-action-code') {
          // common error: they re-used an old email link
          // we "soft fail" and force them through TODO: remove this
          const accessCodeFn = firebase.functions().httpsCallable('accessCode');
          try {
            const reply = await accessCodeFn({ email, accessCode });
            const authResponse = reply.data;
            // console.log(JSON.stringify({ authResponse }));
            if (authResponse && authResponse.firebaseToken) {
              const _userCredential = await firebase
                .auth()
                .signInWithCustomToken(authResponse.firebaseToken);
              // console.log(JSON.stringify({ userCredential: JSON.stringify(userCredential) }));
              sendEvent({
                topic: 'user.login.success',
                email,
                type: 'softfail-code',
              });
            }

            window.location.href = nextUrl || '/';
            return;
          } catch (eee) {
            console.log('err access code', eee);
            window.pushToast(
              `Error logging in. ${eee.message} [${eee.code}]. `,
              'alert'
            );
            status = 'Error logging in.';
            subStatus = 'Try again?';
            return;
          }
        }
        window.pushToast(
          `Error logging in. ${error.message} [${error.code}]. `,
          'alert'
        );
        window.pushToast(
          `You probably get this message when clicking on an old email or a one-time use link that's already been used.`,
          'warn'
        );
        // window.pushToast(
        //   `You can try using the access code ${accessCode} if you're still having trouble`,
        //   'info'
        // );

        status = 'Error logging in.';
        subStatus = 'Try again?';
      });
  };

  onMount(async () => {
    if (!browser) {
      return;
    }
    firebase = await firebasePromise;

    const urlParams = new URLSearchParams(window.location.search);
    nextUrl = urlParams.get('next');

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
                  for="email1"
                  class="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div class="mt-1">
                  <input
                    id="email1"
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
      {#if true || subStatus === 'TCB'}
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
              class:bg-red-50={subStatus !== 'TCB'}
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
                {#if subStatus !== 'Try again?'}
                  <p class="text-sm text-gray-500">{subStatus}</p>
                {:else}
                  <a
                    href={`/login?email=${encodeURIComponent(email)}`}
                    class="text-sm text-faithful-800 underline"
                    >Try login again</a
                  >
                {/if}
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

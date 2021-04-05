<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import * as Sentry from '@sentry/browser';

  import Footer from '$lib/nav/Footer.svelte';
  import Nav from '$lib/nav/Nav.svelte';
  import Toast from '$lib/Toast.svelte';
  import { fireGoal } from '$lib/utils/analytics';
  import { sendEvent } from '$lib/utils/events';
  import { getCookies } from '$lib/utils/cookies';
  import { productsEntitle } from '$lib/utils/entitles.js';

  import get from 'lodash.get';
  import * as firebase from 'firebase/app';
  import 'firebase/auth';
  import 'firebase/firestore';
  import { firebaseConfig } from '$lib/config/index.js';

  let sessionId = '';
  let processing = true;
  let testMode = false;
  let immediate = false;

  let waiter = 'Almost there...';
  const waits = [
    'Almost there...',
    "Who's your favorite: Elvis, Pope, Di?",
    'Good things come to those who wait...',
  ];

  onMount(async () => {
    const waitTimer = setInterval(() => {
      waiter = waits[Math.floor(Math.random() * waits.length)];
    }, 1500);

    const urlParams = new URLSearchParams(window.location.search);
    sessionId = urlParams.get('session_id');

    if (firebase.apps.length === 0) {
      await firebase.initializeApp(firebaseConfig);
    }

    await import('firebase/functions');
    if (window && window.location.href.indexOf('localhost') !== -1) {
      // dev mode
      firebase.functions().useEmulator('localhost', 15001);
    }

    let cookies = getCookies(document.cookie);
    if (cookies._test_mode) {
      // entitled = true; // default to speed up
      testMode = true;
    }

    try {
      // empty cart
      window &&
        window.localStorage &&
        window.localStorage.setItem('cart', JSON.stringify([]));
    } catch (e) {}

    if (sessionId) {
      const stripeCheckoutSuccess = firebase
        .functions()
        .httpsCallable('stripeCheckoutSuccess');
      try {
        const reply = await stripeCheckoutSuccess({ sessionId, testMode });
        const session = reply.data;
        console.log({ session });

        if (session && session.firebaseToken) {
          // try {
          //   await firebase.auth().signOut();
          //   // signed out
          // } catch (e) {
          //   // an error
          //   console.log({ e });
          // }
          await firebase.auth().signInWithCustomToken(session.firebaseToken);
          // console.log(JSON.stringify({ userCredential: JSON.stringify(userCredential) }));
          let email = get(session, 'customer.email');
          if (email) {
            sendEvent({ topic: 'user.login.success', email, type: 'purchase' });
          }
        }

        // see if this is a streaming purchase. If so, redirect them immediately
        let products = get(session, 'products', []);
        if (productsEntitle(products, 'video:thefaithful:streaming')) {
          immediate = true;
        }
        if (productsEntitle(products, 'video:thefaithful:live')) {
          // TODO: some sort of entitlements override forcing streaming, this undoes it. :|
          immediate = false;
        }

        setTimeout(() => {
          sendEvent({
            topic: 'cart.checkout.completed',
            livemode: session.livemode,
            amount: session.amount,
            currency: session.currency,
          });

          if (
            session.livemode &&
            session.amount &&
            session.currency === 'usd'
          ) {
            try {
              fireGoal('YJQPVOAW', session.amount || 0);
              window.fbq('track', 'Purchase', {
                currency: session.currency.toUpperCase(),
                value: parseFloat(session.amount_decimal),
              });
            } catch (ee) {
              console.log('fb-goal', { ee });
            }
          }
        }, 5);
        processing = false;
      } catch (e) {
        window.pushToast(`Error completing transaction. ${e.message}`, 'alert');
        waiter = `Bummer: error completing your request. [${e.message}] Email support?`;

        sendEvent({ topic: 'cart.checkout.error', message: e.message });

        Sentry.captureException(e);
      }

      clearInterval(waitTimer);
    } else {
      window.location.href = '/';
    }
  });
</script>

<div class="min-h-screen bg-white overscroll-x-contain overflow-hidden">
  <div class="absolute top-0 mb h-full z-10">
    <Nav hideLogin={true} />
  </div>

  <div class="container ml-6">
    <h1
      class="pt-24 text-4xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-6xl sm:-ml-2"
    >
      Thank you very much
    </h1>

    {#if immediate}
      <div>
        <button
          type="button"
          on:click={() => {
            window.location.href = '/my/theatre/streaming';
          }}
          class="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 mt-4"
        >
          <svg
            class="-ml-1 mr-2 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg> <span>Watch Now</span>
        </button>
      </div>
    {:else}
      <div class="w-5/6 md:w-4/6 ml-0 mt-8 mb-8">

        <button
        type="button"
        on:click={() => {
          window.location.href = '/my';
        }}
        class="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 mt-4"
      >
        <svg
          class="-ml-1 mr-2 h-5 w-5 text-gray-50"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
   <span class="pt-1 pb-1 text-gray-50">Join us in the Lobby</span>
      </button>

      </div>
    {/if}
  </div>

  <div class="bg-white overflow-hidden shadow sm:rounded-md max-w-lg">
    <div class="px-4 py-5 sm:p-6">
      <a href="/img/the-faithful-poster-2.jpg" target="_blank"
        ><img
          src="/img/the-faithful-poster-2.jpg"
          alt="The Faithful Poster"
          class="w-full"
        /></a
      >
    </div>
  </div>
</div>
<aside>
  <Toast />
</aside>
<Footer />

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
      <div
        class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div>
          <div
            class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-faithful-200"
          >
            <svg
              class="h-6 w-6 text-faithful-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-5">
            <h3
              class="text-lg leading-6 font-medium text-gray-900"
              id="modal-headline"
            >
              Please wait...
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                {waiter}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import * as Sentry from '@sentry/browser';

  import Footer from '$components/nav/Footer.svelte';
  import Nav from '$components/nav/Nav.svelte';
  import Toast from '$components/Toast.svelte';
  import { fireGoal } from '$components/utils/analytics';
  import { sendEvent } from '$components/utils/events';

  import firebase from 'firebase/app';
  import 'firebase/auth';
  import 'firebase/firestore';
  import { firebaseConfig } from '$components/config/index.js';

  let sessionId = '';
  let processing = true;

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
        const reply = await stripeCheckoutSuccess({ sessionId });
        const session = reply.data;
        console.log({ session });

        setTimeout(() => {
            sendEvent({topic:'cart.checkout.completed', livemode: session.livemode, amount: session.amount, currency: session.currency});

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

        sendEvent({topic:'cart.checkout.error', message: e.message});

        Sentry.captureException(e);
      }

      clearInterval(waitTimer);
    } else {
       window.location.href= '/';        
    }
  });
</script>

<div class="min-h-screen bg-white overscroll-x-contain overflow-hidden">
  <div class="absolute top-0 mb h-full z-10">
    <Nav />
  </div>

  <div class="container ml-6">
    <h1
      class="pt-24 text-4xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-6xl sm:-ml-2"
    >
      Thank you very much
    </h1>

    <div class="w-5/6 md:w-4/6 ml-0 mt-8 mb-8">
      <p class="text-justify text-gray-600">
        On the day of the event you'll need your email address to login to see
        the event.
      </p>
    </div>
  </div>

  <div class="relative overflow-hidden m-6">
    <picture>
      <source type="image/webp" srcset="/img/trailer-cover-1b.webp" />
      <img
        class="h-full shadow-xl mb-8 object-cover"
        src="/img/trailer-cover-1b.jpg"
        alt="The Faithful: A film on fans and followings by Annie Berman"
      />
    </picture>
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

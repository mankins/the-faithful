<script>
  import Toast from '$components/Toast.svelte';
  import firebase from 'firebase/app';
  import 'firebase/auth';
  import 'firebase/firestore';

  import WebMonCounter from '$components/WebMonCounter.svelte';
  import Visibility from '$components/Visibility.svelte';
  import Footer from '$components/nav/Footer.svelte';
  import Nav from '$components/nav/Nav.svelte';
  import VideoPlayer from '$components/VideoPlayer.svelte';
  import { getCookies } from '$components/utils/cookies';
  import { parseParams } from '$components/utils/query';

  import Cart from '$components/cart/Cart.svelte';
  import { getProduct } from '$components/data.js';
  import { firebaseConfig } from '$components/config/index.js';

  import { onMount, createEventDispatcher } from 'svelte';
  import { fade, crossfade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  let loaded = false;
  let user = {};
  let loggedIn = false;
  let btpToken;
  let webMon = false;
  let cartOpened = false;
  let items = [];
  let query = {};

  const handleAddCart = (item) => {
    cartOpened = true;
    items.push(item);
    items = items;
  };

  export let logout = false;

  const [send, receive] = crossfade({
    duration: 250,
    fallback: fade,
  });

  const icons = [
    '/img/elvis-illustrated',
    '/img/pope-illustrated',
    '/img/diana-illustrated',
  ];
  let hero = Math.floor(Math.random() * icons.length);
  let email = '';
  onMount(async () => {
    if (firebase.apps.length === 0) {
      await firebase.initializeApp(firebaseConfig);
    }

    await import('firebase/functions');
    if (window && window.location.href.indexOf('localhost') !== -1) {
      // dev mode
      firebase.functions().useEmulator('localhost', 15001);
    }

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    firebase.auth().onAuthStateChanged(function (u) {
      if (u) {
        // User is signed in.
        // console.log({ u }, 'aaa');
        if (u && !u.isAnonymous) {
          loggedIn = true;
          user = u;
          dispatch('auth-success', { user, firebase });
        } else {
          dispatch('auth-success-anonymous', { user, firebase });
          user = u;
        }
      } else {
        console.log('no-auth');
        firebase
          .auth()
          .signInAnonymously()
          .then(() => {
            // Signed in..
            dispatch('auth-success-anonymous', { user, firebase });
            console.log('signed in anonymously', { u });
            user = u;
          })
          .catch((error) => {
            console.error({ error });
            dispatch('auth-failure', { firebase, error });
          });
      }
    });

    let cookies = getCookies(document.cookie);
    btpToken = cookies._coil_btp;
    if (btpToken) {
      try {
        const btpRes = window.document.coilMonetizationPolyfill.init({
          btpToken,
        });
        console.log({ btpRes, btpToken });
      } catch (coilError) {
        console.log({ coilError });
      }
    }

    try {
      let c = window.localStorage.getItem('cart');
      items = c ? JSON.parse(c) : [];
    } catch (e) {
      console.log({ e });
    }

    query = parseParams(window.location.search);
    if (query.cart) {
      const product = getProduct(query.cart) || {};
      if (query.productId) {
        product.productId = query.productId;
      }
      if (query.productTitle) {
        product.productTitle = query.productTitle;
      }
      if (query.quantity) {
        product.quantity = query.quantity;
      }
      if (query.priceAmount && query.priceCurrency) {
        product.price = {};
        product.price.amount = query.priceAmount;
        product.price.currency = query.priceCurrency;
      }
      if (product && product.product) {
        handleAddCart(product);
      }
    }


    const heroInterval = setInterval(() => {
      hero = Math.floor(Math.random() * icons.length);
    }, 5500);

    try {
      webMon = window.document.monetization ? true : false;
    } catch (e) {}

    loaded = true;

    return () => {
      clearInterval(heroInterval);
    };
  });

  const announceSignup = async () => {
    // console.log({ email, uid: user.uid });
    const er = /^\S+@\S+$/;

    try {
      if (er.test(email)) {
        const db = firebase.firestore();
        email = email.toLowerCase();

        const docRef = db.collection('announce').doc(email);
        const doc = await docRef.get();
        if (!doc.exists) {
          // add if it's not there
          await db.doc(`announce/${email}`).set({
            email: `${email}`,
            uid: `${user.uid}`,
          });
        }

        window.pushToast("Success. We'll write soon.", 'success');
        window.fathom.trackGoal('A99HAGDM', 0); // Announce Email Signup
        // fathom.blockTrackingForMe();
      } else {
        window.pushToast(`Please enter a valid email address.`, 'alert');
        return;
      }
    } catch (e) {
      window.pushToast(
        'Already signed up?', // Error adding email ${e.message} Try again later.
        'alert'
      );
      return;
    }
  };
</script>

<svelte:head>
  <title
    >The Faithful: The King, The Pope, The Princess – A Movie by Annie Berman.</title
  >
  <meta
    property="og:image"
    content="https://www.the-faithful.com/img/the-faithful-a-movie-by-annie-berman.jpg"
  />

  <meta
    property="twitter:image"
    content="https://www.the-faithful.com/img/the-faithful-a-movie-by-annie-berman.jpg"
  />
  <meta property="twitter:card" content="summary_large_image" />
</svelte:head>

{#if loaded}
  <main class="pt-16 md:pt-1 lg:pt-8">
    {#if false}
      <section class="overflow-hidden sm:overflow-auto">
        <VideoPlayer
          poster="/img/trailer-cover-1b.jpg"
          videoId="t2jYTAKc71QbCfyTlau3GJfErwcJLmnLQS8xHWclWvE"
          captionsSrc="/subtitles/faithful-trailer.mp4.vtt"
          goal="W6DQW4K3"
        />
      </section>
    {/if}
    <section class="pt-4 sm:pt-8 lg:relative lg:py-36">
      <div
        class="sm:mx-auto sm:max-w-3xl sm:px-6 mr-48 ml-6 -mt-12 -mb-12 lg:-mb-24"
      >
        <div
          class="py-12 sm:relative md:mt-12 md:py-16 lg:absolute lg:-inset-y-12 lg:right-0 lg:w-1/2"
        >
          <Visibility steps={100} let:percent let:unobserve>
            {#if percent > 10}
              <div
                class="relative overflow-hidden sm:overflow-auto pl-0 pr-6 -ml-3 -mr-40 w-screen md:mx-auto sm:max-w-3xl sm:px-0 sm:pl-4 sm:pr-8 lg:max-w-none lg:h-full lg:pl-12"
              >
                <picture>
                  <source type="image/webp" srcset={`${icons[hero]}.webp`} />
                  <img
                    in:receive={{ key: hero }}
                    out:send={{ key: hero }}
                    use:unobserve
                    class="w-full rounded-xl shadow-xl mb-8 ring-1 ring-white ring-opacity-5 lg:h-full lg:w-auto lg:max-w-none"
                    src={`${icons[hero]}.jpg`}
                    alt="The Faithful: A film on fans and followings by Annie Berman"
                  />
                </picture>
              </div>
            {/if}
          </Visibility>
        </div>
      </div>

      <div
        class="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24"
      >
        <div>
          <div class="flex flex-row" />
          <div class="mt-1 mb-10 sm:mt-8 md:mt-20">
            <div>
              <div class="inline-flex space-x-4">
                <div
                  class="rounded-full bg-faithful-800 px-2.5 py-1 text-xs font-semibold text-gray-50 tracking-wide uppercase"
                >
                  <span class="hidden sm:block">Coming March 18 2021</span>
                  <span class="block sm:hidden normal-case">March 2021</span>
                </div>
              </div>
            </div>
            <div class="mt-6 sm:mt-12 sm:max-w-xl">
              <h1
                class="text-6xl font-serif uppercase -ml-0 sm:-ml-4 font-regular text-black tracking-tight md:text-7xl md:ml-0 lg:text-8xl sm:text-8xl"
              >
                The Faithful
              </h1>
              <h1
                class="text-2xl font-serif font-regular text-gray-800 tracking-tighter sm:text-4xl"
              >
                The King, The Pope, The Princess
              </h1>
              <p
                class="mt-6 max-w-3xl text-lg leading-7 text-gray-600"
                itemProp="description"
              >
                A lollipop officially licensed by the Vatican sparks filmmaker
                Annie Berman’s 20-year exploration of fandom, memorabilia,
                memory, and legacy within the orbits of three of the biggest
                cultural icons of our time: Pope John Paul II, Elvis Presley,
                and Diana, Princess of Wales.
              </p>
            </div>
            {#if false}
              <aside class="mt-12 sm:max-w-lg sm:w-full sm:flex">
                <div class="min-w-0 flex-1">
                  <label for="hero_email" class="sr-only">Email address</label>
                  <input
                    id="hero_email"
                    bind:value={email}
                    type="email"
                    class="block w-full border border-gray-300 rounded-md px-5 py-3 text-xs text-gray-900 placeholder-gray-500 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                    placeholder="Enter your email"
                  />
                </div>
                <div class="mt-4 sm:mt-0 sm:ml-3  ">
                  <button
                    on:click={announceSignup}
                    class="block w-full rounded-md border border-transparent px-5 py-3 bg-gray-800 text-xs font-medium text-white shadow hover:bg-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 sm:px-10"
                    >Notify me when tickets go on sale</button
                  >
                </div>
              </aside>
            {/if}
          </div>
        </div>
      </div>
    </section>

    <section class="relative mt-2 md:mt-20">
      <div
        class="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:gap-24 lg:items-start"
      >
        <div class="relative sm:py-16 lg:py-0">
          <div
            class="relative mx-auto pt-20 md:pt-36 sm:pt-0 max-w-md px-3 sm:max-w-3xl sm:px-6 lg:px-0 lg:max-w-none lg:py-20"
          >
            <Visibility
              steps={100}
              let:percent
              let:unobserve
              let:intersectionObserverSupport
            >
              {#if percent > 10}
                <div
                  use:unobserve
                  transition:fade={{ delay: 10 }}
                  class="relative pt-96 pb-24 rounded-2xl shadow-xl overflow-hidden"
                >
                  <picture>
                    <source
                      type="image/webp"
                      srcset="/img/PopeLollipopSky_still02.webp"
                    />
                    <img
                      class="absolute inset-0 h-full w-full object-cover"
                      src="/img/PopeLollipopSky_still02.jpg"
                      alt=""
                    />
                  </picture>
                </div>
              {/if}
            </Visibility>
          </div>
        </div>

        <div
          class="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0"
        >
          <div class="pt-12 sm:pt-16 lg:pt-20  ">
            <h2
              class="text-2xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-4xl"
            >
              Follow the journey from the discovery of a lollipop at the Vatican
              to Graceland and the gates of Kensington Palace
            </h2>
            <div class="mt-6 text-gray-500 space-y-6">
              <p class="text-lg">
                A Pope John Paul II lollipop. An Elvis Presley shower curtain. A
                Princess Diana teacup. These are just some of the countless
                pieces of memorabilia that these pop culture icons’ most devoted
                fans collect and cherish – but why? The Faithful‘s director,
                Annie Berman, explores the deep veneration and legacies of the
                Pope, the Princess, and the King. Over the course of 20 years,
                Berman profiles these figures’ biggest fans and makes numerous
                pilgrimages to Vatican City, Graceland, and Kensington Palace.
                As the years go by, the film itself becomes increasingly
                entwined with Berman’s daily life and identity, much like how
                the officially licensed knick-knacks define the fans she filmed.
              </p>
            </div>
          </div>

          <div class="mt-10  ">
            <dl class="grid grid-cols-2 gap-x-4 gap-y-8">
              <div class="border-t-2 border-gray-100 pt-6">
                <dt class="text-base font-medium text-faithful-800">
                  Filming Began
                </dt>
                <dd
                  class="text-3xl font-extrabold tracking-tight text-gray-900"
                >
                  2000
                </dd>
              </div>

              <div class="border-t-2 border-gray-100 pt-6">
                <dt class="text-base font-medium text-faithful-800">
                  Cinematic Release
                </dt>
                <dd
                  class="text-3xl font-extrabold tracking-tight text-gray-900"
                >
                  2021
                </dd>
              </div>
            </dl>
            <div class="mt-10 invisible">
              <a
                href="http://www.annieberman.net/about"
                rel="noopener"
                class="text-base font-medium text-rose-500"
              >
                Learn more about our filmmaker &nbsp&rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="relative mt-2 md:mt-20">
      <div
        class="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:gap-24 lg:items-start"
      >
        <div class="relative sm:py-16 lg:py-0">
          <div
            aria-hidden="true"
            class="hidden sm:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-screen"
          >
            <div
              class="absolute inset-y-0 right-1/2 w-full bg-faithful-500 rounded-r-3xl lg:right-72"
            />
          </div>
          <div
            class="relative mx-auto max-w-md px-3 sm:max-w-3xl sm:px-6 lg:px-0 lg:max-w-none lg:py-20"
          >
            <Visibility
              steps={100}
              let:percent
              let:unobserve
              let:intersectionObserverSupport
            >
              {#if percent > 10}
                <div
                  use:unobserve
                  transition:fade={{ delay: 10 }}
                  class="relative pt-64 pb-10 rounded-2xl overflow-hidden"
                >
                  <picture>
                    <source type="image/webp" srcset="/img/annie-berman.webp" />
                    <img
                      class="absolute inset-0 h-96 w-96 object-cover rounded-full"
                      src="/img/annie-berman.jpg"
                      alt="Annie Berman"
                      id="annie_berman"
                    />
                  </picture>

                  <div class="relative px-8">
                    <blockquote class="mt-8">
                      <footer class="mt-4 pt-20">
                        <label for="annie_berman" class="sr-only"
                          >Annie Berman, Filmmaker</label
                        >
                        <p
                          class="invisible text-xl font-serif font-semibold tracking-tight text-faithful-500 uppercase"
                        >
                          Annie Berman, Filmmaker
                        </p>
                      </footer>
                    </blockquote>
                  </div>
                </div>
              {/if}
            </Visibility>
          </div>
        </div>

        <div
          class="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0 pt-0 -mt-8 sm:mt-1"
        >
          <div class="sm:pt-16 lg:pt-20">
            <h2
              class="text-3xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-4xl"
            >
              About the Filmmaker
            </h2>
            <div class="mt-6 text-gray-500 space-y-6">
              <p class="text-lg  ">
                Annie Berman is a NYC based media artist. Her work has shown
                internationally including MoMA, Spring/Break Art Show, and the
                Rome Independent Film Festival where she was awarded Best
                Experimental Film. She teaches documentary film writing at City
                College, holds an MFA from Hunter College, and is a member of
                the Brooklyn Filmmakers Collective.
              </p>
            </div>
          </div>

          <div class="mt-10">
            <div class="mt-10">
              <a
                href="http://annieberman.net/about"
                rel="noopener"
                target="_blank"
                class="text-base font-medium text-faithful-50"
              >
                Learn more about our filmmaker &nbsp&rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-32">
      <div
        class="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl"
      >
        <div class="lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center  ">
          <aside>
            <h2
              class="text-2xl font-serif font-extrabold text-gray-900 tracking-tight sm:text-4xl"
            >
              Thank you very much
            </h2>
            <p class="mt-6 max-w-3xl text-lg leading-7 text-gray-500">
              This project is made possible with funds from the New York State
              Council on the Arts in Partnership with Wave Farm: Media Arts
              Assistance Fund, a regrant program of the New York State Council
              on the Arts, Electronic Media and Film Program, with the support
              of Governor Andrew Cuomo and the New York State Legislature. With
              additional support from: The Puffin Foundation, UnionDocs, The
              Somerville Arts Council, Signal Culture, Kopkind Colony and
              Individual Contributors and Kickstarter backers.
            </p>
            <p class="mt-6 max-w-3xl text-lg leading-7 text-gray-500">
              We're honored to have our distribution sponsored by <a
                href="https://www.grantfortheweb.org/"
                rel="noopener"
                class="underline text-faithful-50"
                target="_blank">Grant for the Web</a
              >. Grant for the Web aims to boost open, fair, and inclusive
              standards and innovation in Web Monetization.
            </p>
          </aside>
          <div class="relative sm:py-16 lg:py-0">
            <div
              class="relative mx-auto pt-20 md:pt-36 sm:pt-0 max-w-md px-3 sm:max-w-3xl sm:px-6 lg:px-0 lg:max-w-none lg:py-20"
            >
              <Visibility
                steps={100}
                let:percent
                let:unobserve
                let:intersectionObserverSupport
              >
                {#if percent > 10}
                  <div
                    use:unobserve
                    transition:fade={{ delay: 10 }}
                    class="relative pt-96 pb-24 rounded-2xl shadow-xl overflow-hidden"
                  >
                    <picture>
                      <source
                        type="image/webp"
                        srcset="/img/annie-jerry-the-faithful.webp"
                      />
                      <img
                        class="absolute inset-0 h-full w-full object-cover"
                        src="/img/annie-jerry-the-faithful.jpg"
                        alt=""
                      />
                    </picture>
                  </div>
                {/if}
              </Visibility>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="relative mt-24 sm:mt-32 sm:py-16">
      <div aria-hidden="true" class="hidden sm:block">
        <div class="absolute inset-y-0 left-0 w-1/2 bg-gray-50 rounded-r-3xl" />
      </div>
      <div
        class="mx-auto mb-12 max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8"
      >
        <div
          class="relative rounded-2xl px-6 py-10 bg-faithful-500 overflow-hidden shadow-xl sm:px-12 sm:py-20"
        >
          <div
            aria-hidden="true"
            class="absolute inset-0 -mt-72 sm:-mt-32 md:mt-0"
          >
            <svg
              class="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 1463 360"
            >
              <path
                class="text-faithful-900 text-opacity-40"
                fill="currentColor"
                d="M-82.673 72l1761.849 472.086-134.327 501.315-1761.85-472.086z"
              />
              <path
                class="text-faithful-800 text-opacity-40"
                fill="currentColor"
                d="M-217.088 544.086L1544.761 72l134.327 501.316-1761.849 472.086z"
              />
            </svg>
          </div>
          <div class="relative">
            <div class="sm:text-center">
              <h2
                class="text-4xl font-serif font-extrabold text-black tracking-tight lg:text-6xl"
              >
                Stay up to date
              </h2>
              <p class="mt-6 mx-auto max-w-2xl text-lg text-gray-700  ">
                We'll notify you when our tickets come on sale in your area as
                well as update you on details about our virtual cinema release.
              </p>
            </div>
            <aside class="mt-12 sm:mx-auto sm:max-w-lg sm:flex">
              <div class="min-w-0 flex-1">
                <label for="cta_email" class="sr-only">Email address</label>
                <input
                  id="cta_email"
                  bind:value={email}
                  type="email"
                  class="block w-full border border-transparent rounded-md px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-faithful-800"
                  placeholder="Enter your email"
                />
              </div>
              <div class="mt-4 sm:mt-0 sm:ml-3  ">
                <button
                  on:click={announceSignup}
                  class="block w-full rounded-md border border-transparent px-5 py-3 bg-gray-900 text-base font-medium text-white shadow hover:bg-faithful-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-faithful-800 sm:px-10"
                  >Notify me</button
                >
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  </main>

  <aside class="z-40">
    <Toast />
  </aside>

  <Footer />
{/if}

<div class="bg-white absolute top-0 mb h-full z-10">
  <Nav {loggedIn} {user}>
    <button
      on:click={() => {
        if (items.length) {
          cartOpened = true;
          return;
        }
        handleAddCart(getProduct('cinema-premiere'));
      }}
      type="button"
      class="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-faithful-600 shadow-sm hover:bg-faithful-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500"
    >
      <!-- Heroicon name: ticket -->
      <svg
        class="-ml-1 mr-2 h-5 w-5"
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
      <span>Buy a Ticket</span>
    </button>
  </Nav>
  {#if (btpToken || webMon) && !cartOpened}
    <div class="z-40 fixed bottom-4 right-4">
      <WebMonCounter />
    </div>
  {/if}
  <Cart bind:opened={cartOpened} bind:items />
</div>

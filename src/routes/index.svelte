<script>
  import Toast from '$components/Toast.svelte';
  import firebase from 'firebase/app';
  import 'firebase/auth';
  import 'firebase/firestore';

  import Visibility from '$components/Visibility.svelte';

  import { onMount } from 'svelte';
  import { fade, crossfade } from 'svelte/transition';
  let loaded = false;
  let user = {};

  const [send, receive] = crossfade({
    duration: 250,
    fallback: fade,
  });

  const icons = [
    // '/the-faithful-a-movie-by-annie-berman-640x640.png',
    // '/the-faithful-pope-640x640.jpg',
    // '/the-faithful-icons.jpg',
    // '/the-faithful-elvis.jpg',
    '/elvis-1.jpg',
    '/elvis-2.jpg',
    '/elvis-3.jpg',
    '/pope-1.jpg',
    '/pope-2.jpg',
    '/pope-3.jpg',
    '/diana-1.jpg',
    '/diana-2.jpg',
    '/diana-3.jpg',
  ];
  let hero = Math.floor(Math.random() * icons.length);
  let email = '';
  onMount(async () => {
    const firebaseConfig = {
      apiKey: 'AIzaSyC75bagJGvDb5_2FJOT1yE2RV-97FGvYVs',
      authDomain: 'the-faithful.firebaseapp.com',
      projectId: 'the-faithful',
      storageBucket: 'the-faithful.appspot.com',
      messagingSenderId: '505590894387',
      appId: '1:505590894387:web:573695e14e3f14cee77846',
      databaseURL: 'https://the-faithful.firebaseio.com',
    };

    if (firebase.apps.length === 0) {
      await firebase.initializeApp(firebaseConfig);
      loaded = true;
    }

    await import('firebase/functions');
    if (window && window.location.href.indexOf('localhost') !== -1) {
      // dev mode
      firebase.functions().useEmulator('localhost', 5001);
    }

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    firebase.auth().onAuthStateChanged(function (u) {
      if (u) {
        // User is signed in.
        console.log({ u }, 'aaa');
        if (u && !u.isAnonymous) {
          // dispatch("auth-success", { user, firebase });
          user = u;
        } else {
          // dispatch("auth-success-anonymous", { user, firebase });
          user = u;
        }
      } else {
        console.log('no-auth');
        firebase
          .auth()
          .signInAnonymously()
          .then(() => {
            // Signed in..
            // dispatch("auth-success-anonymous", { user, firebase });
            console.log('signed in anonymously', { u });
            user = u;
          })
          .catch((error) => {
            console.error({ error });
            // dispatch("auth-failure", { firebase, error });
          });
      }
    });

    // TODO: kill this on unload
    setInterval(() => {
      hero = Math.floor(Math.random() * icons.length);
    }, 5500);
  });

  const announceSignup = async () => {
    console.log({ email, uid: user.uid });
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
    content="https://www.the-faitfhful.com/the-faithful-a-movie-by-annie-berman.png"
  />

  <meta
    property="twitter:image"
    content="https://www.the-faitfhful.com/the-faithful-a-movie-by-annie-berman.png"
  />
  <meta property="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="bg-white">
  {#if loaded}
    <main>
      <section class="pt-8 overflow-hidden sm:pt-12 lg:relative lg:py-48">
        <div class="sm:mx-auto sm:max-w-3xl sm:px-6 mr-48 ml-6 -mt-12">
          <div
            class="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2"
          >
            <div class="hidden sm:block">
              <div
                class="absolute inset-y-0 left-1/2 w-screen bg-gray-50 rounded-l-3xl lg:left-40 lg:right-0 lg:w-full"
              />
              <svg
                class="absolute top-8 right-1/2 -mr-3 lg:m-0 lg:left-0"
                width="404"
                height="392"
                fill="none"
                viewBox="0 0 404 392"
              >
                <defs>
                  <pattern
                    id="837c3e70-6c3a-44e6-8854-cc48c737b659"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="4"
                      height="4"
                      class="text-gray-200"
                      fill="none"
                    />
                  </pattern>
                </defs>
                <rect
                  width="404"
                  height="392"
                  fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
                />
              </svg>
            </div>
            <Visibility steps={100} let:percent let:unobserve>
              {#if percent > 50}
                <div
                  class="relative overflow-hidden pl-0 pr-6 -ml-3 -mr-40 w-screen sm:-mr-40 sm:mx-auto sm:max-w-3xl sm:px-0 sm:pl-4 sm:pr lg:max-w-none lg:h-full lg:pl-12"
                >
                  <img
                    in:receive={{ key: hero }}
                    out:send={{ key: hero }}
                    use:unobserve
                    class="w-full rounded-xl shadow-xl ring-1 ring-white ring-opacity-5 lg:h-full lg:w-auto lg:max-w-none"
                    src={icons[hero]}
                    alt="The Faithful: A film on fans and followings by Annie Berman"
                  />
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
            <div class="mt-4 sm:mt-20">
              <div>
                <a href="#" class="inline-flex space-x-4">
                  <span
                    class="rounded bg-faithful-500 px-2.5 py-1 text-xs font-semibold text-gray-600 tracking-wide uppercase"
                  >
                    Coming March 2021
                  </span>
                  <span
                    class="inline-flex items-center text-sm font-medium text-gray-400 space-x-1"
                  >
                    <span>Reserve your ticket today</span>

                    <!-- Heroicon name: chevron-right -->
                    <svg
                      class="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                </a>
              </div>
              <div class="mt-6 sm:max-w-xl">
                <h1
                  class="text-7xl font-serif uppercase -ml-0 sm:-ml-4 font-extrabold text-black tracking-tight md:text-7xl md:ml-0 lg:text-8xl sm:text-8xl"
                >
                  The Faithful
                </h1>
                <h1
                  class="text-2xl font-serif font-extrabold text-gray-800 tracking-tight sm:text-4xl"
                >
                  The King, The Pope, The Princess
                </h1>
                <p
                  class="  mt-6 max-w-3xl text-lg leading-7 text-gray-600"
                  itemProp="description"
                >
                  The discovery of the image of Pope John Paul II on a lollipop
                  for sale at the Vatican inspires a twenty-year voyage deep
                  into the worlds of Elvis Presley, Pope John Paul II, and
                  Princess Diana in this meditation on fans, faith, and image.
                </p>
              </div>
              <aside class="mt-12 sm:max-w-lg sm:w-full sm:flex">
                <div class="min-w-0 flex-1">
                  <label for="hero_email" class="sr-only">Email address</label>
                  <input
                    id="hero_email"
                    bind:value={email}
                    type="email"
                    class="block w-full border border-gray-300 rounded-md px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                    placeholder="Enter your email"
                  />
                </div>
                <div class="mt-4 sm:mt-0 sm:ml-3  ">
                  <button
                    on:click={announceSignup}
                    class="block w-full rounded-md border border-transparent px-5 py-3 bg-gray-800 text-base font-medium text-white shadow hover:bg-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 sm:px-10"
                    >Notify me when tickets go on sale</button
                  >
                </div>
              </aside>
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
              aria-hidden="true"
              class="hidden sm:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-screen"
            >
              <div
                class="absolute inset-y-0 right-1/2 w-full bg-gray-50 rounded-r-3xl lg:right-72"
              />
              <svg
                class="absolute top-8 left-1/2 -ml-3 lg:-right-8 lg:left-auto lg:top-12"
                width="404"
                height="392"
                fill="none"
                viewBox="0 0 404 392"
              >
                <defs>
                  <pattern
                    id="02f20b47-fd69-4224-a62a-4c9de5c763f7"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="4"
                      height="4"
                      class="text-gray-200"
                      fill="none"
                    />
                  </pattern>
                </defs>
                <rect
                  width="404"
                  height="392"
                  fill="url(#02f20b47-fd69-4224-a62a-4c9de5c763f7)"
                />
              </svg>
            </div>
            <div
              class="relative mx-auto pt-40 sm:pt-0 max-w-md px-3 sm:max-w-3xl sm:px-6 lg:px-0 lg:max-w-none lg:py-20"
            >
              <Visibility
                steps={100}
                let:percent
                let:unobserve
                let:intersectionObserverSupport
              >
                {#if percent > 60}
                  <div
                    use:unobserve
                    transition:fade={{ delay: 10 }}
                    class="relative pt-64 pb-10 rounded-2xl shadow-xl overflow-hidden"
                  >
                    <img
                      style="filter: grayscale(1);"
                      class="absolute inset-0 h-full w-full object-cover"
                      src="/photo-pope-bust.jpg"
                      alt=""
                    />
                    <div
                      zclass="absolute inset-0 bg-faithful-500"
                      zstyle="mix-blend-mode: multiply;"
                    />
                    <div class="relative px-8">
                      <blockquote class="mt-8" style="font-family: Domine">
                        <div
                          class="relative text-xl font-medium text-white md:flex-grow"
                        >
                          <svg
                            class="absolute top-0 left-0 transform -translate-x-3 -translate-y-6 h-6 w-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 32 32"
                            aria-hidden="true"
                          >
                            <path
                              d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"
                            />
                          </svg>
                          <p class="relative font-serif">One of 10 Filmmakers to Watch</p>
                        </div>

                        <footer class="mt-4  ">
                          <a
                            href="https://independent-magazine.org/2016/03/25/10-to-watch-annie-berman/"
                            target="_blank"
                          >
                            <p
                              class="text-xl font-serif font-semibold tracking-tight text-faithful-800 uppercase"
                            >
                              The Independent
                            </p>
                          </a>
                        </footer>
                      </blockquote>
                    </div>
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
                Follow the journey from the discovery of a lollipop at the
                Vatican to Graceland and the gates of Kensington Palace
              </h2>
              <div class="mt-6 text-gray-500 space-y-6">
                <p class="text-lg">
                  The Faithful is a feature-length essay film exploring the
                  fanatical veneration of three global icons: Elvis Presley,
                  Pope John Paul II and Princess Diana.
                </p>
                <p class="text-base leading-7">
                  After discovering a Pope lollipop on sale at the Vatican, the
                  filmmaker embarks on a twenty-year exploration of iconography
                  and grief. She attends annual memorials to Elvis, Diana and
                  the Pope, documenting the rites and rituals of their
                  followers.
                </p>
                <p class="text-base leading-7">
                  What begins as a voyeuristic undertaking soon becomes an
                  obsession, a pilgrimage, an act of faith. She captures ever
                  more footage, in the hope – the belief – that the right image
                  can answer her question: 'Why?'.
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
                  class="text-base font-medium text-rose-500"
                >
                  Learn more about our film maker &nbsp&rarr;
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
                {#if percent > 50}
                  <div
                    use:unobserve
                    transition:fade={{ delay: 10 }}
                    class="relative pt-64 pb-10 rounded-2xl overflow-hidden"
                  >
                    <img
                      style="filter: grayscale(1);"
                      class="absolute inset-0 h-96 w-96 object-cover rounded-full"
                      src="/annie-berman.png"
                      alt="Annie Berman"
                    />
                    <div class="relative px-8">
                      <blockquote class="mt-8">
                        <footer class="mt-4 pt-20">
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
            class="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0"
          >
            <div class="pt-12 sm:pt-16 lg:pt-20">
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
                  Experimental Film. She teaches documentary film writing at
                  City College, holds an MFA from Hunter College, and is a
                  member of the Brooklyn Filmmakers Collective.
                </p>
              </div>
            </div>

            <!-- Stats section -->
            <div class="mt-10">
              <div class="mt-10">
                <a
                  href="http://annieberman.net/about"
                  target="_blank"
                  class="text-base font-medium text-faithful-50"
                >
                  Learn more about our film maker &nbsp&rarr;
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
                of Governor Andrew Cuomo and the New York State Legislature.
                With additional support from: The Puffin Foundation, UnionDocs,
                The Somerville arts Council, Signal Culture, Kopkind Colony and
                Individual Contributors and Kickstarter backers.
              </p>
              <p class="mt-6 max-w-3xl text-lg leading-7 text-gray-500">
                We're honored to have our distribution sponsored by <a
                  href="https://www.grantfortheweb.org/"
                  class="underline text-faithful-50"
                  target="_blank">Grant for the Web</a
                >. Grant for the Web aims to boost open, fair, and inclusive
                standards and innovation in Web Monetization.
              </p>
              <div class="mt-6 invisible">
                <a href="#" class="text-base font-medium text-rose-500">
                  Meet our investors and advisors&nbsp&rarr;
                </a>
              </div>
            </aside>
            <div
              class="mt-12 mb-24 grid grid-cols-1 sm:grid-cols-3 gap-6 md:grid-cols-3 lg:mt-0 lg:grid-cols-3"
            >
              <div
                class="col-span-1 flex justify-center py-8 px-8  rounded-2xl"
              >
                <img
                  class="max-h-24 rounded-full flex items-center justify-center ring-8 bg-white ring-faithful-800"
                  src="/elvis-circle.min.svg"
                  alt="Elvis Presley"
                />
              </div>
              <div
                class="col-span-1 flex justify-center py-8 px-8   rounded-2xl"
              >
                <img
                  class="max-h-24 rounded-full flex items-center justify-center ring-8 bg-white ring-faithful-800"
                  src="/pope-john-paul.min.svg"
                  alt="Pope John Paul II"
                />
              </div>
              <div
                class="col-span-1 flex justify-center py-8 px-8   rounded-2xl"
              >
                <img
                  class="max-h-24 rounded-full flex items-center justify-center ring-8 bg-white ring-faithful-800"
                  src="/diana-princess-of-wales.min.svg"
                  alt="Diana Princess of Wales"
                />
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- CTA section -->
      <div class="relative mt-24 sm:mt-32 sm:py-16">
        <div aria-hidden="true" class="hidden sm:block">
          <div
            class="absolute inset-y-0 left-0 w-1/2 bg-gray-50 rounded-r-3xl"
          />
          <svg
            class="absolute top-8 left-1/2 -ml-3"
            width="404"
            height="392"
            fill="none"
            viewBox="0 0 404 392"
          >
            <defs>
              <pattern
                id="8228f071-bcee-4ec8-905a-2a059a2cc4fb"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x="0"
                  y="0"
                  width="4"
                  height="4"
                  class="text-gray-200"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width="404"
              height="392"
              fill="url(#8228f071-bcee-4ec8-905a-2a059a2cc4fb)"
            />
          </svg>
        </div>
        <div
          class="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8"
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
                  Attend our world premiere event
                </h2>
                <p class="mt-6 mx-auto max-w-2xl text-lg text-gray-700  ">
                  We'll notify you when our tickets come on sale with all the
                  details about our virtual cinema release.
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

    <footer class="mt-24 bg-gray-900 sm:mt-12  ">
      <div
        class="mx-auto max-w-md py-12 px-4 overflow-hidden sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8"
      >
        <nav
          class="-mx-5 -my-2 flex flex-wrap justify-center"
          aria-label="Footer"
        >
          <div class="px-5 py-2">
            <a
              href="mailto:annie@fishinhand.com?subject=press+the+faithful"
              target="_blank"
              class="text-base text-gray-400 hover:text-gray-300"
            >
              Press Inquires
            </a>
          </div>

          <div class="px-5 py-2">
            <a
              href="mailto:annie@fishinhand.com"
              target="_blank"
              class="text-base text-gray-400 hover:text-gray-300"
            >
              Contact
            </a>
          </div>
        </nav>
        <div class="mt-8 flex justify-center space-x-6">
          <a
            href="https://www.facebook.com/thefaithfulfilm/"
            target="_blank"
            class="text-gray-400 hover:text-gray-300"
          >
            <span class="sr-only">Facebook</span>
            <svg
              class="h-12 w-12"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clip-rule="evenodd"
              />
            </svg>
          </a>

          <a
            href="https://www.instagram.com/thefaithful/"
            target="_blank"
            class="text-gray-400 hover:text-gray-300"
          >
            <span class="sr-only">Instagram</span>
            <svg
              class="h-12 w-12"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                clip-rule="evenodd"
              />
            </svg>
          </a>

          <a
            href="https://twitter.com/thefaithful"
            target="_blank"
            class="text-gray-400 hover:text-gray-300"
          >
            <span class="sr-only">Twitter</span>
            <svg
              class="h-12 w-12"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
              />
            </svg>
          </a>

          {#if false}
            <a href="#" class="text-gray-400 hover:text-gray-300">
              <span class="sr-only">GitHub</span>
              <svg
                class="h-12 w-12"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
          {/if}
        </div>
        <p class="mt-8 text-center text-base text-gray-400">
          &copy; 2021 The Faithful Movie, LLC.
        </p>
      </div>
    </footer>
  {/if}
</div>

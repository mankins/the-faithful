<script context="module">
    export async function load({ page }) {
      const { focusType } = page.params;
      return { props: { focusType } };
    }
  </script>
  
  <script>
    import Toast from '$components/Toast.svelte';
  
    import Cart from '$components/cart/Cart.svelte';
    import Nav from '$components/nav/Nav.svelte';
    import Footer from '$components/nav/Footer.svelte';
    import Streaming from '$components/schedule/Streaming.svelte';
    import Sneak from '$components/schedule/Sneak.svelte';
    import Opening from '$components/schedule/Opening.svelte';
    import Virtual from '$components/schedule/Virtual.svelte';
    import Duration from 'duration';
  
    import { getProduct } from '$components/data.js';
    import { parseParams } from '$components/utils/query';
  
    import { onMount } from 'svelte';
  
    let user = {};
    let loggedIn = false; // only appears on home page
  
    export let focusType = 'sneak';
  
    let cartOpened = false;
    let items = [];
    let query = {};
  
    let now = Date.now();
    let nextShow = new Date('2021-03-18T18:00:00.000Z');

    const handleAddCart = (item) => {
      cartOpened = true;
      let found = false;
      items.forEach((currentItem) => {
        if (item.productId === currentItem.productId) {
          console.log(JSON.stringify({ item, currentItem }, null, 2));
          currentItem.quantity = currentItem.quantity + 1;
          found = true;
        }
      });
      if (!found) {
        items.push(item);
      }
      try {
        window &&
          window.localStorage &&
          window.localStorage.setItem('cart', JSON.stringify(items));
      } catch (e) {}
  
      items = items;
    };

        let webMon = false;

    onMount(async () => {
      try {
        let c = window.localStorage.getItem('cart');
        items = c ? JSON.parse(c) : [];
      } catch (e) {
        console.log({ e });
      }
      try {
      webMon = window.document.monetization ? true : false;
    } catch (e) {}
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
    });
  </script>
  
  <svelte:head>
    <meta name="twitter:site" content="@TheFaithful" />
    <title
      >The Faithful: The King, The Pope, The Princess – A Movie by Annie Berman.</title
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
  
    <meta
      property="og:video"
      content="https://stream.mux.com/pJ8ZLyX6GQy2gR6K72Np3iPhGJU00yYwMP01K3elY02NOQ/low.mp4"
    />
    <meta
      property="og:video:secure_url"
      content="https://stream.mux.com/pJ8ZLyX6GQy2gR6K72Np3iPhGJU00yYwMP01K3elY02NOQ/low.mp4"
    />
    <meta property="og:video:type" content="video/mp4" />
    <meta property="og:video:width" content="640" />
    <meta property="og:video:height" content="360" />
  </svelte:head>
  
  <div class="min-h-screen bg-faithful-500 overscroll-x-contain overflow-hidden">
    <div class="absolute top-0 mb h-full z-10">
      <Nav {loggedIn} {user}>
        <button
          on:click={() => {
            if (items.length) {
              cartOpened = true;
              return;
            }
            handleAddCart(
              getProduct('cinema-premiere', 'video:thefaithful:20210319:1900')
            );
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
          <span>Buy Tickets</span>
        </button>
      </Nav>
  
      <Cart bind:opened={cartOpened} bind:items />
    </div>
  
    <div class="container ml-6">
      <h1
        class="pt-24 text-4xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-6xl"
      >        
        {#if now > nextShow}
         The Faithful
        <span class="zfloat-right font-sans inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-faithful-800 text-white">
            Now playing
          </span>
{:else}
Watch
<span class="zfloat-right font-sans inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-faithful-800 text-white">
    Starting soon
  </span>
{/if}

    </h1>
  
      <div class="w-5/6 md:w-4/6">
        <p class="text-justify text-gray-600">
            Today's event is a special screening for 
            <a class="underline"
            href="https://coil.com/?ref=mankins1701">Coil</a
          > subscribers.
        </p>
        <p class="text-justify text-gray-600">
            Join us after the show for a question and answer session with the filmmakers.</p>
      </div>
    </div>

    {#if webMon}

    {#if webMon}
<div class="bg-faithful-500">
    <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div class="bg-black rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
        <div class="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
          <div class="lg:self-center">
            <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
              <span class="block">You're ready to watch!</span>
              <span class="block"></span>
            </h2>
            <p class="mt-4 text-lg leading-6 text-faithful-200">
                Be sure to join us for the q&a after the screening.
            </p>
            <a href="/my" rel="external" class="mt-8 bg-white border border-transparent rounded-md shadow px-5 py-3 inline-flex items-center text-base font-medium text-faithful-600 ">
            Watch now
            </a>
          </div>
        </div>
        <div class="-mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1">
          <img class="transform translate-x-6 translate-y-6 rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20" src="/img/the-faithful-poster-1.jpg" alt="Faithful Poster">
        </div>
      </div>
    </div>
  </div>
  

    <div class="relative bg-faithful-500 opacity-50 sm:w-1/2">
        <div class="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
          <img src="/svg/congrats-twemoji.svg" alt="congrats emoji" />
          <div class="pr-16 sm:text-center sm:px-16">
            <p class="font-medium text-gray-800">
              <span class="md:hidden"> You're Web Monetized! </span>
              <span class="hidden md:inline">
                You're Web Monetized! 
              </span>
            </p>
          </div>
          <div
            class="absolute inset-y-0 right-0 pt-1 pr-1 flex items-start sm:pt-1 sm:pr-2 sm:items-start"
          >
          </div>
        </div>
      </div>
    {:else}
      <div class="relative bg-faithful-500 opacity-50 mt-6">
        <div class="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
          <img class="p-20" src="/svg/coil-logo-black.svg" alt="coil" />
          <div class="pr-16 sm:text-center sm:px-16">
            <p class="font-medium text-gray-800">
              <span class="md:hidden"> New to Web Monetization? </span>
              <span class="hidden md:inline">
                If you had a Web Monetization pass, this movie would be included
                for free as part of your monthly pass.
              </span>
              <span class="block sm:ml-2 sm:inline-block">
                <a
                  href="https://coil.com/signup?ref=mankins1701"
                  rel="nofollow"
                  target="_blank"
                  class="text-white font-bold underline"
                >
                  Learn more <span aria-hidden="true">&rarr;</span></a
                >
              </span>
            </p>
          </div>
          <div
            class="absolute inset-y-0 right-0 pt-1 pr-1 flex items-start sm:pt-1 sm:pr-2 sm:items-start"
          >
            <button
              type="button"
              class="flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span class="sr-only">Dismiss</span>
              <!-- Heroicon name: outline/x -->
              <svg
                class="h-6 w-6 text-white"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    {/if}
  {:else}
<div
class="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8 bg-faithful-500 pb-16"
>
<div class="sm:flex sm:flex-col sm:align-center">
  <div
    class="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-4"
  >
      <Sneak />
  </div>
</div>
</div>

{/if}
  
    <aside>
      <Toast />
    </aside>
    <Footer />
  </div>
  {#if false}<slot />{/if}
  
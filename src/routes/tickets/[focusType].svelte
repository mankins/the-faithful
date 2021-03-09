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

  import { getProduct } from '$components/data.js';
  import { parseParams } from '$components/utils/query';

  import { onMount } from 'svelte';

  export let focusType = 'sneak,opening,virtual,streaming';

  let cartOpened = false;
  let items = [];
  let query = {};

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

  onMount(async () => {
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
  });
</script>

<svelte:head>
  <meta name="twitter:site" content="@TheFaithful" />
  <title
    >The Faithful: The King, The Pope, The Princess – A Movie by Annie Berman
    about Elvis, Pope John Paul II, and Diana Princess of Wales</title
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
    <Nav>
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
      Tickets
    </h1>

    <div class="w-5/6 md:w-4/6">
      <p class="text-justify text-gray-600">
        {#if focusType.includes('opening')}
          Virtual screenings are available opening weekend Friday, March 19 -
          Sunday, March 21st, 2021. All screenings are live events with the
          filmmakers present. Your ticket grants you access to any or all of the
          showtimes listed.
        {:else}
          Virtual screenings are available opening weekend Friday, March 19 -
          Sunday, March 21st, 2021, with a special sneak preview for <a
            class="underline"
            href="https://www.coil.com/">Coil</a
          > subscribers Thursday, March 18th. All screenings are live events with
          the filmmakers present. Your ticket grants you access to any or all of
          the showtimes listed.
        {/if}
      </p>
    </div>
  </div>

  <div
    class="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8 bg-faithful-500 pb-16"
  >
    <div class="sm:flex sm:flex-col sm:align-center">
      <div
        class="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-4"
      >
        {#if focusType.includes('sneak')}
          <Sneak />
        {/if}

        {#if focusType.includes('opening')}
          <Opening
            action={() =>
              handleAddCart(
                getProduct('cinema-premiere', 'video:thefaithful:20210319:1900')
              )}
          />
        {/if}

        {#if focusType.includes('virtual')}
          <Virtual
            action={() =>
              handleAddCart(
                getProduct('cinema-virtual', 'video:thefaithful:20210320:1900')
              )}
          />
        {/if}

        {#if focusType.includes('stream')}
          <Streaming
            action={() => {
              handleAddCart(
                getProduct('cinema-stream', 'video:thefaithful:streaming')
              );
            }}
          />
        {/if}
      </div>
    </div>
  </div>
  <aside>
    <Toast />
  </aside>
  <Footer />
</div>

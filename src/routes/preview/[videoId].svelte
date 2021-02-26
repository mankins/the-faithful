<script context="module">
  export async function load({ page }) {
    const { videoId } = page.params;
    return { props: { videoId } };
  }
</script>

<script>
  import FirebaseProvider from '$components/FirebaseProvider.svelte';

  // import Toast from '$components/Toast.svelte';
  import Footer from '$components/nav/Footer.svelte';
  import LoginModal from '$components/LoginModal.svelte';

  import AccessDenied from '$components/AccessDenied.svelte';
  import Processing from '$components/Processing.svelte';
  import VideoPlayer from '$components/VideoPlayer.svelte';

  import { onMount } from 'svelte';
  import { productsEntitle } from '$components/utils/entitles.js';
  import { baseProducts } from '$components/utils/auth.js';

  import Cart from '$components/cart/Cart.svelte';
  import { getProduct } from '$components/data.js';
  import { parseParams } from '$components/utils/query';

  let db;
  let firebase;
  let loaded = false;
  let user = {};
  let userProducts = [...baseProducts]; // these are the products that the user has
  let nextUrl = '/';
  // pJ8ZLyX6GQy2gR6K72Np3iPhGJU00yYwMP01K3elY02NOQ / f8NFF01pyowaiq6H1jJxWnODzFFRFYMqRM0101U4RqYMqE vs t2jYTAKc71QbCfyTlau3GJfErwcJLmnLQS8xHWclWvE

  // require logged in user
  //  user has products=[]

  let player;
  let title = 'The Faithful: The King, The Pope, The Princess';
  let poster = '/img/trailer-cover-1b.jpg';

  export let videoId = 't2jYTAKc71QbCfyTlau3GJfErwcJLmnLQS8xHWclWvE'; // 'f8NFF01pyowaiq6H1jJxWnODzFFRFYMqRM0101U4RqYMqE';
  let cartOpened = false;
  let items = [];
  let query = {};

  let entitled = false;
  if (videoId === 't2jYTAKc71QbCfyTlau3GJfErwcJLmnLQS8xHWclWvE') {
    entitled = true; // default to entitled 
    loaded = true;
  }
  let captionsSrc = '/subtitles/faithful-trailer.mp4.vtt';
  let goals = ["W6DQW4K3","KSRPXNHI","FUAW823F","B0OYRVAC"];

  let requiredEntitlement = `video:${videoId}:preview`; // 'video:thefaithful:20210320'; // 'video:thefaithful:20210320:2000' `video:${videoId}:preview`;

  const handleDbInit = async (ev) => {
    firebase = ev.detail.firebase;
    db = firebase.firestore();

    const userProductsFn = firebase
      .functions()
      .httpsCallable('userEntitlements');
    try {
      const reply = await userProductsFn({});
      const products = reply.data;
      console.log({ products });
      products.userProducts.forEach((product) => {
        userProducts.push(`${product}`);
      });
      await checkEntitlement();
    } catch (e) {
      console.log(e);
    }

    loaded = true;
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
  };

  const checkEntitlement = async () => {
    console.log('------------------', { userProducts, requiredEntitlement });
    entitled = await productsEntitle(userProducts, requiredEntitlement);
    console.log({ entitled });
  };

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
    nextUrl = window.location.href;
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

    await checkEntitlement();
  });
</script>

<svelte:head>
  <meta name="twitter:site" content="@TheFaithful" />
  <title
    >Preview for The Faithful: The King, The Pope, The Princess – A Movie by
    Annie Berman.</title
  >
</svelte:head>

<FirebaseProvider on:init={handleDbInit} on:auth-success={handleLogin}>
  {#if loaded}
    {#if entitled}
      <VideoPlayer {poster} {videoId} {captionsSrc} {goal} />
      {#if (videoId === 't2jYTAKc71QbCfyTlau3GJfErwcJLmnLQS8xHWclWvE') && !cartOpened}
      <div class="z-40 fixed bottom-20 right-8">

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
        <span>Buy a Ticket</span>
      </button>
      </div>
      {/if}
      <Footer />
    {:else if user && user.email}
      <AccessDenied
        message={`Sorry you don't have access to this video as ${user.email}`}
      />
    {:else}
      <LoginModal {nextUrl} />
    {/if}
  {/if}

</FirebaseProvider>

<Cart bind:opened={cartOpened} bind:items />

<Processing processing={!loaded} />

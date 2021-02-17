<script>
  import TinyGesture from 'tinygesture';

  import { createEventDispatcher, onMount, setContext } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import Item from '$components/cart/Item.svelte';

  import firebase from 'firebase/app';
  import 'firebase/auth';
  import 'firebase/firestore';
  import { firebaseConfig } from '$components/config/index.js';

  const dispatch = createEventDispatcher();

  export let opened = false;
  export let items = [];

  let loaded = false;

  let saveItems = () => {
    console.log('default');
  };

  const handleAdd = (item, index) => {
    // items.push(item); // duplicate
    item.quantity = item.quantity + 1;
    items[index] = item;
    items = items;
    saveItems(items);
  };

  const handleRemove = (item, index) => {
    item.quantity = item.quantity - 1;
    items[index] = item;
    if (item.quantity <= 0) {
      items.splice(index, 1);
    }

    items = items;
    saveItems(items);
  };

  const handleItemChange = (item, index) => {
    items[index] = item;
    items = items;
    saveItems(items);
  };

  const handleCheckout = async () => {
    const stripeCheckoutSession = firebase
      .functions()
      .httpsCallable('stripeCheckoutSession');
    const reply = await stripeCheckoutSession({ items });
    try {
      const session = reply.data;
      const stripe = window.Stripe(session.stripePubKey);
      stripe.redirectToCheckout({ sessionId: session.id });
    } catch (e) {
      window.pushToast(`Error creating cart. ${e.message}`, 'alert');
    }
  };

  onMount(async () => {
    if (firebase.apps.length === 0) {
      await firebase.initializeApp(firebaseConfig);
      loaded = true;
    }

    await import('firebase/functions');
    if (window && window.location.href.indexOf('localhost') !== -1) {
      // dev mode
      firebase.functions().useEmulator('localhost', 15001);
    }

    saveItems = (i) => {
      console.log('--------------', i);
      window &&
        window.localStorage &&
        window.localStorage.setItem('cart', JSON.stringify(i));
    };

    const target = document.getElementById('cart');
    const gesture = new TinyGesture(target);
    gesture.on('swiperight', (event) => {
      opened = false;
    });
    return () => {
      gesture.destroy();
    };
  });
</script>

<div id="cart">
  {#if opened && loaded}
    <div
      class="fixed inset-0 overflow-hidden"
      class:hidden={!opened}
      transition:fade={{ duration: 250 }}
    >
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity cursor-pointer"
          on:click={() => {
            opened = !opened;
          }}
          aria-hidden="true"
        />

        <section
          class="absolute -mt-8 inset-y-0 right-0 pl-10 max-w-full flex"
          aria-labelledby="slide-over-heading"
        >
          <!--
          Slide-over panel, show/hide based on slide-over state.
  
          Entering: "transform transition ease-in-out duration-500 sm:duration-700"
            From: "translate-x-full"
            To: "translate-x-0"
          Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
            From: "translate-x-0"
            To: "translate-x-full"
        -->
          <div
            class="w-screen max-w-md"
            transition:fly={{ x: 200, duration: 700 }}
          >
            <div
              class="h-full flex flex-col py-6 bg-faithful-500 shadow-xl overflow-y-scroll"
            >
              <div class="py-2 pt-16 px-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <h2
                    id="slide-over-heading"
                    class="text-2xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-4xl"
                  >
                    My Tickets
                  </h2>

                  <div
                    class="absolute top-0 left-0 ml-2 sm:-ml-2 mt-8 pt-4 pr-2 flex sm:pr-4"
                  >
                    <button
                      on:click={() => {
                        opened = !opened;
                      }}
                      class="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <span class="sr-only">Close panel</span>
                      <!-- Heroicon name: outline/x -->
                      <svg
                        class="h-6 w-6"
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
              <div class="text-gray-700 text-xs mt-2 sm:mt-6 text-center">
                All times Eastern Time (US) EST UTC-5
              </div>

              <div class="mt-1 sm:mt-6 relative flex-1 px-4 sm:px-6">
                <div
                  class="absolute inset-0 px-4 sm:px-6 overflow-scroll-y flex-shrink"
                >
                  <div class="max-h-full" aria-hidden="true">
                    <ul class="overflow-y-scroll">
                      {#if items.length === 0}
                        <li
                          class="text-center font-bold text-gray-500 uppercase mt-12"
                        >
                          Cart Empty
                        </li>
                      {/if}
                      {#each items as item, index}
                        <li>
                          <Item
                            {item}
                            {index}
                            {handleAdd}
                            {handleRemove}
                            {handleItemChange}
                          />
                        </li>
                      {/each}
                    </ul>
                  </div>
                </div>
              </div>
              <div class="flex-shrink-0 px-4 py-5 sm:px-6">
                <div
                  class="absolute inset-x-0 bottom-0 mr-6 ml-16 mb-6 space-x-3 flex justify-end"
                >
                  <button
                    on:click={() => {
                      handleCheckout();
                    }}
                    disabled={items.length === 0}
                    class="inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-900 disabled:opacity-50"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  {/if}
</div>

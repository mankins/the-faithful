<script>
  export let audienceMode = false;
  export let isAdmin = false;

  import { onMount } from 'svelte';

import { userEntitlements } from '$lib/stores/entitlements.js';
import { heroMode } from '$lib/stores/room.js';
import { productsEntitle } from '$lib/utils/entitles.js';

let userProducts = [];
let testMode = false;

onMount(() => {
  userEntitlements.subscribe(async (value) => {
    userProducts = value;
  });
});

export let open = true;
export let change = () => {};

</script>

<div>
    {#await productsEntitle(userProducts, 'site:admin') then isAdmin}
    {#if isAdmin}

  <button
  on:click={() => {heroMode.update((curMode) => {
        if (curMode === 'theatre') {
            return 'presentation';
        } else {
            return 'theatre';
        }
      })}}
    class="bg-transparent p-1 rounded-full text-gray-600 hover:text-white focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-none"
  >
    <span class="sr-only">Toggle Audience</span>
    
    <svg
      class="h-6 w-6"
      xmlns="http://www.w3.org/2000/svg"
      fill={($heroMode === 'theatre') ? "none" : "currentColor"}
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  </button>
  {/if}
  {/await}
<button
    class="invisible bg-transparent p-1 rounded-full text-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500"
  >
    <span class="sr-only">Toggle Audience</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  </button>
</div>

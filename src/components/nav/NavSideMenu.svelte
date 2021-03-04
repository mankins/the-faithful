<script>
  //  import "$styles/nav.css";
  import { fade, fly } from 'svelte/transition';
  import NavInner from '$components/nav/NavInner.svelte';

  export let change = () => {};
  export let open = true;
</script>

{#if open}
  <div
    class="fixed inset-0 flex z-40"
    transition:fly={{ x: -200, duration: 600 }}
  >
    <div class="fixed inset-0">
      <div
        class="absolute inset-0 bg-faithful-500 opacity-30"
        aria-hidden="true"
        transition:fade={{ duration: 300 }}
        on:click={() => {
          open = !open;
          change(open);
        }}
      />
    </div>
    <div
      class="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-faithful-500 text-black"
    >
      <div class="absolute top-0 right-0 -mr-12 pt-2">
        <button
          on:click={() => {
            open = !open;
            change(open);
          }}
          class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-faithful-500"
        >
          <span class="sr-only">Close sidebar</span>
          <!-- Heroicon name: x -->
          <svg
            class="h-6 w-6 text-gray-800"
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
      <div class="flex items-center flex-shrink-0 px-4">
        <a href="/"><img class="h-10 w-auto" src="/svg/logo.svg" alt="" /></a>
      </div>
      <NavInner bind:open={open} {change} />
    </div>
    <div class="flex-shrink-0 w-14" aria-hidden="true">
      <!-- Dummy element to force sidebar to shrink to fit close icon -->
    </div>
  </div>
{/if}

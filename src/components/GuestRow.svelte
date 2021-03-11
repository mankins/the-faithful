<script>
  //   import get from 'lodash.get';

  export let guest = '';
  export let force = '';
  export let guestId = 0;
  export let handleAdd = () => {};
  export let noDescription = false;
  export let multiInput = false;

  let guestInput = '';
</script>

<div
  class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center justify-center"
>
  {#if !noDescription}
    <dt class="text-sm font-medium text-gray-500">
      {#if force}
        Guest 1 (you)
      {:else}
        Guest {guestId + 1}
      {/if}
    </dt>
  {/if}
  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
    {#if guest || force}
      {guest || force}
    {:else}
      <div class="mt-1 flex rounded-md shadow-sm">
        <div class="relative flex items-stretch flex-grow focus-within:z-10">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <!-- Heroicon name: solid/mail -->
            <svg
              class="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
              />
              <path
                d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
              />
            </svg>
          </div>
          <input
            bind:value={guestInput}
            type="email"
            id={`em-${guestId}`}
            class="block pl-10 w-full border border-transparent bg-gray-100 rounded-md px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-faithful-500"
            placeholder="Add your guest's email"
          />
        </div>
        <button
          on:click={() => {
            handleAdd(guestInput);
            if (!multiInput) {
                guest = guestInput;
            }
          }}
          class="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-faithful-500 focus:border-faithful-500"
        >
          <span>Add</span>
        </button>
      </div>
    {/if}
  </dd>
</div>

<script>
  import { onMount } from 'svelte';
  import { colorizer } from '$components/utils/colorizer.js';
  import Pill from '$components/Pill.svelte';
  import JSPretty from '$components/JSPretty.svelte';
  import SetEntitlementModal from '$components/modals/SetEntitlementModal.svelte';

  import get from 'lodash.get';

  import md5 from 'md5';

  const gravatar = (em) => {
    if (em) {
      return `https://www.gravatar.com/avatar/${md5(em.toLowerCase())}?d=mp`;
    }
    return '';
  };

  export let user = {};
  export let allowDetails = true;
  export let isLast = false;
  export let saveUser = () => {};
  let opened = false;
  let menuOpen = false;
  let entitlementsOpened = false;

  onMount(() => {});
</script>

<div class="relative pb-2">
  {#if !isLast}
    <span
      class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
      aria-hidden="true"
    />
  {/if}
  <div on:click|stopPropagation={() => {
    menuOpen = !menuOpen;
    }} class="relative flex space-x-3 cursor-pointer">
    <div>
      <span
        class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
        style={`background-color:${colorizer(user.email)}`}
      >
        {#if gravatar(get(user, 'email'))}
          <img
            class="inline-block h-8 w-8 rounded-full"
            src={gravatar(get(user, 'email'))}
            alt=""
          />
        {:else}
          <!-- Heroicon name: solid/user -->
          <svg
            class="h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clip-rule="evenodd"
            />
          </svg>
        {/if}
      </span>
    </div>
    <div
      class="min-w-0 w-full flex-2 pt-1.5 flex justify-between align-end space-x-4"
    >
      <div class="flex-1 flex flex-col justify-start align-start">
        <p class="text-sm text-gray-500">
          {get(user, 'email', '')}
        </p>
        <div class="flex flex-row items-start justify-start">
          {#each get(user, 'segments', []) as segment, i}
            <Pill type={segment}>{segment}</Pill>
          {/each}
        </div>

        {#if opened}
          <div>
            <pre
              class="tracking-tighter leading-tighter font-thin text-xs"><JSPretty obj={user} /></pre>
          </div>
        {/if}
      </div>

      <div class="flex-shrink-0 self-center flex">
        <div class="inline-block text-left items-start justify-start">
          <div>
            <button
              on:click|stopPropagation={() => {
                menuOpen = !menuOpen;
                if (menuOpen) {
                  setTimeout(() => {
                    menuOpen = false;
                  }, 5000);
                }
              }}
              type="button"
              class="-m-2 p-2 rounded-full flex items-start text-gray-400 hover:text-gray-600 focus:outline-none focus:border-opacity-0"
              id="menu-1"
              aria-expanded="false"
              aria-haspopup="true"
            >
              <span class="sr-only">Open options</span>
              <!-- Heroicon name: solid/dots-vertical -->
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                />
              </svg>
            </button>
          </div>

          {#if menuOpen}
            <div
              class="origin-top-right absolute right-8 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-1"
            >
              <div class="py-1" role="none">
                <a
                  href="#"
                  on:click={() => {
                    if (allowDetails) {
                      entitlementsOpened = !entitlementsOpened;
                    }
                  }}
                  class="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                >
                  <!-- Heroicon name: solid/star -->
                  <svg
                    class="mr-3 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                  <span>Entitlements</span>
                </a>
                <a
                  href="#"
                  on:click={() => {
                    if (allowDetails) {
                      opened = !opened;
                    }
                  }}
                  class="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                >
                  <!-- Heroicon name: information-circle -->
                  <svg
                    class="mr-3 h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Details</span>
                </a>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<SetEntitlementModal
  bind:open={entitlementsOpened}
  toTicket={' '}
  entitlements={user.entitlements || []}
  handleConfirm={async () => {
    await saveUser({entitlements: user.entitlements || []});
  }}
/>

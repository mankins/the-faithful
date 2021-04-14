<script>
  import { onMount } from 'svelte';
  import { colorizer } from '$lib/utils/colorizer.js';
  import Pill from '$lib/Pill.svelte';
  import JSPretty from '$lib/JSPretty.svelte';
  import SetEntitlementModal from '$lib/modals/SetEntitlementModal.svelte';

  import get from 'lodash.get';

  import * as md5 from 'md5';

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
  let selectedTab = '';
  let savedEntitlements = false;

  onMount(() => {});
</script>

<div class="relative pb-2 ml-2 mr-2 sm:ml-4 sm:mr-4">
  {#if false && !isLast}
    <span
      class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
      aria-hidden="true"
    />
  {/if}
    <div class="">
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
    class="relative flex space-x-3 cursor-pointer overflow-scroll"
    on:click={() => {
      menuOpen = !menuOpen;
    }}
  >
    <div
      class="min-w-0 w-full flex-2 pt-1.5 flex justify-between align-end space-x-4"
    >
      <div
        class="flex-1 flex flex-col justify-start align-start"
        on:click={() => {
          opened = !opened;
        }}
      >
        <div class="flex flex-row items-start justify-between">
          <p class="text-sm text-gray-900 mt-2">
            {get(user, 'email', '')}
          </p>
          <div class="flex flex-row items-start justify-end">
            {#each get(user, 'segments', []) as segment, i}
              <Pill type={segment}>{segment}</Pill>
            {/each}
          </div>
        </div>

        {#if opened}
          <div class="mt-6 mb-6">
            <div class="sm:hidden">
              <label for="tabs" class="sr-only">Select a tab</label>
              <select
                id="tabs"
                name="tabs"
                bind:value={selectedTab}
                on:click|stopPropagation
                class="block w-full focus:ring-faithful-500 focus:border-faithful-500 border-gray-300 rounded-md"
              >
                <option selected value="details">Details</option>
                <option value="entitlements">Entitlements</option>
              </select>
            </div>
            <div class="hidden sm:block">
              <nav
                class="relative z-0 rounded-lg shadow flex divide-x divide-gray-200"
                aria-label="Tabs"
              >
                <a
                  href="#"
                  on:click|stopPropagation={() => {
                    selectedTab = 'details';
                  }}
                  aria-current="page"
                  class="text-gray-900 rounded-l-lg group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
                >
                  <span>Details</span>
                  {#if selectedTab === 'details'}
                    <span
                      aria-hidden="true"
                      class="bg-faithful-500 absolute inset-x-0 bottom-0 h-0.5"
                    />
                  {/if}
                </a>

                <a
                  href="#"
                  on:click|stopPropagation={() => {
                    selectedTab = 'entitlements';
                  }}
                  aria-current="false"
                  class="hover:text-gray-700 rounded-r-lg group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
                  class:text-gray-500={selectedTab === 'entitlements'}
                >
                  <span>Entitlements</span>
                  {#if selectedTab === 'entitlements'}
                    <span
                      aria-hidden="true"
                      class="bg-faithful-500 absolute inset-x-0 bottom-0 h-0.5"
                    />
                  {/if}
                </a>
              </nav>
            </div>
          </div>

          {#if selectedTab === 'details'}
            <div>
              <pre
                class="tracking-tighter leading-tighter font-thin text-xs"><JSPretty obj={user} /></pre>
            </div>
          {:else if selectedTab === 'entitlements'}
            <div class="mt-4" on:click|stopPropagation={() => {}}>
              {#each user.entitlements || [] as entitlement, i}
                <p class="text-sm text-gray-500 flex flex-row items-start">
                  {#if entitlement.indexOf('site') !== 0}
                    <input
                      bind:value={entitlement}
                      class="bg-white font-mono p-4 mb-2 w-full border border-gray-50 focus:ring-transparent focus:border-transparent block sm:text-sm border-gray-300 rounded-md flex-grow"
                    />
                    <button
                      on:click|stopPropagation={() => {
                        user.entitlements.splice(i, 1);
                        user.entitlements = user.entitlements;
                      }}
                      class="text-xs bg-gray-800 text-gray-50 p-4 shadow-sm mt-1 ml-2 mr-2 rounded-md w-20"
                    >
                      Remove
                    </button>
                  {:else}
                    <pre>{entitlement}</pre>
                  {/if}
                </p>
              {/each}
              <p class="text-sm text-gray-500 mt-4">
                <button
                  class="text-xs bg-gray-800 text-gray-50 p-4 mb-2 rounded-md shadow-sm w-20"
                  on:click|stopPropagation={() => {
                    user.entitlements = user.entitlements || [];
                    user.entitlements.push('');
                    user.entitlements = user.entitlements;
                  }}>Add</button
                >
              </p>
              <div class="mt-12 mb-12">
                <button
                  class="w-full text-xs bg-faithful-500 text-black hover:bg-gray-800 hover:text-gray-50 focus:outline-none focus:border-transparent p-4 mb-2 rounded-md shadow-sm"
                  on:click|stopPropagation={async () => {
                    await saveUser({ entitlements: user.entitlements || [] });
                    savedEntitlements = true;
                    setTimeout(() => {
                      savedEntitlements = false;
                    },2000);
                  }}
                >
                  {#if savedEntitlements}
                    Saved
                  {:else}
                    Save
                  {/if}
                </button>
              </div>
            </div>
          {/if}
        {/if}
      </div>
    </div>
  </div>
</div>

<SetEntitlementModal
  bind:open={entitlementsOpened}
  toTicket={' '}
  entitlements={user.entitlements || []}
  handleConfirm={async () => {
    await saveUser({ entitlements: user.entitlements || [] });
  }}
/>

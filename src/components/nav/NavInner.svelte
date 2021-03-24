<script>
  import { onMount } from 'svelte';

  import { userEntitlements } from '$components/stores/entitlements.js';
  import { productsEntitle } from '$components/utils/entitles.js';
  import { getCookies } from '$components/utils/cookies';

  let userProducts = [];
  let testMode = false;

  onMount(() => {
    userEntitlements.subscribe(async (value) => {
      console.log('------new entitlements------', { value });
      userProducts = value;
    });

    let cookies = getCookies(document.cookie);
    if (cookies._test_mode) {
      testMode = true;
    }
  });

  export let open = true;

  export let change = () => {};
</script>

<nav class="mt-5 flex-1 flex flex-col overflow-y-auto" aria-label="Sidebar">
  <div class="px-2 space-y-1">
    <a
      on:click={() => {
        open = !open;
        change(open);
      }}
      href="/my"
      rel="external"
      class="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-black hover:text-white hover:bg-faithful-600"
      aria-current="page"
    >
      <!-- Heroicon name: home -->
      <svg
        class="mr-4 h-4 w-4"
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
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
      Lobby
    </a>
  </div>
  <div class="">
    <div class="px-2 space-y-1">
      <a
        href="/my/tickets"
        on:click={() => {
          open = !open;
          change(open);
        }}
        class="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-black hover:text-white hover:bg-faithful-600"
      >
        <!-- Heroicon name: ticket -->
        <svg
          class="mr-4 h-4 w-4"
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
        My Tickets
      </a>
      {#await productsEntitle(userProducts, 'video:thefaithful:screener') then entitled}
        {#if entitled}
          <a
            href="/my/theatre/screener"
            rel="external"
            on:click={() => {
              open = !open;
              change(open);
            }}
            class="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-black hover:text-white hover:bg-faithful-600"
          >
            <!-- Heroicon name: newspaper -->
            <svg
              class="mr-4 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            Watch Screener
          </a>
        {/if}
      {/await}
      <a
        href="/my/theatre/streaming"
        rel="external"
        on:click={() => {
          open = !open;
          change(open);
        }}
        class="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-black hover:text-white hover:bg-faithful-600"
      >
        <!-- Heroicon name: shield-check -->
        <svg
          class="mr-4 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Watch Streaming
      </a>

      <a
        href="/my/theatre/theatre"
        rel="external"
        on:click={() => {
          open = !open;
          change(open);
        }}
        class="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-black hover:text-white hover:bg-faithful-600"
      >
        <!-- Heroicon name: shield-check -->
        <svg
          class="mr-4 h-4 w-4"
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
        </svg> Live Theatre
      </a>
      {#if false}
        <a
          href="/my/chat"
          on:click={() => {
            open = !open;
            change(open);
          }}
          class="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-black hover:text-white hover:bg-faithful-600"
        >
          <!-- Heroicon name: chat-alt-2 -->
          <svg
            class="mr-4 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
            />
          </svg>
          Chat
        </a>
      {/if}
      {#await productsEntitle(userProducts, 'site:admin') then entitled}
        {#if entitled}
          <div class="pt-6">
            <h3
              class="font-serif font-extrabold tracking-tight text-lg leading-6 font-medium text-gray-900"
            >
              Admin
            </h3>

            <a
              href="/my/admin/users"
              on:click={() => {
                open = !open;
                change(open);
              }}
              class="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-black hover:text-white hover:bg-faithful-600"
            >
              <!-- Heroicon name: chat-alt-2 -->
              <svg
                class="mr-4 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg> Users
            </a>
            {#if false}
              <a
                href="/my/admin/email"
                on:click={() => {
                  open = !open;
                  change(open);
                }}
                class="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-black hover:text-white hover:bg-faithful-600"
              >
                <!-- Heroicon name: chat-alt-2 -->
                <svg
                  class="mr-4 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>Email
              </a>
            {/if}
            <a
              href="/my/admin/guest"
              on:click={() => {
                open = !open;
                change(open);
              }}
              class="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-black hover:text-white hover:bg-faithful-600"
            >
              <!-- Heroicon name: clipboard-list -->
              <svg
                class="mr-4 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>Guest List
            </a>
            <a
              href="/my/admin/screener"
              on:click={() => {
                open = !open;
                change(open);
              }}
              class="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-black hover:text-white hover:bg-faithful-600"
            >
              <svg
                class="mr-4 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              Screener
            </a>

            <a
              href="/my/admin/projector"
              on:click={() => {
                open = !open;
                change(open);
              }}
              class="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-black hover:text-white hover:bg-faithful-600"
            >
              <svg
                class="mr-4 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
                stroke="currentColor"
              >
                <path
                  d="M4.375 10c-0.345 0-0.625 0.28-0.625 0.625s0.28 0.625 0.625 0.625h1.875c0.345 0 0.625-0.28 0.625-0.625s-0.28-0.625-0.625-0.625h-1.875z"
                />
                <path
                  d="M13.125 3.75c1.881 0 3.438 1.385 3.708 3.19 1.115 0.255 1.917 1.229 1.917 2.435v2.5c0 1.408-1.092 2.5-2.5 2.5v1.25c0 0.345-0.28 0.625-0.625 0.625s-0.625-0.28-0.625-0.625v-1.25h-10v1.25c0 0.345-0.28 0.625-0.625 0.625s-0.625-0.28-0.625-0.625v-1.25c-1.408 0-2.5-1.092-2.5-2.5v-2.5c0-1.408 1.092-2.5 2.5-2.5h5.677c0.297-1.774 1.84-3.125 3.698-3.125zM13.125 5c-1.381 0-2.5 1.119-2.5 2.5s1.119 2.5 2.5 2.5 2.5-1.119 2.5-2.5c0-1.381-1.119-2.5-2.5-2.5zM16.25 13.125c0.717 0 1.25-0.533 1.25-1.25v-2.5c0-0.517-0.276-0.937-0.698-1.132-0.345 1.715-1.86 3.007-3.677 3.007-1.858 0-3.401-1.351-3.698-3.125h-5.677c-0.717 0-1.25 0.533-1.25 1.25v2.5c0 0.717 0.533 1.25 1.25 1.25h12.5z"
                />
              </svg>Projector
            </a>
            <a
              href="/my/admin/events"
              on:click={() => {
                open = !open;
                change(open);
              }}
              class="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-black hover:text-white hover:bg-faithful-600"
            >
              <!-- Heroicon name: chat-alt-2 -->
              <svg
                class="mr-4 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>Events
            </a>
            {#if false}
              <a
                href="/my/theatre/theatre"
                on:click={() => {
                  open = !open;
                  change(open);
                }}
                class="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-black hover:text-white hover:bg-faithful-600"
              >
                <!-- Heroicon name: collection -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mr-4 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>Preview
              </a>
            {/if}
            {#if true}
              <a
                href="/my/labs/theatre"
                on:click={() => {
                  open = !open;
                  change(open);
                }}
                class="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-black hover:text-white hover:bg-faithful-600"
              >
                <!-- Heroicon name: beaker -->
                <svg
                  class="mr-4 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
                Labs
              </a>
            {/if}

            <button
              on:click={() => {
                testMode = !testMode;
                if (testMode) {
                  document.cookie = '_test_mode=1; path=/;';
                } else {
                  document.cookie = '_test_mode=; path=/; max-age=-1';
                }
                alert(`Test mode is now ${testMode}`);
              }}
              class="group flex items-center mt-4 px-2 py-2 text-sm leading-6 font-medium rounded-md text-black hover:text-white "
            >
              {#if testMode}
                <div
                  class="p-1 pl-3 pr-3 bg-red-500 opacity-50 text-white rounded-full flex flex-row"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mr-2 mt-1 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>

                  In Test Mode
                </div>
              {:else}
                <span
                  class="p-1 pl-3 pr-3 bg-gray-500 opacity-50 text-white rounded-full flex flex-row"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mr-2 mt-1 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>

                  Normal Checkout</span
                >
              {/if}
            </button>
          </div>
        {/if}
      {/await}
    </div>
  </div>
</nav>

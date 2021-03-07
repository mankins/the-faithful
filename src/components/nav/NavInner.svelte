<script>
  import { onMount } from 'svelte';

  import { userEntitlements } from '$components/stores/entitlements.js';
  import { productsEntitle } from '$components/utils/entitles.js';

  let userProducts = [];

  onMount(() => {
    userEntitlements.subscribe(async (value) => {
      console.log('------new entitlements------', { value });
      userProducts = value;
    });
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

      <a
        href="/my/theatre"
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
        Watch
      </a>
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
          </div>
        {/if}
      {/await}
    </div>
  </div>
</nav>

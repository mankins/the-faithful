<script>
  import FirebaseProvider from '$components/FirebaseProvider.svelte';

  import Toast from '$components/Toast.svelte';
  import LoginModal from '$components/LoginModal.svelte';

  import AccessDenied from '$components/AccessDenied.svelte';
  import Processing from '$components/Processing.svelte';

  import { onMount } from 'svelte';

  import { getCookies } from '$components/utils/cookies';

  import { productsEntitle } from '$components/utils/entitles.js';
  import { baseProducts } from '$components/utils/auth.js';

  import { parseParams } from '$components/utils/query';

  import NavUserMenu from '$components/nav/NavUserMenu.svelte';
  import NavDesktopSidebar from '$components/nav/NavDesktopSidebar.svelte';
  import NavSideMenu from '$components/nav/NavSideMenu.svelte';
 
  let ui = {
    sideMenuOpen: false,
  };

  let loaded = false;
  let entitled = false;
  let section = 'other';
  let nextUrl = '/';

  export let user = {};
  let handleLogin = (profile) => {
    loaded = true;

    console.log({ profile });
    if (
      !profile.detail ||
      (profile.detail.user && profile.detail.user.isAnonymous)
    ) {
      console.log('not logged in.');
      entitled = false;
      return;
    }
    document.cookie = `_em=1; path=/`; // session

    entitled = true;
    user = profile.detail.user;
  };

  const handleDbInit = async (ev) => {
    console.log('init');
  };

  let handleAuthFailure = () => {
    entitled = false;
    document.cookie = `_em=; path=/; maxAge=-1`;
  };

  onMount(async () => {
    nextUrl = window.location.href;
    let cookies = getCookies(document.cookie);
    if (cookies._em) {
      entitled = true; // default to speed up
    }
    if (window.location.href.indexOf('tickets') !== -1) {
      section = 'tickets';
    }
    if (window.location.pathname === '/my') {
      section = 'dashboard';
    }
  });
</script>

<div>
  <FirebaseProvider
    on:init={handleDbInit}
    on:auth-success={handleLogin}
    on:auth-failure={handleAuthFailure}
    on:auth-success-anonymous={handleAuthFailure}
  >
    {#if loaded}
      {#if entitled}
        <div class="h-screen flex overflow-hidden bg-gray-100">
            <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
          {#if ui.sideMenuOpen}
            <NavSideMenu
              open={ui.sideMenuOpen}
              {section}
              change={(now) => {
                ui.sideMenuOpen = now;
              }}
            />
          {/if}
          <NavDesktopSidebar {section} />

          <div class="flex-1 overflow-auto focus:outline-none" tabindex="0">
            <div
              class="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 xl:border-none"
            >
              <button
                on:click={() => {
                  ui.sideMenuOpen = !ui.sideMenuOpen;
                  console.log({ ui });
                  ui = { ...ui };
                }}
                class="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 xl:hidden"
              >
                <span class="sr-only">Open sidebar</span>
                <!-- Heroicon name: menu-alt-1 -->
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
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </button>
              <!-- Search bar -->
              <div
                class="flex-1 px-4 flex justify-between sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8"
              >
                <div class="flex-1 flex invisible">
                  <form class="w-full flex md:ml-0" action="#" method="GET">
                    <label for="search_field" class="sr-only">Search</label>
                    <div
                      class="relative w-full text-gray-400 focus-within:text-gray-600"
                    >
                      <div
                        class="absolute inset-y-0 left-0 flex items-center pointer-events-none"
                        aria-hidden="true"
                      >
                        <!-- Heroicon name: search -->
                        <svg
                          class="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                      <input
                        id="search_field"
                        name="search_field"
                        class="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm"
                        placeholder="Search posts"
                        type="search"
                      />
                    </div>
                  </form>
                </div>
                <div class="ml-4 flex items-center md:ml-6">
                  <button
                    class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span class="sr-only">View notifications</span>
                    <!-- Heroicon name: bell -->
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
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </button>

                  <!-- Profile dropdown -->
                  <div class="ml-3 relative">
                    <NavUserMenu {user} />
                  </div>
                </div>
              </div>
            </div>
            <main class="flex-1 relative pb-8 z-0 overflow-y-auto h-full">
              <slot />
            </main>
          </div>
        </div>

        <slot />
      {:else if user && user.email}
        <AccessDenied
          message={`Sorry you don't have access to this as ${user.email}`}
        />
      {:else}
        <LoginModal {nextUrl} />
      {/if}
    {/if}
  </FirebaseProvider>
  <Toast />
  <Processing processing={!loaded} />
</div>

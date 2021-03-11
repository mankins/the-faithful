<script>
  import { fade } from "svelte/transition";

  import md5 from 'md5';

const gravatar = (em) => {
  return `https://www.gravatar.com/avatar/${md5(em.toLowerCase())}?d=mp`;
}

export let user = {};
export let navOpen = false;

  let ui = {
    userMenuOpen: false,
  };
</script>

{#if !user || !Object.keys(user) || !user.email || user.isAnonymous}
  <a
  href="/login"
  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
>
  Log in
</a>

{:else}
  <div class="relative inline-block text-left">
    <label
      for="ui-nav-menu"
      on:click={() => {
        ui.userMenuOpen = !ui.userMenuOpen;
        navOpen = !navOpen;
      }}>
      <div>
        <button
          class="bg-transparent rounded-full flex items-center text-gray-400 hover:opacity-80 hover:text-gray-600 focus:outline-none"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true">
          <span class="sr-only">Open user menu</span>
          {#if true || user.photoURL}
            <img
              class="inline-block h-8 w-8 rounded-full"
              src={gravatar(user.email)}
              alt="" />
          {:else}
            <svg
              class="inline-block h-5 w-5 text-gray-300 ring-2 rounded-full ring-black ring-opacity-10"
			  fill="currentColor"
              viewBox="0 0 24 24">
              <path
                d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          {/if}

                  <!-- Heroicon name: chevron-down -->
                  <svg class="hidden flex-shrink-0 ml-1 h-5 w-5 text-gray-400 lg:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
        </button>
      </div>
    </label>

    <div
      transition:fade
      class:hidden={ui.userMenuOpen === false}
      class="origin-top-right absolute hidden right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
      <div class="bg-gray-50 text-xs p-2 font-serif font-thin m-auto text-center">
        {user.email}
      </div>
      <div
        class="py-1 cursor-pointer"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu">
        <a
          rel="external"
          href="/my/"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          role="menuitem">Lobby</a>
        <a
          href="/my/settings"
          rel="external"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          role="menuitem">Settings</a>
        <a
          href="/logout"
          rel="external"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          role="menuitem">Sign out</a>
      </div>
    </div>
  </div>
{/if}

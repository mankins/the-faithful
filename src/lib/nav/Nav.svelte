<script>
  import NavUserMenu from '$lib/nav/NavUserMenu.svelte';
  import { onMount } from 'svelte';

  export let notifications = false;
  export let user = {};
  export let loggedIn = false;
  export let hideLogin = false;

  let section = 'other';
  let menuOpen = false;

  onMount(() => {
    if (window.location.href.indexOf('tickets') !== -1) {
      section = 'tickets';
    }
    if (window.location.href.indexOf('preview') !== -1) {
      section = 'watch';
    }
    if (window.location.pathname === '/') {
      section = 'home';
    }
 //   console.log({ section });
  });
</script>
<nav class="bg-white fixed w-screen">
  <div class="mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <div class="flex">
        <div class="-ml-2 mr-2 flex items-center md:hidden">
          <!-- Mobile menu button -->
          <button
            on:click={() => {
              menuOpen = !menuOpen;
            }}
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-faithful-500"
            aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>
            <!-- Icon when menu is closed. -->
            <svg
              class:block={!menuOpen}
              class:hidden={menuOpen}
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <!-- Icon when menu is open. -->
            <svg
              class:block={menuOpen}
              class:hidden={!menuOpen}
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
        <div class="flex-shrink-0 flex items-center">
          <a href="/" title="The Faithful Home">
            <img
              class="block lg:hidden h-8 w-auto"
              src="/svg/logo.svg"
              alt="The Faithful"
            />
            <img
              class="hidden lg:block h-8 w-auto"
              src="/svg/logo.svg"
              alt="The Faithful"
            />
          </a>
        </div>
        <div class="hidden md:ml-6 md:flex md:space-x-8">
          <a
            href={`/`}
            class="border-transparent text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            class:border-b-4={section === 'home'}
            class:border-faithful-500={section === 'home'}
          >
            Home
          </a>
          {#if false}
          <a
            href="/my"
            rel="external"
            class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            class:border-b-4={section === 'trailer'}
            class:border-faithful-500={section === 'trailer'}
          >
            Watch
          </a>
          {/if}
          {#if true}
          <a
            href="https://thefaithful.notion.site/thefaithful/IN-THEATERS-401ba3c135d841c9a5ce7d0f32f084b6"
            class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            class:border-b-4={section === 'tickets'}
            class:border-faithful-500={section === 'tickets'}
          >
            Tickets
          </a>
          {/if}
          {#if true}
          <a
            href="https://forms.gle/ueuL7K6uXM84z3He6"
            class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            Host a Screening
          </a>
          {/if}
          
        </div>
      </div>
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <slot />
        </div>
        <div class="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
          {#if notifications && false}
            <button
              class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500"
            >
              <span class="sr-only">View notifications</span>
              <!-- Heroicon name: outline/bell -->
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
          {/if}
          {#if true}
          <div class="ml-3 relative">
            {#if !hideLogin}
            {#if loggedIn}
                <NavUserMenu {user} />
              {:else}
              {#if false}
              <a
                  href="/login"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                >
                  Sign in
                </a>
                {/if}
              {/if}
              {/if}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <div
    class:block={menuOpen}
    class:hidden={!menuOpen}
    class="md:hidden bg-gray-50"
  >
    <div class="pt-2 pb-3 space-y-1">
      <a
        href="/"
        class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium sm:pl-5 sm:pr-6"
        class:border-faithful-500={section === 'home'}
        class:text-faithful-700={section === 'home'}
        >Home</a
      >
      {#if false}
      <a
        href="/my"
        rel="external"

        class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium sm:pl-5 sm:pr-6"
        class:border-faithful-500={section === 'watch'}
        class:text-faithful-700={section === 'watch'}
        >Watch</a
      >
      {/if}
      {#if !loggedIn && true}
      <a
        href="https://thefaithful.notion.site/thefaithful/IN-THEATERS-401ba3c135d841c9a5ce7d0f32f084b6"
        class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium sm:pl-5 sm:pr-6"
        class:border-faithful-500={section === 'tickets'}
        class:text-faithful-700={section === 'tickets'}
        >Tickets</a
      >
      <a
href="https://forms.gle/ueuL7K6uXM84z3He6"
rel="external"
class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium sm:pl-5 sm:pr-6"
>
Host a Screening
</a>

    <a
        href="/login"
        class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium sm:pl-5 sm:pr-6"
      >
        Sign in
      </a>
{:else}
<a
href="https://thefaithful.notion.site/thefaithful/IN-THEATERS-401ba3c135d841c9a5ce7d0f32f084b6"
rel="external"
class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium sm:pl-5 sm:pr-6"
>
Tickets
</a>
<a
href="https://forms.gle/ueuL7K6uXM84z3He6"
rel="external"
class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium sm:pl-5 sm:pr-6"
>
Host a Screening
</a>
<a
rel="external"
href="/my"
class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium sm:pl-5 sm:pr-6"
>Lobby</a
>
{#if loggedIn}
<a
href="/logout"
class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium sm:pl-5 sm:pr-6"
>
Sign out
</a>
{/if}

      {/if}

    </div>
  </div>
</nav>

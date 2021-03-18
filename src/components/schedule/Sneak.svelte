<script>
  import { webmon } from '$components/stores/webmon.js';

  export let signupLink = "https://coil.com/signup?ref=mankins1701";

</script>

{#if !$webmon.monetized}
<div
  class="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white mt-0"
>
  <div class="p-6">
    <h2 class="text-lg leading-6 font-medium text-gray-900">Sneak Peek</h2>
    <p class="mt-4 text-sm text-gray-500">March 18, 2021</p>
    <p class="mt-8">
      <span class="text-4xl font-extrabold text-gray-900">$5</span>
      <span class="text-base font-medium text-gray-500">/ month</span>
    </p>  
    <a
      href={signupLink}
      rel="nofollow"
      target="_blank"
      class="mt-8 block w-full bg-gray-600 border border-gray-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
      >Add Coil Pass</a
    >
  </div>
  <div class="pt-6 pb-8 px-6">
    <h3 class="text-xs font-medium text-gray-900 tracking-wide uppercase">
      What's included
    </h3>
    <ul class="mt-6 space-y-4">
      <li class="flex space-x-3">
        <!-- Heroicon name: solid/check -->
        <svg
          class="flex-shrink-0 h-5 w-5 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-sm text-gray-500 font-bold">World premiere event</span
        >
      </li>
      <li class="flex space-x-3">
        <!-- Heroicon name: solid/check -->
        <svg
          class="flex-shrink-0 h-5 w-5 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-sm text-gray-500">Live Event</span>
      </li>

      <li class="flex space-x-3">
        <!-- Heroicon name: solid/check -->
        <svg
          class="flex-shrink-0 h-5 w-5 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-sm text-gray-500">Multiple screenings per day</span>
      </li>

      <li class="flex space-x-3">
        <!-- Heroicon name: solid/check -->
        <svg
          class="flex-shrink-0 h-5 w-5 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-sm text-gray-500">Q&A with the filmmakers</span>
      </li>

      <li class="flex space-x-3">
        <!-- Heroicon name: solid/check -->
        <svg
          class="flex-shrink-0 h-5 w-5 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-sm text-gray-500"
          >Digital movie theatre experience</span
        >
      </li>
      <li class="flex space-x-3">
        <!-- Heroicon name: solid/check -->
        <svg
          class="flex-shrink-0 h-5 w-5 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-sm text-gray-500"
          >Includes access to all events listed</span
        >
      </li>

      <li class="flex space-x-3 pt-6">
        <span class="text-sm font-extrabold text-gray-500"
          >Sneak Peek brought to you by <a
          target="_blank" rel="external"
            href={signupLink}
            class="text-faithful-900 underline">Coil</a
          >. Coil created
          <a
            href="https://webmonetization.org/"
            target="_blank"
            class="text-faithful-900 underline">web monetization</a
          > to support content creators on sites like ours via a monthly subscription.</span
        >
      </li>
    </ul>
  </div>
</div>
{:else}
<div
  class="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white mt-0"
>
  <div class="p-6">
    <h2 class="text-lg leading-6 font-medium text-gray-900">Sneak Peek</h2>
    <p class="mt-4 text-sm text-gray-500">March 18, 2021</p>
    <p class="mt-8">
      <span class="text-4xl font-extrabold text-gray-900">Free</span>
      <span class="text-base font-medium text-gray-500">for you</span>
    </p>  

    <div class="flex flex-row">
    <div
      class="mt-8 block w-full bg-green-600 border border-gray-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
      >
      Your Web Monetization Pass
</div>
</div>
  </div>
  <div class="pt-6 pb-8 px-6">
    <h3 class="text-xs font-medium text-gray-900 tracking-wide uppercase">
      What's included
    </h3>
    <ul class="mt-6 space-y-4">
      <li class="flex space-x-3">
        <!-- Heroicon name: solid/check -->
        <svg
          class="flex-shrink-0 h-5 w-5 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-sm text-gray-500 font-bold">World premiere event</span
        >
      </li>
      <li class="flex space-x-3">
        <!-- Heroicon name: solid/check -->
        <svg
          class="flex-shrink-0 h-5 w-5 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-sm text-gray-500">Live Event</span>
      </li>

      <li class="flex space-x-3">
        <!-- Heroicon name: solid/check -->
        <svg
          class="flex-shrink-0 h-5 w-5 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-sm text-gray-500">Multiple screenings per day</span>
      </li>

      <li class="flex space-x-3">
        <!-- Heroicon name: solid/check -->
        <svg
          class="flex-shrink-0 h-5 w-5 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-sm text-gray-500">Q&A with the filmmakers</span>
      </li>

      <li class="flex space-x-3">
        <!-- Heroicon name: solid/check -->
        <svg
          class="flex-shrink-0 h-5 w-5 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-sm text-gray-500"
          >Digital movie theatre experience</span
        >
      </li>
      <li class="flex space-x-3">
        <!-- Heroicon name: solid/check -->
        <svg
          class="flex-shrink-0 h-5 w-5 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-sm text-gray-500"
          >Includes access to all events listed</span
        >
      </li>

      <li class="flex space-x-3 pt-6">
<div class="rounded-md bg-gray-50 p-4">
  <div class="flex">
    <div class="flex-shrink-0">
      <!-- Heroicon name: solid/information-circle -->
      <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="ml-3 flex-1 md:flex md:justify-between">
      <p class="text-sm text-gray-700">
Brought to you by <a
href={signupLink}
class="text-faithful-900 underline">Coil</a>.

Coil created
          <a
            href="https://webmonetization.org/"
            class="text-faithful-900 underline">web monetization</a
          > to support content creators on sites like ours via a monthly subscription.
</p>
      <p class="mt-3 text-sm md:mt-0 md:ml-6">
        <a href={signupLink} class="whitespace-nowrap font-medium text-gray-700 hover:text-gray-600">Learn more <span aria-hidden="true">&rarr;</span></a>
      </p>
    </div>
  </div>
</div>

      </li>
    </ul>
  </div>
</div>
{/if}
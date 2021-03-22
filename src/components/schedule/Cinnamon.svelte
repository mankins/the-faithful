<script>
  import { webmon } from '$components/stores/webmon.js';

  export let signupLink = 'https://coil.com/signup?ref=mankins1701';

  let cinnamonLink =
    'https://cinnamon.video/watch?v=542589753027987412&utm_source=thefaithful';
</script>

<div
  class="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white mt-0"
>
  <div class="p-6">
    <h2 class="text-lg leading-6 font-medium text-gray-900">
      Web Subscription
    </h2>
    <p class="mt-4 text-sm text-gray-500">
      <a href={signupLink} class="underline">Coil</a> &amp;
      <a
        href="https://www.cinnamon.video/?utm_source=thefaithful"
        class="underline">Cinnamon.video</a
      >
    </p>
    {#if true && !($webmon.monetized || $webmon.state === 'pending') }
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
    {:else}
      <p class="mt-8">
        <span class="text-4xl font-extrabold text-gray-900">Free</span>
        <span class="text-base font-medium text-gray-500">for you</span>
      </p>

      <div class="flex flex-row">
        <a
          href={cinnamonLink}
          rel="nofollow"
          target="_blank"
          class="mt-8 block w-full bg-green-600 border border-gray-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900 flex flex-row pl-4 pr-4 justify-center items-center cursor-pointer"
        >
          <svg
            class="h-6 w-6 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            ><path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M.539 15.703A12.018 12.018 0 0011.969 24c5.207 0 9.822-3.35 11.431-8.297l-4.915-1.596a6.85 6.85 0 01-6.516 4.73 6.85 6.85 0 01-6.515-4.73L.539 15.703zm4.576-3.501c.006.233.024.468.054.704l-5.12.358L0 12.56l5.115-.358zm.163-1.758c-.052.23-.091.461-.12.697l-5.042-.889.122-.695 5.04.887zm.619-1.691c-.11.208-.209.422-.296.641L.967 7.236l.299-.64 4.63 2.157zm1.037-1.475c-.16.173-.31.354-.452.543L2.571 4.542l.454-.541 3.909 3.277zm1.382-1.189a6.89 6.89 0 00-.577.407L4.815 2.324l.579-.405 2.922 4.17zm1.644-.722c-.228.07-.45.15-.665.242L7.553.829l.665-.242 1.741 4.78zm1.78-.3a7.05 7.05 0 00-.704.062L10.592.062 11.296 0l.444 5.067zm1.102.049l.884-5.01.697.123-.885 5.01a6.884 6.884 0 00-.696-.123zm1.746.444L16.742.945l.64.299-2.154 4.616a6.891 6.891 0 00-.64-.302zm1.564.903l3.28-3.905.542.454-3.282 3.907a6.975 6.975 0 00-.54-.456zm1.347 1.377l4.236-2.854.396.586-4.239 2.856a6.887 6.887 0 00-.393-.587z"
              fill="currentColor"
            /></svg
          >
          Watch now
        </a>
      </div>
    {/if}
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
        <span class="text-sm text-gray-500"
          >Streaming, watch at your leisure on Cinnamon.video</span
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
          >Access to other web monetized content around the web</span
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
          >Exclusive content at Cinnamon.video</span
        >
      </li>

      <li class="flex space-x-3 pt-6">
        <span class="text-xs font-extrabold text-gray-500"
          ><a
            target="_blank"
            rel="external"
            href={signupLink}
            class="text-faithful-900 underline">Coil</a
          >
          created
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

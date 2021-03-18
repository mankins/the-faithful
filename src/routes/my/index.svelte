<script>
  import Duration from 'duration';
  import { onMount } from 'svelte';

  let hours = 0;
  let min = 0;
  let sec = 0;
  let days = 0;
  let now = Date.now();
  let nextShow = new Date('2021-03-18T18:00:00.000Z');
  let doorsOpen = new Date('2021-03-18T17:00:00.000Z');

  let signupLink = "https://coil.com/signup?ref=mankins1701";

  const tick = () => {
    now = new Date();

    const duration = new Duration(
      now,
      nextShow,
    );
    days = duration.day;
    hours = duration.hour;
    min = duration.minute;
    sec = duration.second;
  };

  onMount(() => {
    tick();
    const ticker = setInterval(() => {
      tick();
    }, 1000);

    return () => {
      clearInterval(ticker);
    };
  });
</script>

<div class="m-6">
  <div class="pb-5 border-b border-gray-200">
    <h3
      class="pt-2 md:pt-4 text-3xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-5xl"
    >
      Lobby
    </h3>
  </div>
  {#if now < doorsOpen}
  <div class="mb-12">
    <h3 class="text-lg leading-6 font-medium text-gray-900 mt-3">
      Countdown until the next show
      <span class="float-right inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
        Coming soon
      </span>

    </h3>
    <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <dt class="text-sm font-medium text-gray-500 truncate">Days</dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">
            {days}
          </dd>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <dt class="text-sm font-medium text-gray-500 truncate">Hours</dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">
            {hours}
          </dd>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <dt class="text-sm font-medium text-gray-500 truncate">Minutes</dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">
            {min}
          </dd>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <dt class="text-sm font-medium text-gray-500 truncate">Seconds</dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">
            {sec}
          </dd>
        </div>
      </div>
    </dl>
  </div>
  {:else}
<div class="mb-12">
  <div>
    <img class="h-32 w-full object-cover lg:h-48" src="/img/email-footer-3.jpg" alt="">
  </div>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
      <div class="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
        <div class="-mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
          <button on:click={() => {window.location.href='https://us02web.zoom.us/j/81826435734?pwd=cXh5d05tbFdCc0FIb09CREpxbnRodz09'}} type="button" class="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
            <svg class="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
            </svg>
            <span>Q & A - Zoom</span>
          </button>
          <button type="button"  on:click={() => {window.location.href='/my/theatre/theatre'}}  class="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
            <svg class="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>            <span>Watch - Theatre</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="bg-white shadow sm:rounded-lg mb-12">
  <div class="px-4 py-5 sm:p-6">
    <h3 class="text-lg leading-6 font-medium text-gray-900">
      Welcome to today's special <a class="underline text-faithful-900" href={signupLink} rel="external" target="_blank">Coil</a> screening of The Faithful.
      {#if now < nextShow}
      <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        Starts in {min} minute{#if min !== 1}s{/if}
      </span>
      {:else}
      <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
        Now Playing
      </span>
      {/if}
    </h3>
    <div class="mt-2 max-w-xl text-sm text-gray-500">
      <p>
      </p>
    </div>
    <div class="mt-3 text-sm">
      <a href="https://us02web.zoom.us/j/81826435734?pwd=cXh5d05tbFdCc0FIb09CREpxbnRodz09" rel="ext" target="_blank" class="font-medium text-faithful-800 hover:text-faithful-500"> 
        Join the filmmaker for a live introduction.
        <span aria-hidden="true">&rarr;</span></a>
    </div>
  </div>
</div>


  {/if}

  <div class="bg-white overflow-hidden shadow sm:rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <img
        src="/img/the-faithful-poster-2.jpg"
        alt="The Faithful Poster"
        class="w-full"
      />
    </div>
  </div>
</div>

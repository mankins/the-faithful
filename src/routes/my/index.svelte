<script>
  import Duration from 'duration';
  import { onMount } from 'svelte';

  let hours = 0;
  let min = 0;
  let sec = 0;
  let days = 0;
  let now = Date.now();
  let nextShow = new Date('2021-03-18T18:00:00.000Z');

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
  {#if now < nextShow}
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
<div class="bg-white shadow sm:rounded-lg mb-12">
  <div class="px-4 py-5 sm:p-6">
    <h3 class="text-lg leading-6 font-medium text-gray-900">
      Welcome to the Faithful screening
      <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
        Now Playing
      </span>
    </h3>
    <div class="mt-2 max-w-xl text-sm text-gray-500">
      <p>
        Once you watch the show, be sure to stick around for our Q&A. 
        More information is included in the theatre.
      </p>
    </div>
    <div class="mt-3 text-sm">
      <a href="/my/theatre" class="font-medium text-faithful-800 hover:text-faithful-500"> 
        Watch the film in the theatre
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

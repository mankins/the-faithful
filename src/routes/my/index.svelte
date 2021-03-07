<script>
  import Duration from 'duration';
  import { onMount } from 'svelte';

  let hours = 0;
  let min = 0;
  let sec = 0;
  let days = 0;

  const tick = () => {
    const duration = new Duration(
      new Date(),
      new Date('2021-03-18T14:00:00.000Z')
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
    console.log(`Nav to-----${window.location.href}`);

    return () => {
      clearInterval(ticker);
    };
  });
</script>

<div class="m-6">
  <div class="pb-5 border-b border-gray-200">
    <h3
      class="pt-12 md:pt-24 text-3xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-5xl"
    >
      Lobby
    </h3>
  </div>
  <div class="mb-12">
    <h3 class="text-lg leading-6 font-medium text-gray-900">
      Countdown until the first show
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
 
<div class="bg-white overflow-hidden shadow sm:rounded-lg">
    <div class="px-4 py-5 sm:p-6">
        <img src="/img/the-faithful-poster-2.jpg" alt="The Faithful Poster" class="w-full" />
    </div>
  </div>
  
</div>

<script>
  import { onMount } from 'svelte';
  import Ago from '$components/Ago.svelte';
  import EventFlair from '$components/events/EventFlair.svelte';

  import get from 'lodash.get';

  import md5 from 'md5';

  const gravatar = (em) => {
    return `https://www.gravatar.com/avatar/${md5(em.toLowerCase())}?d=mp`;
  };

  export let ev = {};
  export let allowDetails = true;
  let opened = false;

  onMount(() => {});
</script>

<div class="relative flex space-x-3 cursor-pointer" on:click={() => { if (allowDetails) { opened = !opened } }}>
  <div>
    <span
      class="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
    >
      {#if gravatar(get(ev, '_email'))}
        <img
          class="inline-block h-8 w-8 rounded-full"
          src={gravatar(get(ev, '_email'))}
          alt=""
        />
      {:else}
        <!-- Heroicon name: solid/user -->
        <svg
          class="h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clip-rule="evenodd"
          />
        </svg>
      {/if}
    </span>
  </div>
  <div class="min-w-0 flex-1 pt-1.5 flex justify-between align-end space-x-4">
    <div class="flex flex-row justify-end pt-2 pb-2 w-full">
        <div class="flex-1 flex flex-col justify-start align-start mr-12">    
    <p class="text-sm text-gray-500">
        {get(ev, '_email', '')}
    </p>        
      <h3 class="text-sm font-medium font-mono">
        {#if get(ev, 'payload.event', '') !== ''}
        {#if get(ev, 'payload.event') === 'clicked'}
        <a class="underline" href={get(ev, 'payload.url', '#')} title={get(ev, 'payload.url', '#')} rel="external">
            {get(ev, 'payload.event', '')}
        </a>
        {:else}
          {get(ev, 'payload.event', '')}
          {/if}
        {:else}
          {ev._topic}
        {/if}
      </h3>
      </div>
      <EventFlair {ev} />
    </div>
    {#if opened}
    <div><pre class="text-xs">{JSON.stringify(ev,null,2)}</pre></div>
    {/if}
    <div class="text-right text-sm whitespace-nowrap text-gray-500 pt-2">
      <p class="text-sm text-gray-500"><Ago at={ev._ts} /></p>
    </div>
  </div>
</div>

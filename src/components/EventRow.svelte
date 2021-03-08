<script>
  import { onMount } from 'svelte';
  import Ago from '$components/Ago.svelte';

  import EmailEventRow from '$components/events/EmailEventRow.svelte';

  import get from 'lodash.get';

  export let ev = {};

  onMount(() => {});
</script>

<div class="relative pb-2">
  <span
    class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
    aria-hidden="true"
  />
  {#if (ev._topic === 'email.events') || (ev._topic === 'email.sent')}
    <EmailEventRow {ev} />
  {:else}
    <div class="relative flex space-x-3">
      <div>
        <span
          class="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
        />
      </div>
      <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
        <div>
          <h3 class="text-sm font-medium">{ev._topic}</h3>
        </div>
        <div class="text-right text-sm whitespace-nowrap text-gray-500">
          <p class="text-sm text-gray-500"><Ago at={ev._ts} /></p>
        </div>
      </div>
    </div>
  {/if}
</div>

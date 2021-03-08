<script>
  import { onMount } from 'svelte';
  // import Ago from '$components/Ago.svelte';

  import EmailEventRow from '$components/events/EmailEventRow.svelte';
  import DefaultEventRow from '$components/events/DefaultEventRow.svelte';
  
  // import get from 'lodash.get';

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
  <DefaultEventRow {ev} />
  {/if}
</div>

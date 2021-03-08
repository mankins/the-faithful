<script>
  import { onMount } from 'svelte';
  // import Ago from '$components/Ago.svelte';

  import EmailEventRow from '$components/events/EmailEventRow.svelte';
  import DefaultEventRow from '$components/events/DefaultEventRow.svelte';
  import WebEventRow from '$components/events/WebEventRow.svelte';

  // import get from 'lodash.get';

  export let ev = {};
  export let isLast = false;

  onMount(() => {});
</script>

<div class="relative pb-2">
  {#if !isLast}
  <span
    class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
    aria-hidden="true"
  />
  {/if}
  {#if ev._topic === 'email.events' || ev._topic === 'email.sent'}
    <EmailEventRow {ev} />
  {:else if ev._topic === 'events' && ev._source === 'web'}
    <WebEventRow {ev} />
  {:else}
    <DefaultEventRow {ev} />
  {/if}
</div>

<script>
  import timeAgo from 'time-ago';

  import { onMount } from 'svelte';

  export let at = new Date();

  let loaded = false;

  onMount(() => {
    loaded = true;
  });
</script>

{#if loaded}
  <time datetime={at} title={at}>{timeAgo.ago(new Date(at))}</time>
{:else}
  -
{/if}

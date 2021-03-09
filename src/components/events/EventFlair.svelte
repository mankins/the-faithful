<script>
  import { onMount } from 'svelte';
  import Pill from '$components/Pill.svelte';

  import get from 'lodash.get';

  export let ev = {};

  onMount(() => {});
</script>

<div class="flex flex-row justify-end">
  {#if get(ev, 'payload.type', '') === 'coil'}
    <Pill type="coil">Coil</Pill>
  {/if}
  {#if (get(ev, 'payload.livemode') == false)}
    <Pill type="test-mode">Test Mode</Pill>
  {/if}
  {#if (get(ev, 'payload.payload.livemode') == false)}
    <Pill type="test-mode">Test Mode</Pill>
  {/if}
  {#if (get(ev, 'payload.payload.livemode') == "false")}
    <Pill type="test-mode">Test Mode</Pill>
  {/if}
  {#if (get(ev, '_geo.country'))}
  <Pill type="geo">
    {get(ev, '_geo.country')}
  </Pill>
  {/if}
  {#if (get(ev, 'payload.geolocation.country'))}
  <Pill type="geo">
    {get(ev, 'payload.geolocation.country')}
  </Pill>
  {/if}
  {#if (get(ev, 'payload.client-info.client-name'))}
  <Pill type="ua">
    {get(ev, 'payload.client-info.client-name')}
  </Pill>
  {/if}
  {#if (get(ev, '_ref.hostname') === 'localhost')}
  <Pill type="is-dev">
    Dev
  </Pill>
  {/if}
  {#if (get(ev, 'payload.message.headers.subject', ''))}
  <Pill type="subject">
      {(get(ev, 'payload.message.headers.subject', '')).substring(0,24)}
  </Pill>
  {/if}
  {#if (get(ev, 'payload.payload.subject', ''))}
  <Pill type="subject">
    {(get(ev, 'payload.payload.subject', '')).substring(0,24)}
  </Pill>
  {/if}
  

</div>

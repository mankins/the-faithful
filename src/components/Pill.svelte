<script>
  import { onMount } from 'svelte';
  import { colorizer } from '$components/utils/colorizer.js';

  export let type = '';
  export let handleClick = () => {}

  onMount(() => {});
</script>

<span
on:click={() => { handleClick() }}
  class="rounded-full mr-2 pl-3 pr-3 pt-1 pb-1 text-gray-100 text-xs font-bold h-6 font-mono tracking-tighter font-thin uppercase flex flex-row items-center cursor-pointer border-2 border-white overflow-ellipsis flex-nowrap whitespace-nowrap"
  style={`background-color:${colorizer(type)}`}
>
  <slot />
</span>

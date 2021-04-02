<script>
  import get from 'lodash.get';
  import JSPretty from '$components/JSPretty.svelte';

  export let room = {};
  export let roomId = '';

console.log({room});
</script>

<a href={`/my/admin/rooms/${room.id}`} class="block hover:bg-gray-50">

  <div class="flex items-center px-4 py-4 sm:px-6">
    <div class="min-w-0 flex-1 flex items-center">
      <div class="flex-shrink-0">
        <p class="text-sm font-medium text-gray-900 truncate capitalize">
          {room.id}
        </p>
        {#if false}
        <pre class="text-xs">        <JSPretty obj={room} /> </pre>
        {/if}
      </div>
      <div class="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
        <div>          
              <p class="text-sm font-medium text-gray-500 truncate capitalize">
{get(room,'type','')}                
              </p>
        </div>
      </div>
    </div>
    <div>
      <!-- Heroicon name: solid/chevron-right -->
      <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </div>
  </div>
</a>


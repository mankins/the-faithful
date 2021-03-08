<script>
  import { onMount } from 'svelte';
  import { colorizer } from '$components/utils/colorizer.js';

  import get from 'lodash.get';

  import md5 from 'md5';

  const gravatar = (em) => {
    if (em) {
      return `https://www.gravatar.com/avatar/${md5(em.toLowerCase())}?d=mp`;
    }
    return '';
  };

  export let user = {};
  export let allowDetails = true;
  export let isLast = false;
  let opened = false;

  onMount(() => {});
</script>

<div class="relative pb-2">
  {#if !isLast}
  <span
    class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
    aria-hidden="true"
  />
  {/if}
  <div
    class="relative flex space-x-3 cursor-pointer"
    on:click={() => {
      if (allowDetails) {
        opened = !opened;
      }
    }}
  >
    <div>
      <span
        class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
        style={`background-color:${colorizer(user.email)}`}
      >
        {#if gravatar(get(user, 'email'))}
          <img
            class="inline-block h-8 w-8 rounded-full"
            src={gravatar(get(user, 'email'))}
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
      <div class="flex-1 flex flex-col justify-start align-start">
        <p class="text-sm text-gray-500">
          {get(user, 'email', '')}
        </p>
        <h3 class="text-sm font-medium">
          {user.email}
        </h3>
      </div>
      {#if opened}
        <div><pre class="text-xs">{JSON.stringify(user,null,2)}</pre></div>
      {/if}
    </div>
  </div>
</div>

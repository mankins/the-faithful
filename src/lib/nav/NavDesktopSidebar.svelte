<script>
  // import '$lib/styles/nav.css';
  import NavInner from '$lib/nav/NavInner.svelte';

  let ui = {};

</script>

<div class="hidden xl:flex xl:flex-shrink-0">
  <div class="flex flex-col w-48">
    <div
      class="flex flex-col flex-grow bg-faithful-500 pt-5 pb-4 overflow-y-auto"
    >
      <div class="flex items-center flex-shrink-0 px-4">
        <a rel="external" href="/"><img class="h-10 w-auto" src="/svg/logo.svg" alt="" /></a>
      </div>
      <NavInner />
    </div>
  </div>
</div>

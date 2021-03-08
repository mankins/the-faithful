<script>
  import { onMount } from 'svelte';
  import VideoPlayer from '$components/VideoPlayer.svelte';

  onMount(() => {
  });
</script>
<div class="m-6">
  <section class="overflow-hidden sm:overflow-auto">
    <VideoPlayer
      poster="/img/trailer-cover-1b.jpg"
      videoId="cYCe7XwFeEoy8hHoJ7OzbNbvynwUhkwd01Ep00JoueMwA"
      captionsSrc=""
      autoplay={true}
      loop={true}
      goals={[]}
    />
  </section>

  {#if false}
<button on:click={() => {window.player.fullscreen.toggle();}}>
  Toggle Full Screen
</button>
{/if}

  <div class="pb-5 border-b border-gray-200">
    <h3
      class="pt-12 md:pt-24 text-3xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-5xl"
    >
      Theatre
    </h3>
  </div>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg m-auto p-12">
    Check back regularly as we ready the cinema.
  </div>


  
</div>

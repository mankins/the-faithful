<script>
import { onMount } from 'svelte';
import '$styles/plyr.css';
import Hls from 'hls.js';

  let player;
  export let title = 'The Faithful: The King, The Pope, The Princess';
  export let poster = '/img/trailer-cover-1b.jpg';

  export let videoId = 't2jYTAKc71QbCfyTlau3GJfErwcJLmnLQS8xHWclWvE'; // 'f8NFF01pyowaiq6H1jJxWnODzFFRFYMqRM0101U4RqYMqE';
  export let captionsSrc = '/subtitles/faithful-trailer.mp4.vtt';

  let previewThumbnails = {
    enabled: true,
    src: `https://image.mux.com/${videoId}/storyboard.vtt`,
  };

  onMount(async () => {
    const Plyr = await import('plyr');
    player = new Plyr.default('#video-player', {
      debug: false,
      keyboard: { focused: true, global: true },
      ratio: '16:9',
      title,
      previewThumbnails,
    });
    window.player = window.player || player; // debugging

    const video = document.querySelector('video');

    const videoSrc = `https://stream.mux.com/${videoId}.m3u8`;

    // Let native HLS support handle it if possible
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      console.log('native');
      video.src = videoSrc;
    } else if (Hls.isSupported()) {
      console.log('hls');
      var hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
    }
  });
</script>

<svelte:head>
</svelte:head>

<div class="flex flex-col h-screen bg-black">
  <!-- svelte-ignore a11y-media-has-caption -->
  <video controls id="video-player" {poster}>
    {#if captionsSrc}
      <track
        kind="captions"
        label="English"
        src={captionsSrc}
        srclang="en"
        default
      />
    {/if}
  </video>
</div>

<style>
  :root {
    --plyr-color-main: #cc2027;
  }
</style>

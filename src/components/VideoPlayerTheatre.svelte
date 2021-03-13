<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import '$styles/plyr.css';
  import Hls from 'hls.js';

  let player;
  export let title = 'The Faithful: The King, The Pope, The Princess';
  export let poster = '/img/trailer-cover-1b.jpg';

  export let videoId = ''; // pJ8ZLyX6GQy2gR6K72Np3iPhGJU00yYwMP01K3elY02NOQ 'f8NFF01pyowaiq6H1jJxWnODzFFRFYMqRM0101U4RqYMqE';
  export let captionsSrc = ''; // /subtitles/faithful-trailer.mp4.vtt

  export let autoplay = false;
  export let loop = false;
  export let videoPlayerId = "video-player";
  export let start = false;

  const dispatch = createEventDispatcher();

  const runSetup = async () => {
    if (!videoId) {
      console.log('no video id yet');
      return;
    }
    console.log('setting up', videoId);
    let previewThumbnails = {
    enabled: true,
    src: `https://image.mux.com/${videoId}/storyboard.vtt`,
  };
    const Plyr = await import('plyr');
    let cfg = {
      debug: false,
      autoplay,
      keyboard: { focused: true, global: true },
      ratio: '16:9',
      title,
      previewThumbnails,
    };
    if (loop) {
      cfg.media = cfg.media || {};
      cfg.media.loop = loop;
      cfg.click = false;
    }
    player = new Plyr.default(`#${videoPlayerId}`, cfg);
    // window.player = window.player || player; // debugging
    dispatch('newvideoplayer', { player });

    // player.on('play', () => {
    // });

 
    // player.on('timeupdate', () => {
    //   const media = player.media;
    //   if (!media) {
    //     return;
    //   }

      // const duration = media.duration || 1;
      // const current = media.currentTime;
      // const percent = current / duration;
    // });

    const video = document.querySelector(`#${videoPlayerId}`);

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
  };

  $: videoPlayerId && start && runSetup(); 

  onMount(async () => {
  });
</script>

<svelte:head />

<div class="flex flex-col max-h-screen bg-black">
  <!-- svelte-ignore a11y-media-has-caption -->
  <video controls id={videoPlayerId} {poster} {loop}>
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

<script>
  import { onMount } from 'svelte';
  import '$styles/plyr.css';
  import Hls from 'hls.js';

  import { fireGoal } from '$components/utils/analytics';

  let player;
  export let title = 'The Faithful: The King, The Pope, The Princess';
  export let poster = '/img/trailer-cover-1b.jpg';

  export let videoId = 'pJ8ZLyX6GQy2gR6K72Np3iPhGJU00yYwMP01K3elY02NOQ'; // 'f8NFF01pyowaiq6H1jJxWnODzFFRFYMqRM0101U4RqYMqE';
  export let captionsSrc = '/subtitles/faithful-trailer.mp4.vtt';

  export let goal;
  export let goals = [];
  export let autoplay = false;
  export let loop = false;

  if (goal && (goals.length === 0)) {
    goals.push(goal); // fires at 0
  }

  let previewThumbnails = {
    enabled: true,
    src: `https://image.mux.com/${videoId}/storyboard.vtt`,
  };

  onMount(async () => {
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
    player = new Plyr.default('#video-player', cfg);
    window.player = window.player || player; // debugging

    // player.on('play', () => {
    // });

    let nextGoal = 0;

    let mostWatched = 0;
    player.on('timeupdate', () => {
      const media = player.media;
      if (!media) {
        return;
      }

      const duration = media.duration || 1;
      const current = media.currentTime;
      const percent = current / duration;

      if (percent >= nextGoal / goals.length) {
        fireGoal(goals[nextGoal]);
        nextGoal = nextGoal + 1;
        return true;
      }
    });

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

<svelte:head />

<div class="flex flex-col max-h-screen bg-black">
  <!-- svelte-ignore a11y-media-has-caption -->
  <video controls id="video-player" {poster} {loop}>
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

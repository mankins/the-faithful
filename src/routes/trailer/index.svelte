<script>
  import Toast from '$components/Toast.svelte';
  import firebase from 'firebase/app';
  import 'firebase/auth';
  import 'firebase/firestore';

  import { onMount } from 'svelte';

  let player;
  let title = 'The Faithful: The King, The Pope, The Princess';
  let poster = '/img/trailer-cover-1b.jpg';

  const videoId = 't2jYTAKc71QbCfyTlau3GJfErwcJLmnLQS8xHWclWvE'; // 'f8NFF01pyowaiq6H1jJxWnODzFFRFYMqRM0101U4RqYMqE';

let previewThumbnails = {
    enabled: true,
    src: `https://image.mux.com/${videoId}/storyboard.vtt`
};

  onMount(async () => {
    player = new Plyr('#video-player', {
      debug: false,
      keyboard: { focused: true, global: true },
      ratio: '16:9',
      title,
     previewThumbnails
    });
    window.player = player; // debugging

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

  <script
    src="https://cdn.plyr.io/3.6.4/plyr.js"></script>
    <link rel="stylesheet"
    href="https://cdn.plyr.io/3.6.4/plyr.css"
  />
  <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
  <meta name="twitter:site" content="@TheFaithful" />
  <title
    >Trailer for The Faithful: The King, The Pope, The Princess – A Movie by
    Annie Berman.</title
  >
</svelte:head>
<div class="flex flex-col h-screen bg-black">
  <video controls id="video-player" {poster}>
    <track
      kind="captions"
      label="English captions"
      src="/subtitles/faithful-trailer.mp4.vtt"
      srclang="en"
      default
    />
  </video>
</div>

<style>
  :root {
    --plyr-color-main: #cc2027;
  }
</style>

<script>
  import Toast from '$components/Toast.svelte';
  import firebase from 'firebase/app';
  import 'firebase/auth';
  import 'firebase/firestore';

  import { onMount } from 'svelte';

  let player;
  let title = 'The Faithful: The King, The Pope, The Princess';
  let poster = '/img/trailer-cover-1b.jpg';

  // https://storage.googleapis.com/video.the-faithful.com/output/trailer-2021-02-10/manifest.m3u8

  onMount(async () => {
    player = new Plyr('#video-player', {
      debug: false,
      keyboard: { focused: true, global: true },
      ratio: '16:9',
      title,
    });
    window.player = player; // debugging

    const video = document.querySelector('video');

    var videoSrc =
      'https://storage.googleapis.com/video.the-faithful.com/output/trailer-2021-02-10/manifest.m3u8?abc';
    if (true && Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      console.log('hls');
    } else {
      //         src="https://storage.googleapis.com/video.the-faithful.com/output/trailer-2021-02-10/hd.mp4"
      console.log('not hls');
      player.source = {
        type: 'video',
        title,
        sources: [
          {
            src:
              'https://storage.googleapis.com/video.the-faithful.com/output/trailer-2021-02-10/sd.mp4',
            type: 'video/mp4',
            size: 720,
          },
          {
            src:
              'https://storage.googleapis.com/video.the-faithful.com/output/trailer-2021-02-10/hd.mp4',
            type: 'video/mp4',
            size: 1080,
          },
        ],
        poster,
        //   previewThumbnails: {
        //     src: '/path/to/thumbnails.vtt',
        //   },
        //   tracks: [
        //     {
        //       kind: 'captions',
        //       label: 'English',
        //       srclang: 'en',
        //       src: '/path/to/captions.en.vtt',
        //       default: true,
        //     },
        //     {
        //       kind: 'captions',
        //       label: 'French',
        //       srclang: 'fr',
        //       src: '/path/to/captions.fr.vtt',
        //     },
        //   ],
      };
    }
  });
</script>

<svelte:head
  ><script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script><script
    src="https://cdn.plyr.io/3.6.4/plyr.polyfilled.js"></script><link
    rel="stylesheet"
    href="https://cdn.plyr.io/3.6.4/plyr.css"
  />
  <meta name="twitter:card" content="player" />
  <meta name="twitter:site" content="@TheFaithful">
  <meta name="twitter:player" content="https://www.thefaithful.com/trailer" />
  <meta name="twitter:player:width" content="320" />
  <meta name="twitter:player:height" content="180" />
  <title
    >Trailer for The Faithful: The King, The Pope, The Princess – A Movie by Annie Berman.</title>

</svelte:head>
<div class="w-7/8">
  <video playsinline controls id="video-player" {poster}>
    <track kind="captions" label="English captions" src="/subtitles/faithful-trailer.mp4.vtt" srclang="en" default />
</video>
</div>

<style>
  :root {
    --plyr-color-main: #cc2027;
  }
</style>

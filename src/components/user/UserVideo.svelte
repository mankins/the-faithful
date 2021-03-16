<script>
  import { onMount } from 'svelte';
  import get from 'lodash.get';

  export let stream;
  export let videoId;

  let good;
  let state;
  let loaded = false;
  let failed = false;

  //   function showVideo() {
  //     let width = window.innerWidth;
  //     let video_container = document.getElementById('video-container');
  //     video_container.classList.remove('no-video');
  //     if (width <= 768)
  //       document.getElementById('collapse-video').style.display = 'block';
  //   }

  onMount(() => {});

  const setupMedia = () => {
    // alert(videoId + ':' + get(stream, 'userdata.setupMediaRequested'));
    state = get(stream, 'pc.iceConnectionState');
    good = state === 'connected' || state === 'completed';

    // console.log({ good, localId: stream.localId });
    if (good) {
      if (stream.userdata.play) {
        if (media instanceof HTMLMediaElement)
          media.play().catch((e) => {
            console.error(e);
            // TODO: toast
          });
        delete stream.userdata.play;
        failed = false;
      }
    } else {
      failed = true;
    }
    loaded = true;
  };
  let video;

  $: if (stream && video && video.srcObject !== stream.stream) {
    video.srcObject = stream.stream;
  }

  $: get(stream, 'userdata.setupMediaRequested') && setupMedia();
</script>

<div class="relative" style="padding-top: 56.25%">
  {#if stream}
    <!-- svelte-ignore a11y-media-has-caption -->
    <video class="rounded-md absolute inset-0 w-full h-full" autoplay={true} playsinline={true} bind:this={video} id={`vid-${videoId}`} />
  {/if}
</div>

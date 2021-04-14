<script>
  import { onMount, onDestroy } from 'svelte';
  import get from 'lodash.get';

  export let stream;
  export let videoId;
  export let muted = true;

  let good;
  let state;
  let loaded = false;
  let failed = false;
  let video;

  onMount(() => {});
  onDestroy(() => {
    // console.log('destroyign video', videoId);
    // try {
    //   if (video) {
    //     video.removeAttribute('src');
    //     video.load();
    //   }
    // } catch (e) {
    //   console.log('error removing video');
    // }
  });

  const setupMedia = () => {
    // alert(videoId + ':' + get(stream, 'userdata.setupMediaRequested'));
console.log('set media requested? TODO: is this running constantly because of $: below?')
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

  $: if (stream && video && video.srcObject !== stream.stream) {
    video.srcObject = stream.stream;
  }

//  $: get(stream, 'userdata.setupMediaRequested') && setupMedia(); 
</script>

<div class="relative" style="padding-top: 56.25%">
  {#if stream}
    <!-- svelte-ignore a11y-media-has-caption -->
    <video
      class="rounded-md absolute inset-0 w-full h-full"
      {muted}
      autoplay={true}
      playsinline={true}
      bind:this={video}
      id={`vid-${videoId}`}
    />
  {:else}
    no stream{videoId}{stream}
  {/if}
</div>

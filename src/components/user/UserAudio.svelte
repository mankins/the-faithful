<script>
  import { onMount } from 'svelte';

  export let streams = {};
  export let email = '';
  export let volume = 10; // 10 = loudest, 0 = off

  let audios = {};

  onMount(() => {
    // console.log({ streams });
    
  });

  const setupAudio = () => {
    let vol = volume * .1;
    if (vol > 1) {
      vol = 1;
    }
    if (vol <= 0.1) {
      vol = 0;
    }
    // console.log('setting volume to ', vol);
    Object.keys(audios).forEach((streamId) => {
      let audio = audios[streamId];
      if (audio.srcObject !== streams[streamId]) {
        audio.srcObject = streams[streamId].stream;
      }
      // set the volume
       audio.volume = vol;
    });
  };

  $: streams && (volume || (volume <= 0)) && setupAudio();
  $: volume || (volume <= 0) && console.log(volume);
</script>

<span id={`audios-${email}`}>
  {#each Object.keys(streams) as streamId, i}
    <!-- svelte-ignore a11y-media-has-caption -->
    <audio
      bind:this={audios[streamId]}
      autoPlay={true}
      controls={false}
      id={`aud-${streamId}`}
    />
  {/each}
</span>

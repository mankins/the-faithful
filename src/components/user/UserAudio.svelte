<script>
  import { onMount } from 'svelte';

  export let streams = {};
  export let email = '';
  export let mute = false;

  let audios = {};

  onMount(() => {
    // alert('a' + (percentX / 100) * canvasWidth);
    // console.log({isSelf});
    console.log({ streams });
  });

  const setupAudio = () => {
    Object.keys(audios).forEach((streamId) => {
      let audio = audios[streamId];
      if (audio.srcObject !== streams[streamId]) {
        audio.srcObject = streams[streamId].stream;
      }
    });
  };

  $: streams && setupAudio();
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

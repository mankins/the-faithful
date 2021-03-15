<script>
  import UserDot from '$components/user/UserDot.svelte';

let canvasWidth = 0;
let canvasHeight = 0;

  export let userDots = [
    { r: 25, x: 5, y: 10, email: 'mankins@gmail.com' },
    { r: 25, x: 50, y: 50, email: 'zmankins@gmail.com' },
  ];

const debugDots = () => {
console.log({userDots});
};

  $: userDots && debugDots();
</script>

<section class="w-full md:w-1/2">
  <div
    bind:clientWidth={canvasWidth}
    bind:clientHeight={canvasHeight}
  >
    <svg width="500px" height="500px" class="w-full h-full bg-black rounded-xl">
      {#each userDots as dot, i}
        <UserDot isSelf={dot.email === 'mankins@gmail.com'} size={dot.size || 25} email={dot.email} bind:percentX={dot.x} bind:percentY={dot.y} {canvasWidth} {canvasHeight} />
      {/each}
    </svg>
  </div>
</section>

<script>
  import { colorizer } from '$components/utils/colorizer.js';
  import { spring, tweened } from 'svelte/motion';
  // import { cubicOut } from 'svelte/easing';
  import { onMount } from 'svelte';

  export let isSelf = true;

  export let percentX = 0;
  export let percentY = 0;
  export let size = 25;
  export let canvasHeight = 0;
  export let canvasWidth = 0;
  export let email = '';
  export let mouseDown = false;

  let svg;

  let coords = spring(
    { x: 0, y: 0 },
    {
      stiffness: 0.1,
      damping: 0.25,
    }
  );

  onMount(() => {
    // alert('a' + (percentX / 100) * canvasWidth);
    if (canvasWidth && canvasHeight) {
      coords = spring(
        {
          x: (percentX / 100) * canvasWidth,
          y: (percentY / 100) * canvasHeight,
        },
        {
          stiffness: 0.1,
          damping: 0.25,
        }
      );
    }
  });

  const calculateCoords = () => {
    // dot.x = percent X
    // dot.y = percent Y
    // when canvas changes, recalculate the offsetpixels
    let x = (percentX / 100) * canvasWidth;
    let y = (percentY / 100) * canvasHeight;

    coords.set({ x, y });
  };

  const updateDot = () => {
    percentX = ($coords.x / canvasWidth) * 100;
    percentY = ($coords.y / canvasHeight) * 100;
  };

  $: canvasHeight && canvasWidth && calculateCoords();
  // $: $coords.x && $coords.y && updateDot();

  //   function getMousePosition(evt) {
  //   var CTM = svg.getScreenCTM();
  //   return {
  //     x: (evt.clientX - CTM.e) / CTM.a,
  //     y: (evt.clientY - CTM.f) / CTM.d
  //   };
  // }
  // function drag(evt) {
  //     evt.preventDefault();
  //     var coord = getMousePosition(evt);
  //     selectedElement.setAttributeNS(null, "x", coord.x);
  //     selectedElement.setAttributeNS(null, "y", coord.y);
  // }
  // offsetLeft
</script>

<circle
  fill="rgba(0,0,0,0)"
  cx={$coords.x}
  cy={$coords.y}
  r={size + 50}
  on:mousedown={(e) => {
    if (isSelf) {
      mouseDown = true;
      size = 30;
    }
  }}
  on:mouseup={(e) => {
    if (isSelf) {
      mouseDown = false;
      size = 25;
    }
  }}
  on:mousemove={(e) => {
    if (mouseDown && isSelf) {
      coords.set({ x: e.offsetX, y: e.offsetY });
      updateDot();
    }
  }}
/>
<g>
<circle
  on:mousedown={(e) => {
    if (isSelf) {
      mouseDown = true;
      size = 30;
    }
  }}
  on:mouseup={(e) => {
    if (isSelf) {
      mouseDown = false;
      size = 25;
    }
  }}
  on:mousemove={(e) => {
    if (mouseDown && isSelf) {
      coords.set({ x: e.offsetX, y: e.offsetY });
      updateDot();
    }
  }}
  fill={colorizer(email)}
  cx={$coords.x}
  cy={$coords.y}
  r={size}
/>
<text style="pointer-events: none;" text-anchor="middle" x={$coords.x} y={$coords.y + size / 2} fill="#ffffff">{email.substring(0,1).toUpperCase()}</text>
</g>
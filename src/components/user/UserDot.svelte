<script>
  import { colorizer } from '$components/utils/colorizer.js';
  import { spring, tweened } from 'svelte/motion';
  // import { cubicOut } from 'svelte/easing';
  import { onMount } from 'svelte';

  export let isSelf = true;

  export let percentX = 0;
  export let percentY = 0;
  export let size = 15;
  export let canvasHeight = 0;
  export let canvasWidth = 0;
  export let email = '';
  let mouseDown = false;

  let ringScale = 10;
  let coords = spring(
    { x: 0, y: 0 },
    {
      stiffness: 0.1,
      damping: 0.25,
    }
  );

  onMount(() => {
    // alert('a' + (percentX / 100) * canvasWidth);
    // console.log({isSelf});
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

  const calcRingScale = () => {
    ringScale = parseInt(canvasWidth / 15,10);
  }

  $: canvasHeight && canvasWidth && calculateCoords();
  $: canvasHeight && canvasWidth && calcRingScale();

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
  let lastMouseDown;
  let lastMouseDown2;
</script>

<g
  on:mousedown={(e) => {
    e.preventDefault();
    if (isSelf) {
      mouseDown = true;
      size = 30;
      updateDot();
      clearTimeout(lastMouseDown);
      lastMouseDown = setTimeout(() => {
        mouseDown = false;
      }, 2500);
    }
  }}
  on:mouseup={(e) => {
    e.preventDefault();
    if (isSelf) {
      mouseDown = false;
      size = 15;
      updateDot();
    }
  }}
  on:touchstart={(e) => {
    e.preventDefault();
    if (isSelf) {
      mouseDown = true;
      size = 30;
      updateDot();
      clearTimeout(lastMouseDown);
      lastMouseDown = setTimeout(() => {
        mouseDown = false;
      }, 2500);
    }
  }}
  on:touchend={(e) => {
    e.preventDefault();
    if (isSelf) {
      mouseDown = false;
      size = 15;
      updateDot();
    }
  }}
  on:mousemove={(e) => {
    e.preventDefault();
    if (mouseDown && isSelf) {
      coords.set({ x: e.offsetX, y: e.offsetY });
      updateDot();
      clearTimeout(lastMouseDown);
      lastMouseDown = setTimeout(() => {
        mouseDown = false;
      }, 2500);
    }
  }}
>
  <circle
  class:cursor-move={isSelf}

    fill="rgba(0,0,0,0)"
    cx={$coords.x}
    cy={$coords.y}
    r={size + (ringScale * 3)}
    stroke="#666666"
    stroke-width={isSelf ? 1 : 0}
  />
  <circle
  class:cursor-move={isSelf}

    fill="rgba(0,0,0,0)"
    cx={$coords.x}
    cy={$coords.y}
    r={size + ringScale}
    stroke="white"
    stroke-width={isSelf ? 1 : 0}
  />
  <circle
    fill={colorizer(email)}
    fill-opacity="0.9"
    cx={$coords.x}
    cy={$coords.y}
    r={size}
  />
  <text
    text-anchor="middle"
    x={$coords.x}
    y={$coords.y + size / 2}
    fill="#ffffff">{email.substring(0, 1).toUpperCase() || '?'}</text
  >
</g>

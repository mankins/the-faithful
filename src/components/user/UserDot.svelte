<script>
  import { colorizer } from '$components/utils/colorizer.js';
  import { spring, tweened } from 'svelte/motion';
  // import { cubicOut } from 'svelte/easing';
  import { onMount } from 'svelte';
  import get from 'lodash.get';
  import { talking } from '$components/stores/gal';

  export let isSelf = true;

  export let percentX = 0;
  export let percentY = 0;
  export let size = 15;
  export let canvasHeight = 0;
  export let canvasWidth = 0;
  export let email = '';
  export let streams = {};

  let mouseDown = false;
  let ringScale = 10;
  let coords = spring(
    { x: 0, y: 0 },
    {
      stiffness: 0.1,
      damping: 0.25,
    }
  );
  let vv = 0;
  let voiceStrength = tweened(1);
  let talkersUpdated;

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

    talking.subscribe((talkers) => {
      talkersUpdated = Date.now();
    });
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

  const setupVolumeIndicator = () => {
    Object.keys(streams).forEach((streamId) => {
      // look for our id
      let em = get(streams[streamId],'username');
      // console.log({em, email});
      if (em === email) {
        let vs = parseInt(get(streams[streamId],'userdata.voiceStrength',0),10);

        let startedTalking = get(streams[streamId],'userdata.voiceStart',0);
        let stoppedTalking = get(streams[streamId],'userdata.voiceEnd',0);
        // console.log(get(streams[streamId],'userdata'));
        if (startedTalking < stoppedTalking) {
          // currently talking
          // console.log('not talking', (startedTalking - stoppedTalking));
          voiceStrength.set(0);
          return;
        }
        voiceStrength.set(5);
        // setTimeout(()=> {
        //   voiceStrength.set(4);
        // },100);
      }
    });

  };

  // $: $voiceStrength && console.log($voiceStrength);
  $: canvasHeight && canvasWidth && calculateCoords();
  $: canvasHeight && canvasWidth && calcRingScale();

  $: talkersUpdated && setupVolumeIndicator();

  // setInterval(setupVolumeIndicator, 1000); //TODO

  // $: streams && console.log({streams},'sss');

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
    fill={colorizer(`${email}-v`)}
    fill-opacity="0.5"
    cx={$coords.x}
    cy={$coords.y}
    r={size + (10 * $voiceStrength)}
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

import timecodes from 'node-timecodes';
export async function GET(req, res, next) {
  const query = {};
  for (const [key, value] of req.query) {
    // each 'entry' is a [key, value] tupple
    query[key] = value;
  }

  let {
    filename = 'file.jpg',
    cols = 10,
    rows = 10,
    length = '00:10:00:00',
    width = 1280,
    height = 720,
  } = query;

  let body = await getVtt(filename, cols, rows, length, width, height);
  //   console.log({ req });

  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'text/vtt',
      'cache-control': 'no-cache; max-age=60',
    },
  });
}

const getVtt = async (filename, rows, cols, lengthTimecode, width, height) => {
  // WEBVTT

  // 1
  // 00:00:00.000 --> 00:00:01.000
  // 240p-00001.jpg#xywh=0,0,427,240

  // length to seconds
  const lengthSec = timecodes.toSeconds(lengthTimecode); // '00:23:47:10' -> 1427.4
  const cells = rows * cols;
  const segmentSec = lengthSec / cells;

  const w = parseInt(width / cols, 10);
  const h = parseInt(height / cols, 10);

  let pointerSec = 0;
  let count = 0;

  let output = 'WEBVTT\n';

  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      let startTimecode = timecodes.fromSeconds(pointerSec, {
        ms: true,
      });
      startTimecode = startTimecode.replace(/\:(\d\d\d)$/, '.$1');

      pointerSec = pointerSec + segmentSec;

      let endTimecode = timecodes.fromSeconds(pointerSec, {
        ms: true,
      });
      endTimecode = endTimecode.replace(/\:(\d\d\d)$/, '.$1');

      //   5
      //   00:00:04.000 --> 00:00:05.000
      // 00:00:00:000 --> 00:00:06:000
      //   100p-00001.jpg#xywh=712,0,178,100
      // file.zjpg#xywh=0,0,128,72

      // 1
      // 00:00:00:000 --> 00:00:06:000
      // file.zjpg#xywh=0,0,128,72

      // 2
      // 00:00:06:000 --> 00:00:12:000
      // file.zjpg#xywh=0,72,128,72

      count = count + 1;
      let x = w * col;
      let y = h * row;

      output = `${output}\n${count}\n${startTimecode} --> ${endTimecode}\n${filename}#xywh=${x},${y},${w},${h}\n`;

      // console.log(t.frameCount);
      //t.subtract(100); //frames
      // console.log(t.toString());
    }
  }
  return output;
};

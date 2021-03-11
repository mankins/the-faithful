const drawMultilineText = require('canvas-multiline-text')

const context = require('../context'); // drawing context

exports.process = async (params, isInline) => {

  /*
   *   params:
   *            w         - width of image
   *            h         - height of image
   *            y         - y offset
   *            bg        - background color
   *            fg        - foreground color
   *            minfont   - min font size
   *            maxfont   - max font size
   *            font      - font face
   *            text for the text
   */
  
  let surface;
  
  try {
  
    var bgStyle = params.bg || '#FEDFD7';
    var fgStyle = params.fg || '#ffffff';

    var w = parseInt(params.w || 600, 10);
    var h = parseInt(params.h || 100, 10);
    var y = parseInt(params.y || 20, 10);

    surface = params.surface || context.custom(w, h);
    var ctx = surface.ctx;

    // set the background
    ctx.fillStyle = bgStyle;
    ctx.fillRect(0, 0, w, h);
    ctx.antialias = 'subpixel';

    ctx.fillStyle = fgStyle;

    drawMultilineText(
      ctx,
      params.text || '',
      {
        rect: {
          x: 50,
          y,
          width: w - 70,
          height: h - 20
        },
        font: params.font || 'recoleta',
        verbose: false,
        lineHeight: 1.4,
        minFontSize: parseInt(params.minfont,10) || 12,
        maxFontSize: parseInt(params.maxfont,10) || 120
      } );
   

    if (isInline) {
      surface.result = await surface.canvas.toDataURL();
    } else {
      surface.result = await surface.canvas.toBuffer('image/png');
    }
  } catch (e) {
    console.log('render err', e);
  }

  // surface.result = surface.canvas.pngStream();
  return surface;
};

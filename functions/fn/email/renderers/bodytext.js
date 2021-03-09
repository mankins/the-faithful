const drawMultilineText = require('canvas-multiline-text')

const context = require('../context'); // drawing context

exports.process = async (params, isInline) => {

  /*
   *   params:
   *            w         - width of image
   *            h         - height of image
   *            bg        - background color
   *            fg        - foreground color
   *            bigText, smallText, and mediumText for the text
   */

  function fitTextOnCanvas(ctx, text, fontface, width) {
    // start with a large font size
    let fontsize = 300;

    // lower the font size until the text fits the canvas
    do {
      fontsize--;
      ctx.font = fontsize + 'px ' + fontface;
    } while ((ctx.measureText(text).width) > width);
    console.log(fontsize, ctx.width, ctx.measureText(text).width);
    return fontsize;
  }

  
  let surface;
  
  try {
  
    var bgStyle = params.bg || '#FEDFD7';
    var fgStyle = params.fg || '#ffffff';

    var w = parseInt(params.w || 600, 10);
    var h = parseInt(params.h || 100, 10);

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
          y: 20,
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

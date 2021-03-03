// output sample text

var context = require('../context'); // drawing context, not lambda

exports.process = async (params) => {
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

  var w = params.w || 600;
  var h = params.h || 600;

  var surface = params.surface || context.custom(w, h);

  var ctx = surface.ctx;
  var customTxt = params.txt || 'helvetica!?';

  ctx.font = '30px helvetica';
  ctx.rotate(0);
  ctx.fillText(customTxt, 50, 210);

  var te = ctx.measureText(customTxt);
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.lineTo(50, 212);
  ctx.lineTo(50 + te.width, 212);
  ctx.stroke();

  ctx.font = `${fitTextOnCanvas(ctx, 'Recoleta Fit', 'recoleta', w-20)}px recoleta`;
  ctx.rotate(0);
  ctx.fillText('Recoleta Fit', 10, 330);

  ctx.font = '30px recoleta';
  ctx.rotate(0);
  ctx.fillText('recoleta Bold', 10, 70);

  ctx.font = '30px recoleta';
  ctx.rotate(0);
  ctx.fillText('recoleta Italic', 10, 110);

  ctx.font = '50px recoleta';
  ctx.rotate(0);
  ctx.fillText('recoleta', 10, 160);

  surface.result = await surface.canvas.toBuffer('image/png');
  return surface;
};

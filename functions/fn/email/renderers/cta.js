// output sample text

var context = require('../context'); // drawing context, not lambda

  exports.process = async (params) => {

  /*
   *   params:
   *            w         - width of image
   *            h         - height of image
   *            bg        - background color
   *            fg        - foreground color
   *            txtSize   - text size
   *            button    - call to action text on button
   *            buttonBg  - button background color
   *            buttonTxt - button foreground color
   *
   */

  var bgStyle = params.bg || '#93D6F1';
  var fgStyle = params.fg || '#ffffff';

  var w = parseInt(params.w || 600, 10);
  var h = parseInt(params.h || 60, 10);

  var surface = params.surface || context.custom(w, h);
  var ctx = surface.ctx;

  // set the background
  ctx.fillStyle = bgStyle;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = fgStyle;
  var txtSize = parseInt(params.txtsize, 10) || 16;
  ctx.font = 'normal ' + txtSize + 'px asap';
  ctx.antialias = 'subpixel';

  var ctaText = params.button || 'Login';
  var m = ctx.measureText(ctaText);

  // add rectangle
  var textMargin = 17;
  var buttonMargin = textMargin * 2;
  var textHeight = parseInt(m.actualBoundingBoxAscent, 10); // + parseInt(m.actualBoundingBoxDescent, 10);

  var startY = h / 2 - (textHeight + buttonMargin) / 2;
  var minButtonWidth = 266;

  ctx.fillStyle = params.buttonbg || '#FEC959';
  // var lineHeight = parseInt(m.emHeightAscent, 10) + parseInt(m.emHeightDescent, 10);
  var textFullWidth = m.width;
  var xMovement = 0;
  if (textFullWidth < minButtonWidth) {
    xMovement = minButtonWidth - textFullWidth;
    textFullWidth = minButtonWidth;
  }
  var startX = (w / 2) - parseInt(textFullWidth / 2, 10) - textMargin;
  var endX = textFullWidth + textMargin * 2;
  var endY = textHeight + buttonMargin;

  if (startX < 0) {
    startX = 0;
  }
  if (endX > w) {
    endX = w; // off canvas
  }

  ctx.fillRect(startX, startY, endX, endY);
  ctx.fillStyle = params.buttontxt || '#ffffff';
  // console.log('...............', startX, startY, endX, endY, m);
  var textLeft = (w / 2) - (textFullWidth - xMovement) / 2;
  var textTop = startY + parseInt((endY) / 2, 10) + parseInt(textHeight / 2, 10);
  ctx.fillText(ctaText, textLeft, textTop);

  surface.result = await surface.canvas.toBuffer('image/png');
  // surface.result = surface.canvas.pngStream();
  return surface;
};

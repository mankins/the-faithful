// output sample text

var context = require('../lib/context'); // drawing context, not lambda
var assets = require('../lib/assets'); // cache of images and things

exports.process = function doIt(params, callback) {
  console.log('starting');
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
  var h = parseInt(params.h || 243, 10);

  var surface = params.surface || context.custom(w, h);
  var ctx = surface.ctx;

  // set the background
  ctx.fillStyle = bgStyle;
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(assets['atri-moon-email-01-cache.png'], 0, 0, 600, 243);

  if (!parseInt(params.nocta, 10)) {

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
    var offset = parseInt(params.offset, 10) || 0;

    var startX = offset + (5 * w / 8) - parseInt(textFullWidth / 2, 10) - textMargin;
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
    var textLeft = offset + (5 * w / 8) - (textFullWidth - xMovement) / 2;
    var textTop = startY + parseInt((endY) / 2, 10) + parseInt(textHeight / 2, 10);
    ctx.fillText(ctaText, textLeft, textTop);
  }

  surface.result = surface.canvas.toDataURL();

  callback(null, surface);
};

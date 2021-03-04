// output sample text

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
    var h = parseInt(params.h || 290, 10);

    surface = params.surface || context.custom(w, h);
    var ctx = surface.ctx;

    // set the background
    ctx.fillStyle = bgStyle;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = fgStyle;
    var txtSize = parseInt(params.medtext, 10) || 42;
    ctx.font = 'normal ' + txtSize + 'px serif';
    ctx.antialias = 'subpixel';

    var bigText = params.bigtext || '';
    var medText = params.medtext || '';
    var smallTextSize = parseInt(params.smalltextsize, 10) || 24;
    var medTextSize = parseInt(params.medtextsize, 10) || 42;
    var bigTextSize = parseInt(params.bigtextsize, 10) || 92;

    var smallStyle = params.smallstyle || '';
    var smallStyle2 = params.smallstyle2 || '';
    var bigStyle = params.bigstyle || '';
    var medStyle = params.medstyle || '';

    var offset = parseInt(params.offset, 10) || 0;

    // topline, Medium Text
    ctx.font = 'normal ' + medTextSize + 'px recoleta';
    ctx.antialias = 'subpixel';

    var m = ctx.measureText(medText);
//    var textLeft = 0; // = parseInt(params.textleft, 10) || ((w / 2) - parseInt(m.width / 2, 10));
    var textLeft = ((w - parseInt(m.width, 10)) / 2);

    ctx.fillStyle = medStyle || fgStyle;
    ctx.fillText(medText, textLeft, 90 + offset);

    // BIG text
    // ctx.font = 'normal ' + bigTextSize + 'px recoleta';
    ctx.font = `${fitTextOnCanvas(ctx, bigText, 'recoleta', w-20)}px recoleta`;
    ctx.fillStyle = bigStyle || bgStyle;
    ctx.fillText(bigText, 10, 185 + offset);

    // next line
    var line = params.smalltext1 || '';
    ctx.font = 'normal ' + smallTextSize + 'px recoleta';
    m = ctx.measureText(line);
    textLeft = ((w - parseInt(m.width, 10)) / 2);

    ctx.fillStyle = smallStyle || fgStyle;

    ctx.fillText(line, textLeft, 237 + offset);

    // next line
    line = params.smalltext2 || '';

    ctx.font = 'normal ' + smallTextSize + 'px recoleta';
    m = ctx.measureText(line);
    textLeft = parseInt(params.textleft, 10) || ((w / 2) - parseInt(m.width / 2, 10));
    ctx.fillStyle = smallStyle || smallStyle2 || fgStyle;
    ctx.fillText(line, textLeft, 273 + offset);

    // if we have a CTA button, add it:
    var buttonStyle = params.buttonstyle || 'normal 16px recoleta';
    if (params.button) {
      ctx.font = buttonStyle;

      var ctaText = params.button;
      m = ctx.measureText(ctaText);

      // add rectangle
      var textMargin = 17;
      var buttonMargin = 34;
      var startY = 183;
      var minButtonWidth = 100;

      ctx.fillStyle = params.buttonbg || '#FEC959';
      // var lineHeight = parseInt(m.emHeightAscent, 10) + parseInt(m.emHeightDescent, 10);
      var textFullWidth = m.width;
      var xMovement = 0;
      if (textFullWidth < minButtonWidth) {
        xMovement = minButtonWidth - textFullWidth;
        textFullWidth = minButtonWidth;
      }
      var buttonOffset = parseInt(params.buttonOffset, 10) || 0;
      var startX = buttonOffset + (w / 2) - parseInt(textFullWidth / 2, 10) - textMargin;
      var endX = textFullWidth + textMargin * 2;

      var textHeight = parseInt(m.actualBoundingBoxAscent, 10) + parseInt(m.actualBoundingBoxDescent, 10);
      var endY = textHeight + buttonMargin;

      if (startX < 0) {
        startX = 0;
      }
      if (endX > w) {
        endX = w; // off canvas
      }

      ctx.fillRect(startX, startY, endX, endY);
      ctx.fillStyle = params.buttontxt || '#ffffff';
      // console.log('...............',startX,startY, endX, endY,m);
      textLeft = buttonOffset + (w / 2) - (textFullWidth - xMovement) / 2;
      var textTop = startY + parseInt((endY) / 2, 10) + parseInt(textHeight / 2, 10);
      ctx.fillText(ctaText, textLeft, textTop);
    }

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

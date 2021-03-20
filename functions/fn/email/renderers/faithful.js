// output sample text

const path = require('path');
const fs = require('fs');

const { Image } = require('canvas');

let imgCache = {};

var context = require('../context'); // drawing context, not lambda

function imgFile(name) {
  return path.join(__dirname, '../../../assets/', name);
}

const addImage = (imagePath) => {

  let fileKey = path.basename(imagePath);

  if (imgCache[fileKey]) {
    return;
  }

  let data = fs.readFileSync(imagePath);
  const Img = new Image();
  Img.src = data;

  imgCache[fileKey] = Img;
  return Img;
};

exports.process = async (params, isInline) => {
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

  let surface;

  try {
    var bgStyle = params.bg || '#FEDFD7';
    // var fgStyle = params.fg || '#ffffff';

    let defaultH = 240;
    if (params.logo === 'sm') {
      defaultH = 200;
    } else if (params.logo === 'md') {
      defaultH = 620;
    } else if (params.logo === 'lg') {
      defaultH = 820;
    } else if (params.logo === 'yr-invited') {
      defaultH = 345;
    } else if (params.logo === 'drip-3.1-header') {
      defaultH = 510;
    } else if (params.logo === 'drip-3.2-header') {
      defaultH = 506;
    }

    var w = parseInt(params.w || 600, 10);
    var h = parseInt(params.h || defaultH, 10);

    surface = params.surface || context.custom(w, h);
    var ctx = surface.ctx;

    // set the background
    ctx.fillStyle = bgStyle;
    ctx.fillRect(0, 0, w, h);
    if (params.logo === 'sm') {
      ctx.drawImage(surface.assets['the-faithful-600px.png'], 0, 0, 600, 184);
    }
    if (params.logo === 'lg') {
      ctx.drawImage(surface.assets['logo-peeps-quote-600px.png'], 0, 0, 600, 800);
    }
    if (params.logo === 'md') {
      ctx.drawImage(surface.assets['quote-peeps-600px.png'], 0, 0, 600, 604); 
    }
    if (params.logo === 'yr-invited') {
      ctx.drawImage(surface.assets['yr-invited-header-600px.png'], 0, 0, 600, 345); 
    }
    if (params.logo === 'drip-3.1-header') {
      ctx.drawImage(surface.assets['drip-3.1-header.png'], 0, 0, 600, 510); 
    }
    if (params.logo === 'drip-3.2-header') {
      ctx.drawImage(surface.assets['drip-3.2-header.png'], 0, 0, 600, 506); 
    }

    // easier this way. drop in assets, reference here, set h - TODO:cleanup above
    if (params.logofile && params.h) {
      if (surface.assets[params.logofile]) {
        ctx.drawImage(surface.assets[params.logofile], 0, 0, 600, parseInt(params.h, 10));
      } else if (imgCache[params.logofile]) {
        ctx.drawImage(imgCache[params.logofile], 0, 0, 600, parseInt(params.h, 10));
      } else if (params.logofile) {
        addImage(imgFile(params.logofile));
        ctx.drawImage(imgCache[params.logofile], 0, 0, 600, parseInt(params.h, 10));
      }
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

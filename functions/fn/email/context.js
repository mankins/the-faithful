const path = require('path');
const { createCanvas, registerFont } = require('canvas');

function fontFile(name) {
  return path.join(__dirname, '../../fonts/', name);
}

function _addFonts() {
  // must happen before canvas
  registerFont(fontFile('Recoleta-Medium.ttf'), { family: 'recoleta' });
  registerFont(fontFile('Recoleta-Bold.ttf'), { family: 'recoleta-bold', style: 'bold' });
  registerFont(fontFile('Recoleta-Black.ttf'), { family: 'recoleta-black', weight: 900 });
  registerFont(fontFile('Recoleta-Thin.ttf'), { family: 'recoleta-thin', weight: 100 });
}

exports.custom = function custom(width, height) {
  var Width = width || 600;
  var Height = height || 200;

  _addFonts();

  var canvas = createCanvas(Width, Height);
  var ctx = canvas.getContext('2d');

  return {
    ctx: ctx,
    canvas: canvas,
  };
};

const path = require('path');
const { createCanvas, registerFont, Image } = require('canvas');

function fontFile(name) {
  return path.join(__dirname, '../../fonts/', name);
}

function _addFonts() {
  // must happen before canvas
  registerFont(fontFile('Recoleta-Medium.ttf'), { family: 'recoleta' });
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

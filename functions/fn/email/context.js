const path = require('path');
const fs = require('fs');
const { createCanvas, registerFont, Image } = require('canvas');

var imgCache = {};

function fontFile(name) {
  return path.join(__dirname, '../../fonts/', name);
}

function imgFile(name) {
  return path.join(__dirname, '../../assets/', name);
}

function _addFonts() {
  // must happen before canvas
  registerFont(fontFile('Recoleta-Medium.ttf'), { family: 'recoleta' });
  registerFont(fontFile('Recoleta-Bold.ttf'), {
    family: 'recoleta-bold',
    style: 'bold',
  });
  registerFont(fontFile('Recoleta-Black.ttf'), {
    family: 'recoleta-black',
    weight: 900,
  });
  registerFont(fontFile('Recoleta-Thin.ttf'), {
    family: 'recoleta-thin',
    weight: 100,
  });
  registerFont(fontFile('Inter-Medium.ttf'), { family: 'inter', weight: 500 });
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
  console.log(data.length);
  return Img;
};

function _addImages() {
  addImage(imgFile('logo-peeps-quote-600px.png'));
  addImage(imgFile('the-faithful-600px.png'));
  addImage(imgFile('quote-peeps-600px.png'));
  addImage(imgFile('yr-invited-header-600px.png'));  
  // addImage(imgFile('drip-3.1-header.png'));  
  // addImage(imgFile('drip-3.2-header.png'));  
  // addImage(imgFile('drip-4-header.png'));  
  addImage(imgFile('opening-1-top.png'));  
  addImage(imgFile('opening-1-middle.png'));  
  addImage(imgFile('opening-1-bottom.png'));  
  // addImage(imgFile('opening-2-top.png'));  
  // addImage(imgFile('opening-2-middle.png'));  
  // addImage(imgFile('opening-2-bottom.png'));  

}

exports.custom = function custom(width, height) {
  var Width = width || 600;
  var Height = height || 200;

  _addFonts();
  _addImages();

  var canvas = createCanvas(Width, Height);
  var ctx = canvas.getContext('2d');

  return {
    ctx: ctx,
    canvas: canvas,
    assets: imgCache
  };
};

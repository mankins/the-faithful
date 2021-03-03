var path = require('path');
var fs = require('fs');

function requireDir(Dir, filepath) {

  var dir = path.join(Dir, filepath);

  var modules = {};
  var files;
  var stat;
  var ext;
  var name;

  if (fs.statSync(dir).isDirectory()) {
    files = fs.readdirSync(dir);

    if (files.indexOf('index.js') !== -1) {
      modules = require(path.join(dir, 'index.js'));
    } else {
      files.forEach(function process(file) {
        try {

          filepath = path.join(dir, file);
          stat = fs.statSync(filepath);
          if (stat.isDirectory()) {
            return;
          }

          ext = path.extname(file);
          if ((file.indexOf('.') === 0) || (file.indexOf('#') === 0)) {
            return;
          }
          if (ext.match(/\.js(on)?$/)) {
            // load default context
            name = file.replace(ext, '');
            modules[name] = require(filepath);
          }
        } catch (e) {
          console.log('error', e);
        }
      });
    }
  }
  return modules;
}

var templates = requireDir(__dirname, 'built');
var contexts = requireDir(__dirname, 'contexts');

function defaultContext(name) {
  var shortName = name.replace(/(-plain)|(-html)/, '');
  var context = contexts[shortName] || {};
  console.log('context', context);
  return context;
}

function has(name) {
  return !!templates[name];
}

function render(name, context) {
  return has(name) ? templates[name](context) : null;
}
templates.has = has;
templates.render = render;
templates.defaultContext = defaultContext;
module.exports = templates;

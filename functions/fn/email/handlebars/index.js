// our custom handlebars with our helpers.

var handlebars  = require('handlebars');
var helpers = require('./helpers');

const _ = require('lodash');

_.forEach(helpers, function(helperFn, plugin) {
  //  console.log('plugin', plugin);
  handlebars.registerHelper(plugin, helperFn);
});

module.exports = handlebars;

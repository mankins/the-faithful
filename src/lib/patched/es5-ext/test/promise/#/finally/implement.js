"use strict";

var isImplemented = require("../../../../promise/hash/finally/is-implemented");

if (typeof Promise !== "function") global.Promise = require("plain-promise");

module.exports = function (a) { a(isImplemented(), true); };

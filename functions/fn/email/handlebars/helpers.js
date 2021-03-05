// basic handlebars helpers - partially from https://raw.github.com/danharper/Handlebars-Helpers/master/src/helpers.js

var _ = require('lodash');

var exports = module.exports = {};

var isArray = function(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
}

var ExpressionRegistry = function() {
    this.expressions = [];
};

ExpressionRegistry.prototype.add = function(operator, method) {
    this.expressions[operator] = method;
};

ExpressionRegistry.prototype.call = function(operator, left, right) {
    if (!this.expressions.hasOwnProperty(operator)) { // eslint-disable-line no-prototype-builtins
        throw new Error('Unknown operator "' + operator + '"');
    }

    return this.expressions[operator](left, right);
};

var eR = new ExpressionRegistry;
eR.add('not', function(left, right) {
    return left != right;
});
eR.add('>', function(left, right) {
    return left > right;
});
eR.add('<', function(left, right) {
    return left < right;
});
eR.add('>=', function(left, right) {
    return left >= right;
});
eR.add('<=', function(left, right) {
    return left <= right;
});
eR.add('===', function(left, right) {
    return left === right;
});
eR.add('!==', function(left, right) {
    return left !== right;
});
eR.add('in', function(left, right) {
    if (!isArray(right)) {
        right = right.split(',');
    }
    return right.indexOf(left) !== -1;
});
eR.add('=~', function(left, right) {

 var re = new RegExp(right);
 return re.test(left);
});

eR.add('permitted', function(userPermissions, permissionCheck) {
  // see adieu permissions check for a copy-paste of this

  // userPermissions should be an array of permissions, with wildcards. See: http://shiro.apache.org/permissions.html
  // the permissionCheck is the specific item we seek permission for

   var permitted = false;
    _.each(userPermissions, function(permission) {
//console.log('permission:------------------',permission,permitted,permissionCheck);
         if (permitted) {
            return; // already found
         }
         // check exact printers:lp2000:print
         if (permission === permissionCheck) {
            permitted = true;
            return;
         }
         if (permission.indexOf(':*:') != -1) {
             // the front and back have to match, but the middle does not
             // TODO: when you need it, do this.
             console.warn('match not implemented');
         } else {
             if (permission.indexOf(':*') != -1) {
                 // printers:*
                  if (permissionCheck.substr(0,permission.indexOf(':*')+1) === permission.substr(0,permission.indexOf(':*')+1) ) {
                    permitted = true;
                    return;
                  }
             }
             if (permission.indexOf('*:') != -1) {
                 // *:print
                  if (permissionCheck.substr(permissionCheck.indexOf(permission.substr(permission.indexOf('*:')+1))) ===  permission.substr(permission.indexOf('*:')+1)) {
                    permitted = true;
                    return;
                  }
             }
         }
         console.log(permitted);
    });
         console.log('answer',permitted);

   return permitted;
});

var isHelper = function() {
    var args = arguments,
        left = args[0],
        operator = args[1],
        right = args[2],
        options = args[3];

    if (args.length == 2) {
        options = args[1];
        if (left) return options.fn(this);
        return options.inverse(this);
    }

    if (args.length == 3) {
        right = args[1];
        options = args[2];
        if (left == right) return options.fn(this);
        return options.inverse(this);
    }

    if (eR.call(operator, left, right)) {
        return options.fn(this);
    }
    return options.inverse(this);
};

exports.is = isHelper;

exports.encodeUrl = exports.encodeUri = function(string) {
   return encodeURIComponent(string);
};

exports.ts = function() {
    return Date.now() + '';
};

exports.ucfirst = function(string) {
    var firstCharUpperString = string.charAt(0).toUpperCase() + string.slice(1);
    return firstCharUpperString;
};

exports.escape = function(thing) {
  return thing.replace(/(['"])/g, '\\$1');
};

exports.inc = function(thing) {
    var newthing = thing + 1;
    return newthing;
};

exports.commas = function(val) {
    if (!val) {
        return 0;
    }
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
};

exports.substr = function(length, context) {
    if (context.length > length) {
        return context.substring(0, length) + "...";
    } else {
        return context;
    }
};

exports.yyyymm = function(yyyymm) {
    return yyyymm.substring(0, 4) + '-' + yyyymm.substring(4);
};

exports.nl2br = function() {
    // var nl2br = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
    // return new Handlebars.SafeString(nl2br);
};

exports.json = function() {
    return JSON.stringify(Array.prototype.slice.call(arguments, 0, -1),0,4);
};

exports.log = function() {
    console.log(['Values:'].concat(
        Array.prototype.slice.call(arguments, 0, -1)
    ));
};

exports.debug = function() {
    console.log('Context:', this);
    console.log(['Values:'].concat(
        Array.prototype.slice.call(arguments, 0, -1)
    ));
};

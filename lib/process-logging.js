var colors = require('colors');

exports.init = function (done) {

  var app = this;

  if (!process.logging) {

    app.log.info('  [init] ' + 'process.logging'.rainbow + ' activated.');

    process.logging = function (mod) {
      return function (msg, obj) {

        var text = String(msg),
            start,
            end,
            field;

        // Interpolate over the object. Basically copypasta from mikeal's thing.
        // Note that mikeal's choice of symbol (%)
        while (text.indexOf('%') !== -1) {

          start = text.indexOf('%');
          end = text.indexOf(' ', start);

          if (end === -1) {
            end = text.length;
          }

          field = text.slice(start+1, end);

          if (obj[field]) {
            text = text.slice(0, start)
              + obj[text.slice(start+1, end)]
              + text.slice(end);
          }
          else {
            text = text.slice(0, start)
              + '<percent-sign>'
              + field
              + text.slice(end);
          }
        }

        text = text.replace(/<percent-sign>/g, '%');

        app.log.info('process.logging '.rainbow + '[' + mod.blue + ']' + ' ' + text);

      }
    };
  }
  else {
    app.log.warn('  [init] ' + '⚠ ATTENTION ⚠  '.bold.yellow + 'process.logging'.rainbow + ' is already defined. ' + 'Not activating.'.red);
  }

  done();
};

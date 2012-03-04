var colors = require('colors');

exports.init = function (done) {

  var app = this;

  app.log.info('  [init] ' + 'process.logging'.rainbow + ' activated.');

  process.logging = function (mod) {
    return function (text, obj) {

      var start, end;

      // Interpolate over the object. Basically copypasta from mikeal's thing.
      while (text.indexOf('%') !== -1) {

        start = text.indexOf('%');
        end = text.indexOf(' ', start);

        if (end === -1) {
          end = text.length;
        }

        text = text.slice(0, start)
          + obj[text.slice(start+1, end)]
          + text.slice(end);
      }

      app.log.info('process.logging '.rainbow + '[' + mod.blue + ']' + ' ' + text);

    }
  };

  done();
};

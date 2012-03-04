var fs = require('fs'),
    path = require('path'),
    utile = require('utile');

exports.name = 'download';

exports.attach = function (opts) {
}

exports.init = function (done) {
  var app = this;

  // Activate process.logging if necessary.
  app.log.info('[init] ' + 'Activating ' + 'process.logging'.rainbow + '...');

  if (!process.logging) {

    process.logging = function (mod) {
      return function (msg, obj) {

        var text = String(msg),
            start,
            end,
            field;

        // Interpolate over the object. Basically copypasta from mikeal's thing.
        // Note that mikeal's choice of symbol (%) and html entities don't mix.
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

    app.log.info('[init] ' + 'process.logging'.rainbow + ' activated.');
  }
  else {
    app.log.warn('[init] ' + '⚠ ATTENTION ⚠  '.bold.yellow + 'process.logging'.rainbow + ' is already defined. ' + 'Not activating.'.red);
  }

  // Now that process.logging is defined, we can pull in request.
  var request = require('request');

  this.download = function (o, next) {
    o = o || {};

    if (!o.url || !o.path) {
      return next(new Error('No download url or destination specified.'), o);
    }

    o.name = o.name || o.url;

    utile.mkdirp(path.dirname(o.path), 0775, function (err) {
      if (err) {
        return next(err, o);
      }

      app.log.info('Downloading ' + o.name.cyan + '...');

      app.ticker(function (t) {

        request(o)
          .pipe(fs.createWriteStream(o.path))
          .on('close', function (err) {
            if (err) {
              throw err;
            }

            t.stop(function () {

              app.log.info('Downloading ' + o.name.cyan + ' complete.');

              next(null, o);

            })
          });
        ;
        t.start();
      });
    });
  }

  done();
}

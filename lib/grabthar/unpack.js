var colors = require('colors'),
    fs = require('fs'),
    path = require('path'),
    zip = require('zip'),
    utile = require('utile');

exports.name = 'unzip';

exports.attach = function (opts) {
  var app = this;

  this.unzip = app.chainable(function (o, next) {

    o = o || {};

    if (!o.path) {
      return next(new Error('No archive specified.'), o);
    }

    app.log.info('Unpacking ' + o.path.cyan );

    // This api is all sync but whatever.
    var files = zip.Reader(fs.readFileSync(o.path)).toObject('utf8');

    utile.async.forEachSeries(Object.keys(files), function (fname, cb) {
      var p = path.resolve(path.dirname(o.path), fname);

      app.log.info('Writing '.blue + p);
      utile.mkdirp(path.dirname(p), 0775, function (err) {
        if (err) {
          return next(err, o);
        }

        fs.writeFileSync(
          p,
          files[fname]
        );

        cb();
      })
    }, function (err) {
      if (err) {
        return next(err, o);
      }

      app.log.info('Unpacked.');
      app.log.info('Removing zip archive...');

      utile.rimraf(o.path, function (err) {
        next(err, o);
      });
    });
  });
};

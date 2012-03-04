#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    colors = require('colors'),
    zip = require('zip'),
    utile = require('utile'),
    request,
    app = require('../lib/grabthar');

app.init();

request = require('request');

function getCraftBukkit (next) {
  var craftbukkit = {
    'url': 'http://dl.bukkit.org/latest-rb/craftbukkit.jar',
    'path': path.resolve(path.join(__dirname, '..', 'craftbukkit.jar'))
  };

  app.log.info('Downloading ' + 'craftbukkit'.cyan + '...');

  app.ticker(function (t) {

    request(craftbukkit.url)
      .pipe(fs.createWriteStream(craftbukkit.path))
      .on('close', function (err) {
        if (err) {
          throw err;
        }

        t.stop(function () {

          app.log.info('Downloading ' + 'craftbukkit'.cyan + ' complete.');

          next();

        })
      });
    ;
    t.start();
  });
}

function getJSONApi (next) {
  var api = {
    'url': 'http://alecgorge.com/minecraft/jsonapi/version/latest/',
    'path': path.resolve(path.join(__dirname, '..', 'plugins', 'jsonapi.zip'))
  };

  app.log.info('Downloading ' + 'JSONApi'.cyan + '...');

  app.ticker(function (t) {

    request(api.url)
      .pipe(fs.createWriteStream(api.path))
      .on('close', function (err) {
        if (err) {
          throw err;
        }

        t.stop(function () {

          app.log.info('Downloading ' + 'JSONApi'.cyan + ' complete.');

          app.log.info('Unpacking ' + api.path.cyan );

          // This api is all sync but whatever.
          var files = zip.Reader(fs.readFileSync(api.path)).toObject('utf8');

          utile.async.forEachSeries(Object.keys(files), function (fname, cb) {
            var p = path.resolve(path.dirname(api.path), fname);

            app.log.info('Writing '.blue + p);
            utile.mkdirp(path.dirname(p), 0775, function (err) {
              if (err) {
                throw err;
              }

              fs.writeFileSync(
                p,
                files[fname]
              );

              cb();
            })
          }, function (err) {
            if (err) {
              throw err;
            }

            app.log.info('Unpacked.');
            app.log.info('Removing zip archive...');

            utile.rimraf(api.path, function (err) {
              if (err) {
                throw err;
              }

              next();
            });

          });
        });
      });

    t.start();

  });
}

getCraftBukkit(function () {
  getJSONApi(function () {
    app.log.info('Done.');
    process.exit(0);
  });
});

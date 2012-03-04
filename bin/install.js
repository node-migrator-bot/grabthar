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

  request(craftbukkit.url)
    .pipe(fs.createWriteStream(craftbukkit.path))
    .on('close', function (err) {
    if (err) {
      throw err;
    }

    app.ticker.stop();

    app.log.info('Downloading ' + 'craftbukkit'.cyan + ' complete.');

    next();

  });

  app.ticker.start();
}

function getJSONApi (next) {
  var api = {
    'url': 'http://alecgorge.com/minecraft/jsonapi/version/latest/',
    'path': path.resolve(path.join(__dirname, '..', 'plugins', 'jsonapi.zip'))
  };

  app.log.info('Downloading ' + 'JSONApi'.cyan + '...');

  var url = 'https://cloud.github.com/downloads/alecgorge/jsonapi/JSONAPI%20v3.4.3.zip';

  request({
    url: api.url
  })
    .pipe(fs.createWriteStream(api.path))
    .on('close', function (err) {
    if (err) {
      throw err;
    }

    app.ticker.stop();

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

  app.ticker.start();
}

getCraftBukkit(function () {
  getJSONApi(function () {
    app.log.info('Done.');
  });
});

#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    colors = require('colors'),
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

getCraftBukkit(function () {
  app.log.info('Done.');
});

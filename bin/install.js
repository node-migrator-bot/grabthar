#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    colors = require('colors'),
    utile = require('utile'),
    app = require('../lib/grabthar');

app.init();

app.download({
  name: 'craftbukkit',
  url: 'http://dl.bukkit.org/latest-rb/craftbukkit.jar',
  path: path.resolve(path.join(__dirname, '..', 'craftbukkit.jar'))
}, function (err) {
  if (err) {
    throw err;
  }

  app.download({
    name: 'JSONApi',
    url: 'http://alecgorge.com/minecraft/jsonapi/version/latest/',
    path: path.resolve(path.join(__dirname, '..', 'plugins', 'jsonapi.zip'))
  }, function (err, state) {
    if (err) {
      throw err;
    }

    app.unzip(state, finish);
  });

});

function finish (err) {
  if (err) {
    throw err;
  }

  app.log.info('Done.');
  process.exit(0);
}

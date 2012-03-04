var moment = require('moment'),
    multimeter = require('multimeter')(process),
    EventEmitter = require('events').EventEmitter,
    util = require('util'),
    colors = require('colors');

multimeter.charm.on('^C', function () {
  //multimeter.charm.reset();
  console.log('\n');
  process.exit();
});

var Ticker = exports.Ticker = function (opts) {

  EventEmitter.call(this);

  opts = opts || {};

  this.clock = opts.clock || 40;
  this.gain = opts.gain || 10;
  this.count = 0;
};

util.inherits(Ticker, EventEmitter);

Ticker.prototype.start = function () {
  var self = this;

  multimeter.drop({
    width: 17,
    before: 'info'.green + ':   [' + 'waitingjerk'.blue + '] ' + 'FAKE PROGRESS: '.bold + '(NOT frozen)'.grey + ' ~={|'.bold,
    after: '|:: '.bold,
    solid: {
      background: 'black',
      foreground: 'green',
      text: '✓'
    }
  }, function (bar) {
    var n = 1,
        t = self.clock,
        k = self.gain;

    var iv = setInterval(function () {
        var p = 100*(t/k+1)/t*k*((n)/(n+k*t) - 1/(1 + k*t)) - 1;

        bar.percent(p);

        n++;

    }, t);

    self.on('stop', function (cb) {
      clearInterval(iv);
      bar.percent(100);
      console.log();
      if (cb) { cb(); };
    });


  });

  return this;
};

Ticker.prototype.stop = function (cb) {
  this.emit('stop', cb);

  return this;
};

exports.attach = function (opts) {
  opts = opts || {};

  this.ticker = function (cb) {
    return cb(new Ticker(opts));
  }
}

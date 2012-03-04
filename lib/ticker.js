var moment = require('moment'),
    colors = require('colors');

var Ticker = exports.ticker = function Ticker (opts) {
  opts = opts || {};

  this.app = opts.app || app || { log: { info: console.log }};
  this.ticks = opts.ticks || '|/-\\';
  this.clock = opts.clock || 1000;
  this.count = 0;
};

Ticker.prototype.start = function () {
  var self = this,
      app = self.app;

  this.interval = setInterval(function () {
    app.log.info( '[' + 'waitingjerk'.blue + '] '
      + moment().format('hh:mm:ss') + ' (' + self.ticks[self.count].green + ')');
    self.count = (self.count + 1) % self.ticks.length;
  }, self.clock);

  return this;
};

Ticker.prototype.stop = function () {
  clearInterval(this.interval);
};

exports.attach = function (opts) {
  opts = opts || {};

  opts.app = this;

  this.ticker = new Ticker(opts);

}

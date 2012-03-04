var colors = require('colors'),
    flatiron = require('flatiron'),
    app = flatiron.app,
    ticker = require('../lib/ticker'),
    logging = require('../lib/process-logging');

app.use(flatiron.plugins.cli);
app.use(ticker);
app.use(logging);

app.use({
  init: function () {
    app.log.info('');
    app.log.info('  BY '.magenta + 'GRABTHAR\'S HAMMER'.yellow + ' (what a savings)!'.magenta);
    app.log.info('  A silly thing for helping download and install stuff');
    app.log.info('  Programmed entirely in ' + 'jesusabdullah\'s'.yellow + ' bedroom.');
    app.log.info('');
  }
});

module.exports = app;

var colors = require('colors'),
    flatiron = require('flatiron'),
    app = flatiron.app;

app.use(flatiron.plugins.cli);
app.use({
  init: function (d) {


    d();
  }
});
app.use(require('./ticker'));
app.use(require('./download'));
app.use(require('./unpack'));


var start = app.start;

app.start = function (opts, cb) {

  // this is mostly copypasta from the cli tool's start.
  if (!cb && typeof opts === 'function') {
    cb = opts;
    opts = {};
  }
    
  cb = cb || function () {};
  app.init(opts, function (err) {
    if (err) {
      return started(err);
    }
      
    app.router.dispatch('on', app.argv._.join(' '), app.log, started(err));
  });

  // This is new.
  function started (err) {

    app.log.info('');
    app.log.info('   _   _  _  |_  |_ |_   _   _ '.yellow);
    app.log.info('  (_) |  (_| |_) |_ | ) (_| |  '.yellow + ' v0.0.0-alpha'.grey);
    app.log.info('  _/ '.yellow + ' ❝'.cyan + 'BY '.magenta + 'GRABTHAR\'S HAMMER'.yellow + ', what a savings!'.magenta + '❞'.cyan);
    app.log.info('');
    app.log.info('  The little build task library that could.'.grey);
    app.log.info('  Programmed almost entirely in '.grey + 'jesusabdullah\'s'.yellow + ' bedroom Ⓒ 2012 (Licensed MIT/X11)'.grey);
    app.log.info('');

    if (err) {
      if (!cb) {
        throw err;
      }
    }

    cb(err);
  };

}

module.exports = app;

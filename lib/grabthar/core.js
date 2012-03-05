

exports.name = 'grabthar-core';

exports.attach = function (opts) {

  var app = this,
      stack = [],
      context = {};

  // Set the context
  app.task = function (ctx) {
    
    stack.push({
      context: ctx
    });

    return this;
  };

  // Add a chainable method
  app.chainable = function (fxn) {
    //fxn(context, cb(err, ctx));

    return function () {
      stack.push({
        fxn: fxn
      });

      return app;
    };
  };

  app.next = function () {
    var action = stack.shift();

    // empty stack
    if (!action) {
      app.emit('grabthar::end');
    }
    else if (action.context) {
      context = action.context;
      app.next();
    }
    else if (action.fxn ) {

      action.fxn.call(app, context, function (err, newContext) {

        context = newContext;

        if (err) {
          app.emit('grabthar::error', err);
          app.emit('grabthar::end', err);
        }
        else {
          app.next();
        }
      });

    }
  }

  app.on('grabthar::end', function (err) {
    if (err) {
      app.log.error('☠☠☠☠☠☠☠☠☠☠☠☠'.zebra + ' E R R O R '.red.bold + '☠☠☠☠☠☠☠☠☠☠☠☠'.zebra);
      err.stack.split('\n').forEach(function (l) {
        app.log.error(l);
      });
      app.log.info('Done.');
      process.exit(1);
    }

    app.log.info('Done.');
    process.exit(0);
  });

  // Start the machine! May move away from flatiron.plugins.cli
  this.start = function (cb) {
    // this is mostly copypasta from the cli tool's start.
    if (!cb && typeof opts === 'function') {
      cb = opts;
      opts = {};
    }
      
    cb = cb || function () {};

    app.init(opts, function (err) {

      app.log.info('');
      app.log.info('   _   _  _  |_  |_ |_   _   _ '.yellow);
      app.log.info('  (_) |  (_| |_) |_ | ) (_| |  '.yellow + ' v0.0.0-alpha'.grey);
      app.log.info('  _/ '.yellow + ' ❝'.cyan + 'BY '.magenta + 'GRABTHAR\'S HAMMER'.yellow + ', what a savings!'.magenta + '❞'.cyan);
      app.log.info('');
      app.log.info('  The little build task library that could.'.grey);
      app.log.info('  Programmed almost entirely in '.grey + 'jesusabdullah\'s'.yellow + ' bedroom Ⓒ 2012 (Licensed MIT/X11)'.grey);
      app.log.info('');

      if (err) {
        app.emit('grabthar::error', err);
        app.emit('grabthar::end', err);
      }

      process.nextTick(function () {
        app.emit('grabthar::begin');
        app.next();
      });

      app.router.dispatch('on', app.argv._.join(' '), app.log, function (err) {
        app.emit('grabthar::error', err);
        app.emit('grabthar::end', err);
      });
    });
  };
};

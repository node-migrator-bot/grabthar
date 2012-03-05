var Chainsaw = require('chainsaw');

this.name = 'run';

exports.attach = function (opts) {

  this.run = function (done) {

    return Chainsaw(function (saw) {

      var context = {};

      this.task = function (state) {
        context = state;
        saw.next();
      };

      this.add = function (task) {
        task(context, function (err, newContext) {

          context = newContext;

          if (err) {
            done(err, state);
          }
          else {
            saw.next();
          }
        });
      };
    });
  };
}

/*
run(function (err) {
  if (err) {
    throw err;
  }
})
  .task({
    a: 'a',
    b: 'b',
    c: 'c'
  })
    .add(function (state, cb) {
      console.log(state);
      cb(null, state);
    })
    .add(function (state, cb) {
      cb(null, { a: 'b', b: 'c', c: 'd' });
    })
    .add(function (state, cb) {
      console.log(state);
      cb(null, state);
    })

*/

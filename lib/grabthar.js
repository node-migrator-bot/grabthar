var colors = require('colors'),
    flatiron = require('flatiron'),
    app = flatiron.app;

app.use(require('./grabthar/core');
app.use(require('./grabthar/ticker'));
app.use(require('./grabthar/download'));
app.use(require('./grabthar/unpack'));

module.exports = app;

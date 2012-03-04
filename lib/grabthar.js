var flatiron = require('flatiron'),
    app = flatiron.app,
    ticker = require('../lib/ticker'),
    logging = require('../lib/process-logging');

app.use(flatiron.plugins.cli);
app.use(ticker, { clock: 1500 });
app.use(logging);

module.exports = app;

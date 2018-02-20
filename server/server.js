'use strict';
var loopback = require('loopback');
var boot = require('loopback-boot');
var errorHandler = require('strong-error-handler');
var app = loopback();

var bunyan = require('bunyan');
var DBStream = require('./other/db-stream');
var rootLogger = bunyan.createLogger({
  name: 'loopbackLogger',
  level: 'trace',
  streams: [
    {
      type: 'raw',
      stream: new DBStream(app),
      reemitErrorEvents: true,
    },
  ],
});
var logger = require('loopback-component-logger')(rootLogger);

app.start = function() {
  // start the web server
  console.log(process.env.NODE_ENV);
  app.use(
    errorHandler({
      debug: app.get('env') === 'development',
      log: true,
    })
  );

  app.use(loopback.token());

  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) app.start();
});

module.exports = app;

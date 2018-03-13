'use strict';
const path = require('path');
const fs = require('fs');

const emailRoutes = require('../other/email');

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  // router.get('/', server.loopback.status());
  router.get('/login', (req, res) => {
    const contents = fs.readFileSync(
      path.resolve(__dirname, '../../client', 'index.html'),
      'utf8'
    );
    res.send(contents);
  });

  server.use(router);
  server.use('/api/email', emailRoutes(server));
};

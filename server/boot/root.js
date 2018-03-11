'use strict';
const path = require('path');
const fs = require('fs');

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

  server.post('/api/newsletter/subscribe', (req, res) => {
    const subscribeEmail = req.body.email;
    server.models.Email.send(
      {
        to: subscribeEmail,
        from: server.get('email').admin,
        subject: 'Newsletter registered',
        html: `your email ${subscribeEmail} was registered at our newsletter`,
      },
      err => {
        if (err) {
          console.log(err);
        }
      }
    );

    server.models.Email.send(
      {
        to: req.body.to || server.get('email').client,
        from: server.get('email').admin,
        subject: 'Newsletter registered',
        html: `please add this email to the newsletter: ${subscribeEmail}`,
      },
      err => {
        if (err) {
          console.log(err);
        }
      }
    );

    res.send('Email was sent!');
  });

  server.use(router);
};

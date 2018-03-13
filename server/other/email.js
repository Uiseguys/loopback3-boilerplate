'use strict';
const container = 'email-templates';

module.exports = function(app) {
  var router = app.loopback.Router();

  // create container
  const {Attachment} = app.models;
  Attachment.createContainer(
    {
      name: container,
    },
    () => {}
  );

  router.get('/', (req, res) => {
    const {AttachmentMeta} = app.models;
    AttachmentMeta.find(
      {
        container,
      },
      (err, files) => {
        res.send(err || files);
      }
    );
  });

  router.post('/', (req, res) => {
    const {Attachment, AttachmentMeta} = app.models;
    Attachment.upload(req, res, {container}, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        const {files: {file}} = result;
        // file.forEach(item => {
        //   // remove same file name
        //   AttachmentMeta.destroyAll({
        //     container,
        //     originalFilename: item.originalFilename,
        //   });

        //   // insert new
        //   AttachmentMeta.create(file);
        // });
        res.send(file);
      }
    });
  });

  router.post('/send', (req, res) => {
    const loopback = require('loopback');
    const path = require('path');
    const {to, from, subject, template, data} = req.body;

    app.set('view engine', 'ejs');
    const renderer = loopback.template(
      path.resolve(__dirname, `../storage/${container}/${template}`)
    );
    const htmlBody = renderer(data);

    console.log(htmlBody);

    app.models.Email.send(
      {
        to,
        from: from || app.get('email').admin,
        subject,
        html: htmlBody,
      },
      err => {
        if (err) {
          res.send(err);
        } else {
          res.send('Email has been sent');
        }
      }
    );
  });

  return router;
};

'use strict';
const path = require('path');
const fs = require('fs');
const helpers = require('./helpers.js');

module.exports = Template => {
  helpers.disableAllMethods(Template, ['find', 'create', 'deleteById']);

  Template.beforeRemote('create', (ctx, modelInstance, next) => {
    const {File} = Template.app.models;
    File.upload(ctx.req, ctx.res, {container: 'templates'}, (err, result) => {
      if (err) {
        ctx.res.send(err);
      } else {
        const {files: {file: [file]}} = result;
        ctx.req.body.name = file.name;
        ctx.req.body.originalFilename = file.originalFilename;
        next();
      }
    });
  });

  Template.remoteMethod('download', {
    http: {path: '/:id', verb: 'post'},
    accepts: [
      {arg: 'id', type: 'number'},
      {arg: 'body', type: 'object', http: {source: 'body'}},
    ],
    description: 'download template',
    returns: [
      {arg: 'body', type: 'file', root: true},
      {arg: 'Content-Disposition', type: 'string', http: {target: 'header'}},
    ],
  });

  Template.download = (id, body, cb) => {
    Template.findById(id, (err, template) => {
      if (!template) {
        return cb('Not found', 404);
      }
      const data = body || {};
      const options = {
        convertTo: 'pdf',
      };

      const carbone = require('carbone');
      carbone.render(
        path.resolve(__dirname, `../storage/templates/${template.name}`),
        data,
        options,
        function(err, result) {
          if (err) cb(err);

          if (options.convertTo) {
            const name = path.basename(
              template.originalFilename,
              path.extname(template.originalFilename)
            );

            cb(
              null,
              result,
              `attachment; filename="${name}.${options.convertTo}"`
            );
          } else {
            cb(
              null,
              result,
              `attachment; filename="${template.originalFilename}"`
            );
          }
        }
      );
    });
  };
};

'use strict';
const helpers = require('./helpers.js');
const container = 'all';

module.exports = Resource => {
  helpers.disableAllMethods(Resource, ['find']);

  Resource.remoteMethod('upload', {
    http: {path: '/:container/upload', verb: 'post'},
    accepts: [
      {arg: 'container', type: 'string'},
      {arg: 'req', type: 'object', http: {source: 'req'}},
      {arg: 'res', type: 'object', http: {source: 'res'}},
    ],
    returns: {type: 'object', root: true},
  });

  Resource.upload = (container, req, res, cb) => {
    const {Attachment} = Resource.app.models;

    Attachment.createContainer({name: container}, () => {
      Attachment.upload(req, res, {container}, (err, result) => {
        if (err) {
          return cb(err);
        }

        const {files: {file: [file]}} = result;
        Resource.create(
          {
            resourceId: file.name,
            weblinkUrl: `/resources/${container}/download/${file.name}`,
            originalFilename: file.originalFilename,
            type: file.type,
            container,
          },
          (err, instance) => {
            if (err) return cb(err);
            cb(null, instance);
          }
        );
      });
    });
  };

  Resource.remoteMethod('download', {
    http: {path: '/:container/download/:name', verb: 'get'},
    accepts: [
      {arg: 'container', type: 'string'},
      {arg: 'name', type: 'string'},
      {arg: 'req', type: 'object', http: {source: 'req'}},
      {arg: 'res', type: 'object', http: {source: 'res'}},
    ],
    description: 'download resource',
    returns: [],
  });

  Resource.download = (container, name, req, res, cb) => {
    const {Attachment} = Resource.app.models;
    Attachment.download(container, name, req, res, cb);
  };
};

'use strict';

module.exports = {
  restApiRoot: '/api',
  port: process.env.PORT || 3000,
  remoting: {
    context: false,
    rest: {
      handleErrors: false,
      normalizeHttpPath: false,
      xml: false,
    },
    json: {
      strict: false,
      limit: '100kb',
    },
    urlencoded: {
      extended: true,
      limit: '100kb',
    },
    cors: false,
  },
};

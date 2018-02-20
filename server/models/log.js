'use strict';
const helpers = require('./helpers.js');

module.exports = Log => {
  helpers.disableAllMethods(Log, ['find']);
};

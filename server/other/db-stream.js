'use strict';

function DBStream(app) {
  this.app = app;
}

DBStream.prototype.write = function(rec) {
  if (rec.APIResponseTime === 'NOT_AN_API') return;

  const {Log} = this.app.models;
  Log.create({
    hostname: rec.hostname,
    url: rec['req.url'],
    APIResponseTime: JSON.stringify(rec.APIResponseTime),
    OverallResponseTime: rec.OverallResponseTime,
    msg: rec.msg,
    time: rec.time,
  });
};

module.exports = DBStream;

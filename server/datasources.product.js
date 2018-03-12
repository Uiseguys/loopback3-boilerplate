'use strict';
module.exports = {
  db: {
    name: 'db',
    connector: 'memory',
  },
  mydb: {
    name: 'mydb',
    connector: 'postgresql',
    url: process.env.DATABASE_URL,
    ssl: true,
  },
  myEmail: {
    name: 'myEmail',
    connector: 'mail',
    transports: [
      {
        type: 'smtp',
        host: 'smtp.sendgrid.net',
        secure: false,
        tls: {
          rejectUnauthorized: false,
        },
        port: 587,
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      },
    ],
  },
  storage: {
    name: 'storage',
    connector: 'loopback-component-storage',
    provider: 'filesystem',
    nameConflict: 'makeUnique',
    root: './server/storage',
  },
};

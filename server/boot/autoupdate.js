'use strict';
const path = require('path');

module.exports = app => {
  // only do update if command line options say so
  if (process.argv.indexOf('autoupdate') === -1) return;

  const datasources = app.datasources;
  const sqlDS = app.datasources.mydb;
  const models = require(path.resolve(__dirname, '../model-config.json'));

  async function dbSeed() {
    var User = app.models.CustomUser;
    var Role = app.models.Role;
    var RoleMapping = app.models.RoleMapping;

    try {
      const oldUsers = await User.find({where: {username: 'admin'}});
      if (oldUsers.length) return;

      const users = await User.create([
        {username: 'admin', email: 'admin@admin.com', password: 'admin123'},
      ]);
      console.log('Created users:', users);

      const role = await Role.create({
        name: 'super_admin',
        description: 'Super Admin',
      });
      console.log('Created role:', role);

      const principal = await role.principals.create({
        principalType: RoleMapping.USER,
        principalId: users[0].id,
      });
      console.log('Created principal:', principal);

      await Role.create({
        name: 'admin',
        description: 'Admin',
      });

      await Role.create({
        name: 'editor',
        description: 'Editor',
      });
    } catch (e) {
      console.log(e);
    }
  }

  // from http://stackoverflow.com/questions/23168958/auto-create-mysql-table-with-strongloop
  async function autoUpdateAll() {
    const keys = Object.keys(models);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (
        typeof models[key].dataSource !== 'undefined' &&
        typeof datasources[models[key].dataSource] !== 'undefined'
      ) {
        const result = await app.dataSources[models[key].dataSource].autoupdate(
          key
        );
        console.log(`Model ${key} updated`);
      }
    }
  }

  // check if data source is actual
  sqlDS.isActual(async (err, actual) => {
    if (actual) {
      console.log('MySQL database is consistent with models');
    } else {
      console.log('autoupdating MySQL database...');
      await autoUpdateAll();
    }
    if (process.argv.indexOf('db-seed') !== -1) {
      await dbSeed();
    }
  });
};

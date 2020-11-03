'use strict';

const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';

const db = {};

let sequelize;
if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL);
} else {
    const config = require(__dirname + '/../config/config.json')[env];
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const modelDefiners = [
    {
        name: 'users',
        model: require('./tables/users'),
    },
    {
      name: 'adminsTable',
      model: require('./tables/admins')
  },

];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
    db[modelDefiner.name] = modelDefiner.model(sequelize);
}


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

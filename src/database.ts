import * as Sequelize from 'sequelize';
import * as path from 'path';

const env = process.env.NODE_ENV || 'development';
const SQLITE_PATH = path.join(__dirname, `../example-${env}.sqlite`);

const db = new Sequelize('appname', 'root', 'password', {
  dialect: 'sqlite',
  storage: SQLITE_PATH,
});

export default db;
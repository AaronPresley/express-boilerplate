import * as path from 'path';
import { Sequelize } from 'sequelize';

const db = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../../database.db'),
});

export default db;
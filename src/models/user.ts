import * as Sequelize from 'sequelize';
import db from '../database';

interface UserAttributes {
  id?: number,
  givenName?: string,
  familyName?: string,
  email: string,
  password?: string,
  isAdmin?: boolean,
  createdAt?: Date,
  updatedAt?: Date,
};

interface UserInstance extends Sequelize.Instance<UserAttributes>, UserAttributes {
}

const UserModel: Sequelize.Model<UserInstance, UserAttributes> = db.define<UserInstance, UserAttributes>('User', {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  givenName: {
    type: Sequelize.STRING,
  },
  familyName: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  }
});

export default UserModel;
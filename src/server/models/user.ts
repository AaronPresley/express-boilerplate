import { BuildOptions, Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db';

export interface UserModel extends Model {
  readonly id: number;
  givenName: string;
}

type UserModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): UserModel;
}

const UserModel = <UserModelStatic>sequelize.define('UserModel', {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER.UNSIGNED,
  },
  givenName: {
    type: DataTypes.STRING,
  },
});

export default UserModel;
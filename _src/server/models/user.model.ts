import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment-timezone';
import * as mongoose from 'mongoose';
import config from '../../config';

export interface User extends mongoose.Document{
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  hash?: string;
  salt?: string;
  isAdmin: boolean;
  dateCreated: Date;
  generateJWT: () => string;
  setPassword: (password:string) => void;
  validatePassword: (password:string) => boolean;
};

export const UserSchema = new mongoose.Schema<User>({
  firstName: {
    default: null,
    required:false,
    type: String,
  },
  lastName: {
    default: null,
    required: false,
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hash: {
    type: String,
    default: null,
  },
  salt: {
    type: String,
    default: null,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: moment.utc().toDate() as Date,
  },
});

/**
 * METHODS
 */

UserSchema.methods.toJSON = function() {
  const thisUser:User = this;
  const { _id, firstName, lastName, email, isAdmin, dateCreated } = thisUser;
  return { id:_id, firstName, lastName, email, isAdmin, dateCreated };
};

UserSchema.methods.generateJWT = function() {
    return jwt.sign({
      id: this._id,
    }, config.secret);
};

UserSchema.methods.setPassword = function(password:string) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = function(password:string) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return hash === this.hash;
};

export const UserModel = mongoose.model<User>('User', UserSchema, 'Users', true);
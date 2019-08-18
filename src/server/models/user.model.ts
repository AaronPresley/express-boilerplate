import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';
import * as moment from 'moment-timezone';

import config from '../../config';

export interface User extends mongoose.Document {
  givenName: string;
  familyName: string;
  email: string;
  salt?: string;
  hash?: string;
  dateCreated?: Date;
  dateModified?: Date;

  generateJWT: () => string;
  isValidPassword: (rawPassword: string) => string;
  setPassword: (rawPassword: string) => void;
}

export const UserSchema: mongoose.Schema = new mongoose.Schema({
  givenName: {
    type: String,
  },
  familyName: {
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
  dateCreated: {
    type: Date,
    default: moment.utc().toDate(),
  },
  dateModified: {
    type: Date,
    default: moment.utc().toDate(),
  },
});

// Updating our date modified
UserSchema.pre('save', function(next): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const self: any = this;
  self.dateModified = moment.utc().toDate();
  next();
});

UserSchema.methods.toJSON = function(): object {
  const data = this.toObject();
  delete data.salt;
  delete data.hash;
  return data;
};

UserSchema.methods.generateJWT = function(): string {
  return jwt.sign({ id: this._id }, config.secret, { expiresIn: '14d' });
};

UserSchema.methods.isValidPassword = function(rawPassword: string): boolean {
  return this.hash === crypto.pbkdf2Sync(rawPassword, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.setPassword = function(rawPassword: string): void {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(rawPassword, this.salt, 10000, 512, 'sha512').toString('hex');
};

export default mongoose.model<User>('User', UserSchema);

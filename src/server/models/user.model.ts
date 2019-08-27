import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment-timezone';
import * as mongoose from 'mongoose';
import { appSecret } from '../../config';

export interface User extends mongoose.Document {
  dateCreated?: Date;
  dateModified?: Date;
  email: string;
  familyName: string;
  givenName: string;
  hash?: string;
  isAdmin: boolean;
  salt?: string;

  generateJwt: () => string;
  isValidPassword: (rawPassword: string) => boolean;
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
  isAdmin: {
    type: Boolean,
    default: false,
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

UserSchema.methods.toJSON = function(): JSON {
  const thisUser: User = this;
  const data = thisUser.toObject();
  delete data.hash;
  return data;
};

// ---------- CUSTOM METHODS -----------

/**
 * Creates a JWT auth token with the user's ID
 * @return {string} Return
 */
UserSchema.methods.generateJwt = function(): string {
  return jwt.sign({ id: this._id }, appSecret);
};

/**
 * Sets this user's password to the given raw string (after salting and hashing)
 * @param {string} rawPassword - The raw string to set as the new password
 * @return {void} Return
 */
UserSchema.methods.setPassword = async function(rawPassword: string): Promise<void> {
  const thisUser: User = this;
  const salt = bcrypt.genSaltSync(10);
  thisUser.hash = bcrypt.hashSync(rawPassword, salt);
};

/**
 * Accepts a raw string and returns whether or not it's the user's password
 * @param {string} rawPassword - The raw string to check against
 * @return {boolean} Return
 */
UserSchema.methods.isValidPassword = function(rawPassword: string): boolean {
  const thisUser: User = this;
  return bcrypt.compareSync(rawPassword, thisUser.hash);
};

export default mongoose.model<User>('User', UserSchema);

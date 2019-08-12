import * as mongoose from 'mongoose';
import * as moment from 'moment-timezone';

export interface User extends mongoose.Document {
  givenName: string;
  familyName: string;
  email: string;
  dateCreated?: Date;
  dateModified?: Date;
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
UserSchema.pre('save', function(next) {
  const self: any = this;
  self.dateModified = moment.utc().toDate();
  next();
});

export default mongoose.model<User>('User', UserSchema);

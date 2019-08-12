import * as mongoose from 'mongoose';

export interface User extends mongoose.Document {
  givenName: string;
  familyName: string;
  email: string;
  dateCreated?: Date;
  dateModified?: Date;
}

const UserSchema: mongoose.Schema = new mongoose.Schema({
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
    default: Date.now(),
  },
  dateModified: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model<User>('User', UserSchema);

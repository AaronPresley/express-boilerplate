import * as mongoose from 'mongoose';

export interface UserModel extends mongoose.Document {
  givenName: string;
  familyName: string;
  email: string;
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
});

export default mongoose.model<UserModel>('User', UserSchema);

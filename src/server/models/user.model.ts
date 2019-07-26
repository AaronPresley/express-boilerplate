import mongoose, { Schema, Document } from 'mongoose';

export interface UserModel extends Document {
  givenName: string;
  familyName: string;
  email: string;
}

const UserSchema: Schema = new Schema({
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

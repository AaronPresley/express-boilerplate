import db from '../src/server/database';
import UserModel, { User } from '../src/server/models/user.model';

(async (): Promise<void> => {
  const conn = await db.connect();
  console.log('Connected...');

  await db.clearCollections();
  console.log('Previous data cleared...');

  const user1 = await UserModel.create({
    givenName: 'Tony',
    familyName: 'Danza',
    email: 'theboss@gmail.com',
  });
  user1.setPassword('some-password');
  await user1.save();
  console.log('Created user...');

  process.exit(0);
})();

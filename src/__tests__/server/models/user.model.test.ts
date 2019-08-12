import { Connection } from 'mongoose';
import db from '../../../server/database';
import UserModel, { User } from '../../../server/models/user.model';

describe('UserModel', () => {
  let conn: Connection;

  beforeEach(async () => {
    conn = await db.connect();
    jest.spyOn(global.Date, 'now').mockImplementation(() => new Date(0, 1, 2019) as any);
  });

  afterEach(async () => {
    await db.clearCollections(conn);
  });

  it('should create a new entry', async () => {
    const user: User = await UserModel.create({
      givenName: 'Aaron',
      familyName: 'Presley',
      email: 'some@email.com',
    });

    // Ensure it has the expected fields
    expect(Object.keys(user.toObject())).toEqual([
      'dateCreated',
      'dateModified',
      '_id',
      'givenName',
      'familyName',
      'email',
      '__v',
    ]);

    // Ensure the dates are as expected
    expect(user.dateCreated).toEqual('asdf');
  });
});

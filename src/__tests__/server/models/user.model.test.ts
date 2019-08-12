import * as moment from 'moment-timezone';
import db from '../../../server/database';
import UserModel, { User, UserSchema } from '../../../server/models/user.model';

jest.mock('moment-timezone', () => ({
  utc: () => ({
    toDate: () => new Date(2019, 0, 1),
  }),
}));

describe('UserModel', () => {
  beforeEach(async () => {
    await db.connect();
  });

  afterEach(async () => {
    await db.clearCollections();
  });

  it('should create a new entry', async () => {
    const user: User = await UserModel.create({
      givenName: 'John',
      familyName: 'Smith',
      email: 'john@smith.com',
    });

    // Ensure the fields have the expected values
    expect(user.dateCreated.toISOString()).toEqual('2019-01-01T08:00:00.000Z');
    expect(user.dateModified.toISOString()).toEqual('2019-01-01T08:00:00.000Z');
    expect(user.email).toEqual('john@smith.com');
    expect(user.familyName).toEqual('Smith');
    expect(user.givenName).toEqual('John');

    // Ensure the fields are what we expect
    expect(Object.keys(user.toObject())).toEqual([
      'dateCreated',
      'dateModified',
      '_id',
      'givenName',
      'familyName',
      'email',
      '__v',
    ]);
  });
});

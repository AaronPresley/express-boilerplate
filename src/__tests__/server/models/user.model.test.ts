import db from '../../../server/database';
import UserModel, { User } from '../../../server/models/user.model';

jest.mock('moment-timezone', () => ({
  utc: () => ({
    toDate: () => new Date(2019, 0, 1),
  }),
}));

describe('UserModel', () => {
  let user: User;

  beforeEach(async () => {
    await db.connect();

    user = await UserModel.create({
      givenName: 'John',
      familyName: 'Smith',
      email: 'john@smith.com',
    });
  });

  afterEach(async () => {
    await db.clearCollections();
  });

  it('should create a new entry', async () => {
    // Ensure the fields have the expected values
    expect(user.dateCreated.toISOString()).toEqual('2019-01-01T08:00:00.000Z');
    expect(user.dateModified.toISOString()).toEqual('2019-01-01T08:00:00.000Z');
    expect(user.email).toEqual('john@smith.com');
    expect(user.familyName).toEqual('Smith');
    expect(user.givenName).toEqual('John');
    expect(user.isAdmin).toBe(false);

    // Ensure the fields are what we expect
    expect(Object.keys(user.toJSON())).toEqual([
      'isAdmin',
      'dateCreated',
      'dateModified',
      '_id',
      'givenName',
      'familyName',
      'email',
      '__v',
    ]);
  });

  it('should be able to generate a JWT', () => {
    expect(typeof user.generateJwt()).toEqual('string');
  });

  it('should set a password', async () => {
    expect(user.hash).toEqual(null);
    user.setPassword('some-password');
    await user.save();
    expect(typeof user.hash).toEqual('string');
  });

  it('should be able to validate a password correctly MEOW', async () => {
    user.setPassword('some-password');
    await user.save();
    expect(user.isValidPassword('wrong-pass')).toBe(false);
    expect(user.isValidPassword('some-password')).toBe(true);
  });
});

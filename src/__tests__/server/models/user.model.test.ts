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

    // Ensure the fields are what we expect
    expect(Object.keys(user.toObject())).toEqual([
      'hash',
      'salt',
      'dateCreated',
      'dateModified',
      '_id',
      'givenName',
      'familyName',
      'email',
      '__v',
    ]);
  });

  it('should not show all fields when outputting JSON', async () => {
    // Ensure the fields are what we expect
    expect(Object.keys(user.toJSON())).toEqual([
      'dateCreated',
      'dateModified',
      '_id',
      'givenName',
      'familyName',
      'email',
      '__v',
    ]);
  });

  it('should set the password successfully', async () => {
    expect(user.salt).toBe(null);
    expect(user.hash).toBe(null);
    await user.setPassword('some-password');
    expect(typeof user.salt).toEqual('string');
    expect(typeof user.hash).toEqual('string');
  });

  it('should generate a JWT', async () => {
    expect(typeof user.generateJWT()).toEqual('string');
  });

  it('should validate the correct password', async () => {
    await user.setPassword('some-password');
    await user.save();
    expect(await user.isValidPassword('wrong-password')).toBeFalsy();
    expect(await user.isValidPassword('some-password')).toBeTruthy();
  });
});

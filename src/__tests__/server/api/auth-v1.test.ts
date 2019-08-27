import * as request from 'supertest';
import app, { db } from '../../../../src/server/app';
import UserModel, { User } from '../../../server/models/user.model';
import { logError } from '../../../utils';

jest.mock('../../../utils/log');
jest.mock('moment-timezone', () => ({
  utc: () => ({
    toDate: () => new Date(2019, 0, 1),
  }),
}));

describe('/auth/v1', () => {
  let user: User;

  beforeEach(async () => {
    await db.connect();
    user = await UserModel.create({
      givenName: 'Susan 🍒',
      familyName: 'Espinoza',
      email: 'te@gmail.com',
    } as User);

    user.setPassword('some-password');
    await user.save();
  });

  afterEach(async () => {
    await db.clearCollections();
  });

  describe('getting the current user', () => {
    let authToken;
    beforeEach(() => {
      authToken = user.generateJwt();
    });

    it(`should return the user's info`, async () => {
      const resp = await request(app)
        .get('/api/v1/auth')
        .set('Authorization', authToken)
        .then(r => JSON.parse(r.text));

      expect(Object.keys(resp)).toEqual([
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

    it(`should show an error if no auth header`, async () => {
      const resp = await request(app)
        .get('/api/v1/auth')
        .then(r => JSON.parse(r.text));
      expect(resp).toEqual({
        errors: {
          fields: {
            __global__: `You don't have authorization`,
          },
        },
      });
    });
  });

  describe('logging in', () => {
    it('should show error with unknown email', async () => {
      const resp = await request(app)
        .post('/api/v1/auth')
        .send({
          email: 'some@person.com',
          password: 'wrong-password',
        })
        .then(r => JSON.parse(r.text));

      expect(logError).toHaveBeenCalledTimes(1);
      expect(resp).toEqual({
        errors: {
          fields: {
            __global__: `A user with that email and password combination couldn't be found`,
          },
        },
      });
    });

    it('should show error with an incorrect password', async () => {
      const resp = await request(app)
        .post('/api/v1/auth')
        .send({
          email: 'te@gmail.com',
          password: 'wrong-password',
        })
        .then(r => JSON.parse(r.text));

      expect(resp).toEqual({
        errors: {
          fields: {
            __global__: `A user with that email and password combination couldn't be found`,
          },
        },
      });
    });

    it('should show an auth token with a successful login', async () => {
      const resp = await request(app)
        .post('/api/v1/auth')
        .send({
          email: 'te@gmail.com',
          password: 'some-password',
        })
        .then(r => JSON.parse(r.text));

      expect(Object.keys(resp)).toEqual(['authToken', 'user']);
      expect(typeof resp.authToken).toEqual('string');
      expect(resp.user.givenName).toEqual('Susan 🍒');
      expect(Object.keys(resp.user)).toEqual([
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
  });
});

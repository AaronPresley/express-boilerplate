import * as request from 'supertest';

import { app, db } from '../../../server/app';
import { removeAllCollections } from '../../../server/utils/fixtures';
import { UserModel, User } from '../../../server/models';

import { requiresAuth } from '../../../server/utils/decorators';

describe('requiresAuth', () => {
  let conn;
  let user:User;
  let token:string;

  let statusFn;
  let jsonFn;
  let req;
  let res;
  let next;

  const email = 'some@user.com';
  const password = 'some-password';

  beforeAll(async () => {
    conn = await db.connect();
  });

  afterAll(async () => {
    await conn.close()
  });

  beforeEach(async () => {
    await removeAllCollections();
    
    user = await UserModel.create({ email });
    user.setPassword(password)
    await user.save();
    
    token = await request(app)
      .post('/api/v1/auth/')
      .send({ email, password })
      .then(resp => JSON.parse(resp.text).token);

    statusFn = jest.fn();
    jsonFn = jest.fn();

    req = {
      headers: {
        authorization: `JWT ${token}`,
      }
    };

    res = {
      status: () => { statusFn(); return { json: jsonFn }; },
    };

    next = jest.fn();
  });

  describe('with an invalid auth header', () => {
    beforeEach(() => {
      req.headers.authorization = 'WRONG THING';
    });

    it('should throw an error', async () => {
      await requiresAuth(true)(req, res, next);
      expect(jsonFn.mock.calls[0][0].errors).toEqual({
        __global__: `You're not authorized`,
      });
    });
  });

  describe('with an invalid token', () => {
    beforeEach(() => {
      req.headers.authorization = 'JWT some-stupid-token';
    });

    it('should throw an error', async () => {
      await requiresAuth(true)(req, res, next);
      expect(jsonFn.mock.calls[0][0].errors).toEqual({
        __global__: `You're not authorized`,
      });
    });
  });

  describe('with normal users', () => {
    it('should call next', async () => {
      await requiresAuth()(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should error if validating for super admin', async () => {
      await requiresAuth(true)(req, res, next);
      expect(jsonFn.mock.calls[0][0].errors).toEqual({
        __global__: `You're not authorized`,
      });
    });
  });

  describe('with admin users', () => {
    beforeEach(async () => {
      user.isAdmin = true;
      await user.save();
    });

    it('should call next', async () => {
      await requiresAuth()(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should call next when testing for a super admin', async () => {
      await requiresAuth(true)(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

});
import * as request from 'supertest';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { db } from '../../../src/server/app';
import { requiresAuth } from '../../../src/utils/auth-helpers';
import UserModel, { User } from '../../server/models/user.model';

// import { NextFunction, Request, Response } from 'express';

describe('auth-helpers', () => {
  let app;
  let user: User;
  const expectedErr = {
    errors: {
      fields: {
        __global__: `You don't have authorization`,
      },
    },
  };

  beforeEach(async () => {
    await db.connect();

    user = await UserModel.create({ email: 'some@email.com' } as User);

    app = express();
    app.use(bodyParser.json());
    app.use('/user-test', requiresAuth(), (req, res) => res.send(`You're a user`));
    app.use('/admin-test', requiresAuth(true), (req, res) => res.send(`You're an admin`));
  });

  afterEach(async () => {
    await db.clearCollections();
  });

  it('should return an error with no auth header', async () => {
    const resp = await request(app)
      .get('/user-test')
      .then(r => JSON.parse(r.text));
    expect(resp).toEqual(expectedErr);
  });

  it('should return an error with an invalid auth header', async () => {
    const resp = await request(app)
      .get('/user-test')
      .set('Authorization', 'bad-token-here')
      .then(r => JSON.parse(r.text));
    expect(resp).toEqual(expectedErr);
  });

  it('should return an error with a valid token for an unknown user', async () => {
    const authToken = user.generateJwt();
    await UserModel.findByIdAndDelete(user.id);
    const resp = await request(app)
      .get('/user-test')
      .set('Authorization', authToken)
      .then(r => JSON.parse(r.text));
    expect(resp).toEqual(expectedErr);
  });

  it('should return the expected route response', async () => {
    const resp = await request(app)
      .get('/user-test')
      .set('Authorization', user.generateJwt())
      .then(r => r.text);
    expect(resp).toEqual(`You're a user`);
  });

  it(`should show an error if the user isn't an admin`, async () => {
    const resp = await request(app)
      .get('/admin-test')
      .set('Authorization', user.generateJwt())
      .then(r => JSON.parse(r.text));
    expect(resp).toEqual(expectedErr);
  });

  it('should validate an admin correctly', async () => {
    user.isAdmin = true;
    await user.save();

    const resp = await request(app)
      .get('/admin-test')
      .set('Authorization', user.generateJwt())
      .then(r => r.text);
    expect(resp).toEqual(`You're an admin`);
  });

  it('should add the user data to the request', async () => {
    app.use('/session-test', requiresAuth(), (req, res) => {
      const { user } = res.locals;
      res.send(user.toJSON());
    });

    const resp = await request(app)
      .get('/session-test')
      .set('Authorization', user.generateJwt())
      .then(r => JSON.parse(r.text));

    expect(Object.keys(resp)).toEqual(['isAdmin', 'dateCreated', 'dateModified', '_id', 'email', '__v']);
  });
});

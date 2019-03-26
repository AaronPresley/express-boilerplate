import * as request from 'supertest';
import { app, db } from '../../../server/app';
import { removeAllCollections } from '../../../server/utils/fixtures';
import { UserModel, User } from '../../../server/models';

describe('/auth', () => {
  let conn;
  let user: User;

  beforeAll(async () => {
    conn = await db.connect();
  });

  afterAll(async () => {
    await conn.close()
  });

  beforeEach(async () => {
    await removeAllCollections();

    // Creating a new user
    user = await UserModel.create({
      email: 'some@user.com',
    });

    // Setting the password
    user.setPassword('some-password');
    await user.save();
  });

  it('should show expected response with valid credentials', async () => {
    const resp = await request(app)
      .post('/api/v1/auth/')
      .send({
        email: 'some@user.com',
        password: 'some-password',
      })
      .then(resp => JSON.parse(resp.text));
    
    expect(Object.keys(resp)).toEqual(['user', 'token']);
    expect(Object.keys(resp.user)).toEqual([
      'id', 'firstName', 'lastName', 'email', 'isAdmin',
      'dateCreated'
    ]);
  });
  
  it('should show expected response with invalid credentials', async () => {
    const resp = await request(app)
      .post('/api/v1/auth/')
      .send({
        email: 'some@user.com',
        password: 'wrong-password',
      })
      .then(resp => JSON.parse(resp.text).errors)

    expect(resp).toEqual({
      __global__: `That email and password combination couldn't be found`,
    });
  });

  it('should error when no credentials are passed', async () => {
    const resp = await request(app)
      .post('/api/v1/auth/')
      .send({})
      .then(resp => JSON.parse(resp.text).errors)

    expect(resp).toEqual({
      __global__: `Email and password are required`,
    });
  });

  it('should authorize users', async () => {
    const token = await request(app)
      .post('/api/v1/auth/')
      .send({
        email: 'some@user.com',
        password: 'some-password',
      })
      .then(resp => JSON.parse(resp.text).token)

    const resp = await request(app)
      .get('/api/v1/auth/protected/any-user')
      .set('Authorization', `JWT ${token}`)
      .then(resp => resp.text);
    expect(resp).toEqual(`You're authorized!`);
  });

  it('should authorize admin users', async () => {
    user.isAdmin = true;
    await user.save();

    const token = await request(app)
      .post('/api/v1/auth/')
      .send({
        email: 'some@user.com',
        password: 'some-password',
      })
      .then(resp => JSON.parse(resp.text).token)

    const resp = await request(app)
      .get('/api/v1/auth/protected/admin-user')
      .set('Authorization', `JWT ${token}`)
      .then(resp => resp.text);
    expect(resp).toEqual(`You're a super admin!`);
  });
});
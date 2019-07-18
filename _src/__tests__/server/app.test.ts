import * as request from 'supertest';
import { removeAllCollections } from '../../server/utils/fixtures'
import { app, db } from '../../server/app';

describe('App Example', () => {
  let conn;
  
  beforeAll(async () => {
    conn = await db.connect();
  });

  afterAll(async () => {
    await conn.close()
  });
  
  beforeEach(async () => {
    await removeAllCollections();
  });
  
  it('should load the index file by default', async () => {
    const result = await request(app).get('/');
    expect(result.status).toEqual(200);
    expect(result.text).toContain('<!DOCTYPE html>');
  });
});
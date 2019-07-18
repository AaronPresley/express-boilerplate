import { removeAllCollections } from '../../../server/utils/fixtures';
import { db } from '../../../server/app';
import { UserModel } from '../../../server/models';

describe('removeAllCollections', () => {
  let conn;

  beforeAll(async () => {
    conn = await db.connect();
  });

  afterAll(async () => {
    await conn.close()
  });

  beforeEach(async () => {
    await removeAllCollections();

    await UserModel.create({
      email: 'some@user.com',
    });
  });

  it('should remove all things', async () => {
    expect(await UserModel.find({})).toHaveLength(1);
    await removeAllCollections();
    expect(await UserModel.find({})).toHaveLength(0);
  });

  it('should error on production', async () => {
    try {
      await removeAllCollections('invalid-env')
      fail(`Didn't throw an error when it should have`);
    } catch (err) {
      expect(err.message)
        .toEqual('Can only reset collections on development, test');
    }
  });
});
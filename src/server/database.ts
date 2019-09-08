import * as mongoose from 'mongoose';

const COLLECTION_NAME = 'appname';
const MONGO_URL = `mongodb://localhost:27017`;
const isTest = process.env.NODE_ENV === 'test';

const randomString = () =>
  Math.random()
    .toString(36)
    .substring(2, 7);

export default {
  connect: async (): Promise<mongoose.Connection> => {
    const connectUrl = `${MONGO_URL}/${COLLECTION_NAME}${isTest ? `-test-${randomString()}` : ''}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mongoose.Promise as any) = Promise;
    const mg = await mongoose.connect(connectUrl, {
      useCreateIndex: true,
      useNewUrlParser: true,
    });
    return mg.connection;
  },

  clearCollections: async (): Promise<void> => {
    (await mongoose.connection.db.collections()).forEach((c): void => {
      // A weird bug which was fixed by https://stackoverflow.com/q/42968840
      c.drop().catch((): Promise<void> => c.drop());
    });
  },
};

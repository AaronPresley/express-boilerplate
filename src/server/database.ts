import * as mongoose from 'mongoose';

const COLLECTION_NAME = 'appname';
const MONGO_URL = `mongodb://localhost:27017`;

export default {
  connect: async (isTest: boolean = false): Promise<mongoose.Connection> => {
    const connectUrl = `${MONGO_URL}/${COLLECTION_NAME}${isTest ? process.env.TEST_SUITE : ''}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mongoose.Promise as any) = Promise;
    const mg = await mongoose.connect(connectUrl, {
      useCreateIndex: true,
      useNewUrlParser: true,
    });
    return mg.connection;
  },

  clearCollections: async (connection: mongoose.Connection): Promise<void> => {
    const calls: Promise<void>[] = [];
    (await mongoose.connection.db.collections()).forEach((c): void => {
      calls.push(c.drop());
    });
    await Promise.all(calls);
  },
};

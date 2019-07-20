import * as mongoose from 'mongoose';

const connectUrl = `mongodb://localhost:27017/appname`;

export default ({
  connect: async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mongoose.Promise as any) = Promise;
    const mg = await mongoose.connect(connectUrl, {
      useCreateIndex: true,
      useNewUrlParser: true,
    });
    return mg.connection;
  },
});
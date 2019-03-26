import * as mongoose from 'mongoose';
import config from '../config';

const connectUrl = `${config.dbAddress}/${config.dbName}`;

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
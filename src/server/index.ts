/* eslint-disable no-console, @typescript-eslint/explicit-function-return-type */
import * as mongoose from 'mongoose';

import db from './database';
import { app } from './app';

const isProd = process.env.NODE_ENV === 'production';

const startServer = () => app.listen(8080, () => {
  let output = `🚨 Booting in DEV mode`
  if (isProd) {
    output = `✅ Booting in PROD mode`;
  }
  console.log(output);
  console.log(`App running at http://localhost:8080/`);
});

db.connect();
mongoose.connection
  .on('error', console.error)
  .on('disconnected', () => console.error('Disconnected!'))
  .once('open', startServer);
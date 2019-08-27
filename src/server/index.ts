/* eslint no-console: 0 */
import * as mongoose from 'mongoose';
import app, { IS_PROD, db } from './app';
import { Server } from 'http';

const PORT = 8080;

const startServer = (): Server =>
  app.listen(PORT, (): void => {
    let output = `✅ Booting up in DEV mode`;
    if (IS_PROD) {
      output = `✅ Booting in PROD mode`;
    }
    console.log(output);
    console.log(`✅ App running at http://localhost:${PORT}/`);
  });

db.connect();
mongoose.connection
  .on('error', (err): void => console.error(`🚨 ${err}`))
  .on('disconnected', (): void => console.log('🚨 Mongoose disconnected'))
  .once('open', (): void => {
    console.log('✅ Mongoose Connected');
    startServer();
  });

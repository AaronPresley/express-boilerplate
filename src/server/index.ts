/* eslint no-console: 0 */
import * as mongoose from 'mongoose';
import app, { IS_PROD, db } from './app';

const PORT = 8080;

const startServer = () => app.listen(PORT, () => {
  let output = `✅ Booting up in DEV mode`;
  if (IS_PROD) {
    output = `✅ Booting in PROD mode`;
  }
  console.log(output);
  console.log(`✅ App running at http://localhost:${PORT}/`);
});

db.connect();
mongoose.connection
  .on('error', (err) => console.error(`🚨 ${err}`))
  .on('disconnected', () => console.log('🚨 Mongoose disconnected'))
  .once('open', () => {
    console.log('✅ Mongoose Connected');
    startServer()
  });
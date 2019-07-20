/* eslint no-console: 0 */
import app, { IS_PROD } from './app';
import sequelize from '../config/db';

const PORT = 8080;

sequelize.sync({ force: true });
app.listen(PORT, () => {
  let output = `🚨 Booting up in DEV mode`;
  if (IS_PROD) {
    output = `✅ Booting in PROD mode`;
  }
  console.log(output);
  console.log(`App running at http://localhost:${PORT}/`);
});
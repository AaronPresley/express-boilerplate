import * as http from 'http';
import app from './app';

const server:http.Server = app.listen(8080, () => {
  console.log(`--- DEV MODE ---`);
  console.log(`App running at http://localhost:8080/`);
});

export default server;
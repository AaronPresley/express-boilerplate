import * as http from 'http';
import app from './app';

const isProd = process.env.NODE_ENV === 'production' ? true : false;

const server:http.Server = app.listen(8080, () => {
  console.log(`--- ${isProd ? 'PROD' : 'DEV'} MODE ---`);
  console.log(`App running at http://localhost:8080/`);
});

export default server;
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as path from 'path';
import * as webpack from 'webpack';
import * as wpMiddleware from 'webpack-dev-middleware';
import wpConfig from '../../webpack.config';

// --- Model Imports ---
import './models/user.model';
// ---------------------

// --- Route Imports ---
import authRouterV1 from './api/auth-v1';
// ---------------------

export { default as db } from './database';
export const STATIC_PATH = path.join(__dirname, '../../dist');
export const IS_PROD = process.env.NODE_ENV === 'production';

const app: express.Application = express();

// App setup
app.use(bodyParser.json());
app.use('/static/', express.static(STATIC_PATH));

if (!IS_PROD && process.env.NODE_ENV !== 'test') {
  const compiler = webpack(wpConfig);
  app.use(
    wpMiddleware(compiler, {
      writeToDisk: true,
    }),
  );
}

// Our API routes
app.use('/api/v1/auth', authRouterV1);

// Everything else should go to our frontend
app.get('*', (req, res): void => {
  res.sendFile(path.resolve(STATIC_PATH, 'index.html'));
});

export default app;

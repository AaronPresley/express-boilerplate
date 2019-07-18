/* eslint-disable global-require, import/no-dynamic-require */

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';

import authRoute from './api/auth';

const STATIC_PATH = path.join(__dirname, '../../dist');
const IS_PROD = process.env.NODE_ENV === 'production';

export { default as db } from './database';
export const app: express.Application = express();

// Bootstrapping our models
const modelPath = path.join(__dirname, 'models');
fs.readdirSync(modelPath)
  .filter(file => file.indexOf('model.ts') > -1)
  .forEach(file => require(`${modelPath}/${file}`));

// Using body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/static/', express.static(STATIC_PATH));

// Initializing our routes
app.use('/api/v1/auth', authRoute);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(STATIC_PATH, 'index.html'));
});

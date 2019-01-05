import * as express from 'express';
import exampleRoute from './api/example';

import db from './database';
import UserModel from './models/user';
import { Sequelize } from 'sequelize';

const app:express.Application = express();

// Declaring our API endpoints here
app.use('/api/v1/example', exampleRoute);

app.use('/api/v1/user', async (req: express.Request, resp: express.Response, next: express.NextFunction) => {
  await db.sync({ force: true });

  try {
    const thisUser = await UserModel.create({
      familyName: 'Tony',
      givenName: 'Danza',
      email: 'some@user.com',
    });
    
    return resp.json(thisUser.toJSON());
  }
  catch(err) {
    return resp.json(err.errors);
  }
});

// All other routes land here
app.use('*', (req:express.Request, resp:express.Response, next:express.NextFunction) => {
  resp.set('Content-Type', 'text/html');
  resp.send(new Buffer('<p>Hello, World</p>'));
});

export default app;
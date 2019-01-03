import * as express from 'express';
import exampleRoute from './api/example';

const app:express.Application = express();

// Declaring our API endpoints here
app.use('/api/v1/example', exampleRoute);

// All other routes land here
app.use('*', (req:express.Request, resp:express.Response, next:express.NextFunction) => {
  resp.set('Content-Type', 'text/html');
  resp.send(new Buffer('<p>Hello, World</p>'));
});

export default app;
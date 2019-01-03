import * as express from 'express';

const app:express.Application = express();

app.use('*', (req:express.Request, resp:express.Response, next:express.NextFunction) => {
  resp.set('Content-Type', 'text/html');
  resp.send(new Buffer('<p>Hello, World</p>'));
});

export default app;
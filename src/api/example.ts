import * as express from 'express';
const router:express.Router = express.Router();

router.get('/', (req: express.Request, resp: express.Response, next: express.NextFunction) => {
  resp.json({
    hello: 'world',
  });
});

export default router;
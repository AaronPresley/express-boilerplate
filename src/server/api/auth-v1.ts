import { Router, Request, Response } from 'express';
import { schemaMiddleware } from '../../utils';
import AuthSchemaV1 from './auth-v1-schema';

const router: Router = Router();

router.get('/', (req: Request, res: Response): void => {
  res.send({ hi: 'world' });
});

router.post('/', schemaMiddleware(AuthSchemaV1), (req: Request, res: Response): void => {
  res.status(204).send();
});

export default router;

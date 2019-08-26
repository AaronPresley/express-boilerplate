import { Router, Request, Response } from 'express';
import { schemaMiddleware, requiresAuth, logError } from '../../utils';
import UserModel, { User } from '../models/user.model';
import AuthSchemaV1 from './auth-v1-schema';

const router: Router = Router();

router.get('/', requiresAuth(), (req: Request, res: Response): void => {
  res.send({ hi: 'world' });
});

router.post(
  '/',
  schemaMiddleware(AuthSchemaV1),
  async (req: Request, res: Response): Promise<void> => {
    const { email, password: rawPassword } = req.body;
    let foundUser: User;

    try {
      foundUser = await UserModel.findOne({ email });

      if (!foundUser) {
        throw new Error(`User with email ${email} doesn't exist`);
      } else if (!foundUser.isValidPassword(rawPassword)) {
        throw new Error(`User with email ${email} attempted to login with an incorrect password`);
      }
    } catch (err) {
      logError(err);
      res.status(404).send({
        errors: {
          fields: {
            __global__: `A user with that email and password combination couldn't be found`,
          },
        },
      });
      return;
    }

    const authToken = foundUser.generateJwt();
    res.status(200).send({
      authToken,
      user: foundUser.toJSON(),
    });
  },
);

export default router;

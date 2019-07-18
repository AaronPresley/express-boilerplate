import * as exp from 'express';
import * as mongoose from 'mongoose';

import { UserModel } from '../models';
import { requiresAuth } from '../utils/decorators';

const { ValidationError } = mongoose.Error;
const router:exp.Router = exp.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    const err = new ValidationError();
    err.addError('__global__', 'Email and password are required');
    return res.status(400).send(err);
  }

  const user = await UserModel.findOne({ email});
  if (!user || !user.validatePassword(password)) {
    const err = new ValidationError();
    err.addError('__global__', `That email and password combination couldn't be found`);
    return res.status(400).send(err);
  }

  return res.json({
    user: user.toJSON(),
    token: user.generateJWT()
  });
});

router.get('/protected/any-user', requiresAuth(), (req, res) => {
  // const { authorizedUser } = res;
  res.send(`You're authorized!`);
});

router.get('/protected/admin-user', requiresAuth(true), (req, res) => {
  // const { authorizedUser } = res;
  res.send(`You're a super admin!`);
});

export default router;
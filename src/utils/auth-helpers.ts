import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';
import { appSecret } from '../config';
import UserModel, { User } from '../server/models/user.model';

/**
 * A middleware function that ensures the user is authorized
 * @param {boolean} requireAdmin - Whether to require the user to be an admin
 */
export const requiresAuth = (requireAdmin: boolean = false): RequestHandler => async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let payload;
  const {
    headers: { authorization },
  } = req;

  // The error to send in various instances
  const errMsg = {
    errors: {
      fields: {
        __global__: `You don't have authorization`,
      },
    },
  };

  // Ensuring we have an auth token present
  if (!authorization) {
    res.status(401).send(errMsg);
    return;
  }

  // Decode the auth token
  try {
    payload = jwt.verify(authorization, appSecret);
  } catch (err) {
    res.status(401).send(errMsg);
    return;
  }

  // Ensure the token connects to a valid user
  const user: User = await UserModel.findById(payload.id);
  if (user === null) {
    res.status(401).send(errMsg);
    return;
  }

  if (requireAdmin && !user.isAdmin) {
    res.status(401).send(errMsg);
    return;
  }

  res.locals.user = user;
  next();
};

/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';
import { ExpressResponse, ExpressRequest, NextFunction } from '../../types';

import { UserModel } from '../models';

export const requiresAuth = (requireAdmin:boolean = false) => 
  async (req:ExpressRequest, res:ExpressResponse, next:NextFunction) => {
  const { authorization } = req.headers;

  // We want to return the same error for several possible error states
  const returnError = () => {
    const err = new mongoose.Error.ValidationError();
    err.addError('__global__', `You're not authorized`)
    return res.status(403).json(err);
  }
  
  // Ensure we have a token
  if (!authorization.startsWith('JWT')) {
    return returnError();
  }
  
  // Extract the data from the token
  const token = authorization.replace('JWT', '').trim();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jwtData:any = jwt.decode(token);
  if (!jwtData) {
    return returnError();
  }

  // Find the user and ensure they're an admin
  const { id } = jwtData;
  const foundUser = await UserModel.findById(id);
  if (!foundUser || (requireAdmin && !foundUser.isAdmin)) {
    return returnError();
  }

  // Add the user to the response
  res.authorizedUser = foundUser;

  return next();
};
import { Schema, Validator, ValidationError } from 'jsonschema';
import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from 'express-serve-static-core';

const v = new Validator();

export const generateErrorMessage = (errors: ValidationError[]): object => {
  let fields = {};
  errors.forEach((e): void => {
    const fieldName = e.argument;
    const errType = e.name || null;
    let message = `Unknown error type of ${errType}`;
    if (errType === 'required') {
      message = `${fieldName} is required`;
    }
    fields[fieldName] = message;
  });
  return fields;
};

const schemaMiddleware = (schema: Schema): RequestHandler => (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { body } = req;
  const { errors } = v.validate(body, schema);

  if (errors.length) {
    res.status(400).send({
      errors: generateErrorMessage(errors),
    });
  } else {
    next();
  }
};

export default schemaMiddleware;

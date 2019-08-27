import { Validator, ValidationError } from 'jsonschema';
import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { APSchema } from '../types';

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

const schemaMiddleware = (schema: APSchema): RequestHandler => (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const queryErrors = [];
  const { body, query } = req;

  // Ensuring the schema passes
  const { errors } = v.validate(body, schema.schema);

  Object.keys(query).forEach((field): void => {
    if (schema.allowedParams && !schema.allowedParams.includes(field)) {
      queryErrors.push(`"${field}" is not an allowed parameter`);
    }
  });

  if (Object.keys(errors).length || queryErrors.length) {
    res.status(400).send({
      errors: {
        params: (queryErrors.length && queryErrors) || null,
        fields: (Object.keys(errors).length && generateErrorMessage(errors)) || null,
      },
    });
  } else {
    next();
  }
};

export default schemaMiddleware;

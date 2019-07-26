import { Schema, Validator, ValidationError, ValidatorResult } from 'jsonschema';
import { Router, Request, Response, NextFunction } from 'express';

const v = new Validator();

export const generateErrorMessage = (errors: ValidationError[]): object => {
  let fields = {};
  errors.forEach(e => {
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

const schemaMiddleware = (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
  const { body } = req;
  const { errors } = v.validate(body, schema);
  if (errors.length) {
    return res.status(400).send({
      errors: generateErrorMessage(errors),
    });
  }
  next();
};

export default schemaMiddleware;

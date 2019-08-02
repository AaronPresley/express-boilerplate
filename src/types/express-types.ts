/* eslint-disable @typescript-eslint/no-empty-interface */
import * as express from 'express';
import { Schema } from 'jsonschema';

export interface ExpressRequest extends express.Request {}

export interface ExpressResponse extends express.Response {
  authorizedUser?: object;
}

export interface NextFunction extends express.NextFunction {}

export interface APSchema {
  allowedParams?: string[];
  schema?: Schema;
}

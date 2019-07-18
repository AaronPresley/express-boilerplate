/* eslint-disable @typescript-eslint/no-empty-interface */
import * as express from 'express';

export interface ExpressRequest extends express.Request {}

export interface ExpressResponse extends express.Response {
  authorizedUser?: object;
}

export interface NextFunction extends express.NextFunction {}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action as ReduxAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

export interface Action<Type extends string, Payload = null> extends ReduxAction<Type> {
  type: Type;
  payload: Payload;
}

export interface SimpleAction<Type extends string> extends ReduxAction<Type> {
  type: Type;
}

export type Thunk = ThunkAction<void, { [key: string]: any }, void, any>;

export interface Payload {
  [key: string]: any;
}

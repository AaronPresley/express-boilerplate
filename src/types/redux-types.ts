import { Action as ReduxAction } from 'redux';

export interface Action<Type extends string, Payload = null> extends ReduxAction<Type> {
  type: Type;
  payload: Payload;
}

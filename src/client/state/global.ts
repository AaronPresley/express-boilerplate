import { Dispatch } from 'redux';
import { Action, Thunk } from '../../types';
import { Reducer } from 'react';

export enum ActionTypes {
  SET_USER_DATA = 'appname/global/SET_USER_DATA',
}

export type Actions = Action<ActionTypes.SET_USER_DATA>;

export const initialState = {
  userData: {},
};

export type StateShape = typeof initialState;

const reducer: Reducer<StateShape, Actions> = (
  state: StateShape = initialState,
  action: Actions | null = { type: null, payload: null },
): StateShape => {
  switch (action.type) {
    case ActionTypes.SET_USER_DATA:
      return {
        ...state,
        userData: action.payload,
      };

    default:
      return state;
  }
};

export const setUserData = (userData: object): Thunk => (dispatch: Dispatch): void => {
  dispatch({
    type: ActionTypes.SET_USER_DATA,
    payload: userData,
  });
};

export default reducer;

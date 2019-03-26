import { Reducer, Dispatch } from 'redux';
import { Action } from '../../types';

export enum ActionTypes {
  SET_USER_DATA = 'appname/global/SET_USER_DATA',
};

export type Actions = 
  | Action<ActionTypes.SET_USER_DATA>;

export const initialState = {
  userData: {},
};

export type StateShape = typeof initialState;

export default ((
  state = initialState as StateShape,
  action = {} as Actions,
):StateShape => {
  switch (action.type) {
    case ActionTypes.SET_USER_DATA:
      return {
        ...state,
        userData: action.payload,
      }

    default:
      return state;
  }
}) as Reducer<StateShape, Actions>;

export const setUserData = (userData:object) => (dispatch:Dispatch) => {
  dispatch({
    type: ActionTypes.SET_USER_DATA,
    payload: userData,
  });
};
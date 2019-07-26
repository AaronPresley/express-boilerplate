import { createStore, applyMiddleware, Store } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './index';

export default function configureStore(initialState = {}): Store {
  const createStoreWithMiddleware: Function = applyMiddleware(thunk)(createStore);

  // Arguments when we're on Production
  const args = [rootReducer, initialState];

  // Enable dev tools if we're not on Production
  if (process.env.NODE_ENV !== 'production') {
    args.push(composeWithDevTools());
  }

  // Initialize the Store
  return createStoreWithMiddleware(...args);
}

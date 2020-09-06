import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { persistStore, persistCombineReducers, autoRehydrate } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import reducers from '../reducers';

const config = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['post', 'messages']
};

const reducer = persistCombineReducers(config, reducers);

export default function configureStore(initialState = {}) {
  const store = createStore(
    reducer,
    initialState,
    applyMiddleware(thunk, /*logger*/)
  );

  const persistor = persistStore(store);
  return { persistor, store };
}
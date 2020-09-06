import React from 'react';
import SwitchNavigator from './navigation/SwitchNavigator.js'
import reducer from './reducers'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react';
// import configureStore from './store';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import firebase from './config/firebase'
import {decode, encode} from 'base-64'

if (!global.btoa) {  global.btoa = encode }

if (!global.atob) { global.atob = decode }

const middleware = applyMiddleware(thunkMiddleware, /*logger*/)
const store = createStore(reducer, middleware);
console.disableYellowBox = true;

// to debug network
// if(__DEV__) {
//   import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
// }


export default class App extends React.Component {

  render() {
    
    return (
      <Provider store={store}>
        <SwitchNavigator />
      </Provider>
    );
  }
}

import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
// import { GoogleSignin } from 'react-native-google-signin';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import reducers from './app/reducers';
import Router from './app/Router';
import { initializeApp } from './reference';

type Props = {};
const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

export default class App extends Component<Props> {
  state = { isSignIn: null };

  componentWillMount() {
    const firebase = require('firebase');

    initializeApp(firebase);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ isSignIn: true });
      } else {
        this.setState({ isSignIn: false });
      }
      //console.log('isSignIn: ', this.state.isSignIn, user);
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />
        <Provider store={store}>
          <Router isSignIn={this.state.isSignIn} />
        </Provider>
      </View>
    );
  }
}

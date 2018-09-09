import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'

import reducers from './app/reducers'
import Router from './app/Router'
import { initializeApp } from './reference'
import Loading from './app/components/common/Loading'
import AppNav from './app/AppNav'
import ImportPopup from './app/components/home/ImportPopup'

type Props = {};
const store = createStore(reducers, {}, applyMiddleware(ReduxThunk))

export default class App extends Component<Props> {
  state = { isSignIn: null };

  componentWillMount() {
    const firebase = require('firebase')

    initializeApp(firebase)
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ isSignIn: user.emailVerified })
      } else {
        this.setState({ isSignIn: false })
      }
      // console.log('app: ', this.state.isSignIn, user);
    })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />
        <Provider store={store}>
          <Router isSignIn={this.state.isSignIn} />
        </Provider>
        <ImportPopup ref={(ref) => {
          AppNav.import = ref
        }}
        />
        <Loading
          size="large"
          ref={(ref) => {
            AppNav.loading = ref
          }}
        />
      </View>
    )
  }
}

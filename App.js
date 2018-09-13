import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import Toast from './app/components/common/Toast'

import Router from './app/Router'
import { initializeApp } from './reference'
import Loading from './app/components/common/Loading'
import AppNav from './app/AppNav'
import ImportPopup from './app/components/home/ImportPopup'

type Props = {};

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
      console.log('app: ', this.state.isSignIn, user)
    })
    firebase.auth().signOut()
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />
        <Router isSignIn={this.state.isSignIn} />
        <ImportPopup ref={(ref) => { AppNav.import = ref }} />
        <Toast
          ref={(ref) => { AppNav.toast = ref }}
          style={{ borderRadius: 1 }}
          positionValue={80}
          fadeInDuration={200}
          fadeOutDuration={500}
          opacity={0.7}
        />
        <Loading
          size="large"
          ref={(ref) => { AppNav.loading = ref }}
        />
      </View>
    )
  }
}

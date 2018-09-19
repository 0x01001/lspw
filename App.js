import React, { Component } from 'react'
import { View, StatusBar, NetInfo } from 'react-native'
import Toast from './app/components/common/Toast'

import Router from './app/Router'
import { initializeApp } from './reference'
import Loading from './app/components/common/Loading'
import AppNav from './app/AppNav'
import AppState from './app/AppState'
// import ImportPopup from './app/components/home/ImportPopup'
import appStyle from './app/utils/app_style'
import Notify from './app/components/common/Notify'
import AccountStore from './app/models'

type Props = {};
export default class App extends Component<Props> {
  state = { isSignIn: null };

  componentWillMount() {
    const firebase = require('firebase')
    initializeApp(firebase)

    firebase.auth().onAuthStateChanged((user) => {
      if (user && user.emailVerified) {
        this.setState({ isSignIn: true })
        AccountStore.load()
        AppNav.reset()
      } else {
        this.setState({ isSignIn: false })
      }
      // console.log('app: ', this.state.isSignIn, user)
    })

    NetInfo.addEventListener('connectionChange', this.connectionChange)

    console.disableYellowBox = true
  }

  connectionChange = (connect) => {
    const type = connect.type === 'none' ? 'offline' : 'online'
    if (connect.type === 'none') {
      AppNav.showNotify('No internet connection', { backgroundColor: appStyle.redColor }, { color: appStyle.mainColor })
    }
    AppState.setInternetConnect(type)
  }

  renderContent = () => {
    if (this.state.isSignIn === null) {
      return <Loading size="large" visible />
    }
    return <Router />
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: appStyle.backgroundColor }}>
        <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />
        {this.renderContent()}
        {/* <ImportPopup ref={(ref) => { AppNav.import = ref }} /> */}
        <Notify ref={(ref) => { AppNav.notify = ref }} />
        <Toast
          ref={(ref) => { AppNav.toast = ref }}
          style={{ borderRadius: 1 }}
          positionValue={80}
          fadeInDuration={200}
          fadeOutDuration={500}
          opacity={0.7}
        />
        <Loading size="large" ref={(ref) => { AppNav.loading = ref }} />
      </View>
    )
  }
}

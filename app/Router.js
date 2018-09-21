import React, { Component } from 'react'
import { Animated, Easing, View, TouchableOpacity, StatusBar, StyleSheet } from 'react-native'
import { createDrawerNavigator, createStackNavigator } from 'react-navigation'
import Icon from 'react-native-vector-icons/SimpleLineIcons'

import Login from './screens/Login'
import SignUp from './screens/SignUp'
import ForgotPassword from './screens/ForgotPassword'
import Home from './screens/Home'
import Detail from './screens/Detail'
import appStyle from './utils/app_style'
import Layout from './utils/layout'
import MenuLeft from './components/home/MenuLeft'
import AppNav from '../app/AppNav'
import Unlock from '../app/screens/Unlock'

const top = Layout.getExtraTopAndroid()

class Router extends Component {
  renderContent = () => {
    const transitionConfig = () => ({
      transitionSpec: {
        duration: 500,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
        useNativeDriver: true
      },
      screenInterpolator: (sceneProps) => {
        const { layout, position, scene } = sceneProps

        const thisSceneIndex = scene.index
        const width = layout.initWidth

        const translateX = position.interpolate({
          inputRange: [thisSceneIndex - 1, thisSceneIndex],
          outputRange: [width, 0]
        })

        return { transform: [{ translateX }] }
      }
    })

    const navigationOptions = ({ navigation }) => ({
      headerLeft: (
        <TouchableOpacity onPress={() => { navigation.goBack() }}>
          <Icon name="arrow-left" size={25} style={{ color: appStyle.mainColor, padding: 10 }} />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: appStyle.backgroundColor,
        elevation: 0,
        shadowColor: 'transparent',
        marginTop: top
      },
      headerLeftContainerStyle: {
        paddingLeft: 10 // 45
      }
    })

    const AuthNav = createStackNavigator(
      {
        login: {
          screen: Login,
          navigationOptions: {
            header: null
          }
        },
        signup: {
          screen: SignUp
        },
        forgotPassword: {
          screen: ForgotPassword
        }
      },
      {
        navigationOptions,
        transitionConfig
      }
    )

    const Main = createStackNavigator({
      home: {
        screen: Home,
        navigationOptions: {
          header: null
        }
      },
      detail: { screen: Detail }
    }, {
      navigationOptions,
      transitionConfig
    })

    const MainNav = createDrawerNavigator({
      main: Main
    }, {
      headerMode: 'none',
      contentComponent: MenuLeft
    })

    const Nav = createStackNavigator({
      loginStack: { screen: AuthNav },
      mainStack: { screen: MainNav },
      unlockStack: {
        screen: Unlock,
        navigationOptions: {
          header: null
        }
      }
    }, {
      // Default config for all screens
      mode: 'card',
      headerMode: 'none',
      initialRouteName: 'loginStack'
    })
    return <Nav ref={(ref) => { AppNav.navigator = ref }} />
  }

  render() {
    return (
      <View style={styles.content}>
        <StatusBar backgroundColor={appStyle.backgroundColor} barStyle="light-content" translucent />
        {this.renderContent()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  }
})

export default Router

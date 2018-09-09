import React, { Component } from 'react'
import { Animated, Easing, View, TouchableOpacity } from 'react-native'
import { createDrawerNavigator, createStackNavigator } from 'react-navigation'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import { connect } from 'react-redux'

import { reset } from './actions'
import Login from './screens/Login'
import SignUp from './screens/SignUp'
import ForgotPassword from './screens/ForgotPassword'
import Home from './screens/Home'
import appStyle from './utils/app_style'
import Loading from './components/common/Loading'
import Layout from './utils/layout'
import SideMenu from './components/common/SideMenu'

class Router extends Component {
  renderContent() {
    // console.log('renderContent: ', this.props.isSignIn);
    const { isSignIn } = this.props

    switch (isSignIn) {
      case true: {
        const MainNav = createDrawerNavigator({
          main: { screen: Home }
        }, {
          contentComponent: SideMenu,
          drawerWidth: 300
        })
        return <MainNav />
      }

      case false: {
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
              // navigationOptions: {
              //   headerTitle: 'Sign Up'
              // }
            },
            forgotPassword: {
              screen: ForgotPassword
              // navigationOptions: {
              //   headerTitle: 'Forgot Password'
              // }
            }
          },
          {
            navigationOptions: ({ navigation }) => ({
              headerLeft: (
                <TouchableOpacity
                  onPress={() => {
                    this.props.reset()
                    navigation.goBack()
                  }}
                >
                  <Icon
                    name="arrow-left"
                    size={25}
                    style={{ color: appStyle.mainColor, padding: 10 }}
                  />
                </TouchableOpacity>
              ),
              headerStyle: {
                backgroundColor: appStyle.backgroundColor,
                elevation: 0,
                shadowColor: 'transparent',
                paddingTop: Layout.getExtraTopAndroid()
              },
              headerLeftContainerStyle: {
                paddingLeft: 45
              }
              // headerTitleStyle: {
              //   // alignSelf: 'center',
              //   fontSize: 18,
              //   fontFamily: appStyle.mainFont,
              //   fontWeight: '500',
              //   color: appStyle.mainColor
              // },
              // headerTitleContainerStyle: {
              //   alignItems: 'center',
              //   justifyContent: 'center',
              //   marginLeft: -60
              // }
            }),
            transitionConfig
          }
        )
        return <AuthNav />
      }

      default:
        return <Loading size="large" visible />
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: appStyle.backgroundColor }}>
        {this.renderContent()}
      </View>
    )
  }
}

export default connect(
  null,
  { reset }
)(Router)

import React, { Component } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native'
import { Button } from 'react-native-elements'
import { observer } from 'mobx-react'

import appStyle from '../utils/app_style'
import style from '../utils/style_sheet'
import { TextInput, Logo } from '../components/common'
import AccountStore from '../models/AccountStore'
import AppNav from '../AppNav'

@observer
class ChangePassword extends Component {
  state = {
    oldPassword: '',
    password: '',
    oldPasswordError: '',
    passwordError: ''
  };

  onChangeText = (key, val) => {
    this.setState({ [key]: val, [`${key}Error`]: !val ? 'This field is required' : '' })
  };

  onSignUpPress = () => {
    this.reset()
    AppNav.pushToScreen('signup')
  };

  onForgotPasswordPress = () => {
    this.reset()
    AppNav.pushToScreen('forgotPassword')
  };

  submitPress = () => {
    const { oldPassword, password } = this.state
    // const { isLoading } = AccountStore
    let check = false
    if (!oldPassword) {
      this.setState({ oldPasswordError: !oldPassword ? 'This field is required' : '' })
      check = true
    }
    if (!password) {
      this.setState({ passwordError: !password ? 'This field is required' : '' })
      check = true
    }
    // if (check || isLoading) {
    if (check) {
      return
    }
    Keyboard.dismiss()
    AccountStore.login(oldPassword, password)
  };

  reset = () => {
    this.setState({
      oldPassword: '',
      password: '',
      oldPasswordError: '',
      passwordError: ''
    })
  };

  render() {
    const {
      oldPassword, password, oldPasswordError, passwordError
    } = this.state
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={style.container}
      >
        <Logo />

        <View style={style.field}>
          <TextInput
            secureTextEntry
            keyboardType="email-address"
            placeholderText="Email"
            leftIconName="email-outline"
            errorMessage={oldPasswordError}
            value={oldPassword}
            onChangeText={val => this.onChangeText('email', val)}
          />
        </View>
        <View style={style.field}>
          <TextInput
            secureTextEntry
            placeholderText="Password"
            leftIconName="lock-outline"
            errorMessage={passwordError}
            value={password}
            onChangeText={val => this.onChangeText('password', val)}
          />
        </View>
        {/* {this.renderError()} */}
        <View style={style.field}>
          <Button
            title="Log In"
            buttonStyle={style.button}
            titleStyle={style.buttonTitle}
            // loading={isLoading}
            // loadingProps={{ size: 'small', color: appStyle.mainColor }}
            onPress={this.submitPress}
          />
        </View>

        <TouchableWithoutFeedback onPress={this.onForgotPasswordPress}>
          <View style={{ height: 40, justifyContent: 'center', marginTop: 5 }}>
            <Text style={{ color: appStyle.grayColor, alignSelf: 'center' }}>
              Forgot your password?
            </Text>
          </View>
        </TouchableWithoutFeedback>

        {this.renderSignUp()}
      </KeyboardAvoidingView>
    )
  }
}

export default ChangePassword

import React, { Component } from 'react'
import { KeyboardAvoidingView, Platform, View, Text, Keyboard } from 'react-native'
import { Button } from 'react-native-elements'
// import { connect } from 'react-redux'
import { observable } from 'mobx'
import { observer } from 'mobx-react'

// import { signUp, sendVerify } from '../actions'
import appStyle from '../utils/app_style'
import style from '../utils/style_sheet'
import { TextInput, Logo } from '../components/common'
import AccountStore from '../models'

const timer = require('react-native-timer')

const COUNTDOWN = 60
@observer
class SignUp extends Component {
  state = {
    email: '',
    password: '',
    name: '',
    emailError: '',
    passwordError: '',
    secureTextEntry: true,
    rightIconName: 'eye-off',
    isShowVerify: false
  };

  @observable
  isCountDown = false;
  @observable
  countdown = COUNTDOWN;

  // componentWillReceiveProps(nextProps) {
  //   this.onComplete(nextProps)
  // }

  componentWillUnmount() {
    timer.clearTimeout('startTimer')
  }

  // onComplete(props) {
  //   // console.log('onComplete: ', props.needVerify);
  //   if (props.needVerify > 0) {
  //     this.countdown = COUNTDOWN
  //     this.isCountDown = true
  //     this.startTimer()
  //   }
  // }

  startTimer = () => {
    // console.log('startTimer');
    if (this.countdown === 0) {
      this.isCountDown = false
      timer.clearTimeout('startTimer')
    }
    this.countdown--
    timer.setTimeout('startTimer', this.startTimer, 1000)
  };

  startCountDown = () => {
    // console.log('start countdown')
    this.setState({ isShowVerify: true })
    this.countdown = COUNTDOWN
    this.isCountDown = true
    this.startTimer()
  }

  submitPress = () => {
    const { email, password, name } = this.state
    const { isLoading } = AccountStore
    let check = false
    if (!email) {
      this.setState({ emailError: !email ? 'This field is required' : '' })
      check = true
    }
    if (!password) {
      this.setState({ passwordError: !password ? 'This field is required' : '' })
      check = true
    }
    if (check || isLoading) {
      return
    }
    Keyboard.dismiss()
    AccountStore.signUp(name, email, password, () => {
      this.startCountDown()
    })
  };

  submitAgainPress = () => {
    if (!this.isCountDown) {
      this.isCountDown = true
      AccountStore.sendVerify(() => {
        this.startCountDown()
      })
    }
  };

  // renderError() {
  //   if (this.props.error) {
  //     return (
  //       <View>
  //         <Text style={style.error}>{this.props.error}</Text>
  //       </View>
  //     )
  //   }
  // }

  onChangeText = (key, val) => {
    this.setState({ [key]: val, [`${key}Error`]: !val ? 'This field is required' : '' })
  };

  render() {
    const {
      email, name, password, emailError, passwordError,
      secureTextEntry, rightIconName, isShowVerify
    } = this.state
    const { isLoading } = AccountStore
    if (isShowVerify) {
      return (
        <View style={style.container}>
          <Logo />
          <View style={style.field}>
            <Text style={style.title}>We just sent email to "{email}"</Text>
            <Text style={[style.desciption, { marginTop: 10 }]}>
              Click the secure link we sent you to verify your account. If you didn't receive an
              email, check your Spam folder.
            </Text>
          </View>
          <View style={style.field}>
            <Button
              title={`Send ${this.countdown >= 0 ? `(${this.countdown}s)` : ''}`}
              buttonStyle={style.button}
              titleStyle={style.buttonTitle}
              loading={isLoading}
              loadingProps={{ size: 'small', color: appStyle.mainColor }}
              onPress={this.submitAgainPress}
            />
          </View>
        </View>
      )
    }
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={style.container}
      >
        <Logo />

        <View style={style.field}>
          <TextInput
            placeholderText="Name"
            leftIconName="account"
            value={name}
            onChangeText={(val) => {
              this.setState({ name: val })
            }}
          />
        </View>

        <View style={style.field}>
          <TextInput
            placeholderText="Email"
            leftIconName="email-outline"
            errorMessage={emailError}
            value={email}
            onChangeText={val => this.onChangeText('email', val)}
          />
        </View>
        <View style={style.field}>
          <TextInput
            secureTextEntry={secureTextEntry}
            placeholderText="Password"
            leftIconName="lock-outline"
            rightIconName={rightIconName}
            errorMessage={passwordError}
            value={password}
            onChangeText={val => this.onChangeText('password', val)}
            onRightIconPress={() => {
              this.setState({
                secureTextEntry: !secureTextEntry,
                rightIconName: secureTextEntry ? 'eye' : 'eye-off'
              })
            }}
          />
        </View>

        {/* {this.renderError()} */}

        <View style={style.field}>
          <Button
            title="Sign Up"
            buttonStyle={style.button}
            titleStyle={style.buttonTitle}
            loading={isLoading}
            loadingProps={{ size: 'small', color: appStyle.mainColor }}
            onPress={this.submitPress}
          />
        </View>
      </KeyboardAvoidingView>
    )
  }
}

// const mapStateToProps = state => ({
//   error: state.auth.error,
//   loading: state.auth.loading,
//   needVerify: state.auth.needVerify
// })

export default SignUp
// export default connect(
//   mapStateToProps,
//   { signUp, sendVerify }
// )(SignUp)

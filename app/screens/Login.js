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
// import { connect } from 'react-redux'
import { observer } from 'mobx-react'

// import { login, reset } from '../actions'
import appStyle from '../utils/app_style'
import style from '../utils/style_sheet'
import { TextInput, Logo } from '../components/common'
import AccountStore from '../models'
import AppNav from '../AppNav'

@observer
class Login extends Component {
  state = {
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    isShowSignUp: true
  };

  componentDidMount() {
    const show = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    this.keyboardDidShowListener = Keyboard.addListener(show, e => this._keyboardDidShow(e))
    this.keyboardDidHideListener = Keyboard.addListener(hide, e => this._keyboardDidHide(e))
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val, [`${key}Error`]: !val ? 'This field is required' : '' })
  };

  onSignUpPress = () => {
    this.reset()
    AppNav.pushToScreen('signup')
    // this.props.navigation.navigate('signup')
  };

  onForgotPasswordPress = () => {
    this.reset()
    AppNav.pushToScreen('forgotPassword')
    // this.props.navigation.navigate('forgotPassword')
  };

  submitPress = () => {
    const { email, password } = this.state
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
    AccountStore.login(email, password, () => {
      this.reset()
    })
  };

  reset = () => {
    this.setState({
      email: '',
      password: '',
      emailError: '',
      passwordError: ''
    })
    AccountStore.showLoading(false)
  };

  _keyboardDidShow(e) {
    // console.log('keyboardDidShow');
    const { width, height } = Dimensions.get('window')
    this.setState({ isShowSignUp: height > width })
    // console.log(`${width} - ${height} - ${this.state.isShowSignUp}`);
  }

  _keyboardDidHide() {
    // console.log('keyboardDidHide');
    this.setState({ isShowSignUp: true })
  }

  // renderError = () => {
  //   if (this.props.error) {
  //     return (
  //       <View>
  //         <Text style={style.error}>{this.props.error}</Text>
  //       </View>
  //     )
  //   }
  //   return null
  // };

  renderSignUp = () => {
    if (this.state.isShowSignUp) {
      return (
        <TouchableWithoutFeedback onPress={this.onSignUpPress}>
          <View style={style.signUp}>
            <Text style={{ color: appStyle.grayColor, alignSelf: 'center' }}>
              Don't have an account? Sign Up
            </Text>
          </View>
        </TouchableWithoutFeedback>
      )
    }
    return null
  };

  render() {
    const {
      email, password, emailError, passwordError
    } = this.state
    const { isLoading } = AccountStore
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={style.container}
      >
        <Logo />

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
            loading={isLoading}
            loadingProps={{ size: 'small', color: appStyle.mainColor }}
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

// const mapStateToProps = state => ({
//   error: state.auth.error,
//   loading: state.auth.loading
// })

export default Login
// export default connect(
//   mapStateToProps,
//   { login, reset }
// )(Login)

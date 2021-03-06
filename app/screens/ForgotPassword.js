import React, { Component } from 'react'
import { KeyboardAvoidingView, Platform, View, Text, Keyboard } from 'react-native'
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'
import { observable } from 'mobx'
import { observer } from 'mobx-react/native'

import { forgotPassword } from '../actions'
import appStyle from '../utils/app_style'
import style from '../utils/style_sheet'
import { TextInput, Logo } from '../components/common'

const timer = require('react-native-timer')

const COUNTDOWN = 60
@observer
class ForgotPassword extends Component {
  state = {
    email: '',
    emailErrorMessage: ''
  };
  @observable
  isCountDown = false;
  @observable
  countdown = COUNTDOWN;

  componentWillReceiveProps(nextProps) {
    this.onComplete(nextProps)
  }

  componentWillUnmount() {
    timer.clearTimeout('startTimer')
  }

  onComplete(props) {
    // console.log('onComplete: ', props.isForgotDone);
    if (props.isForgotDone) {
      this.countdown = COUNTDOWN
      this.isCountDown = true
      this.startTimer()
    }
  }

  startTimer = () => {
    // console.log('startTimer');
    if (this.countdown === 0) {
      this.isCountDown = false
      timer.clearTimeout('startTimer')
    }
    this.countdown--
    timer.setTimeout('startTimer', this.startTimer, 1000)
  };

  submitPress = () => {
    const { email } = this.state
    let check = false
    if (!email) {
      this.setState({ emailErrorMessage: !email ? 'This field is required' : '' })
      check = true
    }

    if (check || this.props.loading) {
      return
    }
    Keyboard.dismiss()
    this.props.forgotPassword({ email })
  };

  submitAgainPress = () => {
    if (!this.isCountDown) {
      this.isCountDown = true
      const { email } = this.state
      this.props.forgotPassword({ email })
    }
  };

  renderError() {
    if (this.props.error) {
      return (
        <View>
          <Text style={style.error}>{this.props.error}</Text>
        </View>
      )
    }
  }

  render() {
    const { email, emailErrorMessage } = this.state
    if (this.props.isForgotDone) {
      return (
        <View style={style.container}>
          <Logo />
          <View style={style.field}>
            <Text style={style.title}>We just sent email to "{email}"</Text>
            <Text style={[style.desciption, { marginTop: 10 }]}>
              Click the secure link we sent you to reset your password. If you didn't receive an
              email, check your Spam folder.
            </Text>
          </View>
          <View style={style.field}>
            <Button
              title={`Send ${this.countdown >= 0 ? `(${this.countdown}s)` : ''}`}
              buttonStyle={style.button}
              titleStyle={style.buttonTitle}
              loading={this.props.loading}
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
            placeholderText="Email"
            leftIconName="email-outline"
            errorMessage={emailErrorMessage}
            value={email}
            onChangeText={(text) => {
              this.setState({
                email: text,
                emailErrorMessage: !text ? 'This field is required' : ''
              })
            }}
          />
        </View>

        {this.renderError()}

        <View style={style.field}>
          <Button
            title="Send"
            buttonStyle={style.button}
            titleStyle={style.buttonTitle}
            loading={this.props.loading}
            loadingProps={{ size: 'small', color: appStyle.mainColor }}
            onPress={this.submitPress}
          />
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = state => ({
  error: state.auth.error,
  loading: state.auth.loading,
  isForgotDone: state.auth.isForgotDone
})

export default connect(
  mapStateToProps,
  { forgotPassword }
)(ForgotPassword)

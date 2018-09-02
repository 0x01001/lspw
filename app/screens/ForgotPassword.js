import React, { Component } from 'react';
import { KeyboardAvoidingView, Platform, View, Text, Keyboard } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';

import { forgotPasswordAction } from '../actions';
import appStyle from '../utils/app_style';
import style from '../utils/style_sheet';
import { TextInput, Logo } from '../components/common';

const COUNTDOWN = 59;
@observer
class ForgotPassword extends Component {
  state = {
    email: '',
    emailErrorMessage: '',
    isSuccess: false,
    timer: COUNTDOWN
  };
  @observable
  isCountDown = false;

  componentWillReceiveProps(nextProps) {
    this.onComplete(nextProps);
  }

  componentWillUnmount() {
    clearInterval(this.clockCall);
  }

  onComplete(props) {
    this.setState({ isSuccess: props.done });
    //console.log('onComplete: ', props.done);
    if (props.done > 0) {
      this.startTimer();
    }
  }

  //#region timer
  startTimer = () => {
    if (this.clockCall) {
      //console.log('clear interval');
      clearInterval(this.clockCall);
    }
    this.setState({ timer: COUNTDOWN });
    this.isCountDown = true;
    this.clockCall = setInterval(() => {
      this.decrementClock();
    }, 1000);
  };

  decrementClock = () => {
    if (this.state.timer === 0) {
      this.isCountDown = false;
      clearInterval(this.clockCall);
    }
    this.setState(prevstate => ({ timer: prevstate.timer - 1 }));
  };
  //#endregion

  submitPress = () => {
    const { email } = this.state;
    let check = false;
    if (!email) {
      this.setState({ emailErrorMessage: !email ? 'This field is required' : '' });
      check = true;
    }

    if (check || this.props.loading) {
      return;
    }
    Keyboard.dismiss();
    this.props.forgotPasswordAction({ email });
  };

  renderError() {
    if (this.props.error) {
      return (
        <View>
          <Text style={style.error}>{this.props.error}</Text>
        </View>
      );
    }
  }

  render() {
    const { email, timer, emailErrorMessage, isSuccess } = this.state;
    if (isSuccess) {
      return (
        <View style={style.container}>
          <Logo />
          <View style={style.field}>
            <Text style={style.title}>We just sent email to "{email}"</Text>
            <Text style={[style.content, { marginTop: 10 }]}>
              Click the secure link we sent you to reset your password. If you didn't receive an
              email, check your Spam folder.
            </Text>
          </View>
          <View style={style.field}>
            <Button
              title={`Send ${timer >= 0 ? `(${timer}s)` : ''}`}
              buttonStyle={style.button}
              titleStyle={style.buttonTitle}
              loading={this.props.loading}
              loadingProps={{ size: 'small', color: appStyle.mainColor }}
              onPress={() => {
                if (!this.isCountDown) {
                  this.isCountDown = true;
                  this.props.forgotPasswordAction({ email });
                }
              }}
            />
          </View>
        </View>
      );
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
            onChangeText={text => {
              this.setState({
                email: text,
                emailErrorMessage: !text ? 'This field is required' : ''
              });
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
    );
  }
}

const mapStateToProps = state => ({
  error: state.auth.error,
  loading: state.auth.loading,
  done: state.auth.isForgotDone
});

export default connect(
  mapStateToProps,
  { forgotPasswordAction }
)(ForgotPassword);

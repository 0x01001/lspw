import React, { Component } from 'react';
import { KeyboardAvoidingView, Platform, View, Text, Keyboard } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

import { forgotPasswordAction } from '../actions';
import appStyle from '../utils/app_style';
import style from '../utils/style_sheet';
import { TextInput, Logo } from '../components/common';

class ForgotPassword extends Component {
  state = {
    email: '',
    emailErrorMessage: '',
    isSuccess: false
  };

  componentWillReceiveProps(nextProps) {
    this.onComplete(nextProps);
  }

  onComplete(props) {
    //console.log('sign up: ', props);
    this.setState({ isSuccess: props.done });
  }

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
    if (this.state.isSuccess) {
      return (
        <View style={style.container}>
          <Logo />
          <View style={style.field}>
            <Text style={style.title}>We just sent email to "{this.state.email}"</Text>
            <Text style={[style.content, { marginTop: 10 }]}>
              Click the secure link we sent you to reset your password. If you didn't receive an
              email, check your Spam folder.
            </Text>
          </View>
          <View style={style.field}>
            <Button
              title="Login"
              buttonStyle={style.button}
              titleStyle={style.buttonTitle}
              loading={this.props.loading}
              loadingProps={{ size: 'small', color: appStyle.mainColor }}
              onPress={() => {
                this.props.navigation.goBack();
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
            errorMessage={this.state.emailErrorMessage}
            value={this.state.email}
            onChangeText={email => {
              this.setState({ email });
              this.setState({ emailErrorMessage: !email ? 'This field is required' : '' });
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
  done: state.auth.done
});

export default connect(
  mapStateToProps,
  { forgotPasswordAction }
)(ForgotPassword);

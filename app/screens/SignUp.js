import React, { Component } from 'react';
import { KeyboardAvoidingView, Platform, View, Text, Keyboard } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

import { signUpAction, customLoginAction } from '../actions';
import appStyle from '../utils/app_style';
import style from '../utils/style_sheet';
import { TextInput, Logo } from '../components/common';

class SignUp extends Component {
  state = {
    email: '',
    password: '',
    name: '',
    emailErrorMessage: '',
    passwordErrorMessage: '',
    secureTextEntry: true,
    rightIconName: 'eye-off'
  };

  componentWillReceiveProps(nextProps) {
    this.onSignUpComplete(nextProps);
  }

  onSignUpComplete(props) {
    //console.log('sign up: ', props);
    if (props.result.data) {
      const { token } = props.result.data;
      if (token) {
        //console.log('token: ', token);
        this.props.customLoginAction(token);
      }
    }
  }

  submitPress = () => {
    const { email, password, name } = this.state;
    let check = false;
    if (!email) {
      this.setState({ emailErrorMessage: !email ? 'This field is required' : '' });
      check = true;
    }
    if (!password) {
      this.setState({ passwordErrorMessage: !password ? 'This field is required' : '' });
      check = true;
    }
    if (check || this.props.loading) {
      return;
    }
    Keyboard.dismiss();
    this.props.signUpAction({ name, email, password });
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
            value={this.state.name}
            onChangeText={name => {
              this.setState({ name });
            }}
          />
        </View>

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
        <View style={style.field}>
          <TextInput
            secureTextEntry={this.state.secureTextEntry}
            placeholderText="Password"
            leftIconName="lock-outline"
            rightIconName={this.state.rightIconName}
            errorMessage={this.state.passwordErrorMessage}
            value={this.state.password}
            onChangeText={password => {
              this.setState({ password });
              this.setState({ passwordErrorMessage: !password ? 'This field is required' : '' });
            }}
            onRightIconPress={() => {
              this.setState({
                secureTextEntry: !this.state.secureTextEntry,
                rightIconName: this.state.secureTextEntry ? 'eye' : 'eye-off'
              });
            }}
          />
        </View>

        {this.renderError()}

        <View style={style.field}>
          <Button
            title="Sign Up"
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
  result: state.auth.data
});

export default connect(
  mapStateToProps,
  { signUpAction, customLoginAction }
)(SignUp);

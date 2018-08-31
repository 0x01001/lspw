import React, { Component } from 'react';
import { KeyboardAvoidingView, Platform, View, Text, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import IconBack from 'react-native-vector-icons/SimpleLineIcons';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { signUpAction, customLoginAction } from '../actions';
import appStyle from '../utils/app_style';
import style from '../utils/style_sheet';
import { TextInput } from '../components/common';

class SignUp extends Component {
  state = {
    email: '',
    password: '',
    name: '',
    emailErrorMessage: '',
    passwordErrorMessage: ''
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
        <Icon style={style.logo} name="qrcode" size={80} color={appStyle.mainColor} />

        <View style={style.field}>
          <TextInput
            placeholderText="Email"
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
            secureTextEntry
            placeholderText="Password"
            leftIconName="lock-outline"
            rightIconName="eye-off"
            errorMessage={this.state.passwordErrorMessage}
            value={this.state.password}
            onChangeText={password => {
              this.setState({ password });
              this.setState({ passwordErrorMessage: !password ? 'This field is required' : '' });
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

import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Input, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { loginAction, resetAction } from '../actions';
import appStyle from '../utils/app_style';
import style from '../utils/style_sheet';

class Login extends Component {
  state = {
    email: '',
    password: '',
    emailErrorMessage: '',
    passwordErrorMessage: '',
    isShowSignUp: true
  };

  componentDidMount() {
    const show = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    this.keyboardDidShowListener = Keyboard.addListener(show, e => this._keyboardDidShow(e));
    this.keyboardDidHideListener = Keyboard.addListener(hide, e => this._keyboardDidHide(e));
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow(e) {
    //console.log('keyboardDidShow');
    const { width, height } = Dimensions.get('window');
    this.setState({ isShowSignUp: height > width });
    //console.log(`${width} - ${height} - ${this.state.isShowSignUp}`);
  }

  _keyboardDidHide() {
    //console.log('keyboardDidHide');
    this.setState({ isShowSignUp: true });
  }

  onSignUpPress = () => {
    this.props.resetAction();
    this.props.navigation.navigate('signup');
  };

  onForgotPasswordPress = () => {
    this.props.resetAction();
    this.props.navigation.navigate('forgotPassword');
  };

  submitPress = () => {
    const { email, password } = this.state;
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
    this.props.loginAction({ email, password });
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

  renderField(value, placeholderText, leftIconName, secureTextEntry, errorMessage, onChangeText) {
    return (
      <Input
        inputStyle={style.input}
        placeholder={placeholderText}
        placeholderTextColor={appStyle.grayColor}
        errorStyle={{ color: appStyle.redColor }}
        errorMessage={errorMessage || null} //"This field is required"
        leftIcon={<Icon name={leftIconName} size={20} color={appStyle.mainColor} />}
        leftIconContainerStyle={{ marginLeft: 0 }}
        containerStyle={{
          width: '100%'
        }}
        inputContainerStyle={{
          borderBottomColor: appStyle.borderColor
        }}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
      />
    );
  }

  renderSignUp() {
    if (this.state.isShowSignUp) {
      return (
        <TouchableWithoutFeedback onPress={this.onSignUpPress}>
          <View style={style.signUp}>
            <Text style={{ color: appStyle.grayColor, alignSelf: 'center' }}>
              Don't have an account? Sign Up
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return null;
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={style.container}
      >
        <Icon style={style.logo} name="qrcode" size={80} color={appStyle.mainColor} />

        <View style={style.field}>
          {this.renderField(
            this.state.email,
            'Email',
            'email-outline',
            null,
            this.state.emailErrorMessage,
            email => {
              this.setState({ email });
              this.setState({ emailErrorMessage: !email ? 'This field is required' : '' });
            }
          )}
        </View>
        <View style={style.field}>
          {this.renderField(
            this.state.password,
            'Password',
            'lock-outline',
            true,
            this.state.passwordErrorMessage,
            password => {
              this.setState({ password });
              this.setState({ passwordErrorMessage: !password ? 'This field is required' : '' });
            }
          )}
        </View>

        {this.renderError()}

        <View style={style.field}>
          <Button
            title="Log In"
            buttonStyle={style.button}
            titleStyle={style.buttonTitle}
            loading={this.props.loading}
            loadingProps={{ size: 'small', color: appStyle.mainColor }}
            onPress={this.submitPress}
          />
        </View>

        {/* <View style={[styles.field, { marginTop: 15 }]}> */}
        <TouchableWithoutFeedback onPress={this.onForgotPasswordPress}>
          <View style={{ height: 40, justifyContent: 'center', marginTop: 5 }}>
            <Text style={{ color: appStyle.grayColor, alignSelf: 'center' }}>
              Forgot your password?
            </Text>
          </View>
        </TouchableWithoutFeedback>

        {this.renderSignUp()}
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => ({ error: state.auth.error, loading: state.auth.loading });

export default connect(
  mapStateToProps,
  { loginAction, resetAction }
)(Login);

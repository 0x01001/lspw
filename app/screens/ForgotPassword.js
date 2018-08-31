import React, { Component } from 'react';
import { KeyboardAvoidingView, Platform, View, Text, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Input, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { forgotPasswordAction } from '../actions';
import appStyle from '../utils/app_style';
import style from '../utils/style_sheet';

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

  renderField(
    value,
    placeholderText,
    leftIconName,
    rightIconName,
    secureTextEntry,
    errorMessage,
    onChangeText
  ) {
    return (
      <Input
        inputStyle={style.input}
        placeholder={placeholderText}
        placeholderTextColor={appStyle.grayColor}
        errorStyle={{ color: appStyle.redColor }}
        errorMessage={errorMessage || null} //"This field is required"
        leftIcon={<Icon name={leftIconName} size={20} color={appStyle.mainColor} />}
        rightIcon={<Icon name={rightIconName} size={20} color={appStyle.mainColor} />}
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

  render() {
    if (this.state.isSuccess) {
      return (
        <View style={style.container}>
          <Icon style={style.logo} name="qrcode" size={80} color={appStyle.mainColor} />
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
        <Icon style={style.logo} name="qrcode" size={80} color={appStyle.mainColor} />

        <View style={style.field}>
          {this.renderField(
            this.state.email,
            'Email',
            'email-outline',
            null,
            null,
            this.state.emailErrorMessage,
            email => {
              this.setState({ email });
              this.setState({ emailErrorMessage: !email ? 'This field is required' : '' });
            }
          )}
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

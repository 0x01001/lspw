import React, { Component } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, View, Text, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Input, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { forgotPasswordAction } from '../actions';
import appStyle from '../utils/app_style';

class ForgotPassword extends Component {
  state = {
    email: '',
    emailErrorMessage: '',
    error: '',
    isShow: true,
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
          <Text style={styles.error}>{this.props.error}</Text>
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
        inputStyle={styles.input}
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
        <View style={styles.container}>
          <Icon style={styles.logo} name="qrcode" size={80} color={appStyle.mainColor} />
          <View style={styles.field}>
            <Text style={styles.title}>We just sent email to "{this.state.email}"</Text>
            <Text style={styles.content}>
              Click the secure link we sent you to reset your password. If you didn't receive an
              email, check your Spam folder.
            </Text>
          </View>
          <View style={styles.field}>
            <Button
              title="Login"
              buttonStyle={styles.button}
              titleStyle={styles.buttonTitle}
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
        style={styles.container}
      >
        <Icon style={styles.logo} name="qrcode" size={80} color={appStyle.mainColor} />

        <View style={styles.field}>
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

        <View style={styles.field}>
          <Button
            title="Send"
            buttonStyle={styles.button}
            titleStyle={styles.buttonTitle}
            loading={this.props.loading}
            loadingProps={{ size: 'small', color: appStyle.mainColor }}
            onPress={this.submitPress}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: appStyle.backgroundColor,
    paddingHorizontal: 60,
    alignItems: 'center'
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: -40
  },
  field: {
    marginVertical: 5,
    width: '100%'
  },
  input: {
    fontSize: 14,
    fontFamily: appStyle.mainFont,
    color: appStyle.mainColor
  },
  button: {
    marginTop: 15,
    backgroundColor: appStyle.buttonBackgroundColor,
    width: '100%',
    height: 60,
    alignSelf: 'center',
    borderRadius: 1,
    ...Platform.select({
      android: {
        elevation: 0,
        borderRadius: 1
      }
    })
  },
  buttonTitle: {
    backgroundColor: 'transparent',
    fontSize: 18,
    fontFamily: appStyle.mainFont,
    fontWeight: 'normal',
    color: appStyle.mainColor
  },
  error: {
    alignSelf: 'center',
    color: appStyle.redColor,
    fontFamily: appStyle.mainFont,
    marginTop: 10
  },
  title: {
    fontFamily: appStyle.mainFont,
    fontWeight: '700',
    color: appStyle.mainColor,
    textAlign: 'center'
  },
  content: {
    fontFamily: appStyle.mainFont,
    fontWeight: 'normal',
    color: appStyle.mainColor,
    textAlign: 'center',
    marginTop: 10
  }
});

const mapStateToProps = state => ({
  error: state.auth.error,
  loading: state.auth.loading,
  done: state.auth.done
});

export default connect(
  mapStateToProps,
  { forgotPasswordAction }
)(ForgotPassword);

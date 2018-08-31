import React, { Component } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  // TouchableWithoutFeedback,
  // Dimensions,
  Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import IconBack from 'react-native-vector-icons/SimpleLineIcons';
import { Input, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { signUpAction, customLoginAction } from '../actions';
import appStyle from '../utils/app_style';

class SignUp extends Component {
  state = {
    email: '',
    password: '',
    name: '',
    emailErrorMessage: '',
    passwordErrorMessage: ''
    // isShow: true
  };

  // componentDidMount() {
  //   const show = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
  //   const hide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
  //   this.keyboardDidShowListener = Keyboard.addListener(show, e => this._keyboardDidShow(e));
  //   this.keyboardDidHideListener = Keyboard.addListener(hide, e => this._keyboardDidHide(e));
  // }

  componentWillReceiveProps(nextProps) {
    this.onSignUpComplete(nextProps);
  }

  // componentWillUnmount() {
  //   this.keyboardDidShowListener.remove();
  //   this.keyboardDidHideListener.remove();
  // }

  // _keyboardDidShow(e) {
  //   //console.log('keyboardDidShow');
  //   const { width, height } = Dimensions.get('window');
  //   this.setState({ isShow: height > width });
  // }

  // _keyboardDidHide() {
  //   //console.log('keyboardDidHide');
  //   this.setState({ isShow: true });
  // }

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

  // onBackPress = () => {
  //   this.props.navigation.goBack();
  // };

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

  // renderBack() {
  //   if (this.state.isShow) {
  //     return (
  //       <TouchableWithoutFeedback onPress={this.onBackPress}>
  //         <View style={styles.back}>
  //           <IconBack name="arrow-left" size={25} style={{ color: appStyle.mainColor }} />
  //         </View>
  //       </TouchableWithoutFeedback>
  //     );
  //   }
  //   return null;
  // }

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* {this.renderBack()} */}

        <Icon style={styles.logo} name="qrcode" size={80} color={appStyle.mainColor} />

        <View style={styles.field}>
          {this.renderField(this.state.name, 'Name', 'account', null, null, null, name => {
            this.setState({ name });
          })}
        </View>

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
        <View style={styles.field}>
          {this.renderField(
            this.state.password,
            'Password',
            'lock-outline',
            'eye-off',
            true,
            this.state.passwordErrorMessage,
            password => {
              this.setState({ password });
              this.setState({ passwordErrorMessage: !password ? 'This field is required' : '' });
            }
          )}
        </View>

        {this.renderError()}

        <View style={styles.field}>
          <Button
            title="Sign Up"
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
    marginTop: -60
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
  back: {
    position: 'absolute',
    top: 40,
    left: 60,
    height: 60,
    width: 60
  },
  error: {
    alignSelf: 'center',
    color: appStyle.redColor,
    fontFamily: appStyle.mainFont,
    marginTop: 10
  }
});

const mapStateToProps = state => ({
  error: state.auth.error,
  loading: state.auth.loading,
  result: state.auth.data
});

export default connect(
  mapStateToProps,
  { signUpAction, customLoginAction }
)(SignUp);

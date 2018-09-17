import React, { Component } from 'react'
import { View, KeyboardAvoidingView, StyleSheet, Platform, Text, Keyboard, TouchableOpacity, StatusBar } from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/SimpleLineIcons'

import appStyle from '../utils/app_style'
import style from '../utils/style_sheet'
import { TextInput } from '../components/common'
import AccountStore from '../models'
import layout from '../utils/layout'
import AppNav from '../AppNav'

const top = layout.getExtraTopAndroid()

@observer
class Detail extends Component {
   static navigationOptions = ({ navigation }) => ({
     title: (navigation.state.params && navigation.state.params.item) ? navigation.state.params.item.name : 'Create Account',
     headerStyle: {
       backgroundColor: appStyle.buttonBackgroundColor,
       marginVertical: top
     },
     headerLeft: (
       <TouchableOpacity onPress={() => {
         AccountStore.showLoading(false)
         AppNav.goBack()
       }}
       >
         <Icon name="arrow-left" size={25} style={{ color: appStyle.mainColor, padding: 10 }} />
       </TouchableOpacity>
     ),
     headerLeftContainerStyle: {
       paddingLeft: 10
     },
     headerTitleStyle: {
       fontSize: 18,
       fontFamily: appStyle.mainFont,
       fontWeight: '500',
       color: appStyle.mainColor
     },
     headerTitleContainerStyle: {
       justifyContent: 'center',
       alignItems: 'center',
       marginLeft: -60
     }
   });

  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  state = {
    url: '',
    username: '',
    password: '',
    desc: '',
    urlError: '',
    usernameError: '',
    passwordError: '',
    secureTextEntry: true,
    rightIconName: 'eye-off'
  };

  componentWillMount() {
    const { params } = this.props.navigation.state
    if (params) {
      const {
        url, username, password, desc
      } = params.item
      this.setState({
        url, username, password, desc
      })
    }
  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val, [`${key}Error`]: !val ? 'This field is required' : '' })
  };

  render() {
    const {
      username, desc, url, password, urlError, usernameError, passwordError,
      secureTextEntry, rightIconName
    } = this.state

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[style.container, styles.content]}
      >
        <StatusBar backgroundColor={appStyle.backgroundColor} barStyle="light-content" translucent />
        <View style={style.field}>
          <TextInput
            // multiline={true}
            // numberOfLines={4}
            placeholderText="Link"
            leftIconName="link-variant"
            errorMessage={urlError}
            value={url}
            onChangeText={val => this.onChangeText('url', val)}
          />
        </View>

        <View style={style.field}>
          <TextInput
            placeholderText="Username"
            leftIconName="account-outline"
            errorMessage={usernameError}
            value={username}
            onChangeText={val => this.onChangeText('username', val)}
          />
        </View>
        <View style={style.field}>
          <TextInput
            secureTextEntry={secureTextEntry}
            placeholderText="Password"
            leftIconName="lock-outline"
            rightIconName={rightIconName}
            errorMessage={passwordError}
            value={password}
            onChangeText={val => this.onChangeText('password', val)}
            onRightIconPress={() => {
              this.setState({
                secureTextEntry: !secureTextEntry,
                rightIconName: secureTextEntry ? 'eye' : 'eye-off'
              })
            }}
          />
        </View>
        <View style={style.field}>
          <TextInput
            // multiline={true}
            // numberOfLines={4}
            placeholderText="Note"
            leftIconName="note-outline"
            value={desc}
            onChangeText={(val) => {
              this.setState({ desc: val })
            }}
          />
        </View>

        <View style={style.field}>
          <Button
            title="Save"
            buttonStyle={style.button}
            titleStyle={style.buttonTitle}
            loading={AccountStore.isLoading}
            loadingProps={{ size: 'small', color: appStyle.mainColor }}
            onPress={this.submitPress}
          />
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    marginTop: -top,
    paddingTop: 10
  }
})

export default Detail

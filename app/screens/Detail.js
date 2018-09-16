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
     title: (navigation.state.params && navigation.state.params.item) ? navigation.state.params.item.name : 'Create',
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
    name: '',
    url: '',
    email: '',
    password: '',
    desc: '',
    emailError: '',
    passwordError: '',
    secureTextEntry: true,
    rightIconName: 'eye-off'
  };

  onChangeText = (key, val) => {
    this.setState({ [key]: val, [`${key}Error`]: !val ? 'This field is required' : '' })
  };

  renderDomain = () => {
    const { params } = this.props.navigation.state
    if (params && params.item) {
      return (
        <View style={[style.field, { flexDirection: 'row' }]}>
          <Text style={{ fontFamily: appStyle.mainFont, fontWeight: '700', color: appStyle.mainColor }}>Domain: </Text>
          <Text style={{ fontFamily: appStyle.mainFont, color: appStyle.mainColor, marginLeft: 10 }}>{params.item.name}
          </Text>
        </View>)
    }
    return null
  }

  render() {
    const {
      email, desc, url, password, emailError, passwordError,
      secureTextEntry, rightIconName
    } = this.state
    const { params } = this.props.navigation.state
    if (params) {
      const { item } = params
    }
    const { isLoading } = AccountStore

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[style.container, {
          justifyContent: 'flex-start',
          flexDirection: 'column',
          marginTop: -top,
          paddingTop: 10
        }]}
      >
        <StatusBar backgroundColor={appStyle.buttonBackgroundColor} barStyle="light-content" translucent />
        {/* {this.renderDomain()} */}
        <View style={style.field}>
          <TextInput
            multiline={true}
            numberOfLines={4}
            placeholderText="Link"
            leftIconName="link-variant"
            value={url}
            onChangeText={(val) => {
              this.setState({ url: val })
            }}
          />
        </View>

        <View style={style.field}>
          <TextInput
            placeholderText="Email"
            leftIconName="email-outline"
            errorMessage={emailError}
            value={email}
            onChangeText={val => this.onChangeText('email', val)}
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
            multiline={true}
            numberOfLines={4}
            placeholderText="Note"
            leftIconName="note"
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
            loading={isLoading}
            loadingProps={{ size: 'small', color: appStyle.mainColor }}
            onPress={this.submitPress}
          />
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default Detail

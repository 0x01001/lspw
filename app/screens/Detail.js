import React, { Component } from 'react'
import { View, KeyboardAvoidingView, StyleSheet, Platform, Text, Keyboard } from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Button } from 'react-native-elements'

import appStyle from '../utils/app_style'
import style from '../utils/style_sheet'
import { TextInput } from '../components/common'
import AccountStore from '../models'
import layout from '../utils/layout'

const top = layout.getExtraTop()

@observer
class Detail extends Component {
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
      email, name, url, password, emailError, passwordError,
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
        style={[style.container, { justifyContent: 'flex-start', flexDirection: 'column', paddingTop: top }]}
      >
        {this.renderDomain()}
        <View style={style.field}>
          <TextInput
            multiline={true}
            numberOfLines={4}
            label="Link"
            leftIconName="link-variant"
            value={url}
            onChangeText={(val) => {
              this.setState({ url: val })
            }}
          />
        </View>

        <View style={style.field}>
          <TextInput
            label="Email"
            leftIconName="email-outline"
            errorMessage={emailError}
            value={email}
            onChangeText={val => this.onChangeText('email', val)}
          />
        </View>
        <View style={style.field}>
          <TextInput
            secureTextEntry={secureTextEntry}
            label="Password"
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

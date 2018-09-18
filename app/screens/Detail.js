import React, { Component } from 'react'
import { View, KeyboardAvoidingView, StyleSheet, Platform, Text, Keyboard, TouchableOpacity, StatusBar, Dimensions } from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/SimpleLineIcons'

import appStyle from '../utils/app_style'
import style from '../utils/style_sheet'
import { TextInput } from '../components/common'
import AccountStore, { Account } from '../models'
import layout from '../utils/layout'
import AppNav from '../AppNav'
import { extractDomain, unixTimeStampToDateTime } from '../utils'

const top = layout.getExtraTopAndroid()

@observer
class Detail extends Component {
   static navigationOptions = ({ navigation }) => ({
     title: navigation.state.params.title || (navigation.state.params.item ? 'Edit' : 'Create'),
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
    date: 0,
    urlError: '',
    usernameError: '',
    passwordError: '',
    secureTextEntry: true,
    rightIconName: 'eye-off',
    isShowDate: true
  };

  componentWillMount() {
    const { params } = this.props.navigation.state
    if (params && params.item) {
      const {
        url, username, password, desc, date
      } = params.item
      this.setState({
        url, username, password, desc, date
      })
    }
  }

  componentDidMount() {
    const show = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    this.keyboardDidShowListener = Keyboard.addListener(show, e => this._keyboardDidShow(e))
    this.keyboardDidHideListener = Keyboard.addListener(hide, e => this._keyboardDidHide(e))
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  _keyboardDidShow(e) {
    const { width, height } = Dimensions.get('window')
    this.setState({ isShowDate: height > width })
  }

  _keyboardDidHide() {
    this.setState({ isShowDate: true })
  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val })
    if (key === 'url') {
      this.setState({ [`${key}Error`]: !val ? 'This field is required' : '' })
      this.props.navigation.setParams({ title: extractDomain(val) })
    }
  };

  onSave = () => {
    if (!this.state.url) {
      this.setState({ urlError: 'This field is required' })
      return
    }
    if (AccountStore.isLoading) {
      // console.log('loading.............................')
      return
    }
    let id = ''
    const { item } = this.props.navigation.state.params
    if (item) {
      id = item.id
    }
    const name = extractDomain(this.state.url)
    // console.log('name: ', name)
    const {
      username, desc, url, password, date
    } = this.state
    const model = Account.create({
      id, name, url, username, password, desc, date
    })
    AccountStore.saveData(model)
  }

  renderDate = () => {
    const { date } = this.state
    if (date > 0 && this.state.isShowDate) {
      return (
        <View style={styles.dateContainer}>
          <Text style={[style.label, { fontSize: 12, fontStyle: 'italic' }]}>Last use: {unixTimeStampToDateTime(date)}</Text>
        </View>
      )
    }
    return null
  }

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
            placeholderText="Domain/Website"
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
            onChangeText={val => this.onChangeText('desc', val)}
          />
        </View>

        <View style={style.field}>
          <Button
            title="Save"
            buttonStyle={style.button}
            titleStyle={style.buttonTitle}
            loading={AccountStore.isLoading}
            loadingProps={{ size: 'small', color: appStyle.mainColor }}
            onPress={this.onSave}
          />
        </View>
        {this.renderDate()}
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
  },
  dateContainer: {
    width: '100%', position: 'absolute', bottom: 20, right: 60, justifyContent: 'flex-end', alignItems: 'flex-end'
  }
})

export default Detail

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
  Text,
  BackHandler
} from 'react-native'
import { observer } from 'mobx-react/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import appStyle from '../utils/app_style'
import style from '../utils/style_sheet'
import { TextInput } from '../components/common'
import PinCodeStore from '../models/PinCodeStore'
import AccountStore from '../models/AccountStore'
import AppNav from '../AppNav'

@observer
export default class Unlock extends Component {
  state = {
    pinCode: '',
    pinCodeError: ''
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
  }

  handleBackPress = () => {
    if (PinCodeStore.type === 0 || PinCodeStore.type === 1) {
      AppNav.reset('mainStack')
    }
    // TODO: show popup quit
    return true
  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val, [`${key}Error`]: !val ? 'This field is required' : '' })
  };

  onSubmitEditing = () => {
    // console.log(`onSubmitEditing: ${this.state.pinCode} - ${PinCodeStore.oldPinCode} - ${PinCodeStore.confirmPinCode}
    // - ${PinCodeStore.pinCode} - ${PinCodeStore.type} - ${PinCodeStore.step}`)
    if (this.state.pinCode === '') {
      this.setState({ pinCodeError: 'This field is required' })
      return
    }

    let check = false
    const msg = 'PIN code don\'t match'
    switch (PinCodeStore.type) {
      case 0: // create
        switch (PinCodeStore.step) {
          case 1:
            PinCodeStore.setConfirmPinCodePinCode(this.state.pinCode)
            break
          case 2:
            if (this.state.pinCode !== PinCodeStore.confirmPinCode) {
              check = true
              this.setState({ pinCodeError: msg })
            }
            break
          default:
            break
        }
        break
      case 1: // change
        switch (PinCodeStore.step) {
          case 0:
            if (this.state.pinCode !== PinCodeStore.pinCode) {
              check = true
              this.setState({ pinCodeError: msg })
            }
            break
          case 1:
            PinCodeStore.setConfirmPinCodePinCode(this.state.pinCode)
            break
          case 2:
            if (this.state.pinCode !== PinCodeStore.confirmPinCode) {
              check = true
              this.setState({ pinCodeError: msg })
            }
            break
          default:
            break
        }
        break
      case 2: // unlock
        if (this.state.pinCode !== PinCodeStore.pinCode) {
          check = true
          this.setState({ pinCodeError: msg })
        }
        break

      default:
        break
    }
    if (check) {
      return
    }
    if (PinCodeStore.type === 2) {
      let count = 0
      AppNav.showLoading()
      AccountStore.load(() => {
        // console.log('load data 2')
        if (count === 0) {
          // console.log('hideLoading 2')
          AppNav.hideLoading()
          count++
          AppNav.reset('mainStack')
        }
      })
    } else if (PinCodeStore.step < 2) {
      PinCodeStore.setStep(PinCodeStore.step + 1)
      this.setState({ pinCode: '', pinCodeError: '' })
    } else {
      PinCodeStore.updatePinCode(this.state.pinCode)
    }
  }

  render() {
    const { title, description } = PinCodeStore
    const { pinCode, pinCodeError } = this.state
    // console.log(`title: ${title} - ${description}`)
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <StatusBar hidden />
        <View style={styles.title}>
          <Icon name="lock" size={30} color="white" />
          <View style={{ marginVertical: 20 }}>
            <Text style={[style.title, { textAlign: 'left' }]}>{title}</Text>
            <Text style={[style.desciption, { textAlign: 'left', marginTop: 5 }]}>{description}</Text>
          </View>
        </View>
        <View style={styles.content}>
          <TextInput
            autoFocus={true}
            keyboardType="numeric"
            secureTextEntry={true}
            inputStyle={{ marginLeft: 0, textAlign: 'center', fontSize: 16 }}
            errorMessage={pinCodeError}
            value={pinCode}
            onChangeText={val => this.onChangeText('pinCode', val)}
            onSubmitEditing={this.onSubmitEditing}
            blurOnSubmit={false}
          />
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    backgroundColor: appStyle.backgroundColor
  },
  title: {
    marginTop: 100,
    alignSelf: 'flex-start'
  },
  content: {
    marginTop: 30,
    alignSelf: 'center',
    width: '100%'
  }
})

import React, { Component } from 'react'
import { ScrollView, Text, View, StyleSheet, findNodeHandle, Image } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { observer } from 'mobx-react/native'
import prompt from 'react-native-prompt-android'

import AccountStore from '../../models/AccountStore'
import AppNav from '../../AppNav'
import PinCodeStore from '../../models/PinCodeStore'
import { Logo } from '../common'
import appStyle from '../../utils/app_style'
// import utils from '../../utils'

@observer
class MenuLeft extends Component {
  showImport = () => {
    AppNav.closeMenu()
    AccountStore.googleSignin()
  }

  showPincode = (type) => {
    PinCodeStore.setType(type)
    AppNav.reset('unlockStack')
  }

  showChangePassword = () => {

  }

  createPincode = () => {
    this.showPincode(0)
  }

  changePincode = () => {
    this.showPincode(1)
  }

  homePress = () => {
    AppNav.closeMenu()
    AppNav.goTop()
  }

  showPopupRemovePincode = () => {
    AppNav.closeMenu()
    prompt(
      'Remove PIN code',
      'Enter your password to remove PIN code',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: val => PinCodeStore.removePinCode(val) }
      ],
      {
        type: 'secure-text',
        cancelable: false,
        defaultValue: '',
        placeholder: 'Password'
      }
    )
  }

  logout = () => {
    AppNav.closeMenu()
    AccountStore.signOut()
  }

  renderPinCode = () => {
    // if (AccountStore.isFetching) {
    //   return (<View style={styles.navSectionStyle}><Text style={[styles.navItemStyle, { paddingLeft: 30 }]}>Loading...</Text></View>)
    // } else
    if (PinCodeStore.pinCode === '') {
      return (
        <View style={styles.navSectionStyle}>
          <Icon name="security-lock" size={20} color={appStyle.mainColor} />
          <Text style={styles.navItemStyle} onPress={this.createPincode}>Set pincode</Text>
        </View>
      )
    }
    return (
      <View>
        <View style={styles.navSectionStyle}>
          <Icon name="lock-reset" size={20} color={appStyle.mainColor} />
          <Text style={styles.navItemStyle} onPress={this.changePincode}>Change pincode</Text>
        </View>
        <View style={styles.navSectionStyle}>
          <Icon name="lock-open-outline" size={20} color={appStyle.mainColor} />
          <Text style={styles.navItemStyle} onPress={this.showPopupRemovePincode}>Remove pincode</Text>
        </View>
      </View>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <Logo styleCustom={{ marginBottom: 10, marginTop: 30 }} />
        <ScrollView>
          {/* <View>
            <Text style={[styles.sectionHeadingStyle, { borderTopWidth: 1, borderTopColor: appStyle.borderColor }]}>
              Home
            </Text>
          </View> */}
          <View>
            {/* <Text style={styles.sectionHeadingStyle}>
              Setting
            </Text> */}
            <View style={[styles.navSectionStyle, { borderTopWidth: 1, borderTopColor: appStyle.borderColor }]}>
              <Icon name="home" size={20} color={appStyle.mainColor} />
              <Text style={styles.navItemStyle} onPress={this.homePress}>Home</Text>
            </View>
            <View style={styles.navSectionStyle}>
              <Icon name="database-import" size={20} color={appStyle.mainColor} />
              <Text style={styles.navItemStyle} onPress={this.showImport}>Import data</Text>
            </View>
            {/* <View style={styles.navSectionStyle}>
              <Icon name="lastpass" size={20} color={appStyle.mainColor} />
              <Text style={styles.navItemStyle} onPress={this.showChangePassword}>Change password</Text>
            </View> */}
            {this.renderPinCode()}
          </View>
        </ScrollView>

        <View style={[styles.navSectionStyle, { borderTopWidth: 1, borderTopColor: appStyle.borderColor, backgroundColor: appStyle.buttonBackgroundColor }]}>
          <Icon name="logout" size={20} color={appStyle.mainColor} />
          <Text style={styles.navItemStyle} onPress={this.logout}>Logout</Text>
        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navItemStyle: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    flex: 1,
    color: appStyle.mainColor
  },
  navSectionStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: appStyle.borderColor
  }
})

export default MenuLeft

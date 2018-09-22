import React, { Component } from 'react'
import { ScrollView, Text, View, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { observer } from 'mobx-react/native'
import prompt from 'react-native-prompt-android'

import AccountStore from '../../models/AccountStore'
import AppNav from '../../AppNav'
import PinCodeStore from '../../models/PinCodeStore'

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

  createPincode = () => {
    this.showPincode(0)
  }

  changePincode = () => {
    this.showPincode(1)
  }

  removePincode = (val) => {

  }

  showPopupRemovePincode = () => {
    prompt(
      'Remove PIN code',
      'Enter your password to remove PIN code',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: val => this.removePincode(val) }
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
          <Icon name="fingerprint" size={20} />
          <Text style={styles.navItemStyle} onPress={this.createPincode}>Create pincode</Text>
        </View>
      )
    }
    return (
      <View>
        <View style={styles.navSectionStyle}>
          <Icon name="fingerprint" size={20} />
          <Text style={styles.navItemStyle} onPress={this.changePincode}>Change pincode</Text>
        </View>
        <View style={styles.navSectionStyle}>
          <Icon name="fingerprint" size={20} />
          <Text style={styles.navItemStyle} onPress={this.showPopupRemovePincode}>Remove pincode</Text>
        </View>
      </View>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
            <Text style={styles.sectionHeadingStyle}>
              Home
            </Text>
          </View>
          <View>
            <Text style={styles.sectionHeadingStyle}>
              Setting
            </Text>
            <View style={styles.navSectionStyle}>
              <Icon name="database-import" size={20} />
              <Text style={styles.navItemStyle} onPress={this.showImport}>Import data</Text>
            </View>
            <View style={styles.navSectionStyle}>
              <Icon name="lock-outline" size={20} />
              <Text style={styles.navItemStyle}>Change password</Text>
            </View>
            {this.renderPinCode()}
          </View>
        </ScrollView>

        <View style={styles.navSectionStyle}>
          <Icon name="logout" size={20} />
          <Text style={[styles.navItemStyle]} onPress={this.logout}>Logout</Text>
        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1
  },
  navItemStyle: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    flex: 1
  },
  navSectionStyle: {
    backgroundColor: 'lightgrey',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10
  },
  sectionHeadingStyle: {
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  footerContainer: {
    backgroundColor: 'lightgrey'
  }
})

export default MenuLeft

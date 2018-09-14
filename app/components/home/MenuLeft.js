import React, { Component } from 'react'
import { ScrollView, Text, View, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AccountStore from '../../models'
import AppNav from '../../AppNav'

class MenuLeft extends Component {
  showImport = () => {
    AppNav.closeMenu()
    AccountStore.googleSignin()
  }

  logout = () => {
    AppNav.closeMenu()
    AccountStore.signOut()
  }

  render () {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
            <Text style={styles.sectionHeadingStyle}>
              Home
            </Text>
            {/* <View style={styles.navSectionStyle}>
              <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Page1')}>
              Page1
              </Text>
            </View> */}
          </View>
          <View>
            <Text style={styles.sectionHeadingStyle}>
              Setting
            </Text>
            <View style={styles.navSectionStyle}>
              <Icon name="database-import" size={20} />
              <Text style={styles.navItemStyle} onPress={this.showImport}>Import Data</Text>
            </View>
            <View style={styles.navSectionStyle}>
              <Icon name="logout" size={20} />
              <Text style={styles.navItemStyle} onPress={this.logout}>Logout</Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <Text>This is my fixed footer</Text>
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
    padding: 15,
    backgroundColor: 'lightgrey'
  }
})

export default MenuLeft

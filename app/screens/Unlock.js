import React, { Component } from 'react'
import { View, Text } from 'react-native'
import PINCode from '@haskkor/react-native-pincode'
import AppNav from '../AppNav'

class Unlock extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <PINCode
          status="choose"
          touchIDDisabled
          storePin={(pincode) => {
            console.log('pincode:', pincode)
          }}
          finishProcess={() => {
            console.log('finish')
            AppNav.goBack()
          }}
        />
      </View>
    )
  }
}

export default Unlock

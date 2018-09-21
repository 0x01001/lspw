import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
  Text,
  Animated,
  TouchableOpacity
} from 'react-native'
import { observer } from 'mobx-react/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import PropTypes from 'prop-types'

import appStyle from '../utils/app_style'
import style from '../utils/style_sheet'
import { TextInput } from '../components/common'
import PincodeStore from '../models/PincodeStore'

@observer
export default class Unlock extends Component {
  state = {
    pinCode: '',
    pinCodeError: ''
  }

  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val, [`${key}Error`]: !val ? 'This field is required' : '' })
  };

  onSubmitEditing = () => {
    console.log('done: ', this.state.pinCode)
  }

  render() {
    const { pinCode, pinCodeError } = this.state
    const { title, description } = this.props.navigation.state.params
    // console.log('title: ', title, description)
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
            inputStyle={{ marginLeft: 0, textAlign: 'center' }}
            errorMessage={pinCodeError}
            value={pinCode}
            onChangeText={val => this.onChangeText('pinCode', val)}
            onSubmitEditing={this.onSubmitEditing}
            returnKeyType="next"
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

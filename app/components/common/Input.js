import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Input } from 'react-native-elements'
import { View, TouchableOpacity } from 'react-native'

import style from '../../utils/style_sheet'
import appStyle from '../../utils/app_style'

const TextInput = ({
  label,
  placeholderText,
  secureTextEntry,
  value,
  errorMessage,
  leftIconName,
  rightIconName,
  onRightIconPress,
  onChangeText,
  multiline,
  numberOfLines
}) => (
  <Input
    label={label}
    labelStyle={style.label}
    inputStyle={style.input}
    placeholder={placeholderText}
    placeholderTextColor={appStyle.grayColor}
    errorStyle={{ color: appStyle.redColor }}
    errorMessage={errorMessage || null} // "This field is required"
    leftIcon={<Icon name={leftIconName} size={20} color={appStyle.mainColor} />}
    rightIcon={onRightIconPress ? (
      <TouchableOpacity onPress={onRightIconPress}>
        <View style={style.rightIcon}>
          <Icon name={rightIconName} size={20} color={appStyle.mainColor} />
        </View>
      </TouchableOpacity>
    ) : null}
    leftIconContainerStyle={{ marginLeft: 0 }}
    containerStyle={{ width: '100%' }}
    inputContainerStyle={{ borderBottomColor: appStyle.borderColor }}
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    multiline={multiline}
    numberOfLines={numberOfLines}
  />
)

export { TextInput }

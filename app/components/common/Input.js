import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Input } from 'react-native-elements'
import { View, TouchableOpacity } from 'react-native'

import style from '../../utils/style_sheet'
import appStyle from '../../utils/app_style'

const TextInput = ({
  blurOnSubmit,
  inputStyle,
  containerStyle,
  keyboardType,
  autoFocus,
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
  numberOfLines,
  onSubmitEditing,
  returnKeyType
}) => (
  <Input
    blurOnSubmit={blurOnSubmit}
    keyboardType={keyboardType || 'default'}
    autoFocus={autoFocus}
    label={label}
    labelStyle={style.label}
    inputStyle={[style.input, inputStyle]}
    placeholder={placeholderText}
    placeholderTextColor={appStyle.grayColor}
    errorStyle={{ color: appStyle.redColor }}
    errorMessage={errorMessage || null} // "This field is required"
    leftIcon={leftIconName ? <Icon name={leftIconName} size={20} color={appStyle.mainColor} /> : null}
    rightIcon={onRightIconPress ? (
      <TouchableOpacity onPress={onRightIconPress}>
        <View style={style.rightIcon}>
          <Icon name={rightIconName} size={20} color={appStyle.mainColor} />
        </View>
      </TouchableOpacity>
    ) : null}
    leftIconContainerStyle={{ marginLeft: 0 }}
    containerStyle={[{ width: '100%' }, containerStyle]}
    inputContainerStyle={{ borderBottomColor: appStyle.borderColor }}
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    multiline={multiline}
    numberOfLines={numberOfLines}
    onSubmitEditing={onSubmitEditing}
    returnKeyType={returnKeyType}
  />
)

export { TextInput }

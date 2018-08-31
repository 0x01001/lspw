import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Input } from 'react-native-elements';
import style from '../../utils/style_sheet';
import appStyle from '../../utils/app_style';

const TextInput = ({
  placeholderText,
  value,
  onChangeText,
  errorMessage,
  leftIconName,
  secureTextEntry,
  rightIconName
}) => (
  <Input
    inputStyle={style.input}
    placeholder={placeholderText}
    placeholderTextColor={appStyle.grayColor}
    errorStyle={{ color: appStyle.redColor }}
    errorMessage={errorMessage || null} //"This field is required"
    leftIcon={<Icon name={leftIconName} size={20} color={appStyle.mainColor} />}
    rightIcon={<Icon name={rightIconName} size={20} color={appStyle.mainColor} />}
    leftIconContainerStyle={{ marginLeft: 0 }}
    containerStyle={{
      width: '100%'
    }}
    inputContainerStyle={{
      borderBottomColor: appStyle.borderColor
    }}
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
  />
);

export { TextInput };

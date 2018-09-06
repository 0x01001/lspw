import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import style from '../../utils/style_sheet'
import appStyle from '../../utils/app_style'

const Logo = () => <Icon style={style.logo} name="qrcode" size={80} color={appStyle.mainColor} />

export { Logo }

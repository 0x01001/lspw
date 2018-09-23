// import React from 'react'
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
// import style from '../../utils/style_sheet'
// import appStyle from '../../utils/app_style'

// const Logo = styleCustom => <Icon style={[style.logo, this.styleCustom]} name="qrcode" size={80} color={appStyle.mainColor} />

// export { Logo }

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import style from '../../utils/style_sheet'
import appStyle from '../../utils/app_style'

class Logo extends Component {
  static propTypes = {
    styleCustom: PropTypes.object
  }

  static defaultProps = {
    styleCustom: {}
  }

  render() {
    return (
      <Icon style={[style.logo, this.props.styleCustom]} name="qrcode" size={80} color={appStyle.mainColor} />
    )
  }
}

export { Logo }

// const Logo = () => <Icon style={[style.logo,  this.styleCustom]} name="qrcode" size={80} color={appStyle.mainColor} />

// export { Logo }

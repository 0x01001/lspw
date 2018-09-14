import React, { Component } from 'react'
import { View } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import PropTypes from 'prop-types'
import appStyle from '../../utils/app_style'

const SIZES = ['small', 'normal', 'large']
const timer = require('react-native-timer')

class Loading extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    size: PropTypes.oneOf(SIZES)
  }

  static defaultProps = {
    visible: false,
    size: 'normal' // 'normal',
  }

  state = {
    visible: this.props.visible || false
  }

  componentWillUnmount() {
    timer.clearTimeout('hideLoading')
  }

  show = () => {
    this.setState({ visible: true })
    timer.clearTimeout('hideLoading')
    timer.setTimeout('hideLoading', this.hide, 30000) // 30s
  };

  hide = () => {
    this.setState({ visible: false })
  };

  render() {
    const { visible } = this.state
    if (!visible) {
      return null
    }
    return (
      // <View style={styles.container}>
      //   <ActivityIndicator size={this.props.size || 'small'} color={appStyle.redColor} />
      // </View>
      <View>
        <Spinner
          visible={visible}
          // textContent="Loading..."
          color={appStyle.redColor}
          size={this.props.size}
        />
      </View>
    )
  }
}

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: `${appStyle.blackColor}50`
//   }
// })

export default Loading

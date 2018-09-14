import React, { Component } from 'react'
import { Animated, StyleSheet, Dimensions, Text } from 'react-native'
import layout from '../../utils/layout'
import appStyle from '../../utils/app_style'

const { heightNotif } = layout

export default class Notify extends Component {
  constructor(props) {
    super(props)
    this.offset = new Animated.Value(-heightNotif)
    this.state = {
      content: '',
      styleText: {},
      style: {}
    }
  }

  show(content, style = {}, styleText = {}) {
    this.setState({
      content,
      style,
      styleText
    })
    Animated.timing(this.offset, {
      toValue: 0,
      duration: 250
    }).start()
    setTimeout(() => this.hide(), 2500)
  }

  hide() {
    Animated.timing(this.offset, {
      toValue: -heightNotif,
      duration: 250
    }).start()
  }

  render() {
    const { content, style, styleText } = this.state
    const { width } = Dimensions.get('window')
    return (
      <Animated.View style={[styles.container, { width }, { transform: [{ translateY: this.offset }] }, style]}>
        <Text style={[styles.content, styleText]}>{content}</Text>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: heightNotif,
    backgroundColor: appStyle.greenColor,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'absolute'
  },
  content: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10
  }
})

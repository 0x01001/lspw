import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import appStyle from '../../utils/app_style';

class Loading extends Component {
  state = {
    visible: this.props.visible || false
  };

  show = () => {
    this.setState({ visible: true });
  };

  hide = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible } = this.state;
    if (!visible) {
      return null;
    }
    return (
      <View style={styles.container}>
        <ActivityIndicator size={this.props.size || 'small'} color={appStyle.redColor} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${appStyle.blackColor}50`
  }
});

export default Loading;

import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import appStyle from '../../utils/app_style';

const Loading = ({ size }) => (
  <View style={styles.loadingStyle}>
    <ActivityIndicator size={size || 'small'} color={appStyle.redColor} />
  </View>
);

const styles = StyleSheet.create({
  loadingStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${appStyle.blackColor}50`
  }
});

export { Loading };

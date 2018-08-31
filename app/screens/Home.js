import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import firebase from 'firebase';

class Home extends Component {
  static navigationOptions = {
    title: 'Home',
    drawerLabel: 'Home',
    drawerIcon: ({ tintColor }) => <Icon name="list" size={24} color={tintColor} />
  };

  componentWillMount() {
    // get all data
  }

  render() {
    return (
      <View>
        <Text> Home </Text>
        <Button title="Logout" onPress={() => firebase.auth().signOut()} />
      </View>
    );
  }
}

export default Home;

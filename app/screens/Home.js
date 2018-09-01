import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import firebase from 'firebase';
import * as Keychain from 'react-native-keychain';

class Home extends Component {
  static navigationOptions = {
    title: 'Home',
    drawerLabel: 'Home',
    drawerIcon: ({ tintColor }) => <Icon name="list" size={24} color={tintColor} />
  };

  componentWillMount() {
    // get all data
  }

  load = async () => {
    //console.log('?');
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        // return <Text>{`${credentials.username} - ${credentials.password}`}</Text>;
        console.log(`${credentials.username} - ${credentials.password}`);
        //this.setState({ ...credentials, status: 'Credentials loaded!' });
      }
      //this.setState({ status: 'No credentials stored.' });
    } catch (err) {
      console.log(err);

      //this.setState({ status: 'Could not load credentials. ' + err });
    }
  };

  reset = async () => {
    try {
      await Keychain.resetGenericPassword();
    } catch (err) {
      //this.setState({ status: 'Could not reset credentials, ' + err });
    }
  };

  render() {
    return (
      <View>
        <Text> Home </Text>
        <Button
          title="Logout"
          onPress={() => {
            this.reset();
            firebase.auth().signOut();
            this.load();
          }}
        />
        <Button title="Load" onPress={this.load} />
      </View>
    );
  }
}

export default Home;

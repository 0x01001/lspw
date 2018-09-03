import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button, Icon, Header } from 'react-native-elements';
import firebase from 'firebase';
import * as Keychain from 'react-native-keychain';
import { Toolbar } from 'react-native-material-ui';

import layout from '../utils/layout';
import style from '../utils/style_sheet';
import appStyle from '../utils/app_style';

const marginTop = layout.getExtraTop();
class Home extends Component {
  static navigationOptions = {
    title: 'Home',
    drawerLabel: 'Home',
    drawerIcon: ({ tintColor }) => <Icon name="list" size={24} color={tintColor} />
  };

  state = {
    selected: [],
    searchText: ''
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
      <View style={{ flex: 1 }}>
        <Toolbar
          style={{
            container: { marginTop, backgroundColor: 'transparent' },
            centerElementContainer: { justifyContent: 'center', alignItems: 'center' }
          }}
          key="toolbar"
          leftElement="menu"
          onLeftElementPress={() => this.props.navigation.openDrawer()}
          centerElement="Home"
          searchable={{
            autoFocus: true,
            placeholder: 'Search',
            onChangeText: value => this.setState({ searchText: value }),
            onSearchClosed: () => this.setState({ searchText: '' })
          }}
          onRightElementPress={() => {}}
        />
        {/* <Header
          outerContainerStyles={{ marginTop }}
          leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{ text: 'Home', style: { color: '#fff' } }}
          rightComponent={{ icon: 'home', color: '#fff' }}
        />

        <Text> Home </Text>
        <Button
          title="Logout"
          onPress={() => {
            this.reset();
            this.load();
            firebase.auth().signOut();
          }}
        />
        <Button title="Load" onPress={this.load} /> */}
      </View>
    );
  }
}

export default Home;

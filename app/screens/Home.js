import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Button, Icon, Divider } from 'react-native-elements';
import * as Keychain from 'react-native-keychain';
import { Toolbar } from 'react-native-material-ui';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';

import layout from '../utils/layout';
import style from '../utils/style_sheet';
import appStyle from '../utils/app_style';
import List from '../components/home/List';
import NavManager from '../NavManager';
import { googleSignin } from '../actions';

const marginTop = layout.getExtraTop();
class Home extends Component {
  static navigationOptions = {
    title: 'Home',
    drawerLabel: 'Home',
    drawerIcon: ({ tintColor }) => <Icon name="list" size={24} color={tintColor} />
  };

  state = {
    selected: [],
    searchText: '',
    isModalVisible: false
  };

  componentWillMount() {
    // get all data
    //NavManager.showLoading();
  }
  componentWillReceiveProps(nextProps) {
    this.onComplete(nextProps);
  }

  onComplete(props) {
    //console.log('onComplete: ', props.isForgotDone);
    if (props.token) {
      //TODO: show popup
    }
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

  import = () => {
    this.props.googleSignin();
  };

  _toggleModal = () => this.setState({ isModalVisible: !this.state.isModalVisible });

  render() {
    return (
      <View>
        <Toolbar
          style={{
            container: { marginTop, backgroundColor: 'transparent' },
            titleText: { fontSize: 18 }
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
        />
        <Divider style={{ height: 1, backgroundColor: appStyle.borderColor }} />

        {/* <List /> */}

        <Button title="Import" onPress={this.import} />

        <TouchableOpacity onPress={this._toggleModal}>
          <Text>Show Modal</Text>
        </TouchableOpacity>

        <Modal isVisible={this.state.isModalVisible}>
          <View style={{ flex: 1 }}>
            <Text>Hello!</Text>

            <TouchableOpacity onPress={this._toggleModal}>
              <Text>Hide me!</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* <Header
          outerContainerStyles={{ marginTop }}
          leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{ text: 'Home', style: { color: '#fff' } }}
          rightComponent={{ icon: 'home', color: '#fff' }}
        /> */}

        {/* <Text style={{ alignSelf: 'center' }}> Home </Text>
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

const mapStateToProps = state => ({
  error: state.main.error,
  loading: state.main.loading,
  token: state.main.token
});

export default connect(
  mapStateToProps,
  { googleSignin }
)(Home);

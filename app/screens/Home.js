import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation } from 'react-native';
import { Button, Icon, Divider } from 'react-native-elements';
import * as Keychain from 'react-native-keychain';
import { Toolbar } from 'react-native-material-ui';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import firebase from 'firebase';
import _ from 'lodash';

import layout from '../utils/layout';
import style from '../utils/style_sheet';
import appStyle from '../utils/app_style';
import List from '../components/home/List';
import NavManager from '../NavManager';
import { googleSignin, importData, fetchData } from '../actions';
import { TextInput } from '../components/common';

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
    isModalVisible: false,
    url: '',
    urlErrorMessage: ''
  };

  componentWillMount() {
    // get all data
    NavManager.showLoading();
    this.props.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    this.onComplete(nextProps);
  }

  componentWillUpdate() {
    LayoutAnimation.spring();
  }

  onComplete(props) {
    console.log('onComplete: ', props.token + ' - '+props.isShowImport);   
    props.listData.forEach(x => {
      console.log('x: ',x);      
    }); 
    // show popup
    this.setState({ isModalVisible: props.isShowImport });    
  }
 
  reset = async () => {
    try {
      await Keychain.resetGenericPassword();
    } catch (err) {
      //this.setState({ status: 'Could not reset credentials, ' + err });
    }
  };

  signIn = () => {
    this.props.googleSignin();
    //this.setState({ isModalVisible: true });
  };

  import = () => {
    const { url } = this.state;
    if (!url) {
      this.setState({ urlErrorMessage: !url ? 'This field is required' : '' });
      return;
    }
    const { token, listData } = this.props;
    console.log('import: ', token, listData);

    this.props.importData({ url, token, listData });
  };

  resetModal = () => {
    this.setState({ url: '' });
  };

  renderError = () => {
    if (this.props.error) {
      return (
        <View>
          <Text style={style.error}>{this.props.error}</Text>
        </View>
      );
    }
    return null;
  };

  renderModalContent = () => (
    <View style={styles.modal}>
      <TextInput
        placeholderText="Link"
        leftIconName="link-variant"
        errorMessage={this.state.urlErrorMessage}
        value={this.state.url}
        onChangeText={text => {
          this.setState({
            url: text,
            urlErrorMessage: !text ? 'This field is required' : ''
          });
        }}
      />
      {this.renderError()}
      <View style={styles.modalContent}>
        <Button
          title="Ok"
          buttonStyle={[style.button, { marginLeft: -15, marginTop: 20 }]}
          titleStyle={style.buttonTitle}
          onPress={this.import}
        />
        <Button
          title="Cancel"
          buttonStyle={[style.button, { marginRight: -30, marginTop: 20 }]}
          titleStyle={style.buttonTitle}
          onPress={() => {
            this.setState({ isModalVisible: false });
          }}
        />
      </View>
      <Text style={styles.note}>(*) Automatic remove duplicates</Text>
    </View>
  );
  
  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={style.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  renderImportButton = () => {
    if (this.state.isModalVisible || this.props.listData !== null) {
      return null;
    }
    return (
      <Button
        title="Import"
        buttonStyle={[style.button, { width: 120 }]}
        titleStyle={style.buttonTitle}
        loading={this.props.loading}
        loadingProps={{ size: 'small', color: appStyle.mainColor }}
        onPress={this.signIn}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
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
        <Divider style={{ backgroundColor: appStyle.borderColor }} />

        <View style={styles.import}>
          {this.renderImportButton()}
          <Modal
            isVisible={this.state.isModalVisible}
            onBackdropPress={() => this.setState({ isModalVisible: false })}
            // animationIn="slideInLeft"
            // animationOut="slideOutRight"
            backdropColor={'#00000050'}
            onModalHide={this.resetModal}
            // backdropOpacity={1}
            // animationIn="zoomIn"
            // animationOut="zoomOut"
            // animationInTiming={300}
            // animationOutTiming={300}
          >
            {this.renderModalContent()}
          </Modal>
        </View>

        {/* <List data /> */}

        {/* <Header
          outerContainerStyles={{ marginTop }}
          leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{ text: 'Home', style: { color: '#fff' } }}
          rightComponent={{ icon: 'home', color: '#fff' }}
        /> */}

        {/* <Text style={{ alignSelf: 'center' }}> Home </Text> */}
        <Button title="Logout" onPress={() => {
            this.reset(); 
            firebase.auth().signOut();
          }}
        />
        {/* <Button title="Load" onPress={this.load} /> */}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column'
  },
  modal: {
    backgroundColor: `${appStyle.blackColor}60`,
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1,
    borderColor: 'rgba(0, 0, 0, 1)'
  },
  import: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: 15,
    marginRight: 15
  },
  note:{
    marginTop: 15,
    color:appStyle.grayColor, 
    fontSize:14, 
    alignSelf:'flex-start'
  }
});

const mapStateToProps = state => ({
  error: state.main.error,
  loading: state.main.loading,
  token: state.main.token,
  listData: state.main.listData
});

export default connect(
  mapStateToProps,
  { googleSignin, importData, fetchData }
)(Home);


// let currentData = [{uid:'1', url:'a1.com', username:'test1', password: '123'}, {uid:'2', url:'a2.com', username:'test2', password: '123'}, {uid:'3', url:'a4.com', username:'test2', password: '123'}];
// let dataImport = [{uid:'', url:'a1.com', username:'test1', password: '1234567'}, {uid:'',url:'a3.com', username:'test2', password: '123456'}, {uid:'',url:'a5.com', username:'test2', password: '123456'}];
// const arr = _.union(dataImport, currentData);

// const result = _.uniqWith(arr, (x, y) => {
//   console.log('x.username: ',x.username,y.username,x.url, y.url, x.uid, y.uid);    
//   if (x.username === y.username && x.url === y.url){
//     y.uid = x.uid; 
//     console.log('uid: ',y.uid, x.uid);        
//     return true;
//   }
//   return false;
// });
// console.log('------> ',result);    
// let arrPush= [];
// var arrUpdate = _.remove(result, function(x) {
//   if (x.uid !== '') {
//     return true;
//   }      
//   arrPush.push(x);
//   return false;
// });
// console.log('------> ', arrPush, arrUpdate);   
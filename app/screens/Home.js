import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, FlatList } from 'react-native'
import { Button, Icon, Divider, ListItem } from 'react-native-elements'
import * as Keychain from 'react-native-keychain'
import { Toolbar } from 'react-native-material-ui'
import { connect } from 'react-redux'
import firebase from 'firebase'
import _ from 'lodash'

import layout from '../utils/layout'
import style from '../utils/style_sheet'
import appStyle from '../utils/app_style'
import List from '../components/home/List'
import AppNav from '../AppNav'
import { googleSignin, importData, fetchData } from '../actions'

const marginTop = layout.getExtraTop()
class Home extends Component {
  // static navigationOptions = {
  //   title: 'Home',
  //   drawerLabel: 'Home',
  //   drawerIcon: ({ tintColor }) => <Icon name="list" size={24} color={tintColor} />
  // };

  state = {
    selected: [],
    searchText: '',
    isShowImport: false

  };

  componentWillMount() {
    // get all data
    this.props.fetchData()
  }

  componentWillReceiveProps(nextProps) {
    this.onComplete(nextProps)
  }

  // componentWillUpdate() {
  //   LayoutAnimation.spring()
  // }

  onComplete(props) {
    console.log('onComplete: ', `${props.token} - ${props.isShowImport}`)
    // props.listData.forEach((x) => {
    //   console.log('onComplete: ', x)
    // })
    // show popup
    this.setState({ isShowImport: props.isShowImport && props.token !== '' })
    if (props.isShowImport) { AppNav.showImport() }
  }

  reset = async () => {
    try {
      await Keychain.resetGenericPassword()
    } catch (err) {
      // this.setState({ status: 'Could not reset credentials, ' + err });
    }
  };

  test = () => {
    const currentData = [{
      uid: '1', url: 'a1.com', username: 'test1', password: '123', desc: '1'
    }, {
      uid: '2', url: 'a2.com', username: 'test2', password: '123', desc: '2'
    }, {
      uid: '3', url: 'a4.com', username: 'test2', password: '123', desc: '3'
    }]
    const dataImport = [{
      uid: '', url: 'a1.com', username: 'test1', password: '1234567', desc: '11'
    }, {
      uid: '', url: 'a2.com', username: 'test2', password: '123', desc: '2', test: '1'
    }, {
      uid: '', url: 'a2.com', username: 'test2', password: '123', desc: '2', test: '2'
    }, {
      uid: '', url: 'a5.com', username: 'test2', password: '123456', desc: '3'
    }]

    let arrDuplicate = []
    const arr = _.union(dataImport, currentData)
    const result = _.uniqWith(arr, (x, y) => {
      console.log('x: ', x)
      console.log('y: ', y)
      console.log('-----------------------------')
      if (x && y) {
        if (x.username === y.username && x.url === y.url) {
          // console.log('uid: ',y.uid, x.uid);
          y.uid = x.uid
          if (x.password === y.password && x.desc === y.desc) {
            // console.log('duplicate: ',y);
            arrDuplicate = [...arrDuplicate, y]
          }
          return true
        }
        return false
      }
      return false
    })

    arrDuplicate.forEach((x) => {
      _.pull(result, x)
    })

    // const result = _.remove(arr, (x, y) => {
    //   if (x.username === y.username && x.url === y.url && x.password === y.password){
    //     y.uid = x.uid;
    //     console.log('uid: ',y.uid, x.uid);
    //     return true;
    //   }
    //   return false;
    // });

    console.log('------> ', result)
    console.log('------> ', currentData, dataImport)
    // let arrPush= [];
    // var arrUpdate = _.remove(result, function(x) {
    //   if (x.uid !== '') {
    //     return true;
    //   }
    //   arrPush.push(x);
    //   return false;
    // });
    // console.log('------> ', arrPush, arrUpdate);
  };

  import = () => {
    const { url } = this.state
    if (!url) {
      this.setState({ urlErrorMessage: !url ? 'This field is required' : '' })
      return
    }
    const { token, listData } = this.props
    // console.log('import: ', token, listData)
    this.props.importData({ url, token, listData })
  };

  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={style.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  renderItem = ({ item }) => (
    <ListItem
      // contentContainerStyle={{justifyContent:'flex-start', alignContent:'flex-start'}}
      title={item.name}
      subtitle={item.username}
      // leftAvatar={{
      //   source: item.avatar_url && { uri: item.avatar_url },
      //   title: item.name[0]
      // }}
      rightIcon={{ name: 'chevron-right' }}
    />
  )

  renderButtonImport = () => {
    // console.log('renderButtonImport: ', this.state.isShowImport)
    if (this.state.isShowImport) {
      return null
    }
    return (
      <Button
        title="Import data"
        buttonStyle={[style.button, { width: 120 }]}
        titleStyle={style.buttonTitle}
        loading={this.props.loading}
        loadingProps={{ size: 'small', color: appStyle.mainColor }}
        onPress={() => { this.props.googleSignin() }}
      />
    )
  }

  renderContent = () => {
    if (this.props.listData) {
      return (
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.props.listData}
            renderItem={this.renderItem}
            keyExtractor={(x, i) => i.toString()}
            ListEmptyComponent={this.renderButtonImport}
            contentContainerStyle={[{ flexGrow: 1 }, this.props.listData.length ? null : { justifyContent: 'center' }]}
          />
        </View>
      )
    }
    return (<View style={styles.content}><Text style={{ color: appStyle.mainColor }}>Loading...</Text></View>)
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
        {this.renderContent()}

        {/* <Header
          outerContainerStyles={{ marginTop }}
          leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{ text: 'Home', style: { color: '#fff' } }}
          rightComponent={{ icon: 'home', color: '#fff' }}
        /> */}

        {/* <Text style={{ alignSelf: 'center' }}> Home </Text> */}
        {/* <Button
          title="Test"
          buttonStyle={[style.button, { width: 120 }]}
          titleStyle={style.buttonTitle}
          loading={this.props.loading}
          loadingProps={{ size: 'small', color: appStyle.mainColor }}
          onPress={this.test}
        />
        <Button title="Logout" onPress={() => {
            this.reset();
            firebase.auth().signOut();
          }}
        /> */}
        {/* <Button title="Load" onPress={this.load} /> */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const mapStateToProps = state => ({
  error: state.main.error,
  loading: state.main.loading,
  token: state.main.token,
  isShowImport: state.main.isShowImport,
  listData: state.main.listData
})

export default connect(
  mapStateToProps,
  { googleSignin, importData, fetchData }
)(Home)

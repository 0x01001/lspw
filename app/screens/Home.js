import React, { Component } from 'react'
import { View, Text, Dimensions, StyleSheet, LayoutAnimation, TouchableOpacity, Alert, RefreshControl } from 'react-native'
import { Divider } from 'react-native-elements'
import { Toolbar, ActionButton } from 'react-native-material-ui'
import _ from 'lodash'
import { observer } from 'mobx-react'
import { observable, reaction } from 'mobx'
import { RecyclerListView, LayoutProvider, DataProvider } from 'recyclerlistview'
import Swipeable from 'react-native-swipeable-row'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import layout from '../utils/layout'
import appStyle from '../utils/app_style'
import AppNav from '../AppNav'
import AccountStore from '../models/AccountStore'
import Item from '../components/home/Item'
import { deleteData } from '../utils'
import constant from '../utils/constant'

const marginTop = layout.getExtraTop()

@observer
class Home extends Component {
  @observable
  isSearching = false;
  @observable
  swipeable = null;
  @observable
  keyword = '';
  @observable
  leftElement = 'menu';
  didMount = false;

  constructor(args) {
    super(args)
    const { width } = Dimensions.get('window')

    this.state = {
      dataProvider: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(AccountStore.data),
      refreshing: false
    }

    this._layoutProvider = new LayoutProvider(i => this.state.dataProvider.getDataForIndex(i), (type, dim) => {
      dim.width = width
      dim.height = 66
    })

    reaction(() => AccountStore.data, (newItems) => {
      console.log('change....: ', this.didMount)
      // const data = this.state.dataProvider.getAllData()
      const dataUpdate = this.isSearching ? AccountStore.searchData(this.keyword) : AccountStore.data
      // const nextData = [...dataUpdate, ...data]
      // const nextProvider = this.state.dataProvider.cloneWithRows(nextData)
      // this.setState({
      //   dataProvider: nextProvider
      // })
      if (this.didMount) {
        this.setState(prevState => ({
          dataProvider: prevState.dataProvider.cloneWithRows(dataUpdate)
        }))
      }
    })
  }

  componentDidMount() {
    this.didMount = true
  }

  componentWillUpdate() {
    LayoutAnimation.spring()
  }

  componentWillUnmount() {
    this.didMount = false
  }

  checkSearch = x => _.includes(x.name, this.keyword) || _.includes(x.username, this.keyword)

  onSearch = (val) => {
    // console.log('onSearch')
    this.keyword = val
    this.isSearching = true
    // this.dataSearch = AccountStore.searchData(val)
    this.setState(prevState => ({
      dataProvider: prevState.dataProvider.cloneWithRows(AccountStore.searchData(val))
    }))
  }

  onSearchClosed = () => {
    // console.log('onSearchClosed')
    this.isSearching = false
    // this.dataSearch = []
    this.setState({ dataProvider: this.state.dataProvider.cloneWithRows(AccountStore.data) })
  }

  renderEmptyContent = () => (
    <View style={styles.content}><Text style={{ color: appStyle.mainColor, fontSize: 18 }}>No data</Text></View>
  )

  renderResultSearch = () => {
    if (this.isSearching && this.state.dataProvider.getSize() > 0) {
      return (
        <View>
          <Text style={styles.resultText}>Result: {this.state.dataProvider.getSize()}</Text>
          <Divider style={{ backgroundColor: appStyle.borderColor }} />
        </View>)
    }
    return null
  }

  handleScroll = () => {
    if (this.swipeable) {
      this.swipeable.recenter()
    }
  }

  onOpen = (event, gestureState, sw) => {
    if (this.swipeable && this.undefined !== 'undefined' && this.swipeable !== sw) {
      this.swipeable.recenter()
    }
    this.swipeable = sw
  }

  onClose = () => { this.swipeable = null }

  closeSwipe = () => {
    if (this.swipeable) {
      if (this.state.dataProvider.getSize() > 0) { // fix: Can't call setState (or forceUpdate) on an unmounted component
        this.swipeable.recenter()
      }
      this.swipeable = null
    }
  }

  onDelete = (item) => {
    deleteData(item, () => {
      this.closeSwipe()
    }, () => {
      this.closeSwipe()
    })
  }

  _renderRow = item => (
    <Swipeable
      rightButtonWidth={70}
      rightButtons={[
        <TouchableOpacity style={[styles.rightSwipeItem, { backgroundColor: `${appStyle.redColor}80` }]} onPress={() => this.onDelete(item)}>
          {/* <Text style={{ textAlign: 'center' }}>Delete</Text> */}
          <Icon name="delete-forever" size={25} color={appStyle.mainColor} />
        </TouchableOpacity>
      ]}
      onRightButtonsOpenRelease={this.onOpen}
      onRightButtonsCloseRelease={this.onClose}
      swipeStartMinRightEdgeClearance={10}
    >
      <Item
        data={item}
        onPress={() => {
          this.closeSwipe()
          AppNav.pushToScreen('detail', { title: item.name, item })
          // AppNav.pushToScreen('detail', { title: item.name, item, onNavigateBack: this.handleOnNavigateBack })
        }}
      />
    </Swipeable>
  )

  _onRefresh = () => {
    this.setState({ refreshing: true })
    AccountStore.load(() => {
      this.setState({ refreshing: false })
      if (AccountStore.isSelecting) {
        this.leftElement = 'radio-button-unchecked'
      }
    })
  }

  renderList = () => {
    if (this.state.dataProvider.getSize() === 0) {
      return this.renderEmptyContent()
    }
    return (
      <RecyclerListView
        // ref={ref => this._recyclerListView = ref}
        layoutProvider={this._layoutProvider}
        dataProvider={this.state.dataProvider}
        rowRenderer={this._renderRow}
        onScroll={this.handleScroll}
        optimizeForInsertDeleteAnimations={false}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
            colors={[appStyle.redColor]}
          />
        }
      />)
  }

  onLeftToolBarPress = () => {
    if (AccountStore.isSelecting) {
      if (this.leftElement === 'radio-button-unchecked') {
        AccountStore.setSelectAll(true)
        this.leftElement = 'check-circle'
      } else {
        AccountStore.setSelectAll(false)
        this.leftElement = 'radio-button-unchecked'
      }
      return
    }
    AppNav.openMenu()
  }

  onComplete = () => {
    AccountStore.setSelect(false)
    AccountStore.setSelectAll(false)
    this.leftElement = 'menu'
  }

  onRightToolBarPress = (index) => {
    // console.log('onRightToolBarPress: ', index)
    if (AccountStore.isSelecting) {
      const data = AccountStore.dataDelete()
      if (data.length > 0) {
        Alert.alert(
          'Are you sure?',
          `You want to delete ${data.length} records?`,
          [
            { text: 'Cancel', style: 'cancel', onPress: () => { this.onComplete() } },
            {
              text: 'OK',
              onPress: () => {
                const list = data.map(x => x.id)
                // console.log('list: ', list)
                AccountStore.saveData(null, constant.DATA_DELETE_ALL, true, () => {
                  this.onComplete()
                }, list)
              }
            }
          ],
          { cancelable: false }
        )
      } else {
        this.onComplete()
      }
      return
    }
    switch (index) {
      case 0:
        AccountStore.googleSignin()
        break
      case 1:

        break
      case 2:
        AccountStore.setSelect(true)
        this.leftElement = 'radio-button-unchecked'
        break
      default:
        break
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Toolbar
          style={{
            container: { marginTop, backgroundColor: appStyle.buttonBackgroundColor },
            titleText: { fontSize: 18, color: appStyle.mainColor },
            leftElement: { color: appStyle.mainColor },
            rightElement: { color: appStyle.mainColor },
            leftElementContainer: { marginLeft: 8 },
            centerElementContainer: { marginLeft: 12 }
          }}
          key="toolbar"
          leftElement={this.leftElement}
          onLeftElementPress={() => this.onLeftToolBarPress()}
          centerElement="Home"
          searchable={{
            autoFocus: true,
            placeholder: 'Search',
            onChangeText: value => this.onSearch(value),
            onSearchClosed: () => this.onSearchClosed()
          }}
          rightElement={AccountStore.isSelecting ? 'check' : {
            menu: {
              icon: 'more-vert',
              labels: ['Import', 'Export', 'Delete Selected']
            }
          }}
          onRightElementPress={({ action, result, index }) => this.onRightToolBarPress(index)}
        />
        {this.renderResultSearch()}
        {this.renderList()}
        <ActionButton
          style={{ container: { backgroundColor: `${appStyle.redColor}50` } }}
          onPress={() => {
            this.closeSwipe()
            AppNav.pushToScreen('detail', { title: 'Create' })
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: appStyle.backgroundColor
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  resultText: {
    color: appStyle.mainColor,
    marginLeft: 23,
    marginVertical: 5,
    fontStyle: 'italic'
  },
  rightSwipeItem: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 25
  }
})

export default Home

// handleOnNavigateBack = (item, act = true) => {
//   console.log('handleOnNavigateBack: ', item)
//   // if (this.isSearching) {
//   //   // console.log('add dataSearch...')
//   //   // this.dataSearch = [item, ...this.dataSearch]
//   //   // this.dataSearch = this.dataSearch.sort((x, y) => y.date - x.date)
//   //   this.setState({ dataProvider: this.state.dataProvider.cloneWithRows(AccountStore.searchData(this.keyword)) })
//   //   return
//   // }
//   // this.setState({ dataProvider: this.state.dataProvider.cloneWithRows(AccountStore.data) })
// }

// renderContent = () => (
//   <View style={{ flex: 1 }}>
//     {this.renderResultSearch()}
//     <FlatList
//       // initialNumToRender={10}
//       data={this.isSearching ? this.dataSearch : AccountStore.data}
//       renderItem={this.renderItem}
//       keyExtractor={item => item.id}
//       ListEmptyComponent={this.renderEmptyContent}
//       contentContainerStyle={[{ flexGrow: 1 }, this.isSearching && this.dataSearch.length === 0 ? { justifyContent: 'center' } : AccountStore.data.length ? null : { justifyContent: 'center' }]}
//       // refreshing={true}
//       // onRefresh={this.onRefresh}
//     />
//   </View>
// )

// test = () => {
//   const currentData = [{
//     uid: '1', url: 'a1.com', username: 'test1', password: '123', desc: '1'
//   }, {
//     uid: '2', url: 'a2.com', username: 'test2', password: '123', desc: '2'
//   }, {
//     uid: '3', url: 'a4.com', username: 'test2', password: '123', desc: '3'
//   }]
//   const dataImport = [{
//     uid: '', url: 'a1.com', username: 'test1', password: '1234567', desc: '11'
//   }, {
//     uid: '', url: 'a2.com', username: 'test2', password: '123', desc: '2', test: '1'
//   }, {
//     uid: '', url: 'a2.com', username: 'test2', password: '123', desc: '2', test: '2'
//   }, {
//     uid: '', url: 'a5.com', username: 'test2', password: '123456', desc: '3'
//   }]

//   let arrDuplicate = []
//   const arr = _.union(dataImport, currentData)
//   const result = _.uniqWith(arr, (x, y) => {
//     console.log('x: ', x)
//     console.log('y: ', y)
//     console.log('-----------------------------')
//     if (x && y) {
//       if (x.username === y.username && x.url === y.url) {
//         // console.log('uid: ',y.uid, x.uid);
//         y.uid = x.uid
//         if (x.password === y.password && x.desc === y.desc) {
//           // console.log('duplicate: ',y);
//           arrDuplicate = [...arrDuplicate, y]
//         }
//         return true
//       }
//       return false
//     }
//     return false
//   })

//   arrDuplicate.forEach((x) => {
//     _.pull(result, x)
//   })

//   // const result = _.remove(arr, (x, y) => {
//   //   if (x.username === y.username && x.url === y.url && x.password === y.password){
//   //     y.uid = x.uid;
//   //     console.log('uid: ',y.uid, x.uid);
//   //     return true;
//   //   }
//   //   return false;
//   // });

//   console.log('------> ', result)
//   console.log('------> ', currentData, dataImport)
//   // let arrPush= [];
//   // var arrUpdate = _.remove(result, function(x) {
//   //   if (x.uid !== '') {
//   //     return true;
//   //   }
//   //   arrPush.push(x);
//   //   return false;
//   // });
//   // console.log('------> ', arrPush, arrUpdate);
// };

// renderAvatar = async (name) => {
//   try {
//     const url = `https://www.google.com/s2/favicons?domain=${name}`
//     const { data } = await axios.get(url, { responseType: 'arraybuffer' })
//     console.log('data: ', data, url)
//     const base64 = Buffer.from(data, 'binary').toString('base64')
//     console.log('base64: ', base64)
//     if (base64) {
//       return (
//         <Image
//           source={{ uri: `data:image/png;base64,${base64}` }}
//           style={{ height: 50, width: 50 }}
//         />)
//     }
//     return null
//   } catch (error) {
//     console.log(error)
//   }
// }

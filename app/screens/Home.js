import React, { Component } from 'react'
import { View, Text, Dimensions, StyleSheet, LayoutAnimation, FlatList } from 'react-native'
import { Divider } from 'react-native-elements'
import { Toolbar, ActionButton } from 'react-native-material-ui'
import _ from 'lodash'
import { observer } from 'mobx-react'
import { observable, reaction } from 'mobx'
import { RecyclerListView, LayoutProvider, DataProvider } from 'recyclerlistview'

import layout from '../utils/layout'
import style from '../utils/style_sheet'
import appStyle from '../utils/app_style'
import AppNav from '../AppNav'
import AccountStore from '../models/AccountStore'
// import { writeToClipboard } from '../utils'
import List from '../components/home/List'

const marginTop = layout.getExtraTop()

@observer
class Home extends Component {
  constructor(args) {
    super(args)
    const { width } = Dimensions.get('window')

    this.state = {
      selected: [],
      searchText: '',
      activeRowId: '',
      dataProvider: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(AccountStore.data)
    }

    this._layoutProvider = new LayoutProvider(i => this.state.dataProvider.getDataForIndex(i), (type, dim) => {
      dim.width = width
      dim.height = 66
    })

    reaction(() => AccountStore.data, (newItems) => {
      console.log('change....')

      if (this.isSearching) {
        // this.setState({ dataProvider: this.state.dataProvider.cloneWithRows(AccountStore.searchData(this.keyword)) })
        this.setState(prevState => ({
          dataProvider: prevState.dataProvider.cloneWithRows(AccountStore.searchData(this.keyword))
        }))
        return
      }
      // this.setState({ dataProvider: this.state.dataProvider.cloneWithRows(AccountStore.data) })
      // const data = this.state.dataProvider.getAllData()
      // const nextData = [...AccountStore.data, ...data]
      // const nextProvider = this.state.dataProvider.cloneWithRows(nextData)
      // this.setState({
      //   dataProvider: nextProvider
      // })
      this.setState(prevState => ({
        dataProvider: prevState.dataProvider.cloneWithRows(AccountStore.data)
      }))
    })
  }

  @observable
  isSearching = false;
  // @observable
  // dataSearch = [];
  @observable
  keyword = '';

  componentWillUpdate() {
    LayoutAnimation.spring()
  }

  checkSearch = x => _.includes(x.name, this.keyword) || _.includes(x.username, this.keyword)

  handleOnNavigateBack = (item, act = true) => {
    console.log('handleOnNavigateBack: ', item)
    // if (this.isSearching) {
    //   // console.log('add dataSearch...')
    //   // this.dataSearch = [item, ...this.dataSearch]
    //   // this.dataSearch = this.dataSearch.sort((x, y) => y.date - x.date)
    //   this.setState({ dataProvider: this.state.dataProvider.cloneWithRows(AccountStore.searchData(this.keyword)) })
    //   return
    // }
    // this.setState({ dataProvider: this.state.dataProvider.cloneWithRows(AccountStore.data) })
  }

  onSearch = (val) => {
    // console.log('onSearch')
    this.keyword = val
    this.isSearching = true
    // this.dataSearch = AccountStore.searchData(val)
    this.setState({ dataProvider: this.state.dataProvider.cloneWithRows(AccountStore.searchData(val)) })
  }

  onSearchClosed = () => {
    // console.log('onSearchClosed')
    this.isSearching = false
    // this.dataSearch = []
    this.setState({ dataProvider: this.state.dataProvider.cloneWithRows(AccountStore.data) })
  }

  onRefresh = () => {
    alert('refresh')
  }

  onSwipeOpen(item, rowId, direction) {
    this.setState({ activeRowId: item.id })
  }

  onSwipeClose(item, rowId, direction) {
    if (item.id === this.state.activeRowId && typeof direction !== 'undefined') {
      this.setState({ activeRowId: '' })
    }
  }

  onDeleteItem = (item) => {
    alert(`delete: ${item.id}`)
  }

  // renderItem = ({ item }) => (
  //   <List
  //     item={item}
  //     onPress={() => {
  //       if (this.isSearching) {
  //         this.dataSearch.splice(this.dataSearch.indexOf(item), 1)
  //       }
  //       AppNav.pushToScreen('detail', { title: item.name, item, onNavigateBack: this.handleOnNavigateBack })
  //     }}
  //     // activeRowId={this.state.activeRowId}
  //     // onSwipeOpen={(x, rowId, direction) => this.onSwipeOpen(x, rowId, direction)}
  //     // onSwipeClose={(x, rowId, direction) => this.onSwipeClose(x, rowId, direction)}
  //     // onDeleteItem={x => this.onDeleteItem(x)}
  //   />
  // )

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

  // _changeRows = () => {
  //   this.setState(prevState => ({
  //     dataProvider: prevState.dataProvider.cloneWithRows(makeRows(20))
  //   }), () => {
  //     this._recyclerListView._refreshViewability()
  //     this.setState({
  //       dataProvider: this.state.dataProvider.cloneWithRows(makeRows(24)),
  //       indexes: this._recyclerListView.getCurrentScrollOffset()
  //     })
  //   })
  // }

  _renderRow = item => (<List
    item={item}
    onPress={() => {
      // if (this.isSearching) {
      //   this.dataSearch.splice(this.dataSearch.indexOf(item), 1)
      // }
      AppNav.pushToScreen('detail', { title: item.name, item, onNavigateBack: this.handleOnNavigateBack })
    }}
  />)

  renderList = () => {
    if (this.state.dataProvider.getSize() === 0) {
      return this.renderEmptyContent()
    }
    return (<RecyclerListView
      ref={ref => this._recyclerListView = ref}
      layoutProvider={this._layoutProvider}
      dataProvider={this.state.dataProvider}
      rowRenderer={this._renderRow}
      optimizeForInsertDeleteAnimations={true}
    />)
  }

  renderContent = () => (
    <View style={{ flex: 1 }}>
      {this.renderResultSearch()}
      {this.renderList()}
      {/* <FlatList
        // initialNumToRender={10}
        data={this.isSearching ? this.dataSearch : AccountStore.data}
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={this.renderEmptyContent}
        contentContainerStyle={[{ flexGrow: 1 }, this.isSearching && this.dataSearch.length === 0 ? { justifyContent: 'center' } : AccountStore.data.length ? null : { justifyContent: 'center' }]}
        // refreshing={true}
        // onRefresh={this.onRefresh}
      /> */}
    </View>
  )

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
          leftElement="menu"
          onLeftElementPress={() => AppNav.openMenu()}
          centerElement="Home"
          rightElement={{
            menu: {
              icon: 'more-vert',
              labels: ['Import', 'Export', 'Delete All']
            }
          }}
          searchable={{
            autoFocus: true,
            placeholder: 'Search',
            onChangeText: value => this.onSearch(value),
            onSearchClosed: () => this.onSearchClosed()
          }}
        />
        {this.renderResultSearch()}
        {this.renderList()}
        <ActionButton
          style={{ container: { backgroundColor: `${appStyle.redColor}80` } }}
          onPress={() => {
            AppNav.pushToScreen('detail', { title: 'Create', onNavigateBack: this.handleOnNavigateBack })
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
  }
})

export default Home

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

import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, FlatList, Animated, PanResponder, Image, Clipboard } from 'react-native'
import { Button, Icon, Divider, ListItem } from 'react-native-elements'
import { Toolbar, ActionButton } from 'react-native-material-ui'
import _ from 'lodash'
import { observer } from 'mobx-react'
import { observable } from 'mobx'

import layout from '../utils/layout'
import style from '../utils/style_sheet'
import appStyle from '../utils/app_style'
import AppNav from '../AppNav'
import AccountStore from '../models/AccountStore'
import { writeToClipboard } from '../utils'

const marginTop = layout.getExtraTop()

@observer
class Home extends PureComponent {
  state = {
    selected: [],
    searchText: ''
  };
  @observable
  isSearching = false;
  @observable
  dataSearch = [];

  componentWillUpdate() {
    LayoutAnimation.spring()
  }

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

  onSearch = (val) => {
    console.log('onSearch')
    this.isSearching = true
    this.dataSearch = AccountStore.searchData(val)
  }

  onSearchClosed = () => {
    console.log('onSearchClosed')
    this.isSearching = false
    this.dataSearch = []
  }

  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={style.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  renderItem = ({ item }) => (
    <ListItem
      containerStyle={{ backgroundColor: 'transparent', paddingVertical: 10 }}
      title={item.name}
      subtitle={item.username ? item.username : null}
      titleStyle={{ color: appStyle.mainColor, fontWeight: 'bold', height: 26 }}
      subtitleStyle={item.username ? {
        color: appStyle.mainColor, fontSize: 12, fontStyle: 'italic', height: 20
      } : null}
      leftAvatar={{
        size: 26,
        rounded: true,
        source: { uri: `https://www.google.com/s2/favicons?domain=${item.name}` },
        // title: 'N/A',
        overlayContainerStyle: { backgroundColor: 'transparent' }
      }}
      rightIcon={{ name: 'chevron-right', color: appStyle.mainColor }}
      onPress={() => AppNav.pushToScreen('detail', { title: item.name, item })}
      onLongPress={() => writeToClipboard(item)}
      bottomDivider
    />
  )

  renderEmptyContent = () => (
    <View style={styles.content}><Text style={{ color: appStyle.mainColor, fontSize: 18 }}>No data</Text></View>
  )

  renderResultSearch = () => {
    if (this.isSearching && this.dataSearch.length > 0) {
      return (
        <View>
          <Text style={styles.resultText}>Result: {this.dataSearch.length}</Text>
          <Divider style={{ backgroundColor: '#484558' }} />
        </View>)
    }
    return null
  }

  renderContent = () => (
    // if (AccountStore.isFetching) {
    //   return (<View style={styles.content}><Text style={{ color: appStyle.mainColor, fontSize: 18 }}>Loading...</Text></View>)
    // }
    <View style={{ flex: 1 }}>
      {this.renderResultSearch()}
      <FlatList
        data={this.isSearching ? this.dataSearch : AccountStore.data}
        renderItem={this.renderItem}
        keyExtractor={(x, i) => x.id}
        ListEmptyComponent={this.renderEmptyContent}
        contentContainerStyle={[{ flexGrow: 1 }, this.isSearching && this.dataSearch.length === 0 ? { justifyContent: 'center' } : AccountStore.data.length ? null : { justifyContent: 'center' }]}
      />
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
        {this.renderContent()}
        <ActionButton
          style={{ container: { backgroundColor: `${appStyle.redColor}80` } }}
          onPress={() => {
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
  }
})

export default Home

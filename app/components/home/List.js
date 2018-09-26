import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { ListItem } from 'react-native-elements'
// import Swipeout from 'react-native-swipeout'

import appStyle from '../../utils/app_style'
import { writeToClipboard } from '../../utils'

class List extends PureComponent {
    static propTypes = {
      item: PropTypes.object,
      // activeRowId: PropTypes.string,
      onPress: PropTypes.func
      // onSwipeOpen: PropTypes.func,
      // onSwipeClose: PropTypes.func,
      // onDeleteItem: PropTypes.func
    }

    static defaultProps = {
      item: {},
      // activeRowId: '',
      onPress: () => {}
      // onSwipeOpen: () => {},
      // onSwipeClose: () => {},
      // onDeleteItem: () => {}
    }

    render() {
      const {
        item
        // , activeRowId, onSwipeClose, onSwipeOpen, onDeleteItem
      } = this.props
      console.log(`render: ${item.id} ### ${item.username}`)

      // const type = [
      //   { text: 'Primary', type: 'primary' },
      //   { text: 'Secondary', type: 'secondary' },
      //   { text: 'Delete', type: 'delete' }
      // ]

      // const swipeSettings = {
      //   autoClose: true,
      //   close: item.id !== activeRowId,
      //   onClose: (secId, rowId, direction) => onSwipeClose(item, rowId, direction),
      //   onOpen: (secId, rowId, direction) => onSwipeOpen(item, rowId, direction),
      //   right: [
      //     { onPress: () => onDeleteItem(item), text: 'Delete', type: 'delete' }
      //   ],
      //   rowId: item.id,
      //   sectionId: 1
      // }

      // console.log(`data: ${item.id} - ${item.username}`)
      return (
        // <Swipeout {...swipeSettings}>
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
          onPress={this.props.onPress}
          onLongPress={() => writeToClipboard(item)}
          bottomDivider
        />
        // </Swipeout>
      )
    }
}

export default List

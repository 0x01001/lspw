import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { ListItem } from 'react-native-elements'
import appStyle from '../../utils/app_style'
import { writeToClipboard } from '../../utils'

class List extends PureComponent {
    static propTypes = {
      item: PropTypes.object,
      onPress: PropTypes.func
    }

    static defaultProps = {
      item: {},
      onPress: () => {}
    }

    render() {
      const { item } = this.props
      // console.log(`data: ${item.id} - ${item.username}`)
      return (
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
      )
    }
}

export default List

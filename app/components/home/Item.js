import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ListItem } from 'react-native-elements'
import { observer } from 'mobx-react'

import appStyle from '../../utils/app_style'
import utils from '../../utils'
import AccountStore from '../../models/AccountStore'

@observer
class Item extends Component {
    static propTypes = {
      data: PropTypes.object,
      onPress: PropTypes.func
    }

    static defaultProps = {
      data: {},
      onPress: () => {}
    }

    // shouldComponentUpdate(newProps) {
    //   return this.props.data !== newProps.data
    // }

    render() {
      const { data } = this.props
      console.log(`render: ${data.id}`) // ### ${data.username}

      return (
        <ListItem
          containerStyle={{ backgroundColor: 'transparent', paddingVertical: 10 }}
          title={data.name}
          subtitle={data.username ? data.username : null}
          titleStyle={{ color: appStyle.mainColor, fontWeight: 'bold', height: 26 }}
          subtitleStyle={data.username ? {
            color: appStyle.mainColor, fontSize: 12, fontStyle: 'italic', height: 16
          } : null}
          leftAvatar={{
            size: 26,
            rounded: true,
            source: { uri: `https://www.google.com/s2/favicons?domain=${data.name}` },
            // title: 'N/A',
            overlayContainerStyle: { backgroundColor: 'transparent' }
          }}
          rightIcon={{ name: 'chevron-right', color: appStyle.mainColor }}
          leftIcon={AccountStore.isSelecting ? { name: data.state ? 'check-circle' : 'radio-button-unchecked', color: appStyle.mainColor, paddingLeft: 8 } : null}
          onPress={() => { AccountStore.isSelecting ? data.updateState(!data.state) : this.props.onPress() }}
          onLongPress={() => utils.writeToClipboard(data)}
          bottomDivider
        />
      )
    }
}

export default Item
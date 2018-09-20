import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { Button } from 'react-native-elements'
// import Modal from 'react-native-modal'
import style from '../../utils/style_sheet'
import appStyle from '../../utils/app_style'
import { TextInput } from '../../components/common'
import AccountStore from '../../models'

class ImportPopup extends Component {
  static propTypes = {
    visible: PropTypes.bool
  }

  static defaultProps = {
    visible: false
  }

  state = {
    visible: this.props.visible || false,
    url: '',
    urlError: ''
  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val, [`${key}Error`]: !val ? 'This field is required' : '' })
  };

  show = () => {
    this.setState({ visible: true })
  };

  hide = () => {
    this.setState({ visible: false })
    this.resetModal()
  };

  resetModal = () => {
    this.setState({ url: '' })
  };

  import = () => {
    const { url } = this.state
    if (!url) {
      this.setState({ urlError: !url ? 'This field is required' : '' })
      return
    }
    const { token, data } = AccountStore
    console.log('import: ', token, data)
    AccountStore.importData(url, token, data)
  };

  renderModalContent = () => (
    <View style={styles.modal}>
      <TextInput
        placeholderText="Link"
        leftIconName="link-variant"
        errorMessage={this.state.urlError}
        value={this.state.url}
        onChangeText={val => this.onChangeText('url', val)}
      />
      {/* {this.renderError()} */}
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
            this.setState({ visible: false })
          }}
        />
      </View>
      <Text style={styles.note}>(*) Automatic remove duplicates</Text>
    </View>
  );

  render() {
    const { visible } = this.state
    if (!visible) {
      return null
    }
    return (
      <View style={styles.wrapper}>
        {/* <Modal
          isVisible={visible}
          onBackdropPress={() => this.setState({ visible: false })}
          // animationIn="slideInLeft"
          // animationOut="slideOutRight"
          backdropColor="rgba(0,0,0,0.6)"
          onModalHide={this.resetModal}
        >
          {this.renderModalContent()}
        </Modal> */}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'absolute'
  },
  modal: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1,
    borderColor: 'rgba(0, 0, 0, 1)'
  },
  modalContent: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: 15,
    marginRight: 15
  },
  note: {
    marginTop: 15,
    color: appStyle.grayColor,
    fontSize: 14,
    alignSelf: 'flex-start'
  }
})

export default ImportPopup

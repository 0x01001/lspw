import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'
import PropTypes from 'prop-types'
import { Button } from 'react-native-elements'
import style from '../../utils/style_sheet'
import appStyle from '../../utils/app_style'
import { TextInput } from '../../components/common'

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
      urlErrorMessage: ''
    }

    show = () => {
      this.setState({ visible: true })
    };

    hide = () => {
      this.setState({ visible: false })
    };

    resetModal = () => {
      this.setState({ url: '' })
    };

    renderError = () => {
      if (this.props.error) {
        return (
          <View>
            <Text style={style.error}>{this.props.error}</Text>
          </View>
        )
      }
      return null
    };

    renderModalContent = () => (
      <View style={styles.modal}>
        <TextInput
          placeholderText="Link"
          leftIconName="link-variant"
          errorMessage={this.state.urlErrorMessage}
          value={this.state.url}
          onChangeText={(text) => {
            this.setState({
              url: text,
              urlErrorMessage: !text ? 'This field is required' : ''
            })
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
          <Modal
            isVisible={visible}
            onBackdropPress={() => this.setState({ visible: false })}
            // animationIn="slideInLeft"
            // animationOut="slideOutRight"
            backdropColor="#00000050"
            onModalHide={this.resetModal}
          >
            {this.renderModalContent()}
          </Modal>
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
    backgroundColor: `${appStyle.blackColor}60`,
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

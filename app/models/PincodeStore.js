import { types } from 'mobx-state-tree'
import firebase from 'firebase'
import axios from 'axios'

import AppState from '../AppState'
import AppNav from '../AppNav'
import constant from '../utils/constant'
import utils from '../utils'

const PinCodeStore = types.model({
  title: '',
  description: '',
  type: 0, // 0: cerate pin code (2)  1: change pin code (3) 2: unlock (1)
  step: 0,
  pinCode: '',
  // oldPinCode: '',
  confirmPinCode: ''

}).actions(self => ({

  setPinCode(val) {
    self.pinCode = val
  },

  setType(val) {
    self.type = val
    self.confirmPinCode = ''
    if (val === 0) {
      self.setStep(1)
    } else {
      self.setStep(0)
    }
  },

  setStep(val) {
    self.step = val
    self.setDataByStep()
  },

  setDataByStep() {
    switch (self.step) {
      case 0:
        self.title = 'Re-enter your PIN code'
        self.description = 'Enter your PIN code to continue'
        break
      case 1:
        self.title = 'Set screen lock'
        self.description = 'For security, set PIN code'
        break
      case 2:
        self.title = 'Re-enter your PIN code'
        self.description = ''
        break
      default:
        break
    }
  },

  setConfirmPinCodePinCode(val) {
    self.confirmPinCode = val
  },

  showMsg(msg) {
    AppNav.hideLoading()
    const m = msg === undefined || msg === null || msg === '' ? 'Something went wrong.' : msg
    AppNav.showToast(m)
  },

  getPinCode(callback) {
    const { currentUser } = firebase.auth()
    firebase.database().ref(`/data/${currentUser.uid}/e`).once('value', (snapshot) => {
      const pincode = snapshot.val()
      console.log('getPinCode: ', pincode)
      if (pincode) {
        // await updatePassword(pincode)
        AppNav.hideLoading()
        self.setPinCode(pincode)
        self.setType(2)
      }
      callback()
    })
  },

  updatePinCode(pincode) {
    if (AppState.internetConnect !== 'online') { return }
    AppNav.showLoading()

    const { currentUser } = firebase.auth()
    firebase.database().ref(`/data/${currentUser.uid}`).update({ e: pincode })
      .then(() => {
        // await updatePassword(pincode)
        AppNav.hideLoading()
        self.setPinCode(pincode)
        AppNav.reset('mainStack')
        self.showMsg(`${self.type === 0 ? 'Set' : 'Update'} PIN code success.`)
      })
      .catch(() => { self.showMsg() })
  },

  removePinCode(pw) {
    if (!pw) {
      self.showMsg('Password is required.')
      return
    }
    AppNav.showLoading()
    const password = utils.encrypt(pw, self.pinCode)
    firebase.auth().currentUser.getIdToken().then((token) => {
      // console.log('token: ', token)
      axios.post(`${constant.ROOT_URL}/removepincode`, { token, password }).then((res) => {
        // console.log(res)
        if (res.data.code === '1') {
          // await updatePassword(self.pincode)
          self.setPinCode('')
          self.showMsg('Remove PIN code success!')
        } else {
          self.showMsg(res.data.msg)
        }
      })
    })
  }

})).create({
  title: '',
  description: '',
  type: 0
})

export default PinCodeStore

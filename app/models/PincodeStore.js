import { types } from 'mobx-state-tree'
import firebase from 'firebase'
import AppState from '../AppState'
import AppNav from '../AppNav'

const PinCodeStore = types.model({
  title: '',
  description: '',
  type: 0, // 0: cerate pin code (2)  1: change pin code (3) 2: unlock (1)
  step: 0,
  pinCode: '',
  isUnlocked: false,
  oldPinCode: '',
  confirmPinCode: ''
}).actions(self => ({

  setPinCode(val) {
    self.pinCode = val
  },

  setUnlock(val) {
    self.isUnlocked = val
  },

  setType(val) {
    self.type = val
    self.oldPinCode = ''
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

  setOldPinCode(val) {
    self.oldPinCode = val
  },
  setConfirmPinCodePinCode(val) {
    self.confirmPinCode = val
  },

  getPinCode(callback) {
    // AppNav.showLoading()
    const { currentUser } = firebase.auth()
    firebase.database().ref(`/data/${currentUser.uid}/e`).once('value', (snapshot) => {
      const data = snapshot.val()
      console.log('getPinCode: ', data)
      if (data && !self.isUnlocked) { // check login = user khac
        AppNav.hideLoading()
        self.setPinCode(data)
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
        AppNav.hideLoading()
        self.setPinCode(pincode)
        AppNav.reset('mainStack')
        self.showMsg(`${self.type === 0 ? 'Create' : 'Update'} PIN code success.`)
      })
      .catch(() => { self.showMsg() })
  }

})).create({
  title: '',
  description: '',
  type: 0
})

export default PinCodeStore

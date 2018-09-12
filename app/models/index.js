import firebase from 'firebase'
import axios from 'axios'
import * as Keychain from 'react-native-keychain'
import { types } from 'mobx-state-tree'
import Toast from 'react-native-root-toast'

import constant from '../utils/constant'
import { encrypt } from '../utils'

const Account = types.model({
  name: types.string,
  url: types.string,
  username: types.string,
  password: types.string,
  desc: types.string
})

let isShowToast = false

const AccountStore = types.model({
  items: types.array(Account),
  isLoading: false,
  isShowVerify: false
}).actions(self => ({
  showLoading(val) {
    console.log('showloading: '.val)
    self.isLoading = val
  },

  showVerify() {
    self.isShowVerify = true
  },

  showMsg(msg) {
    if (isShowToast) {
      // console.log('return..........')
      return
    }
    // console.log('show msg')
    isShowToast = true
    Toast.show(msg, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      onHide: () => {
        // calls on toast\`s hide animation start.
        isShowToast = false
      }
    })
  },

  showError(msg) {
    self.showLoading(false)
    self.showMsg(msg !== null ? msg : 'Something went wrong.')
  },

  verify() {
    // console.log('verify email');
    firebase.auth().currentUser.sendEmailVerification().then(() => {
      self.showVerify()
    })
  },

  login(email, password) {
    // console.log('login----------')
    self.showLoading(true)
    firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
      save({ email, password })
      self.showLoading(false)
    }).catch(() => {
      self.showError('Authentication failed.')
    })
  },

  async signUp (name, email, password) {
    self.showLoading(true)
    try {
      const { data } = await axios.post(`${constant.ROOT_URL}/signup`, { name, email, password })
      if (data && data.code === '1') {
        const { token } = data.data
        if (token) {
          // console.log('token: ', token);
          firebase.auth().signInWithCustomToken(token).then(() => {
            self.verify()
            save({ email, password })
          }).catch(() => {
            self.showError()
          })
        }
      } else {
        self.showError()
      }
    } catch (err) {
      // console.log(err)
      self.showError()
    }
  }
})).create({
  items: []
})

export default AccountStore

const save = async ({ email, password }) => {
  try {
    // TODO: if pin code != null ? pinCode : uid;
    const { uid } = firebase.auth().currentUser
    const pw = encrypt(password, uid)
    await Keychain.setGenericPassword(email, pw)
  } catch (err) {
    console.log(err)
  }
}

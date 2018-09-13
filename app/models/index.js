import firebase from 'firebase'
import axios from 'axios'
import * as Keychain from 'react-native-keychain'
import { types } from 'mobx-state-tree'
import { GoogleSignin, statusCodes } from 'react-native-google-signin'

import constant from '../utils/constant'
import AppNav from '../AppNav'
import { encrypt, getPassword, decrypt } from '../utils'

const Account = types.model({
  name: types.string,
  url: types.string,
  username: types.string,
  password: types.string,
  desc: types.string
})

const AccountStore = types.model({
  items: types.array(Account),
  accessToken: '',
  isLoading: false
}).actions(self => ({
  setItems(data) {

  },

  add(item) {
    self.items.push(item)
  },

  setToken(token) {
    self.accessToken = token
  },

  showLoading(val) {
    // console.log('showloading: ', val)
    self.isLoading = val
  },

  showMsg(msg) {
    self.showLoading(false)
    const m = msg === undefined || msg === null ? 'Something went wrong.' : msg
    AppNav.showToast(m)
  },

  showVerify(msg = '') {
    if (msg !== '') { self.showMsg(msg) }
  },

  sendVerify(callback) {
    firebase.auth().currentUser.sendEmailVerification().then(() => {
      self.showVerify()
      callback()
    }).catch(() => {
      self.showMsg()
    })
  },

  login(email, password) {
    self.showLoading(true)
    firebase.auth().signInWithEmailAndPassword(email, password).then((data) => {
      self.showLoading(false)
      console.log('user: ', data.user)
      const emailVerified = data.user ? data.user.emailVerified : null
      console.log('emailVerified: ', emailVerified)
      if (emailVerified) {
        save({ email, password })
      } else {
        self.showVerify('Your account is not activated.')
      }
    }).catch(() => {
      self.showMsg('Authentication failed.')
    })
  },

  async signUp(name, email, password, callback) {
    self.showLoading(true)
    try {
      const { data } = await axios.post(`${constant.ROOT_URL}/signup`, { name, email, password })
      if (data && data.code === '1') {
        const { token } = data.data
        if (token) {
          // console.log('token: ', token);
          firebase.auth().signInWithCustomToken(token).then(() => {
            self.sendVerify(callback)
            save({ email, password })
          }).catch(() => {
            self.showMsg()
          })
        }
      } else {
        self.showMsg()
      }
    } catch (err) {
      // console.log(err)
      self.showMsg()
    }
  },

  forgotPassword(email, callback) {
    self.showLoading(true)
    firebase.auth().sendPasswordResetEmail(email).then(() => {
      self.showLoading(false)
      callback()
    }).catch(() => {
      // console.log(err)
      self.showMsg()
    })
  },

  // -----------------------------------------------
  async fetchData() {
    // self.showLoading(true)
    const { currentUser } = firebase.auth()
    const pw = await getPassword()
    if (pw === '') {
      self.showMsg()
      return
    }

    firebase.database().ref(`/data/${currentUser.uid}/b`).on('value', (snapshot) => {
      console.log('fetchData: ', snapshot.val())
      // self.showLoading(false)
      // try {
      //   const data = snapshot.val();
      //   if (data) {
      //     const json = decrypt(data, pw)
      //     const result = JSON.parse(json)
      //     // result.forEach(x => {
      //     //   self.add(x)
      //     // });
      //   }
      //   // dispatch({ type: constant.FETCH_DATA_SUCCESS, payload: result })
      // } catch (error) {
      //   console.log('fetchData: ', error)
      //   self.showMsg()
      // }
    }).catch(() => {
      // console.log(err)
      self.showMsg()
    })
  },

  async googleSignin() {
    // TODO: check accessToken !== null
    try {
      // console.log('googleSignin')
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      // self.showLoading(true)
      const userInfo = await GoogleSignin.signIn()
      // self.showLoading(false)
      // console.log(`token: ${userInfo.accessToken}`)
      self.setToken(userInfo.accessToken)
      AppNav.showImport()
    } catch (error) {
      self.showMsg()
      // console.log('googleSignin: ', error)
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
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

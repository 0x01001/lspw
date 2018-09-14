import firebase from 'firebase'
import axios from 'axios'
import * as Keychain from 'react-native-keychain'
import { types } from 'mobx-state-tree'
import { GoogleSignin } from 'react-native-google-signin'
import _ from 'lodash'

import constant from '../utils/constant'
import AppNav from '../AppNav'
import AppState from '../AppState'
import { encrypt, decrypt, getPassword, extractDomain, getGoogleSheetData } from '../utils'

const Account = types.model({
  name: types.string,
  url: types.string,
  username: types.string,
  password: types.string,
  desc: types.string
}).actions(self => ({
  changeName(newName) {
    self.name = newName
  }
}))

const AccountStore = types.model({
  items: types.array(Account),
  accessToken: '',
  isLoading: false,
  isFetching: false
}).views(self => ({
  get allItems() {
    return self.items
  },
  get token() {
    return self.accessToken
  }
})).actions(self => ({
  setItem(json) {
    const list = []
    const result = JSON.parse(json)
    result.forEach((x) => {
      list.push(x)
    })
    self.items = list
  },

  setToken(token) {
    self.accessToken = token
  },

  setFetch(val) {
    self.isFetching = val
  },

  showLoading(val) {
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
    if (AppState.internetConnect !== 'online') { return }
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
    self.setFetch(true)
    const { currentUser } = firebase.auth()
    const pw = await getPassword()
    if (pw === '') {
      self.showMsg()
      return
    }
    firebase.database().ref(`/data/${currentUser.uid}/b`).on('value', (snapshot) => {
      self.setFetch(false)
      try {
        const data = snapshot.val()
        // console.log('fetchData: ', data)
        if (data) {
          const json = decrypt(data, pw)
          self.setItem(json)
        }
      } catch (err) {
        console.log('fetchData: ', err)
        self.showMsg()
      }
    })
  },

  async importData(url, token, listData) {
    try {
      const content = url.split('d/')
      const id = content.length > 1 ? content[1].split('/') : null
      if (id === null) {
        self.showMsg('Links are corrupted or not available on the Google Sheets.')
        return
      }
      AppNav.showLoading()
      // get data from gg sheets
      const result = await getDataImport(id[0], token)
      console.log('data import: ', result)
      if (result === null || (result !== null && result.length === 0)) {
        AppNav.hideLoading()
        self.showMsg('No data received to import.')
      }
      // // extra domain
      // const currentData = listData.map((x) => {
      //   x.changeName(extractDomain(x.url))
      //   return x
      // })
      console.log('current data: ', listData)
      // merge data
      self.mergeData(listData, result)
    } catch (err) {
      console.log('fetchData: ', err)
      AppNav.hideLoading()
      self.showMsg()
    }
  },

  async mergeData(currentData, dataImport) {
    // let arrDuplicate = []
    const join = _.union(dataImport, currentData)
    console.log('join: ', join)
    const listJoin = _.uniqWith(join, (x, y) => {
      // console.log('x: ', x)
      // console.log('y: ', y)
      // console.log('-----------------------------')
      if (x.username === y.username && x.name === y.name) {
        // console.log('uid: ',y.uid, x.uid);
        // y.uid = x.uid
        // if (x.password === y.password && x.desc === y.desc) {
        //   // console.log('duplicate: ',y);
        //   arrDuplicate = [...arrDuplicate, y]
        // }
        return true
      }
      return false
    })
    // // remove duplicate
    // arrDuplicate.forEach((x) => {
    //   _.pull(listJoin, x)
    // })
    console.log('importData json ', listJoin)
    if (listJoin.length > 0) {
      const { currentUser } = firebase.auth()
      const pw = await getPassword()
      // console.log('pw: ', pw)
      if (pw === '') {
        AppNav.hideLoading()
        self.showMsg()
      }
      self.submitData(listJoin, pw, currentUser.uid)
      // for (let i = 0; i < listJoin.length; i++) {
      //   const element = listJoin[i]
      //   await submitData(element, pw, currentUser.uid, element.uid)
      //   // listJoin[i].uid = newKey
      // }
    } else {
      AppNav.hideLoading()
      AppNav.hideImport()
      self.showMsg('Import success.')
    }
  },

  submitData(data, pw, uid, key) {
    // const temp = data
    // delete temp.uid
    // const json = JSON.stringify(temp)
    const json = JSON.stringify(data)
    console.log('submitData: ', json)
    // A post entry.
    const postData = encrypt(json, pw)
    // Get a key for a new Post.
    // const newKey = key !== '' ? key : firebase.database().ref(`/data/${uid}/b`).push().key
    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates = {}
    // updates[`/data/${uid}/b/${newKey}`] = postData
    updates[`/data/${uid}/b`] = postData
    firebase.database().ref().update(updates).then(() => {
      AppNav.hideLoading()
      AppNav.hideImport()
      self.showMsg('Import success.')
    })
      .catch((err) => {
        console.log(err)
        self.showMsg()
      })
  },

  // ------------------------------------

  async googleSignin() {
    // TODO: check accessToken !== null
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      const userInfo = await GoogleSignin.signIn()
      // console.log(`token: ${userInfo.accessToken}`)
      self.setToken(userInfo.accessToken)
      AppNav.showImport()
    } catch (error) {
      self.showMsg()
    }
  },

  async signOut() {
    try {
      const isSignedIn = await GoogleSignin.isSignedIn()
      // console.log('isSignedIn: ', isSignedIn)
      if (isSignedIn) {
        await GoogleSignin.revokeAccess()
        await GoogleSignin.signOut()
      }
      await Keychain.resetGenericPassword()
      firebase.auth().signOut()
    } catch (error) {
      console.log(error)
      self.showMsg()
    }
  }

})).create({
  items: []
})

export default AccountStore

const getDataImport = async (id, token) => {
  try {
    const { data } = await axios.get(`${constant.GOOGLE_SHEET_URL}/${id}?access_token=${token}&includeGridData=true`)
    const item = data.sheets[0].data[0].rowData
    // console.log(item.length);
    // console.log(`result: ${JSON.stringify(item)}`)
    // let nameIndex = 0
    let urlIndex = 1
    let usernameIndex = 2
    let passwordIndex = 3
    let extraIndex = 4
    let result = []
    for (let i = 0; i < item.length; i++) {
      const list = item[i].values
      // find index
      if (i === 0) {
      // console.log('item: ' + JSON.stringify(item[i].values));
        for (let j = 0; j < list.length; j++) {
          const val = list[j].formattedValue
          if (val) {
            // if (val === 'name') {
            //   nameIndex = j
            // } else
            if (val === 'url') {
              urlIndex = j
            } else if (val === 'username') {
              usernameIndex = j
            } else if (val === 'password') {
              passwordIndex = j
            } else if (val === 'extra') {
              extraIndex = j
            }
          }
        }
      // console.log(`${name_index} - ${url_index} - ${username_index} - ${password_index} - ${extra_index}`)
      } else {
        const model = {
          // uid: '',
          // name: getData(list, nameIndex),
          url: getGoogleSheetData(list, urlIndex),
          username: getGoogleSheetData(list, usernameIndex),
          password: getGoogleSheetData(list, passwordIndex),
          desc: getGoogleSheetData(list, extraIndex)
        }
        if (model.password !== '' || model.url !== '' || model.username !== '' || model.desc !== '') {
          model.name = extractDomain(model.url) // save root domain
          result = [...result, model]
          // result.push(model)
        }
      }
    }
    return result
  } catch (error) {
    console.log('getDataImport: ', error)
    return []
  }
}

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
import firebase from 'firebase'
import axios from 'axios'
import * as Keychain from 'react-native-keychain'
import { types, getRoot, destroy } from 'mobx-state-tree'
import { GoogleSignin, statusCodes } from 'react-native-google-signin'
import _ from 'lodash'
import prompt from 'react-native-prompt-android'

import constant from '../utils/constant'
import AppNav from '../AppNav'
import AppState from '../AppState'
import { encrypt, decrypt, getPassword, savePassword, extractDomain, getGoogleSheetData, capitalizeFirstLetter } from '../utils'

const uuidv4 = require('uuid/v4')

export const Account = types.model({
  id: types.string,
  name: '',
  url: '',
  username: '',
  password: '',
  desc: '',
  date: 0,
  state: false // local: 1: normal -1: delete
}).actions(self => ({
  // changeName(newName) {
  //   self.name = newName
  // },
  // createId() {
  //   self.id = uuidv4()
  // },

  updateDate(val) {
    self.date = val
  },

  updateState(val) {
    console.log('updateState: ', val)

    self.state = val
  },

  remove() {
    getRoot(self).remove(self)
  }

  // update() {
  //   getRoot(self).update(self)
  // }
}))

const AccountStore = types.model({
  items: types.array(Account),
  accessToken: '',
  isSelecting: false
  // isLoading: false,
  // isDeleting: false,
  // isFetching: false
}).views(self => ({
  get data() {
    return self.items.slice().sort((x, y) => y.date - x.date)
  },
  get token() {
    return self.accessToken
  }
})).actions(self => ({

  setItem(json) {
    const result = JSON.parse(json)
    // // console.log('result: ', result)
    // if (self.items.slice().length > 0) {
    //   // delete
    //   const listDelete = _.differenceWith(self.items.slice(), result, (x, y) => x.id === y.id)
    //   self.items.map((x) => {
    //     if (listDelete.includes(x)) {
    //       console.log('delete: ', listDelete)
    //       self.remove(x)
    //     }
    //     return null
    //   })

    //   // add
    //   const listAdd = _.differenceWith(result, self.items.slice(), (x, y) => x.id === y.id)
    //   listAdd.map((x) => {
    //     console.log('add: ', x)
    //     self.add(x)
    //     return x
    //   })

    //   console.log('listDelete.length: ', listDelete.length)
    //   console.log('listAdd.length: ', listAdd.length)
    //   self.sort()
    // } else {
    result.map((x) => {
      x.state = false
      self.add(x)
      return x
    })
    // const copiedList = self.items.slice()
    // console.log('self.items: ', copiedList)
    // }
  },

  add(item) {
    self.items = [...self.items, item]
    // self.items.push(item)
  },

  addFirst(item) {
    self.items.unshift(item)
    // unshift/push - add an element to the beginning/end of an array
    // shift/pop - remove and return the first/last element of and array
  },

  remove(item) {
    // self.items.splice(self.items.indexOf(item), 1)
    const index = self.items.findIndex(x => x.id == item.id)
    destroy(self.items[index])
  },

  update(item) {
    const index = self.items.findIndex(x => x.id == item.id)
    self.items[index] = item
  },

  // sort() {
  //   // filter list descending order
  //   self.items = self.items.slice().sort((x, y) => y.date - x.date)
  // },

  setToken(val) {
    self.accessToken = val
  },

  setSelect(val) {
    self.isSelecting = val
  },

  setSelectAll(val) {
    self.items.map(x => x.state = val)
    // const copiedList = self.items.slice()
    // console.log('self.items: ', copiedList)
  },

  dataDelete() {
    return self.items.filter(x => x.state === true)
  },

  showMsg(msg) {
    AppNav.hideLoading()
    const m = msg === undefined || msg === null || msg === '' ? 'Something went wrong.' : msg
    AppNav.showToast(m)
  },

  sendVerify(callback) {
    AppNav.showLoading()
    firebase.auth().currentUser.sendEmailVerification().then(() => {
      // console.log('sendVerify done')
      AppNav.hideLoading()
      callback()
    }).catch(() => {
      self.showMsg()
    })
  },

  login(email, password) {
    AppNav.showLoading()

    firebase.auth().signInWithEmailAndPassword(email, password).then((data) => {
      // console.log('user: ', data.user)
      const emailVerified = data.user ? data.user.emailVerified : null
      // console.log('login emailVerified: ', emailVerified)
      if (emailVerified) {
        savePassword(password)
      } else {
        self.showMsg('Your account is not activated.')
      }
    }).catch(() => {
      self.showMsg('Authentication failed.')
    })
  },

  async signUp(name, email, password, callback) {
    if (AppState.internetConnect !== 'online') { return }
    AppNav.showLoading()
    try {
      const { data } = await axios.post(`${constant.ROOT_URL}/signup`, { name, email, password })
      // console.log('data: ', data)
      if (data && data.code === '1') {
        const { token } = data.data
        if (token) {
          // console.log('token: ', token)
          firebase.auth().signInWithCustomToken(token).then(() => {
            self.sendVerify(callback)
            savePassword(password)
          }).catch(() => {
            self.showMsg()
          })
        } else {
          self.showMsg()
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
    AppNav.showLoading()
    firebase.auth().sendPasswordResetEmail(email).then(() => {
      AppNav.hideLoading()
      callback()
    }).catch(() => {
      // console.log(err)
      self.showMsg()
    })
  },

  // -----------------------------------------------
  async load(callback) {
    const { currentUser } = firebase.auth()
    const pw = await getPassword()
    if (pw === '') {
      self.showMsg()
      return
    }
    firebase.database().ref(`/data/${currentUser.uid}/b`).once('value', (snapshot) => {
      AppNav.hideLoading()
      try {
        const data = snapshot.val()
        // console.log('load: ', data)
        if (data) {
          const json = decrypt(data, pw)
          // console.log('load decrypt: ', json)
          self.setItem(json)
        } else {
          self.reset()
        }
        if (callback) {
          callback()
        }
      } catch (err) {
        console.log('load: ', err)
        self.showMsg()
      }
    })
  },

  importLink(url) {
    if (!url) {
      self.showMsg('Link is required.')
      return
    }

    console.log(`OK Pressed: ${url}`)
    // console.log('import: ', token, data)
    self.importData(url, self.token, self.data)
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
      // console.log('data import: ', result)
      if (result === null || (result !== null && result.length === 0)) {
        AppNav.hideLoading()
        self.showMsg('No data received to import.')
        return
      }
      // console.log('current data: ', listData)
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
    // console.log('join: ', join)
    const listJoin = _.uniqWith(join, (x, y) => {
      // console.log('x: ', x)
      // console.log('y: ', y)
      // console.log('-----------------------------')
      if (x.username === y.username && x.name === y.name) {
        // console.log('uid 1: ', `${y.id} - ${x.id}`)
        y.id = x.id
        // console.log('uid 2: ', `${y.id} - ${x.id}`)
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
    // console.log('importData json ', listJoin)
    if (listJoin.length > 0) {
      const { currentUser } = firebase.auth()
      const pw = await getPassword()
      // console.log('pw: ', pw)
      if (pw === '') {
        AppNav.hideLoading()
        self.showMsg()
        return
      }
      // listJoin.forEach((x) => {
      //   if (x.id === '') {
      //     x.id = uuidv4()
      //     console.log('x id: ', x.id)
      //   }
      // })
      const list = listJoin.map((x) => {
        if (x.id === '') {
          x.id = uuidv4()
          // console.log('x id: ', x.id)
        }
        return x
      })
      self.submitData(list, pw, currentUser.uid)
      // for (let i = 0; i < listJoin.length; i++) {
      //   const element = listJoin[i]
      //   await submitData(element, pw, currentUser.uid, element.uid)
      //   // listJoin[i].uid = newKey
      // }
    } else {
      AppNav.hideLoading()
      // AppNav.hideImport()
      self.showMsg('Import success.')
    }
  },

  submitData(data, pw, uid, key) {
    // const temp = data
    // delete temp.uid
    // const json = JSON.stringify(temp)
    const json = JSON.stringify(data)
    // console.log('submitData: ', json)
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
      // AppNav.hideImport()
      self.showMsg('Import success.')
    })
      .catch((err) => {
        console.log(err)
        self.showMsg()
      })
  },
  // ------------------------------------
  searchData(val) {
    return self.data.filter(x => _.includes(x.name, val) || _.includes(x.username, val)).sort((x, y) => y.date - x.date)
  },

  async saveData(item:Account, action, isShowNotify = true, callback = null) {
    // TODO: check duplicate -> show alert

    if (isShowNotify) { AppNav.showLoading() }

    if (action === 'create' || action === 'update') {
      const date = new Date()
      const timestamp = date.getTime()
      item.updateDate(timestamp)
    }

    console.log(`${action}: ${item.id}`)
    const json = JSON.stringify(item, ['id', 'name', 'url', 'username', 'password', 'desc'])
    // console.log('data: ', json)

    if (json !== '') {
      const pw = await getPassword()
      // console.log('pw: ', pw)
      if (pw === '') {
        if (isShowNotify) {
          AppNav.hideLoading()
          self.showMsg()
        }
        return
      }
      const data = encrypt(json, pw)
      // console.log('post data: ', data)
      firebase.auth().currentUser.getIdToken().then((token) => {
        // console.log('token: ', token)
        axios.post(`${constant.ROOT_URL}/save`, { token, data, action }).then((res) => {
          // console.log(res)
          if (res.data.code === '1') {
            if (action === 'update') {
              self.update(item)
            } else if (action === 'delete') {
              self.remove(item)
              // const copiedList = self.items.slice()
              // console.log('self.items: ', copiedList)
            } else {
              self.addFirst(item)
            }
            if (isShowNotify) {
              self.showMsg(`${capitalizeFirstLetter(action)} success!`)
              AppNav.goBack()
              if (callback) {
                callback()
              }
            }
          } else if (isShowNotify) { self.showMsg(res.data.msg) }
          if (isShowNotify) AppNav.hideLoading()
        })
      })
    }
  },

  // ------------------------------------
  async googleSignin() {
    // TODO: check accessToken !== null
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      const userInfo = await GoogleSignin.signIn()
      console.log(`token: ${userInfo.accessToken}`)
      self.setToken(userInfo.accessToken)
      prompt(
        'Import Data',
        'Enter your link from google sheets\n\n(*) Automatic remove duplicates',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'OK', onPress: url => self.importLink(url) }
        ],
        {
          // type: 'secure-text',
          cancelable: false,
          defaultValue: '',
          placeholder: 'Link'
        }
      )
    } catch (error) {
      console.log('error.code: ', error.code)

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
        self.showMsg()
      }
    }
  },

  async signOut() {
    try {
      AppNav.showLoading()
      const isSignedIn = await GoogleSignin.isSignedIn()
      // console.log('isSignedIn: ', isSignedIn)
      if (isSignedIn) {
        await GoogleSignin.revokeAccess()
        await GoogleSignin.signOut()
      }
      await Keychain.resetGenericPassword()
      firebase.auth().signOut()
      AppNav.hideLoading()
    } catch (error) {
      console.log(error)
      self.showMsg()
    }
  },

  reset() {
    self.items = []
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
          id: '',
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

import axios from 'axios'
import * as Keychain from 'react-native-keychain'
import { GoogleSignin, statusCodes } from 'react-native-google-signin'
import firebase from 'firebase'
import _ from 'lodash'

import constant from '../utils/constant'
import NavManager from '../NavManager'
import { decrypt, encrypt } from '../utils'

const getData = (list, i) => {
  if (i < list.length && list[i].formattedValue) {
    return list[i].formattedValue
  }
  return ''
}

const getPassword = async () => {
  try {
    const credentials = await Keychain.getGenericPassword()
    if (credentials) {
      // console.log('password decrypt: ', credentials.password)
      const { currentUser } = firebase.auth()
      const pw = decrypt(credentials.password, currentUser.uid) // pincode
      return pw
    }
    console.log('No credentials stored.')
  } catch (err) {
    console.log(err)
  }
  return ''
}

const submitData = async (data, pw, uid, key) => {
  const temp = data
  delete temp.uid
  const json = JSON.stringify(temp)
  // console.log('submitData json: ', json)
  // A post entry.
  const postData = encrypt(json, pw)
  // Get a key for a new Post.
  const newKey = key !== '' ? key : firebase.database().ref(`/data/${uid}/b`).push().key
  // Write the new post's data simultaneously in the posts list and the user's post list.
  const updates = {}
  updates[`/data/${uid}/b/${newKey}`] = postData
  firebase.database().ref().update(updates).then(() => newKey)
}

export const fetchData = () => async (dispatch) => {
  const { currentUser } = firebase.auth()
  const pw = await getPassword()
  // console.log('pw: ', pw)
  firebase.database().ref(`/data/${currentUser.uid}/b`).on('value', (snapshot) => {
    // console.log('snapshot: ', snapshot.val())
    if (pw === '') {
      NavManager.hideLoading()
      dispatch({ type: constant.FETCH_DATA_FAIL })
    }

    const result = _.map(snapshot.val(), (val, uid) => {
      const json = decrypt(val, pw)
      // console.log('val: ', val, uid, json)
      if (json) {
        const data = JSON.parse(json)
        data.uid = uid
        // console.log('data: ', data)
        return data
      }
      return null
    })
    NavManager.hideLoading()
    dispatch({ type: constant.FETCH_DATA_SUCCESS, payload: result })
  })
}

export const googleSignin = () => async (dispatch) => {
  // TODO: check accessToken !== null
  dispatch({ type: constant.MAIN_LOADING })
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
    const userInfo = await GoogleSignin.signIn()
    // console.log(`token: ${userInfo.accessToken}`)
    dispatch({ type: constant.GOOGLE_SIGNIN_SUCCESS, payload: userInfo.accessToken })
  } catch (error) {
    dispatch({ type: constant.GOOGLE_SIGNIN_FAIL })
    // this.setState({ error: error.code });
    console.log('error: ', error)
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

// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/get
export const importData = ({ url, token, listData }) => async (dispatch) => {
  const content = url.split('d/')
  const id = content.length > 1 ? content[1].split('/') : null
  if (id === null) {
    dispatch({ type: constant.IMPORT_DATA_FAIL })
  }
  // console.log('importData id: ', id[0])
  NavManager.showLoading()
  // console.log('call api');
  try {
    const { data } = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${id[0]}?access_token=${token}&includeGridData=true`)
    const item = data.sheets[0].data[0].rowData
    // console.log(item.length);
    // console.log(`result: ${JSON.stringify(item)}`);
    let nameIndex = 0
    let urlIndex = 1
    let usernameIndex = 2
    let passwordIndex = 3
    let extraIndex = 4
    const result = []

    for (let i = 0; i < item.length; i++) {
      const list = item[i].values

      // find index
      if (i === 0) {
        // console.log('item: ' + JSON.stringify(item[i].values));
        for (let j = 0; j < list.length; j++) {
          const val = list[j].formattedValue
          if (val) {
            if (val === 'name') {
              nameIndex = j
            } else if (val === 'url') {
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
        // console.log(
        //   `${name_index} - ${url_index} - ${username_index} - ${password_index} - ${extra_index}`
        // );
      } else {
        // result = [
        //   ...result,
        //   {
        //     name: getData(list, name_index),
        //     url: getData(list, url_index),
        //     username: getData(list, username_index),
        //     password: getData(list, password_index),
        //     desc: getData(list, extra_index)
        //   }
        // ];
        const model = {
          uid: '',
          name: getData(list, nameIndex),
          url: getData(list, urlIndex),
          username: getData(list, usernameIndex),
          password: getData(list, passwordIndex),
          desc: getData(list, extraIndex),
        }
        if (model.password !== '' || model.name !== '' || model.url !== '' || model.username !== '' || model.desc !== '') {
          result.push(model)
        }
      }
    }
    // merge data
    // console.log('currentData: ', listData)
    const join = _.union(result, listData)
    // console.log('join: ', join)
    const listJoin = _.uniqWith(join, (x, y) => {
      if (x.username === y.username && x.url === y.url) {
        y.uid = x.uid
        // console.log('uid: ', y.uid, x.uid)
        return true
      }
      return false
    })
    // console.log('------> ', listJoin)

    // const arrPush = []
    // const arrUpdate = _.remove(listJoin, (x) => {
    //   if (x.uid !== '') {
    //     return true
    //   }
    //   arrPush.push(x)
    //   return false
    // })
    // console.log('------> ', arrPush, arrUpdate)

    const { currentUser } = firebase.auth()
    const pw = await getPassword()
    // console.log('pw: ', pw)
    if (pw === '') {
      NavManager.hideLoading()
      dispatch({ type: constant.IMPORT_DATA_FAIL })
    }

    for (let i = 0; i < listJoin.length; i++) {
      const element = listJoin[i]
      await submitData(element, pw, currentUser.uid, element.uid)
      // listJoin[i].uid = newKey
    }

    NavManager.hideLoading()
    dispatch({ type: constant.IMPORT_DATA_SUCCESS }) // , payload: listJoin })
  } catch (error) {
    console.log(error)
    NavManager.hideLoading()
    dispatch({ type: constant.IMPORT_DATA_FAIL })
  }
}

// signOut = async () => {
//   try {
//     await GoogleSignin.revokeAccess();
//     await GoogleSignin.signOut();
//     this.setState({ user: null }); // Remember to remove the user from your app's state as well
//   } catch (error) {
//     console.error(error);
//   }
// };

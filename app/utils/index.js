import * as Keychain from 'react-native-keychain'
import firebase from 'firebase'
import { Clipboard, Alert } from 'react-native'

import AccountStore, { Account } from '../models/AccountStore'
// import PinCodeStore from '../models/PinCodeStore'
import constant from './constant'

const CryptoJS = require('crypto-js')

const keySize = 256
const ivSize = 128
const iterations = 100

export const encrypt = (msg, pass) => {
  // console.log('encrypt: ', msg, pass)
  const salt = CryptoJS.lib.WordArray.random(128 / 8)

  const key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations
  })
  const iv = CryptoJS.lib.WordArray.random(128 / 8)

  const encrypted = CryptoJS.AES.encrypt(msg, key, {
    iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  })

  // salt, iv will be hex 32 in length
  // append them to the ciphertext for use  in decryption
  const transitmessage = salt.toString() + iv.toString() + encrypted.toString()
  return transitmessage
}

export const decrypt = (transitmessage, pass) => {
  const salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32))
  const iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
  const encrypted = transitmessage.substring(64)

  const key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations
  })

  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

const extractHostname = (url) => {
  let hostname
  // find & remove protocol (http, ftp, etc.) and get hostname
  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2]
  } else {
    hostname = url.split('/')[0]
  }
  // find & remove port number
  hostname = hostname.split(':')[0]
  // find & remove "?"
  hostname = hostname.split('?')[0]
  return hostname
}

// To address those who want the "root domain," use this function:
export const extractDomain = (url) => {
  let domain = extractHostname(url)
  const splitArr = domain.split('.')
  const arrLen = splitArr.length
  // extracting the root domain here
  // if there is a subdomain
  if (arrLen > 2) {
    domain = `${splitArr[arrLen - 2]}.${splitArr[arrLen - 1]}`
    // check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
    if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
      // this is using a ccTLD
      domain = `${splitArr[arrLen - 3]}.${domain}`
    }
  }
  return domain
}

export const getGoogleSheetData = (list, i) => {
  if (i < list.length && list[i].formattedValue) {
    return list[i].formattedValue
  }
  return ''
}

export const savePassword = async (password) => {
  try {
    // TODO: if pin code != null ? pinCode : uid;
    const { uid } = firebase.auth().currentUser
    const pw = encrypt(password, uid)
    await Keychain.setGenericPassword(constant.DATA_ENCRYPTED, pw)
  } catch (err) {
    console.log(err)
  }
}

export const getPassword = async () => {
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

// export const updatePassword = async (pincode) => {
//   try {
//     const pw = await getPassword()
//     await savePassword(pw, pincode)
//     console.log('No credentials stored.')
//   } catch (err) {
//     console.log(err)
//   }
//   return ''
// }

export const unixTimeStampToDateTime = (timestamp) => {
  const currentDate = new Date(timestamp)

  const date = `0${currentDate.getDate()}`
  const month = `0${currentDate.getMonth() + 1}` // Be careful! January is 0 not 1
  const year = currentDate.getFullYear()

  // Hours part from the timestamp
  const hours = currentDate.getHours()
  // Minutes part from the timestamp
  const minutes = `0${currentDate.getMinutes()}`
  // Seconds part from the timestamp
  const seconds = `0${currentDate.getSeconds()}`

  const dateString = `${year}-${month.substr(-2)}-${date.substr(-2)} ${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`
  return dateString
}

export const writeToClipboard = async (item) => {
  await Clipboard.setString(item.password)
  AccountStore.showMsg(`Password of '${item.username}' from <${item.name}> copied.`)
  // alert('Copied to Clipboard!')
  const date = new Date()
  const timestamp = date.getTime()
  // console.log('timestamp: ', timestamp)
  item.updateDate(timestamp)
  AccountStore.saveData(item, 'update', false)
}

export const deleteData = (item:Account, okCallback = null, cancelCallback = null) => {
  Alert.alert(
    'Are you sure?',
    'You want to delete this record?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => {
          if (cancelCallback) {
            cancelCallback()
          }
        }
      },
      {
        text: 'OK',
        onPress: () => {
          const act = 'delete'
          AccountStore.saveData(item, act, true, () => {
            if (okCallback) {
              okCallback()
            }
          })
        }
      }
    ],
    { cancelable: false }
  )
}

export const capitalizeFirstLetter = val => val.charAt(0).toUpperCase() + val.slice(1)

export default {
  encrypt,
  decrypt,
  extractDomain,
  getGoogleSheetData,
  unixTimeStampToDateTime,
  writeToClipboard,
  getPassword,
  // updatePassword,
  savePassword,
  capitalizeFirstLetter,
  deleteData
}

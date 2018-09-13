// import firebase from 'firebase'
// import axios from 'axios'
// import * as Keychain from 'react-native-keychain'

// import constant from '../utils/constant'
// import { encrypt } from '../utils'

// const loginSuccess = (dispatch, data) => {
//   // console.log('loginSuccess: ', data);
//   const emailVerified = data ? data.user.emailVerified : null
//   if (emailVerified) {
//     dispatch({
//       type: constant.LOGIN_SUCCESS
//     })
//   } else {
//     // console.log('need verify');
//     dispatch({ type: constant.VERIFY_EMAIL, payload: true })
//   }
// }

// const loginFail = (dispatch) => {
//   // console.log('loginFail');
//   dispatch({ type: constant.LOGIN_FAIL })
// }

// const verify = (dispatch) => {
//   // console.log('verify email');
//   firebase
//     .auth()
//     .currentUser.sendEmailVerification()
//     .then(() => dispatch({ type: constant.VERIFY_EMAIL }))
// }

// const save = async ({ email, password }) => {
//   try {
//     // TODO: if pin code != null ? pinCode : uid;
//     const { uid } = firebase.auth().currentUser
//     const pw = encrypt(password, uid)
//     await Keychain.setGenericPassword(email, pw)
//   } catch (err) {
//     console.log(err)
//   }
// }

// export const login = ({ email, password }) => (dispatch) => {
//   dispatch({ type: constant.AUTH_LOADING })
//   firebase
//     .auth()
//     .signInWithEmailAndPassword(email, password)
//     .then((user) => {
//       save({ email, password })
//       loginSuccess(dispatch, user)
//     })
//     .catch(() => loginFail(dispatch))
// }

// export const sendVerify = () => (dispatch) => {
//   dispatch({ type: constant.AUTH_LOADING })
//   verify(dispatch)
// }

// export const reset = () => (dispatch) => {
//   dispatch({ type: constant.RESET })
// }

// export const signUp = ({ name, email, password }) => async (dispatch) => {
//   dispatch({ type: constant.AUTH_LOADING })

//   try {
//     const { data } = await axios.post('https://us-central1-lspw-49d1f.cloudfunctions.net/signup', {
//       name,
//       email,
//       password
//     })
//     // console.log(data);
//     if (data && data.code === '1') {
//       const { token } = data.data
//       if (token) {
//         // console.log('token: ', token);
//         firebase
//           .auth()
//           .signInWithCustomToken(token)
//           .then(() => {
//             verify(dispatch)
//             save({ email, password })
//           })
//           .catch(() => dispatch({ type: constant.SIGNUP_FAIL }))
//       }
//       // dispatch({
//       //   type: constant.SIGNUP_SUCCESS,
//       //   payload: data
//       // });
//     } else {
//       dispatch({ type: constant.SIGNUP_FAIL })
//     }
//   } catch (err) {
//     console.log(err)
//     // Something went wrong
//     dispatch({ type: constant.SIGNUP_FAIL })
//   }
// }

// export const forgotPassword = ({ email }) => (dispatch) => {
//   dispatch({ type: constant.AUTH_LOADING })

//   firebase
//     .auth()
//     .sendPasswordResetEmail(email)
//     .then(() => dispatch({ type: constant.FORGOT_PASSWORD_SUCCESS }))
//     .catch((err) => {
//       console.log(err)
//       dispatch({ type: constant.FORGOT_PASSWORD_FAIL })
//     })
// }

import firebase from 'firebase';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';

import constant from '../utils/constant';
import utils from '../utils';

export const loginAction = ({ email, password }) => dispatch => {
  dispatch({ type: constant.LOADING });
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(user => {
      const { uid } = user;
      save({ uid, email, password });
      loginSuccess(dispatch, user);
    })
    .catch(() => loginFail(dispatch));
};

const loginSuccess = (dispatch, data) => {
  //console.log('loginSuccess: ', data);
  const emailVerified = data ? data.user.emailVerified : null;
  if (emailVerified) {
    dispatch({
      type: constant.LOGIN_SUCCESS
    });
  } else {
    //console.log('need verify');
    dispatch({ type: constant.VERIFY_EMAIL, payload: true });
  }
};

const loginFail = dispatch => {
  //console.log('loginFail');
  dispatch({ type: constant.LOGIN_FAIL });
};

const verify = dispatch => {
  //console.log('verify email');
  firebase
    .auth()
    .currentUser.sendEmailVerification()
    .then(() => dispatch({ type: constant.VERIFY_EMAIL }));
};

export const sendEmailVerifyAction = () => dispatch => {
  dispatch({ type: constant.LOADING });
  verify(dispatch);
};

export const resetAction = () => dispatch => {
  dispatch({ type: constant.RESET });
};

export const signUpAction = ({ name, email, password }) => async dispatch => {
  dispatch({ type: constant.LOADING });

  try {
    const { data } = await axios.post('https://us-central1-lspw-49d1f.cloudfunctions.net/signup', {
      name,
      email,
      password
    });
    //console.log(data);
    if (data && data.code === '1') {
      const { token } = data.data;
      if (token) {
        //console.log('token: ', token);
        firebase
          .auth()
          .signInWithCustomToken(token)
          .then(user => {
            verify(dispatch);
            const { uid } = user;
            save({ uid, email, password });
          })
          .catch(() => dispatch({ type: constant.SIGNUP_FAIL }));
      }
      // dispatch({
      //   type: constant.SIGNUP_SUCCESS,
      //   payload: data
      // });
    } else {
      dispatch({ type: constant.SIGNUP_FAIL });
    }
  } catch (err) {
    console.log(err);
    // Something went wrong
    dispatch({ type: constant.SIGNUP_FAIL });
  }
};

export const forgotPasswordAction = ({ email }) => dispatch => {
  dispatch({ type: constant.LOADING });

  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(() => dispatch({ type: constant.FORGOT_PASSWORD_SUCCESS }))
    .catch(err => {
      console.log(err);
      dispatch({ type: constant.FORGOT_PASSWORD_FAIL });
    });
};

const save = async ({ uid, email, password }) => {
  try {
    //TODO: if pin code != null ? pinCode : uid;
    const pw = utils.encrypt(password, uid);
    await Keychain.setGenericPassword(email, pw);
  } catch (err) {
    console.log(err);
  }
};

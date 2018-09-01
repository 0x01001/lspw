import firebase from 'firebase';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';

import constant from '../utils/constant';

//#region login
export const loginAction = ({ email, password }) => dispatch => {
  dispatch({ type: constant.LOADING });
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(user => {
      save({ email, password });
      loginSuccess(dispatch, user);
    })
    .catch(() => loginFail(dispatch));
};

const loginSuccess = (dispatch, user) => {
  dispatch({
    type: constant.LOGIN_SUCCESS,
    payload: user
  });
};

const loginFail = dispatch => {
  dispatch({ type: constant.LOGIN_FAIL });
};

export const resetAction = () => dispatch => {
  dispatch({ type: constant.RESET });
};
//#endregion

//#region signup
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
      save({ email, password });
      dispatch({
        type: constant.SIGNUP_SUCCESS,
        payload: data
      });
    } else {
      dispatch({ type: constant.SIGNUP_FAIL });
    }
  } catch (err) {
    console.log(err);
    // Something went wrong
    dispatch({ type: constant.SIGNUP_FAIL });
  }
};

export const customLoginAction = token => dispatch => {
  dispatch({ type: constant.LOADING });
  firebase
    .auth()
    .signInWithCustomToken(token)
    .then(user => loginSuccess(dispatch, user))
    .catch(() => loginFail(dispatch));
};
//#endregion

//#region fogot password
export const forgotPasswordAction = ({ email }) => dispatch => {
  dispatch({ type: constant.LOADING });

  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(() => dispatch({ type: constant.FORGOT_PASSWORD_SUCCESS }))
    .catch(() => dispatch({ type: constant.FORGOT_PASSWORD_FAIL }));
};
//#endregion

const save = async ({ email, password }) => {
  try {
    await Keychain.setGenericPassword(email, password);
  } catch (err) {
    console.log(err);
  }
};

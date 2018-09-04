import firebase from 'firebase';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';

import constant from '../utils/constant';
import utils from '../utils';

export const googleSignin = () => async dispatch => {
  //TODO: check accessToken !== null
  //dispatch({ type: constant.LOADING });
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const userInfo = await GoogleSignin.signIn();
    console.log(`token: ${userInfo.accessToken}`);
    dispatch({ type: constant.GOOGLE_SIGNIN_SUCCESS, payload: userInfo.accessToken });
    //TODO: show popup nhập url
  } catch (error) {
    //this.setState({ error: error.code });
    console.log('error: ', error);
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
};

//https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/get
export const googleFetchData = ({ url, accessToken }) => async dispatch => {
  const content = url.split('d/');
  const id = content.length > 1 ? content[1].split('/') : null;
  if (id === null) {
    dispatch({ type: constant.GOOGLE_FETCH_DATA_FAIL });
  }
  console.log('id: ', id[0]);
  dispatch({ type: constant.LOADING });
  //console.log('call api');
  try {
    const { data } = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${
        id[0]
      }?access_token=${accessToken}&includeGridData=true`
    );
    const item = data.sheets[0].data[0].rowData;
    //console.log(item.length);
    //console.log('result: ' + JSON.stringify(item));
    let name_index = 0;
    let url_index = 1;
    let username_index = 2;
    let password_index = 3;
    let extra_index = 4;
    let result = [];

    for (let i = 0; i < item.length; i++) {
      const list = item[i].values;

      if (i === 0) {
        //console.log('item: ' + JSON.stringify(item[i].values));
        for (let j = 0; j < list.length; j++) {
          const val = list[j].formattedValue;
          if (val) {
            if (val === 'name') {
              name_index = j;
            } else if (val === 'url') {
              url_index = j;
            } else if (val === 'username') {
              username_index = j;
            } else if (val === 'password') {
              password_index = j;
            } else if (val === 'extra') {
              extra_index = j;
            }
          }
        }
        //console.log(name_index + ' - ' + url_index + ' - ' + username_index + ' - ' + password_index + ' - ' + extra_index);
      } else {
        result = [
          ...result,
          {
            name: getData(list, name_index),
            url: getData(list, url_index),
            username: getData(list, username_index),
            password: getData(list, password_index),
            desc: getData(list, extra_index)
          }
        ];
        // result.push({
        //   name: this.getData(list, name_index),
        //   url: this.getData(list, url_index),
        //   username: this.getData(list, username_index),
        //   password: this.getData(list, password_index),
        //   desc: this.getData(list, extra_index)
        // });
      }
    }

    console.log(`result: ${JSON.stringify(result)}`);

    // try {
    //   await AsyncStorage.setItem('data', JSON.stringify(result));
    // } catch (error) {
    //   console.log(error);
    // }
  } catch (error) {
    console.log(error);
  }
};

const getData = (list, i) =>
  (i < list.length && list[i].formattedValue ? list[i].formattedValue : '');

// signOut = async () => {
//   try {
//     await GoogleSignin.revokeAccess();
//     await GoogleSignin.signOut();
//     this.setState({ user: null }); // Remember to remove the user from your app's state as well
//   } catch (error) {
//     console.error(error);
//   }
// };

import { GoogleSignin } from 'react-native-google-signin';

export const initializeApp = firebase => {
  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'], // what API you want to access on behalf of the user, default is email and profile
    iosClientId: '<FROM DEVELOPER CONSOLE>', // only for iOS
    webClientId: '<FROM DEVELOPER CONSOLE>', // client ID of type WEB for your server (needed to verify user ID and offline access)
    offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    hostedDomain: '', // specifies a hosted domain restriction
    forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login
    accountName: '' // [Android] specifies an account name on the device that should be used
  });

  // Initialize Firebase
  const config = {
    apiKey: '<API_KEY>',
    authDomain: '<PROJECT_ID>.firebaseapp.com',
    databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
    projectId: '<PROJECT_ID>',
    storageBucket: '<BUCKET>.appspot.com',
    messagingSenderId: '<SENDER_ID>'
  };
  if (!firebase.apps.length) firebase.initializeApp(config);
};

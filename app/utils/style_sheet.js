import { StyleSheet, Platform } from 'react-native';
import appStyle from './app_style';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: appStyle.backgroundColor,
    paddingHorizontal: 60,
    alignItems: 'center'
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: -40
  },
  field: {
    marginVertical: 5,
    width: '100%'
  },
  input: {
    fontSize: 14,
    fontFamily: appStyle.mainFont,
    color: appStyle.mainColor
  },
  button: {
    marginTop: 15,
    backgroundColor: appStyle.buttonBackgroundColor,
    width: '100%',
    height: 60,
    alignSelf: 'center',
    borderRadius: 1,
    ...Platform.select({
      android: {
        elevation: 0,
        borderRadius: 1
      }
    })
  },
  buttonTitle: {
    backgroundColor: 'transparent',
    fontSize: 18,
    fontFamily: appStyle.mainFont,
    fontWeight: 'normal',
    color: appStyle.mainColor
  },
  error: {
    alignSelf: 'center',
    color: appStyle.redColor,
    fontFamily: appStyle.mainFont,
    marginTop: 10
  },
  title: {
    fontFamily: appStyle.mainFont,
    fontWeight: '700',
    color: appStyle.mainColor,
    textAlign: 'center'
  },
  content: {
    fontFamily: appStyle.mainFont,
    fontWeight: 'normal',
    color: appStyle.mainColor,
    textAlign: 'center'
  },
  signUp: {
    position: 'absolute',
    bottom: 0,
    height: 60,
    justifyContent: 'center'
  },
  rightIcon: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 5
  }
});

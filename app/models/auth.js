// import constant from '../utils/constant'

// const INITAL_STATE = {
//   error: '',
//   loading: false,
//   isForgotDone: false,
//   needVerify: 0
// }

// export default (state = INITAL_STATE, action) => {
//   // console.log(action, state);

//   switch (action.type) {
//     case constant.LOGIN_SUCCESS:
//       return { ...state, ...INITAL_STATE }
//     case constant.LOGIN_FAIL:
//       return { ...state, error: 'Authentication failed.', loading: false }
//     case constant.VERIFY_EMAIL: {
//       let counter = state.needVerify
//       return {
//         ...state,
//         ...INITAL_STATE,
//         needVerify: ++counter,
//         error: action.payload === true ? 'Your account is not activated.' : ''
//       }
//     }
//     case constant.SIGNUP_FAIL:
//       return { ...state, error: 'Something went wrong.', loading: false }
//     case constant.FORGOT_PASSWORD_SUCCESS:
//       return { ...state, ...INITAL_STATE, isForgotDone: true }
//     case constant.FORGOT_PASSWORD_FAIL:
//       return { ...state, error: 'Something went wrong.', loading: false }
//     case constant.AUTH_LOADING:
//       return { ...state, loading: true, error: '' }
//     case constant.RESET:
//       return { ...state, ...INITAL_STATE }
//     default:
//       return state
//   }
// }

// // if ( action.type === LOG_OUT ) {
// //   state = undefined;
// // }

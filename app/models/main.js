// import constant from '../utils/constant'

// const INITAL_STATE = {
//   error: '',
//   loading: false,
//   isShowImport: false
// }

// export default (state = INITAL_STATE, action) => {
//   console.log(action, state)

//   switch (action.type) {
//     case constant.GOOGLE_SIGNIN_SUCCESS:
//       return {
//         ...state, ...INITAL_STATE, isShowImport: true, token: action.payload
//       }
//     case constant.GOOGLE_SIGNIN_FAIL:
//       return { ...state, error: 'Authentication failed.', loading: false }
//     case constant.IMPORT_DATA_SUCCESS:
//       return {
//         ...state, ...INITAL_STATE
//       }
//     case constant.IMPORT_DATA_FAIL:
//       return { ...state, error: 'Something went wrong.' }
//     case constant.FETCH_DATA_SUCCESS:
//       return {
//         ...state, ...INITAL_STATE, listData: action.payload
//       }
//     case constant.FETCH_DATA_FAIL:
//       return { ...state, error: 'Something went wrong.' } // show toast
//     case constant.MAIN_LOADING:
//       return { ...state, loading: true, error: '' }
//     default:
//       return state
//   }
// }

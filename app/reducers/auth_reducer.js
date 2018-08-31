import constant from '../utils/constant';

const INITAL_STATE = { data: {}, error: '', loading: false, done: false };

export default (state = INITAL_STATE, action) => {
  console.log(action);

  switch (action.type) {
    case constant.LOGIN_SUCCESS:
      return { ...state, ...INITAL_STATE };
    case constant.LOGIN_FAIL:
      return { ...state, error: 'Authentication failed.', loading: false };
    case constant.SIGNUP_SUCCESS:
      return { ...state, ...INITAL_STATE, data: action.payload };
    case constant.SIGNUP_FAIL:
      return { ...state, error: 'Something went wrong.', loading: false };
    case constant.FORGOT_PASSWORD_SUCCESS:
      return { ...state, ...INITAL_STATE, done: true };
    case constant.FORGOT_PASSWORD_FAIL:
      return { ...state, error: 'Something went wrong.', loading: false };
    case constant.LOADING:
      return { ...state, loading: true, error: '' };
    case constant.RESET:
      return { ...state, ...INITAL_STATE };
    default:
      return state;
  }
};

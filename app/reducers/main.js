import constant from '../utils/constant';

const INITAL_STATE = {
  error: '',
  loading: false
};

export default (state = INITAL_STATE, action) => {
  console.log(action, state);

  switch (action.type) {
    case constant.GOOGLE_SIGNIN_SUCCESS:
      return { ...state, ...INITAL_STATE, token: action.payload };
    case constant.GOOGLE_SIGNIN_FAIL:
      return { ...state, error: 'Authentication failed.', loading: false };
    case constant.LOADING:
      return { ...state, loading: true, error: '' };
    default:
      return state;
  }
};

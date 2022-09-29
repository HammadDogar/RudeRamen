import {USER_REQUEST} from '../../types';

const INITIAL_STATE = {
  loginLoading: false,
  loginSuccess: false,
  loginFailure: false,
  loginError: null,
  user: null,
};

export const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_REQUEST.USER_LOGOUT_SUCCESS:
      return {
        ...state,
        loginSuccess: false,
        user: null,
      };

    case USER_REQUEST.USER_SIGNIN_REQUEST:
      return {
        ...state,
        loginLoading: true,
        loginSuccess: false,
        loginFailure: false,
        loginError: null,
      };
    case USER_REQUEST.USER_SIGNIN_FAILURE:
      return {
        ...state,
        loginLoading: false,
        loginSuccess: false,
        loginFailure: true,
        loginError: action.payload,
      };
    case USER_REQUEST.USER_SIGNIN_SUCCESS:
      return {
        ...state,
        loginLoading: false,
        loginSuccess: true,
        loginFailure: false,
        loginError: null,
        user: action.payload,
      };

    default:
      return state;
  }
};

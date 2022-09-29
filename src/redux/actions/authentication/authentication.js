import {request, success, failure, USER_REQUEST} from '../../types';
import {userLogin} from 'src/services';

export function login(loginData, setCookiesforUser) {
  return dispatch => {
    dispatch(request(USER_REQUEST.USER_SIGNIN_REQUEST));
    userLogin(loginData).then(
      response => {
        if (response.data.succeeded === true) {
          dispatch(
            success(USER_REQUEST.USER_SIGNIN_SUCCESS, response.data.data),
          );
          setCookiesforUser(response.data.data);
        } else {
          dispatch(
            failure(USER_REQUEST.USER_SIGNIN_FAILURE, response.data.message),
          );
        }
      },
      error => {
        dispatch(
          failure(
            USER_REQUEST.USER_SIGNIN_FAILURE,
            error &&
              error.response &&
              error.response.data &&
              error.response.data.message
              ? error.response.data.message
              : error.message,
          ),
        );
      },
    );
  };
}

export function logout(loginData, setCookiesforUser) {
  return dispatch => {
    dispatch(request(USER_REQUEST.USER_LOGOUT_REQUEST));
    userLogin(loginData).then(
      response => {
        if (response.data.succeeded === true) {
          dispatch(
            success(USER_REQUEST.USER_LOGOUT_SUCCESS, response.data.data),
          );
          setCookiesforUser(response.data.data);
        } else {
          dispatch(
            failure(USER_REQUEST.USER_LOGOUT_FAILURE, response.data.message),
          );
        }
      },
      error => {
        dispatch(
          failure(
            USER_REQUEST.USER_LOGOUT_FAILURE,
            error &&
              error.response &&
              error.response.data &&
              error.response.data.message
              ? error.response.data.message
              : error.message,
          ),
        );
      },
    );
  };
}

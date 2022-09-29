function request(actionType) {
  return {
    type: actionType,
  };
}
function success(actionType, response) {
  return {
    type: actionType,
    payload: response,
  };
}
function failure(actionType, error) {
  return {
    type: actionType,
    payload: error,
  };
}
const USER_REQUEST = {
  USER_SIGNIN_RESET: 'USER_SIGNIN_RESET',
  USER_SIGNIN_REQUEST: 'USER_SIGNIN_REQUEST',
  USER_SIGNIN_SUCCESS: 'USER_SIGNIN_SUCCESS',
  USER_SIGNIN_FAILURE: 'USER_SIGNIN_FAILURE',

  USER_LOGOUT_REQUEST: 'USER_LOGOUT_REQUEST',
  USER_LOGOUT_SUCCESS: 'USER_LOGOUT_SUCCESS',
  USER_LOGOUT_FAILURE: 'USER_LOGOUT_FAILURE',
};

export {request, success, failure, USER_REQUEST};

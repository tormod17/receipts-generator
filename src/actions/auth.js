import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  setIdToken,
  removeIdToken,
  decodeUserProfile
} from "../utils/apiUtils";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const LOGOUT_REQUEST = "LOGOUT_REQUEST";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAILURE = "LOGOUT_FAILURE";

function loginRequest(email) {
  return {
    type: LOGIN_REQUEST,
    email
  };
}

function loginSuccess(payload) {
  const idToken = payload[ID_TOKEN];
  setIdToken(idToken);
  const user = decodeUserProfile(idToken);
  return {
    type: LOGIN_SUCCESS,
    user,
  };
}

function loginFailure(error) {
  removeIdToken();
  return {
    type: LOGIN_FAILURE,
    error
  };
}

export function login(email, password) {
  const config = {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  };

  return callApi(
    "/api/login",
    config,
    loginRequest(email),
    loginSuccess,
    loginFailure
  );
}

function logoutRequest(email) {
  removeIdToken();
  return {
    type: LOGOUT_REQUEST,
    email
  };
}

function logoutSuccess(payload) {
  removeIdToken();
  return {
    type: LOGOUT_SUCCESS,
    message: payload.message
  };
}

function logoutFailure(error) {
  return {
    type: LOGOUT_FAILURE,
    error
  };
}

export function logout(user) {
  console.log('LOGOUT CALLED');
  const idToken = loadIdToken();
  const config = {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`
    },
    body: JSON.stringify({
      user
    })
  };

  return callApi(
    "/api/logout",
    config,
    logoutRequest,
    logoutSuccess,
    logoutFailure
  );
}

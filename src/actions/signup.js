import {
  callApi,
  ID_TOKEN,
  //loadIdToken,
  setIdToken,
  //removeIdToken,
  decodeUserProfile
} from "../utils/apiUtils";

export const SIGNUP_REQUEST = "SIGNUP_REQUEST";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_FAILURE = "SIGNUP_FAILURE";

function signupRequest(user) {
  return {
    type: SIGNUP_REQUEST,
    user
  };
}

function signupSuccess(payload) {
  const idToken = payload[ID_TOKEN];
  setIdToken(idToken);
  const user = decodeUserProfile(idToken);
  return {
    type: SIGNUP_SUCCESS,
    user,
  };
}

function signupFailure(error) {

  return {
    type: SIGNUP_FAILURE,
    error
  };
}

export function signup(username, email, password, confirmPassword ) {
  const config = {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      username,
      password,
      confirmPassword
    })
  };
  return callApi(
    "/api/signup",
    config,
    signupRequest(username),
    signupSuccess,
    signupFailure
  );
}

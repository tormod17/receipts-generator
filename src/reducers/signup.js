import {
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
} from "../actions/signup";

import { loadUserProfile } from "../utils/apiUtils";

const initialState = {
  user: null,
  password: null,
  userRole: null,
  loggingIn: false,
  loggingOut: false,
  loginError: null
};

function initializeState() {
  const userProfile = loadUserProfile();
  return Object.assign({}, initialState, userProfile);
}

export default function signup(state = initializeState(), action = {}) {
  switch (action.type) {
    case SIGNUP_REQUEST:
      return Object.assign({}, state, { loggingIn: true });
    case SIGNUP_SUCCESS:
      return Object.assign({}, state, {
        loggingIn: false,
        user: action.user,
        role: action.role
      });
    case SIGNUP_FAILURE:
      return {
        ...state,
        loggingIn: false,
        user: null,
        role: null,
        loginError: action.error
      }
    default:
      return state;
  }
}

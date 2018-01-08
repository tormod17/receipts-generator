import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE
} from "../actions/auth";

import {
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
} from "../actions/signup";

import { loadUserProfile } from "../utils/apiUtils";

const initialState = {
  user: null,
  userRole: null,
  loggingIn: false,
  loggingOut: false,
  loginError: null,
  message: null,
};

function initializeState() {
  const userProfile = loadUserProfile();
  return Object.assign({}, initialState, userProfile);
}

export default function auth(state = initializeState(), action = {}) {
  switch (action.type) {
    case SIGNUP_REQUEST:
      return {
        ...state,
        loggingIn: true 
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        ...action.user,
        role: action.role
      };
    case SIGNUP_FAILURE:
      return {
        ...state,
        loggingIn: false,
        user: null,
        role: null,
        loginError: action.error
      };
    case LOGIN_REQUEST:
      return {
        ...state,
        loggingIn: true 
      };
    case LOGIN_SUCCESS:
      return { 
        ...state, 
        loggingIn: false,
        ...action.user,
        role: action.role,
        message: null
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        loggingIn: false,
        user: null,
        role: null,
        loginError: action.error
      };
    case LOGOUT_REQUEST:
      return {
        ...state,
        loggingOut: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        message: action.message,
        loggingOut: false,
        user: null,
        userRole: null,
        loginError: null,
        email: null,
        username: null,
        id: null,
        exp: null
      };
    case LOGOUT_FAILURE:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
    default:
      return state;
  }
}

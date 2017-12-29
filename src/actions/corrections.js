import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  setIdToken,
  removeIdToken,
  decodeUserProfile
} from "../utils/apiUtils";

export const ADD_CORRECTION_REQUEST = "ADD_CORRECTION_REQUEST";
export const ADD_CORRECTION_SUCCESS = "ADD_CORRECTION_SUCCESS";
export const ADD_CORRECTION_FAILURE = "ADD_CORRECTION_FAILURE";

export const DEL_CORRECTION_REQUEST = "DEL_CORRECTION_REQUEST";
export const DEL_CORRECTION_SUCCESS = "DEL_CORRECTION_SUCCESS";
export const DEL_CORRECTION_FAILURE = "DEL_CORRECTION_FAILURE";

function addCorrecitonRequest(payload) {
  return {
    type: ADD_CORRECTION_REQUEST,
    payload,
  };
}

function addCorrectionSucces(payload) {
  return {
    type: ADD_CORRECTION_SUCCESS,
    payload,
  };
}

function addCorrectionFailure(error) {
  return {
    type: ADD_CORRECTION_FAILURE,
    error,
  };
}

export function addCorrection(type, reason, amount) {
  const config = {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type,
      reason,
      amount,
      customerNumber,
    })
  };
  return callApi(
    "/api/addcorrection",
    config,
    addCorrecitonRequest(username),
    addCorrectionSucces,
    addCorrectionFailure
  );
}

function delCorrecitonRequest(user) {
  return {
    type: DEL_CORRECTION_REQUEST,
    user
  };
}

function delCorrectionSuccess(payload) {
  return {
    type: DEL_CORRECTION_SUCCESS,
    payload
  };
}

function delCorrectionFailure(error) {
  return {
    type: DEL_CORRECTION_FAILURE,
    error,
  };
}

export function delCorrection(correctionId)) {
  const config = {
    method: "get",
  };
  return callApi(
    "/api/correction/del?correctionId=" + correctionId,
    config,
    delCorrecitonRequest(username),
    delCorrectionSucces,
    delCorrectionFailure
  );
}


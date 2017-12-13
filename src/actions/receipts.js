import {
  callApi,
} from "../utils/apiUtils";

export const RECEIPTS_REQUEST = "RECEIPTS_REQUEST";
export const RECEIPTS_SUCCESS = "RECEIPTS_SUCCESS";
export const RECEIPTS_FAILURE = "RECEIPTS_FAILURE";

export const ADD_RECEIPT_REQUEST = "ADD_RECEIPT_REQUEST";
export const ADD_RECEIPT_SUCCESS = "ADD_RECEIPT_SUCCESS";
export const ADD_RECEIPT_FAILURE = "ADD_RECEIPT_FAILURE";

export const DEL_RECEIPT_REQUEST = "DEL_RECEIPT_REQUEST";
export const DEL_RECEIPT_SUCCESS = "DEL_RECEIPT_SUCCESS";
export const DEL_RECEIPT_FAILURE = "DEL_RECEIPT_FAILURE";

export const SELECTED_RECEIPT = 'SELECTED_RECEIPT';
export const UPLOAD_REQUEST = "UPLOAD_REQUEST";
export const UPLOAD_SUCCESS = "UPLOAD_SUCCESS";
export const UPLOAD_FAILURE = "UPLOAD_FAILURE";

function uploadRequest(user) {
  return {
    type: UPLOAD_REQUEST,
  };
}

function uploadSuccess(payload) {
  return {
    type: UPLOAD_SUCCESS,
    payload,
  };
}

function uploadFailure(error) {
  return {
    type: UPLOAD_FAILURE,
  };
}

export function upload(data, userId) {
  const config = {
    method: "post",
    body: data
  };
  return callApi(
    "/api/upload?userId="+ userId,
    config,
    uploadRequest(data),
    uploadSuccess,
    uploadFailure
  );
}


function receiptsRequest() {
  return {
    type: RECEIPTS_REQUEST,
  };
}

function receiptsSuccess(payload) {
  const object = Object.values(payload).reduce((p,c) => {
    p[c._id] = {...c}
    return  p
  }, {})
  return {
    type: RECEIPTS_SUCCESS,
    payload: object,
  };
}

function receiptsFailure(error) {
  return {
    type: RECEIPTS_FAILURE,
  };
}

export function getReceipts(userId) {
  const config = {
    method: "get",
  };
  return callApi(
    "/api/receipts?userId="+ userId,
    config,
    receiptsRequest,
    receiptsSuccess,
    receiptsFailure
  );
}

export function getSingleReceipt(receiptId) {
  return {
    type: SELECTED_RECEIPT,
    selected: receiptId,
  }
}

function addReceiptsRequest() {
  return {
    type: DEL_RECEIPT_REQUEST,
  };
}

function addReceiptsSuccess(payload) {
  return {
    type: DEL_RECEIPT_SUCCESS,
    payload,
  };
}

function addReceiptsFailure(error) {
  return {
    type: DEL_RECEIPT_FAILURE,
  };
}

export function addReceipt(id, data) {
  const config = {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  };
  return callApi(
    "/api/addreceipt?userId="+id,
    config,
    addReceiptsRequest(data),
    addReceiptsSuccess,
    addReceiptsFailure
  );
}


function delReceiptsRequest() {
  return {
    type: DEL_RECEIPT_REQUEST,
  };
}

function delReceiptsSuccess(payload) {
  console.log(payload, payload);
  return {
    type: DEL_RECEIPT_SUCCESS,
    payload,
  };
}

function delReceiptsFailure(error) {
  return {
    type: DEL_RECEIPT_FAILURE,
  };
}


export function deleteReceipts(data) {
  const config = {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  };
  return callApi(
    "/api/deletereceipts",
    config,
    delReceiptsRequest(data),
    delReceiptsSuccess,
    delReceiptsFailure
  );
}

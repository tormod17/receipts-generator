import {
  callApi,
} from "../utils/apiUtils";

export const RECEIPTS_REQUEST = "RECEIPTS_REQUEST";
export const RECEIPTS_SUCCESS = "RECEIPTS_SUCCESS";
export const RECEIPTS_FAILURE = "RECEIPTS_FAILURE";

export const ADD_RECEIPT_REQUEST = "ADD_RECEIPT_REQUEST";
export const ADD_RECEIPT_SUCCESS = "ADD_RECEIPT_SUCCESS";
export const ADD_RECEIPT_FAILURE = "ADD_RECEIPT_FAILURE";
export const SELECTED_RECEIPT = 'SELECTED_RECEIPT';

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
    receipts: object,
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
    type: ADD_RECEIPT_REQUEST,
  };
}

function addReceiptsSuccess(payload) {
  return {
    type: ADD_RECEIPT_SUCCESS,
    payload,
  };
}

function addReceiptsFailure(error) {
  return {
    type: ADD_RECEIPT_FAILURE,
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

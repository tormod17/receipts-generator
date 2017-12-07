import {
  callApi,
} from "../utils/apiUtils";

export const RECEIPTS_REQUEST = "RECEIPTS_REQUEST";
export const RECEIPTS_SUCCESS = "RECEIPTS_SUCCESS";
export const RECEIPTS_FAILURE = "RECEIPTS_FAILURE";

function receiptsRequest() {
  return {
    type: RECEIPTS_REQUEST,
  };
}

function receiptsSuccess(payload) {
  const dataArr = payload.map(obj => obj.data)
  const receipts = [].concat(...dataArr);
  return {
    type: RECEIPTS_SUCCESS,
    receipts: receipts,
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

import {
  callApi,
} from "../utils/apiUtils";

export const UPLOAD_REQUEST = 'UPLOAD_REQUEST';
export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS';
export const UPLOAD_FAILURE = 'UPLOAD_FAILURE';

function uploadRequest(user) {
  return {
    type: UPLOAD_REQUEST
  };
}

function uploadSuccess(payload) {
  return {
    type: UPLOAD_SUCCESS,
    payload
  };
}

function uploadFailure(error) {
  return {
    type: UPLOAD_FAILURE
  };
}

export function upload(data, userId) {
  const config = {
    method: 'post',
    // headers: {
    //   Accept: 'multipart/form-data',
    //   'Content-Type': 'multipart/form-data'
    // },
    body: data
  };
  return callApi(
    '/api/upload?userId='+ userId,
    config,
    uploadRequest(data),
    uploadSuccess,
    uploadFailure
  );
}

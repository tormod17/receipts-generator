import {
  callApi
} from '../utils/apiUtils';

export const EMAIL_REQUEST = 'EMAIL_REQUEST';
export const EMAIL_SUCCESS = 'EMAIL_SUCCESS';
export const EMAIL_FAILURE = 'EMAIL_FAILURE';


function emailRequest(ids) {
  return {
    type: EMAIL_REQUEST
  };
}

function emailSuccess(payload) {
  console.log(payload);
  return {
    type: EMAIL_SUCCESS,
    message: payload.message
  };
}

function emailFailure(error) {
  return {
    type: EMAIL_FAILURE,
    error
  };
}

export function emailClients(clients) {
  const config = {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body:  JSON.stringify({clients})
  };

  return callApi(
    '/api/email',
    config,
    emailRequest(clients),
    emailSuccess,
    emailFailure
  );
}

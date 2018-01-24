import {
  callApi
} from "../utils/apiUtils";

export const CLIENTS_REQUEST = "CLIENTS_REQUEST";
export const CLIENTS_SUCCESS = "CLIENTS_SUCCESS";
export const CLIENTS_FAILURE = "CLIENTS_FAILURE";

export const ADD_CLIENT_REQUEST = "ADD_CLIENT_REQUEST";
export const ADD_CLIENT_SUCCESS = "ADD_CLIENT_SUCCESS";
export const ADD_CLIENT_FAILURE = "ADD_CLIENT_FAILURE";

export const UPDATE_CLIENT_REQUEST = "UPDATE_CLIENT_REQUEST";
export const UPDATE_CLIENT_SUCCESS = "UPDATE_CLIENT_SUCCESS";
export const UPDATE_CLIENT_FAILURE = "UPDATE_CLIENT_FAILURE";

export const DEL_CLIENT_REQUEST = "DEL_CLIENT_REQUEST";
export const DEL_CLIENT_SUCCESS = "DEL_CLIENT_SUCCESS";
export const DEL_CLIENT_FAILURE = "DEL_CLIENT_FAILURE";

export const SELECTED_CLIENT = 'SELECTED_CLIENT';

export const UPLOAD_REQUEST = "UPLOAD_REQUEST";
export const UPLOAD_SUCCESS = "UPLOAD_SUCCESS";
export const UPLOAD_FAILURE = "UPLOAD_FAILURE";


export const SAVE_MONTH_REQUEST = 'SAVE_MONTH_REQUEST';
export const SAVE_MONTH_SUCCESS = 'SAVE_MONTH_SUCCESS';
export const SAVE_MONTH_FAILURE = 'SAVE_MONTH_FAILURE';


// Save Month

function saveMonthRequest(month) {
  return {
    type: SAVE_MONTH_REQUEST
  };
}

function saveMonthSuccess(payload) {
  return {
    type: SAVE_MONTH_SUCCESS,
    payload
  };
}

function saveMonthFailure(error) {
  return {
    type: SAVE_MONTH_FAILURE,
    error
  };
}

export function saveMonth(data, monthNyear) {
  const [ month, year ] = monthNyear.split('-');
  const config = {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({...data}) // data
  };
  return callApi(
    '/api/savemonth?month='+ month +'&year=' + year,
    config,
    saveMonthRequest(month),
    saveMonthSuccess,
    saveMonthFailure
  );
}


// Upload 

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


/// Client CRUD

function clientsRequest() {
  return {
    type: CLIENTS_REQUEST
  };
}

function clientsSuccess(payload) {
  return {
    type: CLIENTS_SUCCESS,
    payload: payload
  };
}

function clientsFailure(error) {
  return {
    type: CLIENTS_FAILURE
  };
}

export function getClients(clientId, month, year) {
  const config = {
    method: 'get'
  };
  return callApi(
    '/api/clients?clientId='+ clientId +'&month='+month+'&year='+year,
    config,
    clientsRequest,
    clientsSuccess,
    clientsFailure
  );
}

export function getSingleClient(clientId) {
  return {
    type: SELECTED_CLIENT,
    selected: clientId
  };
}

function updateClientRequest() {
  return {
    type: UPDATE_CLIENT_REQUEST
  };
}

function updateClientSuccess(payload) {
  return {
    type: UPDATE_CLIENT_SUCCESS,
    payload
  };
}

function updateClientFailure(error) {
  return {
    type: UPDATE_CLIENT_FAILURE
  };
}

export function updateClient(id, data) {
  const config = {
    method: 'put',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  return callApi(
    '/api/client?clientId='+ id,
    config,
    updateClientRequest(data),
    updateClientSuccess,
    updateClientFailure
  );
}

function addClientsRequest() {
  return {
    type: ADD_CLIENT_REQUEST
  };
}

function addClientsSuccess(payload) {
  return {
    type: ADD_CLIENT_SUCCESS,
    payload
  };
}

function addClientsFailure(error) {
  return {
    type: ADD_CLIENT_FAILURE,
    messeage: error
  };
}

export function addClient(id, data) {
  const config = {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  return callApi(
    '/api/client?userId='+id,
    config,
    addClientsRequest(data),
    addClientsSuccess,
    addClientsFailure
  );
}


function delClientsRequest() {
  return {
    type: DEL_CLIENT_REQUEST
  };
}

function delClientsSuccess(payload) {
  return {
    type: DEL_CLIENT_SUCCESS,
    payload
  };
}

function delClientsFailure(error) {
  return {
    type: DEL_CLIENT_FAILURE
  };
}

export function deleteClients(data) {
  const config = {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };
  return callApi(
    "/api/deleteclients",
    config,
    delClientsRequest(data),
    delClientsSuccess,
    delClientsFailure
  );
}

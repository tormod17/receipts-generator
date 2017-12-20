import {
    UPLOAD_REQUEST,
    UPLOAD_SUCCESS,
    UPLOAD_FAILURE,
    CLIENTS_REQUEST,
    CLIENTS_SUCCESS,
    CLIENTS_FAILURE,
    UPDATE_CLIENT_REQUEST,
    UPDATE_CLIENT_SUCCESS,
    UPDATE_CLIENT_FAILURE,
    ADD_CLIENT_REQUEST,
    ADD_CLIENT_SUCCESS,
    ADD_CLIENT_FAILURE,
    DEL_CLIENT_REQUEST,
    DEL_CLIENT_SUCCESS,
    DEL_CLIENT_FAILURE,
    SELECTED_CLIENT
} from '../actions/clients.js';

const initialState = {};


export function clients(state = initialState, action = {}) {
    switch (action.type) {
        case UPLOAD_REQUEST:
            return {
                ...state,
                uploading: true
            };
        case UPLOAD_SUCCESS:
            return {
                ...state,
                message: action.payload.message,
                uploading: false,
                uploaded: true
            };
        case UPLOAD_FAILURE:
            return {
                ...state,
                message: 'Error uploading'
            };
        case CLIENTS_REQUEST:
            return {
                ...state,
                retrieving: true
            };
        case CLIENTS_SUCCESS:
            return {
                data: {
                    ...action.payload
                },
                retrieving: false,
                retrieved: true
            };
        case CLIENTS_FAILURE:
            return {
                ...state,
                message: { ...action.payload }
            };
        case ADD_CLIENT_REQUEST:
            return {
                ...state
            };
        case ADD_CLIENT_SUCCESS:
            return {
                ...state,
                data: {
                    ...action.payload
                }
            };
        case ADD_CLIENT_FAILURE:
            return {
                ...state,
                message: action.payload
            };
        case UPDATE_CLIENT_REQUEST:
            return {
                ...state
            };
        case UPDATE_CLIENT_SUCCESS:
            return {
                ...state,
                data: {
                    ...action.payload
                }
            };
        case UPDATE_CLIENT_FAILURE:
            return {
                ...state,
                message: action.payload
            };
        case DEL_CLIENT_REQUEST:
            return {
                ...state
            };
        case DEL_CLIENT_SUCCESS:
            return {
                ...state,
                ...action.payload
            };
        case DEL_CLIENT_FAILURE:
            return {
                ...state,
                message: action.payload
            };
        case SELECTED_CLIENT:
            return {
                ...state,
                selectedCLIENT: action.selected
            };
        default:
            return state;
    }
}
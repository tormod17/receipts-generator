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
    SAVE_MONTH_REQUEST,
    SAVE_MONTH_SUCCESS,
    SAVE_MONTH_FAILURE,
    SELECTED_CLIENT
} from '../actions/clients.js';

const initialState = {
    data: {},
    message: '',
    status: ''
};

function removeProperties(ids, data) {
    if(!ids) return false;
    ids.forEach(id => {
        data[id] = undefined;
        data = JSON.parse(JSON.stringify(data));
    });
    return data;
}


export function clients(state = initialState, action = {}) {
    switch (action.type) {
        case SAVE_MONTH_REQUEST:
            return {
                ...state,
                saving: true
            };
        case SAVE_MONTH_SUCCESS:
            return {
                ...state,
                data: {
                    ...action.payload.clients
                },
                message: action.payload.message,
                saving: false,
                saved: true
            };
        case SAVE_MONTH_FAILURE:
            return {
                ...state,
                message: action.error
            };
        case UPLOAD_REQUEST:
            return {
                ...state,
                uploading: true
            };
        case UPLOAD_SUCCESS:
            return {
                ...state,
                data:{
                    ...state.data,
                    ...action.payload.data
                },
                message: action.payload.message,
                uploading: false,
                uploaded: true,
                status: 'uploaded'
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
                ...state,
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
                    ...state.data,
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
                    ...state.data,
                    ...action.payload.client
                },
                message: action.payload.message
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
                data: {
                    ...removeProperties(action.payload.data, state.data)
                },
                message: action.payload.message,
                status: 'deleted'
            };
        case DEL_CLIENT_FAILURE:
            return {
                ...state,
                message: action.payload
            };
        case SELECTED_CLIENT:
            return {
                ...state,
                selectedClient: action.selected
            };
        default:
            return state;
    }
}
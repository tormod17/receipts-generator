import {
    UPLOAD_REQUEST,
    UPLOAD_SUCCESS,
    UPLOAD_FAILURE,
    RECEIPTS_REQUEST,
    RECEIPTS_SUCCESS,
    RECEIPTS_FAILURE,
    UPDATE_RECEIPT_REQUEST,
    UPDATE_RECEIPT_SUCCESS,
    UPDATE_RECEIPT_FAILURE,
    ADD_RECEIPT_REQUEST,
    ADD_RECEIPT_SUCCESS,
    ADD_RECEIPT_FAILURE,
    DEL_RECEIPT_REQUEST,
    DEL_RECEIPT_SUCCESS,
    DEL_RECEIPT_FAILURE,
    SELECTED_RECEIPT
} from "../actions/receipts.js"

const initialState = {}


export function receipts(state = initialState, action = {}) {
    switch (action.type) {
        case UPLOAD_REQUEST:
            return {
                ...state,
                uploading: true
            };
        case UPLOAD_SUCCESS:
            return {
                ...state,
                data: { ...action.data },
                message: null,
                uploading: false,
                uploaded: true,
            };
        case UPLOAD_FAILURE:
            return {
                ...state,
                message: 'Error uploading'
            }
        case RECEIPTS_REQUEST:
            return {
                ...state,
                retrieving: true,
            };
        case RECEIPTS_SUCCESS:
            return {
                data: {
                    ...action.payload,
                },
                retrieving: false,
                retrieved: true,
            };
        case RECEIPTS_FAILURE:
            return {
                ...state,
                message: { ...action.payload }
            }
        case ADD_RECEIPT_REQUEST:
            return {
                ...state,

            };
        case ADD_RECEIPT_SUCCESS:
            return {
                ...state,
                data: {
                    ...action.payload,
                }
            }
        case ADD_RECEIPT_FAILURE:
            return {
                ...state,
                message: action.payload,
            }
        case UPDATE_RECEIPT_REQUEST:
            return {
                ...state,

            };
        case UPDATE_RECEIPT_SUCCESS:
            return {
                ...state,
                data: {
                    ...action.payload,
                }
            }
        case UPDATE_RECEIPT_FAILURE:
            return {
                ...state,
                message: action.payload,
            }
        case DEL_RECEIPT_REQUEST:
            return {
                ...state,
            };
        case DEL_RECEIPT_SUCCESS:
            return {
                ...state,
                ...action.payload,
            }
        case DEL_RECEIPT_FAILURE:
            return {
                ...state,
                message: action.payload,
            }
        case SELECTED_RECEIPT:
            return {
                ...state,
                selectedReceipt: action.selected,
            }
        default:
            return state;
    }
}

import { RECEIPTS_REQUEST, RECEIPTS_SUCCESS, RECEIPTS_FAILURE, ADD_RECEIPT_REQUEST,
ADD_RECEIPT_SUCCESS,
ADD_RECEIPT_FAILURE, SELECTED_RECEIPT } from "../actions/receipts.js"

const initialState = {}

export function receipts(state = initialState, action = {}) {

  switch (action.type) {
    case RECEIPTS_REQUEST:
      return { 
        ...state,
        uploading: true 
      };
    case RECEIPTS_SUCCESS:
      return {
        ...action.receipts,
      };
    case RECEIPTS_FAILURE:
      return {
        ...state,
      }
    case ADD_RECEIPT_REQUEST:
      return {
        ...state,
      };
    case ADD_RECEIPT_SUCCESS:
      return {
        ...state,
        ...action.payload,
      }
    case ADD_RECEIPT_FAILURE:
      return {
        ...state,
        message: 'Error adding entry'
      }
    default:
      return state;
  }
}


export function selectedReceipt(state = initialState, action = {}) {
  switch (action.type) {
    case SELECTED_RECEIPT:
      return {
        ...state,
        id: action.selected,
      }
    default:
      return state;
  }
}


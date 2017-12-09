
import { RECEIPTS_REQUEST, RECEIPTS_SUCCESS, RECEIPTS_FAILURE, ADD_RECEIPT_REQUEST,
ADD_RECEIPT_SUCCESS,
ADD_RECEIPT_FAILURE } from "../actions/receipts.js"

const initialState = null;

export default function receipts(state = initialState, action = {}) {

  switch (action.type) {
    case RECEIPTS_REQUEST:
      return Object.assign({}, state, { uploading: true });
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

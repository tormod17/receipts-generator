
import { RECEIPTS_REQUEST, RECEIPTS_SUCCESS, RECEIPTS_FAILURE } from "../actions/receipts.js"

const initialState = {
  receipts: null,
};

export default function receipts(state = initialState, action = {}) {
  switch (action.type) {
    case RECEIPTS_REQUEST:
      return Object.assign({}, state, { uploading: true });
    case RECEIPTS_SUCCESS:
      return {
        ...action,
      };
    case RECEIPTS_FAILURE:
      return {
        ...state,
      }
    default:
      return state;
  }
}

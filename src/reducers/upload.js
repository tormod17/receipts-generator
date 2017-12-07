
import { UPLOAD_REQUEST, UPLOAD_SUCCESS, UPLOAD_FAILURE } from "../actions/upload.js"


import { loadUserProfile } from "../utils/apiUtils";

const initialState = {
  uploading: false,
  uploadingError: null,
};

export default function upload(state = initialState, action = {}) {
  switch (action.type) {
    case UPLOAD_REQUEST:
      return Object.assign({}, state, { uploading: true });
    case UPLOAD_SUCCESS:
      return Object.assign({}, state, {
        ...action,
      });
    case UPLOAD_FAILURE:
      return {
        ...state,
      }
    default:
      return state;
  }
}


import { UPLOAD_REQUEST, UPLOAD_SUCCESS, UPLOAD_FAILURE } from "../actions/upload.js"


const initialState = {
  uploading: false,
  uploadingError: null,
  uploaded: null
};

export default function uploadReceipts(state = initialState, action = {}) {
  switch (action.type) {
    case UPLOAD_REQUEST:
      return { 
        ...state, 
        uploading: true 
      };
    case UPLOAD_SUCCESS:
      return {
        ...state,
        uploaded: true
      };
    case UPLOAD_FAILURE:
      return {
        ...state,
        uploadingError: 'Error uploading'
      };
    default:
      return state;
  }
}

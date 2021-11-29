import { 
    FETCH_PICTOGRAMS_PENDING,
    FETCH_PICTOGRAMS_ERROR,
    FETCH_PICTOGRAMS_SUCCESS,
    ADD_PICTOGRAM_SUCCESS,
    ADD_PICTOGRAM_ERROR,
    UPDATE_PICTOGRAM_SUCCESS,
    UPDATE_PICTOGRAM_ERROR,
    DELETE_PICTOGRAM_SUCCESS,
    DELETE_PICTOGRAM_ERROR,
    CHANGED_STATUS,
    RESET_STATE,
    GET_PICTOGRAMS,
    ADD_FAVORITE,
    CLEAN_ERROR
    } from '../constants/pictograms';

const initialState = {
    loadingPictograms: false,
    pictograms: [],
    pictogramsIsReady: false,
    changedPictograms: false,
    err: null
}

function pictogramsReducer(state = initialState, {type, payload}) {
    switch(type) {
        case FETCH_PICTOGRAMS_PENDING: 
            return {
                ...state,
                loadingPictograms: true
            }
        case FETCH_PICTOGRAMS_ERROR:
        case ADD_PICTOGRAM_ERROR:
        case UPDATE_PICTOGRAM_ERROR:
        case DELETE_PICTOGRAM_ERROR:
        {    
            return {
                ...state,
                loadingPictograms: false,
                err: payload.err,
                pictogramsIsReady: false,
            }
        }
        case FETCH_PICTOGRAMS_SUCCESS: {
            return {
                ...state,
                loadingPictograms: false,
                pictograms: payload.pictograms,
                pictogramsIsReady: true,
                changedPictogram: false,
            }
        }
        case GET_PICTOGRAMS: {
            return {
                ...state,
                loadingPictograms: false,
                pictograms: payload.pictograms
            }
        }
        case ADD_PICTOGRAM_SUCCESS: 
        case UPDATE_PICTOGRAM_SUCCESS:
        case DELETE_PICTOGRAM_SUCCESS:
        {
            return {
                ...state,
                pictograms: payload.pictograms,
                loadingPictograms: false,
                changedPictograms: true
            }
        }
        case CHANGED_STATUS: {
            return {
                ...state,
                changedPictograms: false
            }
        }
        case CLEAN_ERROR: {
            return {
                ...state,
                err: null
            }
        }
        case ADD_FAVORITE: {
            return state;
        }
        case RESET_STATE: {
            return state = initialState
        }
        default:
            return state;
    }
    
}

export default pictogramsReducer;


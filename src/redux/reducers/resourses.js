import {
    LOADING_RESOURSES,
    GET_RESOURSES_ERROR,
    GET_RESOURSES,
    NO_GET_RESOURSES
} from '../constants/resourses';

const initialState = {
    loadingResourse: false,
    error: null,
    hasResourses: false
}

const resoursesResucer = ( state = initialState, { type, payload }) => {
    switch (type) {
        case LOADING_RESOURSES:
            return {
                ...state,
                loadingResourse: true
            };
        case GET_RESOURSES_ERROR:
            return {
                ...state,
                error: payload.error
            };
        case GET_RESOURSES:
            return {
                ...state,
                hasResourse: false
            };
        case NO_GET_RESOURSES:
            return {
                ...state,
                hasResourse: true
            };
        default:
            return state;
    }
};

export default resoursesResucer;
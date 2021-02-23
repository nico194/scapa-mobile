import {
    FETCH_ROUTINES_PENDING,
    FETCH_ROUTINES_SUCCESS,
    FETCH_ROUTINES_ERROR,    
    ADD_ROUTINE_SUCCESS,
    ADD_ROUTINE_ERROR,
    UPDATE_ROUTINE_SUCCESS,
    UPDATE_ROUTINE_ERROR,
    DELETE_ROUTINE_SUCCESS,
    DELETE_ROUTINE_ERROR,
    ADD_PICTOGRAM_TO_PHRASE,
    REMOVE_PICTOGRAM_TO_PHRASE
} from '../constants/phrases';

export const getRoutine = () => {
    return dispatch => {
        dispatch({ type: FETCH_ROUTINES_SUCCESS });
    }
};

export const addRoutine = ( routine ) => {
    return dispatch => {
        dispatch({ type: ADD_ROUTINE_SUCCESS, payload: { routine } });
    }
};

export const updateRoutine = ( routine ) => {
    return dispatch => {
        dispatch({ type: UPDATE_ROUTINE_SUCCESS, payload: { routine } });
    }
}

export const deleteRoutine = ( routine ) => {
    return dispatch => {
        dispatch({ type: DELETE_ROUTINE_SUCCESS, payload: { routine } });
    }
}

export const addPictogramToPhrase = pictogram => dispatch => dispatch({ type: ADD_PICTOGRAM_TO_PHRASE, payload: { pictogram } })

export const removePictogramToPhrase = index => dispatch => dispatch({ type: REMOVE_PICTOGRAM_TO_PHRASE, payload: { index } })
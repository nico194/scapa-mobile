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

const initialState = {
    loadingRoutines: false,
    err: null,
    routines: [],
    memories: [],
    phrase: [],
    changed: false,
    lastId: 0
}

const phrasesReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ADD_PICTOGRAM_TO_PHRASE:
            return {
                ...state,
                phrase: state.phrase.concat(payload.pictogram)
            };
        case REMOVE_PICTOGRAM_TO_PHRASE:
            return {
                ...state,
                phrase: state.phrase.filter( (pic, index) => index !== payload.index )
            };
        case FETCH_ROUTINES_PENDING:
            return {
                ...state,
                loadingRoutines: true
            }
        case FETCH_ROUTINES_ERROR:
        case ADD_ROUTINE_ERROR:
        case UPDATE_ROUTINE_ERROR:
        case DELETE_ROUTINE_ERROR:
            return {
                ...state,
                loadingRoutines: false,
                error: payload.err
            }
        case FETCH_ROUTINES_SUCCESS:
            return {
                ...state,
                loadingRoutines: false,
                changed: false
            }
        case ADD_ROUTINE_SUCCESS:
            return {
                ...state,
                loadingRoutines: false,
                routines: state.routines.concat(payload.routine),
                changed: true,
                lastId: state.lastId++
            }
        case UPDATE_ROUTINE_SUCCESS:
            return {
                ...state,
                loadingRoutines: false,
                routines: state.routines.map( routine => 
                    routine.id === payload.routine.id ?
                        {
                            ...routine,
                            descripción: payload.routine.descripción,
                            phrase: payload.routine.phrase
                        }
                        :
                        routine
                ),
                changed: true
            }
        case DELETE_ROUTINE_SUCCESS:
            return {
                ...state,
                routines: state.routines.filter( routine => routine.id !== payload.routine.id)
            }
        default:
            return state;
    }
}

export default phrasesReducer;
import {
    FETCH_PHRASES_PENDING,
    FETCH_PHRASES_ERROR,
    FETCH_PHRASES_SUCCESS,
    ADD_PHRASE_SUCCESS,
    ADD_PHRASE_ERROR,
    UPDATE_PHRASE_SUCCESS,
    UPDATE_PHRASE_ERROR,
    DELETE_PHRASE_SUCCESS,
    DELETE_PHRASE_ERROR,
    ADD_PICTOGRAM_TO_PHRASE,
    REMOVE_PICTOGRAM_TO_PHRASE,
    RESET_STATE
} from '../constants/phrases';

const initialState = {
    loadingPhrases: false,
    err: null,
    phrases: [],
    phrasesIsReady: false,
    phrase: [],
    changedPhrase: false
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
        case FETCH_PHRASES_PENDING:
            return {
                ...state,
                loadingPhrases: true
            }
        case FETCH_PHRASES_ERROR:
        case ADD_PHRASE_ERROR:
        case UPDATE_PHRASE_ERROR:
        case DELETE_PHRASE_ERROR:
            return {
                ...state,
                loadingPhrases: false,
                error: payload.err
            }
        case FETCH_PHRASES_SUCCESS:
            return {
                ...state,
                loadingPhrases: false,
                phrases: payload.phrases,
                changedPhrase: false,
                phrasesIsReady: true
            }
        case ADD_PHRASE_SUCCESS:
            return {
                ...state,
                loadingPhrases: false,
                phrases: payload.phrases,
                changedPhrase: true,
                phrase: []
            }
        case UPDATE_PHRASE_SUCCESS:
            return {
                ...state,
                loadingPhrases: false,
                phrases: state.phrases.map( routine => 
                    routine.id === payload.routine.id ?
                        {
                            ...routine,
                            descripción: payload.routine.descripción,
                            phrase: payload.routine.phrase
                        }
                        :
                        routine
                ),
                changedPhrase: true
            }
        case DELETE_PHRASE_SUCCESS:
            return {
                ...state,
                loadingPhrases: false,
                phrases: payload.phrases,
                changedPhrase: true
            }
        case RESET_STATE:
            return state = initialState
        default:
            return state;
    }
}

export default phrasesReducer;
import { 
    FETCH_CATEGORIES_PENDING,
    FETCH_CATEGORIES_ERROR,
    FETCH_CATEGORIES_SUCCESS,
    ADD_CATEGORY_SUCCESS,
    ADD_CATEGORY_ERROR,
    UPDATE_CATEGORY_SUCCESS,
    UPDATE_CATEGORY_ERROR,
    DELETE_CATEGORY_SUCCESS,
    DELETE_CATEGORY_ERROR,
    CHANGED_STATUS,
    RESET_STATE
    } from '../constants/categories';

const initialState = {
    loadingCategories: false,
    categories: [],
    categorySaved : {},
    changedCategories: false,
    categoriesIsReady: false,
    err: null
}

function categoriesReducer(state = initialState, {type, payload}) {
    switch(type) {
        case FETCH_CATEGORIES_PENDING: 
            return {
                ...state,
                loadingCategories: true
            }
        case FETCH_CATEGORIES_ERROR:
        case ADD_CATEGORY_ERROR:
        case UPDATE_CATEGORY_ERROR:
        case DELETE_CATEGORY_ERROR:
        {
            return {
                ...state,
                loadingCategories: false,
                err: payload.err,
                categoriesIsReady: false
            }
        }
        case FETCH_CATEGORIES_SUCCESS:
            return {
                ...state,
                loadingCategories: false,
                categories: payload.categories,
                changedCategories: false,
                categoriesIsReady: true
            }
        case ADD_CATEGORY_SUCCESS: 
        case UPDATE_CATEGORY_SUCCESS:
        case DELETE_CATEGORY_SUCCESS:
        {
            return {
                ...state,
                loadingCategories: false,
                categories: payload.categories,
                categorySaved: payload.category ? payload.category : {},
                changedCategories: true
            } 
        }
        case CHANGED_STATUS: {
            return {
                ...state,
                changedCategories: false
            }
        }
        case RESET_STATE: {
            return state = initialState
        }
        default:
            return state;
    }
}

export default categoriesReducer;


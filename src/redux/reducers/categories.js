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
        case ADD_CATEGORY_SUCCESS: {
            return {
                ...state,
                loadingCategories: false,
                categories: state.categories.concat(payload.category),
                changedCategories: true
            } 
        }
        case UPDATE_CATEGORY_SUCCESS: {
            return {
                ...state,
                loadingCategories: false,
                categories: state.categories.map( cat => cat.id === payload.category.id ? { ...cat, attributes:  { description : payload.category.attributes.description } } : cat ),
                changedCategories: true
            };
        }
        case DELETE_CATEGORY_SUCCESS: {
            return {
                ...state,
                loadingCategories: false,
                categories: state.categories.filter(category => category.id !== payload.id)
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


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
    } from '../constants/categories';

const initialState = {
    loadingCategoriesCategories: false,
    categories: [],
    changed: false,
    previousPage: 0, 
    currentPage: 0, 
    totalPage: 0, 
    nextPage: 0,
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
                err: payload.err
            }
        }
        case FETCH_CATEGORIES_SUCCESS: 
            return {
                ...state,
                loadingCategories: false,
                categories: payload.categories,
                changed: false,
                previousPage: payload.previousPage, 
                currentPage: payload.currentPage, 
                totalPage: payload.totalPage, 
                nextPage: payload.nextPage,
            }
        case ADD_CATEGORY_SUCCESS: {
            return {
                ...state,
                loadingCategories: false,
                categories: state.categories.concat(payload.category),
                changed: true
            } 
        }
        case UPDATE_CATEGORY_SUCCESS: {
            return {
                ...state,
                loadingCategories: false,
                categories: state.categories.map( cat => cat.id === payload.category.id ? { ...cat, attributes:  { description : payload.category.attributes.description } } : cat ),
                changed: true
            };
        }
        case DELETE_CATEGORY_SUCCESS: {
            return {
                ...state,
                loadingCategories: false,
                categories: state.categories.filter(category => category.id !== payload.category.id)
            }
        }
        default:
            return state;
    }
}

export default categoriesReducer;


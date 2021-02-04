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
    FILTER_PICTOGRAMS_BY_CATEGORY
    } from '../constants/pictograms';

const initialState = {
    loadingPictograms: false,
    pictograms: [],
    filteredPictograms: [],
    changed: false,
    previousPage: 0, 
    currentPage: 0, 
    totalPage: 0, 
    nextPage: 0,
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
                err: payload.err
            }
        }
        case FETCH_PICTOGRAMS_SUCCESS: {
            return {
                ...state,
                loadingPictograms: false,
                pictograms: payload.pictograms,
                filteredPictograms: payload.pictograms,
                changed: false,
                previousPage: payload.previousPage, 
                currentPage: payload.currentPage, 
                totalPage: payload.totalPage, 
                nextPage: payload.nextPage,
            }
        }
        case ADD_PICTOGRAM_SUCCESS: {
            return {
                ...state,
                pictograms: state.pictograms.concat(payload.pictogram),
                changed: true
            }
        }
        case UPDATE_PICTOGRAM_SUCCESS: {
            return {
                ...state,
                pictograms: state.pictograms.map( 
                    pic => pic.id === payload.pictogram.id ? 
                        { 
                            ...pic, 
                            attributes:  { description : payload.pictogram.attributes.description },
                            relationships: { classifiable: { data: { id: payload.pictogram.relationships.classifiable.data.id } }}  
                        } 
                        : 
                        pic 
                ),
                changed: true
            };
        }
        case DELETE_PICTOGRAM_SUCCESS: {
            return {
                ...state,
                loadingPictograms: false,
                pictograms: state.pictograms.filter(pictogram => pictogram.id !== payload.pictogram.id)
            }
        }
        case FILTER_PICTOGRAMS_BY_CATEGORY: {
            return {
                ...state,
                filteredPictograms: state.pictograms.filter( pic => pic.relationships.classifiable.data.id === payload.idCategory)
            }
        }
        default:
            return state;
    }
    
}

export default pictogramsReducer;


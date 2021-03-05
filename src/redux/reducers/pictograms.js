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
    FILTER_PICTOGRAMS_BY_CATEGORY,
    SET_ALL_PICTOGRAMS,
    CHANGED_STATUS,
    RESET_STATE
    } from '../constants/pictograms';

const initialState = {
    loadingPictograms: false,
    pictograms: [],
    filteredPictograms: [],
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
                filteredPictograms: payload.pictograms,
                pictogramsIsReady: true,
                changedPictogram: false,
            }
        }
        case ADD_PICTOGRAM_SUCCESS: {
            return {
                ...state,
                pictograms: state.pictograms.concat(payload.pictogram),
                loadingPictograms: false,
                changedPictograms: true
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
                            relationships: { classifiable: { data: { id: payload.pictogram.relationships.classifiable.data.id, type: 'custom_category' } }},
                            image: payload.pictogram.image 
                        }
                        : 
                        pic 
                ),
                filteredPictograms: state.filteredPictograms.map( 
                    pic => pic.id === payload.pictogram.id ? 
                        { 
                            ...pic, 
                            attributes:  { description : payload.pictogram.attributes.description },
                            relationships: { classifiable: { data: { id: payload.pictogram.relationships.classifiable.data.id, type: 'custom_category' } }},
                            image: payload.pictogram.image 
                        }
                        : 
                        pic 
                ),
                changedPictograms: true,
                loadingPictograms: false
            };
        }
        case DELETE_PICTOGRAM_SUCCESS: {
            return {
                ...state,
                loadingPictograms: false,
                pictograms: state.pictograms.filter(pictogram => pictogram.id !== payload.pictogram.id),
                filteredPictograms: state.filteredPictograms.filter(pictogram => pictogram.id !== payload.pictogram.id)
            }
        }
        case FILTER_PICTOGRAMS_BY_CATEGORY: {
            return {
                ...state,
                filteredPictograms: 
                    payload.isCustom ?
                        state.pictograms.filter( pic => pic.attributes['is_custom'] && pic.relationships.classifiable.data.id === payload.idCategory)
                        :
                        state.pictograms.filter( pic => !pic.attributes['is_custom'] && pic.relationships.classifiable.data.id === payload.idCategory) 
                
            }
        }
        case SET_ALL_PICTOGRAMS: {
            return {
                ...state,
                filteredPictograms: state.pictograms
            }
        }
        case CHANGED_STATUS: {
            return {
                ...state,
                changedPictograms: false
            }
        }
        case RESET_STATE: {
            return state = initialState
        }
        default:
            return state;
    }
    
}

export default pictogramsReducer;


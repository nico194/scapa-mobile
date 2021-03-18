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
    PICTOGRAMS_ASYNC_STORAGE,
    CHANGED_STATUS,
    RESET_STATE,
    GET_PICTOGRAMS
    } from '../constants/pictograms';
import axiosConfig from '../../configs/axios';
import { fileToBase64, donwloadAndSaveFile , updateFile, deleteFile } from '../../configs/manageFiles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import shorthash from 'shorthash';

export const getAllPictograms = ({ accessToken, client, uid }) => {
    return async dispatch => {
        dispatch({ type: FETCH_PICTOGRAMS_PENDING });        
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid
        }}
        try {
            const pictogramsByDefault = await getPictogramsFromAPI('pictograms', headers);
            const pictogramsByCustom = await getPictogramsFromAPI('custom_pictograms', headers); 
            const filterBy =  Object.keys(pictogramsByCustom).length > 0 ? '1-custom' : '1-default';
            Object.assign(pictogramsByCustom, pictogramsByDefault);
            await AsyncStorage.setItem(PICTOGRAMS_ASYNC_STORAGE, JSON.stringify(pictogramsByCustom))
            return dispatch({ type: FETCH_PICTOGRAMS_SUCCESS, payload: { pictograms: pictogramsByCustom[filterBy].pictograms }});
        } catch (err) {
            console.log(err)
            return dispatch({ type: FETCH_PICTOGRAMS_ERROR, payload: {err}});
        }
    }
}

const getPictogramsFromAPI = async (source, headers) => {
    let band = true;
    let page = 1;
    let pictogramsGroupedByCategories = {};
    try {
        while (band) {
            const response = await axiosConfig.get(`/v1/${source}?per_page=40&page=${page}`, headers);
            const { data, meta } = response.data;
            if(data.length > 0) {
                const pictograms =  await savePictogramsImages(data);
                pictogramsGroupedByCategories = groupPictogramsByCategory(pictogramsGroupedByCategories, pictograms);
                band = !meta.is_last_page;
                page += 1;
            } else {
                pictogramsGroupedByCategories = {}
                band = false;
            }
        } 
    } catch (error) {
        console.log(error)
    }
    return pictogramsGroupedByCategories;
}

const savePictogramsImages = async (pictograms) => {
    let pics = [];
    try {
        pics = await Promise.all(pictograms.map(async (pictogram) => {
            const imageName = shorthash.unique(`${pictogram.attributes.description}-${ pictogram.attributes.is_custom ? 'custom' : 'default' }`) + '.jpg';
            const uri =  pictogram.attributes.image_url ? await donwloadAndSaveFile(imageName, pictogram.attributes.image_url) : null;
            console.log('uri:', uri)
            pictogram.image =  uri ;
            return pictogram;
        }));
    } catch (error) {
        console.log(error)
    }
    return pics;
}

const groupPictogramsByCategory = (pictogramsGroupedByCategories, pictograms) => {
    pictograms.forEach( pictogram => {
        const group = `${pictogram.relationships.classifiable.data.id}-${ pictogram.attributes.is_custom ? 'custom' : 'default' }`;
        if(!pictogramsGroupedByCategories.hasOwnProperty(group)) {
            pictogramsGroupedByCategories[group] = {
                pictograms: []
            }
        }                    
        pictogramsGroupedByCategories[group].pictograms.push(pictogram);
    })

    return pictogramsGroupedByCategories;
}

export const filterPictogramsByCategory = (idCategory, isCustom) => {
    return async dispatch => {
        dispatch({ type: FETCH_PICTOGRAMS_PENDING });
        try {
            const category = `${idCategory}-${ isCustom ? 'custom' : 'default'}`;
            const pictograms = await getPictogramsByCategoryFromAsyncStorage(category);
            console.log('picts saved:', pictograms)
            return dispatch({ type: FETCH_PICTOGRAMS_SUCCESS, payload: { pictograms }})
        } catch (error) {
            console.log(error);
            return dispatch({ type: FETCH_PICTOGRAMS_ERROR, payload: {error}});
        }
    }
}

const getPictogramsByCategoryFromAsyncStorage = async (category) => {
    try {
        const pics = await AsyncStorage.getItem(PICTOGRAMS_ASYNC_STORAGE);
        const pictogramsByCategory = JSON.parse(pics);
        const pictograms = pictogramsByCategory[category] !== undefined ? pictogramsByCategory[category].pictograms : [];
        return pictograms;        
    } catch (error) {
        console.log(error);
    }
}

const setPictogramsByCategoryIntoAsyncStorage  = async (pictograms, category) => {
    try {
        const pics = await getPictogramsFromAsyncStorage();
        const pictogramsGroupedByCategory = JSON.parse(pics);
        pictogramsGroupedByCategory[category].pictograms = pictograms;
        await AsyncStorage.setItem(PICTOGRAMS_ASYNC_STORAGE, JSON.stringify(pictogramsGroupedByCategory));
    } catch (error) {
        console.log(error);
    }
}

const getPictogramsFromAsyncStorage = async () => {
    try {
        const pics = await AsyncStorage.getItem(PICTOGRAMS_ASYNC_STORAGE);
        return JSON.parse(pics);       
    } catch (error) {
        console.log(error);
    }
}

export const addKeyIntoPictograms = async (category) => {
    return async dispatch => {
        try {
            const cat = `${category.id}-custom`;
            const pictogramsByCategory = await getPictogramsFromAsyncStorage();
            Object.defineProperty(pictogramsByCategory, cat, { value: { pictograms: [] }, enumerable: true, configurable: true, writable: true})
            const pictograms = pictogramsByCategory[cat].pictograms;
            console.log('pics:', pictograms);
            return dispatch({ type: GET_PICTOGRAMS, payload: { pictograms }})
        } catch (err) {
            console.log(err)
            return dispatch({ type: FETCH_PICTOGRAMS_ERROR, payload: {err}});
        }
    }
}

// export const updateKeyIntoPictogram = async (category) => {
//     return async dispatch => {

//     }
// }

// export const deleteKeyIntoPictogram = async (category) => {
//     return async dispatch => {

//     }
// }

export const addPictogram = (pictogramToAdd , { accessToken, client, uid }) => {
    return async dispatch => {
        dispatch({ type: FETCH_PICTOGRAMS_PENDING });
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid,
        }};
        try {
            const imageInBase64 = await fileToBase64(pictogramToAdd.image)
            const filename = `${shorthash.unique(pictogramToAdd.description)}.png`;
            const pictogram = {
                custom_pictogram: {
                    description: pictogramToAdd.description,
                    classifiable_id: pictogramToAdd.idCategory,
                    image: {
                        data: imageInBase64,
                        filename
                    }
                }
            };
            const response = await axiosConfig.post('/v1/custom_pictograms', JSON.stringify(pictogram), headers);
            const uri = await donwloadAndSaveFile(filename, response.data.data.attributes.image_url);
            const pictogramResponsed = { ...response.data.data, image: uri };
            const category = `${pictogramToAdd.idCategory}-custom`;
            const pictograms = await getPictogramsByCategoryFromAsyncStorage(category);
            pictograms.concat(pictogramResponsed);
            await setPictogramsByCategoryIntoAsyncStorage(pictograms, category)
            return dispatch({ type: ADD_PICTOGRAM_SUCCESS, payload: { pictograms }});
        } catch (error) {
            console.log(error);
            return dispatch({ type: ADD_PICTOGRAM_ERROR, payload: {err}});
        }
    }
}

export const deletePictogram = (pictogramToDelete, { accessToken, client, uid }) => {
    return async dispatch => {
        dispatch({ type: FETCH_PICTOGRAMS_PENDING });
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid
        }};
        console.log(headers)
        try {
            const response = await axiosConfig.delete(`/v1/custom_pictograms/${pictogramToDelete.id}`, headers )
            await deleteFile(pictogramToDelete.image);
            const category = `${response.data.data.id}-custom`
            const pictograms = await getPictogramsByCategoryFromAsyncStorage(category);
            const pictogramsFiltered = pictograms.filter(pic => pic.id !== response.data.data.id);
            await setPictogramsByCategoryIntoAsyncStorage(pictogramsFiltered, category);
            return dispatch({ type: DELETE_PICTOGRAM_SUCCESS, payload: { pictograms: pictogramsFiltered }})
        } catch (err) {
            console.log(err);
            return dispatch({ type: DELETE_PICTOGRAM_ERROR, payload: {err}})
        }
    }
}

export const updatePictogram = (pictogramToUpdate, { accessToken, client, uid }) => {
    return async dispatch => {
        dispatch({ type: FETCH_PICTOGRAMS_PENDING });
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid,
        }};
        try {
            const imageInBase64 = await fileToBase64(pictogramToUpdate.image);
            const filename = `${shorthash.unique(pictogramToUpdate.description)}.png`;
            const pictogram = {
                custom_pictogram: {
                    description: pictogramToUpdate.description,
                    classifiable_id: pictogramToUpdate.idCategory,
                    image: {
                        data: imageInBase64,
                        filename
                    }
                }
            };
            const response = await axiosConfig.put(`/v1/custom_pictograms/${pictogramToUpdate.id}`, JSON.stringify(pictogram), headers);
            const uri = await updateFile(pictogramToUpdate.image, filename, response.data.data.attributes.image_url);
            const pictogramResponsed = { ...response.data.data, image: uri };
            return dispatch({ type: UPDATE_PICTOGRAM_SUCCESS, payload: { pictogram: pictogramResponsed }});
        } catch (error) {
            console.log(error);
            return dispatch({ type: UPDATE_PICTOGRAM_ERROR, payload: {err}});
        }
    }
}

export const changedStatusPictogram = () => dispatch => dispatch({ type: CHANGED_STATUS })

export const emptyPictograms = () => {
    return async dispatch => {
        try {
            await AsyncStorage.setItem(PICTOGRAMS_ASYNC_STORAGE, JSON.stringify({}))
            return dispatch({ type: RESET_STATE })
        } catch (error) {
            console.log(error)
        }
    }
}
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
    PICTOGRAMS_ASYNC_STORAGE,
    SET_ALL_PICTOGRAMS,
    CHANGED_STATUS,
    RESET_STATE
    } from '../constants/pictograms';
import axiosConfig from '../../configs/axios';
import { fileToBase64, donwloadAndSaveFile , updateFile, deleteFile } from '../../configs/manageFiles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import shorthash from 'shorthash';

export const getAllPictograms = ({ accessToken, client, uid }) => {
    return async dispatch => {
        dispatch({ type: FETCH_PICTOGRAMS_PENDING });
        try {
            const pictograms = await getPictogramsFromResponse(accessToken, client, uid);          
            const pictogramsWithImage = await savePictogramsImages(pictograms);
            await AsyncStorage.setItem(PICTOGRAMS_ASYNC_STORAGE, JSON.stringify(pictogramsWithImage));
            return dispatch({ type: FETCH_PICTOGRAMS_SUCCESS, payload: { pictograms: pictogramsWithImage }});
        } catch (err) {
            console.log(err);
            return dispatch({ type: FETCH_PICTOGRAMS_ERROR, payload: {err}});
        }
    }
}

const getPictogramsFromResponse = async (accessToken, client, uid) => {
    const headers = { headers: {
        'access-token': accessToken,
        client,
        uid
    }}
    const responseDefault = await axiosConfig.get('/v1/pictograms?per_page=999', headers);
    const defaultPictograms = responseDefault.data.data;
    const responseCustom = await axiosConfig.get(`/v1/custom_pictograms?per_page=999`, headers);
    const customPictograms = responseCustom.data.data;
    const pictograms = customPictograms.concat(defaultPictograms); 
    return pictograms
}

const savePictogramsImages = async (pictograms) => {
    const pics = await Promise.all(pictograms.map(async (pictogram) => {
        const uri =  pictogram.attributes.image_url ? await donwloadAndSaveFile(pictogram.attributes.description, pictogram.attributes.image_url) : null;
        pictogram.image =  uri ;
        return pictogram;
    }));
    return pics;
}


export const getPictograms = () => {
    return async dispatch => {
        dispatch({ type: FETCH_PICTOGRAMS_PENDING });
        try {
            const pictograms = await AsyncStorage.getItem(PICTOGRAMS_ASYNC_STORAGE);
            return dispatch({ type: FETCH_PICTOGRAMS_SUCCESS, payload: { pictograms: JSON.parse(pictograms) }})
        } catch (error) {
            console.log(err);
            return dispatch({ type: FETCH_PICTOGRAMS_ERROR, payload: {err}});
        }
    }
}

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
            return dispatch({ type: ADD_PICTOGRAM_SUCCESS, payload: { pictogram: pictogramResponsed }});
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
        try {
            const response = await axiosConfig.delete(`/v1/custom_pictograms/${pictogramToDelete.id}`, headers )
            await deleteFile(pictogramToDelete.image);
            return dispatch({ type: DELETE_PICTOGRAM_SUCCESS, payload: {pictogram: response.data.data}})
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

export const filterPictogramsByCategory = (idCategory, isCustom) => dispatch => dispatch({ type: FILTER_PICTOGRAMS_BY_CATEGORY, payload: {idCategory, isCustom}})

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
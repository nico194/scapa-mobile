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
    SET_ALL_PICTOGRAMS
    } from '../constants/pictograms';
import axiosConfig from '../../configs/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAllPictograms = ({ accessToken, client, uid }) => {
    return async dispatch => {
        dispatch({ type: FETCH_PICTOGRAMS_PENDING });
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid
        }}
        try {
            const responseDefault = await axiosConfig.get('/v1/pictograms?per_page=999', headers);
            const defaultPictograms = responseDefault.data.data;
            const responseCustom = await axiosConfig.get(`/v1/custom_pictograms?per_page=999`, headers);
            const customPictograms = responseCustom.data.data;
            const pictograms = customPictograms.concat(defaultPictograms);
            await AsyncStorage.setItem(PICTOGRAMS_ASYNC_STORAGE, JSON.stringify(pictograms))
            return dispatch({ type: FETCH_PICTOGRAMS_SUCCESS, payload: { pictograms }})
        } catch (err) {
            return dispatch({ type: FETCH_PICTOGRAMS_ERROR, payload: {err}})
        }
    }
}

export const setAllPictograms = () => dispatch => { dispatch({ type: SET_ALL_PICTOGRAMS }) ;}

export const addPictogram = (pictogramToAdd , { accessToken, client, uid }) => {
    return dispatch => {
        //dispatch({ type: FETCH_PICTOGRAMS_PENDING });
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid
        }}
        const pictogram = {
            pictogram: {
                description: pictogramToAdd.attributes.description,
                classifiable_id: pictogramToAdd.relationships.classifiable.data.id
            }
        }
        axiosConfig.post('/admin/pictograms', JSON.stringify(pictogram), headers )
            .then( response => dispatch({ type: ADD_PICTOGRAM_SUCCESS, payload: {pictogram: response.data.data}}))
            .catch( err => dispatch({ type: ADD_PICTOGRAM_ERROR, payload: {err}}));
    }
}

export const deletePictogram = (id, { accessToken, client, uid }) => {
    return dispatch => {
        dispatch({ type: FETCH_PICTOGRAMS_PENDING });
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid
        }}
        axiosConfig.delete(`/admin/pictograms/${id}`, headers )
            .then( response => dispatch({ type: DELETE_PICTOGRAM_SUCCESS, payload: {pictogram: response.data.data}}))
            .catch( err => dispatch({ type: DELETE_PICTOGRAM_ERROR, payload: {err}}));
    }
}

export const updatePictogram = (pictogramToUpdate, { accessToken, client, uid }) => {
    return dispatch => {
        dispatch({ type: FETCH_PICTOGRAMS_PENDING });
        const headers = {
            headers: {
                'access-token': accessToken,
                client,
                uid
            }
        }
        const pictogram = {
            pictogram: {
                description: pictogramToUpdate.attributes.description,
                classifiable_id: pictogramToUpdate.relationships.classifiable.data.id
            }
        }
        axiosConfig.put(`/admin/pictograms/${pictogramToUpdate.id}`, JSON.stringify(pictogram), headers)
            .then( response => dispatch({ type: UPDATE_PICTOGRAM_SUCCESS, payload: {pictogram: response.data.data}}))
            .catch( err => dispatch({ type: UPDATE_PICTOGRAM_ERROR, payload: {err}}));
    }
}

export const filterPictogramsByCategory = (idCategory, isCustom) => dispatch => dispatch({ type: FILTER_PICTOGRAMS_BY_CATEGORY, payload: {idCategory, isCustom}})


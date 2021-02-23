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
    CATEGORIES_ASYNC_STORAGE
    } from '../constants/categories';
import axiosConfig from '../../configs/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAllCategories = ({ accessToken, client, uid }) => {
    return async dispatch => {
        dispatch({ type: FETCH_CATEGORIES_PENDING });
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid
        }}
        try {
            const responseDefault = await axiosConfig.get(`/v1/categories?per_page=999`, headers);
            const defaultCategories = responseDefault.data.data.map( category => { return {...category, isCustom: false} });
            const responseCustom = await axiosConfig.get(`/v1/custom_categories?per_page=999`, headers);
            const customCategories = responseCustom.data.data.map( category => { return {...category, isCustom: true} });
            const categories = customCategories.concat(defaultCategories);
            await AsyncStorage.setItem(CATEGORIES_ASYNC_STORAGE, JSON.stringify(categories))
            return dispatch({ type: FETCH_CATEGORIES_SUCCESS, payload: { categories }})
        } catch (err) {
            console.log('this is an error: ', err);
            return dispatch({ type: FETCH_CATEGORIES_ERROR, payload: {err}})
        }
    }
}

export const setCategories = () => {
    return async dispatch => {
        try {
            const categories = await AsyncStorage.getItem(CATEGORIES_ASYNC_STORAGE);
            return dispatch({ type: FETCH_CATEGORIES_SUCCESS, payload: { categories }})
        } catch (err) {
            console.log(err);
            return dispatch({ type: FETCH_CATEGORIES_ERROR, payload: {err}})
        }
    }
}

export const addCategory = (categoryDescription, { accessToken, client, uid }) => {
    return async dispatch => {
        dispatch({ type: FETCH_CATEGORIES_PENDING });
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid
        }}
        const categoryRequest = {
            custom_category: {
                description: categoryDescription,
            }
        }
        console.log('header: ', headers, JSON.stringify(categoryRequest))
        try {
            const response = await axiosConfig.post('/v1/custom_categories', JSON.stringify(categoryRequest), headers );
            const category = { ...response.data.data, isCustom: true };
            return dispatch({ type: ADD_CATEGORY_SUCCESS, payload: { category }})
        } catch (err) {
            console.log(err);
            return dispatch({ type: ADD_CATEGORY_ERROR, payload: {err}})
        }
    }
}

export const deleteCategory = (id, { accessToken, client, uid }) => {
    return async dispatch => {
        dispatch({ type: FETCH_CATEGORIES_PENDING });
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid
        }}
        try {
            const response = await axiosConfig.delete(`/v1/custom_categories/${id}`, headers);
            return dispatch({ type: DELETE_CATEGORY_SUCCESS, payload: {id: response.data.data.id}});
        } catch (err) {
            console.log(err);
            return dispatch({ type: DELETE_CATEGORY_ERROR, payload: {err}});
        }
    }
}

export const updateCategory = (id, categoryDescription, { accessToken, client, uid }) => {
    return async dispatch => {
        dispatch({ type: FETCH_CATEGORIES_PENDING });
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid
        }}
        const categoryRequest = {
            custom_category: {
                description: categoryDescription,
            }
        }
        try {
            const response = await axiosConfig.put(`/v1/custom_categories/${id}`, JSON.stringify(categoryRequest), headers);
            return dispatch({ type: UPDATE_CATEGORY_SUCCESS, payload: { category: response.data.data }});
        } catch (err) {
            console.log(err);
            return dispatch({ type: UPDATE_CATEGORY_ERROR, payload: {err}})
        }
    }
}

export const changedStatusCategory = () => dispatch => dispatch({ type: CHANGED_STATUS })

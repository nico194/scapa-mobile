import {
    FETCH_CATEGORIES_PENDING,
    FETCH_CATEGORIES_ERROR,
    FETCH_CATEGORIES_SUCCESS,
    ADD_CATEGORY_SUCCESS,
    ADD_GROUP,
    ADD_CATEGORY_ERROR,
    UPDATE_CATEGORY_SUCCESS,
    UPDATE_CATEGORY_ERROR,
    DELETE_CATEGORY_SUCCESS,
    DELETE_GROUP,
    DELETE_CATEGORY_ERROR,
    CHANGED_STATUS,
    CATEGORIES_ASYNC_STORAGE,
    RESET_STATE
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

export const getCategories = () => {
    return async dispatch => {
        dispatch({ type: FETCH_CATEGORIES_PENDING });
        try {
            const categories = await getCategoriesFromAsyncStorage();
            return dispatch({ type: FETCH_CATEGORIES_SUCCESS, payload: { categories }});
        } catch (err) {
            console.log(err);
            return dispatch({ type: FETCH_CATEGORIES_ERROR, payload: {err}})
        }
    }
}

const getCategoriesFromAsyncStorage = async () => {
    try {
        const categories = await AsyncStorage.getItem(CATEGORIES_ASYNC_STORAGE);
        return JSON.parse(categories)
    } catch (error) {
        console.log(error)
    }
}

const setCategoriesInAsynStorage = async (categories) => {
    try {
        await AsyncStorage.setItem(CATEGORIES_ASYNC_STORAGE, JSON.stringify(categories));
        return;
    } catch (error) {
        console.log(error)
    }
}

export const addCategory = (categoryToAdd, { accessToken, client, uid }) => {
    return async dispatch => {
        dispatch({ type: FETCH_CATEGORIES_PENDING });
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid
        }}
        console.log('ass', categoryToAdd, { accessToken, client, uid })
        const categoryRequest = {
            custom_category: {
                description: categoryToAdd.description,
            }
        }
        try {
            const response = await axiosConfig.post('/v1/custom_categories', JSON.stringify(categoryRequest), headers );
            const category = { ...response.data.data, isCustom: true };
            const categories = await getCategoriesFromAsyncStorage();
            const newCategories = [ ...categories, category ];
            await setCategoriesInAsynStorage(newCategories);
            return dispatch({ type: ADD_CATEGORY_SUCCESS, payload: { categories: newCategories, category }})
        } catch (err) {
            console.log(err);
            return dispatch({ type: ADD_CATEGORY_ERROR, payload: {err}})
        }
    }
}

export const groupAdded = () => dispatch => dispatch({type: ADD_GROUP});

export const deleteCategory = (categoryToDelete, { accessToken, client, uid }) => {
    return async dispatch => {
        dispatch({ type: FETCH_CATEGORIES_PENDING });
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid
        }}
        try {
            const response = await axiosConfig.delete(`/v1/custom_categories/${categoryToDelete.id}`, headers);
            const category = { ...response.data.data, isCustom: true };
            const categories = await getCategoriesFromAsyncStorage();
            const categoriesFilter = categories.filter(cat => cat.id !== category.id);
            await setCategoriesInAsynStorage(categoriesFilter);
            return dispatch({ type: DELETE_CATEGORY_SUCCESS, payload: { categories: categoriesFilter, category }});
        } catch (err) {
            console.log(err);
            return dispatch({ type: DELETE_CATEGORY_ERROR, payload: {err}});
        }
    }
}

export const groupDeleted = () => dispatch => dispatch({type: DELETE_GROUP});

export const updateCategory = (categoryToUpdate, { accessToken, client, uid }) => {
    return async dispatch => {
        dispatch({ type: FETCH_CATEGORIES_PENDING });
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid
        }}
        const categoryRequest = {
            custom_category: {
                description: categoryToUpdate.description,
            }
        }
        try {
            const response = await axiosConfig.put(`/v1/custom_categories/${categoryToUpdate.id}`, JSON.stringify(categoryRequest), headers);
            const category = { ...response.data.data, isCustom: true };
            console.log('category: ', category)
            const categoriesSaved = await getCategoriesFromAsyncStorage();
            const categories = categoriesSaved.map( cat => cat.id === category.id ? { ...cat, attributes:  { description : category.attributes.description } } : cat );
            await setCategoriesInAsynStorage(categories);
            return dispatch({ type: UPDATE_CATEGORY_SUCCESS, payload: { categories, category }})
        } catch (err) {
            console.log(err);
            return dispatch({ type: UPDATE_CATEGORY_ERROR, payload: {err}})
        }
    }
}

export const changedStatusCategory = () => dispatch => dispatch({ type: CHANGED_STATUS });

export const emptyCategories = () => {
    return async dispatch => {
        try {
            await setCategoriesInAsynStorage([]);
            return dispatch({ type: RESET_STATE })
        } catch (err) {
            console.log(err);
            return dispatch({ type: FETCH_CATEGORIES_ERROR, payload: {err}})
        }
    }
}

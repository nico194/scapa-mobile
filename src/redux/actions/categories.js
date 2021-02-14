import {
    FETCH_CATEGORIES_PENDING,
    FETCH_CATEGORIES_ERROR,
    FETCH_CATEGORIES_SUCCESS,
    ADD_CATEGORY_SUCCESS,
    ADD_CATEGORY_ERROR,
    UPDATE_CATEGORY_SUCCESS,
    UPDATE_CATEGORY_ERROR,
    DELETE_CATEGORY_SUCCESS,
    DELETE_CATEGORY_ERROR
    } from '../constants/categories';
import axiosConfig from '../../configs/axios'

export const getCategoriesAdmin = ({ accessToken, client, uid }) => {
    return async dispatch => {
        dispatch({ type: FETCH_CATEGORIES_PENDING });
        console.log('access: ', accessToken, client, uid)
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid
        }}
        
        try {
            const response = await axiosConfig.get(`/admin/categories?per_page=999`, headers);
            console.log('response', response)
        } catch (err) {
            console.log(err);
            return dispatch({ type: FETCH_CATEGORIES_ERROR, payload: {err}})
        }
        // 
        //     .then( response =>
        //         dispatch({
        //             type: FETCH_CATEGORIES_SUCCESS,
        //             payload: {
        //                 categories: response.data.data,
        //             }
        //         })
        //     )
        //     .catch( err => dispatch({ type: FETCH_CATEGORIES_ERROR, payload: {err}}));
    }
}

export const getCategoriesCustom = ({ accessToken, client, uid }) => {
    return dispatch => {
        dispatch({ type: FETCH_CATEGORIES_PENDING });
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid
        }}
        axiosConfig.get(`/admin/categories?per_page=999`, headers )
            .then( response =>
                dispatch({
                    type: FETCH_CATEGORIES_SUCCESS,
                    payload: {
                        categories: response.data.data,
                    }
                })
            )
            .catch( err => dispatch({ type: FETCH_CATEGORIES_ERROR, payload: {err}}));
    }
}


export const addCategory = (categoryDescription, { accessToken, client, uid }) => {
    return dispatch => {
        dispatch({ type: FETCH_CATEGORIES_PENDING });
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid
        }}
        const category = {
            category: {
                description: categoryDescription.attributes.description
            }
        }
        axiosConfig.post('/admin/categories', JSON.stringify(category), headers )
            .then( response => dispatch({ type: ADD_CATEGORY_SUCCESS, payload: {category: response.data.data}}))
            .catch( err => dispatch({ type: ADD_CATEGORY_ERROR, payload: {err}}));
    }
}

export const deleteCategory = (id, { accessToken, client, uid }) => {
    return dispatch => {
        dispatch({ type: FETCH_CATEGORIES_PENDING });
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid
        }}
        axiosConfig.delete(`/admin/categories/${id}`, headers )
            .then( response => dispatch({ type: DELETE_CATEGORY_SUCCESS, payload: {category: response.data.data}}))
            .catch( err => dispatch({ type: DELETE_CATEGORY_ERROR, payload: {err}}));
    }
}

export const updateCategory = (categoryToUpdate, { accessToken, client, uid }) => {
    return dispatch => {
        dispatch({ type: FETCH_CATEGORIES_PENDING });
        const headers = {
            headers: {
                'access-token': accessToken,
                client,
                uid
            }
        }
        const category = {
            category: {
                description: categoryToUpdate.attributes.description
            }
        }
        axiosConfig.put(`/admin/categories/${categoryToUpdate.id}`, JSON.stringify(category), headers)
            .then( response => dispatch({ type: UPDATE_CATEGORY_SUCCESS, payload: {category: response.data.data}}))
            .catch( err => dispatch({ type: UPDATE_CATEGORY_ERROR, payload: {err}}));
    }
}

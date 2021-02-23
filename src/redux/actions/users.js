import {
    USER_PENDING,
    AUTH_ERROR,
    AUTH_SUCCESS,
    USER_IS_LOGGED,
    USER_IS_NOT_LOGGED,
    AUTH_CONFIG,
    USER_LOGOUT,
    USER_ASYNC_STORAGE
} from '../constants/users';
import axiosConfig from '../../configs/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PICTOGRAMS_ASYNC_STORAGE } from '../constants/pictograms';
import { CATEGORIES_ASYNC_STORAGE } from '../constants/categories';

export const isLoggedAction = () => {
    return async dispatch => {
        dispatch({ type: USER_PENDING });
        try {
            const userInAsync = await AsyncStorage.getItem(USER_ASYNC_STORAGE);
            if(userInAsync) {
                const user = JSON.parse(userInAsync);
                return Object.keys(user).length > 0 ? dispatch({ type: USER_IS_LOGGED, payload: {user} }) : dispatch({ type: USER_IS_NOT_LOGGED });
            } else {
               return dispatch({ type: USER_IS_NOT_LOGGED })
            }
        } catch (error) {
            console.log(error)
            return dispatch({ type: AUTH_ERROR, payload: {error: error.response}})
        }
    }
}

export const authenticationUser = (user, route = '', config = false) => {
    return async dispatch => {
        dispatch({ type: USER_PENDING });     
        try {
            const response = await axiosConfig.post(`/v1/auth${route}`, JSON.stringify(user));
            const { id, email } = response.data.data;
            const { client, uid } = response.headers;
            const accessToken = response.headers['access-token'];
            const userToSave = { id, email, client, uid, accessToken };
            await AsyncStorage.setItem(USER_ASYNC_STORAGE, JSON.stringify(userToSave))
            return config ? dispatch({ type: AUTH_CONFIG, payload: { canConfig: true } }) : dispatch({ type: AUTH_SUCCESS, payload: {user: userToSave} });
        } catch (error) {
            console.log(error);
            return dispatch({ type: AUTH_ERROR, payload: {error: error.response}})
        }
    }
}

export const returnToHomeAction = () => dispatch => dispatch({type: AUTH_CONFIG, payload: { canConfig: false } }) 

export const getVoiceStatus = () => {
    
}

export const logOut = () => {
    return async dispatch => {
        dispatch({ type: USER_PENDING });  
        try {
            await AsyncStorage.setItem(USER_ASYNC_STORAGE, JSON.stringify({}))
            await AsyncStorage.setItem(PICTOGRAMS_ASYNC_STORAGE, JSON.stringify({}))
            await AsyncStorage.setItem(CATEGORIES_ASYNC_STORAGE, JSON.stringify({}))
            return dispatch({ type: USER_LOGOUT, payload: { user: {} } })
        } catch (error) {
            console.log(error);
            return dispatch({ type: AUTH_ERROR, payload: {error: error.response}})
        }   
    }
}


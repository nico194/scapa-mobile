import {
    USER_PENDING,
    AUTH_ERROR,
    AUTH_SUCCESS,
    USER_IS_LOGGED,
    USER_IS_NOT_LOGGED,
    INIT_HOME,
    PASSWORD_VERIFIED,
    USER_LOGOUT,
    USER_ASYNC_STORAGE
} from '../constants/users';
import axiosConfig from '../../configs/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const isUserLogged = () => {
    return async dispatch => {
        dispatch({ type: USER_PENDING });
        try {
            const user = await AsyncStorage.getItem(USER_ASYNC_STORAGE);
            if(user !== null && Object.keys(JSON.parse(user)).length) {
                return dispatch({ type: USER_IS_LOGGED, payload: { user } })
            } else {
                return dispatch({ type: USER_IS_NOT_LOGGED })
            }
        } catch (error) {
            console.log(error);
            return dispatch({ type: AUTH_ERROR, payload: {error: error.response}})
        }
    }    
}

export const authenticationUser = (user, route = '') => {
    return async dispatch => {
        dispatch({ type: USER_PENDING });     
        try {
            const response = await axiosConfig.post(`/v1/auth${route}`, JSON.stringify(user));
            const { id, email } = response.data.data;
            const { client, uid } = response.headers;
            const accessToken = response.headers['access-token'];
            const userToSave = { id, email, client, uid, accessToken };
            await AsyncStorage.setItem(USER_ASYNC_STORAGE, JSON.stringify(userToSave))
            return dispatch({ type: AUTH_SUCCESS, payload: {user: {id, email, client, uid, accessToken}} });
        } catch (error) {
            console.log(error);
            return dispatch({ type: AUTH_ERROR, payload: {error: error.response}})
        }
    }
}

export const initHome = () => dispatch => dispatch({ type: INIT_HOME })

export const verifyPassword = ( password ) => {
    return async dispatch => {
        dispatch({ type: USER_PENDING });
        try {
            const user = await AsyncStorage.getItem(USER_ASYNC_STORAGE);
            const email = JSON.parse(user).email;
            const response = await axiosConfig.post(`/v1/auth/sign_in`, JSON.stringify({ email, password }));
            return response.status === 200 && dispatch({ type: PASSWORD_VERIFIED })
        } catch (error) {
            console.log(error);
            return dispatch({ type: AUTH_ERROR, payload: {error: error.response}})
        }
    }
}

export const logOutUser = () => {
    return async dispatch => {
        dispatch({ type: USER_PENDING });  
        try {
            await AsyncStorage.setItem(USER_ASYNC_STORAGE, JSON.stringify({}))
            return dispatch({ type: USER_LOGOUT })
        } catch (error) {
            console.log(error);
            return dispatch({ type: AUTH_ERROR, payload: {error: error.response}});
        }   
    }
}

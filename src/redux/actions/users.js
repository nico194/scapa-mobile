import {
    USER_PENDING,
    AUTH_ERROR,
    AUTH_SUCCESS,
    USER_LOGOUT,
    USER_ASYNC_STORAGE
} from '../constants/users';
import axiosConfig from '../../configs/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authenticationUser = (user, route = '') => {
    return async dispatch => {
        dispatch({ type: USER_PENDING});      
        try {
            const response = await axiosConfig.post(`/v1/auth${route}`, JSON.stringify(user));
            const { id, email } = response.data.data;
            const { client, uid } = response.headers;
            const accessToken = response.headers['access-token'];
            const userToSave = { id, email, client, uid, accessToken };
            await AsyncStorage.setItem(USER_ASYNC_STORAGE, JSON.stringify(userToSave))
            return dispatch({ type: AUTH_SUCCESS, payload: {user: userToSave} });
        } catch (error) {
            return dispatch({ type: AUTH_ERROR, payload: {error: error.response}})
        }
    }
}

export const logOut = () => {
    return dispatch => {
        // localStorage.setItem('user', JSON.stringify({}))
        dispatch({ type: USER_LOGOUT, payload: { user: {} } })
    }
}


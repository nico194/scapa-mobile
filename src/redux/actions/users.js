import {
    USER_PENDING,
    AUTH_ERROR,
    AUTH_SUCCESS,
    CLEAN_ERROR,
    USER_IS_LOGGED,
    USER_IS_NOT_LOGGED,
    GET_USER,
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

export const getUserFromAsyncStorage = () => {
    return async dispatch => {
        dispatch({ type: USER_PENDING });
        try {
            const user = await AsyncStorage.getItem(USER_ASYNC_STORAGE);
            return dispatch({ type: GET_USER, payload: { user: JSON.parse(user) } })
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
            const headers = { headers: {
                'access-token': accessToken,
                client,
                uid
            }}
            const responsefolder = await axiosConfig.get('/v1/folder', headers);
            const voice = responsefolder.data.data.attributes.enable_voice_playback;
            const userToSave = { id, email, client, uid, accessToken, voice };
            console.log('user: ', userToSave)
            await AsyncStorage.setItem(USER_ASYNC_STORAGE, JSON.stringify(userToSave))
            return dispatch({ type: AUTH_SUCCESS, payload: {user: {id, email, client, uid, accessToken, voice}} });
        } catch (error) {
            console.log(error);
            return dispatch({ type: AUTH_ERROR, payload: {error: error.response}})
        }
    }
}

export const cleanError = () => dispatch => dispatch({ type: CLEAN_ERROR });

export const initHome = () => dispatch => dispatch({ type: INIT_HOME });

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

export const updateVoiceStatus = (newVoiceStatus, { accessToken, client, uid }) => {
    return async dispatch => { 
        dispatch({ type: USER_PENDING });
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid
        }}
        const requestVoice = {
            folder: {
                enable_voice_playback: newVoiceStatus
            }
        }
        try {
            const response = await axiosConfig.put('/v1/folder', JSON.stringify(requestVoice), headers);
            console.log('res: ', response)
            const voice = response.data.data.attributes.enable_voice_playback;
            const userInAsyncStorage = await AsyncStorage.getItem(USER_ASYNC_STORAGE);
            const user = JSON.parse(userInAsyncStorage);
            user.voice = voice;
            console.log('user: ', user)
            await AsyncStorage.setItem(USER_ASYNC_STORAGE, JSON.stringify(user));
            return dispatch({ type: AUTH_SUCCESS, payload: { user }});
        } catch (error) {
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

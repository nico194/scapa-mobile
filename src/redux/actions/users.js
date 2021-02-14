import {
    USER_PENDING,
    AUTH_ERROR,
    AUTH_SUCCESS,
    USER_LOGOUT
} from '../constants/users';
import axiosConfig from '../../configs/axios';
import User from '../../model/User'

export const authenticationUser = (user, route = '') => {
    return async dispatch => {
        dispatch({ type: USER_PENDING});      
        try {
            const response = await axiosConfig.post(`/v1/auth${route}`, JSON.stringify(user));
            const { id, email } = response.data.data;
            const { client, uid } = response.headers;
            const accessToken = response.headers['access-token'];
            let userToSave;
            const existUser = new User(id, email);
            const userExist = await existUser.getUser(id);
            if (userExist !== {})  {
                existUser.setAccessToken(accessToken);
                existUser.setClient(client);
                existUser.setUid(uid);
                userToSave = existUser;
                await existUser.update()
            } else {
                const newUser = new User( id, email, accessToken, client, uid);
                userToSave = newUser;
                await newUser.save();
            }
            return dispatch({ type: AUTH_SUCCESS, payload: {user: userToSave} });
        } catch (error) {
            console.log('error in action', error)
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


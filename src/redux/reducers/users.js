import {
    USER_PENDING,
    AUTH_ERROR,
    AUTH_SUCCESS,
    USER_LOGOUT,
    AUTH_CONFIG,
    USER_IS_LOGGED,
    USER_IS_NOT_LOGGED
} from '../constants/users';
 
const initialState = {
    loadingUser: false,
    error: null,
    user: {},
    isLogged: false,
    canConfig: false,
}

const usersReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case USER_PENDING:{
            return {
                ...state,
                loadingUser: true
            }
        }
        case AUTH_ERROR: {
            return {
                ...state,
                loadingUser: false,
                error: payload.error
            }
        }
        case USER_IS_LOGGED:
            return {
                ...state,
                loadingUser: false,
                isLogged: true,
                user: payload.user,
                canConfig: false
            }
        case USER_IS_NOT_LOGGED:
            return {
                ...state,
                loadingUser: false,
                isLogged: false,
                canConfig: false
            }
        case AUTH_SUCCESS: 
            return {
                ...state,
                loadingUser: false,
                user: payload.user,
                isLogged: true,
                canConfig: false
            } 
        case AUTH_CONFIG: 
            return {
                ...state,
                loadingUser: false,
                canConfig: payload.canConfig                                                                                                                                                                                                                                       ,
            } 
        case USER_LOGOUT:
            return {
                ...state,
                user: {},
                loadingUser: false,
                isLogged: false
            }
        default:
            return state
    }
}

export default usersReducer;
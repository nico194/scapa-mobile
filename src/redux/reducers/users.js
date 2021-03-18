import {
    USER_PENDING,
    AUTH_ERROR,
    AUTH_SUCCESS,
    CLEAN_ERROR,
    USER_LOGOUT,
    INIT_HOME,
    PASSWORD_VERIFIED,
    USER_IS_LOGGED,
    USER_IS_NOT_LOGGED,
    GET_USER
} from '../constants/users';
 
const initialState = {
    loadingUser: false,
    error: null,
    user: {},
    isLogged: false,
    canConfig: false,
    isFirstTime: false
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
        case GET_USER:
            return {
                ...state,
                loadingUser: false,
                user: payload.user
            }
        case AUTH_SUCCESS: 
            return {
                ...state,
                loadingUser: false,
                user: payload.user,
                isFirstTime: true,
                error: null
            } 
        case PASSWORD_VERIFIED: 
            return {
                ...state,
                loadingUser: false,
                canConfig: true,
                error: null                                                                                                                                                                                                                                      ,
            } 
        case INIT_HOME: {
            return {
                ...state,
                canConfig: false
            }
        }
        case CLEAN_ERROR: {
            return {
                ...state,
                error: null
            }
        }
        case USER_LOGOUT:
            return state = initialState;
        default:
            return state
    }
}

export default usersReducer;
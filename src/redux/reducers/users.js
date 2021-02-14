import {
    USER_PENDING,
    AUTH_ERROR,
    AUTH_SUCCESS,
    USER_LOGOUT
} from '../constants/users';


// const regExp = new RegExp(`^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$`);
// const isBase64 = localStorage.getItem('user') !== null ? regExp.test(localStorage.getItem('user')) : false;
 
const initialState = {
    loading: false,
    user: {},
    auth: false,
    error: null
}

const UsersReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case USER_PENDING:{
            return {
                ...state,
                loading: true
            }
        }
        case AUTH_ERROR: {
            return {
                ...state,
                loading: false,
                error: payload.error
            }
        }
        case AUTH_SUCCESS: 
            return {
                ...state,
                loading: false,
                user: payload.user,
                auth: true,
            } 
        case USER_LOGOUT:
            return {
                ...state,
                user: {}
            }
        default:
            return state
    }
}

export default UsersReducer;
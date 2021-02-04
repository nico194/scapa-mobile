import {
    FETCH_USERS_PENDING,
    USER_ERROR,
    USER_SIGNIN_SUCCESS,
    USER_SIGNUP_SUCCESS,
    USER_LOGOUT
} from '../constants/users'


// const regExp = new RegExp(`^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$`);
// const isBase64 = localStorage.getItem('user') !== null ? regExp.test(localStorage.getItem('user')) : false;
 
const initialState = {
    loading: false,
    user: {},
    auth: false,
    err: null
}

const UsersReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case FETCH_USERS_PENDING:{
            return {
                ...state,
                loading: true
            }
        }
        case USER_ERROR: {
            return {
                ...state,
                loading: false,
                err: payload.err
            }
        }
        case USER_SIGNIN_SUCCESS:
        case USER_SIGNUP_SUCCESS: 
            return {
                ...state,
                loading: false,
                user: payload.user,
                auth: true
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
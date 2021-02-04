import { combineReducers } from 'redux';
import categoriesReducer from './categories';
import pictogramsReducer from './pictograms';
import UsersReducer from './users';
import routinesReducer from './routines';

const rootReducer = combineReducers({
    categories: categoriesReducer,
    pictograms: pictogramsReducer,
    users: UsersReducer,
    routines: routinesReducer
});

export default rootReducer;
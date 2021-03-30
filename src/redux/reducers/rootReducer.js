import { combineReducers } from 'redux';
import categoriesReducer from './categories';
import pictogramsReducer from './pictograms';
import usersReducer from './users';
import phrasesReducer from './phrases';

const rootReducer = combineReducers({
    categories: categoriesReducer,
    pictograms: pictogramsReducer,
    users: usersReducer,
    phrases: phrasesReducer,
});

export default rootReducer;
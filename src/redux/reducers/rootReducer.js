import { combineReducers } from 'redux';
import categoriesReducer from './categories';
import pictogramsReducer from './pictograms';
import UsersReducer from './users';
import phrasesReducer from './phrases';

const rootReducer = combineReducers({
    categories: categoriesReducer,
    pictograms: pictogramsReducer,
    users: UsersReducer,
    phrasesReducer: phrasesReducer
});

export default rootReducer;
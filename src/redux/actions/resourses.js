import {
    LOADING_RESOURSES,
    GET_RESOURSES_ERROR,
    GET_RESOURSES,
    NO_GET_RESOURSES
} from '../constants/resourses';
import { CATEGORIES_ASYNC_STORAGE } from '../constants/categories';
import { PICTOGRAMS_ASYNC_STORAGE } from '../constants/pictograms';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkResources = () => {
    return async dispatch => {
        dispatch({ type: LOADING_RESOURSES });
        try {
            return await askResourseStatus() ? dispatch({ type: NO_GET_RESOURSES }) : dispatch({ type: GET_RESOURSES });
        } catch (error) {
            console.log(error)
            return dispatch({ type: GET_RESOURSES_ERROR, payload: { error }});
        }
    }
}

const askResourseStatus = async () => {
    const categories = await AsyncStorage.getItem(CATEGORIES_ASYNC_STORAGE);
    const pictograms = await AsyncStorage.getItem(PICTOGRAMS_ASYNC_STORAGE);
    const hasResourses = JSON.parse(categories).length > 0 && JSON.parse(pictograms).length > 0
    return hasResourses
}
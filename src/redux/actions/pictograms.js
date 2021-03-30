import {
    FETCH_PICTOGRAMS_PENDING,
    FETCH_PICTOGRAMS_ERROR,
    FETCH_PICTOGRAMS_SUCCESS,
    ADD_PICTOGRAM_SUCCESS,
    ADD_PICTOGRAM_ERROR,
    UPDATE_PICTOGRAM_SUCCESS,
    UPDATE_PICTOGRAM_ERROR,
    DELETE_PICTOGRAM_SUCCESS,
    DELETE_PICTOGRAM_ERROR,
    PICTOGRAMS_ASYNC_STORAGE,
    CHANGED_STATUS,
    RESET_STATE,
    GET_PICTOGRAMS
    } from '../constants/pictograms';
import axiosConfig from '../../configs/axios';
import { fileToBase64, donwloadAndSaveFile, deleteFile } from '../../configs/manageFiles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAllPictograms = ({ accessToken, client, uid }) => {
    return async dispatch => {
        dispatch({ type: FETCH_PICTOGRAMS_PENDING });        
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid
        }}
        let pictogramsGroupedByCategories = {};
        try {
            const defaultId = await getPictogramsFromAPI('pictograms', headers, pictogramsGroupedByCategories);
            console.log('default id: ', defaultId);
            const customId = await getPictogramsFromAPI('custom_pictograms', headers, pictogramsGroupedByCategories); 
            console.log('custom id: ', customId);
            const filterBy =  customId >= 0 ? `${customId}-custom` : `${defaultId}-default`;
            await AsyncStorage.setItem(PICTOGRAMS_ASYNC_STORAGE, JSON.stringify(pictogramsGroupedByCategories))
            return dispatch({ type: FETCH_PICTOGRAMS_SUCCESS, payload: { pictograms: pictogramsGroupedByCategories[filterBy].pictograms }});
        } catch (err) {
            console.log(err)
            return dispatch({ type: FETCH_PICTOGRAMS_ERROR, payload: {err}});
        }
    }
}

const getPictogramsFromAPI = async (source, headers, pictogramsGroupedByCategories) => {
    let band = true;
    let page = 1;
    let firstId = -1;
    try {
        while (band) {
            const response = await axiosConfig.get(`/v1/${source}?per_page=40&page=${page}`, headers);
            const { data, meta } = response.data;
            if(data.length > 0) {
                firstId = data[0].relationships.classifiable.data.id;
                const pictograms =  await savePictogramsImages(data);
                pictogramsGroupedByCategories = groupPictogramsByCategory(pictogramsGroupedByCategories, pictograms);
                band = !meta.is_last_page;
                page += 1;
            } else {
                band = false;
            }
        } 
    } catch (error) {
        console.log(error)
    }
    return firstId;
}

const savePictogramsImages = async (pictograms) => {
    let pics = [];
    try {
        pics = await Promise.all(pictograms.map(async (pictogram) => {
            const imageName = `${pictogram.attributes.description}-${ pictogram.attributes.is_custom ? 'custom' : 'default' }.png`;
            const uri =  pictogram.attributes.image_url ? await donwloadAndSaveFile(imageName, pictogram.attributes.image_url) : null;
            pictogram.image =  uri ;
            return pictogram;
        }));
    } catch (error) {
        console.log(error)
    }
    return pics;
}

const groupPictogramsByCategory = (pictogramsGroupedByCategories, pictograms) => {
    pictograms.forEach( pictogram => {
        const group = `${pictogram.relationships.classifiable.data.id}-${ pictogram.attributes.is_custom ? 'custom' : 'default' }`;
        if(!pictogramsGroupedByCategories.hasOwnProperty(group)) {
            pictogramsGroupedByCategories[group] = {
                pictograms: []
            }
        } 
        pictogramsGroupedByCategories[group].pictograms.push(pictogram);
    })

    return pictogramsGroupedByCategories;
}

export const filterPictogramsByCategory = (idCategory, isCustom) => {
    return async dispatch => {
        dispatch({ type: FETCH_PICTOGRAMS_PENDING });
        try {
            const category = `${idCategory}-${ isCustom ? 'custom' : 'default'}`;
            const pictograms = await getPictogramsByCategoryFromAsyncStorage(category);
            return dispatch({ type: FETCH_PICTOGRAMS_SUCCESS, payload: { pictograms }})
        } catch (error) {
            console.log(error);
            return dispatch({ type: FETCH_PICTOGRAMS_ERROR, payload: {error}});
        }
    }
}

const getPictogramsByCategoryFromAsyncStorage = async (category) => {
    try {
        const pics = await AsyncStorage.getItem(PICTOGRAMS_ASYNC_STORAGE);
        const pictogramsByCategory = JSON.parse(pics);
        let pictograms = [];
        if(pictogramsByCategory[category] !== undefined) {
            pictograms = pictogramsByCategory[category].pictograms
        } else {
            pictogramsGroupedByCategories[category] = {
                pictograms: []
            };
            await setPictogramsFromAsyncStorage(pictogramsGroupedByCategories)
        }
        return pictograms;        
    } catch (error) {
        console.log('get pictograms in category: ', error);
    }
}

const setPictogramsByCategoryIntoAsyncStorage  = async (pictograms, category) => {
    try {

        console.log(pictograms, category)
        const pictogramsGroupedByCategory = await getPictogramsFromAsyncStorage();
        pictogramsGroupedByCategory[category].pictograms = pictograms;
        await AsyncStorage.setItem(PICTOGRAMS_ASYNC_STORAGE, JSON.stringify(pictogramsGroupedByCategory));
    } catch (error) {
        console.log('saved async storage', error);
    }
}

const getPictogramsFromAsyncStorage = async () => {
    try {
        const pics = await AsyncStorage.getItem(PICTOGRAMS_ASYNC_STORAGE);
        return JSON.parse(pics);       
    } catch (error) {
        console.log(error);
    }
}

const setPictogramsFromAsyncStorage = async (pictograms) => {
    try {
        await AsyncStorage.setItem(PICTOGRAMS_ASYNC_STORAGE, JSON.stringify(pictograms));
        return;       
    } catch (error) {
        console.log(error);
    }
}

export const addKeyIntoPictograms = (category) => {
    return async dispatch => {
        try {
            const cat = `${category.id}-custom`;
            const pictogramsByCategory = await getPictogramsFromAsyncStorage();
            const newPictogramsByCategory = Object.defineProperty(pictogramsByCategory, cat, { value: { pictograms: [] }, enumerable: true, configurable: true, writable: true})
            await setPictogramsFromAsyncStorage(newPictogramsByCategory)
            const pictograms = newPictogramsByCategory[cat].pictograms;
            return dispatch({ type: GET_PICTOGRAMS, payload: { pictograms }})
        } catch (err) {
            console.log(err)
            return dispatch({ type: FETCH_PICTOGRAMS_ERROR, payload: {err}});
        }
    }
}

export const deleteKeyIntoPictograms =  (category) => {
    return async dispatch => {
        try {
            const cat = `${category.id}-custom`;
            const pictogramsByCategory = await getPictogramsFromAsyncStorage();
            delete pictogramsByCategory[cat];
            await setPictogramsFromAsyncStorage(pictogramsByCategory);
            return dispatch({ type: GET_PICTOGRAMS, payload: { pictograms: [] }})
        } catch (err) {
            console.log(err)
            return dispatch({ type: FETCH_PICTOGRAMS_ERROR, payload: {err}});
        }
    }
}

export const addPictogram = (pictogramToAdd , { accessToken, client, uid }) => {
    return async dispatch => {
        dispatch({ type: FETCH_PICTOGRAMS_PENDING });
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid,
        }};
        try {
            const imageInBase64 = await fileToBase64(pictogramToAdd.image)
            const filename = `${pictogramToAdd.description}-custom.png`;
            const pictogram = {
                custom_pictogram: {
                    description: pictogramToAdd.description,
                    classifiable_id: pictogramToAdd.idCategory,
                    image: {
                        data: imageInBase64,
                        filename
                    }
                }
            };
            const response = await axiosConfig.post('/v1/custom_pictograms', JSON.stringify(pictogram), headers);
            const uri = await donwloadAndSaveFile(filename, response.data.data.attributes.image_url);
            const pictogramResponsed = { ...response.data.data, image: uri };
            const category = `${pictogramToAdd.idCategory}-custom`;
            const pictogramsByCategory = await getPictogramsByCategoryFromAsyncStorage(category);
            const pictograms = [ ...pictogramsByCategory, pictogramResponsed ]
            await setPictogramsByCategoryIntoAsyncStorage(pictograms, category)
            return dispatch({ type: ADD_PICTOGRAM_SUCCESS, payload: { pictograms }});
        } catch (err) {
            console.log(err);
            return dispatch({ type: ADD_PICTOGRAM_ERROR, payload: {err}});
        }
    }
}

export const deletePictogram = (pictogramToDelete, { accessToken, client, uid }) => {
    return async dispatch => {
        dispatch({ type: FETCH_PICTOGRAMS_PENDING });
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid
        }};
        try {
            const response = await axiosConfig.delete(`/v1/custom_pictograms/${pictogramToDelete.id}`, headers )
            console.log('pictogram deleted', response)
            await deleteFile(pictogramToDelete.image);
            const category = `${response.data.data.relationships.classifiable.data.id}-custom`
            const pictograms = await getPictogramsByCategoryFromAsyncStorage(category);
            const pictogramsFiltered = pictograms.filter(pic => pic.id !== response.data.data.id);
            await setPictogramsByCategoryIntoAsyncStorage(pictogramsFiltered, category);
            return dispatch({ type: DELETE_PICTOGRAM_SUCCESS, payload: { pictograms: pictogramsFiltered }})
        } catch (err) {
            console.log(err);
            return dispatch({ type: DELETE_PICTOGRAM_ERROR, payload: {err}})
        }
    }
}

export const updatePictogram = (pictogramToUpdate, { accessToken, client, uid }) => {
    return async dispatch => {
        dispatch({ type: FETCH_PICTOGRAMS_PENDING });
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid,
        }};
        try {
            const imageInBase64 = await fileToBase64(pictogramToUpdate.image);
            const filename = `${pictogramToUpdate.description}-custom.png`;
            const oldImage = pictogramToUpdate.oldImage;
            const pictogram = {
                custom_pictogram: {
                    description: pictogramToUpdate.description,
                    classifiable_id: pictogramToUpdate.idCategory,
                    image: {
                        data: imageInBase64,
                        filename
                    }
                }
            };
            const response = await axiosConfig.put(`/v1/custom_pictograms/${pictogramToUpdate.id}`, JSON.stringify(pictogram), headers);
            await deleteFile(oldImage);
            const uri = await donwloadAndSaveFile(filename, response.data.data.attributes.image_url)
            const pictogramResponsed = { ...response.data.data, image: uri };
            const category = `${pictogramResponsed.relationships.classifiable.data.id}-custom`
            const pictograms = await getPictogramsByCategoryFromAsyncStorage(category);
            const pictogramsUpdated = pictograms.map(pic => 
                pic.id === pictogramResponsed.id ?
                    {
                        ...pic,
                        attributes: {
                            description: pictogramResponsed.attributes.description,
                            image_url: pictogramResponsed.attributes.image_url
                        },
                        image: pictogramResponsed.image
                    }
                    :
                    pic
            )
            await setPictogramsByCategoryIntoAsyncStorage(pictogramsUpdated, category);
            return dispatch({ type: UPDATE_PICTOGRAM_SUCCESS, payload: { pictograms: pictogramsUpdated }});
        } catch (err) {
            console.log(err);
            return dispatch({ type: UPDATE_PICTOGRAM_ERROR, payload: {err}});
        }
    }
}

export const changedStatusPictogram = () => dispatch => dispatch({ type: CHANGED_STATUS })

export const emptyPictograms = () => {
    return async dispatch => {
        try {
            await AsyncStorage.setItem(PICTOGRAMS_ASYNC_STORAGE, JSON.stringify({}))
            return dispatch({ type: RESET_STATE })
        } catch (error) {
            console.log(error)
        }
    }
}
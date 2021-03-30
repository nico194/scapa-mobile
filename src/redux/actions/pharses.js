import {
    FETCH_PHRASES_PENDING,
    FETCH_PHRASES_ERROR,
    FETCH_PHRASES_SUCCESS,
    ADD_PHRASE_SUCCESS,
    ADD_PHRASE_ERROR,
    UPDATE_PHRASE_SUCCESS,
    UPDATE_PHRASE_ERROR,
    DELETE_PHRASE_SUCCESS,
    DELETE_PHRASE_ERROR,
    ADD_PICTOGRAM_TO_PHRASE,
    REMOVE_PICTOGRAM_TO_PHRASE,
    PHRASES_ASYNC_STORAGE,
    RESET_STATE
} from '../constants/phrases';
import axiosConfig from '../../configs/axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkIfFileExist, donwloadAndSaveFile } from '../../configs/manageFiles';

export const getAllPhrases = ({ accessToken, client, uid }) => {
    return async dispatch => {
        dispatch({ type: FETCH_PHRASES_PENDING})
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid
        }}
        try {
            const routines = await getPhrasesFromAPI('routines', headers);
            const remembrances = await getPhrasesFromAPI('remembrances', headers);
            const phrases = [ ...routines, ...remembrances ];
            console.log('phs: ', phrases)
            await setPhrasesFromAsyncStorage(phrases);
            return dispatch({ type: FETCH_PHRASES_SUCCESS, payload: { phrases } })
        } catch (err) {
            console.log(err);
            return dispatch({ type: FETCH_PHRASES_ERROR, payload: { err } })
        }
    }
}

export const getPhrasesFromAPI = async (source, headers) => {
    let phrases = [];
    try {
        const response = await axiosConfig.get(`/v1/${source}`, headers);
        console.log(`resp ${source}:`, response.data)
        const { data } = response.data;
        if(data.length > 0) {
            phrases = await Promise.all(data.map( async phrase => {
                const id = phrase.id;
                const type = phrase.type;
                const description = phrase.attributes.description;
                const pictograms = await getPictogramsFromAPhrase(phrase, headers)
                console.log('pics from phrase: ', pictograms);
                return {
                    id,
                    type,
                    description,
                    pictograms
                }
            }));
        }
        console.log('phrases', phrases);
    } catch (error) {
        console.log(error)
    }
    return phrases
};

const getPictogramsFromAPhrase = async (phrase, headers) => {
    let pictograms = []
    try {
        pictograms = await Promise.all(phrase.relationships.pictograms.data.map(async pictogram => {
            const pictogramInPhrase = await getPictogramInPhrase(pictogram.id, headers);
            return pictogramInPhrase
        }))
    } catch (error) {
        console.log(error)
    }
    return pictograms;
}

const getPictogramInPhrase = async (id, headers) => {
    let response;
    let pictogram;
    try {
        response = await axiosConfig.get(`/v1/pictograms/${id}`, headers);
        console.log('response pic:', response.data.data)
    } catch (error) {
        console.log('err', error.response.status)
        response = error.response.status
    } finally {
        if(response === 404) {
            response = await axiosConfig.get(`/v1/custom_pictograms/${id}`, headers);
            console.log('response custom pic:', response.data.data)
        } 
        pictogram = await getPictogramWithImage(response.data.data);
    }
    return pictogram
}


const getPictogramWithImage = async (pictogram) => {
    let pic;
    try {
        const imageName = `${pictogram.attributes.description}-${ pictogram.attributes.is_custom ? 'custom' : 'default' }.png`;
        const { exists, uri } = await checkIfFileExist(imageName);
        let uriImage = !exists ? await donwloadAndSaveFile(imageName, pictogram.attributes.image_url) : uri
        const pictogramSaved = { ...pictogram, image: uriImage };
        pic = pictogramSaved;
    } catch (error) {
        console.log(error)
    }
    return pic;
}

export const getPhrases = () => {
    return async dispatch => {
        dispatch({ type: FETCH_PHRASES_PENDING});
        try {
            const phrases = await getPhrasesFromAsyncStorage();
            console.log('phs:', phrases)
            return dispatch({ type: FETCH_PHRASES_SUCCESS, payload: { phrases } });
        } catch (err) {
            console.log(err);
            return dispatch({ type: FETCH_PHRASES_ERROR, payload: { err } });
        }

    }
} 

const getPhrasesFromAsyncStorage = async () => {
    try {
        const phrasesInAsyncStorage = await AsyncStorage.getItem(PHRASES_ASYNC_STORAGE)
        return phrasesInAsyncStorage ? JSON.parse(phrasesInAsyncStorage) : []
    } catch (error) {
        console.log(error)
    }
}

const setPhrasesFromAsyncStorage = async (phrases) => {
    try {
        await AsyncStorage.setItem(PHRASES_ASYNC_STORAGE, JSON.stringify(phrases))
    } catch (error) {
        console.log(error)
        
    }
}

export const addPhrase = (phraseToAdd, { accessToken, client, uid } ) => {
    return async dispatch => {
        dispatch({ type: FETCH_PHRASES_PENDING})
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid
        }}
        const phraseRequest = {
            remembrance: {
              description: phraseToAdd.description,
              pictogram_ids: phraseToAdd.pictograms.map(pictogram => pictogram.id)
            }
        }
        try {
            const response = await axiosConfig.post('/v1/remembrances', JSON.stringify(phraseRequest), headers);
            const phrase = { ...phraseToAdd, id: response.data.data.id, type: response.data.data.type }
            const phrasesInAsyncStorage = await getPhrasesFromAsyncStorage();
            const phrases = [ ...phrasesInAsyncStorage, phrase ]
            await setPhrasesFromAsyncStorage(phrases)
            return dispatch({ type: ADD_PHRASE_SUCCESS, payload: { phrases } });
        } catch (err) {
            console.log(err)
            return dispatch({ type: ADD_PHRASE_ERROR, payload: { err }})
        }
    }
};

export const updatePhrase = ( phraseToEdit, { accessToken, client, uid} ) => {
    return dispatch => {
        dispatch({ type: UPDATE_PHRASE_SUCCESS, payload: {  } });
    }
}

export const deletePhrase = ( phraseToDelete, { accessToken, client, uid } ) => {
    return async dispatch => {
        dispatch({ type: FETCH_PHRASES_PENDING})
        const headers = { headers: {
            'access-token': accessToken,
            client,
            uid
        }}
        console.log(`/v1/remembrances/${phraseToDelete.id}`)
        try {
            const response = await axiosConfig.delete(`/v1/remembrances/${phraseToDelete.id}`, headers);
            const idPhraseEliminated = response.data.data.id;
            console.log('id Phrase:',idPhraseEliminated);
            const phrasesInAsyncStorage = await getPhrasesFromAsyncStorage();
            const phrases = phrasesInAsyncStorage.filter(phrase => phrase.id !== idPhraseEliminated);
            await setPhrasesFromAsyncStorage(phrases);
            return dispatch({ type: DELETE_PHRASE_SUCCESS, payload: { phrases } });
        } catch (err) {
            console.log(err)
            return dispatch({ type: FETCH_PHRASES_ERROR, payload: { err } })
        }
        
    }
}

export const addPictogramToPhrase = pictogram => dispatch => dispatch({ type: ADD_PICTOGRAM_TO_PHRASE, payload: { pictogram } })

export const removePictogramToPhrase = index => dispatch => dispatch({ type: REMOVE_PICTOGRAM_TO_PHRASE, payload: { index } })

export const emptyPhrases = () => {
    return async dispatch => {
        try {
            await setPhrasesFromAsyncStorage([]);
            return dispatch({ type: RESET_STATE })
        } catch (err) {
            console.log(err);
            return dispatch({ type: FETCH_PHRASES_ERROR, payload: {err}})
        }
    }
}
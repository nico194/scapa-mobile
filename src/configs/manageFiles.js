import * as FileSystem from 'expo-file-system';

const baseURL = 'https://scapa-backend-develop.herokuapp.com'

export const fileToBase64 = async (uri) => {
    try {
        const content = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 })
        const imageInBase64 = 'data:image/png;base64,' + content;
        return imageInBase64;
    } catch (e) {
        console.warn('fileToBase64()', e.message)
        return ''
    }
}

export const checkIfFileExist = async (filename) => {
    const dirInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + filename);
    return { exists: dirInfo.exists, uri: dirInfo.exists ? FileSystem.documentDirectory + filename : '' };
}

export const donwloadAndSaveFile = async (filename, fileRoute) => {
    const fileUri = FileSystem.documentDirectory + filename;
    const url = baseURL + fileRoute;

    let response = await FileSystem.downloadAsync(url, fileUri);
    return response.uri
}

export const deleteFile = async (uri) => {
    try {
        const dirInfo = await FileSystem.getInfoAsync(uri);
        if (dirInfo.exists) {
            await FileSystem.deleteAsync(uri);
        }
      } catch (error) {
        console.error(`ERROR: Expo Check Directory: ${downloadFilePath}`, error);
      }
}


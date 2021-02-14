import * as ScreenOrientation from 'expo-screen-orientation';

export const setOrientation = ( navigation, orientation ) => {

    const orient = orientation === 'landspace' ? ScreenOrientation.OrientationLock.LANDSCAPE : ScreenOrientation.OrientationLock.PORTRAIT

    navigation.addListener("focus", () => {
        ScreenOrientation.lockAsync(orient);
      });
  
      navigation.addListener("blur", () => {
        ScreenOrientation.lockAsync(orient);
      });
}
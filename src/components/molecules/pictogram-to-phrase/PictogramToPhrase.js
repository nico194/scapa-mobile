import React from 'react'
import { Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';

export default function PictogramToPhrase({ onPress, image }) {
    const { width, height } = Dimensions.get('screen');
    const imageButtonToSpeak = require('../../../../assets/speakButtonImage.png');
    const imageUri = image ? image : Image.resolveAssetSource(imageButtonToSpeak).uri;
    return (
        <TouchableOpacity onPress={onPress} style={styles.pictogram}>
            <Image source={{ uri: imageUri }} resizeMode='cover' style={{ width: width / 14, height: height / 9 }} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    pictogram: {
        padding: 10,
        marginRight: 15,
        backgroundColor: '#fff',
        borderRadius: 10
    }
});

import React from 'react'
import { Image, TouchableOpacity, Dimensions } from 'react-native'
import { Card, CardItem, Text } from 'native-base'

export default function Pictogram({ onPress, description, image }) {
    const { width, height } = Dimensions.get('screen');
    const imageUri = Image.resolveAssetSource(image).uri;
    return (
        <TouchableOpacity onPress={onPress}>
            <Card  style={{ width: width / 5, height: height / 3.2, marginLeft: 10, marginRight: 10, marginBottom: 10, alignItems: 'center', justifyContent: 'center'}}>
                <CardItem style={{ flexDirection: 'column'}}>
                    <Image source={{ uri: imageUri }} resizeMode='contain' style={{ borderColor: 'black', borderWidth: 2, width: width / 8, height: height / 5.3 , alignSelf: 'center', marginBottom: 10 }} />
                    <Text>{ description }</Text>
                </CardItem>
            </Card>
        </TouchableOpacity>
    )
}

import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, Dimensions, View, StyleSheet } from 'react-native';
import { Badge, Button, Card, CardItem, Text } from 'native-base';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

export default function Pictogram({ onPress, description, image, isCRUD, onUpdate, onDelete }) {
    
    const imageButtonToSpeak = require('../../../../assets/speakButtonImage.png');
    const imageDefault = Image.resolveAssetSource(imageButtonToSpeak).uri;
    const imageUri = image ? image : imageDefault ;
    const pictogramWidth = Dimensions.get('screen').width;
    const pictogramHeight = Dimensions.get('screen').height;
    
    const dimensionPic = () => {
        return {
            width: isCRUD ? pictogramWidth / 3.5 : pictogramWidth / 5, 
            height: isCRUD ? pictogramHeight / 5 : pictogramHeight / 3.2, 
            alignItems: 'center', 
            justifyContent: 'center',
            overflow: 'hidden'
        }
    }

    const dimensionImage = () => {
        return {
            width: isCRUD ? pictogramWidth / 5 : pictogramWidth / 8, 
            height: isCRUD ? pictogramHeight / 8 : pictogramHeight / 5,
        }
    }

    return (
        <View style={{ marginHorizontal: 5 }}>
            <View style={[!isCRUD ? { display: 'none' } : { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignSelf:'center', position: 'absolute', top: -20, elevation: 5 }]}>
                <Button onPress={onUpdate} transparent>
                    <Badge warning style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <MaterialCommunityIcons name='pencil-outline' color='#fff' size={20} />
                    </Badge>
                </Button>
                <Button onPress={onDelete} transparent>
                    <Badge danger on style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesome name='trash-o' color='#fff' size={20} />
                    </Badge>
                </Button>
            </View>
            <TouchableOpacity onPress={onPress} style={{ elevation: 4 }}>
                <Card style={dimensionPic()}>
                    <CardItem style={{ flexDirection: 'column' }}>
                        <Image source={{ uri: imageUri }} resizeMode='cover' style={dimensionImage()} />
                        <Text>{description}</Text>
                    </CardItem>
                </Card>
            </TouchableOpacity>
        </View>
    )
}

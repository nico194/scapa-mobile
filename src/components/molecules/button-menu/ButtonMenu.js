import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Card, CardItem, Text } from 'native-base';

export default function ButtonMenu({ onPress, label, image }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Card style={{ marginVertical: 20 }}>
                <CardItem>
                    <Image source={{ uri: image}} resizeMode='contain' style={{ width: 200, height: 150 }} />
                </CardItem>
                <CardItem bordered footer>
                    <Text style={{ width: 200 ,textAlign: 'center' }}>{ label }</Text>
                </CardItem>
            </Card>
        </TouchableOpacity>
    )
}

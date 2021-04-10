import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'native-base';

export default function ErrorMessage({ message, showButton, messageButton, onPress }) {
    return (
        <View style={{ padding: 20, marginBottom: 20, backgroundColor: '#fa9191', borderColor: '#bf0000', borderWidth: 2 }}>
            <Text style={{ marginBottom: 20, color: '#bf0000' }}>{ message }</Text>
            {
                showButton && 
                    <Button dark onPress={onPress}>
                        <Text>{ messageButton }</Text>
                    </Button>
                
            }
        </View>
    )
}

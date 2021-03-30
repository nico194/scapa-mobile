import { H2, H3, Button, Text } from 'native-base'
import React from 'react'
import { View } from 'react-native'

export default function EmptyPhrase({ goTo }) {
    return (
        <View>
            <H2 style={{ marginBottom: 20, color: '#fff'}}>{ !goTo ? 'No hay Recuerdos almacenados' : 'No hay Rutinas registradas en el sistema'}</H2>
            {
                !goTo && 
                (
                    <View>
                        <H3 style={{ marginBottom: 20, color: '#fff'}}>Para crear Recuerdos vaya a la sección de Empecemos a Hablar</H3>
                        <Button dark onPress={goTo} style={{ alignSelf: 'center' }}>
                            <Text>Ir a Empecemos a Hablar</Text>
                        </Button>
                    </View>
                )
            }
            
        </View>
    )
}


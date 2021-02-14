import React, { useState, useEffect } from 'react'
import { Container, Content, H1, Text, Button, Switch } from 'native-base'
import { setOrientation } from '../configs/orientation'
import { Dimensions } from 'react-native';


export default function ConfigScreen({ navigation }) {

    const [voice, setVoice] = useState(false)

    useEffect(() => {
        setOrientation(navigation, 'portrait')
    }, [navigation]);

    const handlerOnChangeToggle = (value) => {
        console.log(value)
        setVoice(value)
    }

    const goToCustomizations = () => {
        navigation.navigate('Custom');
    }

    const returnToHome = () => {
        navigation.navigate('Home');
    }

    return (
        <Container>
            <Content padder contentContainerStyle={{ padding: 15, height: Dimensions.get('window').height }}>
                <H1 style={{ textAlign: 'center', marginBottom: 20 }}>Configuraciones</H1>
                <Text style={{ marginBottom: 20 }}>Activar o desactivar la Reproducción por Voz</Text>
                <Switch value={voice} style={{ marginBottom: 60, textAlign: 'left'}} onValueChange={handlerOnChangeToggle}/>
                <Button block onPress={goToCustomizations}>
                    <Text>Categorías y Pictogramas Personalizados</Text>
                </Button>
                <Button primary style={{ position: 'absolute', right: 15 , bottom: 50}} onPress={returnToHome}>
                    <Text>Volver</Text>
                </Button>
            </Content>
        </Container>
    )
}

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dimensions } from 'react-native';
import { returnToHomeAction } from '../redux/actions/users';
import { Container, Content, H1, Text, Button, Switch, H3, H2 } from 'native-base';
import { setOrientation } from '../configs/orientation';


export default function ConfigScreen({ navigation }) {

    const [voice, setVoice] = useState(false);

    const dispatch = useDispatch();
    const { canConfig } = useSelector(state => state.users)

    useEffect(() => {
        setOrientation(navigation, 'portrait')
    }, [navigation]);

    useEffect(() => {
        !canConfig && navigation.navigate('Home'); 
    }, [canConfig])

    const handlerOnChangeToggle = (value) => {
        console.log(value)
        setVoice(value)
    }

    const goToCustomizations = () => {
        navigation.navigate('CustomCategories');
    }

    const returnToHome = () => {
        dispatch(returnToHomeAction())
    }

    return (
        <Container>
            <Content padder >
                <H1 style={{ textAlign: 'center', marginBottom: 20, color: '#fff' }}>Configuraciones</H1>
                <H3 style={{ marginBottom: 20, color: '#fff' }}>Activar o desactivar la Reproducción por Voz</H3>
                <Switch value={voice} style={{ marginBottom: 60 }} onValueChange={handlerOnChangeToggle}/>
                <Button block dark onPress={goToCustomizations} style={{ height: 100, marginBottom: 150 }}>
                    <H2 style={{ color: '#fff', textAlign: 'center' }}>Categorías y Pictogramas Personalizados</H2>
                </Button>
                <Button dark onPress={returnToHome} style={{ alignSelf: 'flex-end' }}>
                    <Text>Volver</Text>
                </Button>
            </Content>
        </Container>
    )
}

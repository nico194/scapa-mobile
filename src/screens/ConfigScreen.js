import React, { useState, useEffect } from 'react';
import { BackHandler, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { initHome } from '../redux/actions/users';
import { Container, Content, H1, Button, Switch, H3, H2 } from 'native-base';
import { setOrientation } from '../configs/orientation';


export default function ConfigScreen({ navigation }) {

    const [voice, setVoice] = useState(false);

    const dispatch = useDispatch();
    const { canConfig } = useSelector(state => state.users)

    useEffect(() => {
        const backAction = () => {
            Alert.alert('Espera...', 'Estas seguro que quieres volver atras?', [
                {
                    text: 'Cancelar',
                    onPress: () => null,
                    style: 'cancel'
                },
                { text: 'Aceptar', onPress: () => dispatch(initHome()) }
            ]);
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        setOrientation(navigation, 'portrait')
    }, [navigation]);

    useEffect(() => {
        !canConfig && navigation.navigate('Home');
    }, [canConfig])

    const handlerOnChangeToggle = (value) => {
        setVoice(value)
    }

    const goToCustomizations = () => {
        navigation.navigate('CustomCategories');
    }

    return (
        <Container>
            <Content padder >
                <H1 style={{ textAlign: 'center', marginBottom: 20, color: '#fff' }}>Configuraciones</H1>
                <H3 style={{ marginBottom: 20, color: '#fff' }}>Activar o desactivar la Reproducción por Voz</H3>
                <Switch value={voice} style={{ marginBottom: 60 }} onValueChange={handlerOnChangeToggle} />
                <Button block dark onPress={goToCustomizations} style={{ height: 100, marginBottom: 150 }}>
                    <H2 style={{ color: '#fff', textAlign: 'center' }}>Categorías y Pictogramas Personalizados</H2>
                </Button>
            </Content>
        </Container>
    )
}

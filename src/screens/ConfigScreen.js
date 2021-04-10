import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Content, H1, Button, Switch, H3, H2, Spinner } from 'native-base';
import { setOrientation } from '../configs/orientation';
import { initHome, updateVoiceStatus, getUserFromAsyncStorage } from '../redux/actions/users';



export default function ConfigScreen({ navigation }) {

    const dispatch = useDispatch();
    const { user, loadingUser } = useSelector(state => state.users)

    useEffect(() => {
        dispatch(getUserFromAsyncStorage())
    }, [])
    
    useEffect(() => {
        setOrientation(navigation, 'portrait')
    }, [navigation]);

    useEffect(() => {
        dispatch(initHome())
    }, [dispatch])

    const handlerOnChangeToggle = (value) => {
        dispatch(updateVoiceStatus(value, user))
    }

    const goToCustomizations = () => {
        navigation.navigate('CustomCategories');
    }

    return (
        <Container>
            <Content padder >
                <H1 style={{ textAlign: 'center', marginBottom: 20, color: '#fff' }}>Configuraciones</H1>
                <H3 style={{ marginBottom: 20, color: '#fff' }}>Activar o desactivar la Reproducción por Voz</H3>
                {
                    loadingUser ?
                        <Spinner color='#fff' />
                        :
                        <Switch value={user.voice} style={{ marginBottom: 60 }} onValueChange={handlerOnChangeToggle} />
                }
                <Button block dark onPress={goToCustomizations} style={{ height: 100, marginBottom: 150 }}>
                    <H2 style={{ color: '#fff', textAlign: 'center' }}>Categorías y Pictogramas Personalizados</H2>
                </Button>
            </Content>
        </Container>
    )
}

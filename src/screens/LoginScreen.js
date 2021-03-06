import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authenticationUser, isUserLogged, cleanError } from '../redux/actions/users'
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Container, Content, Card, CardItem, Text, Body, Form, Item, Input, Label, Button, Left, Right, Spinner } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { setOrientation } from '../configs/orientation';
import { getErrorMessage } from '../configs/manageError';

export default function LoginScreen({ navigation }) {

    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    const dispatch = useDispatch();
    const { loadingUser, error, isLogged, isFirstTime } = useSelector(state => state.users);

    useEffect(() => {
        dispatch(isUserLogged());
    }, [])

    useEffect(() => {
        isLogged && navigation.navigate('Home');
    }, [isLogged])

    useEffect(() => {
        setOrientation(navigation, 'portrait')
    }, [navigation]);
    
    const handlerSignIn = () => {
       dispatch(authenticationUser({email, password}, '/sign_in'));
    }

    useEffect(() => {
        isFirstTime && navigation.navigate('LoadingResourse');
    }, [isFirstTime])

    if(loadingUser && !isLogged) {
        return (
            <Container style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#fff" />
            </Container>
        )
    }

    return (
        <Container>
            <Content 
                padder 
                contentContainerStyle={styles.cardForm}>
                <View padder contentContainerStyle={{ position: 'absolute', top: 0 }}>
                    <Text style={styles.headTitle}>Bienvenido a SCAPA</Text>
                    <Text style={styles.subHeadTitle}>Sistema de Comunicación Aumentativo y Alternativo para personas con Autismo</Text>
                </View>
                <Card>
                    <CardItem header>
                        <Text style={styles.title}>Iniciar Sesión</Text>
                    </CardItem>
                    {
                        error && !loadingUser &&
                            <TouchableOpacity onPress={() => dispatch(cleanError())}>
                                <CardItem>
                                    <Text style={{ padding: 20, backgroundColor: '#fa9191', color: '#bf0000', borderColor: '#bf0000', borderWidth: 2 }}>{ getErrorMessage(error.status) }</Text>
                                </CardItem>
                            </TouchableOpacity>
                    }
                    <CardItem>
                        <Body>
                            <Form style={{ alignSelf: 'stretch' }}>
                                <Item floatingLabel>
                                    <Label>Email</Label>
                                    <Input onChangeText={ (value) => setEmail(value) } />
                                </Item>
                                <Item floatingLabel>
                                    <Label>Contraseña</Label>
                                    <Input secureTextEntry={true} onChangeText={ (value) => setPassword(value) } />
                                </Item>
                            </Form> 
                        </Body>
                    </CardItem>
                    <CardItem >
                        <Left>
                            <Button 
                                transparent
                                dark
                                onPress={ () => navigation.navigate('Register') }
                                >
                                <Text>Registrarse</Text>
                            </Button>
                        </Left>
                        <Right>
                            <Button dark onPress={handlerSignIn}>
                                <Text>Ingresar</Text>
                                { 
                                    loadingUser ?
                                        <Spinner color='white'/>
                                        :
                                        <MaterialIcons name='login' size={20} color="#FFFFFF" style={{marginHorizontal:10}} />
                                }
                            </Button>
                        </Right>
                    </CardItem>
                </Card>
            </Content>
        </Container>
    )
}


const styles = StyleSheet.create({
    cardForm: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        width: '100%',
        textAlign: 'center',
        fontSize: 30
    },
    headTitle: {
        width: '100%',
        textAlign:'center',
        fontSize: 45,
        fontWeight: 'bold',
        color: '#fff' 
    },
    subHeadTitle: { 
        textAlign: 'center', 
        marginBottom: 20, 
        fontWeight: 'bold',
        color: '#fff' 
    }
})

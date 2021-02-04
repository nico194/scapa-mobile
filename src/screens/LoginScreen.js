import React, { useState, useEffect } from 'react'
import { StyleSheet, ImageBackground, Dimensions, View } from 'react-native';
import { Container, Content, Card, CardItem, Text, Body, Form, Item, Input, Label, Button, Left, Right, Spinner, H1 } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import CustomHeader from '../components/header/CustomHeader';

export default function LoginScreen({ navigation }) {

    const [ loading, setLoading ] = useState(false);
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const image = require('../../assets/backgroundLogin.png')

    async function changeScreenOrientationPortrait() {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
    
    useEffect(() => {
        changeScreenOrientationPortrait();
    })
    
    function handlerSignIn() {
        setLoading(true)
        console.log(`Email: ${email} & Password: ${password}`)
        setTimeout(() => {
            setLoading(false)
            navigation.navigate('Home')
        }, 1000)
    }

    return (
        <Container>
            <CustomHeader title='SCAPA APP'/>
            <ImageBackground 
                source={image} 
                style={styles.backgroundImage} >
                <Content 
                    padder 
                    contentContainerStyle={styles.cardForm}>
                    <View padder contentContainerStyle={{ position: 'absolute', top: 0 }}>
                        <Text style={styles.headTitle}>Bienvenido a SCAPA</Text>
                        <Text style={{ textAlign: 'center', marginBottom: 20, fontWeight: 'bold' }}>Sistema de Comunicación Aumentativo y Alternativo para personas con Autismo</Text>
                    </View>
                    <Card>
                        <CardItem header>
                            <Text style={styles.title}>Iniciar Sesión</Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Form style={{ alignSelf: 'stretch' }}>
                                    <Item floatingLabel>
                                        <Label>Email</Label>
                                        <Input onChangeText={ (value) => setEmail(value) } />
                                    </Item>
                                    <Item floatingLabel>
                                        <Label>Contraseña</Label>
                                        <Input onChangeText={ (value) => setPassword(value) } />
                                    </Item>
                                </Form> 
                            </Body>
                        </CardItem>
                        <CardItem >
                            <Left>
                                <Button 
                                    transparent
                                    primary
                                    onPress={ () => navigation.navigate('Register') }
                                    >
                                    <Text>Registrarse</Text>
                                </Button>
                            </Left>
                            <Right>
                                <Button primary onPress={handlerSignIn}>
                                    <Text>Ingresar</Text>
                                    { loading ?
                                        <Spinner color='white'/>
                                        :
                                        <MaterialIcons name='login' size={20} color="#FFFFFF" style={{marginHorizontal:10}} />
                                    }
                                </Button>
                            </Right>
                        </CardItem>
                    </Card>
                </Content>
            </ImageBackground>
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
        fontWeight: 'bold'
    },
    backgroundImage: {
        width: Dimensions.get('window').width, 
        height: Dimensions.get('window').height
    }
})

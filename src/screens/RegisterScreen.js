import React, { useState, useEffect } from 'react'
import { StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { Container, Content, Card, CardItem, Text, Body, Form, Item, Input, Label, Button, Left, Right, Spinner} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import DatePicker from 'react-native-datepicker';
import * as ScreenOrientation from 'expo-screen-orientation';
import CustomHeader from '../components/header/CustomHeader';

export default function RegisterScreen({ navigation }) {

    const [ loading, setLoading ] = useState(false);
    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ date, setDate ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ passwordRepeat, setPasswordRepeat ] = useState('');
    const image = require('../../assets/backgroundLogin.png');

    useEffect(() => {
        changeScreenOrientation();
    })

    changeScreenOrientation = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }

    handlerSignUp = () => {
        setLoading(true)
        console.log('Sign Up', {
            name,
            email,
            date,
            password,
            passwordRepeat
        })
        setTimeout(() => {
            setLoading(false)
            navigation.navigate('Home')
        }, 2000)
    }
    
    return (
        <Container>
            <CustomHeader/>
            <ImageBackground 
                source={image} 
                style={styles.backgroundImage} >
                <Content 
                    padder 
                    contentContainerStyle={styles.cardForm}>
                    <Card>
                        <CardItem header>
                            <Text style={styles.title}>Registrarse</Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Form style={{ alignSelf: 'stretch' }}>
                                    <Item stackedLabel>
                                        <Label style={{marginLeft: 5}}>Nombre y Apellido</Label>
                                        <Input onChangeText={ (value) => setName(value)} />
                                    </Item>
                                    <Item stackedLabel>
                                        <Label style={{marginLeft: 5}}>Email</Label>
                                        <Input onChangeText={ (value) => setEmail(value)} />
                                    </Item>
                                    <Item stackedLabel>
                                        <Label>Fecha de Nacimiento</Label>
                                        <DatePicker
                                            style={{width: '100%'}}
                                            date={date}
                                            mode="date"
                                            placeholder="Seleccione una Fecha"
                                            format="DD-MM-YYYY"
                                            maxDate={new Date()}
                                            confirmBtnText="Confirma"
                                            cancelBtnText="Cancelar"
                                            customStyles={{
                                                dateIcon: {
                                                position: 'absolute',
                                                right: 0,
                                                top: 4,
                                                marginRight: 0
                                                },
                                                dateInput: {
                                                    borderColor: 'transparent'
                                                }
                                            }}
                                            onDateChange={ (date) => setDate(date) }                                   
                                        />
                                    </Item>
                                    <Item stackedLabel>
                                        <Label style={{marginLeft: 5}}>Contraseña</Label>
                                        <Input onChangeText={ (value) => setPassword(value)}/>
                                    </Item>
                                    <Item stackedLabel>
                                        <Label style={{marginLeft: 5}}>Confirmar Contraseña</Label>
                                        <Input onChangeText={ (value) => setPasswordRepeat(value)}/>
                                    </Item>
                                </Form> 
                            </Body>
                        </CardItem>
                        <CardItem >
                            <Left>
                                <Button 
                                    transparent
                                    primary
                                    onPress={ () => navigation.navigate('Login') }
                                    >
                                    <Text>Volver</Text>
                                </Button>
                            </Left>
                            <Right>
                                <Button primary onPress={handlerSignUp} >
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
    backgroundImage: {
        width: Dimensions.get('window').width, 
        height: Dimensions.get('window').height
    }
})

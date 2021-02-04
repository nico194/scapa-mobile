import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signUp } from '../redux/actions/users'
import { StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { Container, Content, Card, CardItem, Text, Body, Form, Item, Input, Label, Button, Left, Right, Spinner} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import CustomHeader from '../components/header/CustomHeader';

export default function RegisterScreen({ navigation }) {

    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ passwordRepeat, setPasswordRepeat ] = useState('');
    const image = require('../../assets/backgroundLogin.png');

    const dispatch = useDispatch();
    const { loading, auth } = useSelector(state => state.users)

    useEffect(() => {
        auth && navigation.navigate('Home')
    }, [auth])

    const handlerSignUp = () => {
        dispatch(signUp({ email, password }));
    }
    
    return (
        <Container>
            <CustomHeader hasBack={true} onClickBack={ () => navigation.navigate('Login')} title='Registrarse' />
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
                                        <Label style={{marginLeft: 5}}>Email</Label>
                                        <Input onChangeText={ (value) => setEmail(value)} />
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

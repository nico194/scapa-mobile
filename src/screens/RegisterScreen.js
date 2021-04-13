import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authenticationUser, differentPassword } from '../redux/actions/users'
import { StyleSheet } from 'react-native';
import { Container, Content, Card, CardItem, Text, Body, Form, Item, Input, Label, Button, Left, Right, Spinner} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { setOrientation } from '../configs/orientation';
import { getErrorMessage } from '../configs/manageError';

export default function RegisterScreen({ navigation }) {

    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ passwordRepeat, setPasswordRepeat ] = useState('');

    const dispatch = useDispatch();
    const { loadingUser, isLogged, error } = useSelector(state => state.users)

    useEffect(() => {
        setOrientation(navigation, 'portrait')
    }, [navigation]);

    
    const handlerSignUp = () => {
        if (password === passwordRepeat) {
            dispatch(authenticationUser({ email, password }));
        } else {
            dispatch(differentPassword()); 
        }
    }
    
    useEffect(() => {
        isLogged && navigation.navigate('LoadingResourse');
    }, [isLogged])
    
    return (
        <Container>
            <Content 
                padder 
                contentContainerStyle={styles.cardForm}>
                <Card>
                    <CardItem header>
                        <Text style={styles.title}>Registrarse</Text>
                    </CardItem>
                    {
                        error && !loadingUser &&
                            <CardItem >
                                <Text style={{ width: '100%', padding: 20, backgroundColor: '#fa9191', color: '#bf0000', borderColor: '#bf0000', borderWidth: 2 }}>
                                    {
                                        error.status !== undefined ?
                                            getErrorMessage(error.status) 
                                            :
                                            error
                                    }
                                </Text>
                            </CardItem>
                    }
                    <CardItem>
                        <Body>
                            <Form style={{ alignSelf: 'stretch' }}>
                                <Item stackedLabel>
                                    <Label style={{marginLeft: 5}}>Email</Label>
                                    <Input onChangeText={ (value) => setEmail(value)} />
                                </Item>
                                <Item stackedLabel>
                                    <Label style={{marginLeft: 5}}>Contraseña</Label>
                                    <Input secureTextEntry={true} onChangeText={ (value) => setPassword(value)}/>
                                </Item>
                                <Item stackedLabel>
                                    <Label style={{marginLeft: 5}}>Confirmar Contraseña</Label>
                                    <Input secureTextEntry={true} onChangeText={ (value) => setPasswordRepeat(value)}/>
                                </Item>
                            </Form> 
                        </Body>
                    </CardItem>
                    <CardItem >
                        <Left>
                            <Button 
                                transparent
                                dark
                                onPress={ () => navigation.navigate('Login') }
                                >
                                <Text>Volver</Text>
                            </Button>
                        </Left>
                        <Right>
                            <Button dark onPress={handlerSignUp} >
                                <Text>Ingresar</Text>
                                { loadingUser ?
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
    }
})

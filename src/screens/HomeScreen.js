import React, { useState ,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TouchableOpacity, View } from 'react-native';
import { Container, Text, Button, H1, Input, Form, Item, Label, Spinner} from 'native-base';
import CustomModal from '../components/molecules/modal/CustomModal';
import Menu from '../components/organims/menu/Menu';
import { MaterialIcons } from '@expo/vector-icons';
import { setOrientation } from '../configs/orientation'
import { cleanError, logOutUser, verifyPassword } from '../redux/actions/users';
import { getErrorMessage } from '../configs/manageError';

export default function HomeScreen({ navigation }) {

    const [modalVisible, setModalVisible] = useState(false);
    const [password, setPassword] = useState('')

    const dispatch = useDispatch();
    const { user, loadingUser, canConfig, error } = useSelector(state => state.users);

    useEffect(() => {
        setOrientation(navigation, 'landspace')
    }, [navigation]);

    const goToConfig = () => {
        dispatch(verifyPassword(password));
    }
    
    useEffect(() => {
        if (canConfig) {
            setModalVisible(false)
            navigation.navigate('Config');
        }
    }, [canConfig])

    const openModal = () => {
        setModalVisible(true)
    }

    const hideModal = () => {
        setModalVisible(false);
    }

    useEffect(() => {
        Object.keys(user).length === 0 && navigation.navigate('Login');
    })

    return (
        <Container>
            <View style={{ flex: 1, flexDirection: 'row', position: 'absolute', top: 0, right: 15 }}>
                <Button dark onPress={openModal}>                
                    <MaterialIcons name='settings' size={27} style={{ color: '#ffffff', marginLeft: 5}} />
                    <Text style={{ fontSize: 18 }}>Ir a configuraciones</Text>
                </Button>
                <Button warning onPress={() => dispatch(logOutUser()) } style={{ marginLeft: 10 }} >                
                    <Text style={{ fontSize: 18 }}>Salir</Text>
                    { loadingUser ?
                         <Spinner color='white' />
                         :
                         <MaterialIcons name='logout' size={27} style={{ color: '#ffffff', marginLeft: 5}} />
                    }
                </Button>
            </View>
            <CustomModal modalVisible={modalVisible}>
                <H1 style={{ marginBottom: 20}}>Ingrese su contraseña de usuario:</H1>
                <Form>
                    <Text style={{ marginBottom: 20}}>Para ingresar a la sesión de configuración primero debe ingresar la contraseña</Text>
                    {
                        error &&
                            <TouchableOpacity onPress={() => dispatch(cleanError())}>
                                <Text style={{ padding: 20, backgroundColor: '#fa9191', color: '#bf0000', borderColor: '#bf0000', borderWidth: 2 }}>
                                    { getErrorMessage(error.status) }
                                </Text>
                            </TouchableOpacity>
                    }
                    <Item style={{ marginBottom: 40}} floatingLabel>
                        <Label>Contraseña</Label>
                        <Input secureTextEntry={true} onChangeText={ value => setPassword(value)}/>
                    </Item>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent:'space-between' }}>
                        <Button warning onPress={hideModal}>
                            <Text>Cancelar</Text>
                        </Button>
                        <Button dark onPress={goToConfig}>
                        <Text>Ingresar</Text>
                            { loadingUser && <Spinner color='white' />}
                        </Button>
                    </View>                    
                </Form>
            </CustomModal>
            <Menu navigation={navigation}/>
        </Container>
    )

}

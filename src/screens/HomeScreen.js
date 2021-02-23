import React, { useState ,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Text, Button, H1, Input, Form, Item, Label, Spinner} from 'native-base';
import CustomModal from '../components/molecules/modal/CustomModal';
import Menu from '../components/organims/menu/Menu';
import { MaterialIcons } from '@expo/vector-icons';
import { setOrientation } from '../configs/orientation'
import { authenticationUser, logOut } from '../redux/actions/users';
import { checkResources } from '../redux/actions/resourses';
import { View } from 'react-native';


export default function HomeScreen({ navigation }) {

    const [modalVisible, setModalVisible] = useState(false);
    const [password, setPassword] = useState('')

    const dispatch = useDispatch();
    const { user, canConfig, loadingUser } = useSelector(state => state.users);
    const { hasResourses } = useSelector(state => state.resourses)

    useEffect(() => {
        setOrientation(navigation, 'landspace')
    }, [navigation]);

    useEffect(() => {
        dispatch(checkResources());
    }, [dispatch]);

    useEffect(() => {
        !hasResourses && navigation.navigate('LoadingResourse')
    }, [hasResourses])

    useEffect(() => {
        if (canConfig) {
            setModalVisible(false)
            navigation.navigate('Config');
        }
    }, [canConfig])

    const goToConfig = () => {
        dispatch(authenticationUser({ email: user.email, password}, '/sign_in', true));
    }

    const openModal = () => {
        setModalVisible(true)
    }

    const hideModal = () => {
        setModalVisible(false);
    }

    return (
        <Container>
            <View style={{ flex: 1, flexDirection: 'row', position: 'absolute', bottom: 0, right: 0 }}>
                <Button dark onPress={openModal}>                
                    <MaterialIcons name='settings' size={27} style={{ color: '#ffffff', marginLeft: 5}} />
                    <Text style={{ fontSize: 18 }}>Ir a configuraciones</Text>
                </Button>
                <Button warning onPress={() => dispatch(logOut())} style={{ marginLeft: 10 }} >                
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
                    <Item style={{ marginBottom: 40}} floatingLabel>
                        <Label>Contraseña</Label>
                        <Input onChangeText={ value => setPassword(value)}/>
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

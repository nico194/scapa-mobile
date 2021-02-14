import React, { useState ,useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, Image, View, TouchableOpacity } from 'react-native';
import { Card, CardItem, Text, Button, H1, Input, Form, Item, Label} from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { setOrientation } from '../configs/orientation'
import { MaterialIcons } from '@expo/vector-icons';
import CustomModal from '../components/modal/CustomModal';


export default function HomeScreen({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    
    const imageButtonToSpeak = require('../../assets/speakButtonImage.png');
    const imageButtonToMemories = require('../../assets/memoriesButtonImage.png');
    const imageButtonToRoutines = require('../../assets/routinesButtonImage.png');;

    const imageSpeak = Image.resolveAssetSource(imageButtonToSpeak).uri;
    const imageMemories = Image.resolveAssetSource(imageButtonToMemories).uri;
    const imageRoutines = Image.resolveAssetSource(imageButtonToRoutines).uri;


    useEffect(() => {
        setOrientation(navigation, 'landspace')
    }, [navigation]);

    const goToConfig = () => {
        setModalVisible(false);
        navigation.navigate('Config');
    }

    const openModal = () => {
        setModalVisible(true)
    }

    return (
        <LinearGradient style={{ flex: 1 }}  colors={['#62B1F6', '#2F62FB']}>
            <Button onPress={openModal} style={{ position: 'absolute', top: 0, right: 0 }}>                
                <MaterialIcons name='settings' size={27} style={{ color: '#ffffff', marginLeft: 5}} />
                <Text style={{ fontSize: 18 }}>Ir a configuraciones</Text>
            </Button>
            <CustomModal modalVisible={modalVisible}>
                <Form>
                    <H1 style={{ marginBottom: 20}}>Ingrese su contraseña de usuario:</H1>
                    <Text style={{ marginBottom: 20}}>Para ingresar a la sesión de configuración primero debe ingresar la contraseña</Text>
                    <Item style={{ marginBottom: 40}} floatingLabel>
                        <Label>Contraseña</Label>
                        <Input />
                    </Item>
                    <Button onPress={goToConfig} block>
                        <Text>Ingresar</Text>
                    </Button>
                </Form>
            </CustomModal>
            <View style={styles.centerComponents}>
                <TouchableOpacity onPress={ () => alert("This is Card Routines")}>
                    <Card style={{ marginVertical: 20 }}>
                        <CardItem>
                            <Image source={{ uri: imageRoutines}} resizeMode='contain' style={{ width: 200, height: 150 }} />
                        </CardItem>
                        <CardItem bordered footer>
                            <Text style={{ width: 200 ,textAlign: 'center' }}>Rutinas</Text>
                        </CardItem>
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={ () => navigation.navigate('Speak')}>
                    <Card style={{ marginVertical: 20 }}>
                        <CardItem>
                            <Image source={{ uri: imageSpeak }} resizeMode='contain' style={{ width: 200, height: 150 }} />
                        </CardItem>
                        <CardItem bordered footer>
                            <Text style={{ width: 200 ,textAlign: 'center' }}>Empezemos a Hablar</Text>
                        </CardItem>
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={ () => alert("This is Card Memories")}>
                    <Card style={{ marginVertical: 20 }}>
                        <CardItem>
                            <Image source={{ uri: imageMemories}} resizeMode='contain' style={{ width: 200, height: 150 }} />
                        </CardItem>
                        <CardItem bordered footer>
                            <Text style={{ width: 200 ,textAlign: 'center' }}>Recuerdos</Text>
                        </CardItem>
                    </Card>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },  
    centerComponents: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
    },
    modalStyle: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
    },
    modalStyle: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
        margin: 50,
        padding: 20
    }
})
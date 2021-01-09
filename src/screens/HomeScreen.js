import React, { useState ,useEffect } from 'react';
import { StyleSheet, Image, View, Modal } from 'react-native';
import { Card, CardItem, Text, Button, H1} from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import * as ScreenOrientation from 'expo-screen-orientation';
import { MaterialIcons } from '@expo/vector-icons';


export default function HomeScreen({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    
    const imageButtonToSpeak = require('../../assets/speakButtonImage.png');
    const imageButtonToMemories = require('../../assets/memoriesButtonImage.png');
    const imageButtonToRoutines = require('../../assets/routinesButtonImage.png');;

    const imageSpeak = Image.resolveAssetSource(imageButtonToSpeak).uri;
    const imageMemories = Image.resolveAssetSource(imageButtonToMemories).uri;
    const imageRoutines = Image.resolveAssetSource(imageButtonToRoutines).uri;

    async function changeScreenOrientationLandscape() {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }

    useEffect(() => {
        changeScreenOrientationLandscape();
    })

    async function changeScreenOrientationPortrait() {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        navigation.navigate('Login');
    }

    function goBackToLogin() {
        changeScreenOrientationPortrait();
    }

    function goToConfig() {
        setModalVisible(true)
    }

    return (
        <LinearGradient style={{ flex: 1 }}  colors={['#62B1F6', '#2F62FB']}>
            <Button onPress={goToConfig} style={{ position: 'absolute', top: 0, right: 0 }}>                
                <MaterialIcons name='settings' size={27} style={{ color: '#ffffff', marginLeft: 5}} />
                <Text style={{ fontSize: 18 }}>Ir a configuraciones</Text>
            </Button>
            <Button warning onPress={goBackToLogin} style={{ position: 'absolute', top: 0, left: 0 }}>                
                <MaterialIcons name='arrow-back' size={27} style={{ color: '#ffffff', marginLeft: 5}} />
                <Text style={{ fontSize: 18 }}>Salir</Text>
            </Button>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                style={styles.centerComponents}
                onRequestClose={() => {
                  setModalVisible(false)
                }}>
                    <H1>This is a modal</H1>
            </Modal>
            <View style={styles.centerComponents}>
                <Card style={{ marginVertical: 20 }}>
                    <CardItem>
                        <Image source={{ uri: imageRoutines}} resizeMode='contain' style={{ width: 200, height: 150 }} />
                    </CardItem>
                    <CardItem bordered footer>
                        <Text style={{ width: 200 ,textAlign: 'center' }}>Rutinas</Text>
                    </CardItem>
                </Card>
                <Card style={{ marginVertical: 20 }}>
                    <CardItem>
                        <Image source={{ uri: imageSpeak }} resizeMode='contain' style={{ width: 200, height: 150 }} />
                    </CardItem>
                    <CardItem bordered footer>
                        <Text style={{ width: 200 ,textAlign: 'center' }}>Empezemos a Hablar</Text>
                    </CardItem>
                </Card>
                <Card style={{ marginVertical: 20 }}>
                    <CardItem>
                        <Image source={{ uri: imageMemories}} resizeMode='contain' style={{ width: 200, height: 150 }} />
                    </CardItem>
                    <CardItem bordered footer>
                        <Text style={{ width: 200 ,textAlign: 'center' }}>Recuerdos</Text>
                    </CardItem>
                </Card>
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
    }
})
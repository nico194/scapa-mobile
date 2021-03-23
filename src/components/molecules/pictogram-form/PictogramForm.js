import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Image, View, Dimensions } from 'react-native';
import { Button, Form, H1, Input, Item, Label, Text, Spinner } from 'native-base';
import DropDownPicker from 'react-native-dropdown-picker'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera'
import { Entypo } from '@expo/vector-icons';

export default function PictogramForm({ loading, operation, setPictogram, pictogram, addOrEditCustomPictogram, hideModal, hasCategory }) {

    const camRef = useRef(null);
    const [openCamera, setOpenCamera] = useState(false);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [permission, askForPermission] = Permissions.usePermissions([Permissions.CAMERA, Permissions.MEDIA_LIBRARY], { ask: true });

    const { categories } = useSelector(state => state.categories); 
    const customCategories = categories.filter( cat => cat.isCustom).map(category => ({ label: category.attributes.description, value: category.id })); 

    const { width, height } = Dimensions.get('window');

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            status !== 'granted' && askForPermission()
        })();
    }, [])

    const handleOnChangeText = (name, value) => {
        setPictogram({
            ...pictogram,
            [name]: value
        })
    }

    const openImagePickerAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setPictogram({
                ...pictogram,
                image: result.uri
            })
        }
    };

    const takeAPicture = async () => {
        if(camRef) {
            const data = await camRef.current.takePictureAsync();
            setPictogram({ ...pictogram, image: data.uri})
            setOpenCamera(false);
        }
    }

    return (
        <View style={{ height: '100%' }}>
            <Camera
                style={[openCamera ? { flex: 1, width: '100%' } : { display: 'none' }]}
                type={type}
                ref={camRef}
                >
                <Button 
                    danger   
                    style={{ position: 'absolute', right: -8, top: -8, padding: 15 }}
                    onPress={() => setOpenCamera(false)}>
                    <Entypo name='cross' color='#fff' size={28} />
                </Button>
                <Button 
                    primary 
                    style={{ position: 'absolute', bottom: 50, alignSelf: 'center' }}
                    onPress={takeAPicture}>
                    <Text>Tomar la foto</Text>
                </Button>
            </Camera>
            <View style={[openCamera ? { display: 'none' } : { flex: 1 }]}>
                {!permission || permission.status !== 'granted' &&
                    (
                        <Button onPress={askForPermission} danger>
                            <Text>Primero otorgue los permisos correspondientes </Text>
                        </Button>
                    )
                }
                <H1>{`${operation} pictograma`}</H1>
                <Form>
                    <Item style={{ marginBottom: 40 }} floatingLabel>
                        <Label>Descripcion</Label>
                        <Input value={pictogram.description} onChangeText={value => handleOnChangeText('description', value)} />
                    </Item>
                    { !pictogram.image && <Text style={{ color: '#000000aa' }}>Seleccione una imagen:</Text>}
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 60 }}>
                        <Button dark onPress={() => setOpenCamera(true)} style={{ paddingHorizontal: 10 }}>
                            <Entypo name='camera' size={38} color='#fff' />
                        </Button>
                        <Button dark onPress={openImagePickerAsync} style={{ paddingHorizontal: 10, marginLeft: 20 }}>
                            <Entypo name='image' size={38} color='#fff' />
                        </Button>
                    </View>
                    {pictogram.image && <Image source={{ uri: pictogram.image }} style={{ width: width * 2 / 3, height: height / 3, marginBottom: 40, alignSelf: 'center' }} />}
                    {!hasCategory &&
                        <DropDownPicker
                            items={customCategories}
                            placeholder="Seleccione una categoría:"
                            containerStyle={[ true ? {height: 40, marginBottom: 40} : { display:'none' }]}
                            onChangeItem={item => setPictogram({ ...pictogram, idCategory: item.value})}
                        />
                    }
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Button warning onPress={hideModal}>
                            <Text>Cancelar</Text>
                        </Button>
                        <Button dark onPress={addOrEditCustomPictogram}>
                            <Text>{operation}</Text>
                            {loading && <Spinner color='#fff' />}
                        </Button>
                    </View>
                </Form>
            </View>
        </View>
    )
}

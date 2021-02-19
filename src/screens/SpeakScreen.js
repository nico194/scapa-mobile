import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Button, Card, CardItem, H1, H2, Spinner, Text } from 'native-base';
import { Entypo, AntDesign } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient';
import { setOrientation } from '../configs/orientation';
import { setCategories } from '../redux/actions/categories';
import { setAllPictograms, filterPictogramsByCategory } from '../redux/actions/pictograms';

export default function SpeakScreen({ navigation }) {

    const [ memory, setMemory ] = useState([])
    const [ phrase, setPhrase ] = useState([])
    const [ categorySelected, setCategorySelected ] = useState(-1)

    const dispatch = useDispatch();
    const { categories } = useSelector(state => state.categories)
    const { filteredPictograms , loadingPictograms } = useSelector(state => state.pictograms);
    
    const { width, height } = Dimensions.get('screen');

    const imageButtonToSpeak = require('../../assets/speakButtonImage.png');
    const imageSpeak = Image.resolveAssetSource(imageButtonToSpeak).uri;

    useEffect(() => {
        setOrientation(navigation, 'landspace');
    }, [navigation])

    const categoriesList = categories.map((category, index) => {
        return (
            <Button 
                key={category.id} 
                rounded     
                warning={category.id === categorySelected.id}
                onPress={() => filterByCategory(category)} 
                style={[{alignSelf: 'center'}, index === categories.length ? { marginLeft: 0 }: { marginLeft: 10 }]}>
                <Text>{ category.attributes.description }</Text>
            </Button>
        )
    });

    const pictorgramsList = filteredPictograms.length > 0 && filteredPictograms.map( pictogram => {
        return (
            <TouchableOpacity onPress={() => addPictogramToPhrase(pictogram)} key={pictogram.id}>
                <Card  style={{ width: width / 5, height: height / 3.2, marginLeft: 10, marginRight: 10, marginBottom: 10, alignItems: 'center', justifyContent: 'center'}}>
                    <CardItem style={{ flexDirection: 'column'}}>
                        <Image source={{ uri: imageSpeak }} resizeMode='contain' style={{ borderColor: 'black', borderWidth: 2, width: width / 8, height: height / 5.3 , alignSelf: 'center', marginBottom: 10 }} />
                        <Text>{pictogram.attributes.description}</Text>
                    </CardItem>
                </Card>
            </TouchableOpacity>
        )
    });

    const phraseToShow = phrase.map( (pictogram, index) => {
        return (
            <TouchableOpacity onPress={() => removePictogramFromPhrase(index)} key={index} style={styles.pictogram}>
                <Image source={{ uri: imageSpeak }} resizeMode='cover' style={{ width: width / 14, height: width / 14 }} />
            </TouchableOpacity>
        )
    })

    const addPictogramToPhrase = pictogram => {
        setPhrase([ ...phrase, pictogram ])
    }

    const removePictogramFromPhrase = index => {
        setPhrase(phrase.filter( ( pic, ind ) => ind !== index ))
    }

    const allPictograms = () => {
        setCategorySelected(-1);
        dispatch(setAllPictograms());
    }

    const filterByCategory = category => {
        setCategorySelected(category);
        dispatch(filterPictogramsByCategory(category.id))
    }

    return (
        <LinearGradient style={{ flex: 1 }}  colors={['#62B1F6', '#2F62FB']}>
            <View style={styles.containerPhrase}>
                <ScrollView horizontal style={{ padding: 15 }}>
                    { phraseToShow }
                </ScrollView>
                <View style={{ flexDirection: 'row', alignSelf: 'auto'}}>
                    <Button onPress={() =>{}} rounded success style={{ marginLeft: 15, padding:15, marginRight: 15}}>
                        <AntDesign name='star' color='white' size={28}/>
                    </Button>
                    <Button onPress={() =>{}} rounded dark style={{ marginRight: 15, padding:15}}>
                        <Entypo name='megaphone' color='white' size={28}/>
                    </Button>
                </View>
            </View>
            <View style={styles.containerPictograms}>
                <ScrollView>
                    <View style={[styles.content, { flexWrap: 'wrap' }]}>
                        { 
                            loadingPictograms ?
                                <Spinner />
                                :
                                filteredPictograms.length > 0 ?
                                    pictorgramsList 
                                    :
                                    <H1 style={{ color: '#fff' }}>No hay pictogramas cargados aquí</H1>
                        }
                    </View>
                </ScrollView>
            </View>
            <View style={styles.containerCategories}>
                <ScrollView horizontal>
                    <View style={styles.content}>
                        <Button 
                            rounded     
                            warning={ categorySelected === -1}
                            onPress={() => allPictograms()} 
                            style={{ alignSelf: 'center' }}>
                            <Text>Todos</Text>
                        </Button>
                        { categoriesList }
                    </View>
                </ScrollView>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    containerPhrase: {
        flex: 1.3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#456CE2'
    },
    containerPictograms: {
        flex: 4,
        alignItems: 'flex-start'
    },
    containerCategories: {
        flex: 0.7,
        justifyContent: 'center',
        borderTopColor: 'blue',
        borderTopWidth: 3
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        padding: 10
    },
    pictogram: {
        padding: 10,
        marginRight: 15,
        backgroundColor: '#fff',
        borderRadius: 10
    }
})

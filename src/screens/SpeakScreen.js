import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { Container, Button } from 'native-base';
import Phrase from '../components/organims/phrase/Phrase';
import PictogramList from '../components/organims/pictogram-list/PictogramList';
import CategoriesFilter from '../components/organims/categories-filter/CategoriesFilter';
import { Entypo, AntDesign } from '@expo/vector-icons';
import { setOrientation } from '../configs/orientation';
import * as Speech from 'expo-speech'

export default function SpeakScreen({ navigation }) {

    const { phrase } = useSelector(state => state.phrases)

    useEffect(() => {
        setOrientation(navigation, 'landspace');
    }, [navigation])

    const reproducePhrase = () => {
        let phraseToReproduce = '';
        phrase.forEach(pictogram => {
            phraseToReproduce += `${pictogram.attributes.description} `;
        });
        Speech.speak(phraseToReproduce)
    }

    return (
        <Container>
            <View style={styles.containerPhrase}>
                <Phrase />
                <View style={{ flexDirection: 'row', alignSelf: 'auto'}}>
                    <Button onPress={() =>{}} rounded warning style={{ marginLeft: 15, padding:15, marginRight: 15}}>
                        <AntDesign name='star' color='white' size={28}/>
                    </Button>
                    <Button onPress={reproducePhrase} rounded warning style={{ marginRight: 15, padding:15}}>
                        <Entypo name='megaphone' color='white' size={28}/>
                    </Button>
                </View>
            </View>
            <View style={styles.containerPictograms}>
                <PictogramList isCRUD={false} />
            </View>
            <View style={styles.containerCategories}>
                <CategoriesFilter />
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    containerPhrase: {
        flex: 1.3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#191970'
    },
    containerPictograms: {
        flex: 4,
        alignItems: 'flex-start'
    },
    containerCategories: {
        flex: 0.7,
        justifyContent: 'center',      
        backgroundColor: '#191970'
    }
});

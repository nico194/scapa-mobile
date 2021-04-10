import React from 'react';
import { ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Spinner, Toast } from 'native-base';
import PictogramToPhrase from '../../molecules/pictogram-to-phrase/PictogramToPhrase';
import { removePictogramToPhrase } from '../../../redux/actions/pharses';
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

export default function Phrase({ setOpenModal, phrase, showPhrases = false, onDelete, loading, isRoutine }) {

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.users)

    const phraseToShow = phrase.map( (pictogram, index) => {
        return (
            <PictogramToPhrase
                key={index}
                onPress={() => dispatch(removePictogramToPhrase(index))}
                image={pictogram.image}
                />
        )
    })   

    const reproducePhrase = () => {
        if(phrase.length > 0) {
            let phraseToReproduce = '';
            phrase.forEach(pictogram => {
                phraseToReproduce += `${pictogram.attributes.description} `;
            });
            Speech.speak(phraseToReproduce)
        } else {
            Toast.show({
                text: 'Debe seleccionar al menos un pictograma para reproducir la frase',
                buttonText: 'Aceptar',
                type: 'danger',
                duration: 2000
            })
        }
    }

    const handleSavePhrase = () => {
        phrase.length > 0 ?
            setOpenModal(true)
            :
            Toast.show({
                text: 'Debe seleccionar al menos un pictograma para guardar la frase',
                buttonText: 'Aceptar',
                type: 'danger',
                duration: 2000
            })
    }

    return (
        <View style={{ width: '100%', flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems:'center'}}>
            <ScrollView horizontal style={{ padding: 15 }}>
                <View style={{ flex: 1, flexDirection:'row', alignItems: 'center' }}>
                    { phraseToShow }
                </View>
            </ScrollView>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end'}}>
                {
                    !showPhrases ? 
                    (
                        <Button onPress={handleSavePhrase} rounded warning style={{ marginLeft: 15, padding:15, marginRight: 15}}>
                            <AntDesign name='star' color='white' size={28}/>
                        </Button>
                    ) :
                    (
                        !isRoutine &&
                        <Button onPress={onDelete} rounded danger style={{ marginLeft: 15, padding:15, marginRight: 15}}>
                            {
                                loading ?
                                    <Spinner color="#fff" />
                                    :
                                    <FontAwesome name='trash-o' color='#fff' size={28} />
                            }
                        </Button>
                    )
                }
                {
                    user.voice &&
                        <Button onPress={reproducePhrase} rounded warning style={{ marginRight: 15, padding:15}}>
                            <Entypo name='megaphone' color='white' size={28}/>
                        </Button>
                }
            </View>
        </View>
    )
}

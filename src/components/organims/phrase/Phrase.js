import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PictogramToPhrase from '../../molecules/pictogram-to-phrase/PictogramToPhrase';
import { removePictogramToPhrase } from '../../../redux/actions/phases';
import { ScrollView } from 'react-native';

export default function Phrase() {

    const dispatch = useDispatch()
    const { phrase } = useSelector(state => state.phrases)


    const phraseToShow = phrase.map( (pictogram, index) => {
        return (
            <PictogramToPhrase
                key={index}
                onPress={() => dispatch(removePictogramToPhrase(index))}
                image={pictogram.image}
                />
        )
    })

    return (
        <ScrollView horizontal style={{ padding: 15 }}>
            { phraseToShow }
        </ScrollView>
    )
}

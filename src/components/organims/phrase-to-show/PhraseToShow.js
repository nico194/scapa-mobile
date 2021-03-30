import React from 'react';
import { View } from 'react-native';
import { H3 } from 'native-base';
import { Feather } from '@expo/vector-icons';
import Phrase from '../phrase/Phrase';

export default function PhraseToShow({ loading, description, phrase, showPhrases = false, onDelete, isRoutine =  false }) {
    return (
        <View>
            <View style={{ flexDirection: 'row' }}>
                <Feather name='message-circle' color='#fff' size={20} style={{ marginRight: 10 }}/>
                <H3 style={{ color: '#fff' }}>
                    {description}
                </H3>
            </View>
            <Phrase
                loading={loading}
                showPhrases={showPhrases}
                phrase={phrase}
                onDelete={onDelete}
                isRoutine={isRoutine}
                />
        </View>
    )
}

import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { StyleSheet, ScrollView, View } from 'react-native';
import { H1, Spinner } from 'native-base';
import Pictogram from '../../molecules/pictogram/Pictogram';
import { addPictogramToPhrase } from '../../../redux/actions/phases';

export default function PictogramList() {

    const { filteredPictograms, loadingPictograms } = useSelector(state => state.pictograms)

    const imageButtonToSpeak = require('../../../../assets/speakButtonImage.png');

    const dispatch = useDispatch()

    const pictorgramsList = filteredPictograms.length > 0 && filteredPictograms.map( (pictogram, index) => {
        return (
            <Pictogram 
                key={index}
                onPress={() => dispatch(addPictogramToPhrase(pictogram))} 
                description={pictogram.attributes.description}
                image={imageButtonToSpeak}           
                />
        )
    });

    return (
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
    )
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        padding: 10
    }
});

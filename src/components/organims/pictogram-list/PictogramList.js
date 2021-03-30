import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { StyleSheet, ScrollView, View } from 'react-native';
import { H1, Spinner } from 'native-base';
import Pictogram from '../../molecules/pictogram/Pictogram';
import { deletePictogram } from '../../../redux/actions/pictograms'
import { addPictogramToPhrase } from '../../../redux/actions/pharses';

export default function PictogramList({ isCRUD = false, idCategory, setPictogram, setOperation, setShowAddPictogram }) {
    
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.users)
    const { pictograms, loadingPictograms } = useSelector(state => state.pictograms);

    const updatePictogram = (pictogram) => {
        const pic = {
            id: pictogram.id,
            description: pictogram.attributes.description,
            image: pictogram.image,
            oldImage: pictogram.image,
            idCategory,
        }
        setPictogram(pic);
        setOperation('Actualizar');
        setShowAddPictogram(true)
    }
    
    const pictorgramsList = pictograms !== undefined && pictograms.map( (pictogram, index) => {
        return (
            <Pictogram 
                key={index}
                isCRUD={isCRUD}
                onUpdate={() => updatePictogram(pictogram)}
                onDelete={() => dispatch(deletePictogram(pictogram, user))}
                onPress={() => dispatch(addPictogramToPhrase(pictogram))} 
                description={pictogram.attributes.description}
                image={pictogram.image}           
                />
        )
    });

    return (
        <ScrollView>
            <View style={[styles.pictorgramsContainer, isCRUD && { marginTop: 70 }]}>
                { 
                    loadingPictograms ?
                        <Spinner />
                        :
                        pictograms.length > 0 ?
                            pictorgramsList 
                            :
                            <H1 style={{ color: '#fff' }}>No hay pictogramas cargados aquí</H1>
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    pictorgramsContainer: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    }
})


import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'native-base';
import Category from '../../molecules/category/Category';
import { setAllPictograms, filterPictogramsByCategory } from '../../../redux/actions/pictograms';

export default function CategoriesFilter() {

    const [ categoryIndex, setCategoryIndex ] = useState(-1)

    const dispatch = useDispatch();
    const { categories } = useSelector(state => state.categories)

    const allPictograms = () => {
        setCategoryIndex(-1);
        dispatch(setAllPictograms());
    }

    const filterByCategory = (id, index, isCustom) => {
        setCategoryIndex(index);
        dispatch(filterPictogramsByCategory(id, isCustom))
    }
    
    const categoriesFilter = categories.map((category, index) => {
        return (
            <Category 
                key={index} 
                onPress={() => filterByCategory(category.id, index, category.isCustom)}
                selected={index === categoryIndex}
                lastOne={index === categories.length}
                description={category.attributes.description}
                />
        )
    });


    return (
        <ScrollView horizontal>
            <View style={styles.content}>
                <Button 
                    rounded     
                    warning={ categoryIndex === -1 }
                    onPress={() => allPictograms()} 
                    style={{ alignSelf: 'center' }}>
                    <Text>Todos</Text>
                </Button>
                { categoriesFilter }
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

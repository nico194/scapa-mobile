import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Spinner } from 'native-base';
import Category from '../../molecules/category/Category';
import { getCategories } from '../../../redux/actions/categories';
import { filterPictogramsByCategory } from '../../../redux/actions/pictograms';


export default function CategoriesFilter() {

    const [ categoryIndex, setCategoryIndex ] = useState(0)

    const dispatch = useDispatch();
    const { loadingCategories, categories } = useSelector(state => state.categories);

    useEffect(() => {
        dispatch(getCategories());
    }, [])

    useEffect(() => {
        categories.length > 0 && dispatch(filterPictogramsByCategory(categories[0].id, categories[0].isCustom))
    }, [])

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
            {
                loadingCategories ? 
                    <Spinner color='#fff' />
                    :
                    <View style={styles.content}>
                        { categoriesFilter }
                    </View>
            }
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

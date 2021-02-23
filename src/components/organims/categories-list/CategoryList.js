import React from 'react'
import { ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCategory, updateCategory } from '../../../redux/actions/categories';
import CategoryToList from '../../molecules/category-to-list/CategoryToList';

export default function CategoryList({ navigation, setId, setCategoryDescription, setShowAddCategory, setOperation }) {


    const dispatch = useDispatch();
    const { user } = useSelector(state => state.users);
    const { loadingCategories, categories } = useSelector(state => state.categories); 

    const categoriesList = categories.filter( cat => cat.isCustom).map( (category, index) => {
        return (
            <CategoryToList 
                key={index}
                loading={loadingCategories}
                onPressCategory={() => openModadToEdit(category.id, category.attributes.description)}
                onPressArrow={() => {}}
                onPressDelete={() => dispatch(deleteCategory(category.id, user))}
                description={category.attributes.description}
            />
        )
    });

    const openModadToEdit = (id, description) => {
        setOperation('Editar');
        setId(id);
        setCategoryDescription(description);
        setShowAddCategory(true);
    }

    return (
        <ScrollView scrollEnabled={false}>
            { categoriesList }
        </ScrollView>
    )
}

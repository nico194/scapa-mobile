import React, { useEffect } from 'react'
import { Alert, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCategory, getCategories } from '../../../redux/actions/categories';
import CategoryToList from '../../molecules/category-to-list/CategoryToList';

export default function CategoryList({ navigation, setCategory, setShowAddCategory, setOperation }) {

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.users);
    const { loadingCategories, categories, changedCategories } = useSelector(state => state.categories);
    
    useEffect(() => {
        dispatch(getCategories());
    }, [changedCategories])

    const handleDeleteCategory = (category) => {
        Alert.alert(
            "Eliminar Categoría",
            "¿Esta seguro que desea eliminar esta categoría? Tenga en cuenta que al eliminar esta categoría, se eliminarán los pictogramas que hay dentro de ella.",
            [
              {
                text: "Cancelar",
                style: "cancel"
              },
              { text: "Aceptar", onPress: () => dispatch(deleteCategory(category, user)) }
            ]
        );
    }

    const categoriesList = categories !== undefined && categories.filter( cat => cat.isCustom).map( (category, index) => {
        return (
            <CategoryToList 
                key={index}
                loading={loadingCategories}
                onPressCategory={() => openModadToEdit(category)}
                onPressArrow={() => navigation.navigate('CustomPictograms', { idCategory : category.id })}
                onPressDelete={() => handleDeleteCategory(category)}
                description={category.attributes.description}
            />
        )
    });

    const openModadToEdit = category => {
        setOperation('Editar');
        setCategory({ id: category.id, description: category.attributes.description })
        setShowAddCategory(true);
    }

    return (
        <ScrollView scrollEnabled={false}>
            { categoriesList }
        </ScrollView>
    )
}

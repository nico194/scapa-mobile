import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addCategory, updateCategory, changedStatusCategory, groupAdded, groupDeleted } from '../redux/actions/categories';
import { addPictogram, updatePictogram, changedStatusPictogram, addKeyIntoPictograms, deleteKeyIntoPictograms } from '../redux/actions/pictograms';
import { getUserFromAsyncStorage } from '../redux/actions/users';
import { View } from 'react-native'; 
import { Container, H1, Text, Button, Toast, Root } from 'native-base';
import CustomModal from '../components/molecules/modal/CustomModal';
import CategoryList from '../components/organims/categories-list/CategoryList';
import CategoryForm from '../components/molecules/category-form/CategoryForm';
import PictogramForm from '../components/molecules/pictogram-form/PictogramForm';

export default function CustomCategoriesScreen({ navigation }) {

    const initialStateCategory = {
        id: -1,
        description: ''
    };

    const initialStatePictogram = {
        id: -1,
        description: '',
        image: null,
        idCategory: ''
    }

    const [ operation, setOperation ] = useState('Agregar');
    const [ showAddCategory, setShowAddCategory] = useState(false);
    const [ showAddPictogram, setShowAddPictogram] = useState(false);
    const [ category, setCategory ] = useState(initialStateCategory);
    const [ pictogram, setPictogram ] = useState(initialStatePictogram)

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.users);
    const { loadingCategories, changedCategories, categorySaved, categoryAdded, categoryDeleted } = useSelector(state => state.categories);
    const { loadingPictograms, changedPictograms } = useSelector(state => state.pictograms);

    useEffect(() => {
        dispatch(getUserFromAsyncStorage())
    }, [])

    useEffect(() => {
        if(changedCategories) {
            setShowAddCategory(false);
            setCategory(initialStateCategory);
            dispatch(changedStatusCategory())
        }  
    }, [changedCategories])
    
    useEffect(() => {
        if(categoryAdded) {
            dispatch(addKeyIntoPictograms(categorySaved));
            dispatch(groupAdded());
        }
    }, [categoryAdded])

    useEffect(() => {
        if(categoryDeleted) {
            dispatch(deleteKeyIntoPictograms(categorySaved));
            dispatch(groupDeleted());
        }
    }, [categoryDeleted])

    useEffect(() => {
        if(changedPictograms) {
            setShowAddPictogram(false)
            setPictogram(initialStatePictogram);
            dispatch(changedStatusPictogram())
        }  
    }, [changedPictograms])

    const showAddModal = entity => {
        setOperation('Agregar');
        if(entity === 'category') {
            setShowAddCategory(true);
            setShowAddPictogram(false);
        } else {
            setShowAddCategory(false);
            setShowAddPictogram(true);
        }
    }

    const hideModal = () => {
        setShowAddCategory(false);
        setShowAddPictogram(false);
        setCategory(initialStateCategory);
        setPictogram(initialStatePictogram);
    }

    const addOrEditCustomCategory = () => {
        Object.entries(category).toString() !== Object.entries(initialStateCategory).toString() ?
            operation === 'Agregar' ? dispatch(addCategory(category, user)) : dispatch(updateCategory(category, user))
            :
            Toast.show({
                text: 'Debe completar el campo de descripción',
                buttonText: 'Aceptar',
                type: 'danger',
                duration: 2000
            })
    }

    const addOrEditCustomPictogram = () => {
        isNotValidForm() ?
            Toast.show({
                text: 'Debe completar todos los campos',
                buttonText: 'Aceptar',
                type: 'danger',
                duration: 2000
            })
            :
            operation === 'Agregar' ? dispatch(addPictogram(pictogram, user)) : dispatch(updatePictogram(pictogram, user));
    }

    const isNotValidForm = () => {
        let isNotValid = false;
        Object.keys(pictogram).forEach(key => {
            if (key === 'image') {
                if (pictogram[key] === null) return isNotValid = true
            } else {
                if (pictogram[key] === '' ) return isNotValid = true 
            }
        });
        return isNotValid;
    }
    
    return (
        <Container>
            <CustomModal modalVisible={showAddCategory}>
                <Root>
                    <CategoryForm 
                        loading={loadingCategories}
                        category={category}
                        setCategory={setCategory}
                        operation={operation}
                        addOrEditCustomCategory={addOrEditCustomCategory}
                        hideModal={hideModal}
                        />
                </Root>
            </CustomModal>
            <CustomModal modalVisible={showAddPictogram}>
                <Root>
                    <PictogramForm 
                        loading={loadingPictograms}
                        pictogram={pictogram}
                        setPictogram={setPictogram}
                        operation={operation}
                        addOrEditCustomPictogram={addOrEditCustomPictogram}
                        hideModal={hideModal}
                        hasCategory={false}
                        navigation={navigation}
                        />
                </Root>
            </CustomModal>
            <H1 style={{ textAlign: 'center', marginBottom: 20, color: '#fff' }}>Categorias</H1>
            <View style={{ flex: .2, flexDirection: 'row', justifyContent: 'space-around' }}>
                <Button dark onPress={() => showAddModal('category')}>
                    <Text>Agregar Categoría</Text>
                </Button>
                <Button dark onPress={() => showAddModal('pictogram')}>
                    <Text>Agregar Pictograma</Text>
                </Button>
            </View>
            <CategoryList
                navigation={navigation}
                setCategory={setCategory}
                setShowAddCategory={setShowAddCategory}
                setOperation={setOperation}
                />
        </Container>
    )
}

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addCategory, updateCategory, changedStatusCategory } from '../redux/actions/categories';
import { addPictogram, updatePictogram, changedStatusPictogram } from '../redux/actions/pictograms';
import { View } from 'react-native'; 
import { Container, H1, Text, Button } from 'native-base';
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
        idCategory: -1
    }

    const [ operation, setOperation ] = useState('Agregar');
    const [ showAddCategory, setShowAddCategory] = useState(false);
    const [ showAddPictogram, setShowAddPictogram] = useState(false);
    const [ category, setCategory ] = useState(initialStateCategory);
    const [ pictogram, setPictogram ] = useState(initialStatePictogram)

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.users);
    const { loadingCategories, changedCategories } = useSelector(state => state.categories);
    const { loadingPictograms, changedPictograms } = useSelector(state => state.pictograms);

    useEffect(() => {
        if(changedCategories) {
            setShowAddCategory(false);
            setCategory(initialStateCategory);
            dispatch(changedStatusCategory())
        }  
    }, [changedCategories])

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
        operation === 'Agregar' ? dispatch(addCategory(category, user)) : dispatch(updateCategory(category, user));
    }

    const addOrEditCustomPictogram = () => {
        operation === 'Agregar' ? dispatch(addPictogram(pictogram, user)) : dispatch(updatePictogram(pictogram, user));
    }
    
    return (
        <Container>
            <CustomModal modalVisible={showAddCategory}>
                <CategoryForm 
                    loading={loadingCategories}
                    category={category}
                    setCategory={setCategory}
                    operation={operation}
                    addOrEditCustomCategory={addOrEditCustomCategory}
                    hideModal={hideModal}
                    />
            </CustomModal>
            <CustomModal modalVisible={showAddPictogram}>
                <PictogramForm 
                    loading={loadingPictograms}
                    pictogram={pictogram}
                    setPictogram={setPictogram}
                    operation={operation}
                    addOrEditCustomPictogram={addOrEditCustomPictogram}
                    hideModal={hideModal}
                    hasCategory={false}
                    />
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

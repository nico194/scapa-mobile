import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { View } from 'react-native';
import { Container, H1, Button, Text } from 'native-base';
import { addPictogram, filterPictogramsByCategory, updatePictogram, changedStatusPictogram } from '../redux/actions/pictograms';
import CustomModal from '../components/molecules/modal/CustomModal';
import PictogramForm from '../components/molecules/pictogram-form/PictogramForm';
import PictogramList from '../components/organims/pictogram-list/PictogramList';

export default function CustomPictogramsScreen({ route, navigation }) {

    const initialStatePictogram = {
        id: -1,
        description: '',
        image: null,
        idCategory: route.params.idCategory
    }

    const [ pictogram, setPictogram ] = useState(initialStatePictogram)
    const [ operation, setOperation ] = useState('Agregar');
    const [ showAddPictogram, setShowAddPictogram] = useState(false);

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.users)
    const { loadingPictograms, changedPictograms } = useSelector(state => state.pictograms)

    useEffect(() => {
        dispatch(filterPictogramsByCategory(route.params.idCategory, true))
    }, [])

    useEffect(() => {
        if(changedPictograms) {
            dispatch(filterPictogramsByCategory(route.params.idCategory, true))
            setShowAddPictogram(false)
            setPictogram(initialStatePictogram);
            dispatch(changedStatusPictogram())
        }  
    }, [changedPictograms])

    const showAddModal = () => {
        setOperation('Agregar');
        setShowAddPictogram(true);
    }

    const hideModal = () => {
        setShowAddPictogram(false);
        setPictogram(initialStatePictogram);
    }

    const addOrEditCustomPictogram = () => {
        operation === 'Agregar' ? dispatch(addPictogram(pictogram, user)) : dispatch(updatePictogram(pictogram, user));
    }

    return (
        <Container>
            <CustomModal modalVisible={showAddPictogram}>
                <PictogramForm 
                    loading={loadingPictograms}
                    pictogram={pictogram}
                    setPictogram={setPictogram}
                    operation={operation}
                    addOrEditCustomPictogram={addOrEditCustomPictogram}
                    hideModal={hideModal}
                    hasCategory={true}
                    />
            </CustomModal>
            <H1 style={{ textAlign: 'center', marginBottom: 30, color: '#fff' }}>Pictogramas</H1>
            <View style={{ width: '100%', flex: .2, flexDirection: 'row', justifyContent: 'center' }}>
                <Button dark onPress={showAddModal}>
                    <Text>Agregar Pictograma</Text>
                </Button>
            </View>
            <PictogramList 
                isCRUD={true}
                setPictogram={setPictogram}
                setOperation={setOperation}
                setShowAddPictogram={setShowAddPictogram}
                idCategory={route.params.idCategory}
                />
        </Container>
    )
}

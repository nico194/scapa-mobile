import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { View } from 'react-native'; 
import { Container, Content, H1, Text, Button, SwipeRow, Icon, Form, Item, Label, Input, Card, CardItem, Spinner } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import CustomModal from '../components/molecules/modal/CustomModal';
import { addCategory, updateCategory, changedStatusCategory } from '../redux/actions/categories';
import CategoryList from '../components/organims/categories-list/CategoryList';

export default function CustomCategoriesScreen({ navigation }) {

    const [ showAddCategory, setShowAddCategory] = useState(false);
    const [ showAddPictogram, setShowAddPictogram] = useState(false);
    const [ operation, setOperation ] = useState('Agregar')
    const [ id, setId ] = useState(-1);
    const [ categoryDescription, setCategoryDescription ] = useState('');
    const [ pictogramDescription, setPictogramDescription ] = useState('');
    const [ pictogramImage, setPictogramImage ] = useState('');
    const [ pictogramCategoryId, setPictogramCategoryId ] = useState('');

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.users);
    const { loadingCategories, changedCategories } = useSelector(state => state.categories); 

    console.log('changed: ', changedCategories)

    useEffect(() => {
        if(changedCategories) {
            setId(-1);
            setCategoryDescription('');
            setShowAddCategory(false);
            dispatch(changedStatusCategory())
        }  
    }, [changedCategories])

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
    }

    const addOrEditCustomCategory = () => {
        operation === 'Agregar' ? dispatch(addCategory(categoryDescription, user)) : dispatch(updateCategory(id, categoryDescription, user));
    }
    
    return (
        <Container>
            <CustomModal modalVisible={showAddCategory}>
                <H1>{`${operation} categoría`}</H1>
                <Form>
                    <Item style={{ marginBottom: 40}} floatingLabel>
                        <Label>Descripcion</Label>
                        <Input value={categoryDescription} onChangeText={ value => setCategoryDescription(value)}/>
                    </Item>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent:'space-between' }}>
                        <Button warning onPress={hideModal}>
                            <Text>Cancelar</Text>
                        </Button>
                        <Button dark onPress={addOrEditCustomCategory}>
                            <Text>{operation}</Text>
                            { loadingCategories && <Spinner color='#fff'/>}
                        </Button>
                    </View>
                </Form>
            </CustomModal>
            <CustomModal modalVisible={showAddPictogram}>
                <H1>{`${operation} pictograma`}</H1>
                <Form>
                    <Item style={{ marginBottom: 40 }} floatingLabel>
                        <Label>Descripcion</Label>
                        <Input onChangeText={ value => setPassword(value)}/>
                    </Item>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent:'space-between' }}>
                        <Button warning onPress={hideModal}>
                            <Text>Cancelar</Text>
                        </Button>
                        <Button dark onPress={hideModal}>
                            <Text>{operation}</Text>
                        </Button>
                    </View>
                </Form>
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
                setId={setId}
                setCategoryDescription={setCategoryDescription}
                setShowAddCategory={setShowAddCategory}
                setOperation={setOperation}
                showAddCategory={showAddCategory}
                />
        </Container>
    )
}

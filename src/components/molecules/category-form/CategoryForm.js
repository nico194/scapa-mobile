import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View } from 'react-native';
import { Button, Form, H1, Input, Item, Label, Spinner, Text } from 'native-base';
import ErrorMessage from '../error-message/ErrorMessage'
import { emptyPhrases } from '../../../redux/actions/pharses';
import { emptyPictograms } from '../../../redux/actions/pictograms';
import { emptyCategories } from '../../../redux/actions/categories';
import { logOutUser } from '../../../redux/actions/users';

export default function CategoryForm({ loading, operation, setCategory, category, addOrEditCustomCategory, hideModal }) {

    const dispatch = useDispatch();
    const { err } = useSelector(state => state.categories)

    const handleOnChangeText = (name, value) => {
        setCategory({
            ...category,
            [name]: value
        })
    }

    const goToLogin = () => {
        dispatch(emptyPhrases());
        dispatch(emptyPictograms());
        dispatch(emptyCategories());
        dispatch(logOutUser())
    }

    return (
        <View>
            <H1>{`${operation} categoría`}</H1>
            {
                err &&
                <ErrorMessage 
                    message={getResourseErrorMessage(err.status)}
                    showButton={err.status === 401}
                    messageButton='Volver a iniciar sesión'
                    onPress={goToLogin}
                    />
            }
            <Form>
                <Item style={{ marginBottom: 40}} floatingLabel>
                    <Label>Descripcion</Label>
                    <Input value={category.description} onChangeText={ value => handleOnChangeText('description', value)}/>
                </Item>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent:'space-between' }}>
                    <Button warning onPress={hideModal}>
                        <Text>Cancelar</Text>
                    </Button>
                    <Button dark onPress={addOrEditCustomCategory}>
                        <Text>{operation}</Text>
                        { loading && <Spinner color='#fff'/>}
                    </Button>
                </View>
            </Form>
        </View>
    )
}

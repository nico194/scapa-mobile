import React from 'react';
import { View } from 'react-native'
import { Button, Form, H1, Input, Item, Label, Spinner, Text } from 'native-base'

export default function CategoryForm({ loading, operation, setCategory, category, addOrEditCustomCategory, hideModal }) {

    const handleOnChangeText = (name, value) => {
        setCategory({
            ...category,
            [name]: value
        })
    }

    return (
        <View>
            <H1>{`${operation} categoría`}</H1>
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

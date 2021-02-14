import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Container, Content, H1, Text, Button, List } from 'native-base'

export default function CustomisationScreen({ navigation }) {

    const { categories } = useSelector(state => state.categories) 
    
    return (
        <Container>
            <Content padder contentContainerStyle={{ padding: 15 }}>
                <H1 style={{ textAlign: 'center', marginBottom: 20 }}>Configuraciones</H1>
                <Content padder contentContainerStyle={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Button primary>
                        <Text>Agregar Categoría</Text>
                    </Button>
                    <Button primary>
                        <Text>Agregar Pictograma</Text>
                    </Button>
                </Content>
                <Content>
                    <List>
                    
                    </List>
                </Content>
            </Content>
        </Container>
    )
}

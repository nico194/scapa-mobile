import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Container, Content, Spinner, H2 } from 'native-base';
import { setOrientation } from '../configs/orientation';
import { getAllCategories } from '../redux/actions/categories';
import { getAllPictograms } from '../redux/actions/pictograms';

export default function LoadingResourseScreen({ navigation }) {

    const dispatch = useDispatch();

    const { user } = useSelector(state => state.users);
    const { categoriesIsReady }  = useSelector(state => state.categories);
    const { pictogramsIsReady } = useSelector(state => state.pictograms);

    useEffect(() => {
        setOrientation(navigation, 'landspace')
    }, [navigation]);

    useEffect(() => {
        dispatch(getAllCategories(user));
    }, [])
    
    useEffect(() => {
        dispatch(getAllPictograms(user))
    }, [])

    useEffect(() => {
        categoriesIsReady && pictogramsIsReady && navigation.navigate('Home');
    }, [categoriesIsReady, pictogramsIsReady])

    return (
        <Container>
            <Content padder contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> 
                <Spinner color='#fff'/>
                <H2 style={{ color: '#fff' }}>Espere mientras cargamos los recursos necesarios...</H2>
            </Content>
        </Container>
    )
}



import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Container, Content, Spinner, H2 } from 'native-base';
import { setOrientation } from '../configs/orientation'
import CustomHeader from '../components/header/CustomHeader';
import { getAllCategories } from '../redux/actions/categories';
import { getAllPictograms } from '../redux/actions/pictograms';

export default function LoadingResourseScreen({ navigation }) {

    const dispatch = useDispatch();

    const { user } = useSelector(state => state.users);
    const { categories }  = useSelector(state => state.categories);
    const { pictograms } = useSelector(state => state.pictograms);

    useEffect(() => {
        setOrientation(navigation, 'landspace')
    }, [navigation]);

    useEffect(() => {
        dispatch(getAllCategories(user))
    }, [dispatch, user]);

    useEffect(() => {
        dispatch(getAllPictograms(user))
    }, [dispatch, user]);

    useEffect(() => {
        categories.length > 0 && pictograms.length > 0 && navigation.navigate('Home');
    }, [categories, pictograms])

    return (
        <Container>
            <CustomHeader />
            <Content padder contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> 
                <Spinner/>
                <H2>Espere mientras cargamos los recursos necesarios...</H2>
            </Content>
        </Container>
    )
}



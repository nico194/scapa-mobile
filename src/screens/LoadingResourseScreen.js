import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Container, Content, Spinner, H2 } from 'native-base';
import { setOrientation } from '../configs/orientation'
import CustomHeader from '../components/header/CustomHeader';
import { getCategoriesAdmin } from '../redux/actions/categories';

export default function LoadingResourseScreen({ navigation }) {

    const dispatch = useDispatch();

    const { user } = useSelector(state => state.users);
    console.log('this is a user logged: ', user)

    useEffect(() => {
        setOrientation(navigation, 'landspace')
    }, [navigation]);

    useEffect(() => {
        dispatch(getCategoriesAdmin(user))
    }, [dispatch, user])


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



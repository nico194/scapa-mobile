import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Button, Form, H1, Input, Item, Label, Text, Spinner, Root, Icon } from 'native-base';
import CustomModal from '../components/molecules/modal/CustomModal';
import Phrase from '../components/organims/phrase/Phrase';
import PictogramList from '../components/organims/pictogram-list/PictogramList';
import CategoriesFilter from '../components/organims/categories-filter/CategoriesFilter';
import { setOrientation } from '../configs/orientation';
import { getUserFromAsyncStorage, logOutUser } from '../redux/actions/users';
import { addPhrase, emptyPhrases } from '../redux/actions/pharses';
import { emptyPictograms } from '../redux/actions/pictograms';
import { emptyCategories } from '../redux/actions/categories';

export default function SpeakScreen({ navigation }) {

    const [openModal, setOpenModal] = useState(false);
    const [description, setDescription] = useState('');
    const [showError, setShowError] = useState(false);

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.users)
    const { loadingPhrases, phrase, changedPhrase, err } = useSelector(state => state.phrases)
    
    useEffect(() => {
        setOrientation(navigation, 'landspace');
    }, [navigation])

    useEffect(() => {
        dispatch(getUserFromAsyncStorage())
    }, [])

    const hideModal = () => {
        setDescription('');
        setOpenModal(false);
    }

    const savePhrase = () => {
        if(description !== '') {
            setShowError(false)
            const phraseToAdd= {
                pictograms: phrase,
                description
            }
            dispatch(addPhrase(phraseToAdd, user));   
        } else {
            setShowError(true)
        }
    }

    useEffect(() => {
        changedPhrase && setOpenModal(false)
    }, [changedPhrase])


    const goToLogin = () => {
        dispatch(emptyPhrases());
        dispatch(emptyPictograms());
        dispatch(emptyCategories());
        dispatch(logOutUser())
    }
    

    return (
        <View style={{ flex: 1}}>
            <CustomModal modalVisible={openModal}>
                <H1 style={{ marginBottom: 20}}>Ingrese una descripción para el recuerdo:</H1>
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
                    <Item style={{ marginBottom: 40}} floatingLabel error={showError}>
                        <Label>Descripción</Label>
                        <Input onChangeText={ value => setDescription(value)}/>
                        {
                            showError && 
                                <Icon name='close-circle' />
                        }
                    </Item>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent:'space-between' }}>
                        <Button warning onPress={hideModal}>
                            <Text>Cancelar</Text>
                        </Button>
                        <Button dark onPress={savePhrase}>
                            <Text>Guardar</Text>
                            { loadingPhrases && <Spinner color='white' />}
                        </Button>
                    </View>                    
                </Form>
            </CustomModal>
            <Container>
                <Root>
                    <View style={styles.containerPhrase}>
                        <Phrase
                            setOpenModal={setOpenModal} 
                            phrase={phrase}
                            />
                    </View>
                    <View style={styles.containerPictograms}>
                        <PictogramList isCRUD={false} />
                    </View>
                    <View style={styles.containerCategories}>
                        <CategoriesFilter />
                    </View>
                </Root>
            </Container>
        </View>
    );
}

const styles = StyleSheet.create({
    containerPhrase: {
        flex: 1.3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#191970'
    },
    containerPictograms: {
        flex: 4,
        alignItems: 'flex-start'
    },
    containerCategories: {
        flex: 0.7,
        justifyContent: 'center',      
        backgroundColor: '#191970'
    }
});

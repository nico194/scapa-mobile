import React, { useEffect } from 'react'
import { Container, Content, H1, H2, H4, Spinner, View } from 'native-base'
import { useDispatch, useSelector } from 'react-redux';
import { Alert, ScrollView } from 'react-native';
import ErrorMessage from '../components/molecules/error-message/ErrorMessage'
import { deletePhrase, emptyPhrases, getPhrases } from '../redux/actions/pharses';
import { getUserFromAsyncStorage, logOutUser } from '../redux/actions/users';
import EmptyPhrase from '../components/molecules/empty-phrase/EmptyPhrase';
import PhraseToShow from '../components/organims/phrase-to-show/PhraseToShow';
import { getResourseErrorMessage } from '../configs/manageError';
import { emptyPictograms } from '../redux/actions/pictograms';
import { emptyCategories } from '../redux/actions/categories';

export default function MemoriesScreen({ navigation }) {

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.users)
    const { phrases, loadingPhrases, err } = useSelector(state => state.phrases);

    useEffect(() => {
        dispatch(getUserFromAsyncStorage())
    }, [])

    useEffect(() => {
        dispatch(getPhrases());
    }, [])

    const handleDeleteMemory = (memory) => {
        Alert.alert(
            "Eliminar Recuerdo",
            "¿Esta seguro que desea eliminar este Recuerdo?",
            [
              {
                text: "Cancelar",
                style: "cancel"
              },
              { text: "Aceptar", onPress: () => dispatch(deletePhrase(memory, user)) }
            ]
        );
    }
    

    const phrasesList = phrases.length > 0 && phrases.filter(memory => memory.type === 'remembrance').map((memory, index) => {
        return (
            <PhraseToShow
                key={index}
                loading={loadingPhrases}
                description={memory.description}
                phrase={memory.pictograms}
                showPhrases={true}
                isRoutine={false}
                onDelete={() => handleDeleteMemory(memory)}
                />
        )
    });

    const goToLogin = () => {
        dispatch(emptyPhrases());
        dispatch(emptyPictograms());
        dispatch(emptyCategories());
        dispatch(logOutUser())
    }

    return (
        <Container>
            <Content padder>
                <H1 style={{ fontSize: 40, color: '#fff', paddingTop: 30, marginBottom: 30}}>Recuerdos</H1>
                {
                    err &&
                        <ErrorMessage 
                            message={getResourseErrorMessage(err.status)}
                            showButton={err.status === 401}
                            messageButton='Volver a iniciar sesión'
                            onPress={goToLogin}
                            />
                }
                <ScrollView>
                    {
                        loadingPhrases ?
                            <Spinner color='#fff'/>
                            :
                            (
                                phrases.filter(memory => memory.type === 'remembrance').length === 0 ?
                                    <EmptyPhrase goTo={() => navigation.navigate('Speak')}  />
                                    :
                                    phrasesList
                            )
                    }
                </ScrollView>
            </Content>
        </Container>
    )
}

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Container, Content, H1, Spinner } from 'native-base'
import { getUserFromAsyncStorage, logOutUser } from '../redux/actions/users';
import { emptyPhrases, getPhrases } from '../redux/actions/pharses';
import { emptyCategories } from '../redux/actions/categories';
import { emptyPictograms } from '../redux/actions/pictograms';
import PhraseToShow from '../components/organims/phrase-to-show/PhraseToShow';
import { ScrollView } from 'react-native';
import EmptyPhrase from '../components/molecules/empty-phrase/EmptyPhrase';

export default function RoutinesScreen() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.users)
    const { phrases, loadingPhrases, err } = useSelector(state => state.phrases);

    useEffect(() => {
        dispatch(getUserFromAsyncStorage())
    }, [])

    useEffect(() => {
        dispatch(getPhrases());
    }, [])

    const phrasesList = phrases.length > 0 && phrases.filter(routine => routine.type === 'routine').map((routine, index) => {
        return (
            <PhraseToShow
                key={index}
                loading={loadingPhrases}
                description={routine.description}
                phrase={routine.pictograms}
                showPhrases={true}
                isRoutine={true}
                onDelete={() => dispatch(deletePhrase(routine, user))}
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
                <H1 style={{ fontSize: 40, color: '#fff', paddingTop: 30, marginBottom: 30}}>Rutinas</H1>
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
                                phrases.filter(memory => memory.type === 'routine').length === 0 ?
                                    <EmptyPhrase goTo={false}  />
                                    :
                                    phrasesList
                            )
                    }
                </ScrollView>
            </Content>
        </Container>
    )
}

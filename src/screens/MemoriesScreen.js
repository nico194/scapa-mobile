import React, { useEffect } from 'react'
import { Container, Content, H1, H2, H4, Spinner, View } from 'native-base'
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native';
import { deletePhrase, getPhrases } from '../redux/actions/pharses';
import { getUserFromAsyncStorage } from '../redux/actions/users';
import EmptyPhrase from '../components/molecules/empty-phrase/EmptyPhrase';
import PhraseToShow from '../components/organims/phrase-to-show/PhraseToShow';

export default function MemoriesScreen({ navigation }) {

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.users)
    const { phrases, loadingPhrases } = useSelector(state => state.phrases);

    console.log('phs: ', phrases)

    useEffect(() => {
        dispatch(getUserFromAsyncStorage())
    }, [])

    useEffect(() => {
        dispatch(getPhrases());
    }, [])

    const phrasesList = phrases.length > 0 && phrases.filter(memory => memory.type === 'remembrance').map((memory, index) => {
        return (
            <PhraseToShow
                key={index}
                loading={loadingPhrases}
                description={memory.description}
                phrase={memory.pictograms}
                showPhrases={true}
                isRoutine={false}
                onDelete={() => dispatch(deletePhrase(memory, user))}
                />
        )
    });

    return (
        <Container>
            <Content padder>
                <H1 style={{ fontSize: 40, color: '#fff', paddingTop: 30, marginBottom: 30}}>Recuerdos</H1>
                <ScrollView>
                    {
                        loadingPhrases ?
                            <Spinner color='#fff'/>
                            :
                            (
                                phrases.length == 0 ?
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

import React, { useEffect } from "react";
import { Container, Footer, FooterTab, Button, Icon, H2} from 'native-base';
import { setOrientation } from '../configs/orientation';

export default function SpeakScreen({ navigation }) {
    
    useEffect(() => {
        setOrientation(navigation, 'landspace')
    }, [navigation])

    return (
        <Container>
            <H2>Speasss</H2>
        </Container>
    );
}

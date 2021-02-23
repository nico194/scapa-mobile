import React from 'react'
import { Body, Button, Header, Icon, Left, Right, Title } from 'native-base'

export default function CustomHeader({ hasBack, onClickBack, title, rightElements }) {
    return (
        <Header>
            <Left>
                <Button transparent>
                    { hasBack && <Icon onPress={ onClickBack } name='arrow-back' />}
                </Button>
            </Left>
            <Body>
                <Title>{ title }</Title>
            </Body>
            <Right>
                { rightElements }
            </Right>
        </Header>
    )
}

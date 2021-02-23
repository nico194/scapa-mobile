import React from 'react'
import { Button, Text } from 'native-base'

export default function Category({ onPress, description, selected, lastOne }) {
    return (
        <Button
            rounded     
            onPress={onPress} 
            warning={selected}
            style={[{alignSelf: 'center'}, lastOne ? { marginLeft: 0 }: { marginLeft: 10 }]}>
            <Text>{ description }</Text>
        </Button>
    )
}

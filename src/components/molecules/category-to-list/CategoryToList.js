import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Button, Icon, Spinner, SwipeRow, Text } from 'native-base';
import { AntDesign } from '@expo/vector-icons'

export default function CategoryToList({ onPressCategory, onPressArrow, onPressDelete, description, loading }) {
    return (
        <SwipeRow
            style={{ width: '100%' }}
            rightOpenValue={-75}
            body={
                <TouchableOpacity onPress={onPressCategory}  style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                    <Text>{ description }</Text>
                    <AntDesign onPress={onPressArrow} name="right" size={28} />
                </TouchableOpacity>
            }
            right={
                <Button danger onPress={onPressDelete}>
                    {
                        loading ?
                            <Spinner color='#fff' />
                            :
                            <Icon active name="trash" />
                    }
                </Button>
            }
        />
    )
}

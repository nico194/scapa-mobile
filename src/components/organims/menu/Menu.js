import React from 'react';
import ButtonMenu from '../../molecules/button-menu/ButtonMenu';
import { menuNav } from '../../../configs/navigationMenu';
import { View, StyleSheet } from 'react-native';

export default function Menu({ navigation }) {

    const menu = menuNav.map( (item, index) => {
        return (
            <ButtonMenu 
                key={index}
                onPress={ () => navigation.navigate(item.goto) }
                label={item.label}
                image={item.image}
                />
        )
    })

    return (
        <View style={styles.centerComponents}>
            { menu }
        </View>
    )
}


const styles = StyleSheet.create({ 
    centerComponents: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
    }
})

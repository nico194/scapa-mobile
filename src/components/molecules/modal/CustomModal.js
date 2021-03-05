import React from 'react'
import { View, Modal } from 'react-native';

export default function CustomModal({ children, modalVisible }) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            >
                <View style={{backgroundColor:'#000000aa', flex: 1}} >
                    <View style={{backgroundColor:'white', margin: 20, padding: 15, borderRadius: 10, flex:1}}>
                        { children }
                    </View>
                </View>
        </Modal>
    )
}

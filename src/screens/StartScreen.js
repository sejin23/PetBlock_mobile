import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackActions } from '@react-navigation/native';

export default function StartScreen({navigation}) {
    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <Text style={{fontFamily: 'Ubuntu_500Medium', fontSize: 40, color: '#000036' }}>PetBlock</Text>
            </View>
            <View style={styles.body}>
                {/* <Text>Petblock is ...</Text> */}
            </View>
            <View style={styles.footer}>
                <TouchableOpacity style={[styles.signButton, {backgroundColor: '#000036'}]} onPress={()=>navigation.dispatch(StackActions.push("SignIn"))}>
                    <Text style={{fontFamily: 'Ubuntu_500Medium', fontSize: 18, color: '#F5F5F5' }}>LOGIN</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.signButton} onPress={()=>navigation.dispatch(StackActions.push("ToS"))}>
                    <Text style={{fontFamily: 'Ubuntu_500Medium', fontSize: 18, color: '#000036' }}>SIGN UP</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingTop: 20,
        paddingBottom: 15
    },
    header: {
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    body: {
        flex: 1,
    },
    footer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    signButton: {
        flex: 1,
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
})
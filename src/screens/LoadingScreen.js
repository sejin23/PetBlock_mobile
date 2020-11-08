import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { URL } from '../config';

function LoadingBase({ navigation, requestLogin, successLogin, failureLogin }) {
    useEffect(() => {
        const fetchLoginData = async () => {
            try {
                requestLogin();
                const arrData = await AsyncStorage.getItem("loginData");
                if(arrData) {
                    const data = JSON.parse(arrData);
                    await fetch(URL + 'auth/users/signIn', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: data.email,
                            password: data.password
                        })
                    })
                    .then(response => response.json())
                    .then(res => {
                        if(res.result) {
                            successLogin({email: data.email, password: data.password, id: res.id});
                            navigation.dispatch(StackActions.replace('Home'));
                        } else {
                            failureLogin();
                            navigation.dispatch(StackActions.replace('Start'));
                        }
                    })
                } else navigation.dispatch(StackActions.replace('Start'));
            } catch(e) {
                failureLogin();
                AsyncStorage.removeItem("loginData");
                navigation.dispatch(StackActions.replace('Start'));
            }
        }
        fetchLoginData();
    }, []);
    return (
        <View style={styles.container}>
        <StatusBar style="dark" />
            <Text style={{fontFamily: 'Ubuntu_500Medium', fontSize: 40, color: '#000036', marginBottom: 30 }}>
                PetBlock
            </Text>
            <ActivityIndicator size='large' color='#000036' />
        </View>
    );
}

const mapDispatchToProps = (dispatch) => ({
    requestLogin: () => dispatch(actions.loginRequest()),
    successLogin: (msg) => dispatch(actions.loginSuccess(msg)),
    failureLogin: () => dispatch(actions.loginFailure())
});

export default LoadingScreen = connect(
    null,
    mapDispatchToProps
)(LoadingBase);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
})
import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions } from '@react-navigation/native';
import {
    View,
    Text,
    Keyboard,
    TextInput,
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { URL } from '../config';
import { TermOfService } from '../TOS';

const {width, height} = Dimensions.get('window');

function SignInBase({navigation, requestLogin, successLogin, failureLogin}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [eyeOpen, setEyeOpen] = useState(false);
    const [focused, setFocused] = useState(false);
    const [isChecked, setChecked] = useState(false);
    const [usableButton, setUsableButton] = useState(true);
    const passEl = useRef(null);
    const login = async () => {
        if(email && password) {
            setUsableButton(false);
            requestLogin();
            await fetch(URL + '/auth/users/signIn', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
            .then(response => response.json())
            .then(res => {
                if(res.result) {
                    if(isChecked)
                        AsyncStorage.setItem("loginData", JSON.stringify({email: email, password: password}));
                    successLogin({email: email, password: password, id: res.id});
                    navigation.dispatch(StackActions.pop(2))
                    navigation.dispatch(StackActions.push('Home'))
                } else {
                    failureLogin();
                    alert(res.errorMsg);
                    setUsableButton(true);
                }
            })
        }
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
            <StatusBar style='light' />
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPressOut={()=>navigation.dispatch(StackActions.pop(1))}>
                    <Feather name='chevron-left' size={30} color='#F5F5F5' />
                </TouchableOpacity>
                <Text style={[styles.fontFamily, {fontSize: 40}]}>PetBlock</Text>
            </View>
            <View style={[styles.body, {height: focused? height - 420: height - 225}]}>
                <View style={{width: '100%', padding: 20}}>
                    <View style={styles.textInput}>
                        <TextInput
                            style={[styles.inputStyle, {color: 'white'}]}
                            size={20}
                            placeholder="Email"
                            placeholderTextColor="#F5F5F5"
                            onFocus={()=>setFocused(true)}
                            onBlur={()=>setFocused(false)}
                            onChangeText={text => setEmail(text)}
                            defaultValue={email}
                            onSubmitEditing={()=>passEl.current.focus()}/>
                    </View>
                    <View style={styles.textInput}>
                        <TextInput
                            style={[styles.inputStyle, {color: '#F5F5F5'}]}
                            ref={passEl}
                            size={20}
                            placeholder="Password"
                            placeholderTextColor="#F5F5F5"
                            onFocus={()=>setFocused(true)}
                            onBlur={()=>setFocused(false)}
                            onChangeText={text => setPassword(text)}
                            defaultValue={password}
                            secureTextEntry={eyeOpen? false: true}/>
                    {eyeOpen?
                        <MaterialCommunityIcons name='eye' size={24} color='#F5F5F5' onPress={()=>setEyeOpen(false)}/>:
                        <MaterialCommunityIcons name='eye-off' size={24} color='#F5F5F5' onPress={()=>setEyeOpen(true)}/>
                    }
                    </View>
                    <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'center', marginTop: 5}} onPress={()=>setChecked(!isChecked)}>
                        <Feather name={isChecked? 'check-square': 'square'} size={20} color='#F5F5F5'/>
                        <Text style={[styles.fontFamily, {marginLeft: 8}]}>remember me</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                        <Text style={styles.fontFamily}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={()=>usableButton && login()}>
                    <Text style={[styles.fontFamily, {fontSize: 18, color: '#000036'}]}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
        </TouchableWithoutFeedback>
    );
}

const mapDispatchToProps = (dispatch) => ({
    requestLogin: () => dispatch(actions.loginRequest()),
    successLogin: msg => dispatch(actions.loginSuccess(msg)),
    failureLogin: () => dispatch(actions.loginFailure())
});

export const SignIn = connect(
    null,
    mapDispatchToProps
)(SignInBase);

export function ToS({navigation}) {
    const [isChecked, setChecked] = useState(false);
    return (
        <View style={[styles.container, {backgroundColor: '#F5F5F5'}]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPressOut={()=>navigation.dispatch(StackActions.pop(1))}>
                    <Feather name='chevron-left' size={30} color='#000036' />
                </TouchableOpacity>
                <Text style={[styles.fontFamily, {fontSize: 40, color: '#000036'}]}>PetBlock</Text>
            </View>
            <View style={[styles.body, {flex: 1, paddingBottom: 30}]}>
                <View style={{flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', marginLeft: 10, marginBottom: 5}}>
                    <Feather name='chevrons-right' size={20} color='black'/>
                    <Text style={[styles.fontFamily, {fontSize: 18, color: 'black', marginLeft: 5}]}>이용약관</Text>
                </View>
                <ScrollView style={styles.scrollText}>
                    <Text>{TermOfService}</Text>
                </ScrollView>
                <TouchableOpacity style={styles.checkBox} onPress={()=>setChecked(!isChecked)}>
                    <Feather name={isChecked? 'check-square': 'square'} size={20} color='black'/>
                    <Text style={[styles.fontFamily, {marginLeft: 8, color: 'black'}]}>이용약관에 동의합니다</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.footer}>
            {isChecked?
                <TouchableOpacity style={[styles.button, {backgroundColor: '#000036'}]} onPress={()=>navigation.dispatch(StackActions.replace("SignUp"))}>
                    <Text style={[styles.fontFamily, {fontSize: 18}]}>Next</Text>
                </TouchableOpacity>:
                <View style={[styles.button, {backgroundColor: '#4C516D'}]}>
                    <Text style={[styles.fontFamily, {fontSize: 18}]}>Next</Text>
                </View>
            }
            </View>
        </View>
    );
}

export function SignUp({navigation}) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [focused, setFocused] = useState(false);
    const activateButton = () => {
        if(password === '' || email === '' || name === '') return false
        else if(password === confirm) return true;
        return false;
    }
    const confirmData = () => {
        if(!email.includes('@')) {
            alert("Email must be in the form of an email address");
            return false;
        } else if(password.length < 8) {
            alert('Password must be at least 9 characters long.');
            return false;
        } else return true;
    }
    const join = async () => {
        if(confirmData() === true) {
            await fetch(URL + '/auth/users/signUp', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            })
            .then(response => response.json())
            .then(res => {
                if(res.result) {
                    navigation.dispatch(StackActions.replace('Complete'))
                } else {
                    alert(res.errorMsg);
                }
            })
        }
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, {backgroundColor: '#F5F5F5'}]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPressOut={()=>navigation.dispatch(StackActions.pop(1))}>
                    <Feather name='chevron-left' size={30} color='#000036' />
                </TouchableOpacity>
                <Text style={[styles.fontFamily, {fontSize: 40, color: '#000036'}]}>PetBlock</Text>
            </View>
            <View style={[styles.body, {height: focused? height - 420: height - 225}]}>
                <View style={{width: '100%', padding: 20}}>
                    <View style={[styles.textInput, {borderBottomColor: '#666699'}]}>
                        <MaterialCommunityIcons name='shield-account-outline' size={20} color='#666699'/>
                        <TextInput
                            style={styles.inputStyle}
                            size={20}
                            placeholder="Name"
                            placeholderTextColor="#666699"
                            onFocus={()=>setFocused(true)}
                            onBlur={()=>setFocused(false)}
                            onChangeText={text => setName(text)}
                            defaultValue={name}/>
                    </View>
                    <View style={[styles.textInput, {borderBottomColor: '#666699'}]}>
                        <MaterialCommunityIcons name='email-outline' size={20} color='#666699'/>
                        <TextInput
                            style={styles.inputStyle}
                            size={20}
                            placeholder="Email"
                            placeholderTextColor="#666699"
                            onFocus={()=>setFocused(true)}
                            onBlur={()=>setFocused(false)}
                            onChangeText={text => setEmail(text)}
                            defaultValue={email}/>
                    </View>
                    <View style={[styles.textInput, {borderBottomColor: '#666699'}]}>
                        <MaterialCommunityIcons name='shield-key-outline' size={20} color='#666699' />
                        <TextInput
                            style={styles.inputStyle}
                            size={20}
                            placeholder="Password"
                            placeholderTextColor="#666699"
                            onFocus={()=>setFocused(true)}
                            onBlur={()=>setFocused(false)}
                            onChangeText={text => setPassword(text)}
                            defaultValue={password}
                            secureTextEntry={true}/>
                    </View>
                    <View style={[styles.textInput, {borderBottomColor: '#666699'}]}>
                        <MaterialCommunityIcons name='shield-check-outline' size={20} color='#666699' />
                        <TextInput
                            style={styles.inputStyle}
                            size={20}
                            placeholder="Confirm password"
                            placeholderTextColor="#666699"
                            onFocus={()=>setFocused(true)}
                            onBlur={()=>setFocused(false)}
                            onChangeText={text => setConfirm(text)}
                            defaultValue={confirm}
                            secureTextEntry={true}/>
                    </View>
                </View>
            </View>
            <View style={styles.footer}>
            {activateButton()?
                <TouchableOpacity style={[styles.button, {backgroundColor: '#000036'}]} onPress={()=>join()}>
                    <Text style={[styles.fontFamily, {fontSize: 18}]}>Join</Text>
                </TouchableOpacity>:
                <View style={[styles.button, {backgroundColor: '#4C516D'}]}>
                    <Text style={[styles.fontFamily, {fontSize: 18}]}>Join</Text>
                </View>
            }
            </View>
        </View>
        </TouchableWithoutFeedback>
    );
}

export function Complete({navigation}) {
    const login = () => {
        navigation.dispatch(StackActions.pop(1));
        navigation.dispatch(StackActions.push('SignIn'));
    }
    return (
        <View style={[styles.container, {backgroundColor: '#F5F5F5'}]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPressOut={()=>navigation.dispatch(StackActions.pop(1))}>
                    <Feather name='chevron-left' size={30} color='#000036' />
                </TouchableOpacity>
                <Text style={[styles.fontFamily, {fontSize: 40, color: '#000036'}]}>PetBlock</Text>
            </View>
            <View style={[styles.body, {flex: 1}]}>
                <View style={{flex: 1}}>
                    <Text>complete</Text>
                </View>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity style={[styles.button, {backgroundColor: '#000036'}]} onPress={()=>login()}>
                    <Text style={[styles.fontFamily, {fontSize: 18}]}>
                        Login
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000036',
        paddingTop: 20,
        paddingBottom: 15
    },
    fontFamily: {
        fontFamily: 'Ubuntu_500Medium',
        fontSize: 15,
        color: '#F5F5F5'
    },
    backButton: {
        position: 'absolute',
        left: 10,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    header: {
        height: 90,
        justifyContent: 'center',
        alignItems: 'center'
    },
    body: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollText: {
        flex: 1,
        marginHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
    },
    textInput: {
        height: 30,
        margin: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5'
    },
    inputStyle: {
        flex: 1,
        fontSize: 20,
        fontFamily:'Ubuntu_500Medium',
        marginLeft: 10,
        color: "#000036",
    },
    footer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        height: 50,
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#F5F5F5'
    },
    checkBox: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: -15,
        height: 30,
    }
});
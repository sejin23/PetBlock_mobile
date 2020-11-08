import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { StackActions } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import SettingComponents from './components/SettingComponents';
import AsyncStorage from '@react-native-community/async-storage';
import * as actions from '../actions';
import { connect } from 'react-redux';

function SettingBase({navigation, logout}) {
    const [text, setText] = useState('');
    const [page, setPage] = useState(0);
    const settingName = ["Settings", "Account", "Notifications", "Privacy & Security", "Help and Support", "About"];
    const iconList = ["user", "bell", "lock", "headphones", "help-circle"];
    const movePage = (to) => {
        setPage(to);
    }
    const signOut = async () => {
        try {
            await AsyncStorage.removeItem("loginData");
            logout();
            navigation.dispatch(StackActions.replace('Start'));
        } catch(e) {
            console.error(e);
        }
    }
    return (
        <View style={styles.container}>
        {page == 0?
            <View style={styles.header}>
                <Text style={{fontSize: 40}}>Settings</Text>
            </View>:
            <View style={styles.insideHeader}>
                <TouchableOpacity style={{position: 'absolute', left: -10}} onPress={()=>movePage(0)}>
                    <Feather name='chevron-left' size={30} color='black' />
                </TouchableOpacity>
                <Text style={{fontSize: 20}}>{settingName[page]}</Text>
            </View>
        }
        {page == 0?
            <View style={{flex: 1}}>
                <View style={styles.search}>
                    <Feather name="search" size={20} color="#C0C0C0" />
                    <TextInput
                        style={{flex: 1, color: "black", marginLeft: 5}}
                        size={20}
                        placeholder="Search for a Settings"
                        placeholderTextColor="#C0C0C0"
                        onChangeText={text => setText(text)}
                        defaultValue={text}
                    />
                </View>
                <View style={styles.body}>
                {settingName.map((val, index) => {
                    if(index == 0) return null;
                    else return (
                        <TouchableOpacity style={styles.settingList} key={index} onPress={()=>movePage(index)}>
                            <Feather name={iconList[index - 1]} size={24} color="black" />
                            <Text style={{flex: 1, marginLeft: 10}}>{val}</Text>
                            <Feather name="chevron-right" size={24} color="black" />
                        </TouchableOpacity>
                    );
                })}
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'center', paddingVertical: 5}} onPress={()=>signOut()}>
                        <Text style={{color: 'red', fontSize: 20, marginRight: 10}}>Sign out</Text>
                        <Feather name="log-out" size={24} color="red" />
                    </TouchableOpacity>
                </View>
            </View>:
            <View style={{flex: 1}}>
                <SettingComponents name={page} />
            </View>
        }
        </View>
    );
}

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(actions.logout())
});

export default SettingScreen = connect(
    null,
    mapDispatchToProps
)(SettingBase);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 30,
        paddingHorizontal: 25
    },
    header: {
        height: '15%',
        justifyContent: 'center',
    },
    insideHeader : {
        flexDirection: 'row',
        height: '5%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    search: {
        flexDirection: 'row',
        backgroundColor: '#DCDCDC',
        borderRadius: 7,
        padding: 5,
        alignItems: 'center',
    },
    body: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    settingList: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#DCDCDC',
        borderBottomWidth: 1,
    },
    footer: {
        marginTop: 20,
        height: '12%',
        alignItems: 'center'
    }
});
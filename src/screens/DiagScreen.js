import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import ViewPager from '@react-native-community/viewpager';
import { connect } from 'react-redux';
// import * as actions from '../actions';
import RNPickerSelect from 'react-native-picker-select';
import { URL_BASE } from '../config';

const { width, height } = Dimensions.get('window');

const DiagHeader = ({currentPage, setPage}) => {
    const pageName = ['Calendar', 'Records', 'Board'];
    return (
        <View style={styles.header}>
            <Text style={[styles.fontFamily, {fontSize: 30}]}>{pageName[currentPage]}</Text>
            <View style={styles.headerButton}>
                <TouchableOpacity
                    style={[styles.leftButton, currentPage === 0? {backgroundColor: '#ffffff'}: {backgroundColor: '#f2f2f2'}]}
                    onPress={()=>setPage(0)}>
                    <MaterialCommunityIcons name='calendar-month-outline' size={28} color={'#343D52'} />
                </TouchableOpacity>
                <View style={styles.borderSlash} />
                <TouchableOpacity
                    style={[styles.centerButton, {backgroundColor: currentPage === 1? '#ffffff': '#f2f2f2'}]}
                    onPress={()=>setPage(1)}>
                    <MaterialCommunityIcons name='file-document-outline' size={28} color={'#343D52'} />
                </TouchableOpacity>
                <View style={styles.borderSlash} />
                <TouchableOpacity
                    style={[styles.rightButton, {backgroundColor: currentPage === 2? '#ffffff': '#f2f2f2'}]}
                    onPress={()=>setPage(2)}>
                    <MaterialCommunityIcons name='message-outline' size={28} color={'#343D52'} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

function BodyRecord({setPage, pets}) {
    const [files, setFiles] = useState([]);
    const [selectedIdx, setSelectedIdx] = useState(-1);
    return (
        <View style={styles.body}>
            <RNPickerSelect
                placeholder={{
                    label: '펫을 선택해주세요.',
                    value: -1,
                }}
                items={pets.map((pet, idx) => ({
                    label: pet.name,
                    value: idx
                }))}
                onValueChange={val => setSelectedIdx(val)}
                Icon={()=>{return <MaterialCommunityIcons name='arrow-down-drop-circle' size={20} color='#343D52' />}}
                style={{
                    inputIOS: styles.pickerStyleIOS,
                    iconContainer: {top: 5, right: 10}
                }}/>
        {selectedIdx >= 0 &&
            <SafeAreaView style={styles.recordBody}>
            {pets[selectedIdx].records.length > 0?
                <ScrollView>
                {pets[selectedIdx].records.map((record, idx) =>
                    <View style={styles.recordItem} key={idx}>
                        {/* <Text>{record.date}</Text> */}
                        <Text>2020-11-6</Text>
                        <Image
                            style={{width: width - 20, height: height, resizeMode: 'contain'}}
                            source={{uri: URL_BASE + 'uploads/sejin4430@gmail.com/' + record.img}}
                        />
                    </View>
                )}
                </ScrollView>:
                <Text style={{fontSize: 20}}>진료 기록이 존재하지 않습니다.</Text>
            }
            </SafeAreaView>
        }
        </View>
    );
}

function DiagBase({info, myPet}) {
    const [currentPage, setCurrentPage] = useState(0);
    return (
        <View style={styles.container}>
            <DiagHeader currentPage={currentPage} setPage={setCurrentPage}/>
            {{
            0: <View style={styles.body}>
                
            </View>,
            1: <BodyRecord setPage={setCurrentPage} pets={myPet} />,
            2: <View style={styles.body}>

            </View>
            }[currentPage]}
        </View>
    );
}

const mapStateToProps = (state) => ({
    info: state.user.info,
    myPet: state.pet.myPet
})

export default DiagScreen = connect(
    mapStateToProps
)(DiagBase);

const styles = StyleSheet.create({
    fontFamily: {
        fontFamily: 'Ubuntu_500Medium',
        fontSize: 15,
        color: '#343D52'
    },
    container: {
        flex: 1,
        paddingTop: 20
    },
    header: {
        flexDirection: 'row',
        height: 53,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    headerButton: {
        flexDirection: 'row',
        width: 150,
        alignItems: 'center'
    },
    leftButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 10,
        alignItems: 'center',
        borderTopRightRadius: 2,
        borderTopLeftRadius: 15,
        shadowColor: '#343D52',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3
    },
    centerButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginHorizontal: 4,
        alignItems: 'center',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        shadowColor: '#343D52',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3
    },
    rightButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 10,
        alignItems: 'center',
        borderTopLeftRadius: 2,
        borderTopRightRadius: 15,
        shadowColor: '#343D52',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3
    },
    body: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 10,
        backgroundColor: '#fff',
    },
    recordBody: {
        flex: 1,
        marginTop: 5
    },
    recordItem: {
        flex: 1,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#343D52'
    },
    pickerStyleIOS: {
        fontSize: 15,
        width: '100%',
        height: 30,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#343D52',
        borderRadius: 5,
    },
})
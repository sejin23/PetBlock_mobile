import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
    View,
    Text,
    Alert,
    Image,
    Platform,
    Keyboard,
    TextInput,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import { Feather, Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ViewPager from '@react-native-community/viewpager';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { colors } from '../styles';
import { URL_BASE, URL } from '../config';

const {width, height} = Dimensions.get('window');

function HomeBase({info, myPet, editState, loadPet, addPet, addExistPet, delPet, startEdit, cancelEdit}) {
    const [focusedIdx, setFocusedIdx] = useState(-1);
    const [editPet, setEditPet] = useState({});
    const [deletedImg, setDeletedImg] = useState('');
    const [editImg, setEditImg] = useState(null);
    const nameEl = useRef(null);
    const yearEl = useRef(null);
    const monthEl = useRef(null);
    const dayEl = useRef(null);
    const pagerEl = useRef(null);

    const otpRequest = () => {
        fetch(URL + 'auth/otpRequest', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: info.email,
                target: focusedIdx
            })
        })
        .then(response => response.json())
        .then(res => {
            if(res.otp < 3) alert('OTP error');
            else
                Alert.alert(
                    '다음 OTP를 수의사에게 보여주세요',
                    String(res.otp),
                    [
                        {text: 'OK', onPress: () => {
                            fetch(URL + 'auth/otpTerminate', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    email: info.email
                                })
                            });
                        }}
                    ]
                )
        })
    }
    const deleteIMG = img => {
        fetch(URL + 'auth/users/petInfo/dropImg', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: info.email,
                img: img
            })
        })
        .then(response => response.json())
        .then(res => {
            if(res.result !== 'success') {
                alert('img drop error! : ' + res.result);
            }
        })
    }
    const startEditPet = () => {
        if(!editState) {
            setEditPet({});
            setEditImg(null);
            startEdit();
            setDeletedImg('');
            setEditPet({
                img: '',
                name: '',
                year: 0,
                month: 0,
                day: 0,
                sex: 0,
                weight: 0,
                species: '',
                breed: '',
                bloodType: '',
                neuter: false,
                color: Math.floor(Math.random() * colors.length)
            });
        }
    }
    const cancelEditPet = () => {
        if(deletedImg.length > 0)
            deleteIMG(deletedImg);
        if(editPet.img.length > 0)
            deleteIMG(editPet.img);
        cancelEdit();
        setDeletedImg('');
    }
    const pickImage = async () => {
        const tempImg = editPet.img;
        if(editPet.img.length > 0) {
            setEditPet({
                ...editPet,
                img: ''
            });
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });
        if (!result.cancelled) {
            setDeletedImg(tempImg);
            setEditImg(result.uri);
        } else
            setEditPet({
                ...editPet,
                img: tempImg
            });
      };
    const onEditingPet = (obj, text) => {
        setEditPet({
            ...editPet,
            [obj]: text
        })
    }
    const editingBirth = (obj, text) => {
        setEditPet({
            ...editPet,
            [obj]: text
        })
        if(obj === 'year') {
            if(text.length === 4) monthEl.current.focus();
        } else if(obj === 'month') {
            if(text.length === 2 || (text.length === 1 && text > 1)) dayEl.current.focus();
        }
    }
    const deletePetCard = () => {
        var index = focusedIdx;
        if(index > 0) pagerEl.current.setPage(index - 1);
        
        delPet(myPet[index].img, info.email, myPet[index].name);
        setDeletedImg('');
    }
    const editingPetCard = () => {
        startEdit();
        setEditPet(myPet[focusedIdx]);
        delPet('', info.email, myPet[focusedIdx].name);
        setFocusedIdx(-1);
    }
    const uploadPetInfo = async () => {
        if(editPet.name === '') nameEl.current.focus();
        else if(editPet.sex === 0) alert('Please be sure to select sex');
        else if(!(editPet.year >= 1900 &&  editPet.year <= 2020)) {
            alert('Wrong birth');
            yearEl.current.focus();
        } else if(!(editPet.month >= 1 && editPet.month <= 12)){
            alert('Wrong birth');
            monthEl.current.focus();
        } else if(!(editPet.day >= 1 && editPet.day <= 31)) {
            alert('Wrong birth');
            dayEl.current.focus();
        } else if(editPet.species === '') alert('Please be sure to select Species');
        else {
            if(myPet.map(val => val.name).indexOf(editPet.name) === -1) {
                if(deletedImg.length > 0)
                    deleteIMG(deletedImg);
                setFocusedIdx(0);
                if(editPet.img.length > 0)
                    addExistPet(info.email, editPet);
                else
                    addPet(
                        !editImg? null: Platform.OS === 'android'? editImg: editImg.replace('file://', ''),
                        info.email,
                        editPet
                    );
                setEditPet({});
                setEditImg(null);
                setDeletedImg('');
            } else {
                alert('Redundant Pet name');
                nameEl.current.focus();
            }
        }
    }
    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
        })();
        loadPet(info.email);
    }, []);
    return (
        <View style={styles.container}>
        <StatusBar style="dark" />
        {editState?
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{flex: 1}}>
                <View style={styles.header}>
                    <TouchableOpacity>
                        <MaterialCommunityIcons name='star' size={28} color={colors[editPet.color]} />
                    </TouchableOpacity>
                    <Text style={[styles.fontFamily, {fontSize: 20, textAlign: 'center'}]}>
                        Editing...
                    </Text>
                    <TouchableOpacity onPress={()=>cancelEditPet()}>
                        <MaterialCommunityIcons name='trash-can-outline' size={25} color='#343D52'/>
                    </TouchableOpacity>
                </View>
                <View style={[styles.body, {marginHorizontal: 20}]}>
                    <View style={styles.editingHeader}>
                        <TouchableOpacity style={[styles.editingImage, (editPet.img === '' && !editImg)? {borderColor: '#343D52'}: null]} onPress={pickImage}>
                        {(editPet.img === '' && !editImg)?
                            <MaterialCommunityIcons name='camera-plus' size={30} color='#343D52' />:
                        (editPet.img === ''?
                            <Image source={{ uri: editImg }} style={styles.editingImage} />:
                            <Image source={{ uri: URL_BASE + 'uploads/' + info.email + '/' + editPet.img }} style={styles.editingImage} />
                        )}
                        </TouchableOpacity>
                        <View style={styles.editingProfile}>
                            <View style={styles.editingInput}>
                                <TextInput
                                    styles={{flex: 1, color: 'black'}}
                                    size={20}
                                    ref={nameEl}
                                    placeholder='Name'
                                    placeholderTextColor='#A9A9A9'
                                    onChangeText={text=>onEditingPet('name', text)}
                                    defaultValue={editPet.name}
                                    maxLength={15}/>
                                <TouchableOpacity style={styles.xButton} onPress={()=>onEditingPet('name', '')}>
                                    <Entypo name='circle-with-cross' size={16} color='#A9A9A9' />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.editingHeaderBelow, {width: '100%', marginTop: 20}]}>
                                <Text style={[styles.fontFamily, {color: '#A9A9A9'}]}>Select sex btw</Text>
                                <View style={styles.editingHeaderBelow}>
                                    <TouchableOpacity style={styles.iconsStyle} onPress={()=>onEditingPet('sex', 1)}>
                                        <Ionicons name='md-female' size={25} color={editPet.sex === 1? '#C96D6B': '#A9A9A9'} />
                                    </TouchableOpacity>
                                    <View style={[styles.iconsStyle, {width: 20}]}>
                                        <Text style={[styles.fontFamily, {color: '#A9A9A9'}]}>&</Text>
                                    </View>
                                    <TouchableOpacity style={styles.iconsStyle} onPress={()=>onEditingPet('sex', 2)}>
                                        <Ionicons name='md-male' size={25} color={editPet.sex === 2? '#779ECB': '#A9A9A9'} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.editingBody}>
                        <View style={styles.editingBodyInput}>
                            <Text style={styles.fontFamily}>Birth</Text>
                            <View style={[styles.editingBodyInput, {justifyContent: 'flex-end'}]}>
                                <View style={[styles.editingInput, {width: 60, marginRight: 5, paddingLeft: 10, paddingRight: 10}]}>
                                    <TextInput
                                        size={20}
                                        ref={yearEl}
                                        keyboardType={'number-pad'}
                                        clearTextOnFocus={true}
                                        onChangeText={num=>editingBirth('year', num)}
                                        defaultValue={String(editPet.year)}
                                        maxLength={4}/>
                                </View>
                                <Text style={styles.fontFamily}>년</Text>
                                <View style={[styles.editingInput, {width: 40, marginHorizontal: 5, paddingLeft: 10, paddingRight: 10}]}>
                                    <TextInput
                                        size={20}
                                        ref={monthEl}
                                        keyboardType={'number-pad'}
                                        clearTextOnFocus={true}
                                        onChangeText={num=>editingBirth('month', num)}
                                        defaultValue={String(editPet.month)}
                                        maxLength={2}/>
                                </View>
                                <Text style={styles.fontFamily}>월</Text>
                                <View style={[styles.editingInput, {width: 40, marginHorizontal: 5, paddingLeft: 10, paddingRight: 10}]}>
                                    <TextInput
                                        size={20}
                                        ref={dayEl}
                                        keyboardType={'number-pad'}
                                        clearTextOnFocus={true}
                                        onChangeText={num=>onEditingPet('day', num)}
                                        defaultValue={String(editPet.day)}
                                        maxLength={2}/>
                                </View>
                                <Text style={styles.fontFamily}>일</Text>
                            </View>
                        </View>
                        <View style={styles.editingBodyInput}>
                            <Text style={styles.fontFamily}>Weight </Text>
                            <View style={[styles.editingBodyInput, {justifyContent: 'flex-end'}]}>
                                <View style={[styles.editingInput, {width: 90, paddingLeft: 10, marginRight: 10}]}>
                                    <TextInput
                                        style={{flex: 1}}
                                        size={20}
                                        keyboardType={'numeric'}
                                        onChangeText={num=>num === ''? onEditingPet('weight', 0): onEditingPet('weight', num)}
                                        defaultValue={editPet.weight > 0? String(editPet.weight): ''}/>
                                    <View style={styles.xButton}>
                                        <TouchableOpacity style={{flex: 1}} onPress={()=>onEditingPet('weight', editPet.weight + 1)}>
                                            <MaterialCommunityIcons name='menu-up' size={20} color='#343D52'/>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{flex: 1}} onPress={()=>onEditingPet('weight', editPet.weight > 0? editPet.weight - 1: 0)}>
                                            <MaterialCommunityIcons name='menu-down' size={20} color='#343D52'/>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Text style={styles.fontFamily}>Kg</Text>
                            </View>
                        </View>
                        <View style={styles.editingBodyInput}>
                            <Text style={styles.fontFamily}>
                                {editPet.species === ''? 'Species': 'Breed     '}
                            </Text>
                        {editPet.species === ''?
                            <View style={styles.speciesStyle}>
                                <TouchableOpacity style={styles.iconCenter} onPress={()=>onEditingPet('species', 'dog')}>
                                    <MaterialCommunityIcons name='dog' size={30} color='#A9A9A9' />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconCenter} onPress={()=>onEditingPet('species', 'cat')}>
                                    <MaterialCommunityIcons name='cat' size={30} color='#A9A9A9' />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconCenter} onPress={()=>onEditingPet('species', 'dots-horizontal')}>
                                    <MaterialCommunityIcons name='dots-horizontal' size={30} color='#A9A9A9' />
                                </TouchableOpacity>
                            </View>:
                            <View style={styles.speciesStyle}>
                                <TouchableOpacity style={styles.iconCenter} onPress={()=>onEditingPet('species', '')}>
                                    <MaterialCommunityIcons name={editPet.species} size={30} color='#A9A9A9' />
                                </TouchableOpacity>
                                <View style={[styles.editingInput, {flex: 2, paddingRight: 15}]}>
                                    <TextInput
                                        style={{flex: 1}}
                                        size={20}
                                        placeholder={editPet.species === 'dog'? 'ex) 말티즈': (editPet.species === 'cat'? 'ex) 러시안 블루': '품종을 적어주세요')}
                                        onChangeText={text=>onEditingPet('breed', text)}
                                        defaultValue={editPet.breed}/>
                                </View>
                            </View>
                        }
                        </View>
                    {editPet.species === 'dog'?
                        <View style={styles.editingBodyInput}>
                            <Text style={styles.fontFamily}>Blood Type</Text>
                        </View>:
                    (editPet.species === 'cat'?
                        <View style={styles.editingBodyInput}>
                            <Text style={styles.fontFamily}>Blood Type</Text>
                        </View>:
                        <View style={styles.editingBodyInput} />
                    )}
                        <View style={styles.editingBodyInput}>
                            <Text style={styles.fontFamily}>Got neutered?</Text>
                            <View style={[styles.editingBodyInput, {justifyContent: 'flex-end'}]}>
                                <TouchableOpacity onPress={()=>onEditingPet('neuter', true)}>
                                    <Text style={[styles.fontFamily, !editPet.neuter && {color: '#A9A9A9'}]}>Yes</Text>
                                </TouchableOpacity>
                                <Text style={[styles.fontFamily, {marginHorizontal: 15, color: '#A9A9A9'}]}>or</Text>
                                <TouchableOpacity onPress={()=>onEditingPet('neuter', false)}>
                                    <Text style={[styles.fontFamily, editPet.neuter && {color: '#A9A9A9'}]}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.saveButton} onPress={uploadPetInfo}>
                            <Text style={[styles.fontFamily, {fontSize: 20, marginRight: 5}]}>
                                Save
                            </Text>
                            <Feather name='chevrons-right' size={20} color='#343D52'/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            </TouchableWithoutFeedback>:
        ((myPet && myPet.length)?
            <View style={{flex: 1}}>
                <View style={styles.header}>
                    <View />
                    <TouchableOpacity onPress={()=>startEditPet()}>
                        <MaterialCommunityIcons name='playlist-plus' size={28} color='#343D52' />
                    </TouchableOpacity>
                </View>
                <ViewPager style={{flex: 1}}
                    ref={pagerEl}
                    initialPage={0}
                    onPageSelected={e=>setFocusedIdx(e.nativeEvent.position)}>
                {myPet.map((val, idx) => (
                    <View style={[styles.body, {justifyContent: 'flex-start'}]} key={idx}>
                        <View style={styles.petContainer}>
                            <View style={styles.petHead}>
                                <TouchableOpacity onPress={()=>deletePetCard()}>
                                    <MaterialCommunityIcons name='delete-empty-outline' size={25} color='#343D52' />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>editingPetCard()}>
                                    <MaterialCommunityIcons name='playlist-edit' size={25} color='#343D52' />
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 3, alignItems: 'center'}}>
                            {val.img === ''?
                                <View style={[styles.petImage, {borderWidth: 1, borderColor: '#343D52'}]}>
                                    <MaterialCommunityIcons name='image-filter' size={40} color='#343D52' />
                                </View>:
                                <Image source={{ uri: URL_BASE + 'uploads/sejin4430@gmail.com/' + val.img }} style={styles.petImage} />
                            }
                                <Text style={[styles.fontFamily, {fontSize: 20}]}>{val.name}</Text>
                            </View>
                            <View style={styles.petList}>
                                <View style={styles.petInfo}>
                                    <View style={{flex: 1, justifyContent: 'center'}}>
                                        <Ionicons name={val.sex === 1? 'md-female': 'md-male'} size={25} color={val.sex === 1? '#C96D6B': '#779ECB'} />
                                    </View>
                                    <Text style={[styles.fontFamily, {color: '#DCDCDC'}]}>sex</Text>
                                </View>
                                <View style={styles.borderRight} />
                                <View style={styles.petInfo}>
                                    <View style={{flex: 1, justifyContent: 'center'}}>
                                        <Text style={styles.fontFamily}>{val.year}.{val.month}.{val.day}</Text>
                                    </View>
                                    <Text style={[styles.fontFamily, {color: '#DCDCDC'}]}>birth</Text>
                                </View>
                                <View style={styles.borderRight} />
                                <View style={styles.petInfo}>
                                    <View style={{flex: 1, justifyContent: 'center'}}>
                                        <Text style={styles.fontFamily}>{val.weight === 0? '-': val.weight + ' kg'}</Text>
                                    </View>
                                    <Text style={[styles.fontFamily, {color: '#DCDCDC'}]}>weight</Text>
                                </View>
                            </View>
                            <View style={[styles.petList, {borderBottomColor: '#DCDCDC', borderBottomWidth: 1}]}>
                                <View style={styles.petInfo}>
                                    <View style={{flex: 1, justifyContent: 'center'}}>
                                        <Text style={styles.fontFamily}>{val.species === 'dots-horizontal'? 'other': val.species}</Text>
                                    </View>
                                    <Text style={[styles.fontFamily, {color: '#DCDCDC'}]}>species</Text>
                                </View>
                                <View style={styles.borderRight} />
                                <View style={styles.petInfo}>
                                    <View style={{flex: 1, justifyContent: 'center'}}>
                                        <Text style={styles.fontFamily}>{val.breed === ''? '-': val.breed}</Text>
                                    </View>
                                    <Text style={[styles.fontFamily, {color: '#DCDCDC'}]}>breed</Text>
                                </View>
                                <View style={styles.borderRight} />
                                <View style={styles.petInfo}>
                                    <View style={{flex: 1, justifyContent: 'center'}}>
                                        <Text style={styles.fontFamily}>{val.bloodType === ''? '-': val.bloodType}</Text>
                                    </View>
                                    <Text style={[styles.fontFamily, {color: '#DCDCDC'}]}>blood type</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
                </ViewPager>
                <TouchableOpacity style={styles.otpButton} onPress={()=>otpRequest()}>
                    <Text style={[styles.fontFamily, {color: '#FFF'}]}>OTP</Text>
                </TouchableOpacity>
            </View>:
            <View style={{flex: 1}}>
                <View style={styles.header}>
                    <View>
                        <MaterialCommunityIcons name='star-outline' size={28} color='#343D52' />
                    </View>
                    <Text style={[styles.fontFamily, {fontSize: 20, textAlign: 'center'}]}>
                        Add Your Pets
                    </Text>
                    <TouchableOpacity >
                        <MaterialCommunityIcons name='comment-question-outline' size={25} color='#343D52' />
                    </TouchableOpacity>
                </View>
                <View style={[styles.body, {marginHorizontal: 20}]}>
                    <TouchableOpacity style={styles.plusCard} onPress={()=>startEditPet()}>
                        <MaterialCommunityIcons name='plus' size={30} color='#343D52' />
                    </TouchableOpacity>
                </View>
            </View>
        )}
        </View>
    );
}

const mapStateToProps = (state) => ({
    info: state.user.info,
    myPet: state.pet.myPet,
    editState: state.pet.editState
})

const mapDispatchToProps = (dispatch) => ({
    loadPet: (email) => dispatch(actions.fetchPetInfo(email)),
    addPet: (image, email, data) => dispatch(actions.addPetInfo(image, email, data)),
    addExistPet: (email, data) => dispatch(actions.addPetWithImg(email, data)),
    delPet: (image, email, name) => dispatch(actions.deletePetInfo(image, email, name)),
    startEdit: () => dispatch(actions.startEditPet()),
    cancelEdit: () => dispatch(actions.cancelEditPet())
})

export default HomeScreen = connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeBase);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    fontFamily: {
        fontFamily: 'Ubuntu_500Medium',
        fontSize: 15,
        color: '#343D52'
    },
    header: {
        height: 30,
        marginVertical: 10,
        marginHorizontal: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    body: {
        flex: 1,
        justifyContent: 'center'
    },
    plusCard: {
        height: 400,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#343D52'
    },
    editingHeader: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    editingImage: {
        height: 120,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 60,
        borderWidth: 1,
        borderColor: 'transparent'
    },
    editingProfile: {
        flex: 1,
        marginHorizontal: 15
    },
    editingInput: {
        height: 40,
        paddingLeft: 15,
        paddingRight: 35,
        justifyContent: 'center',
        backgroundColor: '#DCDCDC',
        borderRadius: 8,
    },
    editingHeaderBelow: {
        flexDirection: 'row',
        width: 80,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    editingBody: {
        flex: 1,
        marginVertical: 10,
        marginRight: 20
    },
    editingBodyInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconsStyle: {
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCenter: {
        flex: 1,
        alignItems: 'center'
    },
    speciesStyle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    xButton: {
        position: 'absolute',
        right: 0,
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    saveButton: {
        height: 45,
        flexDirection: 'row',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    petContainer: {
        height: '80%',
        marginTop: 10,
        marginHorizontal: 20,
        paddingHorizontal: 10,
        paddingVertical: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowOpacity: 0.3
    },
    petHead: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        top: 10,
        left: 10
    },
    petImage: {
        height: 130,
        width: 130,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 65
    },
    petList: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '95%',
        borderTopWidth: 1,
        borderTopColor: '#DCDCDC',
    },
    petInfo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 5
    },
    borderRight: {
        height: '30%',
        borderRightWidth: 1,
        borderRightColor: '#DCDCDC'
    },
    otpButton: {
        position: 'absolute',
        bottom: 12,
        left: width / 2 - 35,
        height: 70,
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 35,
        backgroundColor: '#343D52'
    }
});
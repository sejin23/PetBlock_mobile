import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Styles from '../styles';

export default function PetinfoScreen() {
    return (
        <View style={Styles.infocontainer}>
            <View style={{flex: 11}}>
                <Image style={{width: '100%', height: '100%'}} source={require('../images/petinfo.png')} />
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
                <TouchableOpacity style={Styles.ellipticButton} onPress={() => alert('bye')}>
                    <Text style={{color: '#CDDDF1'}}>more</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
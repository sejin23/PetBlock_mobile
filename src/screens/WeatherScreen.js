import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { API_KEY } from './utils/WeatherAPIKey';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { weatherConditions } from './utils/WeatherConditions';


export default function WeatherScreen() {
    const [isLoading, setLoading] = useState(true);
    const [temperature, setTemperature] = useState(0);
    const [weather, setWeather] = useState(null);
    const [city, setCity] = useState("");

    const fetchWeather = (lat, lon) => {
        fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`)
        .then(res => res.json())
        .then(json => {
            setTemperature(json.main.temp);
            setWeather(json.weather[0].main);
            setLoading(false);
        });
    }
    const getLocation = async() => {
        try {
            await Location.requestPermissionsAsync();
            const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync();
            const cityName = await Location.reverseGeocodeAsync({
                longitude: longitude,
                latitude: latitude
            });
            fetchWeather(latitude, longitude);
            setCity(cityName[0].city + " " + cityName[0].name);
        } catch(error) {
            Alert.alert("Can't find you.");
        }
    }
    useEffect(() => {
        getLocation();
    }, []);
    
    return (
        <View style={[styles.container, {backgroundColor: isLoading? 'black': weatherConditions[weather].color}]}>
            <StatusBar style='dark' />
            <View style={styles.header}>
                <TouchableOpacity style={styles.location} onPress={getLocation}>
                    <Text style={{marginRight: 5, color: isLoading? 'white': weatherConditions[weather].fontColor}}>{city}</Text>
                    <MaterialCommunityIcons name="reload" size={18} color={isLoading? 'white': weatherConditions[weather].fontColor} />
                </TouchableOpacity>
                <View style={{flex: 2}} />
                <View style={{flex: 2, width: '60%'}}>
                    <MaterialCommunityIcons
                    size={72}
                    name={isLoading? 'cloud-question': weatherConditions[weather].icon}
                    color={isLoading? 'white': weatherConditions[weather].fontColor}
                    />
                </View>
                <View style={{flexDirection: 'row', flex: 2, alignItems: 'center'}}>
                    <Text style={{color: isLoading? 'white': weatherConditions[weather].fontColor, fontSize: 70, fontWeight: 'bold'}}>{isLoading? '-': Math.round(temperature)}</Text>
                    <MaterialCommunityIcons name='temperature-celsius' size={70} color={isLoading? 'white': weatherConditions[weather].fontColor} />
                </View>
                <View style={{flex: 3}}>
                    <Text style={{color: isLoading? 'white': weatherConditions[weather].fontColor, fontSize: 30}}>{isLoading? 'Loading...': weatherConditions[weather].title}</Text>
                </View>
            </View>
            <View style={styles.body}>
                <TouchableOpacity>
                    <Text style={{fontSize: 20}}>Find nearest Animal Hospital</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#fff'
    },
    header: {
        height: '70%',
        alignItems: 'center',
    },
    location: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 10,
    },
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    }
});
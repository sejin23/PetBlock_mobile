import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import DiagScreen from '../screens/DiagScreen';
import WeatherScreen from '../screens/WeatherScreen';
import SettingScreen from '../screens/SettingScreen';

const Tab = createBottomTabNavigator();

export default function HomeNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    switch(route.name){
                        case 'Home':
                            return <MaterialIcons name='pets' size={size} color={color} />
                        case 'Record':
                            return <FontAwesome name='stethoscope' size={size} color={color} />
                        
                        case 'Map':
                            return <Feather name='map-pin' size={size} color={color} />
                        case 'Setting':
                            return <Feather name='settings' size={size} color={color} />
                    }
                }
            })}
            tabBarOptions={{
                labelStyle: {
                    fontFamily: 'Ubuntu_500Medium'
                },
                activeTintColor: '#343D52',
                inactiveTintColor: '#C0C0C0'
            }}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Record" component={DiagScreen} />
            <Tab.Screen name="Map" component={WeatherScreen} />
            <Tab.Screen name="Setting" component={SettingScreen} />
        </Tab.Navigator>
    );
}
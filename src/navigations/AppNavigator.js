import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoadingScreen from '../screens/LoadingScreen';
import StartScreen from '../screens/StartScreen';
import { SignIn, ToS, SignUp, Complete } from '../screens/SignInandUp';
import HomeNavigator from './HomeNavigator';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Loading"
                component={LoadingScreen}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Start"
                component={StartScreen}
                options={{
                    headerShown: false,
                    gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="Home"
                component={HomeNavigator}
                options={{
                    headerShown: false,
                    gestureEnabled: false
                }}
            />
            <Stack.Screen 
                name="SignIn"
                component={SignIn}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="ToS"
                component={ToS}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen 
                name="SignUp"
                component={SignUp}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Complete"
                component={Complete}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    );
}
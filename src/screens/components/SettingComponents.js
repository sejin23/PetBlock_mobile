import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SettingComponents(props) {
    switch(props.name) {
        case 1:
            return <Account />;
        case 2:
            return <Notification />;
        case 3:
            return <Privacy />;
        case 4:
            return <Help />;
        case 5:
            return <About />;
    }
}

const Account = () => {
    return (
        <View style={styles.container}>
            <View>

            </View>
            <View>

            </View>
        </View>
    );
}

const Notification = () => {
    return (
        <View style={styles.container}>
            <Text>Notification</Text>
        </View>
    );
}

const Privacy = () => {
    return (
        <View style={styles.container}>
            <Text>Privacy</Text>
        </View>
    );
}

const Help = () => {
    return (
        <View style={styles.container}>
            <Text>Help</Text>
        </View>
    );
}

const About = () => {
    return (
        <View style={styles.container}>
            <Text>About</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderColor: 'black',
        borderWidth: 1,
    }
});
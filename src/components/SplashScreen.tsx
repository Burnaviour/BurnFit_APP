import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <View style={styles.logo}>
                    <Text style={styles.logoText}>B</Text>
                    <View style={styles.bolt}>
                        <Text style={styles.boltText}>⚡</Text>
                    </View>
                </View>
                <Text style={styles.appName}>BurnFIT</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111111',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#00E676',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    logoText: {
        fontSize: 60,
        fontWeight: 'bold',
        color: '#111111',
    },
    bolt: {
        position: 'absolute',
        right: 10,
        bottom: 10,
    },
    boltText: {
        fontSize: 40,
        color: '#FFFFFF',
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#00E676',
        letterSpacing: 2,
    },
});

import { View, ActivityIndicator, StyleSheet, Text, Image } from 'react-native';
import React from 'react';

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <Image 
                source={require('../assets/upscalemedia-transformed.png')} 
                style={styles.logo}
                resizeMode="contain" 
            />

            {/* Loading indicator */}
            <ActivityIndicator 
                size="large" 
                color="#495E57" 
                style={styles.loader}
            />
            
            <Text style={styles.loadingText}>Loading...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EDEFEE', // Little Lemon background color
    },
    logo: {
        width: 200,
        height: 80,
        marginBottom: 20,
    },
    appName: {
        fontSize: 28,
        fontWeight: '600',
        color: '#495E57', // Little Lemon green
        marginBottom: 40,
        textAlign: 'center',
    },
    loader: {
        marginBottom: 20,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});

export default SplashScreen;
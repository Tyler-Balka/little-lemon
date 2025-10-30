import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import Onboarding from './screens/Onboarding';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Profile from './screens/Profile';
import SplashScreen from './screens/SplashScreen';
import Home from './screens/Home';

const Stack = createNativeStackNavigator();

export default function App() {
    const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkOnboardingStatus = async () => {
          try {
            const [status] = await Promise.all([
              AsyncStorage.getItem('onboardingComplete'),
              new Promise((resolve) => setTimeout(resolve, 1500))
            ]);
            
            if (status === 'true') {
              setIsOnboardingComplete(true);
            }
          } catch (error) {
            console.error('Error checking onboarding status:', error);
          } finally {
            setIsLoading(false);
          }
        };

        checkOnboardingStatus();
    }, []);

    if (isLoading) {
        return (
            <NavigationContainer>
                <SplashScreen />
            </NavigationContainer>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator 
                initialRouteName={isOnboardingComplete ? "Home" : "Onboarding"}
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="Onboarding" component={Onboarding} />
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="Home" component={Home} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
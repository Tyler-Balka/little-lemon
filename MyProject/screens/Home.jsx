import React, { use } from 'react'
import { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, Pressable} from 'react-native'
import logo from '../assets/upscalemedia-transformed.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function Home({ navigation }) {
    const [profileImage, setProfileImage] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    useEffect(() => {
        getFirstAndLastName();
    }, []);

    useEffect(() => {
        getProfilePicture();
    }, [profileImage]);

    const getProfilePicture = async () => {
        try {
            const storedProfileImage = await AsyncStorage.getItem('profileImage');
            if (storedProfileImage !== null) {
                setProfileImage({ uri: storedProfileImage });
            }
        } catch (error) {
            console.error("Error fetching profile picture:", error);
        }
    }

    const getFirstAndLastName = async () => {
        try {
            const firstName = await AsyncStorage.getItem('firstName');
            const lastName = await AsyncStorage.getItem('lastName');
            if (firstName !== null) {
                setFirstName(firstName);
            }
            if (lastName !== null) {
                setLastName(lastName);
            }
        } catch (error) {
            console.error("Error fetching names:", error);
        }
    }

    const getInitials = (firstName, lastName) => {
        const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
        const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
        return firstInitial + lastInitial;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image 
                    source={logo} 
                    style={{ width: 220, height: 80, }} 
                    resizeMode='contain'
                />
                {profileImage ? (
                    <Pressable onPress={() => navigation.navigate('Profile')}>
                        <Image 
                            source={profileImage}
                            style={{ width: 50, height: 50, borderRadius: 50, }}
                        />
                    </Pressable>
                ) : (
                    <Pressable
                        onPress={() => navigation.navigate('Profile')}>
                        <View style={{ width: 50, height: 50, borderRadius: 50, backgroundColor: '#C4C4C4', justifyContent: 'center', alignItems: 'center' }}>
                            <Text>{getInitials(firstName, lastName)}</Text>
                        </View>
                    </Pressable>
                )}
            </View>
            <View style={styles.body}>
                <Text style={{ color: '#F4C917', fontSize: 48, fontWeight: 'bold', margin: 16 }}>Little Lemon</Text>
                <Text style={{ color: '#F1F0EB', fontSize: 24, fontWeight: 'bold', margin: 16, marginTop: -15 }}>Chicago</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: -15, marginLeft: -12 }}>
                    <Text style={{ color: '#F1F0EB', fontSize: 16, margin: 16, maxWidth: '50%', }}>
                        We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
                    </Text>
                    <Image
                        source={require('../assets/Hero image.png')}
                        style={{ width: 125, height: 125, borderRadius: 20, margin: 16,}}
                        resizeMode='stretch'
                    />
                </View>
                <Pressable>
                    <Ionicons name='search' size={32} color='#495E57' style={{ backgroundColor: '#F4C917', padding: 10, borderRadius: 10, margin: 16, width: 50, height: 50, textAlign: 'center',}} />
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EDEFEE',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        gap: 100,
    },
    body: {
        backgroundColor: '#4B605B',
        flex: .5,
    }
});
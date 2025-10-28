import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, TextInput, ScrollView, Switch } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../assets/upscalemedia-transformed.png';
import * as ImagePicker from 'expo-image-picker';

const Profile = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [orderStatus, setOrderStatus] = useState(false);
    const [passwordChanges, setPasswordChanges] = useState(false);
    const [specialOffers, setSpecialOffers] = useState(false);
    const [newsletter, setNewsletter] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedName = await AsyncStorage.getItem('firstName');
                const storedEmail = await AsyncStorage.getItem('email');
                const storedLastName = await AsyncStorage.getItem('lastName');
                const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
                const storedProfileImage = await AsyncStorage.getItem('profileImage');
                const storedOrderStatus = await AsyncStorage.getItem('orderStatus');
                const storedPasswordChanges = await AsyncStorage.getItem('passwordChanges');
                const storedSpecialOffers = await AsyncStorage.getItem('specialOffers');
                const storedNewsletter = await AsyncStorage.getItem('newsletter');
                if (storedName){
                    setFirstName(storedName);
                    console.log(`Welcome back, ${storedName}!`);
                } else {
                    console.log('No first name found in storage');
                }
                if (storedEmail){
                    setEmail(storedEmail);
                } else {
                    console.log('No email found in storage');
                }
                if (storedLastName){
                    setLastName(storedLastName);
                } else {
                    console.log('No last name found in storage');
                }
                if (storedPhoneNumber){
                    setPhoneNumber(storedPhoneNumber);
                } else {
                    console.log('No phone number found in storage');
                }
                if (storedProfileImage){
                    setProfileImage(storedProfileImage);
                } else {
                    console.log('No profile image found in storage');
                }
                if (storedOrderStatus === 'true'){
                    setOrderStatus(true);
                } 
                if (storedPasswordChanges === 'true'){
                    setPasswordChanges(true);
                }
                if (storedSpecialOffers === 'true'){
                    setSpecialOffers(true);
                }
                if (storedNewsletter === 'true'){
                    setNewsletter(true);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const removeImage  = () => {
        setProfileImage(null);
    };

    const getInitials = (firstName, lastName) => {
        const firstInitial = firstName.charAt(0).toUpperCase();
        const lastInitial = lastName.charAt(0).toUpperCase();
        return `${firstInitial}${lastInitial}`;
    }

    const saveChanges = async () => {
        try {
            await AsyncStorage.setItem('firstName', firstName);
            await AsyncStorage.setItem('lastName', lastName);
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('phoneNumber', phoneNumber);
            await AsyncStorage.setItem('profileImage', profileImage || '');
            await AsyncStorage.setItem('orderStatus', orderStatus ? 'true' : 'false');
            await AsyncStorage.setItem('passwordChanges', passwordChanges ? 'true' : 'false');
            await AsyncStorage.setItem('specialOffers', specialOffers ? 'true' : 'false');
            await AsyncStorage.setItem('newsletter', newsletter ? 'true' : 'false');
            console.log('Profile changes saved successfully!');
        } catch (error) {
            console.error('Error saving profile changes:', error);
        }
    }

    const discardChanges = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhoneNumber('');
        setProfileImage(null);
        setOrderStatus(false);
        setPasswordChanges(false);
        setSpecialOffers(false);
        setNewsletter(false);
    }

    const logOut = async () => {
        try {
            await AsyncStorage.clear();
            console.log('User logged out, AsyncStorage cleared.');
            navigation.navigate('Onboarding');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}> 
                <Image 
                    source={logo} 
                    style={{ width: 220, height: 80 }} 
                    resizeMode="contain" 
                />
            </View>
            <ScrollView style={styles.body}>
                    <Text style={{ fontSize: 20, fontWeight: '600', margin: 20}}>Personal Information</Text>
                    <Text style={{ fontSize: 12, fontWeight: '400', marginLeft: 20, marginBottom: 5 }}>Avatar</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
                        {profileImage ? (
                            <Image
                                source={{ uri: profileImage }}
                                style={{ width: 75, height: 75, borderRadius: 50 }}
                            />
                    ) : (
                        <View style={{ width: 75, height: 75, borderRadius: 50, backgroundColor: '#C4C4C4', justifyContent: 'center', alignItems: 'center',  }}>
                            <Text>{getInitials(firstName, lastName)}</Text>
                        </View>
                    )}
                    <Pressable 
                        onPress={pickImage}
                        style={{ backgroundColor: 'green', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 20, marginHorizontal: 20 }}>
                        <Text style={{ color: 'white', fontSize: 16 }}>
                            Change
                        </Text>
                    </Pressable>
                    <Pressable 
                        onPress={removeImage}
                        style={{ borderWidth: 1, borderColor: 'green', padding: 10, borderRadius: 0, alignItems: 'center', marginBottom: 20 }}>
                        <Text>Remove</Text>
                    </Pressable>
                </View>
                <Text style={{ fontSize: 12, fontWeight: '400', marginLeft: 20, marginTop: 20, marginBottom: 5 }}>First Name</Text>
                <TextInput
                    style={{ borderWidth: 1, borderColor: '#C4C4C4', borderRadius: 8, padding: 10, marginHorizontal: 20 }}
                    placeholder="Enter your first name"
                    value={firstName}
                    onChangeText={setFirstName}
                    />
                
                <Text style={{ fontSize: 12, fontWeight: '400', marginLeft: 20, marginTop: 20, marginBottom: 5 }}>Last Name</Text>
                <TextInput
                    style={{ borderWidth: 1, borderColor: '#C4C4C4', borderRadius: 8, padding: 10, marginHorizontal: 20 }}
                    placeholder="Enter your last name"
                    value={lastName}
                    onChangeText={setLastName}
                />
                
                <Text style={{ fontSize: 12, fontWeight: '400', marginLeft: 20, marginTop: 20, marginBottom: 5 }}>Email</Text>
                <TextInput
                    style={{ borderWidth: 1, borderColor: '#C4C4C4', borderRadius: 8, padding: 10, marginHorizontal: 20 }}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                />
                <Text style={{ fontSize: 12, fontWeight: '400', marginLeft: 20, marginTop: 20, marginBottom: 5 }}>Phone Number</Text>
                <TextInput
                    style={{ borderWidth: 1, borderColor: '#C4C4C4', borderRadius: 8, padding: 10, marginHorizontal: 20 }}
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />
                <Text style={{ fontSize: 20, fontWeight: '600', margin: 20}}>Email Notifications</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginVertical: 10 }}>
                    <Switch 
                        value={orderStatus}
                        onValueChange={setOrderStatus}
                    />
                    <Text>Order Status</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginVertical: 10 }}>
                    <Switch 
                        value={passwordChanges}
                        onValueChange={setPasswordChanges}
                    />
                    <Text>Password Changes</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginVertical: 10 }}>
                    <Switch 
                        value={specialOffers}
                        onValueChange={setSpecialOffers}
                    />
                    <Text>Special Offers</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginVertical: 10 }}>
                    <Switch 
                        value={newsletter}
                        onValueChange={setNewsletter}
                    />
                    <Text>Newsletter</Text>
                </View>
                <Pressable 
                    style={{ backgroundColor: '#FFD700', alignItems: 'center', padding: 15, margin: 20, borderRadius: 8, borderColor: 'red', borderWidth: 1 }}
                    onPress={logOut}>
                    <Text style={{ fontWeight: 'bold' }}>Log Out</Text>
                </Pressable>
                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 25, marginTop: 20, marginBottom: 40 }}>
                    <Pressable 
                        style={{ borderWidth: 1, borderColor: 'green', padding: 10, borderRadius: 8, alignItems: 'center',}}
                        onPress={discardChanges}>
                        <Text>Discard Changes</Text>
                    </Pressable>
                    <Pressable 
                        style={{ backgroundColor: 'green', alignItems: 'center', padding: 10, borderRadius: 8,}}
                        onPress={saveChanges}>
                        <Text style={{ color: 'white' }}>Save Changes</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EDEFEE',
    },
    header: {
        marginTop: 25,
    },
    body: {
        backgroundColor: '#EDEFEE',
        flex: 1,
        width: '100%',
    },
});
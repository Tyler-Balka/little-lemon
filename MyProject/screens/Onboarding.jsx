import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import logo from '../assets/upscalemedia-transformed.png'
import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Onboarding = ({ navigation }) => {
    // Only 2 state variables needed!
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');

    // Simple validation functions that return true/false
    const isValidName = (name) => {
        // Check: not empty AND only letters/spaces
        return name.trim().length > 0 && /^[a-zA-Z\s]+$/.test(name);
    };

    const isValidEmail = (email) => {
        // Simple email check: has @ and . in right places
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Check if BOTH fields are valid
    const canSubmit = isValidName(firstName) && isValidEmail(email);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image 
                    source={logo} 
                    style={styles.logo}
                    resizeMode="contain" />
            </View>
            <View style={styles.body}>
                <Text style={styles.title}>Let us get to know you</Text>
                
                <TextInput 
                    placeholder="First Name" 
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                />
                
                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>
            
            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={ async () => {
                        if (canSubmit) {
                            console.log('Success!', { firstName, email });
                            // Save data to AsyncStorage
                            await AsyncStorage.setItem('firstName', firstName);
                            await AsyncStorage.setItem('email', email);
                            await AsyncStorage.setItem('onboardingComplete', 'true');
                            // Navigate to next screen
                            navigation.navigate('Profile');
                        } else {
                            alert('Please fill in valid information');
                        }
                    }}
                    style={[styles.button, canSubmit ? styles.buttonEnabled : styles.buttonDisabled]}
                    disabled={!canSubmit}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Onboarding;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EDEFEE',
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E1E6ED',
        height: 120,
        paddingTop: 40,
    },
    logo: {
        width: 220,
        height: 80,
    },
    body: {
        backgroundColor: '#C8D0D9',
        alignItems: 'center',
        flex: .75,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '300',
        marginBottom: 50,
    },
    input: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        marginVertical: 10,
        paddingHorizontal: 10,
        width: '80%',
        backgroundColor: 'transparent',
        borderRadius: 8,
    },
    footer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flex: .30,
        backgroundColor: '#E1E6ED',
    },
    button: {
        borderRadius: 8,
        marginRight: 30,
        marginTop: 30,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    buttonEnabled: {
        backgroundColor: '#495E57', // Green when enabled
    },
    buttonDisabled: {
        backgroundColor: '#CCCCCC', // Gray when disabled
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    }
})
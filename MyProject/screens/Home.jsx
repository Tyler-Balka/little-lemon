import { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, Pressable, FlatList, ScrollView} from 'react-native'
import { createTable, fetchMenuData, getMenuFromDB, getCategory } from '../database';
import logo from '../assets/upscalemedia-transformed.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function Home({ navigation }) {
    const [profileImage, setProfileImage] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [menuData, setMenuData] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const imageMap = {
        'bruschetta.jpg': require('../assets/bruschetta.jpg'),
        'greekSalad.jpg': require('../assets/greekSalad.jpg'),
        'lemonDessert.jpg': require('../assets/lemonDessert.jpg'),
        'grilledFish.jpg': require('../assets/grilledFish.jpg'),
        'pasta.jpg': require('../assets/pasta.jpg'),
    }

    useEffect(() => {
        getFirstAndLastName();
        createTable();
        fetchMenuData();
    }, []);

    useEffect(() => {
        getMenu();
    }, [selectedCategories]);

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

    const toggleCategory = (category) => {
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                // Remove category if already selected
                return prev.filter(cat => cat !== category);
            } else {
                // Add category if not selected
                return [...prev, category];
            }
        });
    }

    const isCategorySelected = (category) => {
        return selectedCategories.includes(category);
    }

    {/*const fetchMenuData = async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json');
            const data = await response.json();
            setMenuData(data.menu);
        } catch (error) {
            console.error("Error fetching menu data:", error);
        }
    }
    */}

    const getMenu = async () => {
        try {
            let data = [];
            if (selectedCategories.length === 0) {
                data = await getMenuFromDB();
            } else {
                for (const category of selectedCategories) {
                    const categoryData = await getCategory(category);
                    data = data.concat(categoryData);
                }
            }
            setMenuData(data);
        } catch (error) {
            console.error("Error fetching menu data:", error);
        }
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
            <View style={styles.menu}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', margin: 16 }}>ORDER FOR DELIVERY!</Text>
                <ScrollView 
                    horizontal={true}
                    showsHorizontalScrollIndicator={true}
                    contentContainerStyle={{ 
                        paddingHorizontal: 16,
                        paddingBottom: 48
                    }}
                >
                    <View style={{ flexDirection: 'row', gap: 16 }}>
                        <Pressable 
                            onPress={() => toggleCategory('starters')}
                            style={[
                                { backgroundColor: 'lightgray', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 35, height: 50, alignItems: 'center', justifyContent: 'center' }, 
                                isCategorySelected('starters') && { backgroundColor: '#F4C917' }
                            ]}
                        >
                            <Text allowFontScaling={false} style={{ color: '#333333', fontSize: 15, fontWeight: '600' }}>Starters</Text>
                        </Pressable>
                        <Pressable 
                            onPress={() => toggleCategory('mains')}
                            style={[
                                { backgroundColor: 'lightgray', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 35, height: 50, alignItems: 'center', justifyContent: 'center' }, 
                                isCategorySelected('mains') && { backgroundColor: '#F4C917' }
                            ]}
                        >
                            <Text allowFontScaling={false} style={{ color: '#333333', fontSize: 15, fontWeight: '600' }}>Mains</Text>
                        </Pressable>
                        <Pressable 
                            onPress={() => toggleCategory('desserts')}
                            style={[
                                { backgroundColor: 'lightgray', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 35, height: 50, alignItems: 'center', justifyContent: 'center' }, 
                                isCategorySelected('desserts') && { backgroundColor: '#F4C917' }
                            ]}
                        >
                            <Text allowFontScaling={false} style={{ color: '#333333', fontSize: 15, fontWeight: '600' }}>Desserts</Text>
                        </Pressable>
                        <Pressable 
                            onPress={() => toggleCategory('drinks')}
                            style={[
                                { backgroundColor: 'lightgray', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 35, height: 50, alignItems: 'center', justifyContent: 'center' }, 
                                isCategorySelected('drinks') && { backgroundColor: '#F4C917' }
                            ]}
                        >
                            <Text allowFontScaling={false} style={{ color: '#333333', fontSize: 15, fontWeight: '600' }}>Drinks</Text>
                        </Pressable>
                    </View>
                </ScrollView>
                {/*<View style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, marginVertical: 32 }}></View>*/}
                <FlatList
                    data={menuData}
                    renderItem={({ item }) => (
                        <View style={{ margin: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, paddingRight: 16 }}>
                                <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>{item.name}</Text>
                                <Text style={{ color: '#888', marginBottom: 4 }}>{item.description}</Text>
                                <Text>{item.price}</Text>
                            </View>
                            <Image source={imageMap[item.image]} style={{ width: 100, height: 100, }} />
                        </View>
                    )}
                />
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
        flex: .9,
    },
    menu: {
        flex: 1,
    }
});
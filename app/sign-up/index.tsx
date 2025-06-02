import { useState } from 'react';
import './../../global.css';
import { Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile, User } from 'firebase/auth';
import { auth, db } from 'firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpScreen() {
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const router = useRouter();
    const handleSignUp = () => {
        if (password !== confirmPassword) return console.log('Passwords do not match');
        if (!email || !password || !displayName) return console.log('Please fill all fields');
        createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    setUser(user);
                    updateProfile(user, {
                        displayName: displayName
                    });
                    AsyncStorage.setItem('user', JSON.stringify({
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                    }));
                    try {
                        setDoc(doc(db, "users", user?.email || ""), {
                            email: user?.email,
                            displayName: user?.displayName || "Anonymous",
                            xp: 0,
                            cards: [649, 118, 27, 148],
                            });
                        console.log("User added successfully!");
                    } catch (error) {
                        console.error("Error adding user: ", error);
                    }
                    router.navigate('/home');
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log('Error:', errorMessage);
                });
    }
    return(
        <View className='flex-1 items-center justify-center bg-white'>
            <Text className='text-2xl font-bold mb-4'>Sign Up</Text>
            <TextInput
                className='border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base w-80'
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
                autoCapitalize='none'
            />
            <TextInput
                className='border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base w-80'
                placeholder='Display Name'
                value={displayName}
                onChangeText={setDisplayName}
            />
            <TextInput
                className='border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base w-80'
                placeholder='Password'
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                className='border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base w-80'
                placeholder='Confirm Password'
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <TouchableOpacity className='bg-blue-500 rounded-lg py-3 px-6 mt-4' onPress={handleSignUp}>
                <Text className='text-white text-center font-semibold text-base'>Sign Up</Text>
            </TouchableOpacity>
        </View>
    )
}
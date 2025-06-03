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
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const router = useRouter();
    const handleSignUp = () => {
        if (password !== confirmPassword) return setError('Passwords do not match');
        if (!email || !password || !displayName) return setError('Please fill all fields');
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
                            cards: [],
                            });
                        console.log("User added successfully!");
                    } catch (errors) {
                        setError("Error adding user: " + errors);
                        console.error("Error adding user: ", errors);
                    }
                    router.navigate('/home');
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setError(errorMessage);
                    console.log('Error:', errorMessage);
                });
    }
    return(
        <View className='flex-1 items-center justify-center bg-catppuccin-base px-8'>
            <Text className='text-3xl font-bold mb-8 text-catppuccin-text'>Create Account</Text>
            <View className="w-full max-w-sm space-y-4">
                <TextInput
                    className='border border-catppuccin-surface1 bg-catppuccin-mantle rounded-lg px-4 py-3 mb-4 text-base text-catppuccin-text focus:border-catppuccin-blue w-full'
                    placeholder='Email'
                    placeholderTextColor="#a5adce"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                    autoCapitalize='none'
                />
                <TextInput
                    className='border border-catppuccin-surface1 bg-catppuccin-mantle rounded-lg px-4 py-3 mb-4 text-base text-catppuccin-text focus:border-catppuccin-blue w-full'
                    placeholder='Display Name'
                    placeholderTextColor="#a5adce"
                    value={displayName}
                    onChangeText={setDisplayName}
                />
                <TextInput
                    className='border border-catppuccin-surface1 bg-catppuccin-mantle rounded-lg px-4 py-3 mb-4 text-base text-catppuccin-text focus:border-catppuccin-blue w-full'
                    placeholder='Password'
                    placeholderTextColor="#a5adce"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />
                <TextInput
                    className='border border-catppuccin-surface1 bg-catppuccin-mantle rounded-lg px-4 py-3 mb-4 text-base text-catppuccin-text focus:border-catppuccin-blue w-full'
                    placeholder='Confirm Password'
                    placeholderTextColor="#a5adce"
                    secureTextEntry={true}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <TouchableOpacity className='bg-catppuccin-green rounded-lg py-3 px-6 mt-4 active:bg-catppuccin-teal w-full' onPress={handleSignUp}>
                    <Text className='text-catppuccin-base text-center font-semibold text-base'>Create Account</Text>
                </TouchableOpacity>
                {error && (
                    <Text className='text-red-600 text-center mt-4'>{error}</Text>)}
                <TouchableOpacity className='mt-4' onPress={() => router.push('/')}>
                    <Text className='text-catppuccin-blue text-center font-medium'>Already have an account? Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
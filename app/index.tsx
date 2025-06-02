import './../global.css';
import { Text, TextInput, View, TouchableOpacity } from 'react-native'
import { getAuth, signInWithEmailAndPassword, User, updateProfile} from "firebase/auth";
import { useState } from 'react';
import { auth } from './../firebaseConfig'; 
import { useRouter } from 'expo-router';
import { useGlobal } from './../GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user, setUser } = useGlobal();

    const router = useRouter();
    const handleSignUp = () => {
        router.navigate('/sign-up');
    };

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setUser(user);
                AsyncStorage.setItem('user', JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                }));

                console.log(user.displayName);
                router.navigate('/home');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });

    };

    return (
        
        <View className='flex-1 items-center'>
            <View className="flex-1 justify-center items-center">
                <Text className='text-2xl font-bold'>Welcome to FRC TCG</Text>
                <Text className='text-lg'>Please sign in or sign up to continue</Text>
                <View className="w-full px-8 mt-8">
                    <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    />
                    <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    />
                    <View className='flex-row items-center justify-center gap-4 p-5'>
                        <TouchableOpacity className="bg-blue-500 rounded-lg py-3 px-6" onPress={handleSignIn}>
                            <Text className="text-white text-center font-semibold text-base">Sign In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-blue-500 rounded-lg py-3 px-6" onPress={handleSignUp}>
                            <Text className="text-white text-center font-semibold text-base">Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}
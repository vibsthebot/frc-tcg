import './../global.css';
import { Text, TextInput, View, TouchableOpacity } from 'react-native'
import { getAuth, signInWithEmailAndPassword, User, updateProfile} from "firebase/auth";
import { useEffect, useState } from 'react';
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

    useEffect(() => {
        if (user) {
            router.navigate('/home');
        } else {
            AsyncStorage.getItem('user').then((storedUser) => {
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                }
            });
        }
    }, [user]);

    return (

        <View className='flex-1 items-center bg-catppuccin-base'>
            <View className="flex-1 justify-center items-center">
                <Text className='text-4xl font-bold text-catppuccin-text'>FRC <Text className='text-catppuccin-mauve'>TCG</Text></Text>
                <View className="w-full px-8 mt-8">
                    <TextInput
                    className="border border-catppuccin-surface1 bg-catppuccin-mantle rounded-lg px-4 py-3 mb-4 text-base text-catppuccin-text focus:border-catppuccin-blue"
                    placeholder="Email"
                    placeholderTextColor="#6c6f85"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    />
                    <TextInput
                    className="border border-catppuccin-surface1 bg-catppuccin-mantle rounded-lg px-4 py-3 mb-4 text-base text-catppuccin-text focus:border-catppuccin-blue"
                    placeholder="Password"
                    placeholderTextColor="#6c6f85"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    />
                    <View className='flex-row items-center justify-center gap-4 p-5'>
                        <TouchableOpacity className="bg-catppuccin-blue rounded-lg py-3 px-6 active:bg-catppuccin-sapphire" onPress={handleSignIn}>
                            <Text className="text-catppuccin-base text-center font-semibold text-base">Sign In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-catppuccin-green rounded-lg py-3 px-6 active:bg-catppuccin-teal" onPress={handleSignUp}>
                            <Text className="text-catppuccin-base text-center font-semibold text-base">Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}
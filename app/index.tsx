import './../global.css';
import { Text, TextInput, View, TouchableOpacity } from 'react-native'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from "firebase/auth";
import { useState } from 'react';
import { auth } from './../firebaseConfig'; 
import TeamCard from 'components/Card';

export default function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setUser(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log('Error:', errorMessage);
            });
    };

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setUser(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });

    };

    return (
        <View className='bg-sky-600'>
        {/*<View className='flex-1 items-center bg-sky-500'>
            <View className="flex-1 justify-center px-6 bg-sky-500">
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
                <View className='flex-row items-center gap-4 p-5'>
                    <TouchableOpacity className="bg-blue-500 rounded-lg py-3 px-6" onPress={handleSignIn}>
                        <Text className="text-white text-center font-semibold text-base">Sign In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-blue-500 rounded-lg py-3 px-6" onPress={handleSignUp}>
                        <Text className="text-white text-center font-semibold text-base">Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TeamCard teamNumber="254" />
        </View>*/}
            <Text>Hi!</Text>
        </View>
    );
}
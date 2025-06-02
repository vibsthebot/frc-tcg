import {View, Text, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
import './../../global.css';
import { db } from './../../firebaseConfig';
import { doc, getDoc, setDoc} from 'firebase/firestore';
import { useGlobal } from './../../GlobalContext';
import { useState, useEffect } from 'react';
import TeamCard from 'components/Card';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
    const { user, setUser, userData, setUserData, getUserData} = useGlobal();

    useEffect(() => {
        console.log("User in HomeScreen:", user);
        getUserData();
    }, [user]);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="bg-blue-600 px-6 py-8 rounded-b-3xl mb-6">
                {user && (
                <View className="items-center">
                    <Text className="text-3xl font-bold text-white mb-2">
                    Welcome, {user.displayName || ""}!
                    </Text>
                </View>
                )}
            </View>

            {userData && (
                <View className="px-6">
                <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
                    <Text className="text-lg font-semibold text-gray-800 mb-4">Your Stats</Text>
                    <View className="flex-row justify-between">
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-blue-600">{userData.xp || "0"}</Text>
                        <Text className="text-sm text-gray-500">XP Points</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-green-600">{userData.cards?.length || "0"}</Text>
                        <Text className="text-sm text-gray-500">Cards</Text>
                    </View>
                    </View>
                </View>                
                {userData.cards && userData.cards.length > 0 && (
                    <View>
                    <Text className="text-xl font-bold text-gray-800 mb-4 px-2">My Collection</Text>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        className="flex-row"
                        contentContainerStyle={{ paddingHorizontal: 8 }}
                    >
                        {userData.cards.map((card, index) => (
                        <View key={index} className="mr-4">
                            <TeamCard teamNumber={card.toString()} width={200}/>
                        </View>
                        ))}
                    </ScrollView>
                    </View>
                )}

                {(!userData.cards || userData.cards.length === 0) && (
                    <View className="bg-white rounded-2xl p-8 items-center border border-gray-100">
                    <Text className="text-gray-400 text-lg mb-2">No cards yet</Text>
                    <Text className="text-gray-500 text-center">Start collecting cards to build your decks!</Text>
                    </View>
                )}
                </View>
            )}
            </ScrollView>
            <></>
        </SafeAreaView>
    );
}

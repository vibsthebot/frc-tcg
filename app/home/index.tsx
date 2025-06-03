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
        if (!user) {
            AsyncStorage.getItem('user').then((storedUser) => {
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                }
            });
        }
        getUserData();
    }, [user]);

    return (
        <SafeAreaView className="flex-1 bg-catppuccin-base">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="bg-catppuccin-blue px-6 py-8 rounded-b-3xl mb-6">
                {user && (
                <View className="items-center">
                    <Text className="text-3xl font-extrabold text-catppuccin-base mb-2">
                    Welcome, {user.displayName || ""}!
                    </Text>
                </View>
                )}
            </View>

            {userData && (
                <View className="px-6">
                <View className="bg-catppuccin-mantle rounded-2xl p-6 mb-6 shadow-sm border border-catppuccin-surface0">
                    <Text className="text-lg font-semibold text-catppuccin-text mb-4">Your Stats</Text>
                    <View className="flex-row justify-between">
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-catppuccin-blue">{userData.xp || "0"}</Text>
                        <Text className="text-sm text-catppuccin-subtext0">XP Points</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-catppuccin-green">{userData.cards?.length || "0"}</Text>
                        <Text className="text-sm text-catppuccin-subtext0">Cards</Text>
                    </View>
                    </View>
                </View>                
                {userData.cards && userData.cards.length > 0 && (
                    <View>
                    <Text className="text-xl font-bold text-catppuccin-text mb-4 px-2">My Collection</Text>
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
                    <View className="bg-catppuccin-mantle rounded-2xl p-8 items-center border border-catppuccin-surface0">
                    <Text className="text-catppuccin-subtext1 text-lg mb-2">No cards yet</Text>
                    <Text className="text-catppuccin-subtext0 text-center">Start collecting cards to build your decks!</Text>
                    </View>
                )}
                </View>
            )}
            </ScrollView>
        </SafeAreaView>
    );
}

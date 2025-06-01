import {View, Text, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
import './../../global.css';
import { db } from './../../firebaseConfig';
import { doc, getDoc, setDoc} from 'firebase/firestore';
import { useGlobal } from './../../GlobalContext';
import { useState, useEffect } from 'react';
import TeamCard from 'components/Card';

type UserData = {
  email?: string;
  displayName?: string;
  xp?: string;
  cards?: number[];
};

export default function HomeScreen() {
    const { user, setUser } = useGlobal();
    const [userData, setUserData] = useState<UserData | null>(null);

    const getUserData = async () => {
        if (!user) return;
        
        try {
            const docRef = doc(db, "users", user.email || "");
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                setUserData(docSnap.data());
                console.log("Document data:", docSnap.data());
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error getting document: ", error);
        }
    };

    useEffect(() => {
        getUserData();
    }, [user]);

    return (
        <SafeAreaView className="flex-1">
            <ScrollView className="flex-1 px-4 py-6">
                <View className="items-center mb-6">
                    {user && <Text className="text-2xl font-bold text-center">Welcome, {user.displayName}</Text>}
                </View>
                
                {userData && (
                    <View className="mb-6">
                        <Text className="text-lg mb-2">Email: {userData.email || "N/A"}</Text>
                        <Text className="text-lg mb-4">XP: {userData.xp}</Text>
                        
                        {userData.cards && userData.cards.length > 0 && (
                            <View>
                                <Text className="text-xl font-semibold mb-3">My Cards:</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={true} className="flex-row">
                                    {userData.cards.map((card, index) => (
                                        <View key={index} className="mr-3">
                                            <TeamCard teamNumber={card.toString()} width={200}/>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

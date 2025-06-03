import { TBA_API_KEY } from "@env";
import TeamCard from "components/Card";
import { use, useEffect, useState } from "react";
import { View, Text, TextInput, Alert, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "firebaseConfig";
import { useGlobal } from "GlobalContext";

export default function Decks() {
    const { user, getUserData } = useGlobal();
    const [eventCode, setEventCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [randomCards, setRandomCards] = useState<string[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const router = useRouter();

    const fetchEvent = async () => {
        if (!eventCode.trim()) {
            Alert.alert("Error", "Please enter an event code");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(
                `https://www.thebluealliance.com/api/v3/event/${eventCode}/teams/simple`,
                {
                    headers: {
                        'X-TBA-Auth-Key': TBA_API_KEY
                    }
                }
            );
            if (!response.ok) {
                throw new Error("Event not found or API error");
            }

            const teamsData = await response.json();
            const teams = teamsData.map((team: any) => team.team_number);
            
            if (teams.length === 0) {
                Alert.alert("Error", "No teams found for this event");
                return;
            }

            const shuffled = teams.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, Math.min(3, teams.length));
            setRandomCards(selected);
            setCurrentCardIndex(0);
            
            const userDoc = await getDoc(doc(db, "users", user?.email || ""));
            const currentXp = userDoc.exists() ? userDoc.data()?.xp || 0 : 0;
            const currentCards = userDoc.exists() ? userDoc.data()?.cards || [] : [];

            const newCards = [...new Set([...currentCards, ...selected])].sort((a, b) => a - b);

            await setDoc(doc(db, "users", user?.email || ""), {
                email: user?.email,
                displayName: user?.displayName || "Anonymous",
                xp: currentXp - 10,
                cards: newCards,
            });

            getUserData();
        }
        catch (error) {
            Alert.alert("Error", "Failed to fetch event data. Please check the event code.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleCardTap = () => {
        if (currentCardIndex < randomCards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
        } else {
            setCurrentCardIndex(0);
            setRandomCards([]);
        }
    };

    
    return (
        <ScrollView className="flex-1 bg-catppuccin-base px-6 py-8">
            {randomCards.length === 0 && (<View>
                <View className="mb-8">
                    <Text className="text-3xl font-bold text-catppuccin-text mb-2">Decks</Text>
                    <Text className="text-base text-catppuccin-subtext1">Manage your scouting decks here.</Text>
                </View>
                    
                <View className="mb-6">
                    <Text className="text-sm font-medium text-catppuccin-text mb-2">Event Code</Text>
                    <TextInput
                        className="bg-catppuccin-mantle border border-catppuccin-surface1 rounded-lg px-4 py-3 text-base text-catppuccin-text focus:border-catppuccin-blue"
                        placeholder="Enter event code (e.g., 2025casj)"
                        placeholderTextColor="#a5adce"
                        value={eventCode}
                        onChangeText={setEventCode}
                        autoCapitalize="none"
                    />
                </View>

                <TouchableOpacity
                className={`rounded-lg px-6 py-3 shadow-sm ${loading ? 'bg-catppuccin-surface1' : 'bg-catppuccin-blue active:bg-catppuccin-sapphire'}`}
                onPress={fetchEvent}
                disabled={loading}
                >
                    <Text className="text-catppuccin-base text-center font-semibold text-base">
                        {loading ? "Loading..." : "Draw Cards"}
                    </Text>
                </TouchableOpacity>
            </View>)}
            {!loading && randomCards.length > 0 && (
            <View className="mt-8 bg-catppuccin-mantle rounded-xl p-6 shadow-sm border border-catppuccin-surface0">
                <View className="flex-row justify-between items-center mb-4">
                
                <View className="bg-catppuccin-surface0 px-3 py-1 rounded-full">
                    <Text className="text-catppuccin-blue text-sm font-medium">
                    {currentCardIndex + 1} of {randomCards.length}
                    </Text>
                </View>
                </View>
                
                <TouchableOpacity 
                onPress={handleCardTap}
                className="active:scale-95 transition-transform"
                >
                <View className="items-center">
                    <TeamCard 
                    teamNumber={randomCards[currentCardIndex].toString()} 
                    width={300}
                    />
                </View>
                </TouchableOpacity>

                {currentCardIndex != randomCards.length - 1 && (
                    <Text className="text-sm text-catppuccin-subtext0 mt-4 text-center">
                        Tap card to view next team
                    </Text>
                )}
                { currentCardIndex === randomCards.length - 1 && (
                    <Text className="text-sm text-catppuccin-subtext0 mt-4 text-center">
                        Tap card to finish and add to your collection
                    </Text>
                )}
            </View>
            )}
        </ScrollView>
    );
}
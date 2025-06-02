import { TBA_API_KEY } from "@env";
import TeamCard from "components/Card";
import { useState } from "react";
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
                `https://www.thebluealliance.com/api/v3/event/2025${eventCode}/teams/simple`, // Use dynamic eventCode
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
            const selected = shuffled.slice(0, Math.min(3, teams.length)); // Change to 3 cards
            setRandomCards(selected);
            setCurrentCardIndex(0); // Reset to first card
            
            const userDoc = await getDoc(doc(db, "users", user?.email || ""));
            const currentXp = userDoc.exists() ? userDoc.data()?.xp || 0 : 0;
            const currentCards = userDoc.exists() ? userDoc.data()?.cards || [] : [];

            await setDoc(doc(db, "users", user?.email || ""), {
                email: user?.email,
                displayName: user?.displayName || "Anonymous",
                xp: currentXp - 10,
                cards: currentCards.concat(selected),
            });

            getUserData(); // Now this should work
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
            router.navigate('/decks');
        }
    };
    return (
        <ScrollView className="flex-1 bg-gray-50 px-6 py-8">
            <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">Decks</Text>
            <Text className="text-base text-gray-600">Manage your scouting decks here.</Text>
            </View>
            
            <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">Event Code</Text>
            <TextInput
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base shadow-sm focus:border-blue-500"
                placeholder="Enter event code (e.g., 2025casj)"
                value={eventCode}
                onChangeText={setEventCode}
                autoCapitalize="none"
            />
            </View>

            <TouchableOpacity
            className={`rounded-lg px-6 py-3 shadow-sm ${loading ? 'bg-gray-400' : 'bg-blue-600 active:bg-blue-700'}`}
            onPress={fetchEvent}
            disabled={loading}
            >
            <Text className="text-white text-center font-semibold text-base">
                {loading ? "Loading..." : "Fetch Teams"}
            </Text>
            </TouchableOpacity>

            {!loading && randomCards.length > 0 && (
            <View className="mt-8 bg-white rounded-xl p-6 shadow-sm">
                <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-semibold text-gray-800">
                    Team Cards
                </Text>
                <View className="bg-blue-100 px-3 py-1 rounded-full">
                    <Text className="text-blue-800 text-sm font-medium">
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
                    width={100}
                    />
                </View>
                </TouchableOpacity>
                
                <Text className="text-sm text-gray-500 mt-4 text-center">
                Tap card to view next team
                </Text>
            </View>
            )}
        </ScrollView>
    );
}
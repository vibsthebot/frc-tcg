import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { useGlobal } from './../../GlobalContext';
import TeamCard from 'components/Card';
import { Ionicons } from '@expo/vector-icons';
import './../../global.css';

export default function Cards() {
  const { userData, hallOfFame} = useGlobal();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCards, setFilteredCards] = useState<string[]>([]);

  useEffect(() => {
    if (userData?.cards) {
      try {
        let filtered = userData.cards.filter((card: string) =>
          card.toString().includes(searchQuery)
        );

        filtered = filtered.sort((a: string, b: string) => parseInt(a) - parseInt(b));

        setFilteredCards(filtered);
      } catch (error) {
        console.log("Filter error:", error);
        setFilteredCards([]);
      }
    }
  }, [userData?.cards, searchQuery]);

  return (
    <SafeAreaView className="flex-1 bg-catppuccin-base">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8">
          <Text className="text-3xl font-bold text-catppuccin-text mb-2">My Collection</Text>
          <Text className="text-base text-catppuccin-subtext1 mb-6">
            {userData?.cards?.length || 0} cards collected
          </Text>

          <View className="bg-catppuccin-mantle rounded-lg px-4 py-3 mb-4 flex-row items-center border border-catppuccin-surface0">
            <Ionicons name="search" size={20} color="#a5adce" />
            <TextInput
              className="flex-1 ml-3 text-catppuccin-text text-base"
              placeholder="Search by team number..."
              placeholderTextColor="#a5adce"
              value={searchQuery}
              onChangeText={setSearchQuery}
              keyboardType="numeric"
            />
          </View>

          <View className="flex-row gap-4 mb-6">
            <View className="flex-1 bg-catppuccin-mantle rounded-xl p-4 border border-catppuccin-surface0">
              <Text className="text-catppuccin-subtext0 text-sm mb-1">Total Cards</Text>
              <Text className="text-catppuccin-blue text-2xl font-bold">
                {userData?.cards?.length || 0}
              </Text>
            </View>
            <View className="flex-1 bg-catppuccin-mantle rounded-xl p-4 border border-catppuccin-surface0">
              <Text className="text-catppuccin-subtext0 text-sm mb-1">Hall of Fame</Text>
              <Text className="text-catppuccin-yellow text-2xl font-bold">
                {userData?.cards?.filter((card: string) => [5985, 2486, 321, 1629, 503, 4613, 1816, 1902, 2834, 1311, 2614, 3132, 987, 597, 27, 1538, 1114, 359, 341, 236, 842, 365, 111, 67, 254, 103, 175, 16, 120, 23, 144, 151, 191].includes(parseInt(card))).length || 0}
              </Text>
            </View>
          </View>

          {filteredCards.length > 0 ? (
            <View className="flex-row flex-wrap justify-between">
              {filteredCards.map((card, index) => {
                return (
                  <View key={`${card}-${index}`} className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 mb-4">
                    
                      <TeamCard teamNumber={card.toString()} width={150} />
                    
                  </View>
                );
              })}
            </View>
          ) : (
            <View className="bg-catppuccin-mantle rounded-2xl p-8 items-center border border-catppuccin-surface0">
              <Ionicons name="albums-outline" size={48} color="#a5adce" />
              <Text className="text-catppuccin-subtext1 text-lg mb-2 mt-4">
                {searchQuery ? 'No cards found' : 'No cards yet'}
              </Text>
              <Text className="text-catppuccin-subtext0 text-center">
                {searchQuery 
                  ? 'Try a different search term' 
                  : 'Start collecting cards by drawing from events!'
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
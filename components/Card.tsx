import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import './../global.css';
import { TBA_API_KEY } from '@env';


interface TeamCardProps {
  teamNumber: string;
}

interface TeamData {
  name: string;
  rookie_year: string;
  state_prov: string;
  country: string;
}

export default function TeamCard({ teamNumber }: TeamCardProps) {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [colors, setColors] = useState<{ primary: string; secondary: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamNumber) {
      setColors(null);
      setError(null);
      return;
    }

    const fetchColors = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.frc-colors.com/v1/team/${teamNumber}`);
        if (!response.ok) throw new Error('Team not found');
        const data = await response.json();
        setColors({
          primary: data.primaryHex || '#CCCCCC',
          secondary: data.secondaryHex || '#777777',
        });
      } catch (e) {
        setColors(null);
        setError('Failed to load team');
      } finally {
        setLoading(false);
      }
    };

    const fetchTeamName = async () => {
      try {
        const response = await fetch(`https://www.thebluealliance.com/api/v3/team/frc${teamNumber}`, {
          headers: {
            'X-TBA-Auth-Key': TBA_API_KEY || '',
          },
        });
        const data = await response.json();
        setTeamData({
          name: data.nickname || 'Team Not Found',
          state_prov: data.state_prov || 'Unknown',
          country: data.country || 'Unknown',
          rookie_year: data.rookie_year || 'Unknown',
        });
      } catch (e) {
        setTeamData(null);
      }
    };
    fetchColors();
    fetchTeamName();
  }, [teamNumber]);

  if (loading) return <ActivityIndicator size="large" color="#000" />;
  if (error) return <Text className="text-red-600 mb-4 text-center">{error}</Text>;
  if (!colors || !teamData) return null;

  return (
    <View className="bg-white rounded-2xl p-6 m-4 shadow-lg w-80 h-[425px]" style={{ backgroundColor: colors.primary, borderColor: colors.secondary, borderWidth: 8 }}>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold flex-1 mr-2" style={{color: colors.secondary}}>
          {teamData.name}
        </Text>
        <View className="bg-yellow-400 px-3 py-1 rounded-full">
          <Text className="text-sm font-bold text-black">#{teamNumber}</Text>
        </View>
      </View>
      
      <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <Image
          source={{uri: `https://www.thebluealliance.com/avatar/2025/frc${teamNumber}.png`}}
          className="w-40 h-40 self-center"
          resizeMode="contain"
        />
      </View>
      
      <View className="bg-opacity-10 rounded-xl p-4 mb-4">
        <Text className="text-lg font-bold mb-2" style={{color: colors.secondary}}>Team Stats</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-base font-semibold" style={{color: colors.secondary}}>Power Level:</Text>
          <Text className="text-base font-bold" style={{color: colors.secondary}}>{teamNumber}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-base font-semibold" style={{color: colors.secondary}}>Rookie Year:</Text>
          <Text className="text-base font-bold" style={{color: colors.secondary}}>{teamData.rookie_year}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-base font-semibold" style={{color: colors.secondary}}>Region:</Text>
          <Text className="text-base font-bold" style={{color: colors.secondary}}>{teamData.state_prov}, {teamData.country}</Text>
        </View>
      </View>
    </View>
  );
}

import React, { useState, useEffect } from 'react';
import { TextInput, View, Text, ActivityIndicator, Image} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import './global.css';

export default function TeamColorPicker() {
  const [teamNumber, setTeamNumber] = useState('');
  const [teamData, setTeamData] = useState<{name: string; rookie_year: string; state_prov: string; country: string} | null>(null);
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
      if (!teamNumber) return;
      try {
        const response = await fetch(`https://www.thebluealliance.com/api/v3/team/frc${teamNumber}`, {
          headers: {
            'X-TBA-Auth-Key': 'qD5i1uCJrDJbIq8JIrNedoWHXADnXjY23XxlmGAzSh2n5sv9mNGwh9N2L5weJgwO',
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

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <View className="w-full items-center">
        <Text className="text-lg font-semibold mb-4 text-center">Enter FRC Team Number:</Text>
        <TextInput
          className="border border-gray-400 rounded px-4 py-2 w-full mb-6 text-center"
          keyboardType="numeric"
          placeholder="FRC Team Number"
          value={teamNumber}
          onChangeText={setTeamNumber}
        />

        {loading && <ActivityIndicator size="large" color="#000" />}

        {error && <Text className="text-red-600 mb-4 text-center">{error}</Text>}

        {colors && (
          
          <View className="bg-white rounded-2xl p-4 m-4 shadow-md w-72 h-96" style={{ backgroundColor: colors.primary, borderColor: colors.secondary, borderWidth: 8 }}>
            <View className="flex-row justify-between items-center mb-2">
                <Text 
                className="text-base font-bold flex-1 mr-2" 
                style={{color: colors.secondary}}
                >
                {teamData?.name}
              </Text>
              <Text 
                className="text-sm font-semibold" 
                style={{color: colors.secondary}}
              >
                Team {teamNumber}
              </Text>
            </View>
            <Image
              source={{uri: `https://www.thebluealliance.com/avatar/2025/frc${teamNumber}.png`}}
              className="w-32 h-32 self-center mb-3"
              resizeMode="contain"
            />
            <Text className="text-base text-gray-700" style={{color: colors.secondary}}>HP: {teamNumber}</Text>
            <Text className="text-base text-gray-700" style={{color: colors.secondary}}>Rookie Year: {teamData?.rookie_year}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

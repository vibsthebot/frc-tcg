import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import './../global.css';
import { TBA_API_KEY } from '@env';


interface TeamCardProps {
  teamNumber: string;
  width?: number;
}

interface TeamData {
  name: string;
  rookie_year: string;
  state_prov: string;
  country: string;
}

export default function TeamCard({ teamNumber, width = 320 }: TeamCardProps) {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [colors, setColors] = useState<{ primary: string; secondary: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const scale = width / 320;
  const height = 425 * scale;
  const imageSize = 160 * scale;
  const padding = 24 * scale;
  const margin = 16 * scale;

  useEffect(() => {
    setImageError(false);

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
          secondary: data.secondaryHex || '#FFFFFF',
        });
      } catch (e) {
        setColors({primary: '#CCCCCC', secondary: '#777777'});
        console.log('Error fetching team colors:', e);
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
    <View 
      className="bg-white rounded-2xl shadow-lg" 
      style={{ 
        backgroundColor: colors.primary, 
        borderColor: colors.secondary, 
        borderWidth: 7 * scale,
        width: width,
        height: height,
        padding: padding,
        margin: margin
      }}
    >
      <View className="flex-row justify-between items-center" style={{ marginBottom: 16 * scale }}>
        <Text 
          className="font-bold flex-1" 
          style={{
            color: colors.secondary,
            fontSize: teamData.name.length > 20 ? 14 * scale : teamData.name.length > 15 ? 16 * scale : 18 * scale,
            marginRight: 8 * scale
          }}
          numberOfLines={2}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.6}
        >
          {teamData.name}
        </Text>
        <View 
          className="bg-yellow-400 rounded-full"
          style={{
            paddingHorizontal: 12 * scale,
            paddingVertical: 4 * scale
          }}
        >
          <Text 
            className="font-bold text-black"
            style={{ fontSize: 14 * scale }}
          >
            #{teamNumber}
          </Text>
        </View>
      </View>
      
      <View 
        className="bg-white rounded-xl shadow-sm"
        style={{
          padding: 16 * scale,
          marginBottom: 16 * scale
        }}
      >
        <Image
          source={{
            uri: imageError 
              ? 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/FIRST_Logo.svg/1200px-FIRST_Logo.svg.png'
              : `https://www.thebluealliance.com/avatar/2025/frc${teamNumber}.png`
          }}
          style={{
            width: imageSize,
            height: imageSize,
            alignSelf: 'center'
          }}
          resizeMode="contain"
          onError={() => {setImageError(true); 
                          console.log('Image load error for team', teamNumber);
                        }}
        />
      </View>
      
      <View 
        className="bg-opacity-10 rounded-xl"
        style={{
          padding: 16 * scale,
          marginBottom: 40 * scale
        }}
      >
        <Text 
          className="font-bold"
          style={{
            color: colors.secondary,
            fontSize: 18 * scale,
            marginBottom: 8 * scale
          }}
        >
          Team Stats:
        </Text>
        <View className="flex-row justify-between" style={{ marginBottom: 8 * scale }}>
          <Text 
            className="font-semibold"
            style={{
              color: colors.secondary,
              fontSize: 16 * scale
            }}
          >
            Awards x num awards
          </Text>
          <Text 
            className="font-bold"
            style={{
              color: colors.secondary,
              fontSize: 16 * scale
            }}
          >
            {teamNumber}
          </Text>
        </View>
        <View className="flex-row justify-between" style={{ marginBottom: 8 * scale }}>
          <Text 
            className="font-semibold"
            style={{
              color: colors.secondary,
              fontSize: 16 * scale
            }}
          >
            Rookie Year:
          </Text>
          <Text 
            className="font-bold"
            style={{
              color: colors.secondary,
              fontSize: 16 * scale
            }}
          >
            {teamData.rookie_year}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text 
            className="font-semibold"
            style={{
              color: colors.secondary,
              fontSize: 16 * scale
            }}
          >
            Region:
          </Text>
          <Text 
            className="font-bold"
            style={{
              color: colors.secondary,
              fontSize: 16 * scale
            }}
          >
            {teamData.state_prov}, {teamData.country}
          </Text>
        </View>
      </View>
    </View>
  );
}

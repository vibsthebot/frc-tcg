import { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, Image, Animated } from 'react-native';
import './../global.css';
import { TBA_API_KEY } from '@env';
import { Ionicons } from '@expo/vector-icons';
import { useGlobal } from 'GlobalContext';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';




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
  const [imgUrl, setImgUrl] = useState('');
  const [isHallOfFame, setIsHallOfFame] = useState(false);
  const {hallOfFame} = useGlobal();
  const translateX = useRef(new Animated.Value(-1)).current;

  const scale = width / 320;
  const height = 425 * scale;
  const imageSize = 160 * scale;
  const padding = 24 * scale;
  const margin = 16 * scale;

  useEffect(() => {
    const loop = () => {
          translateX.setValue(-1);
          Animated.timing(translateX, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }).start(() => loop());
        };
    
    
    setImgUrl(`https://www.thebluealliance.com/avatar/2025/frc${teamNumber}.png`);


    if (!teamNumber) {
      setColors(null);
      setError(null);
      return;
    }

    setIsHallOfFame(hallOfFame.includes(parseInt(teamNumber)));
    

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
    loop();
  }, [teamNumber]);

  const shimmerTranslate = translateX.interpolate({
    inputRange: [-1, 1],
    outputRange: [-0.6 * width, 2 * width],
  });

  if (loading) return <ActivityIndicator size="large" color="#000" />;
  if (error) return <Text className="text-red-600 mb-4 text-center">{error}</Text>;
  if (!colors || !teamData) return null;

  return (
    <View>
    <View 
      className="bg-white shadow-lg" 
      style={{ 
      backgroundColor: colors.primary, 
      borderColor: colors.secondary, 
      borderWidth: 8 * scale,
      width: width,
      height: height,
      padding: padding,
      margin: margin,
      borderRadius: 24 * scale,
      shadowColor: isHallOfFame ? '#f9e2af' : '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: isHallOfFame ? 0 : 0,
      shadowRadius: isHallOfFame ? 40 : 0,
      elevation: isHallOfFame ? 100 : 15,
      overflow: 'hidden',
      zIndex: 0,
      }}
    >
      {isHallOfFame && (<Animated.View
              style={[
              StyleSheet.absoluteFillObject,
              { 
                transform: [{ translateX: shimmerTranslate }, { rotate: '45deg' }],
                zIndex: 8
              },
              ]}
            >
              <LinearGradient
              colors={['rgba(255,215,0,0.4)', 'rgba(255,215,0,0.15)', 'rgba(255,215,0,0.4)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: 30, height: '200%'}}
              />
          </Animated.View>)}

      {isHallOfFame && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 215, 0, 0.5)',
            zIndex: 6,
          }}
        />
      )}
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
        marginBottom: 16 * scale,
        zIndex: 0,
      }}
      >
        <Image
          source={{
          uri: imgUrl
          }}
          style={{
          width: imageSize,
          height: imageSize,
          alignSelf: 'center',
          }}
          resizeMode="contain"
          onError={() => {
          setImgUrl('https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/FIRST_Logo.svg/1200px-FIRST_Logo.svg.png');
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
        <Ionicons name="trophy-outline" size={20 * scale} color={colors.secondary} /> 
        <Text 
        className="font-bold"
        style={{
          color: colors.secondary,
          fontSize: 16 * scale
        }}
        >
        x {teamNumber}
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
    </View>
  );
}

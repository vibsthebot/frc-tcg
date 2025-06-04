import { useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';
import TeamCard from '../../components/Card';
import './../../global.css';

export default function Card() {
    const { teamNumber } = useLocalSearchParams();
    
    return (
        <ScrollView 
            className='flex-1 bg-catppuccin-mantle'
            contentContainerStyle={{ 
                padding: 24,
                alignItems: 'center',
                minHeight: '100%',
                justifyContent: 'center',
                gap: 24
            }}
        >
            <View className='bg-catppuccin-surface0 rounded-2xl shadow-lg p-8 mb-6 border border-catppuccin-surface1 w-full max-w-sm'>
                <Text className='text-3xl font-bold text-center mb-3 text-catppuccin-text tracking-tight'>
                    Team {teamNumber}
                </Text>
                <Text className='text-center text-lg text-catppuccin-subtext1 font-medium'>
                    FRC Trading Card
                </Text>
                <View className='w-16 h-1 bg-catppuccin-blue rounded-full mx-auto mt-4'></View>
            </View>
            
            {teamNumber && (
                <View className='items-center'>
                    <TeamCard 
                        teamNumber={teamNumber as string} 
                        width={320}
                    />
                </View>
            )}
            
            
        </ScrollView>
    );
}
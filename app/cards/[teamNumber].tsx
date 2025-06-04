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
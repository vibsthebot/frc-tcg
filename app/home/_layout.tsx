import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
    const { colorScheme } = useColorScheme();
    
    return (
        <Tabs
            
            screenOptions={{
                tabBarActiveTintColor: colorScheme === 'dark' ? '#ffffff' : '#007AFF',
                headerShown: false, 
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="cards"
                options={{
                    title: 'Cards',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'albums' : 'albums-outline'} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="decks"
                options={{
                    title: 'Decks',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'layers' : 'layers-outline'} size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

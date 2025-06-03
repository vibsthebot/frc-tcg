import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
    const { colorScheme } = useColorScheme();
    
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#8caaee',
                tabBarInactiveTintColor: '#a5adce',
                tabBarStyle: {
                    backgroundColor: '#292c3c',
                    borderTopColor: '#414559',
                    borderTopWidth: 1,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
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

import { Tabs, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { useGlobal } from "GlobalContext";

export default function RootLayout() {
    const { colorScheme } = useColorScheme();
    const router = useRouter();
    const { user } = useGlobal();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!user) {
                console.log("User not found, redirecting to login");
                router.replace('/');
            }
            setIsChecking(false);
        }, 100);

        return () => clearTimeout(timer);
    }, [user, router]);

    if (isChecking || !user) {
        return null;
    }

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
            <Tabs.Screen
                name="shop"
                options={{
                    title: 'Shop',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'bag' : 'bag-outline'} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'cog' : 'cog-outline'} size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

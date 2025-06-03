import { Stack } from 'expo-router';
import { GlobalProvider } from './../GlobalContext';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <GlobalProvider>
      <View className = "flex-1 bg-catppuccin-rosewater">
        <Stack screenOptions={{
            headerShown: false,
          }}
  />
      </View>
    </GlobalProvider>
  );
}

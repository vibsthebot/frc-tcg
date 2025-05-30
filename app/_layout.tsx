import { Stack } from 'expo-router';
import { GlobalProvider } from './../GlobalContext';

export default function RootLayout() {
  return (
    <GlobalProvider>
      <Stack screenOptions={{
          headerShown: false,  // <-- hide header on all screens
        }}
/>
    </GlobalProvider>
  );
}

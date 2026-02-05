import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from './src/stores/authStore';
import { setupNotifications } from './src/services/notificationService';
import RootNavigator from './src/navigation/RootNavigator';
import { theme } from './src/theme';

export default function App() {
  const { isAuthenticated, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
    setupNotifications();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <RootNavigator isAuthenticated={isAuthenticated} />
          <Toast />
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

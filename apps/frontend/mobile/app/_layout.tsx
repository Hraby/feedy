import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ShoppingCartProvider } from '@/context/CartShoppingContext';
import { DriverProvider } from '@/context/DriverContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ShoppingCartProvider>
        <DriverProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Slot />
          </GestureHandlerRootView>
        </DriverProvider>
      </ShoppingCartProvider>
    </AuthProvider>
  );
}
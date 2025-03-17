import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet } from 'react-native';
import { useDriver } from '@/context/DriverContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { activeOrder } = useDriver();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF5500',
        tabBarInactiveTintColor: '#000000',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: { display: 'none' },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Příjem objednávek',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'mail' : 'mail-outline'} color={color} size={28} />
          ),
        }}
      />
      {activeOrder ? (
        <Tabs.Screen
          name="driverdelivery"
          options={{
            title: 'Aktivní doručení',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'bicycle' : 'bicycle-outline'} color={color} size={28} />
            ),
          }}
        />
      ) : (
        <Tabs.Screen
          name="driverdelivery"
          options={{
            title: 'Aktivní doručení',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'bicycle' : 'bicycle-outline'} color={color} size={28} />
            ),
            href: null,
          }}
        />
      )}
      <Tabs.Screen
        name="usermenu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'menu' : 'menu-outline'} color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="personalinfo"
        options={{
          title: 'PI',
          href: null,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 60,
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    paddingBottom: 10,
    paddingTop: 10,
    paddingHorizontal: 20,
    marginHorizontal: '5%',
  },
});
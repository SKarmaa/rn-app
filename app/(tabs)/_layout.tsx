import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// TabName types (Handling TypeScript error)
type TabName = 'Profile' | 'Transaction' | 'History';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  // State to track active tab
  const [activeTab, setActiveTab] = useState<TabName>('Profile'); 

  // Set TabName
  const handleTabPress = (tabName: TabName) => {
    setActiveTab(tabName);
  };

  return (
    <View className="flex-1">
      <View className="h-[10%] bg-[#009afe] justify-center items-center border-b border-[#ccc]">
        <Text className="text-xl font-bold text-white mb-[-8%]">{activeTab}</Text>
      </View>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
            ),
          }}
          listeners={{
            tabPress: () => handleTabPress('Profile'), // Set active tab on press
          }}
        />
        <Tabs.Screen
          name="TransactionForm"
          options={{
            title: 'Transaction',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'card' : 'card-outline'} color={color} />
            ),
          }}
          listeners={{
            tabPress: () => handleTabPress('Transaction'), // Set active tab on press
          }}
        />
        <Tabs.Screen
          name="TransactionList"
          options={{
            title: 'History',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'receipt' : 'receipt-outline'} color={color} />
            ),
          }}
          listeners={{
            tabPress: () => handleTabPress('History'), // Set active tab on press
          }}
        />
      </Tabs>
    </View>
  );
}


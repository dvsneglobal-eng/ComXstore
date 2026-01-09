
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Home, Grid, MessageSquare, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#0f172a',
      tabBarInactiveTintColor: '#cbd5e1',
      tabBarStyle: {
        height: 90,
        paddingTop: 10,
        paddingBottom: 30,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        backgroundColor: '#ffffff',
      },
      tabBarLabelStyle: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
      },
      headerShown: false,
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Catalog',
          tabBarIcon: ({ color }) => <Grid color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: 'AI Help',
          tabBarIcon: ({ color }) => <MessageSquare color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
